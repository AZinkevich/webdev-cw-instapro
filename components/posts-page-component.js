import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import {
  posts,
  goToPage,
  getToken,
  setPosts,
  renderApp,
  page,
  currentUser,
  user,
} from "../index.js";
import { deletePost, getPosts, getUserPosts, postsHost } from "../api.js";
import { sanitize } from "./sanitize-component.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale/ru";

export const userLogin = () => {
  if (!user) return;
  {
    return user.login;
  }
};

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const appHtml = posts
    .map((post, index) => {
      return ` <li class="post">
    <div class="post-header" data-user-id="${post.user.id}">
      <img
        src="${post.user.imageUrl}"
        class="post-header__user-image"
      />
      <p class="post-header__user-name">${sanitize(post.user.name)}</p>
    </div>
    <div class="post-image-container">
      <img
        class="post-image"
        src="${post.imageUrl}"
      />
    </div>
    <div class="post-likes">
      <button data-post-id="${
        post.id
      }" class="like-button" data-index="${index}" data-is-liked="${
        post.isLiked
      }">
        ${
          post.isLiked
            ? '<img src="./assets/images/like-active.svg">'
            : '<img src="./assets/images/like-not-active.svg">'
        }
      </button>
      <p class="post-likes-text">Нравится: <strong>${
        post.likes.length === 0
          ? "0"
          : `${post.likes[post.likes.length - 1].name} ${
              post.likes.length === 1 ? "" : `и еще ${post.likes.length - 1}`
            }`
      } </strong></p>
      <p class = "delete-button" data-index = "${index}">${
        post.user.login === userLogin() ? "Удалить пост" : ""
      }</p>
    </div>
    <p class="post-text">
      <span class="user-name">${sanitize(post.user.name)}</span>
      ${sanitize(post.description)}
    </p>
    <p class="post-date">${formatDistanceToNow(new Date(post.createdAt), {
      locale: ru,
      addSuffix: true,
    })}</p>
  </li>
    `;
    })
    .join("");

  appEl.innerHTML = `<div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">${appHtml}</ul></div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  initLikeButton();
  initDeleteButton();
}

export function initDeleteButton() {
  if (!user) return;
  const deleteButtonElts = document.querySelectorAll(".delete-button");
  deleteButtonElts.forEach((el) => {
    el.addEventListener("click", () => {
      const index = el.dataset.index;
      deletePost({postId: posts[index].id})
      .then(() => {
        if (page === POSTS_PAGE) {
          getPosts({ token: getToken() }).then((res) => {
            setPosts(res);
            renderApp();
          });
        } else {
          getUserPosts({ token: getToken(), id: currentUser }).then((res) => {
            setPosts(res);
            renderApp();
          });
        }
    });
  });
})}

export function initLikeButton() {
  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      const index = likeEl.dataset.index;
      return fetch(
        postsHost +
          "/" +
          likeEl.dataset.postId +
          (posts[index].isLiked ? "/dislike" : "/like"),
        {
          method: "POST",
          headers: {
            Authorization: getToken(),
            body: JSON.stringify({
              id: likeEl.dataset.postId,
            }),
          },
        }
      )
        .then((response) => {
          if (response.status === 401) {
            alert("Чтобы поставить лайк, авторизуйтесь");
            throw new Error("Нет авторизации");
          }
          return response.json();
        })
        .then(() => {
          if (page === POSTS_PAGE) {
            getPosts({ token: getToken() }).then((res) => {
              setPosts(res);
              renderApp();
            });
          } else {
            getUserPosts({ token: getToken(), id: currentUser }).then((res) => {
              setPosts(res);
              renderApp();
            });
          }
        })
        .catch((error) => {
          if (error.message === "Нет авторизации") {
            console.warn(error);
            return;
          }
          return;
        });
    });
  }
}
