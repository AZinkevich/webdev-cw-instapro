import { POSTS_PAGE, USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, page, getToken, currentUser, setPosts, renderApp } from "../index.js";
import { initLikeButton, userLogin } from "./posts-page-component.js";
import { sanitize } from "./sanitize-component.js";
import { deletePost, getUserPosts } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale/ru";

export function renderUserPostsPageComponent({ appEl, currentUser }) {
  // TODO: реализовать рендер постов из api
  console.log("Список постов юзера:", currentUser);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  // const filteredPosts = posts.filter((post) => {
  //post.user.id === currentUser;
  // });

  const appHtml = posts
    .map((post, index) => {
      return ` <li class="post">
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
                <div class="posts-user-header">
                ${posts.length ? `<img src=${posts[0].user.imageUrl} class="posts-user-header__user-image" />` : ""}
                <p class="posts-user-header__user-name">${posts.length ? posts[0].user.name : ""}</p>
              </div>
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
      //console.log(el.dataset.index, posts[index].id, currentUser);
      deletePost({postId: posts[index].id})
      .then(() => {
        if (page === POSTS_PAGE) {
          getPosts({ token: getToken() }).then((res) => {
            setPosts(res);
            renderApp();
          });
        } else {
          getUserPosts({ token: getToken(), id: currentUser }).then((res) => {
            console.log(currentUser);
            setPosts(res);
            renderApp();
          });
        }
    });
  });
})}