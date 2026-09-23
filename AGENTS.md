# AGENTS

## Project language

This is an English-language project with Japanese support and typography
optimized for Japanese output.

- Write project documentation, contributor instructions, code comments, developer
  tooling messages, and default examples in English.
- Storybook titles, descriptions, and default stories are English. Keep Japanese
  typography and localization checks as explicitly named Japanese variants, with
  English explanations and `lang="ja"` on the Japanese content.
- The product site's source language and default routes are English. Maintain
  Japanese translations under `/ja/` and in the Japanese message catalog.
- Preserve Japanese typography, localized labels, and tests. Japanese text is
  appropriate in translations, language-specific specimens, and quoted source
  material; mark its language explicitly in HTML.

## Vision

Build a design system for the documents and papers produced by k-kinzal.
Focus on making information easy to see, with high information density and
clear visual presentation.

This system specializes in typesetting and typography. Figures and graphs are
part of that same system. It provides the foundation for beautiful, readable
sites composed from documents and papers.

## Architecture

### Design System

#### Purpose

**Make information easy to see.** This is the sole purpose; everything below
follows from it.

There are two kinds of page, and clarity means something different in each:

- **Documents (catalogs)** have high information density. Readers search for one
  item among many. Clarity means **remaining scannable at high density**.
- **Papers (reports)** have low information density. Readers need to grasp the
  whole on first encounter. Clarity means **showing what the page says at a glance**.

These requirements pull in opposite directions. More density reduces immediate
comprehension; more whitespace reduces scanning efficiency. **One scale cannot
serve both**, so there are two genres, each with its own type and spacing scales.

#### Principles derived from that purpose

1. **Never trade readability for density.** Smaller text is degradation, not density. Recover density from spacing.
2. **Make hierarchy immediately visible.** The most important thing is the largest. A caveat too small to read is a failed hierarchy, not subtlety.
3. **Numbers answer a question.** `978` says nothing on its own; `978 findings` does. Never leave a count without a label.
4. **Colour is vocabulary, not decoration.** Separate identity (what something is, without judgement) from state (how it is going). Mixing them turns a catalog into an alarm panel that cannot be scanned.
5. **Absence is information.** If the page cannot say “could not resolve”, readers infer false completeness: a lower bound looks like a total. Absence is a first-class expression (`.hole`, `.meter-part.is-open`, `.empty`, `.caveat`). **Reserve red exclusively for it**, never for syntax highlighting or categories, so the page's only red always means “look here”.
6. **Encode every mark twice.** Colour alone disappears in print, with some colour vision, or in forced colours. A diff also has `+`, a facet has a border, and the current location has a bar.
7. **Consistency is basic quality.** If the same thing looks different, readers must relearn it on every page. Consistency comes before clarity.
8. **Set things that are seen differently from things that are read.** Headings, figures, and labels are *seen* and need even spacing. Prose is *read*: preserve the density contrast between kanji and kana. That alternating density helps the eye follow long Japanese text.
9. **Numerical correctness is not optical correctness.** The same tracking looks loose on a 76px figure and tight on an 11px label. Adjust tracking by size band because spacing is perceived relative to type size.
10. **Measure line length in characters.** Long lines make it hard to return from the line end to the next start. The limit is in **characters**, not pixels, so use `ic`/`ric` (JLREQ specifies line lengths in multiples of the character size).
11. **Text inside a figure is still text.** The same reader reads it at the same distance in the same minute. If each author chooses label styles again, the figure is outside the type system. **A figure is a unit of explanation**, including its body, labels, caption, number, source, and references from the prose.
12. **Keep the number of right edges small.** Use three widths: prose, figures, and full width. Choosing an ideal width for each element creates as many edges as elements, leaving nothing aligned.

#### Constraints

These are not design rationales, but conditions required for the design to work:

