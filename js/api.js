const productContainer = document.getElementById("product-list");
const sortDropdown = document.querySelector(".dropdown-items__list");

let allProducts = [];
const API_URL = "https://6873d073c75558e273555679.mockapi.io/colors";

function init() {
  fetchProducts();
  initDropdowns();
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

function addToCart(product) {
  console.log("Added to cart:", product);
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
      // добавить поле popularity
      sortedProducts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      break;
    case "new":
      // добавить поле createdAt
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
  const overlay = document.querySelector(".dropdown-items__overlay");

  dropDownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    dropDownList.classList.toggle("dropdown-items__list--visible");
    this.classList.toggle("dropdown-items__btn--active");
    overlay.classList.toggle("dropdown-items__overlay--visible");
  });

  overlay.addEventListener("click", function () {
    dropDownList.classList.remove("dropdown-items__list--visible");
    dropDownBtn.classList.remove("dropdown-items__btn--active");
    this.classList.remove("dropdown-items__overlay--visible");
  });

  dropDownListItems.forEach(listItem => {
    listItem.addEventListener("click", function (e) {
      e.stopPropagation();
      dropDownBtn.innerText = this.innerText;
      dropDownBtn.classList.remove("dropdown-items__btn--active");
      dropDownList.classList.remove("dropdown-items__list--visible");
      overlay.classList.remove("dropdown-items__overlay--visible");

      const sortValue = this.getAttribute("data-value");
      if (sortValue) handleSortChange(sortValue);
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".dropdown")) {
      dropDownList.classList.remove("dropdown-items__list--visible");
      dropDownBtn.classList.remove("dropdown-items__btn--active");
      overlay.classList.remove("dropdown-items__overlay--visible");
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Tab" || e.key === "Escape") {
      dropDownList.classList.remove("dropdown-items__list--visible");
      dropDownBtn.classList.remove("dropdown-items__btn--active");
      overlay.classList.remove("dropdown-items__overlay--visible");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
