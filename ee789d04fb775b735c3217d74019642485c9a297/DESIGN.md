---
version: alpha
name: doc-ui
description: >-
  Shared CSS for documentation, catalogs and reports. Two genres: a catalog that
  stays readable at high density, and a report that says what it means at a
  glance. Colours are written once with light-dark(); every token is namespaced
  --dd-.
colors:
  # Surfaces. Five, because a catalog stacks them — a popover over a card over
  # the page — and adjacent greys must stay separable in both themes.
  bg: "light-dark(#fcfcfe, #1f2023)"
  surface: "light-dark(#f6f7f9, #292c30)"
  sunken: "light-dark(#f0f2f5, #25272b)"
  raised: "light-dark(#ffffff, #2d3036)"
  hover: "light-dark(#f0f2f6, #2a2d33)"
  # Text.
  ink: "light-dark(#1b1e24, #d9dbdd)"
  sub: "light-dark(#4d535d, #a7abb3)"
  dim: "light-dark(#5f6572, #a1a7b2)"
  # Lines.
  hair: "light-dark(#d9dbe0, #363940)"
  rule: "light-dark(#b8bcc4, #4d515a)"
  # Identity hues — what a thing IS. No judgement.
  blue: "light-dark(#006bb2, #5eabf1)"
  violet: "light-dark(#79599f, #b195e2)"
  amber: "light-dark(#707117, #babc5e)"
  teal: "light-dark(#0f7478, #4fbcc0)"
  pink: "light-dark(#b0356f, #f085b4)"
  indigo: "light-dark(#4a55bd, #949cf0)"
  slate: "light-dark(#646a76, #969dab)"
  # State hues — how a thing is GOING.
  green: "light-dark(#1b7c4a, #66b382)"
  yellow: "light-dark(#7d5300, #d6981a)"
  red: "light-dark(#ac011a, #ff7570)"
  # Roles.
  accent: "{colors.blue}"
  link: "{colors.blue}"
  ok: "{colors.green}"
  warn: "{colors.yellow}"
  danger: "{colors.red}"
typography:
  # The catalog scale — scanned. rem, so a reader's own font size is honoured.
  catalog-xs: { fontFamily: system-ui, fontSize: 0.75rem, fontWeight: 600 }
  catalog-sm: { fontFamily: system-ui, fontSize: 0.8125rem, fontWeight: 400 }
  catalog-body: { fontFamily: system-ui, fontSize: 0.875rem, fontWeight: 400, lineHeight: 1.6 }
  catalog-lede: { fontFamily: system-ui, fontSize: 1rem, fontWeight: 400, lineHeight: 1.6 }
  catalog-h3: { fontFamily: system-ui, fontSize: 1rem, fontWeight: 650 }
  catalog-h2: { fontFamily: system-ui, fontSize: 1.125rem, fontWeight: 650 }
  catalog-h1: { fontFamily: system-ui, fontSize: 1.375rem, fontWeight: 650 }
  # The report scale — read. A major third from 16px.
  report-caveat: { fontFamily: system-ui, fontSize: 16px, fontWeight: 400, lineHeight: 1.7 }
  report-body: { fontFamily: system-ui, fontSize: 16px, fontWeight: 400, lineHeight: 1.75 }
  report-stand: { fontFamily: system-ui, fontSize: 20px, fontWeight: 400, lineHeight: 1.6 }
  report-lead: { fontFamily: system-ui, fontSize: 25px, fontWeight: 600, lineHeight: 1.45 }
  report-claim: { fontFamily: system-ui, fontSize: 39px, fontWeight: 700, lineHeight: 1.2 }
  report-title: { fontFamily: system-ui, fontSize: 61px, fontWeight: 700, lineHeight: 1.1 }
  report-figure: { fontFamily: system-ui, fontSize: 76px, fontWeight: 700, lineHeight: 0.92 }
  mono: { fontFamily: ui-monospace, fontSize: 0.8125rem, fontWeight: 400 }
measure:
  # Line length, counted in characters rather than pixels, because that is the
  # unit the limit is in. 1ric is the root character (水), so 36ric is 36
  # Japanese characters — and 77 latin ones, which puts both inside their
  # readable bands. Root-relative, not element-relative: a shared right edge
  # matters more on a page than a per-element character count.
  text: 36ric
  wide: 48ric
  short: 40ric
rounded:
  sm: 4px
  md: 6px
  lg: 12px
  pill: 999px
