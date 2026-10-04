// Optional generation helpers. The output is ordinary CSS and static HTML;
// reading and printing a book does not require this module or JavaScript.
export const bookFormats = {
  a5: { name: 'A5', width: 148, height: 210, head: 18, foot: 24, gutter: 20, fore: 18 },
  a4: { name: 'A4', width: 210, height: 297, head: 20, foot: 25, gutter: 24, fore: 18 },
  'b6-jis': { name: 'JIS B6', width: 128, height: 182, head: 17, foot: 18, gutter: 18, fore: 15 },
  letter: { name: 'Letter', width: 215.9, height: 279.4, head: 20, foot: 25, gutter: 24, fore: 18 },
};

export function bookGeometry(format = 'a5', overrides = {}) {
  if (!Object.hasOwn(bookFormats, format)) throw new Error(`Unknown book format: ${format}`);
  const result = { ...bookFormats[format], leading: 7, headGap: 3.5, folioGap: 4, ...overrides };
  for (const key of ['width', 'height', 'head', 'foot', 'gutter', 'fore', 'leading', 'headGap', 'folioGap']) {
    if (!Number.isFinite(result[key]) || result[key] <= 0) throw new Error(`Book ${key} must be a positive number of millimetres.`);
  }
  result.measure = result.width - result.gutter - result.fore;
  result.extent = result.height - result.head - result.foot;
  if (result.measure < 50 || result.extent < 50) throw new Error('Book margins must leave at least 50 × 50 mm for text.');
  if (result.headGap + 5 > result.head || result.folioGap + 5 > result.foot) throw new Error('Book furniture must fit inside the head and foot margins.');
  return result;
}

export function bookVariables(geometry) {
  return Object.entries(geometry).filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => `--dd-book-${key.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}: ${value}mm`).join('; ');
}

const cssString = text => '"' + String(text).replace(/["\\\n\r\f<]/g, c => `\\${c.codePointAt(0).toString(16)} `) + '"';

// CSS string-set is not implemented in Chromium. Named pages make the chapter
// title repeat on every continuation page without positioned DOM furniture.
export function bookPageCSS(name, { geometry = bookGeometry(), title = '', chapter = '', furniture = true } = {}) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw new Error('A book page name must be a lowercase CSS identifier.');
  const g = geometry;
  const head = text => `content: ${furniture ? cssString(text) : 'none'}; font: 10pt var(--dd-font-sans, sans-serif); color: #000; vertical-align: bottom; padding-bottom: ${g.headGap}mm;`;
  const folio = `content: ${furniture ? 'counter(page)' : 'none'}; font: 10pt var(--dd-font-sans, sans-serif); color: #000; vertical-align: top; padding-top: ${g.folioGap}mm;`;
  return `@page ${name} {
  size: ${g.width}mm ${g.height}mm;
  margin: ${g.head}mm ${g.fore}mm ${g.foot}mm ${g.gutter}mm;
  @top-center { content: none; } @bottom-center { content: none; }
}
@page ${name}:left {
  margin-left: ${g.fore}mm; margin-right: ${g.gutter}mm;
  @top-left { ${head(title)} } @top-right { content: none; }
  @bottom-left { ${folio} } @bottom-right { content: none; }
}
@page ${name}:right {
  @top-right { ${head(chapter)} } @top-left { content: none; }
  @bottom-right { ${folio} } @bottom-left { content: none; }
}
@page ${name}:blank {
  @top-left { content: none; } @top-right { content: none; }
  @bottom-left { content: none; } @bottom-right { content: none; }
}`;
}
