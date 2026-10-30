import savvyPhotoUrl from "../assets/savvy-mascot.webp";

export default {
  student: "Minju Jang",
  title: "3D Savvy the Pigeon",
  width: 320,
  height: 380,
  frame: true,
  mount(root) {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        --savvy-blue: #0099dd;
        --savvy-belly: #7cd5f8;
        --savvy-crest: #ff2a55;
        --savvy-shoe: #e62244;
        --savvy-yellow: #fca311;
        --bg-grad: linear-gradient(180deg, #f0f7ff 0%, #e2effe 60%, #d5e6fa 100%);
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        user-select: none;
        font-family: "IBM Plex Mono", monospace;
        color: var(--ink);
        overflow: hidden;
      }

      .widget-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: var(--bg-grad);
        perspective: 1000px;
      }

      .header-bar {
        position: absolute;
        top: 8px;
        left: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 10;
        pointer-events: none;
      }

      .badge-tag {
        font-size: 8.5px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(0, 153, 221, 0.35);
        color: #0077b6;
        padding: 2px 7px;
        border-radius: 999px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .btn-toggle-photo {
        pointer-events: auto;
        font-family: inherit;
        font-size: 8.5px;
        font-weight: 600;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.15);
        color: var(--ink);
        padding: 2px 8px;
        border-radius: 999px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        transition: transform 150ms ease, background-color 150ms ease;
      }

      .btn-toggle-photo:hover {
        background: #f0f7ff;
        transform: translateY(-1px);
      }

      .btn-toggle-photo:focus-visible {
        outline: 2px solid #0099dd;
        outline-offset: 1px;
      }

      .card-flip-wrap {
        position: relative;
        flex: 1;
        width: 100%;
        min-height: 0;
        transform-style: preserve-3d;
        transition: transform 600ms cubic-bezier(0.34, 1.25, 0.64, 1);
      }

      .card-flip-wrap.is-flipped {
        transform: rotateY(180deg);
      }

      .face-3d,
      .face-photo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .face-3d {
        z-index: 2;
      }

      .face-photo {
        transform: rotateY(180deg);
        z-index: 1;
        padding: 34px 16px 16px;
        box-sizing: border-box;
      }

      .photo-frame {
        width: 100%;
        height: 100%;
        background: #ffffff;
        border-radius: 8px;
        padding: 8px 8px 24px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
      }

      .photo-img {
        width: 100%;
        flex: 1;
        object-fit: contain;
        border-radius: 4px;
        background: #f5f5f5;
        min-height: 0;
      }

      .photo-caption {
        margin-top: 6px;
        font-family: "Faculty Glyphic", sans-serif;
        font-size: 11px;
        color: #333;
        font-weight: 600;
        text-align: center;
      }

      canvas {
        display: block;
        width: 100%;
        height: 100%;
        cursor: grab;
      }

      canvas:active {
        cursor: grabbing;
      }

      .hint-overlay {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        pointer-events: none;
        z-index: 5;
      }

      .hint-pill {
        font-size: 8px;
        letter-spacing: 0.03em;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(0, 0, 0, 0.08);
        color: #555;
        padding: 2px 9px;
        border-radius: 999px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        animation: pulse 2.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.85; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.03); }
      }

      /* Speech bubble for click reactions */
      .speech-bubble {
        position: absolute;
        top: 36px;
        left: 50%;
        transform: translateX(-50%) scale(0);
        background: #ffffff;
        border: 1.5px solid #0099dd;
        border-radius: 12px;
        padding: 5px 10px;
        font-family: "Faculty Glyphic", sans-serif;
        font-size: 11px;
        font-weight: 600;
        color: #0077b6;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0, 153, 221, 0.2);
        z-index: 20;
        pointer-events: none;
        transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .speech-bubble::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px 6px 0;
        border-style: solid;
        border-color: #0099dd transparent;
        display: block;
        width: 0;
      }

      .speech-bubble.is-visible {
        transform: translateX(-50%) scale(1);
      }

      /* Floating burst particles */
      .burst-particle {
        position: absolute;
        pointer-events: none;
        font-size: 16px;
        z-index: 25;
        animation: particle-rise 800ms cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
      }

      @keyframes particle-rise {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(0.5);
        }
        100% {
          opacity: 0;
          transform: translate(var(--tx), -60px) scale(1.3) rotate(var(--rot));
        }
      }
    `;

    root.append(style);

    const container = document.createElement("div");
    container.className = "widget-container";
    container.innerHTML = `
      <div class="header-bar">
        <span class="badge-tag">
          <span aria-hidden="true">🗽</span> SVA MASCOT
        </span>
        <button type="button" class="btn-toggle-photo" data-no-drag aria-label="Toggle photo reference">
          <span>📷 Photo</span>
        </button>
      </div>

      <div class="speech-bubble" aria-live="polite">Coo! I'm Savvy! 🐦✨</div>

      <div class="card-flip-wrap">
        <div class="face-3d">
          <canvas data-no-drag aria-label="3D model of Savvy the SVA mascot"></canvas>
          <div class="hint-overlay" aria-hidden="true">
            <span class="hint-pill">✦ Hover or drag to see all sides ✦</span>
          </div>
        </div>
        <div class="face-photo">
          <div class="photo-frame">
            <img class="photo-img" src="${savvyPhotoUrl}" alt="Savvy the Pigeon costume mascot at SVA" />
            <span class="photo-caption">Savvy the Pigeon @ SVA NYC 🎨</span>
          </div>
        </div>
      </div>
    `;

    root.append(container);

    const flipWrap = container.querySelector(".card-flip-wrap");
    const toggleBtn = container.querySelector(".btn-toggle-photo");
    const canvas = container.querySelector("canvas");
    const speechBubble = container.querySelector(".speech-bubble");
    const ctx = canvas.getContext("2d");

    let isPhotoView = false;
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isPhotoView = !isPhotoView;
      flipWrap.classList.toggle("is-flipped", isPhotoView);
      toggleBtn.innerHTML = isPhotoView ? "<span>🔮 3D View</span>" : "<span>📷 Photo</span>";
    });

    // -------------------------------------------------------------
    // 3D Canvas Scene & Math
    // -------------------------------------------------------------
    let width = 320;
    let height = 340;
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 320;
      height = rect.height || 340;
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    // Camera angles
    let targetYaw = -0.3; // slightly facing 3/4
    let currentYaw = -0.3;
    let targetPitch = 0.08;
    let currentPitch = 0.08;
    let isHovering = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startYaw = 0;
    let startPitch = 0;

    // Animation & eye tracking
    let cursorRelX = 0;
    let cursorRelY = 0;
    let hopOffsetY = 0;
    let hopVelY = 0;
    let wingFlap = 0;
    let blinkTimer = 0;
    let isBlinking = false;
    let idleTime = 0;

    const phrases = [
      "Coo! I'm Savvy! 🐦✨",
      "SVA All Day! 🎨",
      "NYC Pigeon Power! 🗽",
      "Check out my kicks! 👟",
      "Design is a party! 🎉",
      "Looking sharp, prototyper! ✦",
    ];

    const triggerReaction = () => {
      hopVelY = -7;
      wingFlap = 1;
      speechBubble.textContent = phrases[Math.floor(Math.random() * phrases.length)];
      speechBubble.classList.add("is-visible");
      setTimeout(() => speechBubble.classList.remove("is-visible"), 1800);

      // Emoji particles
      const emojis = ["✨", "🎨", "🗽", "💖", "🍓", "👟", "🎀", "🕊️"];
      for (let i = 0; i < 5; i++) {
        const p = document.createElement("span");
        p.className = "burst-particle";
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = `calc(50% + ${(Math.random() - 0.5) * 60}px)`;
        p.style.bottom = "120px";
        p.style.setProperty("--tx", `${(Math.random() - 0.5) * 80}px`);
        p.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);
        container.append(p);
        p.addEventListener("animationend", () => p.remove());
      }
    };

    canvas.addEventListener("click", (e) => {
      e.stopPropagation();
      triggerReaction();
    });

    // Hover-based 3D rotation: moving mouse across widget orbits around Savvy
    canvas.addEventListener("pointerenter", () => {
      isHovering = true;
    });

    canvas.addEventListener("pointerleave", () => {
      isHovering = false;
      isDragging = false;
      cursorRelX = 0;
      cursorRelY = 0;
    });

    canvas.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width; // 0 to 1
      const ny = (e.clientY - rect.top) / rect.height; // 0 to 1

      cursorRelX = (nx - 0.5) * 2;
      cursorRelY = (ny - 0.5) * 2;

      if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        targetYaw = startYaw + dx * 0.015;
        targetPitch = Math.max(-0.4, Math.min(0.4, startPitch + dy * 0.01));
      } else {
        // Hover orbits 360 degrees horizontally, tilts vertically
        targetYaw = (nx - 0.5) * Math.PI * 2.2;
        targetPitch = (ny - 0.5) * 0.7;
      }
    });

    canvas.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startYaw = targetYaw;
      startPitch = targetPitch;
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    // -------------------------------------------------------------
    // 3D Projection & Lighting Functions
    // -------------------------------------------------------------
    const fov = 380;
    const project = (x, y, z, yaw, pitch, cx, cy) => {
      // Rotate Y (yaw)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate X (pitch)
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = fov / (fov + z2 + 80);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        z: z2,
        scale,
      };
    };

    // Directional light vector pointing from top-right-front
    const lightDir = { x: 0.45, y: -0.65, z: 0.6 };
    const lightLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
    lightDir.x /= lightLen;
    lightDir.y /= lightLen;
    lightDir.z /= lightLen;

    const calcLighting = (nx, ny, nz, yaw, pitch) => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const nx1 = nx * cosY + nz * sinY;
      const nz1 = -nx * sinY + nz * cosY;

      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);
      const ny2 = ny * cosX - nz1 * sinX;
      const nz2 = ny * sinX + nz1 * cosX;

      const dot = nx1 * lightDir.x + ny2 * lightDir.y + nz2 * lightDir.z;
      return Math.max(0, Math.min(1, 0.4 + 0.6 * dot));
    };

    // Color shade helper
    const shadeColor = (hex, factor) => {
      const num = parseInt(hex.replace("#", ""), 16);
      const r = Math.min(255, Math.floor(((num >> 16) & 255) * factor));
      const g = Math.min(255, Math.floor(((num >> 8) & 255) * factor));
      const b = Math.min(255, Math.floor((num & 255) * factor));
      return `rgb(${r},${g},${b})`;
    };

    // -------------------------------------------------------------
    // Main 3D Render Loop
    // -------------------------------------------------------------
    let animationFrameId;

    const render = () => {
      resizeCanvas();

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation
      if (!isHovering && !isDragging) {
        idleTime += 0.02;
        // gentle idle bob and slow turntable sway
        targetYaw = Math.sin(idleTime * 0.8) * 0.45;
        targetPitch = 0.08 + Math.cos(idleTime * 1.2) * 0.04;
      }

      currentYaw += (targetYaw - currentYaw) * 0.12;
      currentPitch += (targetPitch - currentPitch) * 0.12;

      // Hop physics
      if (hopVelY !== 0 || hopOffsetY !== 0) {
        hopOffsetY += hopVelY;
        hopVelY += 0.8;
        if (hopOffsetY > 0) {
          hopOffsetY = 0;
          hopVelY = 0;
        }
      }

      if (wingFlap > 0) {
        wingFlap -= 0.05;
      }

      // Blinking
      blinkTimer += 0.016;
      if (blinkTimer > 3.5) {
        isBlinking = true;
        if (blinkTimer > 3.65) {
          isBlinking = false;
          blinkTimer = 0;
        }
      }

      const cx = width / 2;
      const cy = height / 2 + 15 + hopOffsetY;

      // List of 3D drawable parts sorted by depth Z
      const drawList = [];

      // 1. Pedestal Ground Disc
      const groundP = project(0, 92, 0, currentYaw, currentPitch, cx, cy);
      drawList.push({
        z: groundP.z - 20,
        draw() {
          // Circular NYC street base
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(groundP.x, groundP.y, 85 * groundP.scale, 30 * groundP.scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = "#cad4e0";
          ctx.fill();
          ctx.lineWidth = 2 * groundP.scale;
          ctx.strokeStyle = "#a2b4c7";
          ctx.stroke();

          // SVA red emblem ring on the ground
          ctx.beginPath();
          ctx.ellipse(groundP.x, groundP.y, 65 * groundP.scale, 22 * groundP.scale, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(230, 34, 68, 0.45)";
          ctx.lineWidth = 1.5 * groundP.scale;
          ctx.stroke();

          // Shadow under sneakers
          ctx.beginPath();
          ctx.ellipse(groundP.x, groundP.y - 2, 48 * groundP.scale, 16 * groundP.scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
          ctx.fill();
          ctx.restore();
        },
      });

      // 2. Tail Feathers (pointing backward in -Z)
      const tailFanP = project(0, 18, -42, currentYaw, currentPitch, cx, cy);
      drawList.push({
        z: tailFanP.z,
        draw() {
          ctx.save();
          const light = calcLighting(0, 0.2, -0.9, currentYaw, currentPitch);
          const color = shadeColor("#0077b6", light);
          const darkTip = shadeColor("#004e7c", light);

          // Fan of 5 tail feathers
          for (let f = -2; f <= 2; f++) {
            const angle = f * 0.18;
            const fx = Math.sin(angle) * 24;
            const fz = -44 - Math.cos(angle) * 12;
            const pt = project(fx, 18, fz, currentYaw, currentPitch, cx, cy);

            ctx.beginPath();
            ctx.ellipse(pt.x, pt.y, 10 * pt.scale, 26 * pt.scale, (angle * 0.8) + (currentYaw * 0.3), 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 1.2 * pt.scale;
            ctx.strokeStyle = darkTip;
            ctx.stroke();
          }
          ctx.restore();
        },
      });

      // 3. Legs & Red High-Top Sneakers
      const drawSneaker = (lx, ly, lz, angleOffset, isLeft) => {
        const p = project(lx, ly, lz, currentYaw, currentPitch, cx, cy);
        drawList.push({
          z: p.z,
          draw() {
            ctx.save();
            // Yellow pigeon leg
            const legTop = project(lx, ly - 32, lz, currentYaw, currentPitch, cx, cy);
            ctx.beginPath();
            ctx.moveTo(legTop.x, legTop.y);
            ctx.lineTo(p.x, p.y - 8 * p.scale);
            ctx.lineWidth = 5 * p.scale;
            ctx.strokeStyle = "#fca311";
            ctx.lineCap = "round";
            ctx.stroke();

            // Red sneaker body
            const light = calcLighting(isLeft ? -0.4 : 0.4, -0.3, 0.8, currentYaw, currentPitch);
            ctx.fillStyle = shadeColor("#d90429", light);
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, 18 * p.scale, 11 * p.scale, angleOffset, 0, Math.PI * 2);
            ctx.fill();

            // White rubber sole
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 4 * p.scale, 19 * p.scale, 5 * p.scale, angleOffset, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.lineWidth = 1 * p.scale;
            ctx.stroke();

            // White rubber toe-cap
            const toeP = project(lx + (isLeft ? -4 : 4), ly + 1, lz + 12, currentYaw, currentPitch, cx, cy);
            ctx.beginPath();
            ctx.arc(toeP.x, toeP.y, 7 * p.scale, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            // White shoelaces
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.8 * p.scale;
            ctx.beginPath();
            ctx.moveTo(p.x - 4 * p.scale, p.y - 4 * p.scale);
            ctx.lineTo(p.x + 4 * p.scale, p.y - 1 * p.scale);
            ctx.moveTo(p.x - 4 * p.scale, p.y - 1 * p.scale);
            ctx.lineTo(p.x + 4 * p.scale, p.y + 2 * p.scale);
            ctx.stroke();

            ctx.restore();
          },
        });
      };

      // Left leg (crossed slightly like photo)
      drawSneaker(-16, 76, 6, -0.15, true);
      // Right leg
      drawSneaker(18, 76, -4, 0.2, false);

      // 4. Pigeon Torso & Belly
      const torsoP = project(0, 16, 0, currentYaw, currentPitch, cx, cy);
      drawList.push({
        z: torsoP.z,
        draw() {
          ctx.save();
          // Blue fluffy body
          const light = calcLighting(0, -0.2, 0.9, currentYaw, currentPitch);
          const bodyColor = shadeColor("#0096db", light);

          ctx.beginPath();
          ctx.ellipse(torsoP.x, torsoP.y, 44 * torsoP.scale, 42 * torsoP.scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = bodyColor;
          ctx.fill();

          // Lighter baby-cyan belly patch on front (+Z)
          // Visibility depends on yaw (only visible when facing front)
          const facingFront = Math.cos(currentYaw);
          if (facingFront > -0.2) {
            const bellyP = project(0, 22, 18, currentYaw, currentPitch, cx, cy);
            const bellyLight = calcLighting(0, 0, 1, currentYaw, currentPitch);
            ctx.beginPath();
            ctx.ellipse(
              bellyP.x,
              bellyP.y,
              28 * bellyP.scale * Math.max(0.1, facingFront),
              28 * bellyP.scale,
              0,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = shadeColor("#7cd5f8", bellyLight);
            ctx.fill();
          }

          // Neck feather ruff
          const ruffP = project(0, -18, 0, currentYaw, currentPitch, cx, cy);
          ctx.beginPath();
          ctx.ellipse(ruffP.x, ruffP.y, 36 * ruffP.scale, 14 * ruffP.scale, 0, 0, Math.PI * 2);
          ctx.fillStyle = shadeColor("#0084c7", light);
          ctx.fill();

          ctx.restore();
        },
      });

      // 5. SVA Lanyard & ID Badge (hanging on front)
      const lanyardFacing = Math.cos(currentYaw);
      if (lanyardFacing > -0.15) {
        const badgeP = project(0, 12, 28, currentYaw, currentPitch, cx, cy);
        drawList.push({
          z: badgeP.z + 10,
          draw() {
            ctx.save();
            const neckLeft = project(-16, -18, 14, currentYaw, currentPitch, cx, cy);
            const neckRight = project(16, -18, 14, currentYaw, currentPitch, cx, cy);

            // White lanyard ribbon
            ctx.beginPath();
            ctx.moveTo(neckLeft.x, neckLeft.y);
            ctx.lineTo(badgeP.x, badgeP.y - 12 * badgeP.scale);
            ctx.lineTo(neckRight.x, neckRight.y);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3.5 * badgeP.scale;
            ctx.lineJoin = "round";
            ctx.stroke();

            // ID Badge Card
            const cardW = 18 * badgeP.scale * Math.max(0.15, lanyardFacing);
            const cardH = 22 * badgeP.scale;
            ctx.beginPath();
            ctx.rect(badgeP.x - cardW / 2, badgeP.y - 8 * badgeP.scale, cardW, cardH);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 1 * badgeP.scale;
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.stroke();

            // SVA red emblem swirl on badge
            ctx.beginPath();
            ctx.arc(badgeP.x, badgeP.y + 2 * badgeP.scale, 4.5 * badgeP.scale, 0, Math.PI * 2);
            ctx.fillStyle = "#e62244";
            ctx.fill();

            ctx.restore();
          },
        });
      }

      // 6. Wings
      // Left wing (resting on hip)
      const leftWingP = project(-42, 14, 2, currentYaw, currentPitch, cx, cy);
      drawList.push({
        z: leftWingP.z,
        draw() {
          ctx.save();
          const light = calcLighting(-0.8, -0.1, 0.4, currentYaw, currentPitch);
          ctx.beginPath();
          const flapAngle = wingFlap * 0.4;
          ctx.ellipse(
            leftWingP.x,
            leftWingP.y,
            16 * leftWingP.scale,
            34 * leftWingP.scale,
            0.4 - flapAngle,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = shadeColor("#0088cc", light);
          ctx.fill();
          ctx.lineWidth = 1.5 * leftWingP.scale;
          ctx.strokeStyle = shadeColor("#006ba1", light);
          ctx.stroke();
          ctx.restore();
        },
      });

      // Right wing (cool raised wave/flex pose from photo!)
      const rightWingP = project(40, -4 - wingFlap * 20, 4, currentYaw, currentPitch, cx, cy);
      drawList.push({
        z: rightWingP.z,
        draw() {
          ctx.save();
          const light = calcLighting(0.8, -0.4, 0.4, currentYaw, currentPitch);
          ctx.beginPath();
          const flapAngle = wingFlap * 0.6;
          ctx.ellipse(
            rightWingP.x,
            rightWingP.y,
            18 * rightWingP.scale,
            36 * rightWingP.scale,
            -0.5 + flapAngle,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = shadeColor("#0091d9", light);
          ctx.fill();
          ctx.lineWidth = 1.5 * rightWingP.scale;
          ctx.strokeStyle = shadeColor("#006ba1", light);
          ctx.stroke();
          ctx.restore();
        },
      });

      // 7. Pigeon Head
      const headP = project(0, -48, 0, currentYaw, currentPitch, cx, cy);
      drawList.push({
        z: headP.z,
        draw() {
          ctx.save();
          const light = calcLighting(0, -0.4, 0.9, currentYaw, currentPitch);
          ctx.beginPath();
          ctx.arc(headP.x, headP.y, 35 * headP.scale, 0, Math.PI * 2);
          ctx.fillStyle = shadeColor("#009fe3", light);
          ctx.fill();
          ctx.restore();
        },
      });

      // 8. Savvy's signature Red Crest / Tuft (on top of head)
      const crestP = project(0, -82, -4, currentYaw, currentPitch, cx, cy);
      drawList.push({
        z: crestP.z,
        draw() {
          ctx.save();
          const light = calcLighting(0, -0.7, 0.6, currentYaw, currentPitch);
          ctx.beginPath();
          // Cute rounded 3D crest tuft tilted back
          ctx.ellipse(crestP.x, crestP.y, 16 * crestP.scale, 12 * crestP.scale, -0.1, 0, Math.PI * 2);
          ctx.fillStyle = shadeColor("#ff2a55", light);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(crestP.x + 3 * crestP.scale, crestP.y - 4 * crestP.scale, 11 * crestP.scale, 8 * crestP.scale, 0.2, 0, Math.PI * 2);
          ctx.fillStyle = shadeColor("#ff476d", light);
          ctx.fill();
          ctx.restore();
        },
      });

      // 9. Cute Cartoon Eyes (facing front)
      const drawEye = (ex, ey, ez, isLeft) => {
        const eyeP = project(ex, ey, ez, currentYaw, currentPitch, cx, cy);
        const facing = Math.cos(currentYaw);
        if (facing < -0.2) return; // behind head

        drawList.push({
          z: eyeP.z + 15,
          draw() {
            ctx.save();
            const eyeW = 12 * eyeP.scale * Math.max(0.2, facing);
            const eyeH = 16 * eyeP.scale;

            if (isBlinking) {
              // Blinking slit
              ctx.beginPath();
              ctx.moveTo(eyeP.x - eyeW, eyeP.y);
              ctx.lineTo(eyeP.x + eyeW, eyeP.y);
              ctx.lineWidth = 2.5 * eyeP.scale;
              ctx.strokeStyle = "#004e7c";
              ctx.stroke();
              ctx.restore();
              return;
            }

            // White eye sclera
            ctx.beginPath();
            ctx.ellipse(eyeP.x, eyeP.y, eyeW, eyeH, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.lineWidth = 1.2 * eyeP.scale;
            ctx.strokeStyle = "#004e7c";
            ctx.stroke();

            // Pupil tracking cursor!
            const pupilOffsetX = cursorRelX * 3.5 * eyeP.scale;
            const pupilOffsetY = cursorRelY * 3.5 * eyeP.scale;
            const px = eyeP.x + pupilOffsetX;
            const py = eyeP.y + pupilOffsetY;

            ctx.beginPath();
            ctx.ellipse(px, py, 7 * eyeP.scale * Math.max(0.2, facing), 9 * eyeP.scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#111827";
            ctx.fill();

            // White reflection catchlights (sparkles in the eyes)
            ctx.beginPath();
            ctx.arc(px - 2.5 * eyeP.scale, py - 3 * eyeP.scale, 2.8 * eyeP.scale, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px + 2 * eyeP.scale, py + 2.5 * eyeP.scale, 1.4 * eyeP.scale, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();

            ctx.restore();
          },
        });
      };

      drawEye(-13, -52, 28, true);
      drawEye(13, -52, 28, false);

      // 10. Golden Yellow Pigeon Beak
      const beakFacing = Math.cos(currentYaw);
      if (beakFacing > -0.2) {
        const beakBase = project(0, -43, 29, currentYaw, currentPitch, cx, cy);
        const beakTip = project(0, -41, 46, currentYaw, currentPitch, cx, cy);
        drawList.push({
          z: beakTip.z + 20,
          draw() {
            ctx.save();
            const light = calcLighting(0, -0.2, 0.95, currentYaw, currentPitch);
            const beakColor = shadeColor("#fca311", light);
            const beakW = 8 * beakBase.scale;

            ctx.beginPath();
            ctx.moveTo(beakBase.x - beakW, beakBase.y);
            ctx.lineTo(beakTip.x, beakTip.y);
            ctx.lineTo(beakBase.x + beakW, beakBase.y);
            ctx.closePath();
            ctx.fillStyle = beakColor;
            ctx.fill();
            ctx.lineWidth = 1 * beakBase.scale;
            ctx.strokeStyle = "#e85d04";
            ctx.stroke();

            // Highlight along top ridge
            ctx.beginPath();
            ctx.moveTo(beakBase.x, beakBase.y - 2);
            ctx.lineTo(beakTip.x, beakTip.y);
            ctx.strokeStyle = "rgba(255,255,255,0.7)";
            ctx.lineWidth = 1.2 * beakBase.scale;
            ctx.stroke();
            ctx.restore();
          },
        });
      }

      // Sort by Z (painter's algorithm) and draw all parts
      drawList.sort((a, b) => a.z - b.z);
      drawList.forEach((item) => item.draw());

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Clean up animation on unmount / disconnect
    const observer = new MutationObserver(() => {
      if (!root.isConnected) {
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
};
