import bagImage from "./haribo-pack.webp";

const PHRASES = [
  "Das Original\nseit 1922",
  "Haribo macht\nKinder froh ...",
  "... und Erwachsene\nebenso! 🎉",
  "Zum Teilen! 🍬",
  "Goldbären\nPower! 🐻",
  "Super lecker! 😋",
];

const GUMMY_PRESETS = [
  // Red (Strawberry / Raspberry)
  { name: "red", grad1: "#ff596f", fill: "#d8172c", grad2: "#7a0510", stroke: "#590008" },
  // Green (Apple / Strawberry in Germany)
  { name: "green", grad1: "#66f276", fill: "#21b83a", grad2: "#0d661b", stroke: "#074a12" },
  // Yellow (Lemon)
  { name: "yellow", grad1: "#fff673", fill: "#fed500", grad2: "#b38600", stroke: "#8a6600" },
  // Orange (Orange)
  { name: "orange", grad1: "#ffa859", fill: "#ff700f", grad2: "#a83800", stroke: "#7a2800" },
  // Clear / White (Pineapple)
  { name: "white", grad1: "#ffffff", fill: "#eaf0eb", grad2: "#a8bbb0", stroke: "#788c80" },
];

let audioCtx = null;
const playPopSound = (frequency = 420) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.6, audioCtx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch {
    // Ignore audio permission or playback errors
  }
};