spacing:
  "1": 2px
  "2": 4px
  "3": 8px
  "4": 12px
  "5": 18px
  "6": 28px
  "7": 40px
  "8": 64px
  baseline: 28px
components:
  chip:
    fontSize: "{typography.catalog-xs.fontSize}"
    fontWeight: 600
    textColor: "{colors.slate}"
    backgroundColor: tint of its tone, 6% light / 12% dark
    rounded: "{rounded.sm}"
    padding: 1px 8px
  card:
    borderTop: 2px solid "{colors.rule}"
    backgroundColor: none
    rounded: 0
    padding: 12px 0 0
  stat:
    borderTop: 2px solid "{colors.rule}"
    valueSize: 1.75rem
    valueWeight: 700
  notice:
    borderLeft: 3px solid its tone
    backgroundColor: tint of its tone
    rounded: "{rounded.md}"
    padding: 8px 12px
  sidebar:
    width: 260px
    backgroundColor: "{colors.surface}"
    borderRight: 1px solid "{colors.hair}"
---

# doc-ui

A design system for pages that present information: API references, data
catalogs, run reports. This file is for an agent producing such a page — the
exact values are in the front matter, the rules that make a page look like
doc-ui rather than merely use its colours are below.

**Load the stylesheet; do not reimplement it.**

```html
<link rel="stylesheet"
      href="https://k-kinzal.github.io/document-design/v1/document-design.css">
```

## Overview

The whole system serves one goal: **make information easy to see.** Two kinds
of page, each with a different meaning of "easy to see":

| | density | "easy to see" means | genre class |
|---|---|---|---|
| **Catalog** | high | scannable at that density | `.doc` |
| **Report** | low | obvious at a glance | `.sheet` |

These pull in opposite directions, which is why there are two type scales and
two spacing rhythms rather than one of each. **Pick a genre and keep to its
scale.** A catalog that borrows the report's 76px figure stops being scannable;
a report that borrows the catalog's 14px body stops landing.

The voice is quiet and typographic: rules rather than boxes, one accent, no
gradients, no shadows except on things that genuinely float, and no animation
beyond a disclosure triangle. Ornament is not neutral here — it costs ink when
printed and says nothing.

## Colors

**Ten hues, each spoken for.** The split is the point:

- **Identity** — `blue` `violet` `amber` `teal` `pink` `indigo` `slate` — say
  what a thing **is**: a SELECT, a trait, a layer. They carry no judgement, so a
  page full of them is not a page full of warnings.
- **State** — `green` `yellow` `red` — say how a thing is **going**.

Mixing the two is how a catalog becomes an alarm panel and stops being
scannable.

**Red is reserved.** It never appears in syntax highlighting, never marks a
kind, never means "delete". The one red on a page always means *something here
needs looking at* — which is only true because nothing else may use it.

**Colours are written once.** Every palette token is a `light-dark()` pair, and
`color-scheme` selects between them. To force a theme, set `data-dd-theme` on
`<html>`; absent it, the page follows the reader's system.

```html
<html data-dd-theme="dark">   <!-- force -->
<html>                        <!-- follow the system -->
```

**Tints are derived, not written.** Each is its hue mixed into the page
background — `color-mix(in oklab, hue var(--dd-tint-mix), bg)` at 6% light and
12% dark. Those two percentages are not taste: they are the largest mix at
which every hue still clears 4.5:1 against its own tint.

**Contrast is checked, not asserted.** 150 pairs — every hue and every text
colour against all five surfaces plus tints — at 4.5:1, in CI. A chip is 12px
at weight 600, which is *normal* text: WCAG's large-text exception begins at
18.66px bold. Do not assume a small bold label may use 3:1.

## Typography

System fonts only. A generated page should render before it has fetched
anything, and a webfont is a request a page opened from `file://` will never
complete.

**Three registers, and which one a line is in carries meaning:**

- **Sans** — prose. What a person wrote.
- **Mono** — a name the machine knows: an identifier, a path, a statement. A
  file path in proportional type cannot be scanned for the segment that differs
  from the row above it.
- **Tabular figures** — numbers meant to be compared down a column. A number
  that is the point, standing alone, uses *proportional* figures instead;
  tabular digits make a large lone number look loose.

**The measure is counted in characters, because that is the unit the limit is
in.** A line is too long when the eye cannot find the start of the next one
coming back from the end of this one, and that threshold is a character count:
30–40 for Japanese, 45–75 for latin. `1ric` is the root character (the advance
of 水, falling back to 1em where the font has none), so a measure can be stated
the way Japanese typesetting states it — JLREQ puts a line at an integer
multiple of the character size.

