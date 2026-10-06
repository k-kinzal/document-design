---
name: doc-ui
description: Create and edit static HTML documents, reports, research papers, books, and catalogs with @k-kinzal/doc-ui. Use when the user requests doc-ui or document-design, or when the existing output already uses its classes; includes Markdown conversion and printable output.
---

# doc-ui

Make information easy to see with doc-ui's public HTML vocabulary. Use `.doc`
for dense material readers scan and `.sheet` for material readers read through.
Paper and book compositions build on `.sheet`.

## Choose the reference

Read only the reference for the requested output, plus supporting references
when the content needs them.

| Output or task | Reference |
| --- | --- |
| Research paper, article, abstract, equations, citations | [references/paper.md](references/paper.md) |
| Results brief, before/after report, profile, chronology | [references/report.md](references/report.md) |
| API documentation, SQL catalog, searchable record listing | [references/catalog.md](references/catalog.md) |
| Book, chapters, trim size, running heads, page numbers | [references/book.md](references/book.md) |
| Figures, charts, diagrams, tables and their references | [references/figures.md](references/figures.md) |
| Convert existing Markdown to a complete HTML document | [references/markdown.md](references/markdown.md) |

## Author the document

1. Identify the reading task, source material, language, and screen/print needs.
   Preserve the consumer's pinned doc-ui version and existing structure when
   editing. Check that the selected distribution supports the required classes.
2. Use the appropriate reference's HTML structure. Prefer the Markdown CLI for
   an existing Markdown manuscript; author HTML for richer compositions.
3. Load doc-ui once. In this repository, `npm run build:ui` creates
   `packages/doc-ui/dist/document-design.css`. Copy it beside the output or
   embed it, retaining license comments and applicable third-party notices.
   Outside a checkout, use an installed package or a verified distribution at
   `https://k-kinzal.github.io/document-design/`. Full-version and full-commit-SHA
   paths are immutable; `/v1/` follows compatible releases and `/latest/`
   follows main. Pin an immutable path for archived documents.
4. Keep images and any palette stylesheet local for offline output. Load one
   `palettes/<id>.css` after the base CSS, for example `palettes/linen-teal.css`.
   Plain HTML needs no framework, build step, or JavaScript to be read.

Use this outer frame with the chosen composition inside `body`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Document title</title>
  <link rel="stylesheet" href="./document-design.css">
</head>
<body><!-- Insert the selected composition here. --></body>
</html>
```

## Keep the design contract

- Use real source data. Label counts and units; show missing or unresolved
  information with `.hole`, `.empty`, or `.caveat`. Reserve red for absence.
- Recover density from spacing, not smaller type. Reuse public components and
  `--dd-*` tokens before adding CSS. Keep prose, wide figures, and full-width
  content aligned to the system's measures.
- Set `lang="ja"` on Japanese documents or passages. Leave prose spacing to
  doc-ui: do not add `palt`, justification, or manual Japanese/Latin spacing.
- Use `data-dd-theme="light"` or `"dark"` only for an explicit mode; omission
  follows the system. `data-dd-color="grayscale"` or `"monochrome"` selects
  neutral inks. Preserve meaning with labels, shapes, or line patterns as well
  as color.
- Add the optional `document-design.js` as a classic script only when controls
  need it. Mark JavaScript-only controls `data-dd-enhance hidden`; keep content
  readable with scripts disabled and over `file://`.

## Verify the result

Open the actual output at wide and narrow widths. Check long titles, exact
numbers, links, Japanese text where present, and local assets with JavaScript
disabled. If themes or controls are offered, exercise them. For PDF delivery,
paginate the HTML and inspect the resulting pages; print media alone does not
verify page breaks. Confirm captions, references, sources, and the last
paragraph survive. Report any checks that could not be performed.

For additional components, consult the matching source in
`packages/doc-ui/src/` and `packages/doc-ui/stories/` when a checkout is available,
or the [component guides](https://k-kinzal.github.io/document-design/components/)
and [Storybook](https://k-kinzal.github.io/document-design/storybook/).
