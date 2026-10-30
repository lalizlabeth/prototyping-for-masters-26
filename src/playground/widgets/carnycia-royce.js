const SVG_NS = "http://www.w3.org/2000/svg";

const createSvg = (tag, attrs = {}) => {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
};

export default {
  student: "Carnycia Royce",
  title: "Stick Figure",
  frame: false,
  width: 240,
  height: 280,
  mount(root) {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        user-select: none;
        background: transparent;
      }
      svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
        cursor: pointer;
      }
      .stick {
        stroke: var(--ink, #111111);
        stroke-width: 4.8;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
      }
      .head-shape {
        fill: var(--paper, #ffffff);
        stroke: var(--ink, #111111);
        stroke-width: 4.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .face-line {
        stroke: var(--ink, #111111);
        stroke-width: 4.8;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
      }
      .ground-shadow {
        fill: color-mix(in srgb, var(--ink, #111111) 14%, transparent);
        transition: rx 100ms ease;
      }
      .particle {
        pointer-events: none;
        font-size: 16px;
        text-anchor: middle;
        dominant-baseline: central;
        animation: floatUp 750ms ease-out forwards;
      }
      @keyframes floatUp {
        0% {
          opacity: 1;
          transform: translateY(0) scale(0.6);
        }
        50% {
          opacity: 1;
          transform: translateY(-20px) scale(1.1);
        }
        100% {
          opacity: 0;
          transform: translateY(-42px) scale(0.8);
        }
      }
    `;

    const svg = createSvg("svg", {
      viewBox: "0 0 240 280",
      role: "img",
      "aria-label": "Stick figure",
      "data-no-drag": "true",
    });

    const shadow = createSvg("ellipse", {
      cx: 120,
      cy: 260,
      rx: 34,
      ry: 5.5,
      class: "ground-shadow",
    });

    const spine = createSvg("line", { class: "stick" });
    const leftArm = createSvg("polyline", { class: "stick" });
    const rightArm = createSvg("path", { class: "stick" });
    const leftLeg = createSvg("line", { class: "stick" });
    const rightLeg = createSvg("line", { class: "stick" });

    // Head and facial features
    const headGroup = createSvg("g");
    const head = createSvg("ellipse", {
      cx: 120,
      cy: 90,
      rx: 84,
      ry: 59,
      class: "head-shape",
    });

    // Two wide-spaced vertical-slit eyes
    const leftEye = createSvg("line", {
      x1: 88, y1: 91, x2: 88, y2: 102,
      class: "face-line",
    });
    const rightEye = createSvg("line", {
      x1: 152, y1: 91, x2: 152, y2: 102,
      class: "face-line",
    });

    // Cute subtle smirk mouth placed slightly right of center
    const mouth = createSvg("path", {
      d: "M 116 122 Q 124 128 134 120",
      class: "face-line",
    });

    headGroup.append(head, leftEye, rightEye, mouth);

    const particleLayer = createSvg("g");

    svg.append(shadow, spine, leftLeg, rightLeg, leftArm, rightArm, headGroup, particleLayer);
    root.append(style, svg);

    let pointerX = 120;
    let pointerY = 90;
    let isJumping = false;
    let jumpStartTime = 0;
    let lastClickTime = 0;

    function spawnParticle(symbol, x, y) {
      const text = createSvg("text", { x, y, class: "particle" });
      text.textContent = symbol;
      particleLayer.appendChild(text);
      setTimeout(() => text.remove(), 750);
    }

    svg.addEventListener("pointermove", (e) => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerX = ((e.clientX - rect.left) / rect.width) * 240;
      pointerY = ((e.clientY - rect.top) / rect.height) * 280;
    });

    svg.addEventListener("pointerleave", () => {
      pointerX = 120;
      pointerY = 90;
    });

    svg.addEventListener("click", () => {
      isJumping = true;
      jumpStartTime = performance.now();
      lastClickTime = jumpStartTime;
      const symbols = ["✨", "★", "💖", "😄", "🎶", "✦"];
      const sym = symbols[Math.floor(Math.random() * symbols.length)];
      spawnParticle(sym, 120 + (Math.random() * 40 - 20), 45);
    });

    function render(now) {
      const time = now / 1000;
      const isClickedRecently = (now - lastClickTime) < 320;

      let headX = 120;
      let headY = 90;
      let hipX = 120;
      let hipY = 212;

      let lFootX = 95;
      let lFootY = 258;
      let rFootX = 145;
      let rFootY = 258;

      let shadowRx = 34;

      // Base arm poses matching sketch:
      // Left arm: horizontal then hooked up
      let lArmPoints = "120,172 94,172 92,164";
      // Right arm: sweeping curved up-right
      let rArmD = "M 120 172 Q 142 170 160 162";

      // Mouth default smirk
      let mouthD = "M 116 122 Q 124 128 134 120";

      if (isJumping) {
        const jumpDuration = 0.7;
        const elapsed = (now - jumpStartTime) / 1000;

        if (elapsed >= jumpDuration) {
          isJumping = false;
        } else {
          const p = elapsed / jumpDuration;
          if (p < 0.2) {
            // Crouch down slightly before jumping
            const crouch = (p / 0.2) * 12;
            headY += crouch;
            hipY += crouch;
            lArmPoints = "120,180 94,182 92,176";
            rArmD = "M 120 180 Q 142 178 160 172";
            mouthD = "M 116 123 Q 124 125 133 123";
          } else if (p < 0.8) {
            // In mid-air
            const airP = (p - 0.2) / 0.6;
            const lift = Math.sin(airP * Math.PI) * 36;
            headY -= lift;
            hipY -= lift;

            // Legs kick in excitement
            lFootX = 104;
            lFootY = 258 - lift + 12;
            rFootX = 136;
            rFootY = 258 - lift + 12;

            // Arms celebrate outward to the sides
            const armLiftY = 172 - lift;
            lArmPoints = `120,${armLiftY.toFixed(1)} 70,${(armLiftY + 4).toFixed(1)} 46,${(armLiftY - 14).toFixed(1)}`;
            rArmD = `M 120 ${armLiftY.toFixed(1)} Q 170 ${(armLiftY + 4).toFixed(1)} 194 ${(armLiftY - 14).toFixed(1)}`;

            shadowRx = Math.max(16, 34 - lift * 0.35);
            // Happy open grin
            mouthD = "M 114 118 Q 125 133 136 118 Z";
          } else {
            // Landing rebound
            const landP = (p - 0.8) / 0.2;
            const compression = (1 - landP) * 8;
            headY += compression;
            hipY += compression;
          }
        }
      } else {
        // Idle gentle breathing motion
        const breathe = Math.sin(time * 2.8);
        headY += breathe * 2.2;
        hipY += breathe * 1.2;

        // Subtle arm breathing sway
        lArmPoints = `120,${(172 + breathe * 1.5).toFixed(1)} 94,${(172 + breathe).toFixed(1)} 92,${(164 + breathe).toFixed(1)}`;
        rArmD = `M 120 ${(172 + breathe * 1.5).toFixed(1)} Q 142 ${(170 + breathe).toFixed(1)} 160 ${(162 + breathe).toFixed(1)}`;
      }

      // Pointer tracking for the wide-set vertical-dash eyes
      const dx = pointerX - headX;
      const dy = pointerY - headY;
      const angle = Math.atan2(dy, dx);
      const eyeOffset = 2.4;
      const eyeDx = Math.cos(angle) * eyeOffset;
      const eyeDy = Math.sin(angle) * eyeOffset;

      if (isClickedRecently) {
        // Joyful blink / squint: cute horizontal dashes or arcs
        leftEye.setAttribute("x1", (85 + eyeDx).toFixed(1));
        leftEye.setAttribute("y1", (96 + eyeDy).toFixed(1));
        leftEye.setAttribute("x2", (91 + eyeDx).toFixed(1));
        leftEye.setAttribute("y2", (96 + eyeDy).toFixed(1));

        rightEye.setAttribute("x1", (149 + eyeDx).toFixed(1));
        rightEye.setAttribute("y1", (96 + eyeDy).toFixed(1));
        rightEye.setAttribute("x2", (155 + eyeDx).toFixed(1));
        rightEye.setAttribute("y2", (96 + eyeDy).toFixed(1));
      } else {
        // Standard vertical dash eyes following pointer
        leftEye.setAttribute("x1", (88 + eyeDx).toFixed(1));
        leftEye.setAttribute("y1", (91 + eyeDy).toFixed(1));
        leftEye.setAttribute("x2", (88 + eyeDx).toFixed(1));
        leftEye.setAttribute("y2", (102 + eyeDy).toFixed(1));

        rightEye.setAttribute("x1", (152 + eyeDx).toFixed(1));
        rightEye.setAttribute("y1", (91 + eyeDy).toFixed(1));
        rightEye.setAttribute("x2", (152 + eyeDx).toFixed(1));
        rightEye.setAttribute("y2", (102 + eyeDy).toFixed(1));
      }

      mouth.setAttribute("d", mouthD);

      // Entire head group moves together with head bob/jump
      headGroup.setAttribute("transform", `translate(${(headX - 120).toFixed(1)}, ${(headY - 90).toFixed(1)})`);

      // Spine runs from neck (base of head) to hips
      spine.setAttribute("x1", headX.toFixed(1));
      spine.setAttribute("y1", (headY + 59).toFixed(1));
      spine.setAttribute("x2", hipX.toFixed(1));
      spine.setAttribute("y2", hipY.toFixed(1));

      // Limbs update
      leftArm.setAttribute("points", lArmPoints);
      rightArm.setAttribute("d", rArmD);

      leftLeg.setAttribute("x1", hipX.toFixed(1));
      leftLeg.setAttribute("y1", hipY.toFixed(1));
      leftLeg.setAttribute("x2", lFootX.toFixed(1));
      leftLeg.setAttribute("y2", lFootY.toFixed(1));

      rightLeg.setAttribute("x1", hipX.toFixed(1));
      rightLeg.setAttribute("y1", hipY.toFixed(1));
      rightLeg.setAttribute("x2", rFootX.toFixed(1));
      rightLeg.setAttribute("y2", rFootY.toFixed(1));

      shadow.setAttribute("cx", hipX.toFixed(1));
      shadow.setAttribute("rx", shadowRx.toFixed(1));

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  },
};
