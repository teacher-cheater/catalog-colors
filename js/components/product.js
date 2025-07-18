import { getAllProducts } from '../api/api.js';
import { addToCart } from './cart.js';
import { getProperWordForm } from '../utils/helpers.js';

const productContainer = document.getElementById("product-list");

export const renderProducts = (products) => {
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
};

export const updateProductsCount = (count) => {
  const countElement = document.querySelector(".main-content__count-items");
  if (countElement) {
    countElement.textContent = `${count} ${getProperWordForm(count)}`;
  }
};

const createProductCard = (product) => {
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
};

export const filterProducts = (filterType) => {
  let filteredProducts = [...getAllProducts()];
  const now = new Date();

  switch (filterType) {
    case "new-product":
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      filteredProducts = filteredProducts.filter(
        product => new Date(product.createdAt) > threeMonthsAgo
      );
      break;

    case "in-stock":
      filteredProducts = filteredProducts;
      break;

    case "contract":
      const averagePrice =
        filteredProducts.reduce((sum, product) => sum + product.price, 0) /
        filteredProducts.length;
      filteredProducts = filteredProducts.filter(
        product => product.price > averagePrice
      );
      break;

    case "exclusive":
      filteredProducts = filteredProducts.filter(
        product => product.popularity > 85
      );
      break;

    case "sale":
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      filteredProducts = filteredProducts
        .filter(product => new Date(product.createdAt) < sixMonthsAgo)
        .map(product => ({
          ...product,
          originalPrice: product.price,
          price: Math.round(product.price * 0.7),
        }));
      break;

    default:
      break;
  }

  renderProducts(filteredProducts);
  updateProductsCount(filteredProducts.length);
};

export const handleSortChange = (sortType) => {
  let sortedProducts = [...getAllProducts()];

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
};