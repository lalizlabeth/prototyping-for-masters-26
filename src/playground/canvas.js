import { mastheadMarkup } from "../masthead.js";

const MIN_SCALE = 0.1;
const MAX_SCALE = 2.5;
const ZOOM_WHEEL = 0.004;
const ZOOM_STEP = 1.5;
const PAN_STEP = 96;
const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 220;
const GRID = 28;
const CREDIT_SPACE = 32;
const PLACE_ATTEMPTS = 72;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hashString = (value) => {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createRng = (seed) => () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const boxesOverlap = (a, b, gap) => (
  a.x < b.x + b.width + gap
  && a.x + a.width + gap > b.x
  && a.y < b.y + b.footprint + gap
  && a.y + a.footprint + gap > b.y
);

// Widgets without both x and y scatter across a field sized to the current viewport.
const layoutWidgets = (widgets, viewW = 1280, viewH = 800) => {
  const boxes = widgets.map((widget, index) => {
    const framed = widget.frame !== false;
    const height = Number.isFinite(widget.height) ? widget.height : DEFAULT_HEIGHT;
    return {
      x: Number.isFinite(widget.x) ? widget.x : null,
      y: Number.isFinite(widget.y) ? widget.y : null,
      width: Number.isFinite(widget.width) ? widget.width : DEFAULT_WIDTH,
      height,
      framed,
      rotate: Number.isFinite(widget.rotate) ? widget.rotate : 0,
      footprint: height + CREDIT_SPACE,
      seed: hashString(`${widget.student}\0${widget.title}\0${index}`),
    };
  });
  const placed = boxes.filter((box) => box.x !== null && box.y !== null);
  const auto = boxes.filter((box) => box.x === null || box.y === null);
  if (auto.length === 0) return boxes;

  const width = Math.max(viewW, 320);
  const height = Math.max(viewH, 240);
  const desktop = width >= 800;
  const gap = desktop ? 72 : 36;
  const occupancy = boxes.reduce((sum, box) => sum + (box.width + gap) * (box.footprint + gap), 0);
  const density = desktop ? 0.4 : 0.58;
  const needed = occupancy / density;
  const aspect = (width / height) * (desktop ? 1.35 : 1);
  let worldW = Math.sqrt(needed * aspect);
  let worldH = needed / worldW;
  worldW = Math.max(worldW, width * (desktop ? 1.2 : 0.92));
  worldH = Math.max(worldH, height * (desktop ? 0.7 : 0.85));
  worldW = Math.min(worldW, width / MIN_SCALE);
  worldH = Math.min(worldH, height / MIN_SCALE);

  const originY = placed.length
    ? Math.max(...placed.map((box) => box.y + box.footprint)) + gap * 2
    : 0;

  auto.sort((a, b) => (b.width * b.footprint) - (a.width * a.footprint));
  auto.forEach((box) => {
    const rng = createRng(box.seed);
    let found = false;
    for (let attempt = 0; attempt < PLACE_ATTEMPTS; attempt += 1) {
      const x = rng() * Math.max(1, worldW - box.width);
      const y = originY + rng() * Math.max(1, worldH - box.footprint);
      const candidate = { x, y, width: box.width, footprint: box.footprint };
      if (placed.some((other) => boxesOverlap(candidate, other, gap))) continue;
      box.x = x;
      box.y = y;
      placed.push(box);
      found = true;
      break;
    }
    if (!found) {
      const maxX = placed.reduce((max, other) => Math.max(max, other.x + other.width), 0);
      box.x = maxX + gap + rng() * 80;
      box.y = originY + rng() * Math.max(1, worldH * 0.6);
      placed.push(box);
      worldW = Math.max(worldW, box.x + box.width);
    }
  });
  return boxes;
};

const baseShadowStyle = `
  :host {
    display: block;
    height: 100%;
  }
  :host * {
    box-sizing: border-box;
  }
  .widget-error {
    margin: 0;
    padding: 1rem;
  }
`;

const createWidgetShell = (widget, { x, y, width, height, framed, rotate }) => {
  const article = document.createElement("article");
  article.className = framed ? "widget" : "widget is-unframed";
  article.style.left = `${x}px`;
  article.style.top = `${y}px`;
  article.style.width = `${width}px`;
  article.style.height = `${height}px`;
  article.style.containIntrinsicSize = `${width}px ${height}px`;
  if (rotate) article.style.transform = `rotate(${rotate}deg)`;
  const credit = `
    <span class="widget-student">${escapeHtml(widget.student)}</span>
    <span class="widget-title">${escapeHtml(widget.title)}</span>
  `;
  article.innerHTML = `<div class="widget-body"></div><p class="widget-credit">${credit}</p>`;
  return article;
};

const realizeWidget = (article, widget) => {
  const body = article.querySelector(".widget-body");
  if (!body || body.shadowRoot) return;
  const shadow = body.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = baseShadowStyle;
  try {
    if (typeof widget.mount !== "function") throw new Error("Widget is missing mount");
    widget.mount(shadow);
  } catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.className = "widget-error";
    message.textContent = "This widget failed to load";
    shadow.replaceChildren(message);
  }
  shadow.prepend(style);
  shadow.querySelectorAll("img").forEach((img) => {
    img.decoding = "async";
  });
};

