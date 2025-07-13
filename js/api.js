const productContainer = document.getElementById("product-list"); // контейнер в HTML

let allProducts = [];

const API_URL = "https://6873d073c75558e273555679.mockapi.io/colors";

fetch(API_URL)
  .then(response => response.json())
  .then(response => {
    allProducts = [...response];
    renderProducts(allProducts);
  });

function renderProducts(products) {
  productContainer.innerHTML = "";
  products.forEach(product => {
    console.log(product);

    const card = document.createElement("article");
    card.classList.add("main-content__item");

    const cardImage = document.createElement("img");
    cardImage.classList.add("product-image");
    cardImage.src = product.image;
    cardImage.alt = product.name;

    const cardName = document.createElement("h3");
    cardName.textContent = product.name;
    cardName.classList.add("product-name");

    const cardPrice = document.createElement("p");
    cardPrice.textContent = `$${product.price}`;
    cardPrice.classList.add("product-price");

    card.appendChild(cardImage);
    card.appendChild(cardName);
    card.appendChild(cardPrice);

    productContainer.appendChild(card);
  });
}
