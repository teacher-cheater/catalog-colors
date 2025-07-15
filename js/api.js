const productContainer = document.getElementById("product-list");
const sortDropdown = document.querySelector(".dropdown-items__list");

let cart = [];
let allProducts = [];
const API_URL = "https://6873d073c75558e273555679.mockapi.io/colors";

window.overlay = document.getElementById("overlay");

function showOverlay() {
  window.overlay.classList.add("overlay--visible");
  document.body.classList.add("no-scroll");
}

function hideOverlay() {
  window.overlay.classList.remove("overlay--visible");
  document.body.classList.remove("no-scroll");
}

function closeAllModals() {
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
}

function init() {
  loadCartFromStorage();
  fetchProducts();
  initDropdowns();
  initCart();
  initFilters();
}

function fetchProducts() {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(products => {
      allProducts = [...products];
      renderProducts(allProducts);
      updateProductsCount(allProducts.length);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      productContainer.innerHTML =
        '<p class="error">Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>';
    });
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const cardImage = document.createElement("img");
  cardImage.classList.add("product-card__image");
  cardImage.src = product.image || "placeholder.jpg";
  cardImage.alt = product.name || "Товар";
  cardImage.loading = "lazy";

  const cardInfo = document.createElement("div");
  cardInfo.classList.add("product-card__info");

  const cardName = document.createElement("h3");
  cardName.textContent = product.name || "Без названия";
  cardName.classList.add("product-card__name");

  const cardContent = document.createElement("div");
  cardContent.classList.add("product-card__content");

  const cardPrice = document.createElement("p");
  cardPrice.textContent = `${product.price || 0}₽`;
  cardPrice.classList.add("product-card__price");

  const addButton = document.createElement("button");
  addButton.classList.add("product-card__add-to-cart");
  addButton.textContent = "";
  addButton.addEventListener("click", () => addToCart(product));

  cardContent.appendChild(cardPrice);
  cardContent.appendChild(addButton);

  cardInfo.appendChild(cardName);
  cardInfo.appendChild(cardContent);

  card.appendChild(cardImage);
  card.appendChild(cardInfo);

  return card;
}

function renderProducts(products) {
  productContainer.innerHTML = "";

  if (!products || products.length === 0) {
    productContainer.innerHTML = '<p class="no-products">Товары не найдены</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach(product => {
    const card = createProductCard(product);
    fragment.appendChild(card);
  });
  productContainer.appendChild(fragment);
}

function updateProductsCount(count) {
  const countElement = document.querySelector(".main-content__count-items");
  if (countElement) {
    countElement.textContent = `${count} ${getProperWordForm(count)}`;
  }
}

function getProperWordForm(count) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "товаров";
  }

  if (lastDigit === 1) {
    return "товар";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "товара";
  }

  return "товаров";
}

function initFilters() {
  const filterInputs = document.querySelectorAll(".main-content__filter-input");

  filterInputs.forEach(input => {
    input.addEventListener("change", e => {
      const filterType = e.target.id;
      filterProducts(filterType);
    });
  });
}

function filterProducts(filterType) {
  let filteredProducts = [...allProducts];
  const now = new Date();

  switch (filterType) {
    case "new-product":
      // Новинки - товары добавленные за последние 3 месяца
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      filteredProducts = filteredProducts.filter(
        product => product.createdAt > threeMonthsAgo
      );
      break;

    case "in-stock":
      // Все товары "в наличии" (в данных нет информации о наличии)
      filteredProducts = filteredProducts; // Показываем все
      break;

    case "contract":
      // Контрактные - товары с ценой выше среднего
      const averagePrice =
        allProducts.reduce((sum, product) => sum + product.price, 0) /
        allProducts.length;
      filteredProducts = filteredProducts.filter(
        product => product.price > averagePrice
      );
      break;

    case "exclusive":
      // Эксклюзивные - товары с популярностью выше 85
      filteredProducts = filteredProducts.filter(
        product => product.popularity > 85
      );
      break;

    case "sale":
      // Распродажа - товары добавленные более 6 месяцев назад
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      filteredProducts = filteredProducts
        .filter(product => product.createdAt < sixMonthsAgo)
        .map(product => ({
          ...product,
          originalPrice: product.price,
          price: Math.round(product.price * 0.7), // 30% скидка
        }));
      break;

    default:
      break;
  }

  renderProducts(filteredProducts);
  updateProductsCount(filteredProducts.length);
}

function initCart() {
  const cartBtn = document.getElementById("cartBtn");
  cartBtn.addEventListener("click", toggleCart);

  const cartCloseBtn = document.querySelector(".modal-cart__close-btn");
  cartCloseBtn.addEventListener("click", closeCart);
}

function toggleCart() {
  const cartModal = document.getElementById("cartModal");
  const isCartVisible = !cartModal.classList.contains("modal-cart--visible");

  closeAllModals();

  if (!isCartVisible) {
    return;
  }
  cartModal.classList.add("modal-cart--visible");
  showOverlay();
  renderCartItems();
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("modal-cart--visible");
  hideOverlay();
}

function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cart");
  cart = savedCart ? JSON.parse(savedCart) : [];
  updateCartCounter();
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCartToStorage();
  updateCartCounter();

  const cartModal = document.querySelector(".modal-cart");
  if (cartModal.classList.contains("modal-cart--visible")) {
    renderCartItems();
  }
}

function updateCartCounter() {
  const counter = document.getElementById("cartCount");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (counter) {
    counter.textContent = totalItems;
  }
}

function handleSortChange(sortType) {
  let sortedProducts = [...allProducts];

  switch (sortType) {
    case "expensive":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case "cheap":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "popular":
      sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    case "new":
      sortedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      break;
    default:
      break;
  }

  renderProducts(sortedProducts);
  updateProductsCount(sortedProducts.length);
}

function initDropdowns() {
  const dropDownWrapper = document.querySelector(".dropdown");
  const dropDownBtn = dropDownWrapper.querySelector(".dropdown-items__btn");
  const dropDownList = dropDownWrapper.querySelector(".dropdown-items__list");
  const dropDownListItems = dropDownList.querySelectorAll(
    ".dropdown-items__item"
  );

  const filterBtn = document.querySelector(".main-content__title");
  const filterWrapper = document.querySelector(".main-content__filter-wrapper");

  function closeDropdowns() {
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
  }

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
}

function renderCartItems() {
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
}

function addCartItemEventListeners() {
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
}

function increaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (!item) {
    return;
  }
  item.quantity += 1;
  saveCartToStorage();
  updateCartCounter();
  renderCartItems();
}

function decreaseQuantity(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex === -1) {
    return;
  }
  if (cart[itemIndex].quantity > 1) {
    cart[itemIndex].quantity--;
  } else {
    cart.splice(itemIndex, 1);
  }
  saveCartToStorage();
  updateCartCounter();
  renderCartItems();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartCounter();
  renderCartItems();
}

function clearCart() {
  cart = [];
  saveCartToStorage();
  updateCartCounter();
  renderCartItems();
}

document.addEventListener("DOMContentLoaded", init);
