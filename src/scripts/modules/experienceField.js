export function initExperienceField() {
  const canvas = document.getElementById("experienceField");
  const toggle = document.querySelector("[data-motion-toggle]");
  if (!canvas || !toggle) return;

  const context = canvas.getContext("2d");
  const host = canvas.parentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pointer = { x: 0, y: 0, active: false };
  let nodes = [];
  let frame;
  let paused = reduceMotion;
  let width = 0;
  let height = 0;

  const makeNodes = () => {
    const count = width < 520 ? 11 : 24;
    nodes = Array.from({ length: count }, (_, index) => ({
      x: ((index * 83) % 97) / 97 * width,
      y: ((index * 47 + 19) % 89) / 89 * height,
      vx: (index % 2 ? 1 : -1) * (0.08 + (index % 5) * 0.018),
      vy: (index % 3 ? -1 : 1) * (0.06 + (index % 4) * 0.016),
      accent: index % 7 === 0
    }));
  };

  const resize = () => {
    window.cancelAnimationFrame(frame);
    const rect = host.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    makeNodes();
    draw();
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    nodes.forEach((node, index) => {
      if (!paused) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }

      nodes.slice(index + 1).forEach((other) => {
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance > 145) return;
        context.strokeStyle = `rgba(85, 242, 138, ${0.12 * (1 - distance / 145)})`;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      });

      if (pointer.active) {
        const pointerDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
        if (pointerDistance < 180) {
          context.strokeStyle = `rgba(169, 183, 255, ${0.32 * (1 - pointerDistance / 180)})`;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      }

      context.fillStyle = node.accent ? "#ff7a59" : "#55f28a";
      context.fillRect(node.x - 1.5, node.y - 1.5, 3, 3);
    });

    if (!paused) frame = window.requestAnimationFrame(draw);
  };

  const updateToggle = () => {
    const icon = toggle.querySelector("i");
    icon?.classList.toggle("bi-pause-fill", !paused);
    icon?.classList.toggle("bi-play-fill", paused);
    toggle.setAttribute("aria-label", paused ? "Start background motion" : "Pause background motion");
    toggle.title = paused ? "Start background motion" : "Pause background motion";
  };

  const setPaused = (nextPaused) => {
    paused = nextPaused;
    window.cancelAnimationFrame(frame);
    updateToggle();
    draw();
  };

  host.addEventListener("pointermove", (event) => {
    const rect = host.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });
  host.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  toggle.addEventListener("click", () => setPaused(!paused));

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(host);
  } else {
    resize();
    window.addEventListener("resize", resize);
  }
  updateToggle();
}