- **The pages are generated.** The **shape of the HTML is the public API**. Keep it writable through string concatenation in PHP, Rust, or shell.
- **The pages travel.** No build, JavaScript, or network is required to read them. They open over `file://` and can be printed.
- **The content is not curated by length.** A three-line item and a 200-line item share the same list. Both must remain scannable.

#### Technical implementation

| Problem | Mechanism | Rationale |
|---|---|---|
| Two densities | `--dd-text-*` for scanning, `--dd-type-*` for reading; `.doc` and `.sheet` | A single scale inevitably fails one reading task. |
| Recovering density | Raise rem-based type by one step and reclaim the space from gaps | Keep the same rows per screen with larger letters; do not buy density with eyesight. |
| Japanese setting | Apply `palt` + `font-kerning` **only to headings, figures, and labels**; keep natural spacing in prose | Applying them to `body` flattens the density contrast between kanji and kana and makes it harder to follow a line. |
| Japanese/Latin spacing | `text-autospace: normal`, excluding mono | The default is `no-autospace`. Generated Japanese contains Latin identifiers and numbers with no author to insert spaces. Measurements added no lines or overflow. **Do not declare** `text-spacing-trim`: its default is already `normal`. |
| Line length | `--dd-measure` 36ric / `--dd-measure-wide` 48ric | 36 Japanese or 77 Latin characters keeps both readable. The old `72ch` produced 45/99 characters, **outside both ranges**. `ch` measures “0”, not either script's text. |
| Shared right edges | Root-relative `ric`, not element-relative `ic` | With `ic`, the same token becomes wider in headings. Measured widths of 576 for prose, 720 for h3, and 768 for h2 created **five right edges**. Each character count was correct; the page was not. |
| Figure text | Roles in `components/draw.css` (`.draw-label`, `.draw-value`, `.draw-cap`, …) | Handwritten 14/15/16/20 sizes were really **one size plus weight and colour**. `scripts/drawing-type.mjs` prevents their return. |
| Figure **lines and fills** | `.draw-box`, `.draw-box-toned`, `.draw-box-alt`, `.draw-box-open`, `.draw-group`, `.draw-fill`, `.draw-line`, `.draw-line-open`, `.draw-guide`, `.draw-focus` | Two review rounds left **0 of 146** text elements with handwritten styles, but **78 of 146** marks still had them, including direct `--dd-red` strokes. Readers see both in the same minute. |
| Direction in figures | `.draw-arrow` and one `<marker id="dd-arrow">` per document (`.draw-defs`) | Each arrowhead used to have three manually calculated points. Moving nodes silently left nine stale points. `fill="context-stroke"` follows the line's colour. |
| Referring to part of a figure | `components/annotate.css` (`.mark`, `.leader`, `.legend-key`) | Figures had numbers, captions, and sources but **no way to point at a part**. Authors put explanatory sentences in `<text>`, turning the figure into an image of text. |
| Legends | One `.legend` in `components/legend.css` (`.legend-inline`, `.legend-key`) | Meter `.legend` and graph `.graph-legend` answered the same question with different sizes, colours, and gaps. A page containing both spoke in two voices. |
| Figure shrinkage | Fix the drawing at **1:1 scale** with `--dd-draw-width`; scroll the wrapper when narrow | SVG scales its text with its box. A nominal 15px label was measured at 13.8px at full width and 8.8px at 820px. Choosing a label size cannot control a later scaling factor. |
| Figure references | `.plate` numbers with a counter; `.ref` points to it from prose | Unnumbered figures cannot be referenced. **CSS owns numbering; the author owns references.** If a generator writes a number, use `.plate-unnumbered` and let it own both. |
| Comparisons | `.compare` for prose, `.compare-draw` for figures; `.was` / `.now` / `.cap` name the sides | Both are comparisons. Equal tracks were wrong for figures: a 532px drawing scrolled inside a 504px track. |
| Margin notes | One `.sidenote`, both in the rail and beside captions | Readers encounter the same kind of note in both places. Two names would make two contracts. |
| Pointing to figures | `.ref` for numbers; `.ref ref-mark` for identifiers | Same underline and hover. Use letters only where numbering would introduce a second sequence, as with comparison sides A and B. |
| The rail's job | `.rail` occupies three columns (240px), holding section numbers and margin notes | Three of twelve columns used to stay empty for the section's height after a two-line label. Inserting notes into the body interrupts the argument they qualify. |
| Tracking | Six `--dd-track-*` bands, from display −0.04em to eyebrow +0.16em | Put optical adjustments in the system. Previously eight negative and four positive values were chosen independently by eye. |
| Japanese line-breaking rules | `line-break: strict` throughout | Keeping small kana and closing brackets off line starts is correctness, not taste. |
| Cascade precedence | `@layer dd.{reset,tokens,base,layout,component,utility,print}` | Naming conventions rely on every generator's discipline; layers are browser-enforced rules. **This is why class names can remain unprefixed.** |
| Naming collisions | Prefix custom properties only with `--dd-` | Custom properties inherit across the entire document; neither `@layer` nor `@scope` contains them. They are also a theme API and need stable names. |
| Themes | `light-dark()` + `color-scheme` | Write the palette once; manual switching changes only `color-scheme`. |
| Colour readability | `color-mix(in oklab, hue var(--dd-tint-mix), bg)` | Derive `--dd-tint-mix` from **contrast targets**, not preference. |
| Verifying claims | `scripts/contrast.mjs`, required in CI; 150 pairs across all hues, five surfaces, and tints | “Easy to see” is a claim only when it can be checked. |
| Orthogonal colour | Components read `--dd-tone` / `--dd-tone-tint` | New categories need no new components. Consumers can alias `.k-select` and similar names in one line. |
| Responding to width | **Unnamed** container queries target the nearest container | A 1400px window can contain a 320px column. This preserves the promise that genres can be nested. |
| Long lists | `[data-dd-defer]` → `content-visibility` | Speeds initial rendering of 844 rows; unsupported browsers keep the same appearance. |
| Behaviour | Optional, data-attribute-driven **classic scripts** | ES modules fail over `file://`. Removing JavaScript must not break the content. |
| Print | A separate final layer, `dd.print` | Paper cannot open content hidden for the screen. Show filtered rows, closed details, and inactive tabs. |

