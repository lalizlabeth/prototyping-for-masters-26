export default {
  student: "Siyue Zhong",
  title: "Tamagotchi bear",
  frame: false,
  width: 320,
  height: 480,
  mount(root) {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        user-select: none;
        font-family: 'IBM Plex Mono', 'Courier New', monospace;
      }

      .tamagotchi-container {
        position: relative;
        width: 100%;
        height: 100%;
        background: #17181f;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 6px;
        box-sizing: border-box;
        overflow: hidden;
      }

      /* =========================================
         TAMAGOTCHI CONNECTION V3 (PINK BOWS SHELL)
         ========================================= */

      .shell-stage {
        position: relative;
        width: 285px;
        height: 380px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Antenna at Top-Left */
      .antenna {
        position: absolute;
        top: 14px;
        left: 36px;
        width: 22px;
        height: 38px;
        transform: rotate(-22deg);
        transform-origin: bottom center;
        z-index: 1;
      }

      .antenna-cap {
        width: 22px;
        height: 14px;
        border-radius: 11px 11px 6px 6px;
        background: linear-gradient(135deg, #ffd3e4 0%, #ff9bc1 50%, #f47ea9 100%);
        border: 2px solid #5c3246;
        box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.7);
      }

      .antenna-body {
        width: 16px;
        height: 24px;
        margin: -2px auto 0;
        background: linear-gradient(90deg, #ff9bc1 0%, #ffd3e4 40%, #f47ea9 100%);
        border: 2px solid #5c3246;
        border-top: none;
        border-radius: 0 0 4px 4px;
      }

      /* Silver Beaded Ball-Chain on Top-Right */
      .ball-chain {
        position: absolute;
        top: 72px;
        right: 10px;
        width: 36px;
        height: 140px;
        pointer-events: none;
        z-index: 10;
      }

      /* The Main Egg Shell Body */
      .egg-shell {
        position: relative;
        width: 236px;
        height: 314px;
        border-radius: 118px 118px 105px 105px;
        background: radial-gradient(circle at 45% 30%, #ffc0d8 0%, #ffa4c7 45%, #f68bb3 75%, #e9719e 100%);
        border: 3.5px solid #482939;
        box-shadow: 
          inset 0 6px 12px rgba(255, 255, 255, 0.7),
          inset 0 -8px 16px rgba(180, 60, 110, 0.4),
          0 12px 24px rgba(0, 0, 0, 0.45),
          0 2px 0 #482939;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 14px 14px;
        box-sizing: border-box;
        overflow: hidden;
        z-index: 2;
      }

      /* Printed Ribbon Bows on Shell */
      .shell-bow {
        position: absolute;
        pointer-events: none;
        z-index: 2;
      }

      .shell-bow.bow-dark-1 {
        top: 74px;
        left: 10px;
        width: 28px;
        height: 20px;
        color: #4b364e;
        transform: rotate(-18deg);
        opacity: 0.85;
      }

      .shell-bow.bow-dark-2 {
        top: 135px;
        right: 8px;
        width: 30px;
        height: 22px;
        color: #4b364e;
        transform: rotate(15deg);
        opacity: 0.85;
      }

      .shell-bow.bow-white-1 {
        top: 48px;
        right: 32px;
        width: 24px;
        height: 18px;
        color: #ffffff;
        transform: rotate(24deg);
        opacity: 0.75;
      }

      .shell-bow.bow-white-2 {
        bottom: 74px;
        left: 18px;
        width: 26px;
        height: 19px;
        color: #ffffff;
        transform: rotate(-12deg);
        opacity: 0.75;
      }

      .shell-bow.bow-pink-1 {
        bottom: 64px;
        right: 22px;
        width: 26px;
        height: 20px;
        color: #df588b;
        transform: rotate(14deg);
        opacity: 0.65;
      }

      /* Y2K Tamagotchi Brush Logo above Screen */
      .brand-script {
        width: 100%;
        text-align: center;
        font-family: 'Brush Script MT', 'Impact', cursive, sans-serif;
        font-size: 19px;
        font-weight: 900;
        font-style: italic;
        color: #44324a;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        transform: scaleY(0.95) rotate(-3deg);
        text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
        margin-top: 2px;
        margin-bottom: 6px;
        z-index: 3;
      }

      /* White Shield Bezel Frame */
      .bezel {
        position: relative;
        width: 190px;
        height: 172px;
        background: #ffffff;
        border-radius: 14px 14px 18px 18px;
        border: 3px solid #382532;
        box-shadow: 
          inset 0 3px 5px rgba(0, 0, 0, 0.15),
          0 2px 4px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 5px 6px 4px;
        box-sizing: border-box;
        z-index: 4;
      }

      /* Top & Bottom Connection V3 Icon Trays (4 icons each) */
      .icon-tray {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1px 4px;
      }

      .tam-icon {
        font-size: 11px;
        opacity: 0.24;
        transition: opacity 120ms ease, transform 120ms ease;
        line-height: 1;
        cursor: pointer;
      }

      .tam-icon.active {
        opacity: 1;
        transform: scale(1.35);
        filter: drop-shadow(0 0 2px #000);
      }

      /* The Vintage LCD Screen Box with Pastel Checkered Plate */
      .screen-container {
        position: relative;
        width: 100%;
        height: 118px;
        background: #fdfcee;
        background-image: 
          radial-gradient(#ebd6ed 18%, transparent 20%),
          linear-gradient(45deg, rgba(247, 235, 192, 0.7) 25%, transparent 25%, transparent 75%, rgba(247, 235, 192, 0.7) 75%),
          linear-gradient(45deg, rgba(247, 235, 192, 0.7) 25%, transparent 25%, transparent 75%, rgba(247, 235, 192, 0.7) 75%);
        background-size: 8px 8px, 12px 12px, 12px 12px;
        background-position: 0 0, 0 0, 6px 6px;
        border: 2px solid #574554;
        border-radius: 6px;
        box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.35);
        overflow: hidden;
        cursor: pointer;
      }

      /* 64x48 Pixel Canvas */
      .lcd-canvas {
        width: 100%;
        height: 100%;
        display: block;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
      }

      /* Night / Sleep Mode Screen Plate */
      .screen-container.is-sleeping {
        background: #24222f !important;
        background-image: none !important;
      }

      /* Bow emblem on bottom of white bezel */
      .bezel-bow {
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 22px;
        height: 14px;
        color: #d1c7d8;
        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
        z-index: 5;
      }

      /* The 3 Pink Buttons (Curved Layout) */
      .buttons-row {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 154px;
        margin-top: 14px;
        z-index: 4;
      }

      .btn-pocket {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(180, 60, 110, 0.22);
        box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-pocket.btn-center {
        margin-top: 8px; /* Middle button B is positioned lower */
      }

      .tam-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #ffc0da 0%, #fa80ab 60%, #ce4979 100%);
        border: 2px solid #5c2f44;
        box-shadow: 
          0 3px 0 #9c3359,
          0 4px 6px rgba(0, 0, 0, 0.35),
          inset 0 1px 2px rgba(255, 255, 255, 0.6);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: inherit;
        font-size: 11px;
        font-weight: 800;
        color: #ffffff;
        text-shadow: 0 1px 1px #5c2f44;
        transition: transform 60ms ease, box-shadow 60ms ease;
      }

      .tam-btn:active {
        transform: translateY(2px);
        box-shadow: 0 1px 0 #9c3359, 0 2px 3px rgba(0, 0, 0, 0.3);
      }

      /* Footer controls */
      .device-footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 6px;
        font-size: 9px;
        color: #94a3b8;
      }

      .aux-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: #cbd5e1;
        padding: 3px 8px;
        font-family: inherit;
        font-size: 9px;
        cursor: pointer;
        transition: background 150ms ease;
      }

      .aux-btn:hover {
        background: rgba(255, 255, 255, 0.16);
        color: #ffffff;
      }
    `;

    // SVG Ribbon Bow Definition
    const bowSvg = (className) => `
      <svg class="shell-bow ${className}" viewBox="0 0 36 26" fill="currentColor">
        <!-- Left loop -->
        <path d="M5 4 C11 10, 11 16, 5 22 C16 18, 16 8, 5 4 Z" />
        <!-- Right loop -->
        <path d="M31 4 C25 10, 25 16, 31 22 C20 18, 20 8, 31 4 Z" />
        <!-- Center knot -->
        <circle cx="18" cy="13" r="4.5" />
        <!-- Ribbon tails -->
        <path d="M16 15 Q13 24 10 25 Q14 21 16 16 Z" />
        <path d="M20 15 Q23 24 26 25 Q22 21 20 16 Z" />
      </svg>
    `;

    // SVG Ball-Chain on Right
    const ballChainSvg = `
      <svg class="ball-chain" viewBox="0 0 40 140">
        <!-- Shell Eyelet -->
        <path d="M6 10 C14 10, 14 20, 6 20" stroke="#9ca3af" stroke-width="3" fill="none" />
        
        <!-- Beaded Loop -->
        <defs>
          <radialGradient id="silver-bead" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="40%" stop-color="#e2e8f0" />
            <stop offset="75%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#475569" />
          </radialGradient>
        </defs>

        <!-- Connecting link line -->
        <path d="M12 15 Q30 50 26 95 Q22 135 14 135 Q6 135 10 95" stroke="#94a3b8" stroke-width="1.5" fill="none" />

        <!-- Spherical Beads -->
        <circle cx="12" cy="15" r="3.2" fill="url(#silver-bead)" />
        <circle cx="16" cy="24" r="3.2" fill="url(#silver-bead)" />
        <circle cx="21" cy="35" r="3.2" fill="url(#silver-bead)" />
        <circle cx="25" cy="48" r="3.2" fill="url(#silver-bead)" />
        <circle cx="27" cy="62" r="3.2" fill="url(#silver-bead)" />
        <circle cx="28" cy="76" r="3.2" fill="url(#silver-bead)" />
        <circle cx="27" cy="90" r="3.2" fill="url(#silver-bead)" />
        <circle cx="24" cy="104" r="3.2" fill="url(#silver-bead)" />
        <circle cx="19" cy="118" r="3.2" fill="url(#silver-bead)" />
        <circle cx="14" cy="128" r="3.2" fill="url(#silver-bead)" />
        
        <!-- Chain Clasp at bottom -->
        <rect x="7" y="125" width="10" height="6" rx="2" fill="url(#silver-bead)" stroke="#64748b" stroke-width="0.8" />
      </svg>
    `;

    const container = document.createElement("div");
    container.className = "tamagotchi-container";
    container.setAttribute("data-no-drag", "");

    // Audio synthesizer for authentic 8-bit Tamagotchi beeps
    let audioCtx = null;
    let soundEnabled = true;

    const initAudio = () => {
      try {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume();
        }
      } catch {}
    };

    const play8BitTone = (freq, duration = 0.06, type = "square", vol = 0.14) => {
      if (!soundEnabled) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch {}
    };

    const playSelectBeep = () => play8BitTone(2040, 0.045);

    const playConfirmChime = () => {
      play8BitTone(1320, 0.06);
      setTimeout(() => play8BitTone(1760, 0.08), 60);
    };

    const playCancelBuzz = () => {
      play8BitTone(780, 0.07);
      setTimeout(() => play8BitTone(520, 0.09), 60);
    };

    const playVictoryFanfare = () => {
      const notes = [1046, 1318, 1567, 2093];
      notes.forEach((f, idx) => setTimeout(() => play8BitTone(f, 0.09), idx * 80));
    };

    const playChompSound = () => {
      play8BitTone(340, 0.05, "triangle", 0.2);
      setTimeout(() => play8BitTone(480, 0.05, "triangle", 0.2), 80);
    };

    container.innerHTML = `
      <div class="shell-stage">
        <!-- Antenna at Top-Left -->
        <div class="antenna">
          <div class="antenna-cap"></div>
          <div class="antenna-body"></div>
        </div>

        <!-- Ball-Chain on Top-Right -->
        ${ballChainSvg}

        <!-- Pink Bows Shell Body -->
        <div class="egg-shell">
          <!-- Printed Bows on Shell -->
          ${bowSvg("bow-dark-1")}
          ${bowSvg("bow-dark-2")}
          ${bowSvg("bow-white-1")}
          ${bowSvg("bow-white-2")}
          ${bowSvg("bow-pink-1")}

          <!-- Brush Script Logo -->
          <div class="brand-script">Tamagotchi</div>

          <!-- White Shield Bezel -->
          <div class="bezel">
            <!-- Top Tray (4 icons) -->
            <div class="icon-tray top-tray">
              <span class="tam-icon active" data-action="feed" title="Feed">🍴</span>
              <span class="tam-icon" data-action="light" title="Light">💡</span>
              <span class="tam-icon" data-action="game" title="Game">🎮</span>
              <span class="tam-icon" data-action="medicine" title="Medicine">💉</span>
            </div>

            <!-- Vintage LCD Screen -->
            <div class="screen-container" title="Click screen to pet!">
              <canvas class="lcd-canvas" width="64" height="48"></canvas>
            </div>

            <!-- Bottom Tray (4 icons) -->
            <div class="icon-tray bottom-tray">
              <span class="tam-icon" data-action="flush" title="Clean">🧼</span>
              <span class="tam-icon" data-action="stats" title="Meters">📊</span>
              <span class="tam-icon" data-action="praise" title="Praise">🗣️</span>
              <span class="tam-icon" data-action="connect" title="Connect">✉️</span>
            </div>

            <!-- Bezel Bottom Bow Tie -->
            <svg class="bezel-bow" viewBox="0 0 24 16" fill="currentColor">
              <path d="M3 3 C8 7, 8 11, 3 15 C11 12, 11 6, 3 3 Z" />
              <path d="M21 3 C16 7, 16 11, 21 15 C13 12, 13 6, 21 3 Z" />
              <circle cx="12" cy="9" r="3" />
            </svg>
          </div>

          <!-- The 3 Curved Pink Buttons (A, B, C) -->
          <div class="buttons-row">
            <div class="btn-pocket">
              <button class="tam-btn btn-a" type="button" title="Select / Cycle Mode">A</button>
            </div>
            <div class="btn-pocket btn-center">
              <button class="tam-btn btn-b" type="button" title="Confirm / Execute Action">B</button>
            </div>
            <div class="btn-pocket">
              <button class="tam-btn btn-c" type="button" title="Cancel / Back">C</button>
            </div>
          </div>
        </div>
      </div>

      <div class="device-footer">
        <span>🎀 Connection V3 Edition</span>
        <button class="aux-btn btn-sound-toggle" type="button">🔊 Sound</button>
      </div>
    `;

    const canvas = container.querySelector(".lcd-canvas");
    const ctx = canvas.getContext("2d");
    const screenBox = container.querySelector(".screen-container");
    const icons = container.querySelectorAll(".tam-icon");

    // ==========================================
    // BLACK PIXEL-ART BITMAPS (24x24 Water Bear)
    // ==========================================
    const parseBitmap = (rows) => rows.map((r) => r.split("").map((c) => (c === "#" || c === "1" ? 1 : 0)));

    // Frame 1: Idle Stance (Dome head, big round pixel eyes, pupils, tusks, stubby limbs)
    const petF1 = parseBitmap([
      ".......########.........",
      ".....##........##.......",
      "....#............#......",
      "...#...###..###...#.....",
      "..#...#..#..#..#...#....",
      "..#...#..#..#..#...#....",
      "..#....##....##....#....",
      "..#....##....##....#....",
      "...#....#....#....#.....",
      "....#...#....#...#......",
      "..##.#...####...#.##....",
      ".#..#............#..#...",
      ".#..#...######...#..#...",
      "..##...#......#...##....",
      "......#........#........",
      "....##..######..##......",
      "...#...#......#...#.....",
      "...#....######....#.....",
      "....##..........##......",
      "......#........#........",
      ".....#...####...#.......",
      "....#...#....#...#......",
      "....####......####......",
      "........................",
    ]);

    // Frame 2: Step / Hop
    const petF2 = parseBitmap([
      ".......########.........",
      ".....##........##.......",
      "....#............#......",
      "...#...###..###...#.....",
      "..#...#..#..#..#...#....",
      "..#...#..#..#..#...#....",
      "..#....##....##....#....",
      "..#....##....##....#....",
      "...#....#....#....#.....",
      "....#...#....#...#......",
      "..##.#...####...#.##....",
      ".#..#............#..#...",
      ".#..#...######...#..#...",
      "..##...#......#...##....",
      "......#........#........",
      "....##..######..##......",
      "...#...#......#...#.....",
      "...#....######....#.....",
      "....##..........##......",
      "......#........#........",
      "......#..####..#........",
      ".....##.#....#.##.......",
      ".....###......###.......",
      "........................",
    ]);

    // Frame 3: Happy / Nom (Eyes squint ^ ^, smile)
    const petHappy = parseBitmap([
      ".......########.........",
      ".....##........##.......",
      "....#............#......",
      "...#...#......#...#.....",
      "..#...#.#....#.#...#....",
      "..#....#......#....#....",
      "..#................#....",
      "..#....##....##....#....",
      "...#...#.#..#.#...#.....",
      "....#...#....#...#......",
      "..##.#...####...#.##....",
      ".#..#............#..#...",
      ".#..#...######...#..#...",
      "..##...#......#...##....",
      "......#........#........",
      "....##..######..##......",
      "...#...#......#...#.....",
      "...#....######....#.....",
      "....##..........##......",
      "......#........#........",
      ".....#...####...#.......",
      "....#...#....#...#......",
      "....####......####......",
      "........................",
    ]);

    // Frame 4: Sleeping (Eyes - -)
    const petSleep = parseBitmap([
      ".......########.........",
      ".....##........##.......",
      "....#............#......",
      "...#..............#.....",
      "..#................#....",
      "..#...####..####...#....",
      "..#................#....",
      "..#................#....",
      "...#....#....#....#.....",
      "....#...#....#...#......",
      "..##.#...####...#.##....",
      ".#..#............#..#...",
      ".#..#...######...#..#...",
      "..##...#......#...##....",
      "......#........#........",
      "....##..######..##......",
      "...#...#......#...#.....",
      "...#....######....#.....",
      "....##..........##......",
      "......#........#........",
      ".....#...####...#.......",
      "....#...#....#...#......",
      "....####......####......",
      "........................",
    ]);

    // 8x8 Pixel Food: Moss Leaf
    const foodBitmap = parseBitmap([
      "...##...",
      "..####..",
      ".######.",
      ".######.",
      "########",
      "..####..",
      "...##...",
      "....#...",
    ]);

    // 8x8 Pixel Poop
    const poopBitmap = parseBitmap([
      "...##...",
      "..#..#..",
      ".######.",
      "#......#",
      "########",
      "#......#",
      "########",
      "........",
    ]);

    // 7x6 Pixel Heart
    const heartBitmap = parseBitmap([
      ".##.##.",
      "#######",
      "#######",
      ".#####.",
      "..###..",
      "...#...",
    ]);

    const drawBitmap = (bmp, ox, oy, flipX = false, color = "#1a1520") => {
      ctx.fillStyle = color;
      const h = bmp.length;
      const w = bmp[0].length;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (bmp[y][x]) {
            const px = flipX ? ox + (w - 1 - x) : ox + x;
            const py = oy + y;
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    };

    // ==========================================
    // VIRTUAL PET STATE & GAME LOOP
    // ==========================================
    let petX = 20;
    let petY = 22;
    let petDir = 1;
    let animFrame = 0;
    let isEating = false;
    let isSleeping = false;
    let isCelebrating = false;
    let hasPoop = false;
    let showFood = false;
    let showHeart = false;
    let heartTimer = 0;
    let sweepX = -1;
    let subView = null; // null | 'stats' | 'game'
    let gameGuessTarget = null;
    let gameResultText = null;

    let hunger = 3;
    let happy = 3;
    let age = 1;
    let weight = 4;
    let selectedIconIndex = 0;
    const actions = ["feed", "light", "game", "medicine", "flush", "stats", "praise", "connect"];

    const LCD_INK = "#1a1520";
    const LCD_INK_NIGHT = "#9aa4c4";

    const render = () => {
      const inkColor = isSleeping ? LCD_INK_NIGHT : LCD_INK;

      ctx.clearRect(0, 0, 64, 48);

      if (isSleeping) {
        ctx.fillStyle = "#24222f";
        ctx.fillRect(0, 0, 64, 48);
      }

      // Stats Sub-view Screen
      if (subView === "stats") {
        ctx.fillStyle = inkColor;
        ctx.font = "bold 6px monospace";
        ctx.fillText("HUNGER", 4, 12);
        for (let i = 0; i < 4; i++) {
          if (i < hunger) drawBitmap(heartBitmap, 32 + i * 8, 7, false, inkColor);
          else ctx.strokeRect(33 + i * 8, 8, 5, 4);
        }

        ctx.fillText("HAPPY", 4, 24);
        for (let i = 0; i < 4; i++) {
          if (i < happy) drawBitmap(heartBitmap, 32 + i * 8, 19, false, inkColor);
          else ctx.strokeRect(33 + i * 8, 20, 5, 4);
        }

        ctx.fillText(`AGE: ${age}yr`, 4, 36);
        ctx.fillText(`WT:  ${weight}lb`, 4, 44);
        return;
      }

      // Mini-Game Sub-view Screen
      if (subView === "game") {
        ctx.fillStyle = inkColor;
        ctx.font = "bold 6px monospace";
        ctx.fillText(gameResultText || "WHICH WAY?", 10, 10);

        const flip = gameGuessTarget === "left";
        drawBitmap(petF1, 20, 16, flip, inkColor);

        ctx.fillText("◀ A", 6, 42);
        ctx.fillText("B ▶", 42, 42);
        return;
      }

      // Draw Poop
      if (hasPoop) {
        drawBitmap(poopBitmap, 50, 36, false, inkColor);
      }

      // Draw Food
      if (showFood) {
        drawBitmap(foodBitmap, 6, 36, false, inkColor);
      }

      // Choose sprite frame
      let activeBmp = animFrame === 0 ? petF1 : petF2;
      if (isSleeping) activeBmp = petSleep;
      else if (isCelebrating || isEating) activeBmp = petHappy;

      const bounceOffset = isCelebrating ? (animFrame === 1 ? -4 : 0) : 0;
      drawBitmap(activeBmp, petX, petY + bounceOffset, petDir === -1, inkColor);

      // Heart reaction
      if (showHeart) {
        drawBitmap(heartBitmap, petX + (petDir === 1 ? 18 : 0), 10, false, inkColor);
      }

      // Sleeping Zzz
      if (isSleeping && animFrame === 1) {
        ctx.fillStyle = inkColor;
        ctx.font = "bold 6px monospace";
        ctx.fillText("z", petX + 18, 14);
        ctx.fillText("Z", petX + 22, 8);
      }

      // Bath Cleaning Wave
      if (sweepX >= 0) {
        ctx.fillStyle = inkColor;
        ctx.fillRect(sweepX, 0, 4, 48);
      }
    };

    let tickCount = 0;
    const tick = () => {
      tickCount++;
      animFrame = animFrame === 0 ? 1 : 0;

      if (!isSleeping && !isEating && subView === null) {
        if (tickCount % 4 === 0) {
          petX += petDir * 2;
          if (petX >= 36) {
            petX = 36;
            petDir = -1;
          } else if (petX <= 4) {
            petX = 4;
            petDir = 1;
          }
        }
      }

      if (sweepX >= 0) {
        sweepX += 8;
        if (sweepX > 64) {
          sweepX = -1;
          hasPoop = false;
          happy = Math.min(4, happy + 1);
        }
      }

      if (showHeart) {
        heartTimer--;
        if (heartTimer <= 0) showHeart = false;
      }

      render();
    };

    const intervalId = setInterval(tick, 300);

    const highlightIcon = (index) => {
      icons.forEach((ic, idx) => {
        if (idx === index) ic.classList.add("active");
        else ic.classList.remove("active");
      });
    };

    // Button A: Select / Cycle
    const handleButtonA = (e) => {
      e?.stopPropagation();
      initAudio();

      if (subView === "game") {
        resolveGame("left");
        return;
      }
      if (subView === "stats") {
        subView = null;
      }

      selectedIconIndex = (selectedIconIndex + 1) % actions.length;
      highlightIcon(selectedIconIndex);
      playSelectBeep();
      render();
    };

    // Button B: Execute Action
    const handleButtonB = (e) => {
      e?.stopPropagation();
      initAudio();

      if (subView === "game") {
        resolveGame("right");
        return;
      }
      if (subView === "stats") {
        subView = null;
        playCancelBuzz();
        render();
        return;
      }

      const currentAction = actions[selectedIconIndex];
      playConfirmChime();

      if (currentAction === "feed") {
        if (isSleeping) return;
        showFood = true;
        isEating = true;
        petDir = -1;
        playChompSound();

        setTimeout(() => {
          showFood = false;
          isEating = false;
          hunger = Math.min(4, hunger + 1);
          weight += 1;
          showHeart = true;
          heartTimer = 4;
          render();

          if (!hasPoop && Math.random() < 0.45) {
            setTimeout(() => {
              hasPoop = true;
              play8BitTone(280, 0.12, "sawtooth");
              render();
            }, 3000);
          }
        }, 1400);

      } else if (currentAction === "light") {
        isSleeping = !isSleeping;
        screenBox.classList.toggle("is-sleeping", isSleeping);
        render();

      } else if (currentAction === "game") {
        if (isSleeping) return;
        subView = "game";
        gameResultText = "WHICH WAY?";
        gameGuessTarget = null;
        render();

      } else if (currentAction === "medicine") {
        isCelebrating = true;
        showHeart = true;
        heartTimer = 4;
        playConfirmChime();
        setTimeout(() => {
          isCelebrating = false;
          render();
        }, 1200);

      } else if (currentAction === "flush") {
        sweepX = 0;
        play8BitTone(540, 0.25, "sawtooth", 0.1);

      } else if (currentAction === "stats") {
        subView = "stats";
        render();

      } else if (currentAction === "praise" || currentAction === "connect") {
        isCelebrating = true;
        showHeart = true;
        heartTimer = 5;
        happy = Math.min(4, happy + 1);
        playVictoryFanfare();
        setTimeout(() => {
          isCelebrating = false;
          render();
        }, 1200);
      }
    };

    // Button C: Cancel / Return
    const handleButtonC = (e) => {
      e?.stopPropagation();
      initAudio();
      playCancelBuzz();
      if (subView) {
        subView = null;
        render();
      }
    };

    // Mini-Game Resolve
    const resolveGame = (guess) => {
      gameGuessTarget = Math.random() < 0.5 ? "left" : "right";
      if (guess === gameGuessTarget) {
        playVictoryFanfare();
        happy = Math.min(4, happy + 1);
        gameResultText = "WIN! ♥";
      } else {
        playCancelBuzz();
        gameResultText = "MISS!";
      }
      render();

      setTimeout(() => {
        subView = null;
        gameResultText = null;
        gameGuessTarget = null;
        render();
      }, 1200);
    };

    // Direct Screen Petting
    screenBox.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      initAudio();
      isCelebrating = true;
      showHeart = true;
      heartTimer = 5;
      happy = Math.min(4, happy + 1);
      playConfirmChime();
      render();
      setTimeout(() => {
        isCelebrating = false;
        render();
      }, 1200);
    });

    // Wire up buttons
    container.querySelector(".btn-a").addEventListener("pointerdown", handleButtonA);
    container.querySelector(".btn-b").addEventListener("pointerdown", handleButtonB);
    container.querySelector(".btn-c").addEventListener("pointerdown", handleButtonC);

    // Click tray icons directly
    icons.forEach((icon, idx) => {
      icon.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        selectedIconIndex = idx;
        highlightIcon(idx);
        handleButtonB();
      });
    });

    // Sound toggle
    const soundToggle = container.querySelector(".btn-sound-toggle");
    soundToggle.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      soundToggle.textContent = soundEnabled ? "🔊 Sound" : "🔇 Muted";
      if (soundEnabled) playConfirmChime();
    });

    // Cleanup on disconnect
    const observer = new MutationObserver(() => {
      if (!root.isConnected) {
        clearInterval(intervalId);
        observer.disconnect();
      }
    });
    observer.observe(root, { childList: true });

    root.append(style, container);
    render();
  },
};
