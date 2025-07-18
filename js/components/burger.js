import { showOverlay, hideOverlay } from "./overlay.js";

export const initBurgerMenu = () => {
  const burgerBtn = document.querySelector(".header__burger");
  const navMenu = document.querySelector(".header__list");
  const header = document.querySelector(".header");

  const burgerOverlay = document.createElement("div");
  burgerOverlay.className = "header__overlay";
  document.body.appendChild(burgerOverlay);

  let isMenuOpen = false;

  const openMenu = () => {
    burgerBtn.classList.add("_open-burger");
    navMenu.classList.add("_open-burger");
    burgerOverlay.classList.add("_open-burger");
    document.body.classList.add("no-scroll");
    isMenuOpen = true;
    showOverlay();
  };

  const closeMenu = () => {
    burgerBtn.classList.remove("_open-burger");
    navMenu.classList.remove("_open-burger");
    burgerOverlay.classList.remove("_open-burger");
    document.body.classList.remove("no-scroll");
    isMenuOpen = false;
    hideOverlay();
  };

  const toggleMenu = () => {
    isMenuOpen ? closeMenu() : openMenu();
  };

  burgerBtn.addEventListener("click", e => {
    e.stopPropagation();
    toggleMenu();
  });

  burgerOverlay.addEventListener("click", closeMenu);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  });

  document.addEventListener("click", e => {
    if (
      isMenuOpen &&
      !navMenu.contains(e.target) &&
      !burgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });
};
