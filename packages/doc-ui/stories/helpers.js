/*
 * Stories are written as HTML strings, because HTML strings are the thing
 * being documented. A story that built its specimen out of helper functions
 * would demonstrate the helpers, and the reader's job here is to copy the
 * markup into a generator.
 */
export function html(strings, ...values) {
  const markup = String.raw({ raw: strings }, ...values);
  const tpl = document.createElement("template");
  tpl.innerHTML = markup.trim();
  return tpl.content.childNodes.length === 1
    ? tpl.content.firstChild
    : tpl.content;
}

/*
 * The arrowhead, defined once per document.
 *
 * `.draw-arrow` sets `marker-end: url(#dd-arrow)` and a marker reference that
 * resolves to nothing is not an error in SVG — the line simply ends. So every
 * document that draws an arrow carries this block, and tests/drawing-type.test.mjs
 * checks that it does.
 *
 * This is markup, not a component, because the public API of this system is the
 * shape of the HTML. A generator emits these eight lines once per page.
 */
export const drawDefs = `<svg class="draw-defs" aria-hidden="true" focusable="false">
  <marker id="dd-arrow" markerUnits="userSpaceOnUse" viewBox="0 0 8 6"
          refX="8" refY="3" markerWidth="8" markerHeight="6"
          orient="auto-start-reverse">
    <path class="draw-arrowhead" d="M0 0L8 3L0 6Z"/>
  </marker>
</svg>`;

/** Wraps a specimen in a labelled strip. */
export function specimen(label, markup) {
  return `<div class="sb-specimen"><p class="sb-label">${label}</p>${markup}</div>`;
}

export const HUES = ["blue", "violet", "amber", "teal", "pink", "indigo", "slate"];
export const STATES = ["ok", "warn", "danger", "neutral"];

/* ---- measuring, for the foundation stories ---- */

/*
 * Contrast measured from what the browser actually computed, not from the hex
 * values the source happens to say. Tints are a color-mix and the theme is a
 * light-dark(), so the only honest number is the resolved one.
 */
export function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/*
 * Resolved through a canvas, not by reading numbers out of the serialization.
 *
 * The tints are `color-mix(in oklab, …)`, and a computed value keeps its
 * colour space: `oklab(0.93 -0.006 -0.019)`. Taking the first three numbers as
 * 0–255 RGB — which this used to do — turned that into black, so the table
 * that claimed to measure contrast was reporting fiction. Painting the colour
 * and reading the pixel back asks the browser to do the conversion it already
 * knows how to do, whatever syntax arrives.
 */
const probeCanvas = document.createElement("canvas");
probeCanvas.width = probeCanvas.height = 1;
const probeCtx = probeCanvas.getContext("2d", { willReadFrequently: true });

export function parseColor(value) {
  const probe = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  probeCtx.clearRect(0, 0, 1, 1);
  probeCtx.fillStyle = "#000";
  probeCtx.fillStyle = resolved;
  probeCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = probeCtx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

export function contrast(a, b) {
  const la = relativeLuminance(parseColor(a));
  const lb = relativeLuminance(parseColor(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function token(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Renders after the stylesheet has resolved, and re-renders whenever the theme
 * actually changes.
 *
 * A single requestAnimationFrame was a race: the decorator applies the theme in
 * a frame of its own, and whichever was queued first won. Measured in the
 * losing order, the table computed the outgoing theme's ratios and displayed
 * them against the incoming theme's colours — a contrast table that was wrong
 * about contrast, which is the one thing it exists to be right about.
 *
 * Watching the attribute removes the ordering question entirely, and picks up
 * an in-page theme toggle as well as the toolbar.
 */
export function measured(build) {
  const host = document.createElement("div");
  let last = null;

  /*
   * Keyed on the colours the browser actually resolved, not on what asked for
   * them. `color-scheme` stays "light dark" in auto mode whichever way the
   * system is set, so a key built from it did not change when the system
   * flipped and the table kept showing the previous theme's ratios. The
   * resolved background is the ground truth: if it moved, the palette moved.
   */
  const render = () => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const key = cs.getPropertyValue("--dd-bg").trim() + "|" +
                cs.getPropertyValue("--dd-ink").trim();
    if (key === last) return;
    last = key;
    host.innerHTML = build();
  };

  requestAnimationFrame(render);

  new MutationObserver(() => requestAnimationFrame(render))
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-dd-theme"] });

  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", () => requestAnimationFrame(render));
  }

  return host;
}
