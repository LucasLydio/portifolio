import { initTheme, getTheme, setTheme } from "./modules/theme.js";
import { initProjectOverlay } from "./modules/projectOverlay.js";
import { initRevealAnimations } from "./modules/reveal.js";
import { initInterestCarousel } from "./modules/interestCarousel.js";
import { initExperienceField } from "./modules/experienceField.js";
import { initCopyEmail } from "./modules/copyEmail.js";

function setToggleIcon(button, theme) {
  const icon = button?.querySelector("i");
  if (!icon) return;

  icon.classList.toggle("bi-moon-stars", theme === "light");
  icon.classList.toggle("bi-sun", theme === "dark");
}

function initThemeToggles() {
  const buttons = [
    document.getElementById("themeToggle"),
    document.getElementById("themeToggleMobile")
  ].filter(Boolean);

  const sync = () => buttons.forEach((button) => setToggleIcon(button, getTheme("dark")));
  const toggle = () => {
    setTheme(getTheme("dark") === "dark" ? "light" : "dark");
    sync();
  };

  buttons.forEach((button) => button.addEventListener("click", toggle));
  sync();
}

function initMobileMenu() {
  const button = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");
  if (!button || !menu) return;

  const icon = button.querySelector("i");
  const setOpen = (isOpen) => {
    menu.hidden = !isOpen;
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    icon?.classList.toggle("bi-list", !isOpen);
    icon?.classList.toggle("bi-x-lg", isOpen);
  };

  button.addEventListener("click", () => setOpen(button.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 880) setOpen(false);
  });
}

function init() {
  initTheme("dark");
  initThemeToggles();
  initMobileMenu();
  initProjectOverlay();
  initRevealAnimations();
  initInterestCarousel();
  initExperienceField();
  initCopyEmail();
}

document.addEventListener("DOMContentLoaded", init);
