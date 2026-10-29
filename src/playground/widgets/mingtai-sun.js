export default {
  student: "Mingtai Sun",
  title: "Tumbling Bear",
  frame: false,
  width: 200,
  height: 200,
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
    canvas.setAttribute("aria-label", "Pixel bear tumbling around the entire playground and fleeing the cursor");
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

    const drawBear = (phase, isFleeing, dir) => {
      ctx.clearRect(0, 0, W, H);

      let cx = 28;
      let cy = 33;
      let angle = 0;
      let tuck = 0;
      let squashY = 0;
      let dustPhase = 0;

      if (phase < 0.14) {
        const t = phase / 0.14;
        squashY = Math.sin(t * Math.PI) * 2.5;
        cy = 33 + squashY;
        angle = dir * t * 0.25;
        tuck = t * 0.4;
      } else if (phase < 0.86) {
        const t = (phase - 0.14) / 0.72;
        const jumpHeight = Math.sin(t * Math.PI) * 12.5;
        cy = 31 - jumpHeight;
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        angle = dir * (0.25 + easeT * (Math.PI * 2 - 0.35));
        tuck = Math.sin(t * Math.PI);
      } else {
        const t = (phase - 0.86) / 0.14;
        squashY = Math.sin(t * Math.PI) * 2.2;
        cy = 33 + squashY;
        angle = dir * (Math.PI * 2 - 0.1 * (1 - t));
        tuck = 0;
        dustPhase = t;
      }

      const qAngle = Math.round(angle / (Math.PI / 10)) * (Math.PI / 10);
      const cosA = Math.cos(qAngle);
      const sinA = Math.sin(qAngle);

      const toWorld = (lx, ly) => ({
        x: cx + lx * cosA - ly * sinA,
        y: cy + lx * sinA + ly * cosA,
      });

      const headLocalX = dir * tuck * 1.5;
      const headLocalY = -7.2 + tuck * 2.2 + squashY * 0.4;
      const bodyLocalX = -dir * tuck * 1.0;
      const bodyLocalY = 4.2 - tuck * 1.5;

      // 1. Round Pom-Pom Tail
      const tailP = toWorld(bodyLocalX - dir * 6.8, bodyLocalY + 3.2 - tuck * 1.5);
      drawOutlinedDisk(tailP.x, tailP.y, 2.3, C.furDark);

      // 2. Ears
      const earBackP = toWorld(headLocalX - 5.2, headLocalY - 5.6);
      const earFrontP = toWorld(headLocalX + 5.2, headLocalY - 5.6);
      drawOutlinedDisk(earBackP.x, earBackP.y, 3.1, C.furDark);
      drawDisk(earBackP.x, earBackP.y, 1.4, C.cream);

      drawOutlinedDisk(earFrontP.x, earFrontP.y, 3.1, C.fur);
      drawDisk(earFrontP.x, earFrontP.y, 1.4, C.cream);

      // 3. Back Leg & Back Arm
      const legAngle = tuck * 1.1;
      const backHip = toWorld(bodyLocalX - 3.2, bodyLocalY + 4.5);
      const backFoot = toWorld(
        bodyLocalX - 4.5 + dir * Math.sin(legAngle) * 4,
        bodyLocalY + 9.2 - tuck * 3.8 - squashY * 0.7
      );
      drawCapsule(backHip.x, backHip.y, backFoot.x, backFoot.y, 2.3, C.furDark);

      const backSh = toWorld(bodyLocalX - 4.5, bodyLocalY - 2.5);
      const backHand = toWorld(bodyLocalX - 7.5 + tuck * 2, bodyLocalY + 1.5 - tuck * 4.5);
      drawCapsule(backSh.x, backSh.y, backHand.x, backHand.y, 2.0, C.furDark);

      // 4. Chubby Body + Cream Belly Patch
      const bodyP = toWorld(bodyLocalX, bodyLocalY);
      drawOutlinedDisk(bodyP.x, bodyP.y, 7.2, C.fur);

      const bellyP = toWorld(bodyLocalX + dir * 1.2, bodyLocalY + 0.8);
      drawDisk(bellyP.x, bellyP.y, 4.3, C.cream);

      // 5. Front Leg
      const frontHip = toWorld(bodyLocalX + 3.2, bodyLocalY + 4.5);
      const frontFoot = toWorld(
        bodyLocalX + 4.5 + dir * Math.sin(legAngle) * 4.5,
        bodyLocalY + 9.2 - tuck * 4.2 - squashY * 0.7
      );
      drawCapsule(frontHip.x, frontHip.y, frontFoot.x, frontFoot.y, 2.4, C.fur);
      drawDisk(frontFoot.x, frontFoot.y, 1.3, C.cream);

      // 6. Big Bear Head
      const headP = toWorld(headLocalX, headLocalY);
      drawOutlinedDisk(headP.x, headP.y, 7.0, C.fur);

      const hiP = toWorld(headLocalX - 1.5, headLocalY - 3.8);
      drawDisk(hiP.x, hiP.y, 2.0, C.furLight);

      const snoutP = toWorld(headLocalX + dir * 1.2, headLocalY + 1.8);
      drawDisk(snoutP.x, snoutP.y, 3.1, C.cream);

      const noseP = toWorld(headLocalX + dir * 1.6, headLocalY + 0.7);
      px(noseP.x, noseP.y, C.outline);
      px(noseP.x + 1, noseP.y, C.outline);
      px(noseP.x, noseP.y + 1, C.outline);

      const mouthP = toWorld(headLocalX + dir * 1.4, headLocalY + 2.5);
      px(mouthP.x, mouthP.y, C.outline);

      const eyeLP = toWorld(headLocalX - 2.3, headLocalY - 1.0);
      const eyeRP = toWorld(headLocalX + 3.6, headLocalY - 1.0);
      const cheekLP = toWorld(headLocalX - 3.8, headLocalY + 1.2);
      const cheekRP = toWorld(headLocalX + 4.8, headLocalY + 1.2);

      px(cheekLP.x, cheekLP.y, C.blush);
      px(cheekLP.x + 1, cheekLP.y, C.blush);
      px(cheekRP.x, cheekRP.y, C.blush);
      px(cheekRP.x + 1, cheekRP.y, C.blush);

      if (isFleeing) {
        px(eyeLP.x, eyeLP.y, C.outline);
        px(eyeLP.x - 1, eyeLP.y - 1, C.outline);
        px(eyeRP.x, eyeRP.y, C.outline);
        px(eyeRP.x + 1, eyeRP.y - 1, C.outline);

        const sweatP = toWorld(headLocalX - dir * 8.5, headLocalY - 5.5);
        px(sweatP.x, sweatP.y, C.sweat);
        px(sweatP.x, sweatP.y + 1, C.sweat);
      } else {
        px(eyeLP.x, eyeLP.y, C.outline);
        px(eyeLP.x, eyeLP.y + 1, C.outline);
        px(eyeRP.x, eyeRP.y, C.outline);
        px(eyeRP.x, eyeRP.y + 1, C.outline);
      }

      // 7. Front Arm
      const frontSh = toWorld(bodyLocalX + 4.2, bodyLocalY - 2.2);
      const frontHand = toWorld(bodyLocalX + 7.2 - tuck * 1.5, bodyLocalY + 0.8 - tuck * 5.0);
      drawCapsule(frontSh.x, frontSh.y, frontHand.x, frontHand.y, 2.1, C.fur);
      drawDisk(frontHand.x, frontHand.y, 1.2, C.cream);

      // 8. Mid-air motion sparkles & landing dust puffs
      if (tuck > 0.5) {
        const trail1 = toWorld(-dir * 10, -4);
        const trail2 = toWorld(-dir * 9, 5);
        px(trail1.x, trail1.y, C.spark);
        px(trail1.x - 1, trail1.y, C.spark);
        px(trail2.x, trail2.y, C.spark);
      }

      if (dustPhase > 0) {
        const spread = Math.round(dustPhase * 8);
        drawDisk(20 - spread, 46, 1.5 * (1 - dustPhase * 0.5), C.dust);
        drawDisk(36 + spread, 46, 1.5 * (1 - dustPhase * 0.5), C.dust);
      }
    };

    const BASE_FREQ = 1.25; // brisk somersaults while roaming the whole canvas
    const MAX_FREQ = 5.6; // rapid-fire flips when fleeing mouse
    const FLEE_RADIUS = 320; // screen-space px radius where bear senses the cursor

    // Whole-playground world coordinate bounds (covers the entire ~1600x2900 canvas!)
    const WORLD_MIN_X = -120;
    const WORLD_MAX_X = 1580;
    const WORLD_MIN_Y = -60;
    const WORLD_MAX_Y = 2850;

    let roamX = 0;
    let roamY = 0;
    let wanderAngle = -Math.PI * 0.78; // initially tumbles diagonally across the page
    let vx = Math.cos(wanderAngle) * 180;
    let vy = Math.sin(wanderAngle) * 180;

    let pointerClientX = -9999;
    let pointerClientY = -9999;
    let pointerActive = false;

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

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);

    const tick = (now) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const article = root.host?.parentElement;
      const credit = article?.querySelector(".widget-credit");

      // Base position of this widget in `.canvas-world`
      const baseLeft = article ? parseFloat(article.style.left) || 0 : 1400;
      const baseTop = article ? parseFloat(article.style.top) || 0 : 1700;
      const worldX = baseLeft + roamX;
      const worldY = baseTop + roamY;

      let targetFreq = BASE_FREQ;
      let targetVx = Math.cos(wanderAngle) * 185;
      let targetVy = Math.sin(wanderAngle) * 185;
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
            const closeness = Math.max(0, Math.min(1, (FLEE_RADIUS - dist) / (FLEE_RADIUS - 16)));
            targetFreq = BASE_FREQ + Math.pow(closeness, 1.1) * (MAX_FREQ - BASE_FREQ);

            let fleeAngle = dist > 1 ? Math.atan2(dy, dx) : wanderAngle;

            // If near the edge of the playground world while fleeing, curve toward the center of the playground
            const worldCenterX = (WORLD_MIN_X + WORLD_MAX_X) * 0.5;
            const worldCenterY = (WORLD_MIN_Y + WORLD_MAX_Y) * 0.5;
            const nearEdge =
              worldX < WORLD_MIN_X + 180 ||
              worldX > WORLD_MAX_X - 180 ||
              worldY < WORLD_MIN_Y + 180 ||
              worldY > WORLD_MAX_Y - 180;

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
            const fleeSpeed = 380 + closeness * 720; // high-speed escape across the whole page!
            targetVx = Math.cos(fleeAngle) * fleeSpeed;
            targetVy = Math.sin(fleeAngle) * fleeSpeed;
          }
        }
      }

      // Bounce / steer inward when reaching the edges of the entire playground world
      if (!isFleeing) {
        if (worldX < WORLD_MIN_X + 80 && Math.cos(wanderAngle) < 0) {
          wanderAngle = Math.PI - wanderAngle + (Math.random() - 0.5) * 0.4;
        } else if (worldX > WORLD_MAX_X - 80 && Math.cos(wanderAngle) > 0) {
          wanderAngle = Math.PI - wanderAngle + (Math.random() - 0.5) * 0.4;
        }
        if (worldY < WORLD_MIN_Y + 80 && Math.sin(wanderAngle) < 0) {
          wanderAngle = -wanderAngle + (Math.random() - 0.5) * 0.4;
        } else if (worldY > WORLD_MAX_Y - 80 && Math.sin(wanderAngle) > 0) {
          wanderAngle = -wanderAngle + (Math.random() - 0.5) * 0.4;
        }
        targetVx = Math.cos(wanderAngle) * 185;
        targetVy = Math.sin(wanderAngle) * 185;
      }

      currentFreq += (targetFreq - currentFreq) * Math.min(1, dt * 12);
      vx += (targetVx - vx) * Math.min(1, dt * 10);
      vy += (targetVy - vy) * Math.min(1, dt * 10);

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

      const hopMobility = phase >= 0.14 && phase <= 0.86 ? 1.25 : 0.4;
      const nextWorldX = Math.max(WORLD_MIN_X, Math.min(WORLD_MAX_X, worldX + vx * hopMobility * dt));
      const nextWorldY = Math.max(WORLD_MIN_Y, Math.min(WORLD_MAX_Y, worldY + vy * hopMobility * dt));
      roamX = nextWorldX - baseLeft;
      roamY = nextWorldY - baseTop;

      const translateCss = `translate3d(${roamX.toFixed(1)}px, ${roamY.toFixed(1)}px, 0)`;
      stage.style.transform = translateCss;
      if (credit) {
        credit.style.transform = translateCss;
      }

      const dir = vx >= 0 ? 1 : -1;
      drawBear(phase, isFleeing, dir);

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  },
};