// Render a single gummy bear onto a cached off-screen canvas for high performance
const createBearCanvas = (color) => {
  const c = document.createElement("canvas");
  c.width = 36;
  c.height = 48;
  const ctx = c.getContext("2d");

  ctx.save();
  ctx.translate(18, 24);

  // Main jelly radial gradient
  const grad = ctx.createRadialGradient(-3, -5, 2, 0, 0, 18);
  grad.addColorStop(0, color.grad1);
  grad.addColorStop(0.5, color.fill);
  grad.addColorStop(1, color.grad2);

  ctx.fillStyle = grad;
  ctx.strokeStyle = color.stroke;
  ctx.lineWidth = 1;
  ctx.lineJoin = "round";

  // Bear silhouette path
  ctx.beginPath();
  // Ears
  ctx.arc(-8, -14, 4.6, 0, Math.PI * 2);
  ctx.arc(8, -14, 4.6, 0, Math.PI * 2);
  // Head
  ctx.arc(0, -7.5, 9.6, 0, Math.PI * 2);
  // Body & Belly
  ctx.ellipse(0, 5.5, 9.8, 12.8, 0, 0, Math.PI * 2);
  // Arms
  ctx.ellipse(-10.5, 0, 4.2, 6.2, -0.4, 0, Math.PI * 2);
  ctx.ellipse(10.5, 0, 4.2, 6.2, 0.4, 0, Math.PI * 2);
  // Feet
  ctx.ellipse(-7, 16.5, 5.2, 4.2, 0, 0, Math.PI * 2);
  ctx.ellipse(7, 16.5, 5.2, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Snout bump
  ctx.beginPath();
  ctx.ellipse(0, -6.5, 4.5, 3.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  ctx.fill();

  // Specular glossy highlights
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 1.4;
  ctx.lineCap = "round";

  // Ear glint
  ctx.beginPath();
  ctx.arc(-8, -14, 2.8, Math.PI * 1.1, Math.PI * 1.7);
  ctx.stroke();

  // Forehead glint
  ctx.beginPath();
  ctx.arc(0, -9.5, 5.5, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();

  // Belly shine curve
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 1.8;
  ctx.arc(-2.5, 5.5, 6.8, Math.PI * 0.8, Math.PI * 1.4);
  ctx.stroke();

  ctx.restore();
  return c;
};

export default {
  student: "Letian Tian",
  title: "Haribo Goldbären",
  frame: false,
  width: 280,
  height: 355,
  rotate: 2,
  mount(root) {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        user-select: none;
        touch-action: none;
      }
      .pack-container {
        position: relative;
        width: 100%;
        height: 100%;
        cursor: grab;
        filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.32));
        transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
        transform-origin: 50% 80%;
      }
      .pack-container:hover {
        transform: scale(1.02);
      }
      .pack-container.is-shaking {
        animation: shakePackage 550ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }

      /* Dark bag interior layer behind candies */
      .cavity-bg {
        position: absolute;
        top: 32%;
        left: 6.5%;
        width: 86%;
        height: 39%;
        background: radial-gradient(ellipse at 50% 50%, #11131a 0%, #06070a 100%);
        border-radius: 4px;
        z-index: 1;
      }

      /* Physics Canvas Layer */
      .candy-physics-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
      }

      /* Front Bag Frame Overlay with Transparent Window */
      .bag-frame-img {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
        z-index: 3;
      }

      /* Transparent Cellophane Sheen */
      .window-sheen {
        position: absolute;
        top: 32.5%;
        left: 6.5%;
        width: 60%;
        height: 38.5%;
        pointer-events: none;
        overflow: hidden;
        border-radius: 2px;
        z-index: 4;
        opacity: 0.5;
        mix-blend-mode: screen;
      }
      .sheen-beam {
        position: absolute;
        top: -50%;
        left: -120%;
        width: 80%;
        height: 200%;
        background: linear-gradient(115deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
        transform: rotate(20deg);
        transition: left 450ms ease;
      }
      .pack-container:hover .sheen-beam {
        left: 140%;
      }

      /* Interactive hotspot for Mascot Bear */
      .mascot-hotspot {
        position: absolute;
        top: 32%;
        right: 4%;
        width: 38%;
        height: 52%;
        cursor: pointer;
        z-index: 5;
        border-radius: 40px;
      }

      /* Mascot Speech Bubble */
      .dynamic-speech-bubble {
        position: absolute;
        top: 24%;
        right: 22%;
        transform: translate(0, -50%) scale(0);
        background: #ffffff;
        border: 2.2px solid #151740;
        border-radius: 18px;
        padding: 5px 9px;
        color: #151740;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 700;
        font-size: 11px;
        line-height: 1.25;
        text-align: center;
        white-space: pre-line;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
        pointer-events: none;
        z-index: 20;
        opacity: 0;
        transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease;
      }
      .dynamic-speech-bubble::after {
        content: "";
        position: absolute;
        bottom: -7px;
        right: 18px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 5px solid transparent;
        border-top: 8px solid #ffffff;
      }
      .dynamic-speech-bubble::before {
        content: "";
        position: absolute;
        bottom: -10px;
        right: 17px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid #151740;
      }
      .dynamic-speech-bubble.is-active {
        transform: translate(0, -50%) scale(1);
        opacity: 1;
      }

      /* Natural physical up-and-down shaking of the candy package */
      @keyframes shakePackage {
        0% { transform: translateY(0) rotate(0deg); }
        15% { transform: translateY(-16px) rotate(-2.5deg); }
        30% { transform: translateY(14px) rotate(2deg); }
        45% { transform: translateY(-10px) rotate(-1.5deg); }
        60% { transform: translateY(8px) rotate(1deg); }
        75% { transform: translateY(-4px) rotate(-0.5deg); }
        90% { transform: translateY(2px) rotate(0deg); }
        100% { transform: translateY(0) rotate(0deg); }
      }

      @media (prefers-reduced-motion: reduce) {
        .pack-container.is-shaking { animation: none; }
      }
    `;

    const container = document.createElement("div");
    container.className = "pack-container";
    container.setAttribute("role", "button");
    container.setAttribute("tabindex", "0");
    container.setAttribute(
      "aria-label",
      "Haribo Goldbären candy pack. Click and shake the package to watch the gummy bears tumble and move with physics, or click the Goldbear mascot!"
    );

    const cavity = document.createElement("div");
    cavity.className = "cavity-bg";

    const canvas = document.createElement("canvas");
    canvas.className = "candy-physics-canvas";
    canvas.width = 280;
    canvas.height = 355;

    const img = document.createElement("img");
    img.className = "bag-frame-img";
    img.src = bagImage;
    img.alt = "Haribo Goldbären candy pack";

    const sheen = document.createElement("div");
    sheen.className = "window-sheen";
    const beam = document.createElement("div");
    beam.className = "sheen-beam";
    sheen.appendChild(beam);

    const speechBubble = document.createElement("div");
    speechBubble.className = "dynamic-speech-bubble";
    speechBubble.textContent = PHRASES[0];

    const mascotHotspot = document.createElement("div");
    mascotHotspot.className = "mascot-hotspot";
    mascotHotspot.setAttribute("title", "Click the Goldbear mascot!");

    container.append(cavity, canvas, img, sheen, speechBubble, mascotHotspot);
    root.append(style, container);

    // ==========================================
    // 2D GUMMY BEAR PHYSICS ENGINE
    // ==========================================
    const ctx = canvas.getContext("2d");

    // Pre-cache bear canvas sprites for each flavor
    const bearSprites = GUMMY_PRESETS.map((p) => createBearCanvas(p));

    // Boundary limits in canvas pixels:
    const MIN_X = 22;
    const MIN_Y = 118;
    const MAX_Y = 251; // Floor line at bottom of window

    // Mascot boundary
    const getMascotBoundX = (y) => {
      if (y <= 138) return 152;
      if (y <= 165) return 160;
      if (y <= 210) return 192;
      return 202;
    };

    // Initialize 40 Gummy Bears resting at the bottom of the package
    const BEARS_COUNT = 40;
    const bears = [];

    const flavorWeights = [0, 0, 1, 1, 2, 2, 3, 3, 4]; // Red, Green, Yellow, Orange, White

    for (let i = 0; i < BEARS_COUNT; i++) {
      const spriteIdx = flavorWeights[i % flavorWeights.length];
      const col = i % 5;
      const row = Math.floor(i / 5);
      const startX = 32 + col * 28 + (Math.random() - 0.5) * 4;
      const startY = 244 - row * 16;

      bears.push({
        x: Math.min(startX, getMascotBoundX(startY) - 13),
        y: startY,
        vx: 0,
        vy: 0,
        rot: (Math.random() - 0.5) * 0.35, // Natural rested angle
        vRot: 0,
        radius: 12.5,
        sprite: bearSprites[spriteIdx],
        scale: 0.88 + (i % 4) * 0.04,
      });
    }

    const GRAVITY = 0.44;
    const DAMPING = 0.94;
    const BOUNCE = 0.36;

    // Simulation state
    let isPhysicsActive = false;
    let shakeStartTime = 0;
    const SHAKE_DURATION = 500; // ms
    let animId = null;

    const renderBears = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < bears.length; i++) {
        const b = bears[i];
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.scale(b.scale, b.scale);
        ctx.drawImage(b.sprite, -18, -24);
        ctx.restore();
      }
    };

    const stepPhysics = (isShakingNow, progress) => {
      let shakeForceY = 0;
      let shakeForceX = 0;

      if (isShakingNow) {
        // Natural up-and-down shaking acceleration inside the package
        const envelope = 1 - progress;
        shakeForceY = -Math.sin(progress * Math.PI * 4.5) * envelope * 8.5;
        shakeForceX = Math.cos(progress * Math.PI * 3.5) * envelope * 4.2;
      }

      // 1. Position & velocity update
      for (let i = 0; i < bears.length; i++) {
        const b = bears[i];

        b.vy += GRAVITY;

        if (isShakingNow) {
          b.vy += shakeForceY;
          b.vx += shakeForceX + (Math.random() - 0.5) * 1.5;
          b.vRot += (Math.random() - 0.5) * 0.08;
        }

        b.vx *= DAMPING;
        b.vy *= DAMPING;
        b.vRot *= 0.86; // Strong rotational damping: stops spinning quickly!

        b.x += b.vx;
        b.y += b.vy;
        b.rot += b.vRot;

        // Boundary: Floor (Resting at bottom of package)
        if (b.y + b.radius >= MAX_Y) {
          b.y = MAX_Y - b.radius;
          if (Math.abs(b.vy) < 1.0) {
            b.vy = 0;
            b.vx *= 0.7;
            b.vRot = 0; // Freeze rotation on contact with floor
          } else {
            b.vy = -Math.abs(b.vy) * BOUNCE;
            b.vx *= 0.8;
          }
        }

        // Boundary: Ceiling
        if (b.y - b.radius < MIN_Y) {
          b.y = MIN_Y + b.radius;
          b.vy = Math.abs(b.vy) * BOUNCE;
        }

        // Boundary: Left Wall
        if (b.x - b.radius < MIN_X) {
          b.x = MIN_X + b.radius;
          b.vx = Math.abs(b.vx) * BOUNCE;
        }

        // Boundary: Mascot Wall
        const maxX = getMascotBoundX(b.y) - b.radius;
        if (b.x > maxX) {
          b.x = maxX;
          b.vx = -Math.abs(b.vx) * BOUNCE;
        }
      }

      // 2. Candy-to-Candy Collisions (Multiple sub-steps for solid stacking)
      const SUB_STEPS = 4;
      for (let step = 0; step < SUB_STEPS; step++) {
        for (let i = 0; i < bears.length; i++) {
          const b1 = bears[i];
          for (let j = i + 1; j < bears.length; j++) {
            const b2 = bears[j];
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.hypot(dx, dy);
            const minDist = b1.radius + b2.radius;

            if (dist < minDist && dist > 0.0001) {
              const nx = dx / dist;
              const ny = dy / dist;
              const overlap = (minDist - dist) * 0.5;

              b1.x -= nx * overlap;
              b1.y -= ny * overlap;
              b2.x += nx * overlap;
              b2.y += ny * overlap;

              const kx = b1.vx - b2.vx;
              const ky = b1.vy - b2.vy;
              const relVel = nx * kx + ny * ky;

              if (relVel > 0) {
                const p = relVel * 0.65;
                b1.vx -= p * nx;
                b1.vy -= p * ny;
                b2.vx += p * nx;
                b2.vy += p * ny;
              }
            }
          }
        }
      }
    };

    // Pre-settle candies into a natural, stable resting pile on the bottom of the package
    for (let i = 0; i < 90; i++) {
      stepPhysics(false, 0);
    }
    // Lock all velocities and rotations to 0 on initial load
    bears.forEach((b) => {
      b.vx = 0;
      b.vy = 0;
      b.vRot = 0;
    });
    // Draw the still resting candies immediately
    renderBears();

    // Physics Animation Loop: only runs when clicked/shaken, then comes to complete rest!
    let totalKineticEnergy = 0;
    let stillFramesCount = 0;

    const runPhysicsLoop = () => {
      if (!isPhysicsActive) return;

      const now = performance.now();
      const shakeElapsed = now - shakeStartTime;
      const isShakingNow = shakeElapsed < SHAKE_DURATION;
      const progress = Math.min(1, shakeElapsed / SHAKE_DURATION);

      stepPhysics(isShakingNow, progress);
      renderBears();

      // Check if all candies have returned to rest
      totalKineticEnergy = 0;
      for (let i = 0; i < bears.length; i++) {
        totalKineticEnergy += Math.hypot(bears[i].vx, bears[i].vy) + Math.abs(bears[i].vRot);
      }

      if (!isShakingNow && totalKineticEnergy < 1.2) {
        stillFramesCount++;
        // If settled for 12 consecutive frames (~200ms of near-zero motion), freeze completely!
        if (stillFramesCount > 12) {
          bears.forEach((b) => {
            b.vx = 0;
            b.vy = 0;
            b.vRot = 0;
          });
          renderBears();
          isPhysicsActive = false;
          container.classList.remove("is-shaking");
          return; // Stop animation loop completely!
        }
      } else {
        stillFramesCount = 0;
      }

      animId = requestAnimationFrame(runPhysicsLoop);
    };

    // Wake up simulation and start physical shake!
    const triggerPhysicalShake = () => {
      shakeStartTime = performance.now();
      stillFramesCount = 0;

      container.classList.remove("is-shaking");
      void container.offsetWidth; // Force reflow to restart CSS shake animation
      container.classList.add("is-shaking");

      // Apply initial vigorous upward & lateral shake impulse
      bears.forEach((b) => {
        b.vy -= 7.5 + Math.random() * 8.5;
        b.vx += (Math.random() - 0.5) * 12;
        b.vRot += (Math.random() - 0.5) * 0.3;
      });

      playPopSound(340 + Math.random() * 80);

      if (!isPhysicsActive) {
        isPhysicsActive = true;
        animId = requestAnimationFrame(runPhysicsLoop);
      }
    };

    // SPEECH BUBBLE INTERACTION
    let phraseIndex = 0;
    let bubbleTimeout = null;
    const triggerSpeech = (event) => {
      event?.stopPropagation();
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
      speechBubble.textContent = PHRASES[phraseIndex];
      speechBubble.classList.add("is-active");
      playPopSound(580);
      triggerPhysicalShake();

      if (bubbleTimeout) clearTimeout(bubbleTimeout);
      bubbleTimeout = setTimeout(() => {
        speechBubble.classList.remove("is-active");
      }, 3500);
    };

    mascotHotspot.addEventListener("click", triggerSpeech);

    // Clicking anywhere on the package shakes it up and down!
    container.addEventListener("click", (e) => {
      const rect = container.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

      triggerPhysicalShake();

      // If clicked inside the candy window, add an extra outward burst from the finger/cursor!
      if (clickX >= MIN_X && clickX <= 200 && clickY >= MIN_Y && clickY <= MAX_Y) {
        bears.forEach((b) => {
          const dx = b.x - clickX;
          const dy = b.y - clickY;
          const dist = Math.hypot(dx, dy);
          if (dist < 85 && dist > 1) {
            const force = (1 - dist / 85) * 16;
            b.vx += (dx / dist) * force;
            b.vy += (dy / dist) * force - 5;
            b.vRot += (Math.random() - 0.5) * 0.4;
          }
        });
      }
    });

    // Keyboard support: Space / Enter to shake the candy pack!
    container.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerPhysicalShake();
      }
    });

    // Inertia on Dragging across the Playground Canvas:
    let lastBoxX = null;
    let lastBoxY = null;
    let lastTime = performance.now();

    const trackInertia = () => {
      const article = container.closest(".widget");
      if (article) {
        const curX = parseFloat(article.style.left) || 0;
        const curY = parseFloat(article.style.top) || 0;
        const now = performance.now();
        const dt = Math.max(1, now - lastTime);

        if (lastBoxX !== null && lastBoxY !== null) {
          const vx = ((curX - lastBoxX) / dt) * 16;
          const vy = ((curY - lastBoxY) / dt) * 16;
          const speed = Math.hypot(vx, vy);

          // If the widget is being dragged across the canvas, wake up candies to slosh with inertia!
          if (speed > 1.2) {
            if (!isPhysicsActive) {
              isPhysicsActive = true;
              stillFramesCount = 0;
              animId = requestAnimationFrame(runPhysicsLoop);
            }
            const factor = Math.min(2.0, speed * 0.35);
            bears.forEach((b) => {
              b.vx -= vx * 0.45 * factor;
              b.vy -= vy * 0.45 * factor;
              b.vRot += (Math.random() - 0.5) * speed * 0.02;
            });
          }
        }

        lastBoxX = curX;
        lastBoxY = curY;
        lastTime = now;
      }
      requestAnimationFrame(trackInertia);
    };

    requestAnimationFrame(trackInertia);
  },
};
