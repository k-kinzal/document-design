// Paper and ink vary; identity and state keep the same vocabulary everywhere.
// Paper / Blue is the original palette and remains the default.
export const families = [
  { id: 'paper', name: 'Paper', description: 'Neutral paper, crisp ink.', tokens: {} },
  { id: 'linen', name: 'Linen', description: 'Warm paper, brown-gray ink.', tokens: {
    bg: ['#fdfcf9', '#24211f'], surface: ['#f9f7f2', '#2d2926'],
    sunken: ['#f5f2eb', '#292522'], raised: ['#ffffff', '#322e2a'], hover: ['#f5f2ec', '#302c28'],
    ink: ['#28221c', '#e2dcd3'], sub: ['#595047', '#b8aaa0'], dim: ['#6a6055', '#b3a59b'],
    hair: ['#e1dbd0', '#403a34'], rule: ['#c4bbae', '#595047'],
  } },
  { id: 'mist', name: 'Mist', description: 'Cool paper, blue-gray ink.', tokens: {
    bg: ['#f9fcfe', '#1c2228'], surface: ['#f1f7fa', '#252c32'],
    sunken: ['#edf3f7', '#21282e'], raised: ['#ffffff', '#293038'], hover: ['#eef4f8', '#272e35'],
    ink: ['#1b2732', '#d6e0e8'], sub: ['#485766', '#a3b1bd'], dim: ['#586879', '#9fadb9'],
    hair: ['#d4dfe7', '#34404a'], rule: ['#afc2cf', '#485967'],
  } },
  { id: 'sage', name: 'Sage', description: 'Quiet green paper, soft ink.', tokens: {
    bg: ['#fafdf9', '#1e231f'], surface: ['#f3f8f1', '#272e28'],
    sunken: ['#eff4ed', '#232a24'], raised: ['#ffffff', '#2b322c'], hover: ['#f0f5ee', '#29302a'],
    ink: ['#222c23', '#dbe3d9'], sub: ['#4e5b4e', '#aab7a6'], dim: ['#5e6b5e', '#a5b2a1'],
    hair: ['#d7e0d3', '#394338'], rule: ['#b5c4b0', '#4e5d4b'],
  } },
];

export const accents = [
  { id: 'blue', name: 'Blue', value: 'var(--dd-blue)' },
  { id: 'cyan', name: 'Cyan', value: 'light-dark(#086b86, #60b8d1)' },
  { id: 'teal', name: 'Teal', value: 'var(--dd-teal)' },
  { id: 'indigo', name: 'Indigo', value: 'var(--dd-indigo)' },
  { id: 'violet', name: 'Violet', value: 'var(--dd-violet)' },
  { id: 'plum', name: 'Plum', value: 'light-dark(#855184, #c493c6)' },
  { id: 'citron', name: 'Citron', value: 'var(--dd-amber)' },
  { id: 'slate', name: 'Slate', value: 'var(--dd-slate)' },
];

export const palettes = families.flatMap(family => accents.map(accent => ({
  id: `${family.id}-${accent.id}`, name: `${family.name} / ${accent.name}`,
  family: family.id, accent: accent.id,
})));

export function paletteCSS(palette, { standalone = false } = {}) {
  const family = families.find(f => f.id === palette.family);
  const accent = accents.find(a => a.id === palette.accent);
  // Neutral modes always win on the same boundary, even if this file is last.
  const colorOnly = ':not([data-dd-color="grayscale"], [data-dd-color="monochrome"])';
  const selectors = [standalone && `:root${colorOnly}`, `[data-dd-palette="${palette.id}"]${colorOnly}`].filter(Boolean);
  const tokens = Object.entries(family.tokens).map(([key, pair]) => `    --dd-${key}: light-dark(${pair.join(', ')});`);
  return `@layer dd.tokens {\n  ${selectors.join(',\n  ')} {\n${tokens.join('\n')}\n    --dd-accent: ${accent.value};\n    --dd-link: var(--dd-accent);\n    --dd-accent-tint: color-mix(in oklab, var(--dd-accent) var(--dd-tint-mix), var(--dd-bg));\n  }\n}\n`;
}
