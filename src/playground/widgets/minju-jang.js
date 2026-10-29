const defaultNotes = [
  "Hello from the canvas! May your prototypes be full of joy, sweet surprises, and endless creativity 🌸✨",
  "Prototyping principle: Build it cute, test it with kind hands, and let playful magic guide the next revision! 🍓💭",
  "Canvas secret: You can drag any widget around, sprinkle ideas everywhere, and zoom into the details! 🐰⭐",
  "Leave a secret note! Click 'Write' to send warm hugs and cute vibes across the canvas ♡💌",
];

const storage = {
  get(key, fallback) {
    try {
      const val = localStorage.getItem(`mj_env_${key}`);
      return val !== null ? val : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(`mj_env_${key}`, val);
    } catch {
      // ignore
    }
  },
};

export default {
  student: "Minju Jang",
  title: "Interactive Envelope",
  frame: false,
  width: 320,
  height: 260,
  mount(root) {
    const savedTo = storage.get("to", "My Favorite Person ♡");
    const savedEnvNote = storage.get("env_note", "Sending cute vibes! 🌸✨");
    const savedCustomNote = storage.get("custom_note", "");

    const notes = [...defaultNotes];
    if (savedCustomNote) {
      notes.push(savedCustomNote);
    }

    const style = document.createElement("style");
    style.textContent = `
      :host {
        --env-bg: #ffeaf0;
        --env-lining: #ffd5e2;
        --env-flap-side: #ffdbe7;
        --env-flap-bottom: #ffd0de;
        --env-flap-top: #fed9e6;
        --card-bg: #fffbfe;
        --card-border: #ffb6cd;
        --seal-pink: #ff4d79;
        --seal-gradient: radial-gradient(circle at 35% 35%, #ff8ca6, #ff4d79 70%, #d81e4d);
        --seal-shadow: rgba(220, 40, 90, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        user-select: none;
        font-family: "IBM Plex Mono", monospace;
        color: var(--ink);
      }

      .scene {
        position: relative;
        width: 250px;
        height: 220px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        perspective: 900px;
      }

      .envelope {
        position: relative;
        width: 250px;
        height: 136px;
        background: var(--env-bg);
        border-radius: 6px;
        box-shadow: 0 8px 24px var(--seal-shadow), 0 2px 6px rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }

      .envelope.is-open {
        cursor: default;
      }

      /* Inner envelope lining polka-dot pattern */
      .env-lining {
        position: absolute;
        inset: 4px;
        background: var(--env-lining);
        border-radius: 4px;
        background-image:
          radial-gradient(#ff9ebb 20%, transparent 21%),
          radial-gradient(#ff9ebb 20%, transparent 21%);
        background-size: 14px 14px;
        background-position: 0 0, 7px 7px;
        opacity: 0.7;
      }

      /* Letter card */
      .letter {
        position: absolute;
        left: 10px;
        top: 6px;
        width: 230px;
        height: 122px;
        background: var(--card-bg);
        border: 1.5px solid var(--card-border);
        border-radius: 6px;
        box-shadow: 0 3px 10px var(--seal-shadow);
        z-index: 2;
        transform: translateY(0);
        transition: transform 440ms cubic-bezier(0.34, 1.25, 0.64, 1) 180ms, z-index 0ms 220ms;
        display: flex;
        flex-direction: column;
        padding: 7px 10px;
        box-sizing: border-box;
      }

      @media (prefers-reduced-motion: reduce) {
        .letter {
          transition: transform 150ms ease;
        }
      }

      .envelope.is-open .letter {
        transform: translateY(-78px);
        z-index: 7;
        transition: transform 520ms cubic-bezier(0.34, 1.25, 0.64, 1) 180ms, z-index 0ms 220ms;
      }

      .letter-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px dashed var(--card-border);
        padding-bottom: 3px;
        margin-bottom: 5px;
        font-size: 9px;
        letter-spacing: 0.04em;
        opacity: 0.85;
      }

      .postmark-badge {
        display: flex;
        align-items: center;
        gap: 3px;
        font-weight: 600;
        color: #d81e4d;
      }

      .note-counter {
        font-weight: 600;
        background: #ffe3ed;
        color: #d81e4d;
        padding: 1px 6px;
        border-radius: 999px;
        font-size: 8px;
      }

      .letter-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 0;
      }

      .note-text {
        margin: 0;
        font-size: 11px;
        line-height: 1.35;
        font-family: "Faculty Glyphic", sans-serif;
        color: var(--ink);
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }

      .custom-editor {
        display: none;
        width: 100%;
        height: 100%;
      }

      .custom-editor.is-active {
        display: block;
      }

      .custom-input {
        width: 100%;
        height: 48px;
        resize: none;
        font-family: "Faculty Glyphic", sans-serif;
        font-size: 11px;
        line-height: 1.3;
        border: 1px solid var(--card-border);
        background: #fff6f9;
        color: var(--ink);
        padding: 4px 6px;
        border-radius: 4px;
        box-sizing: border-box;
        outline: none;
      }

      .custom-input:focus {
        border-color: #ff4d79;
        box-shadow: 0 0 0 1px #ff4d79;
      }

      .letter-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 3px;
        border-top: 1px dashed var(--card-border);
        margin-top: 3px;
        gap: 4px;
      }

      .btn-action {
        border: 1px solid var(--card-border);
        background: #fff0f5;
        color: var(--ink);
        font: inherit;
        font-size: 9px;
        font-weight: 500;
        padding: 2px 7px;
        border-radius: 999px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        transition: background-color 150ms ease, transform 150ms ease;
      }

      .btn-action:hover {
        background: #ffd6e5;
        transform: translateY(-1px);
      }

      .btn-action:focus-visible {
        outline: 2px solid #ff4d79;
        outline-offset: 1px;
      }

      /* Front pocket SVG */
      .env-pocket {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 3;
        filter: drop-shadow(0 -1px 3px var(--seal-shadow));
      }

      .flap-left { fill: var(--env-flap-side); }
      .flap-right { fill: var(--env-flap-side); }
      .flap-bottom { fill: var(--env-flap-bottom); }

      /* Cute Envelope front ornaments */
      .env-postmark {
        position: absolute;
        top: 7px;
        left: 9px;
        font-size: 7.5px;
        letter-spacing: 0.04em;
        color: #d81e4d;
        opacity: 0.85;
        font-weight: 700;
        pointer-events: none;
        z-index: 4;
        transition: opacity 250ms ease;
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .env-stamp {
        position: absolute;
        top: 6px;
        right: 8px;
        z-index: 4;
        display: flex;
        align-items: center;
        gap: 3px;
        pointer-events: none;
        transition: opacity 250ms ease;
      }

      .stamp-wavy {
        font-size: 8px;
        letter-spacing: 1px;
        opacity: 0.45;
        color: #d81e4d;
        font-family: monospace;
      }

      .stamp-badge {
        width: 24px;
        height: 27px;
        background: #fff5f8;
        border: 1.5px dashed #ff9ebb;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(255, 100, 140, 0.15);
      }

      .stamp-icon {
        font-size: 11px;
        line-height: 1;
      }

      .stamp-denom {
        font-size: 6px;
        font-weight: 800;
        color: #d81e4d;
        letter-spacing: -0.02em;
      }

      /* Envelope front address & writing area */
      .env-address-card {
        position: absolute;
        bottom: 8px;
        left: 10px;
        right: 10px;
        z-index: 4;
        display: flex;
        flex-direction: column;
        gap: 3px;
        transition: opacity 250ms ease;
      }

      .envelope.is-open .env-postmark,
      .envelope.is-open .env-stamp,
      .envelope.is-open .env-address-card {
        opacity: 0;
        pointer-events: none;
      }

      .address-row {
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.7);
        border-bottom: 1px dashed #ff9ebb;
        padding: 1px 5px;
        border-radius: 3px;
      }

      .address-tag {
        font-size: 8px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #d81e4d;
        flex-shrink: 0;
      }

      .env-to-input,
      .env-note-input {
        flex: 1;
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        font-family: "Faculty Glyphic", cursive, sans-serif;
        font-size: 10.5px;
        line-height: 1.2;
        color: var(--ink);
        padding: 0;
        min-width: 0;
      }

      .env-to-input::placeholder,
      .env-note-input::placeholder {
        color: #ff9ebb;
        font-style: italic;
      }

      .env-to-input:focus,
      .env-note-input:focus {
        background: #ffffff;
        box-shadow: 0 0 0 1px #ff8ca6;
        border-radius: 2px;
      }

      .env-hint {
        font-size: 8px;
        text-align: center;
        color: #d81e4d;
        opacity: 0.75;
        margin-top: 1px;
        letter-spacing: 0.03em;
        pointer-events: none;
        font-weight: 500;
      }

      /* Top Flap */
      .top-flap-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 78px;
        transform-origin: top center;
        transform-style: preserve-3d;
        z-index: 5;
        transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      @media (prefers-reduced-motion: reduce) {
        .top-flap-container {
          transition: transform 150ms ease;
        }
      }

      .envelope.is-open .top-flap-container {
        transform: rotateX(180deg);
        z-index: 1;
      }

      .top-flap-svg {
        width: 100%;
        height: 100%;
        display: block;
        filter: drop-shadow(0 2px 4px var(--seal-shadow));
      }

      .flap-top {
        fill: var(--env-flap-top);
      }

      /* Cute Wax Seal */
      .wax-seal {
        position: absolute;
        bottom: -16px;
        left: 50%;
        transform: translateX(-50%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--seal-gradient);
        box-shadow: 0 4px 10px rgba(220, 30, 80, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.6);
        border: 2px solid rgba(255, 255, 255, 0.45);
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;
        z-index: 6;
      }

      .wax-seal:hover {
        transform: translateX(-50%) scale(1.15) rotate(-6deg);
        box-shadow: 0 6px 14px rgba(220, 30, 80, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.7);
      }

      .wax-seal:focus-visible {
        outline: 2px solid #ff4d79;
        outline-offset: 3px;
      }

      .seal-monogram {
        font-size: 16px;
        line-height: 1;
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
      }

      .envelope.is-open .wax-seal {
        pointer-events: none;
      }

      /* Cute Floating emoji burst */
      .sparkle {
        position: absolute;
        pointer-events: none;
        font-size: 16px;
        z-index: 10;
        animation: float-up 850ms cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
      }

      @keyframes float-up {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(0.6) rotate(0deg);
        }
        100% {
          opacity: 0;
          transform: translate(var(--tx), -55px) scale(1.25) rotate(var(--rot));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .sparkle {
          animation: none;
          display: none;
        }
      }
    `;

    root.append(style);

    const scene = document.createElement("div");
    scene.className = "scene";

    scene.innerHTML = `
      <div class="envelope" role="region" aria-label="Cute interactive letter envelope">
        <div class="env-lining"></div>

        <div class="letter" aria-live="polite">
          <div class="letter-header">
            <div class="postmark-badge">
              <span aria-hidden="true">🎀</span>
              <span>SWEET LETTER</span>
            </div>
            <span class="note-counter" aria-label="Note 1 of ${notes.length}">1/${notes.length}</span>
          </div>

          <div class="letter-body">
            <p class="note-text">${notes[0]}</p>
            <div class="custom-editor">
              <textarea class="custom-input" placeholder="Write your sweet note here..." maxlength="140" data-no-drag aria-label="Custom note message"></textarea>
            </div>
          </div>

          <div class="letter-actions">
            <button type="button" class="btn-action btn-next" data-no-drag aria-label="Next note">
              <span aria-hidden="true">↻</span> Next
            </button>
            <button type="button" class="btn-action btn-write" data-no-drag aria-label="Write your own note">
              <span aria-hidden="true">✎</span> Write
            </button>
            <button type="button" class="btn-action btn-close" data-no-drag aria-label="Close and seal envelope">
              <span aria-hidden="true">💌</span> Seal
            </button>
          </div>
        </div>

        <svg class="env-pocket" viewBox="0 0 250 136" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="0,0 125,74 0,136" class="flap-left" />
          <polygon points="250,0 125,74 250,136" class="flap-right" />
          <polygon points="0,136 125,64 250,136" class="flap-bottom" />
        </svg>

        <div class="env-postmark" aria-hidden="true">
          <span>♡ SWEET POST ☁️</span>
        </div>

        <div class="env-stamp" aria-hidden="true">
          <span class="stamp-wavy">≈≈</span>
          <div class="stamp-badge">
            <span class="stamp-icon">🍓</span>
            <span class="stamp-denom">100% CUTE</span>
          </div>
        </div>

        <div class="env-address-card" data-no-drag>
          <div class="address-row to-row">
            <label class="address-tag" for="env-to-field">To: ♡</label>
            <input
              id="env-to-field"
              type="text"
              class="env-to-input"
              value="${savedTo.replace(/"/g, "&quot;")}"
              placeholder="Who is this for? ♡"
              maxlength="26"
              data-no-drag
              aria-label="Recipient on envelope"
            />
          </div>
          <div class="address-row note-row">
            <label class="address-tag" for="env-note-field">Note: ✎</label>
            <input
              id="env-note-field"
              type="text"
              class="env-note-input"
              value="${savedEnvNote.replace(/"/g, "&quot;")}"
              placeholder="Write a sweet note..."
              maxlength="30"
              data-no-drag
              aria-label="Note on envelope"
            />
          </div>
          <div class="env-hint" aria-hidden="true">✦ Click 💌 seal to open ✦</div>
        </div>

        <div class="top-flap-container">
          <svg class="top-flap-svg" viewBox="0 0 250 78" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="0,0 125,78 250,0" class="flap-top" />
          </svg>
          <button type="button" class="wax-seal" data-no-drag aria-label="Open envelope">
            <span class="seal-monogram" aria-hidden="true">💌</span>
          </button>
        </div>
      </div>
    `;

    root.append(scene);

    const envelope = scene.querySelector(".envelope");
    const waxSeal = scene.querySelector(".wax-seal");
    const noteText = scene.querySelector(".note-text");
    const noteCounter = scene.querySelector(".note-counter");
    const btnNext = scene.querySelector(".btn-next");
    const btnWrite = scene.querySelector(".btn-write");
    const btnClose = scene.querySelector(".btn-close");
    const customEditor = scene.querySelector(".custom-editor");
    const customInput = scene.querySelector(".custom-input");
    const envToInput = scene.querySelector(".env-to-input");
    const envNoteInput = scene.querySelector(".env-note-input");

    let currentNoteIndex = 0;
    let isEditing = false;

    // Persist envelope front writing
    const setupEnvelopeInput = (input, storageKey) => {
      input.addEventListener("pointerdown", (e) => e.stopPropagation());
      input.addEventListener("click", (e) => e.stopPropagation());
      input.addEventListener("keydown", (e) => {
        e.stopPropagation();
        if (e.key === "Enter") {
          input.blur();
        }
      });
      input.addEventListener("input", () => {
        storage.set(storageKey, input.value);
      });
    };

    setupEnvelopeInput(envToInput, "to");
    setupEnvelopeInput(envNoteInput, "env_note");

    const createBurst = () => {
      const symbols = ["🎀", "✨", "🌸", "💖", "🍓", "🧸", "☁️", "🌷", "🧁", "💌"];
      for (let i = 0; i < 6; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "sparkle";
        sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        const tx = `${(Math.random() - 0.5) * 90}px`;
        const rot = `${(Math.random() - 0.5) * 60}deg`;
        sparkle.style.setProperty("--tx", tx);
        sparkle.style.setProperty("--rot", rot);
        sparkle.style.left = `calc(50% + ${(Math.random() - 0.5) * 50}px)`;
        sparkle.style.bottom = "60px";
        scene.append(sparkle);
        sparkle.addEventListener("animationend", () => sparkle.remove());
      }
    };

    const openEnvelope = () => {
      if (envelope.classList.contains("is-open")) return;
      envelope.classList.add("is-open");
      createBurst();
    };

    const updateNoteDisplay = () => {
      noteText.textContent = notes[currentNoteIndex];
      noteCounter.textContent = `${currentNoteIndex + 1}/${notes.length}`;
      noteCounter.setAttribute("aria-label", `Note ${currentNoteIndex + 1} of ${notes.length}`);
    };

    const finishEditing = () => {
      if (!isEditing) return;
      isEditing = false;
      customEditor.classList.remove("is-active");
      noteText.style.display = "-webkit-box";

      const val = customInput.value.trim();
      if (val) {
        storage.set("custom_note", val);
        const existingIdx = notes.indexOf(val);
        if (existingIdx !== -1) {
          currentNoteIndex = existingIdx;
        } else {
          notes.push(val);
          currentNoteIndex = notes.length - 1;
        }
        createBurst();
      }
      btnWrite.innerHTML = '<span aria-hidden="true">✎</span> Write';
      updateNoteDisplay();
    };

    const closeEnvelope = () => {
      if (!envelope.classList.contains("is-open")) return;
      if (isEditing) {
        finishEditing();
      }
      envelope.classList.remove("is-open");
    };

    waxSeal.addEventListener("click", (e) => {
      e.stopPropagation();
      openEnvelope();
    });

    btnClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeEnvelope();
    });

    btnNext.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isEditing) {
        finishEditing();
      }
      currentNoteIndex = (currentNoteIndex + 1) % notes.length;
      updateNoteDisplay();
    });

    btnWrite.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isEditing) {
        finishEditing();
      } else {
        isEditing = true;
        noteText.style.display = "none";
        customEditor.classList.add("is-active");
        customInput.value = notes[currentNoteIndex] || "";
        btnWrite.innerHTML = '<span aria-hidden="true">✓</span> Done';
        noteCounter.textContent = "write";
        customInput.focus();
        customInput.select();
      }
    });

    customInput.addEventListener("keydown", (e) => {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        finishEditing();
      }
    });

    // Clicking the envelope body when closed opens it
    envelope.addEventListener("click", (e) => {
      if (!envelope.classList.contains("is-open")) {
        openEnvelope();
      }
    });
  },
};