| token | value | at 16px | Japanese | Latin |
|---|---|---|---|---|
| `--dd-measure` | `36ric` | 576px | 36 | 77 |
| `--dd-measure-wide` | `48ric` | 768px | 48 | 103 |
| `--dd-measure-short` | `40ric` | 640px | 40 | 86 |

`--dd-measure` is for running text. `--dd-measure-wide` is for what is *looked
at* rather than swept — a drawing, a wide table, a code block — where the
measure costs column width and buys nothing. `--dd-measure-short` is for a
block of one or two lines, where the return sweep happens once.

`ric` and not `ic`: `ic` resolves against the element, so the same token gives
a different width at every type size and a page acquires one right edge per
size. Measured on one article, it produced five. A measure is a line down the
page that things land on, and a per-element character count is not that.

**Japanese takes a space against latin.** `text-autospace: normal` on `body`;
`no-autospace` on monospace, where an inserted space moves a glyph off its
cell. The computed default is `no-autospace`, so this has to be asked for.
`text-spacing-trim` is deliberately *not* set — its default is already
`normal`.

**Japanese is set two ways, and which one is a decision.**

`palt` closes the loose gaps a font leaves around latin set inside Japanese.
That is right for something *looked at* — a title, a lead, a figure, a label —
where the gaps read as holes punched in a short line. It is wrong for something
*read through*: closing them also flattens the density difference between kanji
and kana, and that alternation of dark and light is what the eye follows down a
paragraph.

So headings, leads, figures and labels get `palt` and `font-kerning: normal`;
prose, cells and listings retain the font's natural spacing (solid setting). Do not
put `palt` on `body`. `line-break: strict` applies everywhere, and headings
additionally get `word-break: auto-phrase`.

**Tracking is optical, by size band** — `--dd-track-display` (-0.04em) through
`--dd-track-eyebrow` (+0.16em). Large type wants space taken away; small
tracked capitals want it given back. Monospace gets neither: a column that is
not monospaced is not a column.

## Layout

Two frames. Each is **one wrapper element**, so a frame can be nested inside a
preview pane or another page without the layout depending on where it sits.

**Catalog** — a rail you navigate from, a bar that says where you are, a column
you read:

```html
<div class="doc">
  <nav class="sidebar">…</nav>
  <div class="main">
    <header class="topbar">…</header>
    <main class="content">…</main>
    <footer class="doc-footer">…</footer>
  </div>
</div>
```

**Report** — twelve columns, a 28px baseline, and every block gap a multiple of
it. A section's name sits in columns 1–2 and its content in 4–12; column 3 is
the gap that makes the left edge read as a margin:

```html
<article class="sheet">
  <p class="eyebrow">…</p>
  <h1>…</h1>
  <p class="stand">…</p>
  <div class="hero">…</div>
  <section class="sec">
    <div class="label">01<br>spec</div>
    <div class="field">…</div>
    <p class="caveat">…</p>
  </section>
</article>
```

**Components respond to their column, not the window** — the content column and
the report field are containers, and component rules are container queries. A
1400px window can hold a 320px column.

Viewport breakpoints are only two: **900px** (the rail leaves the flow) and
**720px** (the sheet collapses to one column).

## Elevation & Depth

Depth is carried by **surface colour**, not by shadow. There is exactly one
shadow token and it is only for things that genuinely float above the page and
can be dismissed — a search panel, a sidebar opened over a phone. A card does
not float; giving it a shadow makes a listing of twelve cards look like twelve
dialogs.

| surface | what sits on it |
|---|---|
| `bg` | the page |
| `surface` | part of the page: a card, a code block, the sidebar |
| `sunken` | a well below it: inline code, a terminal |
| `raised` | above it, with the shadow: a popover |
| `hover` | the row under the pointer |

## Shapes

Four radii, and the choice says what a thing is: `pill` for a status, `sm`
against code (a rounded box next to monospace reads as a button), `md` for a
card or an input, `lg` for a report's stat tile.

**Rules, not boxes.** A route, a figure and a section are introduced by a 2px
rule above them rather than enclosed in a bordered, raised rectangle. Boxing
everything gives unrelated information the same treatment and makes a page look
busy without making it legible. Surfaces are for things that genuinely sit at a
different depth.

## Components

**Colour comes from a tone class, never from a component variant.** A tone sets
two custom properties; every component that carries colour reads them. This is
why adding a new kind does not add a new chip.