#### Rules for changes

- **Do not use `@scope` as the foundation.** It reached Baseline in January 2026. Unsupported environments discard the entire at-rule, leaving a **completely unstyled page**, not a degraded one.
- **Allow `!important` in only two places:** reduced-motion rules in `dd.reset`, and `dd.print`. Both must override consumer styles. Elsewhere, it signals a design mistake.
- **Put genre variants in the component layer.** Layer order wins **before** specificity. `.sheet .stat` in `dd.layout` loses to defaults in `dd.component`.
- **Chips also require 4.5:1 contrast.** WCAG's large-text exception starts at 18.66px bold. 12px/600 is ordinary text.
- **Never wrap figures.** `.fig` and `.stat-fig` use `overflow-wrap: normal`. A broken number is a different number, not a smaller one.
- **Keep class names short.** `.tok-kw` can appear thousands of times per page. Generated bytes affect the reader; BEM-style long names do not help them.
- **Use real examples; never invent numbers.** The product page once demonstrated uncertainty using an invented **96%** coverage figure. The data was actually **35/844 = 4%**. The `.caveat` existed, but its content contradicted the system's central principle.<br>
  Real data is available: WordPress's 844 statements / 978 findings and bison-parser's 68.97→96.67. **Honest figures are stronger than fabricated success.** Showing 4% with a prominent caveat demonstrates uncertainty better than showing 96%.
