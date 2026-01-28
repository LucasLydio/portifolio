import { initTheme, getTheme, setTheme } from "./modules/theme.js";

function setToggleIcon(btn, theme) {
  const icon = btn?.querySelector("i");
  if (!icon) return;

  // bootstrap-icons
  icon.classList.toggle("bi-moon-stars", theme !== "dark");
  icon.classList.toggle("bi-sun", theme === "dark");
}

function initThemeToggles() {
  const desktopBtn = document.getElementById("themeToggle");
  const mobileBtn = document.getElementById("themeToggleMobile");

  const applyIcons = () => {
    const t = getTheme();
    setToggleIcon(desktopBtn, t);
    setToggleIcon(mobileBtn, t);
  };

  const toggle = () => {
    const next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
    applyIcons();
  };

  desktopBtn?.addEventListener("click", toggle);
  mobileBtn?.addEventListener("click", toggle);

  applyIcons();
}

function initMobileMenu() {
  const btn = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  const icon = btn.querySelector("i");

  const close = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Abrir menu");
    icon?.classList.remove("bi-x");
    icon?.classList.add("bi-list");
  };

  const open = () => {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-label", "Fechar menu");
    icon?.classList.remove("bi-list");
    icon?.classList.add("bi-x");
  };

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  // Close menu when clicking a link
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Close on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 860) close();
  });
}

function init() {
  initTheme("light");
  initThemeToggles();
  initMobileMenu();
}

document.addEventListener("DOMContentLoaded", init);
