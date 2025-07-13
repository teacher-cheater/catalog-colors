document.addEventListener("DOMContentLoaded", () => {
  if (!window.matchMedia("(min-width: 1200px)").matches) {
    return;
  }

  document.querySelectorAll(".swiper-slide").forEach(slide => {
    const bg = slide.getAttribute("data-bg");
    if (bg) {
      slide.style.setProperty("--slide-bg", bg);
    }
  });

  const swiper = new Swiper(".swiper", {
    loop: true,
    autoplay: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init() {
        updateSlideBackground(this);
      },
      slideChange() {
        updateSlideBackground(this);
      },
    },
  });

  function updateSlideBackground(swiperInstance) {
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    const bg = activeSlide.getAttribute("data-bg");
    if (!bg) {
      return;
    }
    activeSlide.style.backgroundImage = bg;
    activeSlide.style.backgroundSize = "cover";
    activeSlide.style.backgroundPosition = "center";
    activeSlide.style.backgroundRepeat = "no-repeat";
  }
});
