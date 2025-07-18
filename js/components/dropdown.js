import { handleSortChange } from "./product.js";
import { showOverlay, hideOverlay } from "./overlay.js";

export const initDropdowns = () => {
  const dropDownWrapper = document.querySelector(".dropdown");
  const dropDownBtn = dropDownWrapper.querySelector(".dropdown-items__btn");
  const dropDownList = dropDownWrapper.querySelector(".dropdown-items__list");
  const dropDownListItems = dropDownList.querySelectorAll(
    ".dropdown-items__item"
  );

  const filterBtn = document.querySelector(".main-content__title");
  const filterWrapper = document.querySelector(".main-content__filter-wrapper");

  const closeDropdowns = () => {
    dropDownList.classList.remove("dropdown-items__list--visible");
    dropDownBtn.classList.remove("dropdown-items__btn--active");
    filterWrapper.classList.remove("main-content__filter-wrapper--visible");

    if (
      !document
        .getElementById("cartModal")
        .classList.contains("modal-cart--visible")
    ) {
      hideOverlay();
    }
  };

  dropDownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    filterWrapper.classList.remove("main-content__filter-wrapper--visible");

    dropDownList.classList.toggle("dropdown-items__list--visible");
    this.classList.toggle("dropdown-items__btn--active");

    if (dropDownList.classList.contains("dropdown-items__list--visible")) {
      showOverlay();
    } else {
      closeDropdowns();
    }
  });

  filterBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropDownList.classList.remove("dropdown-items__list--visible");
    dropDownBtn.classList.remove("dropdown-items__btn--active");

    filterWrapper.classList.toggle("main-content__filter-wrapper--visible");

    if (
      filterWrapper.classList.contains("main-content__filter-wrapper--visible")
    ) {
      showOverlay();
    } else {
      closeDropdowns();
    }
  });

  window.overlay.addEventListener("click", function () {
    const cartModal = document.getElementById("cartModal");

    if (cartModal.classList.contains("modal-cart--visible")) {
      closeCart();
    } else {
      closeDropdowns();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const cartModal = document.getElementById("cartModal");

      if (cartModal.classList.contains("modal-cart--visible")) {
        closeCart();
      } else {
        closeDropdowns();
      }
    }
  });

  dropDownListItems.forEach(listItem => {
    listItem.addEventListener("click", function (e) {
      e.stopPropagation();
      dropDownBtn.innerText = this.innerText;
      closeDropdowns();

      const sortValue = this.getAttribute("data-value");
      if (sortValue) handleSortChange(sortValue);
    });
  });
};
