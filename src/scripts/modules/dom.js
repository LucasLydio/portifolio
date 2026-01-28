/**
 * Small DOM helpers to keep code clean and consistent.
 */

export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function on(el, event, handler, options) {
  if (!el) return;
  el.addEventListener(event, handler, options);
}

export function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") el.className = String(v);
    else if (k.startsWith("data-")) el.setAttribute(k, String(v));
    else if (k === "text") el.textContent = String(v);
    else el.setAttribute(k, String(v));
  }

  for (const child of children) {
    if (child == null) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }

  return el;
}
