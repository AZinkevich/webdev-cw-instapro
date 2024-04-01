// import { postLike } from "../api.js";
// import { getToken } from "../index.js";

// export const initLikeButtonListener = ({post, getToken}) => {
//   if (!getToken) {
//     alert("Нужная авторизация");
//     return;
//   }
//   // console.log("initLikeButtonListener")
//   const likeButtonElements = document.querySelectorAll(".like-button");
//   likeButtonElements.forEach((el) => {
//     el.addEventListener("click", () => {
//       postLike()
//         .then(() => {
//           post.isLiked = !post.isLiked;

//         })
//     });
//   });
// };
