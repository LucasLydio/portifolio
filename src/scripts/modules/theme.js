const KEY = "portfolio:theme";

export function getTheme(fallback = "dark") {
  return localStorage.getItem(KEY) || fallback;
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function initTheme(defaultTheme = "dark") {
  try {
    const t = getTheme(defaultTheme);
    applyTheme(t);
  } catch {
    applyTheme(defaultTheme);
  }
}