- **Do not apply review suggestions without checking them.** Several proposals got specificity or the direction of `min()` wrong. Follow **reproduce in the browser → fix → measure again**.
- **Do not apply `palt` to prose.** It is for display text; applying it to running prose removes density cues.
- **Generators must mark Japanese content with `lang="ja"`.** `:lang(ja)` enables `word-break: auto-phrase`, Japanese figure/table labels, and Japanese setting. Stories once lacked `lang`, so **Japanese specimens were being checked with `auto-phrase` never active**.
- **Exclude opt-outs from selectors instead of cancelling them later.** `.plate-unnumbered > figcaption::before { content: none }` worked in English but failed in Japanese: `:lang(ja) .plate > figcaption::before` (0,2,1) beat (0,1,1). The counter stopped incrementing but its prefix remained, **duplicating figure numbers** in the generator-owned numbering API. Add `:not(.plate-unnumbered)` to the numbering selector.
- **Apply `palt` only to text that is short or large.** Measured Japanese lengths were 12 characters for `.claim`, 40 for `.cap`, and 58 for `.unit`; `.lead` (133 characters) and `.stand` (120) were large at 25px/20px. `.stat-label` (108 characters, eight instances with multiple sentences) and `.card-description` (109) were **neither**, so they were excluded.
- **Listings must say how many items are shown out of the total (`.listing-range`).** A heading said 844, facets said 639, and six rows appeared, without stating the searchable range. This is the catalog equivalent of a missing report `.caveat`: a lower bound looks like a total. Pagination makes it even more common.
- **Do not give one concept two names.** Past duplicates included `.sidenote` / `.margin-note`, `.plate-panels` / `.compare`, `.panel-cap` / `.cap`, and `.ref` / `.ref-mark`. **`.cap`, `.was`, and `.now` already express comparison** in the hero's BEFORE/AFTER. `.now .cap { color: accent }` applies everywhere. Check existing vocabulary before adding a name.
- **Do not set `margin` in the component layer.** `.sidenote { margin: 0 }` duplicated `dd.reset` and overrode all placement rules in `dd.layout`. The rail's measured `margin-top` became zero. Components control **how something is set**; layout controls **where it goes**.
- **Make defaults weaker than roles with `:where()`.** `.draw text` (0,1,1) beat `.draw-warn` (0,1,0). The default collapsed `draw-accent`, `draw-warn`, `draw-cap`, and `draw-mono` to fill #1b1e24, weight 400, and normal tracking, disabling the entire role system. `:where(.draw text)` has (0,0,0). **A default that cannot be overridden is a ceiling.**
- **Do not set SVG alignment in CSS.** `text-anchor` and `dominant-baseline` describe placement, not typesetting. CSS declarations **always override** presentation attributes, silently disabling every `text-anchor="end"`.
- **Prevent figures from growing as well as shrinking.** `min-width` without `width` lets a figure expand. An 820px drawing grew to 1124px (1.37×), making 14px labels render at 19.2px, larger than the page's headings.
- **Do not reset counters on the container itself.** `container-type: inline-size` implies style containment and **makes that element a counter scope root**. A reset there sits outside the scope incremented by its descendants. In Chrome 154, three figures in one sheet all read “Figure 1”. Moving the reset to `:root` or `body`, or removing it, did not help. Resetting **inside the container** (`.sheet > :first-child`) produced Figure 1/2/3.
- **Do not handwrite `font-size` in figures.** `scripts/drawing-type.mjs` rejects it. If another size is needed, a role is missing.
- **Do not handwrite `fill` or `stroke` in figures.** The same checker rejects them, except `fill="none"`, which specifies geometry rather than colour. Across two review rounds, text had 0/146 handwritten styles while `<rect>`, `<path>`, and `<circle>` had 78/146. **The reasoning for text applies equally to lines and fills.**
- **CSS always overrides SVG attributes, so use `:not([attr])` for defaults.** `draw.css` documented this, but `graph.css` violated it with `:where(.graph text) { text-anchor: middle }`. `:where()` removes specificity; it **does not stop CSS from overriding attributes**. Use `:where(.graph text:not([text-anchor]))` to supply a default only when the author supplied none.
- **Write defaults as fallbacks, not assigned values.** `.mark-open { --dd-tone: var(--dd-warn) }` is not a default. `.tone-danger` is in `dd.base`, while `.mark-open` is in `dd.component`, so `class="mark mark-open tone-danger"` stayed amber. `stroke: var(--dd-tone, var(--dd-warn))` yields when a tone is supplied.
- **Do not hide markers with `display: none`.** Hiding `.draw-defs` in print **removes every arrowhead**. A `<marker>` is a resource, not something drawn at its location. Constrain dimensions only: an SVG without a width defaults to 300×150.
- **Do not draw arrowheads as open Vs.** A measured head 5 deep and 10 wide had a 45° half-angle. Its two 10px wings looked detached from a 1.5px line. Use a filled 8×6 head (20.6° half-angle); a 1.5px outline on a 6px shape would be mostly outline.
- **Keep figure explanations outside the drawing.** Sentences in `<text>` do not wrap, are not searchable in the intended reading flow, and scale with the figure. **Put numbers in the drawing and sentences in the key below** (`.mark` + `.legend-key`). A figure has room for `709`, not for the section explaining it.
- **Do not draw to an arbitrary width that happens to fit.** The system supplies the frame: `--dd-measure-wide` is 48ric = 768px, matching the report column. A 260px drawing in a 240px frame was rendered at 0.923× even at full width.
- **Do not absolutely position margin notes.** This was tried. It aligned notes closely to their sentences, but **their height was invisible to the layout**. The first note overlapped the next row's full-width figure, with no predictable warning for authors or the system.
- **Do not use `text-align: justify`.** This was considered and measured. Although conventional in Japanese typesetting, these pages mix Japanese and Latin in short blocks (`caveat`, `note`, `lead`). In a two-line block, only the non-final line changed, by 4px, while Latin word spaces stretched. With no room to distribute, justification aligns edges without improving the text.

