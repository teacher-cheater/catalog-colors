import { saveToStorage, loadFromStorage } from "../utils/storage.js";
import { getProperWordForm } from "../utils/helpers.js";
import { showOverlay, hideOverlay } from "./overlay.js";
import { closeAllModals } from "./modal.js";

let cart = [];

export const initCart = () => {
  cart = loadFromStorage("cart") || [];
  updateCartCounter();

  const cartBtn = document.getElementById("cartBtn");
  cartBtn.addEventListener("click", toggleCart);

  const cartCloseBtn = document.querySelector(".modal-cart__close-btn");
  cartCloseBtn.addEventListener("click", closeCart);
};

export const addToCart = product => {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveToStorage("cart", cart);
  updateCartCounter();

  const cartModal = document.querySelector(".modal-cart");
  if (cartModal.classList.contains("modal-cart--visible")) {
    renderCartItems();
  }
};

const toggleCart = () => {
  const cartModal = document.getElementById("cartModal");
  const isCartVisible = !cartModal.classList.contains("modal-cart--visible");

  closeAllModals();

  if (!isCartVisible) return;

  cartModal.classList.add("modal-cart--visible");
  showOverlay();
  renderCartItems();
};

const closeCart = () => {
  document.getElementById("cartModal").classList.remove("modal-cart--visible");
  hideOverlay();
};

const updateCartCounter = () => {
  const counter = document.getElementById("cartCount");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (counter) {
    counter.textContent = totalItems;
  }
};

export const renderCartItems = () => {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");
  const cartCountOrderElement = document.querySelector(
    ".modal-cart__count-order"
  );

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    cartTotalElement.textContent = "0 ₽";
    cartCountOrderElement.textContent = "0 товаров";
    return;
  }

  const fragment = document.createDocumentFragment();
  let totalPrice = 0;
  let totalItems = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.quantity;
    totalItems += item.quantity;

    const cartItemElement = document.createElement("article");
    cartItemElement.classList.add("cart-item");
    cartItemElement.innerHTML = `
      <div class="cart-item__image">
        <img src="${item.image || "placeholder.jpg"}" alt="${item.name}">
      </div>
      <div class="cart-item__info">
        <h4 class="cart-item__name">${item.name}</h4>
        <p class="cart-item__price">${item.price} ₽</p>
      </div>
      <div class="cart-item__controls">
        <button class="cart-item__decrease" data-id="${item.id}"></button>
        <span class="cart-item__quantity">${item.quantity}</span>
        <button class="cart-item__increase" data-id="${item.id}"> </button>
      </div>
      <button class="cart-item__remove" data-id="${item.id}"></button>
    `;
    fragment.appendChild(cartItemElement);
  });

  cartItemsContainer.appendChild(fragment);
  cartTotalElement.textContent = `${totalPrice} ₽`;
  cartCountOrderElement.textContent = `${totalItems} ${getProperWordForm(
    totalItems
  )}`;

  addCartItemEventListeners();
};

const addCartItemEventListeners = () => {
  document.querySelectorAll(".cart-item__increase").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.getAttribute("data-id");
      increaseQuantity(id);
    });
  });

  document.querySelectorAll(".cart-item__decrease").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.getAttribute("data-id");
      decreaseQuantity(id);
    });
  });

  document.querySelectorAll(".cart-item__remove").forEach(button => {
    button.addEventListener("click", e => {
      const id = e.target.getAttribute("data-id");
      removeFromCart(id);
    });
  });

  const cleanCartBtn = document.querySelector(".modal-cart__clean-list");
  if (cleanCartBtn) {
    cleanCartBtn.addEventListener("click", clearCart);
  }
};

const increaseQuantity = productId => {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += 1;
  saveToStorage("cart", cart);
  updateCartCounter();
  renderCartItems();
};

const decreaseQuantity = productId => {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) return;

  if (cart[itemIndex].quantity > 1) {
    cart[itemIndex].quantity--;
  } else {
    cart.splice(itemIndex, 1);
  }
  saveToStorage("cart", cart);
  updateCartCounter();
  renderCartItems();
};

const removeFromCart = productId => {
  cart = cart.filter(item => item.id !== productId);
  saveToStorage("cart", cart);
  updateCartCounter();
  renderCartItems();
};

const clearCart = () => {
  cart = [];
  saveToStorage("cart", cart);
  updateCartCounter();
  renderCartItems();
};
