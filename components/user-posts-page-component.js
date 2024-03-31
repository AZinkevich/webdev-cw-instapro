import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderUserPostsPageComponent({ appEl, selectUser }) {
  // TODO: реализовать рендер постов из api
  console.log("Список постов юзера:", selectUser);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const filteredPosts = posts.filter((post) => {
    return post.user.id === selectUser;
  });

  const appHtml = filteredPosts
    .map((post, index) => {
      return ` <li class="post">
    <div class="post-image-container">
      <img
        class="post-image"
        src="${post.imageUrl}"
      />
    </div>
    <div class="post-likes">
      <button data-post-id="${post.id}" class="like-button">
        <img src="./assets/images/like-active.svg" />
      </button>
      <p class="post-likes-text">Нравится: <strong>2</strong></p>
    </div>
    <p class="post-text">
      <span class="user-name">${post.user.name}</span>
      ${post.description}
    </p>
    <p class="post-date">19 минут назад</p>
  </li>
    `;
    })
    .join("");

  appEl.innerHTML = `<div class="page-container">
                <div class="header-container"></div>
                <div class="posts-user-header">
                <img
                  src="${filteredPosts[0].user.imageUrl}"
                  class="posts-user-header__user-image"
                />
                <p class="posts-user-header__user-name">${filteredPosts[0].user.name}</p>
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
}
