import pepeUrl from "./tiffany-huang-pepe.webp";

const CHIMES = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.0,  // A5
  1046.5, // C6
  1174.66 // D6
];

const PHRASES = [
  "JAMMING! 🎵",
  "FEEL THE BEAT! ✨",
  "PARTY PEEPO! 🎉",
  "BOB BOB! 🐸",
  "BOOSTED! ⚡",
  "VIBING~ 💖",
  "LET'S GOOO! 💃",
  "MAX HYPED! 🔥"
];

const PARTICLES = ["✨", "🎵", "🎶", "💖", "⭐", "🎉", "🐸"];

export default {
  student: "Shuotong Huang (Tiffany)",
  title: "Peepo Jam",
  frame: false,
  width: 240,
  height: 270,
  rotate: -3,
  mount(root) {
    let audioCtx = null;
    let noteIndex = 0;
    let clickCount = 0;
    let feverTimer = null;
    let soundEnabled = true;

    const playChime = () => {
      if (!soundEnabled) return;
      try {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        if (!audioCtx) return;

        const freq = CHIMES[noteIndex % CHIMES.length];
        noteIndex += 1;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Cheerful bell / pluck synth
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.12);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.36);
      } catch {
        // AudioContext gracefully no-op
      }
    };

    root.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          user-select: none;
        }

        .widget-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .peepo-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .peepo-btn:focus-visible {
          outline: 2px dashed currentColor;
          outline-offset: 4px;
          border-radius: 16px;
        }

        .bubble {
          position: absolute;
          top: 6px;
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--ink, #1d1a4a);
          color: var(--paper, #ffffff);
          font-family: "Faculty Glyphic", sans-serif;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.2;
          white-space: nowrap;
          box-shadow: 0 4px 12px color-mix(in srgb, var(--ink, #000) 18%, transparent);
          transform-origin: center bottom;
          transform: translateY(0) scale(1);
          transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
          z-index: 5;
        }

        .bubble::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px 5px 0 5px;
          border-style: solid;
          border-color: var(--ink, #1d1a4a) transparent transparent transparent;
        }

        .bubble.pop {
          animation: bubble-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .character-container {
          position: relative;
          width: 190px;
          height: 190px;
          transform-origin: 50% 88%;
          animation: peepo-groove 1.1s ease-in-out infinite alternate;
        }

        .peepo-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 8px 16px color-mix(in srgb, var(--ink, #000) 22%, transparent));
          pointer-events: none;
        }

        /* Hyped / Fever mode animation */
        .peepo-btn.is-fever .character-container {
          animation: peepo-fever 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite alternate;
        }

        .peepo-btn:active .character-container {
          transform: scale(0.92, 1.08) translateY(-4px);
        }

        /* Particles */
        .particle {
          position: absolute;
          font-size: 20px;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          z-index: 10;
          animation: float-away 900ms ease-out forwards;
        }

        /* Sound toggle button */
        .sound-toggle {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 26px;
          height: 26px;
          padding: 0;
          border: 1px solid color-mix(in srgb, var(--ink, #000) 20%, transparent);
          border-radius: 50%;
          background: var(--paper, #fff);
          color: var(--ink, #1d1a4a);
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.65;
          transition: opacity 150ms ease, transform 150ms ease;
          z-index: 6;
        }

        .sound-toggle:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        /* Animations */
        @keyframes peepo-groove {
          0% {
            transform: translateY(0) rotate(-7deg) scale(1, 1);
          }
          30% {
            transform: translateY(-9px) rotate(-2deg) scale(0.96, 1.04);
          }
          70% {
            transform: translateY(-9px) rotate(2deg) scale(0.96, 1.04);
          }
          100% {
            transform: translateY(0) rotate(7deg) scale(1, 1);
          }
        }

        @keyframes peepo-fever {
          0% {
            transform: translateY(0) rotate(-11deg) scale(1.05, 0.95);
          }
          50% {
            transform: translateY(-16px) rotate(0deg) scale(0.93, 1.08);
          }
          100% {
            transform: translateY(0) rotate(11deg) scale(1.05, 0.95);
          }
        }

        @keyframes bubble-pop {
          0% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-6px) scale(1.18);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float-away {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
          }
          30% {
            opacity: 1;
            transform: translate(var(--dx, -10px), -24px) scale(1.2) rotate(var(--rot, -15deg));
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--dx, -10px) * 1.8), -65px) scale(0.8) rotate(calc(var(--rot, -15deg) * 2));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .character-container,
          .peepo-btn.is-fever .character-container,
          .bubble.pop,
          .particle {
            animation: none !important;
          }
        }
      </style>

      <div class="widget-wrap">
        <button
          type="button"
          class="peepo-btn"
          aria-label="Peepo Jam. Click to dance with Peepo and boost the beat!"
        >
          <div class="bubble">vibing~ 🎵</div>
          <div class="character-container">
            <img
              class="peepo-img"
              src="${pepeUrl}"
              alt="Peepo with hands on head happily dancing"
              width="190"
              height="190"
              draggable="false"
            />
          </div>
        </button>
        <button
          type="button"
          class="sound-toggle"
          title="Toggle chime sound"
          aria-label="Toggle chime sound"
        >
          🔔
        </button>
      </div>
    `;

    const wrap = root.querySelector(".widget-wrap");
    const btn = root.querySelector(".peepo-btn");
    const bubble = root.querySelector(".bubble");
    const soundToggle = root.querySelector(".sound-toggle");

    // Spawn floating particle
    const spawnParticle = (originX, originY) => {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = PARTICLES[Math.floor(Math.random() * PARTICLES.length)];

      const dx = (Math.random() - 0.5) * 60;
      const rot = (Math.random() - 0.5) * 50;
      p.style.setProperty("--dx", `${dx}px`);
      p.style.setProperty("--rot", `${rot}deg`);

      // Position relative to wrap
      const rect = wrap.getBoundingClientRect();
      const x = originX ? originX - rect.left : rect.width / 2 + (Math.random() - 0.5) * 40;
      const y = originY ? originY - rect.top - 20 : rect.height / 2;

      p.style.left = `${Math.max(10, Math.min(rect.width - 30, x))}px`;
      p.style.top = `${Math.max(20, Math.min(rect.height - 40, y))}px`;

      wrap.appendChild(p);
      p.addEventListener("animationend", () => p.remove(), { once: true });
    };

    // Sound toggle
    soundToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      soundEnabled = !soundEnabled;
      soundToggle.textContent = soundEnabled ? "🔔" : "🔕";
      soundToggle.title = soundEnabled ? "Chime sound enabled" : "Chime sound muted";
    });

    // Main interaction
    btn.addEventListener("click", (event) => {
      clickCount += 1;
      playChime();

      // Trigger fever mode
      btn.classList.add("is-fever");
      clearTimeout(feverTimer);
      feverTimer = setTimeout(() => {
        btn.classList.remove("is-fever");
      }, 1600);

      // Bubble phrase
      bubble.textContent = PHRASES[clickCount % PHRASES.length];
      bubble.classList.remove("pop");
      void bubble.offsetWidth;
      bubble.classList.add("pop");

      // Spawn 2-3 playful particles
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          spawnParticle(event.clientX, event.clientY);
        }, i * 70);
      }
    });
  },
};
