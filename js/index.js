import { initOverlay, showOverlay, hideOverlay } from "./components/overlay.js";
import { fetchProducts } from "../js/api/api.js";
import { initDropdowns } from "../js/components/dropdown.js";
import { initCart } from "../js/components/cart.js";
import { initFilters } from "../js/components/filters.js";
import { closeAllModals } from "../js/components/modal.js";
import { initSwiper } from "../js/components/swiper.js";
import { initBurgerMenu } from "../js/components/burger.js";

function init() {
  initOverlay();
  fetchProducts();
  initDropdowns();
  initCart();
  initFilters();
  initSwiper();
  initBurgerMenu();
}

document.addEventListener("DOMContentLoaded", init);

export { showOverlay, hideOverlay, closeAllModals };
