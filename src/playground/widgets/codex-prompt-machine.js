const pick = (items) => items[Math.floor(Math.random() * items.length)];

const subjects = [
  "weather report",
  "tiny game",
  "typeface",
  "memory",
  "museum label",
  "window",
  "collection of sounds",
  "cat",
];

const twists = [
  "starts telling the truth",
  "gets a little lost",
  "learns to blush",
  "has a secret second job",
  "refuses to sit still",
  "becomes too dramatic",
  "only works after midnight",
  "wants your advice",
];

const constraints = [
  "using only circles",
  "in under sixty seconds",
  "with one unexpected sound",
  "without using a mouse",
  "that changes with the weather",
  "for someone you miss",
  "with a button that does nothing useful",
  "as a very small website",
];

export default {
  student: "Stephen",
  frame: false,
  title: "What if…?",
  width: 360,
  height: 275,
  rotate: 2,
  mount(root) {
    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        height: 100%;
      }
      .prompt-machine {
        position: relative;
        display: grid;
        grid-template-rows: 1fr auto;
        height: 100%;
        min-height: 0;
        overflow: hidden;
        background: var(--ink);
        color: var(--paper);
      }
      .prompt-machine::before,
      .prompt-machine::after {
        position: absolute;
        border: 1px solid currentColor;
        border-radius: 50%;
        content: "";
        opacity: 0.42;
        pointer-events: none;
      }
      .prompt-machine::before {
        top: -5.5rem;
        right: -4.75rem;
        width: 12rem;
        height: 12rem;
      }
      .prompt-machine::after {
        right: 1.5rem;
        bottom: -6.25rem;
        width: 9rem;
        height: 9rem;
      }
      .copy {
        position: relative;
        z-index: 1;
        padding: 1.15rem 1.2rem 0.75rem;
      }
      .eyebrow {
        margin: 0 0 1.1rem;
        font-size: 0.65rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      output {
        display: block;
        max-width: 15ch;
        font-family: "Faculty Glyphic", Georgia, serif;
        font-size: clamp(1.55rem, 5vw, 2.25rem);
        line-height: 0.93;
        letter-spacing: -0.035em;
      }
      .controls {
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        padding: 0.85rem 1.2rem;
        border-top: 1px solid color-mix(in srgb, currentColor 35%, transparent);
      }
      button {
        padding: 0.5rem 0.75rem;
        border: 1px solid currentColor;
        border-radius: 999px;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 0.7rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background-color 160ms ease, color 160ms ease, transform 160ms ease;
      }
      button:hover {
        background: var(--paper);
        color: var(--ink);
      }
      button:active {
        transform: scale(0.95) rotate(-2deg);
      }
      button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 3px;
      }
      .hint {
        margin: 0;
        font-size: 0.63rem;
        opacity: 0.72;
        text-align: right;
      }
      @media (prefers-reduced-motion: reduce) {
        button { transition: none; }
      }
    `;

    const machine = document.createElement("section");
    machine.className = "prompt-machine";
    machine.innerHTML = `
      <div class="copy">
        <p class="eyebrow">A prompt for making</p>
        <output aria-live="polite"></output>
      </div>
      <div class="controls">
        <button type="button">Shake it up</button>
        <p class="hint">space to shuffle</p>
      </div>
    `;

    const output = machine.querySelector("output");
    const button = machine.querySelector("button");
    const makePrompt = () => {
      output.textContent = `Make a ${pick(subjects)} that ${pick(twists)} — ${pick(constraints)}.`;
    };

    makePrompt();
    button.addEventListener("click", makePrompt);
    machine.addEventListener("keydown", (event) => {
      if (event.key === " " && event.target !== button) {
        event.preventDefault();
        makePrompt();
      }
    });

    root.append(style, machine);
  },
};
