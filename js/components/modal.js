import { hideOverlay } from "./overlay.js";

export const closeAllModals = () => {
  document.querySelector(".modal-cart").classList.remove("modal-cart--visible");
  document
    .querySelector(".dropdown-items__list")
    .classList.remove("dropdown-items__list--visible");
  document
    .querySelector(".dropdown-items__btn")
    .classList.remove("dropdown-items__btn--active");
  document
    .querySelector(".main-content__filter-wrapper")
    .classList.remove("main-content__filter-wrapper--visible");

  hideOverlay();
};
