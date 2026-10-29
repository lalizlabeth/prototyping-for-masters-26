import "../styles.css";
import "./playground.css";
import { inject } from "@vercel/analytics";
import { bindPalette } from "../palette.js";
import { widgets } from "./widgets.js";
import { mountPlayground } from "./canvas.js";

document.documentElement.classList.add("is-playground");

const { paletteButton } = mountPlayground(document.querySelector("#app"), widgets);

bindPalette({
  button: paletteButton,
  favicon: document.querySelector("#favicon"),
});
inject();
