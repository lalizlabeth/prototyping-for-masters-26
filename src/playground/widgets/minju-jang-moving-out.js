const APARTMENTS = [
  {
    id: "brownstone",
    title: "Pre-war Brownstone Studio",
    neighborhood: "Brooklyn Heights",
    rent: "$2,100 / mo",
    sqft: "420 sq ft",
    walkup: "2nd Fl Walkup",
    vibes: "Classic & Cozy 🏛️",
    highlights: ["High ceilings & molding", "Sunny south-facing windows", "Cats allowed 🐱"],
    quirk: "Radiator clanks jazz rhythms at 3 AM 🎺",
    inspect: {
      window: "Huge sunlight pour! Perfect spot for plants 🌿",
      radiator: "Vintage cast-iron heater: warm and dramatic! 🔥",
      floor: "Authentic parquet hardwood: 2-degree cozy slope 🪵",
    },
    bg: "#fff6f0",
    accent: "#e07a5f",
  },
  {
    id: "loft",
    title: "Bushwick Artist Loft",
    neighborhood: "Bushwick",
    rent: "$2,300 / mo",
    sqft: "580 sq ft",
    walkup: "4th Fl Walkup",
    vibes: "Creative & Airy 🎨",
    highlights: ["Massive factory windows", "Exposed rustic brick wall", "Rooftop skyline access 🌆"],
    quirk: "4 flights of stairs (daily leg workout guaranteed 🪜)",
    inspect: {
      window: "Incredible golden hour views of Manhattan skyline! ✨",
      radiator: "Industrial overhead pipe: aesthetic but hot! 💨",
      floor: "Polished concrete: sleek and paint-spill friendly 🎨",
    },
    bg: "#f3f8f2",
    accent: "#40916c",
  },
  {
    id: "village",
    title: "East Village Heritage Flat",
    neighborhood: "East Village",
    rent: "$2,450 / mo",
    sqft: "390 sq ft",
    walkup: "1st Fl (Garden level)",
    vibes: "Lively & Bohemian ☕",
    highlights: ["Steps from SVA & bakeries", "Pocket garden patio 🪴", "Quiet courtyard view"],
    quirk: "Bathtub is in the kitchen (authentic vintage NYC! 🛁)",
    inspect: {
      window: "Looks directly out onto lush patio ivy 🍃",
      radiator: "Clad in retro mint paint: warms up fast! ♨️",
      floor: "Warm terracotta tiles with vintage soul 🏺",
    },
    bg: "#fef8ea",
    accent: "#d4a373",
  },
  {
    id: "micro",
    title: "Chinatown Skyline Micro-Pad",
    neighborhood: "Lower East Side",
    rent: "$1,850 / mo",
    sqft: "280 sq ft",
    walkup: "Elevator Building 🛗",
    vibes: "Efficient & Vibrant 🥟",
    highlights: ["Cheapest rent around", "Laundry in building", "Best soup dumplings downstairs"],
    quirk: "Fits a twin bed, a desk, and one deep breath 🧘",
    inspect: {
      window: "Watch the bridge traffic twinkle after dark 🌉",
      radiator: "Modern mini-split AC/heat unit: dead silent ❄️",
      floor: "Light birch laminate: immaculate and clean ✨",
    },
    bg: "#f2f5fd",
    accent: "#3d5a80",
  },
];

const PACKING_ITEMS = [
  { id: "couch", name: "Loveseat", icon: "🛋️", size: 3, points: 30, color: "#e07a5f" },
  { id: "bed", name: "Mattress", icon: "🛏️", size: 3, points: 30, color: "#3d5a80" },
  { id: "plant", name: "Monstera", icon: "🪴", size: 1, points: 15, color: "#52b788" },
  { id: "boxes", name: "Art Boxes", icon: "📦", size: 2, points: 20, color: "#d4a373" },
  { id: "books", name: "Design Books", icon: "📚", size: 2, points: 20, color: "#8338ec" },
  { id: "mirror", name: "Full Mirror", icon: "🪞", size: 1, points: 15, color: "#48cae4" },
  { id: "espresso", name: "Coffee Bar", icon: "☕", size: 1, points: 15, color: "#b08968" },
  { id: "savvy", name: "Savvy Plush", icon: "🐦", size: 1, points: 20, color: "#0099dd" },
  { id: "pizza", name: "Move Pizza", icon: "🍕", size: 1, points: 15, color: "#e63946" },
];

