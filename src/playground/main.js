import "../styles.css";
import "./playground.css";
import { inject } from "@vercel/analytics";
import { bindPalette } from "../palette.js";
import { loadWidgets } from "./widgets.js";
import { mountPlayground } from "./canvas.js";

document.documentElement.classList.add("is-playground");

const playground = mountPlayground(document.querySelector("#app"), []);

bindPalette({
  button: playground.paletteButton,
  favicon: document.querySelector("#favicon"),
});
inject();

loadWidgets().then((widgets) => playground.setWidgets(widgets));