let topZIndex = 1;

const enableWidgetDrag = (article, box, { getScale }) => {
  let isDragging = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let moved = false;

  article.addEventListener("dragstart", (event) => event.preventDefault());

  article.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;

    const path = event.composedPath();
    const isCredit = path.some((el) => el instanceof Element && el.classList?.contains("widget-credit"));

    if (!isCredit) {
      const isInteractive = path.some((el) => {
        if (!(el instanceof Element)) return false;
        const tag = el.tagName?.toLowerCase();
        return (
          tag === "button" ||
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          tag === "option" ||
          tag === "a" ||
          tag === "canvas" ||
          tag === "audio" ||
          tag === "video" ||
          el.getAttribute("role") === "slider" ||
          el.isContentEditable ||
          el.getAttribute("draggable") === "true" ||
          el.hasAttribute("data-no-drag")
        );
      });
      if (isInteractive) return;
    }

    article.style.zIndex = `${++topZIndex}`;
    isDragging = true;
    moved = false;
    startPointerX = event.clientX;
    startPointerY = event.clientY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;

    const onPointerMove = (moveEvent) => {
      if (!isDragging) return;

      if (!moved) {
        if (Math.hypot(moveEvent.clientX - startPointerX, moveEvent.clientY - startPointerY) < 4) return;
        moved = true;
        article.classList.add("is-dragging");
        document.body.classList.add("is-dragging-widget");
      }

      const currentScale = getScale();
      const dx = (moveEvent.clientX - lastPointerX) / currentScale;
      const dy = (moveEvent.clientY - lastPointerY) / currentScale;
      lastPointerX = moveEvent.clientX;
      lastPointerY = moveEvent.clientY;

      box.x += dx;
      box.y += dy;
      article.style.left = `${box.x}px`;
      article.style.top = `${box.y}px`;
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      if (!isDragging) return;
      isDragging = false;

      if (moved) {
        article.classList.remove("is-dragging");
        document.body.classList.remove("is-dragging-widget");
        const suppressClick = (clickEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
        };
        window.addEventListener("click", suppressClick, { capture: true, once: true });
        setTimeout(() => {
          window.removeEventListener("click", suppressClick, { capture: true });
        }, 50);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  });
};

