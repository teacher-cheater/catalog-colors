export const showOverlay = () => {
  window.overlay.classList.add("overlay--visible");
  document.body.classList.add("no-scroll");
};

export const hideOverlay = () => {
  window.overlay.classList.remove("overlay--visible");
  document.body.classList.remove("no-scroll");
};

export const initOverlay = () => {
  window.overlay = document.getElementById("overlay");
};