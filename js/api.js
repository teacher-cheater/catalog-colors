const productContainer = document.getElementById("product-list");
const sortOption = document.getElementById("sort-option");

let allProducts = [];
const API_URL = "https://6873d073c75558e273555679.mockapi.io/colors";

function init() {
  fetchProducts();
  setupEventListeners();
}

function fetchProducts() {
  fetch(API_URL)
    .then(response => response.json())
    .then(products => {
      allProducts = [...products];
      renderProducts(allProducts);
      updateProductsCount(allProducts.length);
    })
    .catch(error => console.error("Error fetching products:", error));
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const cardImage = document.createElement("img");
  cardImage.classList.add("product-card__image");
  cardImage.src = product.image;
  cardImage.alt = product.name;
  cardImage.loading = "lazy";

  const cardInfo = document.createElement("div");
  cardInfo.classList.add("product-card__info");

  const cardName = document.createElement("h3");
  cardName.textContent = product.name;
  cardName.classList.add("product-card__name");

  const cardContent = document.createElement("div");
  cardContent.classList.add("product-card__content");

  const cardPrice = document.createElement("p");
  cardPrice.textContent = `${product.price}₽`;
  cardPrice.classList.add("product-card__price");

  const addButton = document.createElement("button");
  addButton.classList.add("product-card__add-to-cart");
  addButton.addEventListener("click", () => console.log(product));

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
    countElement.textContent = `${count} товаров`;
  }
}

function addToCart(product) {
  console.log("Added to cart:", product);
}

function sortProducts(sortType) {
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
}

function setupEventListeners() {
  sortOption.addEventListener("change", e => {
    sortProducts(e.target.value);
  });
}

document.addEventListener("DOMContentLoaded", init);
