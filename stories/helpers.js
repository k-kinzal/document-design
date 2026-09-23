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

/** Renders after the stylesheet has resolved, so measurements are real. */
export function measured(build) {
  const host = document.createElement("div");
  requestAnimationFrame(() => { host.innerHTML = build(); });
  return host;
}
