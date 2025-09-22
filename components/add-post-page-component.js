import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea id="description-input" class="input" placeholder="Описание поста"></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newUrl) {
        imageUrl = newUrl;
      },
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document
        .getElementById("description-input")
        .value.trim();
      const errorEl = appEl.querySelector(".form-error");
      errorEl.textContent = "";
      if (!description) {
        errorEl.textContent = "Введите описание";
        return;
      }
      if (description.length < 3) {
        errorEl.textContent = "Описание должно быть не короче 3 символов";
        return;
      }
      if (!imageUrl) {
        errorEl.textContent = "Загрузите изображение";
        return;
      }
      onAddPostClick({
        description,
        imageUrl,
      });
    });
  };

  render();
}
