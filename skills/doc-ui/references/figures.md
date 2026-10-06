# Figures, charts, and tables

Choose the mark by the reader's question. Derive values and coordinates from
the supplied data or stated formulas; label analytical values as calculations.

| Question | Pattern |
| --- | --- |
| How does a whole divide? | `.meter`, `.meter-part`, `.legend` |
| Which category has more? | `.bars`, `.bar-row`, `.bar-track`, `.bar-fill`, `.bar-value` |
| What changed between observations? | `.plot-span`, `.plot-before`, `.plot-point` |
| How does a value vary over time or position? | `.plot-line`, `.plot-point`, `.plot-missing` |
| Where do observations concentrate? | `.plot-bin`, `.plot-zero` |
| What depends on what? | `.graph`, `.node`, `.edge` |
| Which branch leads to an outcome? | `.node-action`, `.node-decision`, `.node-terminal`, `.edge-flow`, `.edge-arrow` |

Wrap a visual in `figure.plate` with an ID and a `figcaption` explaining its
meaning, units, and source (`.plate-source`). Point to it from prose with
`<a class="ref" href="#figure-id">Figure 1</a>`. Use `.plate-table` for a
table's independent numbering sequence, `.table-wrap` for overflow, and `.num`
for numeric cells. Give table headers `scope` and the table an accessible name.

CSS supplies figure/table numbers. If the generator owns numbering, add
`.plate-unnumbered` and write both caption numbers and references yourself.
Do not reset counters per section or on container-query roots.

## Draw at reading size

Use `.draw-wrap` around SVG `.draw`; match `--dd-draw-width` to the viewBox's
width for 1:1 rendering. This structural example has no measured data:

```html
<figure class="plate" id="fig-process">
  <div class="draw-wrap" tabindex="0" role="region" aria-label="Process diagram">
    <svg class="draw" style="--dd-draw-width: 576px" viewBox="0 0 576 100"
         role="img" aria-labelledby="process-title">
      <title id="process-title">An input is transformed into an output</title>
      <rect class="draw-box" x="16" y="20" width="160" height="60" rx="4"/>
      <text class="draw-label" x="96" y="55" text-anchor="middle">Input</text>
      <path class="draw-line" d="M176 50H400"/>
      <rect class="draw-box" x="400" y="20" width="160" height="60" rx="4"/>
      <text class="draw-label" x="480" y="55" text-anchor="middle">Output</text>
    </svg>
  </div>
  <figcaption>A transformation relates input and output.</figcaption>
</figure>
```

- The normal measure is `--dd-measure` (36ric); `.plate-wide` uses
  `--dd-measure-wide` (48ric); `.plate-full` uses the available column. At a
  16px root the first two are 576px and 768px. Choose geometry for that frame
  and the printed type area. Scroll locally on narrow screens; do not scale
  labels down or let the SVG grow beyond its authored size.
- Use text roles such as `.draw-label`, `.draw-value`, `.draw-cap`, `.draw-note`,
  and `.draw-mono`. Use mark roles such as `.draw-box`, `.draw-box-toned`,
  `.draw-box-open`, `.draw-line`, `.draw-line-open`, and `.draw-guide`. Do not
  handwrite font sizes, fills, or strokes; `fill="none"` is allowed for geometry.
  Put alignment in SVG attributes, not CSS.
- Use `.draw-arrow` with one `marker#dd-arrow` in `.draw-defs` per document;
  copy its definition from the Drawing example. It also supplies arrowheads
  on `.edge-flow` paths. Do not hide marker resources in print.
- Put explanations outside SVG. Use `.mark`, `.leader`, and `.legend-key` to
  connect numbered marks with a key below; use `.legend` for series labels.
- Bar rows share a maximum: `--dd-bar` is `value / maximum * 100%`. Zero stays
  zero; missing values use `.bar-track.is-missing` with explicit text. Break
  lines at missing observations instead of drawing a false connection.

Check labels, caption numbers, cross-references, missing values, and series
distinctions in light, dark, neutral/print output, and the final paginated PDF
when requested. Provide underlying values as text or a table where readers
need exact comparisons.

Source examples: `packages/doc-ui/stories/Components.Drawing.stories.js`,
`packages/doc-ui/stories/Components.Plate.stories.js`, and
`packages/doc-ui/stories/graph-examples.js`.
