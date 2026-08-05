export function initInterestCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const pause = carousel.querySelector("[data-carousel-pause]");
  const current = carousel.querySelector("[data-current]");
  const viewport = carousel.querySelector(".interest-carousel__viewport");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let isPaused = reduceMotion;
  let timer;

  const updatePauseButton = () => {
    const icon = pause?.querySelector("i");
    if (!pause || !icon) return;
    icon.classList.toggle("bi-pause-fill", !isPaused);
    icon.classList.toggle("bi-play-fill", isPaused);
    pause.setAttribute("aria-label", isPaused ? "Start carousel" : "Pause carousel");
    pause.title = isPaused ? "Start carousel" : "Pause carousel";
    viewport?.setAttribute("aria-live", isPaused ? "polite" : "off");
  };

  const schedule = () => {
    window.clearInterval(timer);
    if (!isPaused) timer = window.setInterval(() => show(activeIndex + 1), 5500);
  };

  const show = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== activeIndex;
    });
    if (current) current.textContent = String(activeIndex + 1).padStart(2, "0");
    schedule();
  };

  previous?.addEventListener("click", () => show(activeIndex - 1));
  next?.addEventListener("click", () => show(activeIndex + 1));
  pause?.addEventListener("click", () => {
    isPaused = !isPaused;
    updatePauseButton();
    schedule();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(activeIndex - 1);
    if (event.key === "ArrowRight") show(activeIndex + 1);
  });
  carousel.addEventListener("mouseenter", () => window.clearInterval(timer));
  carousel.addEventListener("mouseleave", schedule);
  carousel.addEventListener("focusin", () => window.clearInterval(timer));
  carousel.addEventListener("focusout", schedule);

  updatePauseButton();
  show(0);
}
