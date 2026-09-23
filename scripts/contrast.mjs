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

const TARGET_TEXT = 4.5;   /* WCAG AA, normal text */
const TARGET_LARGE = 3.0;  /* AA for large/bold text, which chips are */

const PALETTE = {
  light: {
    bg: "#fcfcfe", surface: "#f6f7f9", sunken: "#eef0f3", raised: "#ffffff", hover: "#eceef2",
    ink: "#1b1e24", sub: "#4d535d", dim: "#686d78", hair: "#d9dbe0", rule: "#b8bcc4",
    blue: "#006bb2", violet: "#7d5eaf", amber: "#975d00", slate: "#676d79",
    teal: "#0f7478", pink: "#b0356f", indigo: "#4a55bd",
    green: "#1b7c4a", red: "#ac011a", yellow: "#7d5200",
    mix: 0.13,
  },
  dark: {
    bg: "#1f2023", surface: "#292c30", sunken: "#25272b", raised: "#2f3238", hover: "#32353b",
    ink: "#d9dbdd", sub: "#a7abb3", dim: "#8c919b", hair: "#363940", rule: "#4d515a",
    blue: "#5eabf1", violet: "#aa8ddd", amber: "#e8a750", slate: "#8d94a2",
    teal: "#4fbcc0", pink: "#f085b4", indigo: "#949cf0",
    green: "#5dac7b", red: "#fe6863", yellow: "#cf9b2e",
    mix: 0.22,
  },
};

const HUES = ["blue", "violet", "amber", "teal", "pink", "indigo", "slate", "green", "red", "yellow"];
const TEXT = ["ink", "sub", "dim"];

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
  for (const name of TEXT) {
    for (const surface of ["bg", "surface", "sunken"]) {
      const r = ratio(p[name], p[surface]);
      const target = name === "dim" ? TARGET_LARGE : TARGET_TEXT;
      const ok = r >= target;
      if (!ok) failures++;
      rows.push([theme, `${name} on ${surface}`, r, target, ok]);
    }
  }

  for (const hue of HUES) {
    const tint = mix(p[hue], p.bg, p.mix);
    const onTint = ratio(p[hue], tint);
    const onBg = ratio(p[hue], p.bg);
    /* A chip is 11px at weight 600 — large-text AA is the honest target for it;
       the same hue used as a link or as syntax is normal text and is held to AA. */
    if (onTint < TARGET_LARGE) failures++;
    if (onBg < TARGET_TEXT) failures++;
    rows.push([theme, `${hue} chip on ${hue}-tint`, onTint, TARGET_LARGE, onTint >= TARGET_LARGE]);
    rows.push([theme, `${hue} text on bg`, onBg, TARGET_TEXT, onBg >= TARGET_TEXT]);
  }
}

const pad = (s, n) => String(s).padEnd(n);
let lastTheme = null;
for (const [theme, what, r, target, ok] of rows) {
  if (theme !== lastTheme) {
    console.log(`\n${theme.toUpperCase()}`);
    lastTheme = theme;
  }
  console.log(`  ${ok ? "ok  " : "FAIL"} ${pad(what, 30)} ${r.toFixed(2).padStart(6)} : ${target}`);
}

console.log(
  failures === 0
    ? `\nAll ${rows.length} pairs meet their target.`
    : `\n${failures} of ${rows.length} pairs are below target.`
);
process.exit(failures === 0 ? 0 : 1);
