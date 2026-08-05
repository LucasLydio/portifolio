export function initCopyEmail() {
  const button = document.querySelector("[data-copy-email]");
  const status = document.querySelector("[data-copy-status]");
  if (!button || !status) return;

  let statusTimer;
  const announce = (message) => {
    status.textContent = message;
    status.classList.add("is-visible");
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => status.classList.remove("is-visible"), 2400);
  };

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      announce("Email copied to clipboard");
    } catch {
      announce("Copy unavailable. Select the email address instead.");
    }
  });
}
