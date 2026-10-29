import diaryImg from "./xuanyi-meng-diary.jpg";

export default {
  student: "Xuanyi Meng",
  title: "Dear diary",
  frame: false,
  width: 300,
  height: 326,
  mount(root) {
    const style = document.createElement("style");
    style.textContent = `
      .container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #080312;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
      }
      .diary-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        pointer-events: none;
        transition: filter 150ms ease-out;
      }
      .container.is-flashing .diary-image {
        filter: brightness(1.75) contrast(1.15) drop-shadow(0 0 24px #c866ff);
      }
      .flash-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at var(--click-x, 50%) var(--click-y, 50%), rgba(255, 255, 255, 0.95) 0%, rgba(220, 150, 255, 0.7) 40%, rgba(130, 40, 220, 0.3) 70%, transparent 100%);
        pointer-events: none;
        opacity: 0;
        mix-blend-mode: screen;
      }
      .flash-overlay.active {
        animation: flash-fade 450ms cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
      }
      @keyframes flash-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      .shockwave {
        position: absolute;
        left: var(--click-x, 50%);
        top: var(--click-y, 50%);
        width: 10px;
        height: 10px;
        margin-left: -5px;
        margin-top: -5px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 0 16px 6px rgba(215, 120, 255, 0.85), inset 0 0 10px rgba(255, 255, 255, 0.8);
        pointer-events: none;
        animation: shockwave-expand 500ms cubic-bezier(0.15, 0.85, 0.35, 1) forwards;
      }
      @keyframes shockwave-expand {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(30);
          opacity: 0;
        }
      }
      .sparkle {
        position: absolute;
        left: var(--start-x);
        top: var(--start-y);
        pointer-events: none;
        will-change: transform, opacity;
        animation: sparkle-burst var(--duration, 600ms) cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes sparkle-burst {
        0% {
          transform: translate(-50%, -50%) translate(0, 0) scale(0) rotate(0deg);
          opacity: 1;
        }
        30% {
          opacity: 1;
          transform: translate(-50%, -50%) translate(calc(var(--dx) * 0.4), calc(var(--dy) * 0.4)) scale(var(--scale, 1.2)) rotate(calc(var(--rot) * 0.3));
        }
        100% {
          transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0) rotate(var(--rot));
          opacity: 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .sparkle, .shockwave {
          display: none;
        }
        .flash-overlay.active {
          animation-duration: 200ms;
        }
      }
    `;

    const container = document.createElement("div");
    container.className = "container";
    container.setAttribute("data-no-drag", "");
    container.setAttribute("role", "button");
    container.setAttribute("tabindex", "0");
    container.setAttribute("aria-label", "Dear diary, click for flash effect");

    const img = document.createElement("img");
    img.className = "diary-image";
    img.src = diaryImg;
    img.alt = "dear diary what the fuck";
    img.draggable = false;

    const flashOverlay = document.createElement("div");
    flashOverlay.className = "flash-overlay";

    container.append(img, flashOverlay);
    root.append(style, container);

    const starSvg = (color, size) => `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="display:block;filter:drop-shadow(0 0 4px ${color});">
        <path d="M12 0L14.2 8.8L23 12L14.2 15.2L12 24L9.8 15.2L1 12L9.8 8.8L12 0Z" fill="${color}"/>
      </svg>
    `;

    const triggerFlash = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const clickX = clientX !== undefined ? clientX - rect.left : rect.width / 2;
      const clickY = clientY !== undefined ? clientY - rect.top : rect.height / 2;

      container.style.setProperty("--click-x", `${clickX}px`);
      container.style.setProperty("--click-y", `${clickY}px`);

      // Trigger image brightness jump
      container.classList.remove("is-flashing");
      void container.offsetWidth;
      container.classList.add("is-flashing");
      setTimeout(() => container.classList.remove("is-flashing"), 300);

      // Trigger overlay flash
      flashOverlay.classList.remove("active");
      void flashOverlay.offsetWidth;
      flashOverlay.classList.add("active");

      // Spawn shockwave ring
      const shockwave = document.createElement("div");
      shockwave.className = "shockwave";
      container.appendChild(shockwave);
      shockwave.addEventListener("animationend", () => shockwave.remove());

      // Spawn sparkles
      const colors = ["#ffffff", "#ffe6ff", "#f0a6ff", "#d966ff", "#ffd166", "#c4e0ff"];
      const particleCount = 18;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.4;
        const distance = 40 + Math.random() * 80;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.floor(10 + Math.random() * 14);
        const duration = Math.floor(500 + Math.random() * 300);
        const rot = Math.floor((Math.random() - 0.5) * 360) + "deg";
        const scale = (0.8 + Math.random() * 0.8).toFixed(2);

        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.setProperty("--start-x", `${clickX}px`);
        sparkle.style.setProperty("--start-y", `${clickY}px`);
        sparkle.style.setProperty("--dx", `${dx.toFixed(1)}px`);
        sparkle.style.setProperty("--dy", `${dy.toFixed(1)}px`);
        sparkle.style.setProperty("--duration", `${duration}ms`);
        sparkle.style.setProperty("--rot", rot);
        sparkle.style.setProperty("--scale", scale);

        if (Math.random() > 0.3) {
          sparkle.innerHTML = starSvg(color, size);
        } else {
          // Circular orb sparkle
          const dot = document.createElement("div");
          dot.style.width = `${size * 0.6}px`;
          dot.style.height = `${size * 0.6}px`;
          dot.style.borderRadius = "50%";
          dot.style.background = color;
          dot.style.boxShadow = `0 0 8px ${color}, 0 0 14px #ffffff`;
          sparkle.appendChild(dot);
        }

        container.appendChild(sparkle);
        sparkle.addEventListener("animationend", () => sparkle.remove());
      }
    };

    container.addEventListener("click", (event) => {
      triggerFlash(event.clientX, event.clientY);
    });

    container.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        triggerFlash();
      }
    });
  },
};
