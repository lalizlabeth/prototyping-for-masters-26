import { expect, test } from "@playwright/test";

const readView = (page) => page.locator(".canvas-world").evaluate((el) => {
  const matrix = new DOMMatrix(getComputedStyle(el).transform);
  return { x: matrix.e, y: matrix.f, scale: matrix.a };
});

test("playground canvas pans, zooms, and hosts widgets", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Playground" }).click();
  await expect(page).toHaveURL(/\/playground\/?$/);
  await expect(page.getByRole("link", { name: "Playground" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("region", { name: "Playground canvas" })).toBeVisible();
  await expect(page.getByText("Elizabeth Lin", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("New York time", { exact: true })).toBeVisible();
  await expect(page.getByText("Carnycia Royce", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Stick Figure", { exact: true })).toBeVisible();
  const clock = page.getByRole("img", { name: /\d{1,2}:\d{2} [AP]M in New York/ });
  await expect(clock).toBeVisible();
  expect(await page.locator(".widget.is-unframed").count()).toBeGreaterThanOrEqual(1);
  await expect(page.getByText("Letian Tian", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Haribo Goldbären", { exact: true })).toBeVisible();
  await expect(page.locator(".widget.is-unframed")).toHaveCount(2);
  await expect(page.locator(".widget.is-unframed", { hasText: "Elizabeth Lin" })).toHaveCount(1);
  await expect(page.locator(".widget.is-unframed").filter({ has: clock })).toHaveCount(1);
  await clock.click();
  await expect(page.locator(".widget").filter({ hasText: "New York time" }).locator(".face")).toHaveClass(/is-spinning/);

  const fitted = await readView(page);
  const viewport = page.locator(".canvas-viewport");
  const box = await viewport.boundingBox();
  await page.mouse.move(box.x + 24, box.y + 24);
  await page.mouse.down();
  await page.mouse.move(box.x + 160, box.y + 96, { steps: 8 });
  await page.mouse.up();
  const panned = await readView(page);
  expect(panned.x).toBeGreaterThan(fitted.x + 50);
  expect(panned.y).toBeGreaterThan(fitted.y + 20);

  await page.getByRole("button", { name: "Zoom in" }).click();
  const zoomed = await readView(page);
  expect(zoomed.scale).toBeGreaterThan(panned.scale);

  await page.mouse.move(box.x + 24, box.y + 24);
  await page.mouse.wheel(0, -200);
  const wheeled = await readView(page);
  expect(wheeled.scale).toBeGreaterThan(zoomed.scale);

  await page.getByRole("button", { name: "Reset view" }).click();
  const reset = await readView(page);
  expect(reset.scale).toBeCloseTo(fitted.scale, 4);
  expect(reset.x).toBeCloseTo(fitted.x, 1);
  expect(reset.y).toBeCloseTo(fitted.y, 1);

  await viewport.focus();
  await page.keyboard.press("ArrowLeft");
  const nudged = await readView(page);
  expect(nudged.x).toBeGreaterThan(reset.x + 20);
});

test("homepage and playground share the same header", async ({ page }) => {
  const readHeader = () => page.locator(".masthead").evaluate((header) => {
    const link = header.querySelector(".masthead-link").getBoundingClientRect();
    return {
      text: header.innerText,
      linkRight: Math.round(link.right),
      transform: getComputedStyle(header.querySelector(".masthead-link")).textTransform,
    };
  });
  await page.goto("/");
  const home = await readHeader();
  await page.goto("/playground/");
  const playground = await readHeader();
  expect(playground).toEqual(home);
  expect(home.linkRight).toBeGreaterThan(page.viewportSize().width / 2);
});

test("playground fits a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/playground/");
  await expect(page.getByText("New York time", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  for (const name of ["Zoom out", "Zoom in", "Reset view", "Change color palette"]) {
    const control = await page.getByRole("button", { name }).boundingBox();
    expect(control.x).toBeGreaterThanOrEqual(0);
    expect(control.x + control.width).toBeLessThanOrEqual(390);
  }
  const canvas = await page.locator(".canvas-viewport").boundingBox();
  expect(canvas.width).toBeLessThanOrEqual(390);
  expect(canvas.height).toBeGreaterThan(200);
});

test("playground widgets can be dragged around without panning canvas or triggering click", async ({ page }) => {
  await page.goto("/playground/");
  const widget = page.locator(".widget").filter({ hasText: "New York time" });
  await expect(widget).toBeVisible();

  const readWidgetPos = () => widget.evaluate((el) => ({
    left: parseFloat(el.style.left),
    top: parseFloat(el.style.top),
  }));

  const initialPos = await readWidgetPos();
  const initialView = await readView(page);

  const widgetBox = await widget.boundingBox();
  const startX = widgetBox.x + widgetBox.width / 2;
  const startY = widgetBox.y + widgetBox.height / 2;

  // Drag the widget by +120px X and +80px Y
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 60, startY + 40, { steps: 4 });
  await expect(widget).toHaveClass(/is-dragging/);
  await expect(page.locator("body")).toHaveClass(/is-dragging-widget/);

  await page.mouse.move(startX + 120, startY + 80, { steps: 4 });
  await page.mouse.up();

  await expect(widget).not.toHaveClass(/is-dragging/);
  await expect(page.locator("body")).not.toHaveClass(/is-dragging-widget/);

  const draggedPos = await readWidgetPos();
  const expectedDx = 120 / initialView.scale;
  const expectedDy = 80 / initialView.scale;
  expect(draggedPos.left).toBeCloseTo(initialPos.left + expectedDx, 1);
  expect(draggedPos.top).toBeCloseTo(initialPos.top + expectedDy, 1);

  // Canvas world should NOT have panned
  const afterDragView = await readView(page);
  expect(afterDragView.x).toBeCloseTo(initialView.x, 1);
  expect(afterDragView.y).toBeCloseTo(initialView.y, 1);

  // Dragging should not have triggered the click animation
  await expect(widget.locator(".face")).not.toHaveClass(/is-spinning/);

  // But a click without drag still triggers the interaction
  const clock = page.getByRole("img", { name: /\d{1,2}:\d{2} [AP]M in New York/ });
  await clock.click();
  await expect(widget.locator(".face")).toHaveClass(/is-spinning/);
});

test("framed widget caption dragging moves widget while button remains clickable", async ({ page }) => {
  await page.goto("/playground/");
  await page.evaluate(async () => {
    const { mountPlayground } = await import("/src/playground/canvas.js");
    const app = document.querySelector("#app");
    app.innerHTML = "";
    mountPlayground(app, [
      {
        student: "Jane Doe",
        title: "Calculator",
        frame: true,
        x: 100,
        y: 100,
        width: 250,
        height: 200,
        mount(root) {
          const btn = document.createElement("button");
          btn.textContent = "Count: 0";
          let count = 0;
          btn.addEventListener("click", () => {
            count += 1;
            btn.textContent = `Count: ${count}`;
          });
          root.appendChild(btn);
        },
      },
    ]);
  });

  const caption = page.locator(".widget-caption").first();
  await expect(caption).toBeVisible();

  const widget = page.locator(".widget").first();
  const initLeft = await widget.evaluate((el) => parseFloat(el.style.left));

  const box = await caption.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2 + 50, { steps: 5 });
  await page.mouse.up();

  const newLeft = await widget.evaluate((el) => parseFloat(el.style.left));
  expect(newLeft).toBeGreaterThan(initLeft + 50);

  // Button inside widget body is still clickable without dragging
  const btn = widget.locator("button");
  await btn.click();
  await expect(btn).toHaveText("Count: 1");
});

test("Xuanyi Meng's widget displays diary image and triggers flash on click", async ({ page }) => {
  await page.goto("/playground/");
  await expect(page.getByText("Xuanyi Meng", { exact: true })).toBeVisible();
  await expect(page.getByText("Dear diary", { exact: true })).toBeVisible();

  const diary = page.getByRole("button", { name: "Dear diary, click for flash effect" });
  await expect(diary).toBeVisible();

  const img = diary.locator("img.diary-image");
  await expect(img).toBeVisible();

  await diary.click();
  await expect(diary.locator(".flash-overlay")).toHaveClass(/active/);
});

test("stick figure widget renders and animates on click", async ({ page }) => {
  await page.goto("/playground/");
  const widget = page.locator(".widget").filter({ hasText: "Stick Figure" });
  await expect(widget).toBeVisible();

  const stickFigureSvg = widget.getByRole("img", { name: "Stick figure" });
  await expect(stickFigureSvg).toBeVisible();

  // Clicking triggers jump animation and particle reaction
  await stickFigureSvg.click();
  await expect(widget.locator(".particle")).toBeVisible();
});

test("smile widget by Yurou Zhou (Reign) renders and changes moods on interaction", async ({ page }) => {
  await page.goto("/playground/");
  await expect(page.getByText("Yurou Zhou (Reign)", { exact: true })).toBeVisible();
  await expect(page.getByText("Smile Widget", { exact: true })).toBeVisible();

  const faceSvg = page.locator(".smile-face-svg");
  await expect(faceSvg).toBeVisible();

  const status = page.locator(".smile-status");
  await expect(status).toHaveText(/Feeling cheerful!/);

  // Click face to cycle mood to Wink
  await faceSvg.click();
  await expect(status).toHaveText(/Caught your eye!/);

  // Click Wink pill button to switch
  const grinBtn = page.getByRole("button", { name: "😄 Grin" });
  await grinBtn.click();
  await expect(status).toHaveText(/Big sunny grin!/);

  // Moving mouse tracks eyes without error
  await page.mouse.move(200, 200);
});

test("peepo jam widget by Shuotong Huang (Tiffany) renders and animates on click", async ({ page }) => {
  await page.goto("/playground/");
  await expect(page.getByText("Shuotong Huang (Tiffany)", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Peepo Jam", { exact: true })).toBeVisible();

  const peepoBtn = page.getByRole("button", { name: /Peepo Jam/i });
  await expect(peepoBtn).toBeVisible();

  const peepoImg = page.getByRole("img", { name: /Peepo with hands on head/i });
  await expect(peepoImg).toBeVisible();

  // Clicking triggers fever mode animation, phrase update, and particles
  await peepoBtn.click();
  await expect(peepoBtn).toHaveClass(/is-fever/);
});

test("Ryan Page's sparkling pixel rainbow widget renders and clouds form on hover", async ({ page }) => {
  await page.goto("/playground/");
  await expect(page.getByText("Ryan Page", { exact: true })).toBeVisible();
  await expect(page.getByText("Pixel Rainbow", { exact: true })).toBeVisible();

  const widget = page.locator(".widget").filter({ hasText: "Pixel Rainbow" });
  await expect(widget).toBeVisible();

  const rainbowSvg = widget.getByRole("img", { name: "Sparkling pixel rainbow" });
  await expect(rainbowSvg).toBeVisible();

  // Clouds are attached and form on hover
  const cloudsGroup = widget.locator(".clouds-layer");
  await expect(cloudsGroup).toBeAttached();

  await rainbowSvg.hover();
  await expect(cloudsGroup).toHaveClass(/is-active/);

  // Sparkles are present
  const sparkles = widget.locator(".sparkle");
  expect(await sparkles.count()).toBeGreaterThan(0);
});

test("envelope widget opens, cycles notes, and seals", async ({ page }) => {
  await page.goto("/playground/");
  const minjuWidget = page.locator(".widget").filter({ hasText: "Interactive Envelope" });
  await expect(minjuWidget).toBeVisible();
  await expect(minjuWidget.locator(".widget-student")).toHaveText("Minju Jang");
  await expect(page.getByText("Interactive Envelope", { exact: true })).toBeVisible();

  const seal = minjuWidget.locator(".wax-seal");
  await expect(seal).toBeVisible();

  // Open the envelope by clicking the wax seal
  await seal.click();
  const envelope = minjuWidget.locator(".envelope");
  await expect(envelope).toHaveClass(/is-open/);

  // Check the initial note text
  const noteText = minjuWidget.locator(".note-text");
  await expect(noteText).toContainText("Hello from the canvas!");

  // Cycle to next note
  const nextBtn = minjuWidget.locator(".btn-next");
  await nextBtn.click();
  await expect(noteText).toContainText("Prototyping principle");

  // Seal the envelope
  const closeBtn = minjuWidget.locator(".btn-close");
  await closeBtn.click();
  await expect(envelope).not.toHaveClass(/is-open/);
});

test("envelope widget allows writing on the envelope and writing custom letter notes", async ({ page }) => {
  await page.goto("/playground/");
  const minjuWidget = page.locator(".widget").filter({ hasText: "Interactive Envelope" });
  await expect(minjuWidget).toBeVisible();

  // Test writing on the envelope front
  const toInput = minjuWidget.locator(".env-to-input");
  const noteInput = minjuWidget.locator(".env-note-input");
  await expect(toInput).toBeVisible();
  await expect(noteInput).toBeVisible();

  await toInput.fill("Alice");
  await expect(toInput).toHaveValue("Alice");

  await noteInput.fill("For your eyes only 💌");
  await expect(noteInput).toHaveValue("For your eyes only 💌");

  // Open the envelope
  const seal = minjuWidget.locator(".wax-seal");
  await seal.click();
  const envelope = minjuWidget.locator(".envelope");
  await expect(envelope).toHaveClass(/is-open/);

  // Write a custom message on the letter card
  const writeBtn = minjuWidget.locator(".btn-write");
  await writeBtn.click();

  const customInput = minjuWidget.locator(".custom-input");
  await expect(customInput).toBeVisible();
  await customInput.fill("Greetings from Alice! This is my prototype note.");

  // Click Done to finish writing
  await writeBtn.click();

  const noteText = minjuWidget.locator(".note-text");
  await expect(noteText).toHaveText("Greetings from Alice! This is my prototype note.");

  // Seal the envelope and check that it closed properly
  const closeBtn = minjuWidget.locator(".btn-close");
  await closeBtn.click();
  await expect(envelope).not.toHaveClass(/is-open/);

  // Re-open and verify our custom note persisted
  await seal.click();
  await expect(envelope).toHaveClass(/is-open/);
  await expect(noteText).toHaveText("Greetings from Alice! This is my prototype note.");
});

test("3D Savvy the Pigeon widget renders, rotates on hover, and reacts on click", async ({ page }) => {
  await page.goto("/playground/");
  const savvyWidget = page.locator(".widget").filter({ hasText: "3D Savvy the Pigeon" });
  await expect(savvyWidget).toBeVisible();
  await expect(savvyWidget.locator(".widget-student")).toHaveText("Minju Jang");

  // Canvas exists and is rendered
  const canvas = savvyWidget.locator("canvas");
  await expect(canvas).toBeVisible();

  // Hover over canvas to rotate Savvy in 3D
  await canvas.hover();

  // Click on Savvy to trigger speech bubble and reaction
  await canvas.click();
  const bubble = savvyWidget.locator(".speech-bubble");
  await expect(bubble).toHaveClass(/is-visible/);

  // Toggle photo view
  const toggleBtn = savvyWidget.locator(".btn-toggle-photo");
  await expect(toggleBtn).toBeVisible();
  await toggleBtn.click();

  const photoImg = savvyWidget.locator(".photo-img");
  await expect(photoImg).toBeVisible();

  // Flip back to 3D view
  await toggleBtn.click();
  await expect(canvas).toBeVisible();
});