### Product Page

An English product and documentation site, with a Japanese translation, showing
what doc-ui is and why it is designed this way. `packages/doc-site` owns the
product page, start guide, component index with live examples, and individual
usage pages. Vite+ generates static HTML.

- **Build it with doc-ui itself.** Fill gaps by improving public doc-ui components
  and adding Storybook and usage examples, rather than site-specific CSS or components.
- **Keep each package self-contained.** Each owns its dependencies, source,
  configuration, and development/check/build commands. The project root handles
  cross-package work and shortcuts only.
- **Root `npm run dev` opens the site.** Use `npm run storybook` separately for
  component development.
- **Do not sell distribution constraints as product value.** Communicate
  scannability, immediate comprehension, and clear meaning.
- **Show real components in the index.** Individual pages include highlighted,
  copyable HTML and usage guidance.

The site is also the **first external consumer**. Anything awkward to author here
will also be awkward in php-ai-toolkit and ztd-query-php, making the site a useful
way to discover API gaps.

### Public layout

```
/                  doc-site product page (English)
/start/            getting started
/components/       live component index and individual usage guides
/ja/               Japanese versions, including /ja/start/ and /ja/components/
/storybook/        doc-ui development stories and variations (English by default)
/v1/  /latest/     doc-ui stylesheets
```

Do not update `/v1/` in a way that changes the appearance of pages already
written. Consumers are generated documents that get archived. Breaking changes
belong in `/v2/`.

## Examples

These source designs are the intended consumers. The system need not reproduce
their current design, but it must improve on it.

- [PHP DocGen](https://github.com/k-kinzal/php-ai-toolkit)
  - https://k-kinzal.github.io/ztd-query-php/pr/393/
- [SQL Catalog](https://github.com/k-kinzal/ztd-query-php)
  - `/Users/ab/Desktop/wordpress-sql-catalog/index.html`
- [QuuuAI](https://github.com/k-kinzal/quuu)
  - `/Users/ab/Library/Application Support/taskd/reports/tsk_bc4869e9ddf54c998b18/rpt_2f13da82c39248859bc8.html`
