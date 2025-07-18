import { filterProducts } from './product.js';

export const initFilters = () => {
  const filterInputs = document.querySelectorAll(".main-content__filter-input");

  filterInputs.forEach(input => {
    input.addEventListener("change", e => {
      const filterType = e.target.id;
      filterProducts(filterType);
    });
  });
};