const TRUCK_SLOTS = 12; // 4 columns x 3 rows

export default {
  student: "Minju Jang",
  title: "Moving Out Game",
  width: 340,
  height: 440,
  frame: true,
  mount(root) {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        user-select: none;
        font-family: "IBM Plex Mono", monospace;
        color: var(--ink, #111);
        background: #fdfbf7;
        overflow: hidden;
        box-sizing: border-box;
      }

      * {
        box-sizing: border-box;
      }

      .game-shell {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 8px 10px;
        position: relative;
        overflow: hidden;
      }

      /* Top Stat Bar */
      .top-hud {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 6px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.15);
        font-size: 9.5px;
        font-weight: 600;
        letter-spacing: 0.02em;
        flex-shrink: 0;
      }

      .stat-pill {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 2px 6px;
        border-radius: 999px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      /* Screen Views */
      .view-panel {
        display: none;
        flex: 1;
        flex-direction: column;
        min-height: 0;
        padding-top: 6px;
        position: relative;
      }

      .view-panel.is-active {
        display: flex;
      }

      /* Intro View */
      .intro-view {
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 10px;
        padding: 12px 10px;
      }

      .intro-hero {
        font-size: 42px;
        animation: bobble 2s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
      }

      @keyframes bobble {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }

      .intro-title {
        font-family: "Faculty Glyphic", sans-serif;
        font-size: 18px;
        font-weight: 700;
        color: #d9483b;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .intro-desc {
        font-size: 11px;
        line-height: 1.4;
        color: #555;
        max-width: 260px;
        margin: 0;
      }

      .btn-primary {
        font-family: inherit;
        font-size: 11px;
        font-weight: 600;
        color: #ffffff;
        background: #d9483b;
        border: 0;
        padding: 8px 16px;
        border-radius: 999px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 3px 8px rgba(217, 72, 59, 0.35);
        transition: transform 150ms ease, background-color 150ms ease;
      }

      .btn-primary:hover {
        background: #bf392d;
        transform: translateY(-1px);
      }

      .btn-primary:active {
        transform: translateY(1px);
      }

      .btn-primary:focus-visible {
        outline: 2px solid #d9483b;
        outline-offset: 2px;
      }

      /* House Hunt View */
      .hunt-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        padding: 8px 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        min-height: 0;
        overflow: hidden;
      }

      .apt-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
        padding-bottom: 4px;
        margin-bottom: 6px;
      }

      .apt-title {
        font-family: "Faculty Glyphic", sans-serif;
        font-size: 13px;
        font-weight: 700;
        margin: 0;
        color: var(--ink);
      }

      .apt-sub {
        font-size: 9px;
        color: #777;
        margin-top: 1px;
      }

      .apt-price {
        font-size: 12px;
        font-weight: 700;
        color: #2b9348;
        background: #e8f5e9;
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
      }

      /* Mini Apartment Blueprint / Graphic */
      .apt-blueprint {
        position: relative;
        height: 100px;
        background: var(--apt-bg, #f4f6fa);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 6px;
        margin-bottom: 6px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 4px;
      }

      .blueprint-node {
        background: rgba(255, 255, 255, 0.9);
        border: 1px dashed rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        padding: 4px 6px;
        font-size: 10px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
        transition: transform 150ms ease, border-color 150ms ease;
      }

      .blueprint-node:hover {
        transform: translateY(-2px);
        border-color: #d9483b;
        background: #fff;
      }

      .node-emoji {
        font-size: 16px;
      }

      .node-label {
        font-size: 8px;
        font-weight: 600;
        opacity: 0.75;
      }

      .inspect-banner {
        font-size: 9.5px;
        line-height: 1.3;
        color: #1e3a8a;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        border-radius: 4px;
        padding: 4px 6px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .apt-bullets {
        margin: 0;
        padding: 0 0 0 14px;
        font-size: 9px;
        line-height: 1.4;
        color: #444;
      }

      .apt-quirk {
        margin-top: 4px;
        font-size: 8.5px;
        color: #b45309;
        background: #fffbeb;
        padding: 3px 6px;
        border-radius: 4px;
        border-left: 2.5px solid #f59e0b;
      }

      .hunt-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 6px;
        padding-top: 4px;
      }

      .btn-secondary {
        font-family: inherit;
        font-size: 10px;
        font-weight: 600;
        color: var(--ink);
        background: #f1f3f5;
        border: 1px solid rgba(0, 0, 0, 0.12);
        padding: 6px 12px;
        border-radius: 999px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: background-color 150ms ease;
      }

      .btn-secondary:hover {
        background: #e9ecef;
      }

      /* Packing Truck Game View */
      .packing-view {
        gap: 6px;
      }

      .truck-deck-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 9.5px;
        font-weight: 600;
      }

      .truck-cargo-bed {
        position: relative;
        background: #e9ecef;
        border: 2px solid #adb5bd;
        border-radius: 6px;
        padding: 6px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(3, 40px);
        gap: 4px;
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.12);
      }

      .cargo-slot {
        background: rgba(255, 255, 255, 0.65);
        border: 1px dashed #ced4da;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 150ms ease, transform 100ms ease;
      }

      .cargo-slot:hover {
        background: rgba(255, 255, 255, 0.95);
      }

      .cargo-slot.is-filled {
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      }

      /* Conveyor Staging Area */
      .staging-area {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .staging-label {
        font-size: 8.5px;
        font-weight: 600;
        text-transform: uppercase;
        color: #666;
        letter-spacing: 0.04em;
      }

      .items-carousel {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .item-chip {
        flex-shrink: 0;
        background: #ffffff;
        border: 1.5px solid rgba(0, 0, 0, 0.12);
        border-radius: 6px;
        padding: 4px 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 9px;
        font-weight: 600;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        transition: transform 120ms ease, border-color 120ms ease;
      }

      .item-chip:hover {
        transform: translateY(-1px);
        border-color: #d9483b;
      }

      .item-chip.is-packed {
        opacity: 0.4;
        pointer-events: none;
        text-decoration: line-through;
        filter: grayscale(1);
      }

      /* Settled In / Celebration View */
      .settled-view {
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 8px;
        padding: 6px;
      }

      .room-scene {
        position: relative;
        width: 100%;
        height: 150px;
        background: #fefae0;
        border: 1.5px solid #ccd5ae;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .room-items {
        font-size: 26px;
        display: flex;
        gap: 10px;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.1));
      }

      .fairy-lights {
        position: absolute;
        top: 6px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 200ms ease;
      }

      .fairy-lights.is-glowing {
        opacity: 1;
        filter: drop-shadow(0 0 6px #ffd166);
      }

      .celebration-title {
        font-family: "Faculty Glyphic", sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #2b9348;
        margin: 0;
      }

      .celebration-summary {
        font-size: 10px;
        line-height: 1.4;
        color: #444;
        max-width: 280px;
        margin: 0;
      }

      /* Floating Sparkles & Confetti */
      .sparkle {
        position: absolute;
        pointer-events: none;
        font-size: 16px;
        z-index: 50;
        animation: float-rise 800ms cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
      }

      @keyframes float-rise {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(0.6);
        }
        100% {
          opacity: 0;
          transform: translate(var(--tx), -55px) scale(1.25) rotate(var(--rot));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .intro-hero, .sparkle {
          animation: none;
        }
      }
    `;

    root.append(style);

    const shell = document.createElement("div");
    shell.className = "game-shell";
    shell.innerHTML = `
      <div class="top-hud">
        <span class="stat-pill">💵 <span class="val-budget">$2,400</span></span>
        <span class="stat-pill">⚡ <span class="val-energy">100%</span></span>
        <span class="stat-pill">💖 <span class="val-sanity">100%</span></span>
      </div>

      <!-- VIEW 1: INTRO -->
      <div class="view-panel intro-view is-active">
        <div class="intro-hero" aria-hidden="true">🚚📦🔑</div>
        <h2 class="intro-title">Moving Out!</h2>
        <p class="intro-desc">
          Browse quirky NYC apartments, inspect rooms, pack the moving truck, and settle into your new home!
        </p>
        <button type="button" class="btn-primary btn-start-hunt" data-no-drag aria-label="Start house hunt">
          <span>Search Apartments</span> <span>🔍</span>
        </button>
      </div>

      <!-- VIEW 2: HOUSE HUNT -->
      <div class="view-panel hunt-view">
        <div class="hunt-card">
          <div class="apt-header">
            <div>
              <h3 class="apt-title">Pre-war Brownstone Studio</h3>
              <div class="apt-sub">Brooklyn Heights • 2nd Fl Walkup</div>
            </div>
            <span class="apt-price">$2,100 / mo</span>
          </div>

          <div class="apt-blueprint" style="--apt-bg: #fff6f0">
            <button type="button" class="blueprint-node node-window" data-no-drag aria-label="Inspect window">
              <span class="node-emoji">🪟</span>
              <span class="node-label">Window</span>
            </button>
            <button type="button" class="blueprint-node node-radiator" data-no-drag aria-label="Inspect radiator">
              <span class="node-emoji">♨️</span>
              <span class="node-label">Radiator</span>
            </button>
            <button type="button" class="blueprint-node node-floor" data-no-drag aria-label="Inspect floor">
              <span class="node-emoji">🪵</span>
              <span class="node-label">Floors</span>
            </button>
          </div>

          <div class="inspect-banner" aria-live="polite">
            <span>🔍</span>
            <span class="inspect-text">Click room spots above to inspect quirks!</span>
          </div>

          <ul class="apt-bullets">
            <li>High ceilings & molding</li>
            <li>Sunny south-facing windows</li>
            <li>Cats allowed 🐱</li>
          </ul>

          <div class="apt-quirk">
            <span>⚠️ Quirk: </span><span class="quirk-text">Radiator clanks jazz rhythms at 3 AM 🎺</span>
          </div>
        </div>

        <div class="hunt-controls">
          <button type="button" class="btn-secondary btn-next-apt" data-no-drag aria-label="Skip to next listing">
            <span>Skip ➡️</span>
          </button>
          <button type="button" class="btn-primary btn-sign-lease" data-no-drag aria-label="Sign lease and pack truck">
            <span>Sign Lease ✍️🔑</span>
          </button>
        </div>
      </div>

      <!-- VIEW 3: TRUCK PACKING -->
      <div class="view-panel packing-view">
        <div class="truck-deck-header">
          <span>🚚 Moving Truck Cargo</span>
          <span>Space: <span class="val-truck-filled">0</span>/${TRUCK_SLOTS}</span>
        </div>

        <div class="truck-cargo-bed" data-no-drag aria-label="Truck cargo bed">
          <!-- 12 slots generated dynamically -->
        </div>

        <div class="staging-area">
          <span class="staging-label">Pack Your Essentials (Tap to load):</span>
          <div class="items-carousel" data-no-drag>
            <!-- item chips generated dynamically -->
          </div>
        </div>

        <div class="hunt-controls">
          <button type="button" class="btn-secondary btn-reset-truck" data-no-drag aria-label="Unpack truck">
            <span>Unload 🔄</span>
          </button>
          <button type="button" class="btn-primary btn-finish-move" data-no-drag aria-label="Complete move">
            <span>Drive to New Home 🚚💨</span>
          </button>
        </div>
      </div>

      <!-- VIEW 4: SETTLED IN VICTORY -->
      <div class="view-panel settled-view">
        <div class="fairy-lights is-glowing" data-no-drag title="Click to toggle fairy lights" aria-label="Fairy lights">
          <span>✨</span><span>💡</span><span>✨</span><span>💡</span><span>✨</span>
        </div>

        <div class="room-scene">
          <div class="room-items" aria-hidden="true">
            <span title="Loveseat">🛋️</span>
            <span title="Monstera plant">🪴</span>
            <span title="Savvy mascot">🐦</span>
            <span title="First night pizza">🍕</span>
          </div>
        </div>

        <h3 class="celebration-title">🎉 Officially Moved In!</h3>
        <p class="celebration-summary">
          You conquered NYC moving day! Keys in hand, pizza on the floor, and fairy lights glowing. Welcome home!
        </p>

        <div class="hunt-controls">
          <button type="button" class="btn-secondary btn-party" data-no-drag aria-label="Celebrate">
            <span>Toss Confetti 🎊</span>
          </button>
          <button type="button" class="btn-primary btn-play-again" data-no-drag aria-label="Play again">
            <span>Play Again 🔄</span>
          </button>
        </div>
      </div>
    `;

    root.append(shell);

    // State
    let currentAptIndex = 0;
    let budget = 2400;
    let energy = 100;
    let sanity = 100;
    let packedItems = []; // list of item objects currently in truck
    let chosenApt = APARTMENTS[0];

    // Selectors
    const valBudget = shell.querySelector(".val-budget");
    const valEnergy = shell.querySelector(".val-energy");
    const valSanity = shell.querySelector(".val-sanity");

    const introView = shell.querySelector(".intro-view");
    const huntView = shell.querySelector(".hunt-view");
    const packingView = shell.querySelector(".packing-view");
    const settledView = shell.querySelector(".settled-view");

    const btnStartHunt = shell.querySelector(".btn-start-hunt");
    const btnNextApt = shell.querySelector(".btn-next-apt");
    const btnSignLease = shell.querySelector(".btn-sign-lease");
    const btnResetTruck = shell.querySelector(".btn-reset-truck");
    const btnFinishMove = shell.querySelector(".btn-finish-move");
    const btnParty = shell.querySelector(".btn-party");
    const btnPlayAgain = shell.querySelector(".btn-play-again");

    const aptTitle = shell.querySelector(".apt-title");
    const aptSub = shell.querySelector(".apt-sub");
    const aptPrice = shell.querySelector(".apt-price");
    const aptBlueprint = shell.querySelector(".apt-blueprint");
    const inspectText = shell.querySelector(".inspect-text");
    const aptBullets = shell.querySelector(".apt-bullets");
    const quirkText = shell.querySelector(".quirk-text");

    const nodeWindow = shell.querySelector(".node-window");
    const nodeRadiator = shell.querySelector(".node-radiator");
    const nodeFloor = shell.querySelector(".node-floor");

    const truckBed = shell.querySelector(".truck-cargo-bed");
    const itemsCarousel = shell.querySelector(".items-carousel");
    const valTruckFilled = shell.querySelector(".val-truck-filled");
    const fairyLights = shell.querySelector(".fairy-lights");

    const burstConfetti = () => {
      const symbols = ["🎊", "✨", "🍕", "📦", "🔑", "🪴", "💖", "🛋️"];
      for (let i = 0; i < 6; i++) {
        const span = document.createElement("span");
        span.className = "sparkle";
        span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        span.style.left = `calc(50% + ${(Math.random() - 0.5) * 80}px)`;
        span.style.bottom = "80px";
        span.style.setProperty("--tx", `${(Math.random() - 0.5) * 90}px`);
        span.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);
        shell.append(span);
        span.addEventListener("animationend", () => span.remove());
      }
    };

    const updateHud = () => {
      valBudget.textContent = `$${budget.toLocaleString()}`;
      valEnergy.textContent = `${Math.max(0, energy)}%`;
      valSanity.textContent = `${Math.max(0, sanity)}%`;
    };

    const setView = (viewEl) => {
      [introView, huntView, packingView, settledView].forEach((v) => v.classList.remove("is-active"));
      viewEl.classList.add("is-active");
    };

    const renderApartment = () => {
      const apt = APARTMENTS[currentAptIndex];
      chosenApt = apt;
      aptTitle.textContent = apt.title;
      aptSub.textContent = `${apt.neighborhood} • ${apt.walkup} • ${apt.sqft}`;
      aptPrice.textContent = apt.rent;
      aptBlueprint.style.setProperty("--apt-bg", apt.bg);
      inspectText.textContent = `Inspecting ${apt.neighborhood} studio... Click room spots!`;
      quirkText.textContent = apt.quirk;

      aptBullets.innerHTML = "";
      apt.highlights.forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h;
        aptBullets.append(li);
      });
    };

    // Node Inspect Handlers
    nodeWindow.addEventListener("click", (e) => {
      e.stopPropagation();
      const apt = APARTMENTS[currentAptIndex];
      inspectText.textContent = `Window: ${apt.inspect.window}`;
      energy = Math.max(10, energy - 2);
      updateHud();
    });

    nodeRadiator.addEventListener("click", (e) => {
      e.stopPropagation();
      const apt = APARTMENTS[currentAptIndex];
      inspectText.textContent = `Radiator: ${apt.inspect.radiator}`;
      energy = Math.max(10, energy - 2);
      updateHud();
    });

    nodeFloor.addEventListener("click", (e) => {
      e.stopPropagation();
      const apt = APARTMENTS[currentAptIndex];
      inspectText.textContent = `Flooring: ${apt.inspect.floor}`;
      energy = Math.max(10, energy - 2);
      updateHud();
    });

    // Navigation in Hunt
    btnStartHunt.addEventListener("click", (e) => {
      e.stopPropagation();
      currentAptIndex = 0;
      renderApartment();
      setView(huntView);
    });

    btnNextApt.addEventListener("click", (e) => {
      e.stopPropagation();
      currentAptIndex = (currentAptIndex + 1) % APARTMENTS.length;
      energy = Math.max(10, energy - 5);
      sanity = Math.max(10, sanity - 3);
      updateHud();
      renderApartment();
    });

    btnSignLease.addEventListener("click", (e) => {
      e.stopPropagation();
      burstConfetti();
      sanity = Math.min(100, sanity + 15);
      updateHud();
      initTruckPacking();
      setView(packingView);
    });

    // -------------------------------------------------------------
    // Truck Packing Mini-Game Logic
    // -------------------------------------------------------------
    const initTruckPacking = () => {
      packedItems = [];
      renderTruck();
      renderStagingItems();
    };

    const getOccupiedCount = () => packedItems.reduce((acc, it) => acc + it.size, 0);

    const renderTruck = () => {
      truckBed.innerHTML = "";
      const occupied = getOccupiedCount();
      valTruckFilled.textContent = occupied;

      // Fill in packed items
      let slotIndex = 0;
      packedItems.forEach((item) => {
        for (let s = 0; s < item.size; s++) {
          const slot = document.createElement("div");
          slot.className = "cargo-slot is-filled";
          slot.textContent = s === 0 ? item.icon : "📦";
          slot.title = `${item.name} (Tap to unload)`;
          slot.addEventListener("click", (e) => {
            e.stopPropagation();
            // Unload this item
            packedItems = packedItems.filter((it) => it !== item);
            renderTruck();
            renderStagingItems();
          });
          truckBed.append(slot);
          slotIndex++;
        }
      });

      // Remaining empty slots
      while (slotIndex < TRUCK_SLOTS) {
        const emptySlot = document.createElement("div");
        emptySlot.className = "cargo-slot";
        emptySlot.textContent = "·";
        truckBed.append(emptySlot);
        slotIndex++;
      }
    };

    const renderStagingItems = () => {
      itemsCarousel.innerHTML = "";
      PACKING_ITEMS.forEach((item) => {
        const isPacked = packedItems.some((it) => it.id === item.id);
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `item-chip ${isPacked ? "is-packed" : ""}`;
        chip.setAttribute("data-no-drag", "");
        chip.innerHTML = `<span>${item.icon}</span> <span>${item.name}</span> <small>(${item.size}u)</small>`;

        chip.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isPacked) return;
          if (getOccupiedCount() + item.size > TRUCK_SLOTS) {
            burstConfetti();
            alert("Truck is too full! Unload something first 🚚📦");
            return;
          }
          packedItems.push(item);
          energy = Math.max(5, energy - 4);
          updateHud();
          renderTruck();
          renderStagingItems();
        });

        itemsCarousel.append(chip);
      });
    };

    btnResetTruck.addEventListener("click", (e) => {
      e.stopPropagation();
      packedItems = [];
      renderTruck();
      renderStagingItems();
    });

    btnFinishMove.addEventListener("click", (e) => {
      e.stopPropagation();
      if (getOccupiedCount() < 4) {
        alert("Pack at least a few essentials into the truck before hitting the road! 📦");
        return;
      }
      burstConfetti();
      setView(settledView);
    });

    // -------------------------------------------------------------
    // Settled View Handlers
    // -------------------------------------------------------------
    fairyLights.addEventListener("click", (e) => {
      e.stopPropagation();
      fairyLights.classList.toggle("is-glowing");
    });

    btnParty.addEventListener("click", (e) => {
      e.stopPropagation();
      burstConfetti();
    });

    btnPlayAgain.addEventListener("click", (e) => {
      e.stopPropagation();
      budget = 2400;
      energy = 100;
      sanity = 100;
      currentAptIndex = 0;
      updateHud();
      setView(introView);
    });

    updateHud();
  },
};
