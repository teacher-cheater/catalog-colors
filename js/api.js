const productContainer = document.getElementById("product-list");

let allProducts = [];
const API_URL = "https://6873d073c75558e273555679.mockapi.io/colors";

function init() {
  fetchProducts();
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

document.addEventListener("DOMContentLoaded", init);
