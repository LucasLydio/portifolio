export function initProjectOverlay() {
  const overlay = document.getElementById("imageOverlay");
  const image = document.getElementById("overlayImg");
  const closeButton = overlay?.querySelector(".close-overlay");
  const triggers = document.querySelectorAll("[data-overlay-src]");
  let activeTrigger;

  if (!overlay || !image || !triggers.length) return;

  const close = () => {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    image.removeAttribute("src");
    image.alt = "";
    document.body.style.overflow = "";
    activeTrigger?.focus();
    activeTrigger = undefined;
  };

  const open = (src, alt, trigger) => {
    activeTrigger = trigger;
    image.src = src;
    image.alt = alt;
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton?.focus();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      open(trigger.dataset.overlaySrc, trigger.dataset.overlayAlt || "Project screenshot", trigger);
    });
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  closeButton?.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("active")) {
      close();
    }
  });
}
