const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.header__list');
const overlay = document.querySelector('.header__overlay');

burger.addEventListener('click', () => {
  burger.classList.toggle('_open-burger');
  menu.classList.toggle('_open-burger');
  overlay.classList.toggle('_open-burger');
  document.body.classList.toggle('_lock'); 
});