```html
<span class="chip tone-blue">SELECT</span>
<div class="notice tone-warn">…</div>
<span class="meter-part tone-ok" style="--dd-part:4%"></span>
```

Tones: `tone-{blue,violet,amber,teal,pink,indigo,slate}` for identity,
`tone-{ok,warn,danger,neutral}` for state, `tone-accent`.

Keep your own vocabulary by aliasing, one line each:

```css
.k-select { --dd-tone: var(--dd-blue); --dd-tone-tint: var(--dd-blue-tint); }
```

**The most-used shapes:**

```html
<!-- a way in -->
<section class="card">
  <h2><a href="…">Tables</a><span class="count">12</span></h2>
  <p class="card-description">What this route is for.</p>
  <ol class="peek">
    <li><a href="…">{$}posts</a><span class="peek-figures">3 · 3 read</span></li>
  </ol>
  <p class="card-more"><a href="…">All 12 tables</a></p>
</section>

<!-- a figure that is an answer -->
<div class="stats">
  <a class="stat tone-warn" href="…">
    <b class="stat-fig">978</b>
    <span class="stat-label">findings</span>
    <span class="stat-note">709 of them dynamic SQL</span>
  </a>
</div>

<!-- how a whole divides; the legend is the interactive surface -->
<div class="meter">
  <span class="meter-part tone-ok" style="--dd-part:4%"></span>
  <span class="meter-part is-open" style="--dd-part:96%"></span>
</div>

<!-- a gap in what could be determined -->
<span class="hole" data-dd-hint="A dependency the analyzer does not model.">…unresolved</span>
```

**A drawing takes its marks from the system, the way its labels do.** Geometry
is yours — the generator ran the layout and knows the coordinates. Paint is
not: a hand-painted mark does not follow the tone, the theme, a forced palette
or the page it was put on.

```html
<div class="draw-wrap">
  <svg class="draw" style="--dd-draw-width: 768px" viewBox="0 0 768 216"
       role="img" aria-label="…">
    <rect class="draw-group" …/>                     <!-- these belong together -->
    <rect class="draw-box" …/>                       <!-- a thing               -->
    <rect class="draw-box-toned tone-accent" …/>     <!-- a thing with identity -->
    <rect class="draw-box-alt tone-accent" …/>       <!-- its other state, hollow -->
    <rect class="draw-box-open" …/>                  <!-- nothing there          -->
    <rect class="draw-box-open tone-neutral" …/>     <!-- …and nothing known     -->
    <path class="draw-line draw-arrow" d="…"/>       <!-- a relation, directed   -->
    <path class="draw-line-open" d="…"/>             <!-- …not established       -->
    <text class="draw-value" …>709</text>
  </svg>
</div>
```

`.draw-box-*` names an **area**, not a `<rect>`: a circle that is a hole takes
the same role. Absence is dashed and takes a tone — warn (the default) for "as
far as we got", `tone-neutral` for a hole, `tone-danger` for a measurement that
does not exist.

**Arrowheads come from one marker, defined once per document.** `.draw-arrow`
sets `marker-end`, and a reference that resolves to nothing is not an error in
SVG — the line simply ends. Put this in your page shell, not in each figure:

```html
<svg class="draw-defs" aria-hidden="true" focusable="false">
  <marker id="dd-arrow" markerUnits="userSpaceOnUse" viewBox="0 0 8 6"
          refX="8" refY="3" markerWidth="8" markerHeight="6"
          orient="auto-start-reverse">
    <path class="draw-arrowhead" d="M0 0L8 3L0 6Z"/>
  </marker>
</svg>
```

**To name a part of a figure, number it — don't write the sentence into the
picture.** More `<text>` turns a diagram into an image of words: it stops
reflowing, stops printing at the reader's size, stops being searchable. Numbers
go in the drawing, sentences go in the key. The key numbers itself, so the two
sequences cannot drift.

```html
<svg class="draw" …>
  …
  <path class="leader" d="M318 96H392"/>          <!-- names a place, so no arrowhead -->
  <circle class="leader-foot" cx="318" cy="96"/>
  <g class="mark" transform="translate(404 96)"><circle/><text>1</text></g>
</svg>

<ol class="legend legend-key">
  <li><span class="legend-name">Dependency not modeled</span> — 709 statements
      stop where a call leaves the analyzed set.</li>
  <li class="mark-open">No measurement exists for runtime execution.</li>
</ol>
```

