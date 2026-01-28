const KEY = "portfolio:theme";

/**
 * For now we only store the preference.
 * Later you can add a real dark theme by toggling a class on <html>.
 */
export function getTheme() {
  return localStorage.getItem(KEY) || "light";
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme) {
  // Class hook for future: html[data-theme="dark"]
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * Safe init. Doesn't break if localStorage is blocked.
 */
export function initTheme(defaultTheme = "light") {
  try {
    const t = getTheme() || defaultTheme;
    applyTheme(t);
  } catch {
    applyTheme(defaultTheme);
  }
}
