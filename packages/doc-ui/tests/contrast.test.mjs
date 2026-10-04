/*
 * Contrast check.
 *
 * The palette claims "one accessible value per hue for light and for dark".
 * That claim was previously maintained by hand across twenty tint hexes in two
 * stylesheets, which is to say it was maintained by hope. This checks it.
 *
 * Every hue is measured where it is actually used: as chip text on its own
 * tint, and as body text on the page. Tints are derived with the same oklab
 * mix the stylesheet uses, so what is measured is what ships.
 */

/*
 * WCAG AA. The large-text exception (3:1) begins at 24px regular or 18.66px
 * bold — NOT at "it is bold and small". Everything this system sets is below
 * that, so everything owes 4.5:1.
 *
 * This file previously held chips to 3:1 on the grounds that they are bold,
 * and reported 58 passing pairs. A chip is 12px at weight 600. Nine pairs were
 * between 3.9 and 4.5 and were shipped as passing because the check asked for
 * the wrong number. The tint mix is now set by this target rather than by eye.
 */
const TARGET_TEXT = 4.5;
const TARGET_LARGE = 3.0;   /* reserved for genuinely large text; nothing uses it yet */

import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { palettes, paletteCSS } from '../src/palettes.mjs';

// Measure the declarations we ship, rather than a second hand-maintained palette.
const source = readFileSync(new URL('../src/tokens/palette.css', import.meta.url), 'utf8');
const base = { light: { mix: 0.06 }, dark: { mix: 0.12 } };
for (const [, key, light, dark] of source.matchAll(/--dd-([\w-]+):\s*light-dark\((#[\da-f]{6}), (#[\da-f]{6})\)/g)) {
  if (base.light[key]) continue;
  base.light[key] = light;
  base.dark[key] = dark;
}
const PALETTE = {};
for (const palette of palettes) {
  const css = paletteCSS(palette);
  for (const [mode, initial] of Object.entries(base)) {
    const p = { ...initial };
    for (const [, key, light, dark] of css.matchAll(/--dd-([\w-]+):\s*light-dark\((#[\da-f]{6}), (#[\da-f]{6})\)/g)) p[key] = mode === 'light' ? light : dark;
    const alias = css.match(/--dd-accent: var\(--dd-([\w-]+)\)/);
    if (alias) p.accent = p[alias[1]];
    PALETTE[`${palette.id} / ${mode}`] = p;
  }
}

const HUES = ["blue", "violet", "amber", "teal", "pink", "indigo", "slate", "green", "red", "yellow", "accent"];
const TEXT = ["ink", "sub", "dim"];
const SURFACES = ["bg", "surface", "sunken", "raised", "hover"];

/* ---- colour maths ---- */

const srgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function luminance(hex) {
  const [r, g, b] = srgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* oklab, matching `color-mix(in oklab, …)` */
function toOklab(hex) {
  const [r, g, b] = srgb(hex).map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, bb]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const clamp = (v) => Math.min(255, Math.max(0, Math.round(toGamma(v) * 255)));
  return "#" + [lr, lg, lb].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
}

function mix(hueHex, bgHex, amount) {
  const a = toOklab(hueHex), b = toOklab(bgHex);
  return fromOklab(a.map((v, i) => v * amount + b[i] * (1 - amount)));
}

/* ---- the check ---- */

let failures = 0;
const rows = [];

for (const [theme, p] of Object.entries(PALETTE)) {
  /* Every text colour against every surface it can land on. `dim` used to be
     checked at 3:1 and only against three surfaces; it is a count, a path and
     a timestamp — normal text — and a row can be hovered while a popover is
     open above it, so it owes 4.5 on all five. */
  for (const name of TEXT) {
    for (const surface of SURFACES) {
      const r = ratio(p[name], p[surface]);
      const ok = r >= TARGET_TEXT;
      if (!ok) failures++;
      rows.push([theme, `${name} on ${surface}`, r, TARGET_TEXT, ok]);
    }
  }

  /*
   * A hue is not only ever seen on the page background. A link sits in a table
   * row that can be hovered, a chip sits in a card, a syntax token sits in a
   * code block on the sunken surface, and a search hit sits on the raised one.
   * Testing a hue against `bg` and its own tint only measured two of the five
   * places it actually lands.
   */
  for (const hue of HUES) {
    const tint = mix(p[hue], p.bg, p.mix);
    const onTint = ratio(p[hue], tint);
    if (onTint < TARGET_TEXT) failures++;
    rows.push([theme, `${hue} chip on ${hue}-tint`, onTint, TARGET_TEXT, onTint >= TARGET_TEXT]);

    for (const surface of SURFACES) {
      const r = ratio(p[hue], p[surface]);
      const ok = r >= TARGET_TEXT;
      if (!ok) failures++;
      rows.push([theme, `${hue} text on ${surface}`, r, TARGET_TEXT, ok]);
    }
  }
}

for (const [theme, what, r, target, ok] of rows) {
  if (!ok) console.error(`${theme}: ${what} = ${r.toFixed(3)}; requires ${target}`);
}
console.log(`${palettes.length} palettes, light and dark: ${rows.length} text/surface and text/tint pairs; minimum ${Math.min(...rows.map(r => r[2])).toFixed(3)}:1.`);
if (failures) throw new Error(`${failures} contrast pairs are below 4.5:1.`);

// Contrast alone accepted saturated scarlet and gold beside muted Plum.
// Guard the reviewed ink balance separately from legibility. These bounds
// prevent that regression; visual review of the complete set is still needed.
for (const [name, p] of Object.entries(PALETTE)) {
  const lch = hex => {
    const [l, a, b] = toOklab(hex);
    return { l, c: Math.hypot(a, b), h: (Math.atan2(b, a) * 180 / Math.PI + 360) % 360 };
  };
  for (const [role, [min, max]] of Object.entries({ red: [10, 35], yellow: [70, 95], green: [145, 165] })) {
    const { c, h } = lch(p[role]);
    assert(h >= min && h <= max && c >= 0.055, `${name}: ${role} must keep its semantic hue, not become gray or an identity color`);
  }
  if (name.startsWith('paper-blue /')) continue; // Preserve the original appearance.
  const inks = HUES.filter(h => h !== 'accent').map(h => lch(p[h]));
  const lightness = inks.map(c => c.l);
  assert(Math.max(...lightness) - Math.min(...lightness) < 0.06, `${name}: supporting inks must share a lightness band`);
  const budget = Math.max(0.09, lch(p.accent).c * 1.5);
  assert(inks.every(c => c.c <= budget), `${name}: a supporting ink overwhelms the accent's chroma range`);
}
console.log('Semantic hues and coordinated ink lightness/chroma verified.');
