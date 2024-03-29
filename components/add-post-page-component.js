import { uploadImage } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста

    const appHtml = `<div class="page-container">
    <div class="header-container"></div>
      <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container">
            <div class="upload=image">
            <label class="file-upload-label secondary-button">
              <input
                type="file" id="img-file"
                class="file-upload-input"
                style="display: none"
              />
              Выберите фото
            </label>
          </div>
            </div>
            <label>
              Опишите фотографию:
              <textarea class="input textarea" id="img-descr" rows="4"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
        </div>
  `;

    appEl.innerHTML = appHtml;

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: document.getElementById("img-descr").value,
        imageUrl: "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1711686540791-1711547873392-20141231_222054.jpg",
      });
    });

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
  };

  render();
}
