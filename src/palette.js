export const palettes = [
  { name: "White on black", foreground: "#ffffff", background: "#000000" },
  { name: "Blue on butter", foreground: "#1735c7", background: "#f4ef8a" },
  { name: "Forest on peach", foreground: "#174331", background: "#ffb19e" },
  { name: "Aubergine on pink", foreground: "#38104d", background: "#ff8fc8" },
  { name: "Plum on acid", foreground: "#641045", background: "#d1ff6a" },
  { name: "Rust on sky", foreground: "#9e321b", background: "#bfe4ff" },
];

export const paletteStorageKey = "color-palette";

const normalizeIndex = (index) =>
  ((Number(index) % palettes.length) + palettes.length) % palettes.length;

const readStoredPalette = () => {
  try {
    const raw = localStorage.getItem(paletteStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const readPaletteIndex = () => {
  const index = Number(readStoredPalette()?.index);
  return Number.isInteger(index) ? normalizeIndex(index) : 0;
};

export const applyPalette = (index, { button, favicon } = {}) => {
  const paletteIndex = normalizeIndex(index);
  const palette = palettes[paletteIndex];
  const root = document.documentElement;
  root.style.setProperty("--ink", palette.foreground);
  root.style.setProperty("--paper", palette.background);
  try {
    localStorage.setItem(
      paletteStorageKey,
      JSON.stringify({
        index: paletteIndex,
        foreground: palette.foreground,
        background: palette.background,
      }),
    );
  } catch {
    // Ignore storage failures (private mode, disabled storage).
  }
  if (favicon) {
    const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${palette.background}"/></svg>`;
    favicon.href = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
  }
  if (button) button.setAttribute("title", palette.name);
  return palette;
};

export const nextPaletteIndex = (index) => normalizeIndex(index + 1);

export const bindPalette = ({ button, favicon } = {}) => {
  let paletteIndex = readPaletteIndex();

  const showPalette = (index) => {
    paletteIndex = normalizeIndex(index);
    applyPalette(paletteIndex, { button, favicon });
  };

  button?.addEventListener("click", () => {
    showPalette(nextPaletteIndex(paletteIndex));
  });

  showPalette(paletteIndex);
};
