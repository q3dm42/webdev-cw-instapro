import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user, page } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { sanitize } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${posts
          .map(
            (post) => `
            <li class="post">
              <div class="post-header" data-user-id="${post.user.id}">
                <img src="${
                  post.user.imageUrl
                }" class="post-header__user-image">
                <p class="post-header__user-name">${sanitize(
                  post.user.name
                )}</p>
              </div>
              <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}">
              </div>
              <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                  <img src="./assets/images/${
                    post.isLiked ? "like-active" : "like-not-active"
                  }.svg">
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${post.likes.length}</strong>
                </p>
              </div>
              <p class="post-text">
                <span class="user-name">${sanitize(post.user.name)}</span>
                ${sanitize(post.description)}
              </p>
              <p class="post-date">
                ${post.createdAt
                  .replace("T", " ")
                  .slice(0, 16)
                  .replace(/-/g, ".")}
              </p>
            </li>
          `
          )
          .join("")}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // Переход к постам пользователя
  document.querySelectorAll(".post-header").forEach((userEl) => {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  });

  // Лайки
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!user) {
        alert("Только авторизованные пользователи могут ставить лайки");
        return;
      }
      const postId = button.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      const likeAction = post.isLiked ? dislikePost : likePost;
      likeAction({ postId, token: `Bearer ${user.token}` }).then(() => {
        // Обновить посты после лайка
        if (page === USER_POSTS_PAGE) {
          goToPage(USER_POSTS_PAGE, { userId: post.user.id });
        } else {
          goToPage(POSTS_PAGE);
        }
      });
    });
  });
}
