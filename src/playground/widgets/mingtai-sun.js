export default {
  student: "Mingtai Sun",
  title: "Tumbling Bear",
  frame: false,
  width: 350,
  height: 350,
  mount(root) {
    const W = 56;
    const H = 56;

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        background: transparent;
        user-select: none;
        overflow: visible;
      }
      .pixel-stage {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        will-change: transform;
      }
      canvas {
        width: 100%;
        height: 100%;
        object-fit: contain;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        pointer-events: none;
        filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.45));
      }
    `;

    const stage = document.createElement("div");
    stage.className = "pixel-stage";

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Pixel bear tumbling around the playground; click three times to catch it");
    stage.appendChild(canvas);
    root.append(style, stage);

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const C = {
      outline: "#1c110a",
      fur: "#c47435",
      furDark: "#8f4c1b",
      furLight: "#dc8e4e",
      cream: "#fbe3c0",
      blush: "#ff7a70",
      heart: "#ff3b5c",
      spark: "#fde047",
      dust: "#e2e8f0",
      sweat: "#38bdf8",
    };

    const px = (x, y, color) => {
      const ix = Math.round(x);
      const iy = Math.round(y);
      if (ix < 0 || ix >= W || iy < 0 || iy >= H) return;
      ctx.fillStyle = color;
      ctx.fillRect(ix, iy, 1, 1);
    };

    const drawDisk = (cx, cy, r, color) => {
      const icx = Math.round(cx);
      const icy = Math.round(cy);
      const ir = Math.ceil(r);
      const rSq = (r + 0.15) * (r + 0.15);
      for (let dy = -ir; dy <= ir; dy += 1) {
        for (let dx = -ir; dx <= ir; dx += 1) {
          if (dx * dx + dy * dy <= rSq) {
            px(icx + dx, icy + dy, color);
          }
        }
      }
    };

    const drawOutlinedDisk = (cx, cy, r, fillColor, outlineColor = C.outline) => {
      drawDisk(cx, cy, r + 1.05, outlineColor);
      drawDisk(cx, cy, r, fillColor);
    };

    const drawCapsule = (x0, y0, x1, y1, r, fillColor, outlineColor = C.outline) => {
      const steps = 6;
      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        drawDisk(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r + 1.05, outlineColor);
      }
      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        drawDisk(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r, fillColor);
      }
    };

    // Big pixel heart icon when caught
    const drawPixelHeart = (cx, cy) => {
      const x = Math.round(cx);
      const y = Math.round(cy);
      const pts = [
        [-3, -2], [-2, -2], [-1, -2], [1, -2], [2, -2], [3, -2],
        [-4, -1], [-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1], [4, -1],
        [-4, 0], [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
        [-3, 1], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1],
        [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
        [-1, 3], [0, 3], [1, 3],
        [0, 4],
      ];
      pts.forEach(([dx, dy]) => {
        px(x + dx - 1, y + dy, C.outline);
        px(x + dx + 1, y + dy, C.outline);
        px(x + dx, y + dy - 1, C.outline);
        px(x + dx, y + dy + 1, C.outline);
      });
      pts.forEach(([dx, dy]) => px(x + dx, y + dy, C.heart));
      px(x - 2, y - 1, "#ffffff");
    };

    // Big 9x9 pixel star with dark outline and bright center when clicked 1 or 2 times
    const drawBigPixelStar = (cx, cy) => {
      const x = Math.round(cx);
      const y = Math.round(cy);
      const starPixels = [
        [0, -4], [0, -3], [-1, -2], [0, -2], [1, -2],
        [-2, -2], [2, -2],
        [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1],
        [-4, 0], [-3, 0], [-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
        [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1],
        [-2, 2], [2, 2],
        [-1, 2], [0, 2], [1, 2], [0, 3], [0, 4],
      ];
      // Pass 1: 1px dark outline
      starPixels.forEach(([dx, dy]) => {
        px(x + dx - 1, y + dy, C.outline);
        px(x + dx + 1, y + dy, C.outline);
        px(x + dx, y + dy - 1, C.outline);
        px(x + dx, y + dy + 1, C.outline);
      });
      // Pass 2: bright yellow star fill
      starPixels.forEach(([dx, dy]) => px(x + dx, y + dy, C.spark));
      // Pass 3: glowing white core
      px(x, y, "#ffffff");
      px(x - 1, y, "#ffffff");
      px(x + 1, y, "#ffffff");
      px(x, y - 1, "#ffffff");
      px(x, y + 1, "#ffffff");
    };

    // Draw the bear when CAUGHT (facing screen, dangling/wiggling its little paws & feet!)
    const drawCaughtBear = (timeSec) => {
      ctx.clearRect(0, 0, W, H);

      const wiggle = Math.sin(timeSec * 14);
      const cx = 28;
      const cy = 28 + Math.sin(timeSec * 6) * 1.2;

      // Floating pixel heart above head
      drawPixelHeart(cx, 7 + Math.sin(timeSec * 5) * 1.2);

      // 1. Ears (wiggling slightly)
      const earL_X = cx - 6;
      const earR_X = cx + 6;
      const earY = cy - 11 + wiggle * 0.5;
      drawOutlinedDisk(earL_X, earY, 3.4, C.furDark);
      drawDisk(earL_X, earY, 1.6, C.cream);
      drawOutlinedDisk(earR_X, earY - wiggle * 1.0, 3.4, C.fur);
      drawDisk(earR_X, earY - wiggle * 1.0, 1.6, C.cream);

      // 2. Dangling kicking legs at the bottom
      const kickL = Math.sin(timeSec * 16) * 2.5;
      const kickR = -kickL;
      drawCapsule(cx - 4, cy + 8, cx - 5.5 + kickL * 0.4, cy + 14.5 + kickL, 2.6, C.furDark);
      drawDisk(cx - 5.5 + kickL * 0.4, cy + 14.5 + kickL, 1.4, C.cream);

      drawCapsule(cx + 4, cy + 8, cx + 5.5 + kickR * 0.4, cy + 14.5 + kickR, 2.6, C.fur);
      drawDisk(cx + 5.5 + kickR * 0.4, cy + 14.5 + kickR, 1.4, C.cream);

      // 3. Chubby Body + Cream Belly Patch
      drawOutlinedDisk(cx, cy + 4, 7.8, C.fur);
      drawDisk(cx, cy + 4.5, 4.8, C.cream);

      // 4. Waving little arms on left & right
      const waveL = Math.cos(timeSec * 16) * 3.0;
      const waveR = -waveL;
      drawCapsule(cx - 6, cy + 1, cx - 10.5, cy - 1 + waveL, 2.3, C.fur);
      drawDisk(cx - 10.5, cy - 1 + waveL, 1.3, C.cream);

      drawCapsule(cx + 6, cy + 1, cx + 10.5, cy - 1 + waveR, 2.3, C.fur);
      drawDisk(cx + 10.5, cy - 1 + waveR, 1.3, C.cream);

      // 5. Big Front-Facing Bear Head
      const headY = cy - 5;
      drawOutlinedDisk(cx, headY, 7.6, C.fur);
      drawDisk(cx - 2, headY - 4, 2.0, C.furLight);

      // Snout & nose
      drawDisk(cx, headY + 2.0, 3.4, C.cream);
      px(cx, headY + 0.8, C.outline);
      px(cx - 1, headY + 0.8, C.outline);
      px(cx + 1, headY + 0.8, C.outline);
      px(cx, headY + 1.8, C.outline);
      // Cute "w" mouth
      px(cx - 1, headY + 2.8, C.outline);
      px(cx + 1, headY + 2.8, C.outline);

      // Big blushing cheeks
      px(cx - 5, headY + 1, C.blush);
      px(cx - 4, headY + 1, C.blush);
      px(cx + 4, headY + 1, C.blush);
      px(cx + 5, headY + 1, C.blush);

      // Cute "> <" caught eyes
      px(cx - 4, headY - 2, C.outline);
      px(cx - 3, headY - 1, C.outline);
      px(cx - 4, headY, C.outline);

      px(cx + 4, headY - 2, C.outline);
      px(cx + 3, headY - 1, C.outline);
      px(cx + 4, headY, C.outline);
    };

    const drawTumblingBear = (phase, isFleeing, dir, clicksTowardsCatch) => {
      ctx.clearRect(0, 0, W, H);

      let cx = 28;
      let cy = 34;
      let angle = 0;
      let tuck = 0;
      let squashY = 0;
      let dustPhase = 0;

      if (phase < 0.12) {
        const t = phase / 0.12;
        squashY = Math.sin(t * Math.PI) * 2.5;
        cy = 34 + squashY;
        angle = dir * t * 0.25;
        tuck = t * 0.4;
      } else if (phase < 0.88) {
        const t = (phase - 0.12) / 0.76;
        const jumpHeight = Math.sin(t * Math.PI) * 14.0;
        cy = 32 - jumpHeight;
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        angle = dir * (0.25 + easeT * (Math.PI * 2 - 0.35));
        tuck = Math.sin(t * Math.PI);
      } else {
        const t = (phase - 0.88) / 0.12;
        squashY = Math.sin(t * Math.PI) * 2.2;
        cy = 34 + squashY;
        angle = dir * (Math.PI * 2 - 0.1 * (1 - t));
        tuck = 0;
        dustPhase = t;
      }

      const qAngle = Math.round(angle / (Math.PI / 12)) * (Math.PI / 12);
      const cosA = Math.cos(qAngle);
      const sinA = Math.sin(qAngle);

      const toWorld = (lx, ly) => ({
        x: cx + lx * cosA - ly * sinA,
        y: cy + lx * sinA + ly * cosA,
      });

      const headLocalX = dir * tuck * 1.5;
      const headLocalY = -7.6 + tuck * 2.2 + squashY * 0.4;
      const bodyLocalX = -dir * tuck * 1.0;
      const bodyLocalY = 4.4 - tuck * 1.5;

      // 1. Round Pom-Pom Tail
      const tailP = toWorld(bodyLocalX - dir * 7.2, bodyLocalY + 3.4 - tuck * 1.5);
      drawOutlinedDisk(tailP.x, tailP.y, 2.5, C.furDark);

      // 2. Ears
      const earBackP = toWorld(headLocalX - 5.5, headLocalY - 5.9);
      const earFrontP = toWorld(headLocalX + 5.5, headLocalY - 5.9);
      drawOutlinedDisk(earBackP.x, earBackP.y, 3.3, C.furDark);
      drawDisk(earBackP.x, earBackP.y, 1.5, C.cream);

      drawOutlinedDisk(earFrontP.x, earFrontP.y, 3.3, C.fur);
      drawDisk(earFrontP.x, earFrontP.y, 1.5, C.cream);

      // 3. Back Leg & Back Arm
      const legAngle = tuck * 1.1;
      const backHip = toWorld(bodyLocalX - 3.4, bodyLocalY + 4.8);
      const backFoot = toWorld(
        bodyLocalX - 4.8 + dir * Math.sin(legAngle) * 4.2,
        bodyLocalY + 9.6 - tuck * 4.0 - squashY * 0.7
      );
      drawCapsule(backHip.x, backHip.y, backFoot.x, backFoot.y, 2.5, C.furDark);

      const backSh = toWorld(bodyLocalX - 4.8, bodyLocalY - 2.6);
      const backHand = toWorld(bodyLocalX - 7.8 + tuck * 2, bodyLocalY + 1.5 - tuck * 4.8);
      drawCapsule(backSh.x, backSh.y, backHand.x, backHand.y, 2.2, C.furDark);

      // 4. Chubby Body + Cream Belly Patch
      const bodyP = toWorld(bodyLocalX, bodyLocalY);
      drawOutlinedDisk(bodyP.x, bodyP.y, 7.6, C.fur);

      const bellyP = toWorld(bodyLocalX + dir * 1.3, bodyLocalY + 0.8);
      drawDisk(bellyP.x, bellyP.y, 4.6, C.cream);

      // 5. Front Leg
      const frontHip = toWorld(bodyLocalX + 3.4, bodyLocalY + 4.8);
      const frontFoot = toWorld(
        bodyLocalX + 4.8 + dir * Math.sin(legAngle) * 4.8,
        bodyLocalY + 9.6 - tuck * 4.4 - squashY * 0.7
      );
      drawCapsule(frontHip.x, frontHip.y, frontFoot.x, frontFoot.y, 2.6, C.fur);
      drawDisk(frontFoot.x, frontFoot.y, 1.4, C.cream);

      // 6. Big Bear Head
      const headP = toWorld(headLocalX, headLocalY);
      drawOutlinedDisk(headP.x, headP.y, 7.4, C.fur);

      const hiP = toWorld(headLocalX - 1.6, headLocalY - 4.0);
      drawDisk(hiP.x, hiP.y, 2.1, C.furLight);

      const snoutP = toWorld(headLocalX + dir * 1.3, headLocalY + 1.9);
      drawDisk(snoutP.x, snoutP.y, 3.3, C.cream);

      const noseP = toWorld(headLocalX + dir * 1.7, headLocalY + 0.7);
      px(noseP.x, noseP.y, C.outline);
      px(noseP.x + 1, noseP.y, C.outline);
      px(noseP.x, noseP.y + 1, C.outline);

      const mouthP = toWorld(headLocalX + dir * 1.5, headLocalY + 2.6);
      px(mouthP.x, mouthP.y, C.outline);

      const eyeLP = toWorld(headLocalX - 2.4, headLocalY - 1.0);
      const eyeRP = toWorld(headLocalX + 3.8, headLocalY - 1.0);
      const cheekLP = toWorld(headLocalX - 4.0, headLocalY + 1.3);
      const cheekRP = toWorld(headLocalX + 5.0, headLocalY + 1.3);

      px(cheekLP.x, cheekLP.y, C.blush);
      px(cheekLP.x + 1, cheekLP.y, C.blush);
      px(cheekRP.x, cheekRP.y, C.blush);
      px(cheekRP.x + 1, cheekRP.y, C.blush);

      if (isFleeing || clicksTowardsCatch > 0) {
        px(eyeLP.x, eyeLP.y, C.outline);
        px(eyeLP.x - 1, eyeLP.y - 1, C.outline);
        px(eyeRP.x, eyeRP.y, C.outline);
        px(eyeRP.x + 1, eyeRP.y - 1, C.outline);

        const sweatP = toWorld(headLocalX - dir * 9.0, headLocalY - 5.8);
        px(sweatP.x, sweatP.y, C.sweat);
        px(sweatP.x, sweatP.y + 1, C.sweat);
      } else {
        px(eyeLP.x, eyeLP.y, C.outline);
        px(eyeLP.x, eyeLP.y + 1, C.outline);
        px(eyeRP.x, eyeRP.y, C.outline);
        px(eyeRP.x, eyeRP.y + 1, C.outline);
      }

      // 7. Front Arm
      const frontSh = toWorld(bodyLocalX + 4.4, bodyLocalY - 2.3);
      const frontHand = toWorld(bodyLocalX + 7.6 - tuck * 1.5, bodyLocalY + 0.8 - tuck * 5.2);
      drawCapsule(frontSh.x, frontSh.y, frontHand.x, frontHand.y, 2.3, C.fur);
      drawDisk(frontHand.x, frontHand.y, 1.3, C.cream);

      // Show big dizzy stars above bear when clicked 1 or 2 times!
      if (clicksTowardsCatch === 1) {
        drawBigPixelStar(28, 7);
      } else if (clicksTowardsCatch >= 2) {
        drawBigPixelStar(20, 7);
        drawBigPixelStar(36, 7);
      }

      // 8. Mid-air motion sparkles & landing dust puffs
      if (tuck > 0.45) {
        const trail1 = toWorld(-dir * 10.5, -4);
        const trail2 = toWorld(-dir * 9.5, 5);
        px(trail1.x, trail1.y, C.spark);
        px(trail1.x - 1, trail1.y, C.spark);
        px(trail2.x, trail2.y, C.spark);
      }

      if (dustPhase > 0) {
        const spread = Math.round(dustPhase * 9);
        drawDisk(19 - spread, 47, 1.6 * (1 - dustPhase * 0.5), C.dust);
        drawDisk(37 + spread, 47, 1.6 * (1 - dustPhase * 0.5), C.dust);
      }
    };

    const BASE_FREQ = 1.75;
    const MAX_FREQ = 10.5;
    const BASE_SPEED = 360;
    const FLEE_RADIUS = 520;

    let worldBounds = { minX: -200, maxX: 3200, minY: -150, maxY: 2400 };
    let boundsMeasured = false;

    const measureWorldBounds = (article) => {
      const world = article?.parentElement;
      if (!world) return;
      const items = world.querySelectorAll(".widget");
      if (!items.length) return;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      items.forEach((el) => {
        const x = parseFloat(el.style.left) || 0;
        const y = parseFloat(el.style.top) || 0;
        const w = parseFloat(el.style.width) || 350;
        const h = parseFloat(el.style.height) || 350;
        minX = Math.min(minX, x - 120);
        maxX = Math.max(maxX, x + w - 140);
        minY = Math.min(minY, y - 100);
        maxY = Math.max(maxY, y + h - 140);
      });
      if (Number.isFinite(minX) && maxX > minX) {
        worldBounds = { minX, maxX, minY, maxY };
        boundsMeasured = true;
      }
    };

    let roamX = 0;
    let roamY = 0;
    let wanderAngle = -Math.PI * 0.75;
    let vx = Math.cos(wanderAngle) * BASE_SPEED;
    let vy = Math.sin(wanderAngle) * BASE_SPEED;

    let pointerClientX = -9999;
    let pointerClientY = -9999;
    let pointerActive = false;

    // 3 rapid consecutive clicks (within 450ms of each other) to catch the bear!
    // If the gap between clicks is too long, the combo resets and the bear escapes.
    const MAX_CLICK_GAP_MS = 450;
    let clickCount = 0;
    let lastClickTime = 0;
    let clickResetTimer = null;
    let isCaught = false;

    let currentFreq = BASE_FREQ;
    let phase = 0;
    let flipCount = 0;
    let nextDirectionChange = 4;
    let lastTime = performance.now();

    const onPointerMove = (event) => {
      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      pointerActive = true;
    };

    const onPointerLeave = () => {
      pointerActive = false;
    };

    const onWindowClick = (event) => {
      const article = root.host?.parentElement;
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];

      // Ignore clicks on UI controls (zoom / reset / palette / links) or on ANY other widget!
      const hitOtherElement = path.some((el) => {
        if (!(el instanceof Element)) return false;
        if (el.classList?.contains("canvas-tools") || el.classList?.contains("masthead")) return true;
        if (el.classList?.contains("widget") && el !== article) return true;
        return false;
      });
      if (hitOtherElement) return;

      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      pointerActive = true;

      if (isCaught) {
        // Clicking while caught releases the bear back to tumbling!
        isCaught = false;
        clickCount = 0;
        lastClickTime = 0;
        if (clickResetTimer) {
          clearTimeout(clickResetTimer);
          clickResetTimer = null;
        }
        wanderAngle = Math.random() * Math.PI * 2;
        vx = Math.cos(wanderAngle) * BASE_SPEED * 1.5;
        vy = Math.sin(wanderAngle) * BASE_SPEED * 1.5;
        return;
      }

      // Only respond when clicking on/near the bear (within chase radius)
      const bounds = stage.getBoundingClientRect();
      if (bounds.width > 0 && bounds.height > 0) {
        const bearScreenX = bounds.left + bounds.width / 2;
        const bearScreenY = bounds.top + bounds.height / 2;
        const dist = Math.hypot(bearScreenX - event.clientX, bearScreenY - event.clientY);
        if (dist > FLEE_RADIUS * 1.15) return;
      }

      const nowMs = performance.now();
      if (clickCount > 0 && nowMs - lastClickTime > MAX_CLICK_GAP_MS) {
        clickCount = 0;
      }

      clickCount += 1;
      lastClickTime = nowMs;

      // Immediately brake the bear's velocity & flip speed on each click so the slowdown is super noticeable
      vx *= 0.3;
      vy *= 0.3;
      currentFreq *= 0.45;

      if (clickResetTimer) clearTimeout(clickResetTimer);
      if (clickCount >= 3) {
        isCaught = true;
        clickCount = 0;
        clickResetTimer = null;
      } else {
        clickResetTimer = setTimeout(() => {
          clickCount = 0;
          clickResetTimer = null;
        }, MAX_CLICK_GAP_MS);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    window.addEventListener("click", onWindowClick);

    const tick = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const article = root.host?.parentElement;
      const credit = article?.querySelector(".widget-credit");
      if (!boundsMeasured && article) {
        measureWorldBounds(article);
      }

      const baseLeft = article ? parseFloat(article.style.left) || 0 : 1200;
      const baseTop = article ? parseFloat(article.style.top) || 0 : 1000;
      const worldX = baseLeft + roamX;
      const worldY = baseTop + roamY;

      if (isCaught) {
        // When caught: move smoothly right to the mouse cursor (held by the cursor!) and wiggle cutely
        if (pointerActive && article?.parentElement) {
          const worldEl = article.parentElement;
          const matrix = new DOMMatrix(getComputedStyle(worldEl).transform);
          const scale = matrix.a || 1;
          const worldRect = worldEl.getBoundingClientRect();
          const cursorWorldX = (pointerClientX - worldRect.left) / scale - 175;
          const cursorWorldY = (pointerClientY - worldRect.top) / scale - 135;

          const targetRoamX = cursorWorldX - baseLeft;
          const targetRoamY = cursorWorldY - baseTop;
          roamX += (targetRoamX - roamX) * Math.min(1, dt * 14);
          roamY += (targetRoamY - roamY) * Math.min(1, dt * 14);
        }

        const translateCss = `translate3d(${roamX.toFixed(1)}px, ${roamY.toFixed(1)}px, 0)`;
        stage.style.transform = translateCss;
        if (credit) {
          credit.style.transform = translateCss;
        }

        drawCaughtBear(now / 1000);
        requestAnimationFrame(tick);
        return;
      }

      // Each click towards 3 noticeably slows down both movement and somersault speed
      const slowFactor = clickCount === 1 ? 0.35 : clickCount === 2 ? 0.12 : 1.0;

      let targetFreq = BASE_FREQ * slowFactor;
      let targetVx = Math.cos(wanderAngle) * BASE_SPEED * slowFactor;
      let targetVy = Math.sin(wanderAngle) * BASE_SPEED * slowFactor;
      let isFleeing = false;

      if (pointerActive) {
        const bounds = stage.getBoundingClientRect();
        if (bounds.width > 0 && bounds.height > 0) {
          const bearScreenX = bounds.left + bounds.width / 2;
          const bearScreenY = bounds.top + bounds.height / 2;
          const dx = bearScreenX - pointerClientX;
          const dy = bearScreenY - pointerClientY;
          const dist = Math.hypot(dx, dy);

          if (dist < FLEE_RADIUS) {
            isFleeing = true;
            const closeness = Math.max(0, Math.min(1, (FLEE_RADIUS - dist) / (FLEE_RADIUS - 20)));
            targetFreq = (BASE_FREQ + Math.pow(closeness, 0.95) * (MAX_FREQ - BASE_FREQ)) * slowFactor;

            let fleeAngle = dist > 1 ? Math.atan2(dy, dx) : wanderAngle;

            const { minX, maxX, minY, maxY } = worldBounds;
            const worldCenterX = (minX + maxX) * 0.5;
            const worldCenterY = (minY + maxY) * 0.5;
            const nearEdge =
              worldX < minX + 240 ||
              worldX > maxX - 240 ||
              worldY < minY + 240 ||
              worldY > maxY - 240;

            if (nearEdge) {
              const toCenterAngle = Math.atan2(worldCenterY - worldY, worldCenterX - worldX);
              let diff = (fleeAngle - toCenterAngle) % (Math.PI * 2);
              if (diff > Math.PI) diff -= Math.PI * 2;
              if (diff < -Math.PI) diff += Math.PI * 2;
              if (Math.abs(diff) > Math.PI * 0.55) {
                fleeAngle = toCenterAngle + (diff >= 0 ? Math.PI * 0.38 : -Math.PI * 0.38);
              }
            }

            wanderAngle = fleeAngle;
            const fleeSpeed = (950 + closeness * 1650) * slowFactor;
            targetVx = Math.cos(fleeAngle) * fleeSpeed;
            targetVy = Math.sin(fleeAngle) * fleeSpeed;
          }
        }
      }

      const { minX, maxX, minY, maxY } = worldBounds;
      if (!isFleeing) {
        if (worldX < minX + 120 && Math.cos(wanderAngle) < 0) {
          wanderAngle = Math.PI - wanderAngle + (Math.random() - 0.5) * 0.4;
        } else if (worldX > maxX - 120 && Math.cos(wanderAngle) > 0) {
          wanderAngle = Math.PI - wanderAngle + (Math.random() - 0.5) * 0.4;
        }
        if (worldY < minY + 120 && Math.sin(wanderAngle) < 0) {
          wanderAngle = -wanderAngle + (Math.random() - 0.5) * 0.4;
        } else if (worldY > maxY - 120 && Math.sin(wanderAngle) > 0) {
          wanderAngle = -wanderAngle + (Math.random() - 0.5) * 0.4;
        }
        targetVx = Math.cos(wanderAngle) * BASE_SPEED * slowFactor;
        targetVy = Math.sin(wanderAngle) * BASE_SPEED * slowFactor;
      }

      currentFreq += (targetFreq - currentFreq) * Math.min(1, dt * 18);
      vx += (targetVx - vx) * Math.min(1, dt * 16);
      vy += (targetVy - vy) * Math.min(1, dt * 16);

      const prevPhase = phase;
      phase = (phase + dt * currentFreq) % 1;

      if (prevPhase > phase) {
        flipCount += 1;
        if (!isFleeing && flipCount >= nextDirectionChange) {
          flipCount = 0;
          nextDirectionChange = 3 + Math.floor(Math.random() * 4);
          wanderAngle += (Math.random() - 0.5) * Math.PI * 1.3;
        }
      }

      const hopMobility = phase >= 0.12 && phase <= 0.88 ? 1.45 : 0.45;
      const nextWorldX = Math.max(minX, Math.min(maxX, worldX + vx * hopMobility * dt));
      const nextWorldY = Math.max(minY, Math.min(maxY, worldY + vy * hopMobility * dt));
      roamX = nextWorldX - baseLeft;
      roamY = nextWorldY - baseTop;

      const translateCss = `translate3d(${roamX.toFixed(1)}px, ${roamY.toFixed(1)}px, 0)`;
      stage.style.transform = translateCss;
      if (credit) {
        credit.style.transform = translateCss;
      }

      const dir = vx >= 0 ? 1 : -1;
      drawTumblingBear(phase, isFleeing, dir, clickCount);

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  },
};