`.mark` is one class with two renderings — `<g class="mark">` in SVG, placed
once with a `transform`, and `<span class="mark">1</span>` in HTML. Running
text still points *at* a figure with `.ref` and `.ref ref-mark`; a mark labels
one.

**What the marks mean is always `.legend`**, in the shape the legend has to
carry: the base for a mark, a count and a definition; `.legend-inline` for a
strip under a drawing; `.legend-key` for numbered callouts. (`.graph-legend` is
the former name of `.legend-inline`.)

**A source is cited by number and listed once.** `.cite` is a bracketed number
in the running text — at the size of a count, no underline, so a sentence with
three sources is not three links. `.sources` numbers itself from the list, so
`start` and `value` are respected and the numbers cannot drift from the HTML.
On paper each entry spells out its address on its own line; the document says
whether the running text repeats them.

```html
<p class="note">Built grunt-sstp to report build results.<a class="cite" href="#src-1">1</a></p>

<ol class="sources">
  <li id="src-1"><a href="https://qiita.com/kinzal/items/ecc0284e3e9a8d00f6b9" lang="ja">GruntJSで伺かを操作するgrunt-sstpを作った</a>
    <span class="source-meta">Qiita · 2014.05.06</span></li>
</ol>
```

**Paper is chosen by the document, not by the stylesheet.** Two attributes on
the root are the whole print setup for a long paper: the sheet size with its
margins and page numbers, and where addresses are printed (`inline` by
default, `sources`, or `none`). A `.timeline` inside a `.sheet` reads at the
report's size, and `.hero > .figures` leads with three short answers where a
before / after would be wrong.

```html
<html lang="ja" data-dd-paper="a4" data-dd-print-urls="sources">
```

**Optional behaviour**, driven by attributes; the page is complete without it:

```html
<script src="https://k-kinzal.github.io/document-design/v1/document-design.js" defer></script>
<button class="btn" data-dd-theme-toggle>◐</button>
<table class="sortable" data-dd-sortable><th data-dd-sort>Name</th>…</table>
<pre class="code">…</pre><button class="btn copy" data-dd-copy>Copy</button>
<ul class="rows" data-dd-defer>…</ul>
```

## Do's and Don'ts

**Do**

- Pick a genre and keep to its scale.
- Attach every count to what it counts. `978` is not information; `978
  findings` is.
- Say what is not known. A page that can only render success makes its
  generator round up, and a lower bound gets read as a total. Use `.hole` for a
  gap inside a value, `.meter-part.is-open` for "as far as we got", `.empty`
  for nothing-and-why, `.caveat` for something the reader would be wrong to
  assume still holds.
- Make every mark say it twice. A diff line carries `+` as well as a tint; an
  active facet carries an outline as well as a fill. Tints are gone on paper.
- Emit complete content and let the script collapse it. Tab panels ship visible
  and headed; the strip appears only once the behaviour layer is running.
- Override with an ordinary rule. Everything ships inside `@layer dd`, so your
  unlayered CSS wins without `!important`.

**Don't**

- Don't use an identity hue for a state, or a state hue for a kind. Don't use
  red for anything but "look at this".
- Don't shrink type to gain density. Recover it from spacing instead.
- Don't set `hidden` on content the reader may need to find — an inactive panel
  is invisible to find-in-page and absent from an archived copy.
- Don't put a component's only explanation in a `title` or a tooltip. Those
  cannot be reached by touch, by find-in-page, or in print.
- Don't box everything. Reach for a rule first.
- Don't redefine `--dd-*` tokens per component; set them on `:root` to retheme,
  and use tone classes locally.
- Don't let a figure wrap. `.fig` and `.stat-fig` are exempt from the breaking
  rule on purpose — a number that wraps is not a smaller number, it is a
  different one.
- Don't paint a mark in a drawing by hand. `fill="var(--dd-accent)"
  fill-opacity=".12"` is not the tint the components beside it use, and in
  dark mode it is not even close; it also cannot follow a tone or survive a
  forced palette. `fill="none"` is fine — that is a shape, not a colour.
- Don't let a drawing scale. State `--dd-draw-width` and it renders at 1:1; an
  SVG with a viewBox and no width scales its text along with everything else,
  and an authored 14 becomes whatever the column happened to be.
- Don't explain a figure inside the figure. A sentence set as `<text>` cannot
  reflow, cannot be found, and prints at whatever size the drawing ended up.
  Number the part and put the sentence in the key.
- Don't require JavaScript for anything a reader must reach.