export function mountPlayground(app, widgets) {
  app.innerHTML = `
    <div class="playground">
      ${mastheadMarkup({ home: "/", current: "playground" })}
      <div class="canvas-area">
        <div class="canvas-viewport" role="region" aria-label="Playground canvas" tabindex="0">
          <div class="canvas-world"></div>
        </div>
        <div class="canvas-tools" role="group" aria-label="Canvas view">
          <button type="button" aria-label="Zoom out"><span aria-hidden="true">−</span></button>
          <button type="button" aria-label="Zoom in"><span aria-hidden="true">+</span></button>
          <button class="reset-view" type="button">Reset view</button>
        </div>
      </div>
    </div>
  `;

  const viewport = app.querySelector(".canvas-viewport");
  const world = app.querySelector(".canvas-world");
  const zoomOutButton = app.querySelector("[aria-label='Zoom out']");
  const zoomInButton = app.querySelector("[aria-label='Zoom in']");
  const resetButton = app.querySelector(".reset-view");
  const paletteButton = app.querySelector(".palette-button");

  let placed = [];
  let hosts = [];
  let realizeQueue = [];
  let realizeFrame = 0;
  let panFrame = 0;
  let x = 0;
  let y = 0;
  let scale = 1;
  let dragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let viewportRect = null;
  let chromeFrame = 0;

  const measureViewport = () => {
    viewportRect = viewport.getBoundingClientRect();
    return viewportRect;
  };

  const applyTransform = () => {
    world.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const syncChrome = () => {
    let gridSize = GRID * scale;
    while (gridSize < 18) gridSize *= 2;
    viewport.style.backgroundSize = `${gridSize}px ${gridSize}px`;
    viewport.style.backgroundPosition = `${x}px ${y}px`;
    zoomOutButton.disabled = scale <= MIN_SCALE + 0.0001;
    zoomInButton.disabled = scale >= MAX_SCALE - 0.0001;
  };

  const render = ({ chrome = "defer" } = {}) => {
    applyTransform();
    if (chrome === "now") {
      if (chromeFrame) {
        cancelAnimationFrame(chromeFrame);
        chromeFrame = 0;
      }
      syncChrome();
      return;
    }
    if (chromeFrame) return;
    chromeFrame = requestAnimationFrame(() => {
      chromeFrame = 0;
      syncChrome();
    });
  };

  const flushRealize = () => {
    realizeFrame = 0;
    let budget = 3;
    while (realizeQueue.length && budget > 0) {
      const host = realizeQueue.shift();
      if (!host || host.realized) continue;
      realizeWidget(host.article, host.widget);
      host.realized = true;
      budget -= 1;
    }
    if (realizeQueue.length) realizeFrame = requestAnimationFrame(flushRealize);
  };

  const updateVisibility = () => {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const margin = 160;
    hosts.forEach((host) => {
      const left = host.box.x * scale + x;
      const top = host.box.y * scale + y;
      const visible = left + host.box.width * scale > -margin
        && left < vw + margin
        && top + host.box.footprint * scale > -margin
        && top < vh + margin;
      host.article.classList.toggle("is-away", !visible);
      if (visible && !host.realized && !host.queued) {
        host.queued = true;
        realizeQueue.push(host);
      }
    });
    if (realizeQueue.length && !realizeFrame) realizeFrame = requestAnimationFrame(flushRealize);
  };

  const zoomAt = (clientX, clientY, nextScale, chrome) => {
    const next = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    if (next === scale) return;
    const rect = viewportRect || measureViewport();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const ratio = next / scale;
    x = px - (px - x) * ratio;
    y = py - (py - y) * ratio;
    scale = next;
    render({ chrome: chrome ?? "defer" });
  };

  const zoomBy = (factor) => {
    const rect = viewportRect || measureViewport();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, scale * factor, "now");
    updateVisibility();
  };

  const fitView = () => {
    if (placed.length === 0) {
      x = 0;
      y = 0;
      scale = 1;
      render({ chrome: "now" });
      return;
    }
    const minX = Math.min(...placed.map((widget) => widget.x));
    const minY = Math.min(...placed.map((widget) => widget.y));
    const maxX = Math.max(...placed.map((widget) => widget.x + widget.width));
    const maxY = Math.max(...placed.map((widget) => widget.y + widget.footprint));
    const boundsW = Math.max(maxX - minX, 1);
    const boundsH = Math.max(maxY - minY, 1);
    const pad = Math.min(80, viewport.clientWidth * 0.08, viewport.clientHeight * 0.08);
    const viewW = Math.max(viewport.clientWidth - pad * 2, 1);
    const viewH = Math.max(viewport.clientHeight - pad * 2, 1);
    scale = clamp(Math.min(viewW / boundsW, viewH / boundsH, 1), MIN_SCALE, MAX_SCALE);
    x = (viewport.clientWidth - boundsW * scale) / 2 - minX * scale;
    y = (viewport.clientHeight - boundsH * scale) / 2 - minY * scale;
    render({ chrome: "now" });
    updateVisibility();
  };

  const widgetCanScroll = (target) => {
    const body = target.closest?.(".widget-body");
    return Boolean(body && body.scrollHeight > body.clientHeight + 1);
  };

  viewport.addEventListener("wheel", (event) => {
    if (event.target.closest?.(".widget") && widgetCanScroll(event.target)) return;
    event.preventDefault();
    const line = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
    const delta = event.deltaY * line;
    if (delta === 0) return;
    zoomAt(event.clientX, event.clientY, scale * Math.exp(-delta * ZOOM_WHEEL));
    updateVisibility();
  }, { passive: false });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest(".widget")) return;
    dragging = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    viewport.classList.add("is-panning");
    viewport.setPointerCapture(event.pointerId);
    viewport.focus({ preventScroll: true });
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    x += event.clientX - lastPointerX;
    y += event.clientY - lastPointerY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    if (panFrame) return;
    panFrame = requestAnimationFrame(() => {
      panFrame = 0;
      applyTransform();
    });
  });

  const endPan = () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-panning");
    if (panFrame) {
      cancelAnimationFrame(panFrame);
      panFrame = 0;
    }
    render({ chrome: "now" });
    updateVisibility();
  };
  viewport.addEventListener("pointerup", endPan);
  viewport.addEventListener("pointercancel", endPan);

  zoomOutButton.addEventListener("click", () => zoomBy(1 / ZOOM_STEP));
  zoomInButton.addEventListener("click", () => zoomBy(ZOOM_STEP));
  resetButton.addEventListener("click", fitView);
  window.addEventListener("resize", () => {
    viewportRect = null;
    updateVisibility();
  });

  window.addEventListener("keydown", (event) => {
    if (event.target.closest?.(".widget")) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "ArrowLeft") x += PAN_STEP;
    else if (event.key === "ArrowRight") x -= PAN_STEP;
    else if (event.key === "ArrowUp") y += PAN_STEP;
    else if (event.key === "ArrowDown") y -= PAN_STEP;
    else if (event.key === "+" || event.key === "=") zoomBy(ZOOM_STEP);
    else if (event.key === "-" || event.key === "_") zoomBy(1 / ZOOM_STEP);
    else return;
    event.preventDefault();
    if (event.key.startsWith("Arrow")) {
      render({ chrome: "now" });
      updateVisibility();
    }
  });

  const setWidgets = (nextWidgets) => {
    realizeQueue = [];
    if (realizeFrame) {
      cancelAnimationFrame(realizeFrame);
      realizeFrame = 0;
    }
    world.replaceChildren();
    placed = layoutWidgets(nextWidgets, viewport.clientWidth, viewport.clientHeight);
    hosts = nextWidgets.map((widget, index) => {
      const box = placed[index];
      const article = createWidgetShell(widget, box);
      enableWidgetDrag(article, box, { getScale: () => scale });
      world.append(article);
      return { article, widget, box, realized: false };
    });
    fitView();
  };

  if (widgets.length) setWidgets(widgets);
  else fitView();

  return { paletteButton, fitView, setWidgets };
}
