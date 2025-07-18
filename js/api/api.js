import { API_URL } from "../constants.js";
import { renderProducts, updateProductsCount } from "../components/product.js";

let allProducts = [];

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    allProducts = [...products];
    renderProducts(allProducts);
    updateProductsCount(allProducts.length);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML =
      '<p class="error">Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>';
    throw error;
  }
};

export const getAllProducts = () => allProducts;
