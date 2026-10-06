# Reports and profiles

Use `.sheet` to make the main conclusion apparent at a glance. Lead with a
meaningful change or claim, then evidence and limits. Use the user's actual
findings; a before/after hero is optional.

```html
<article class="sheet" lang="en">
  <p class="eyebrow">WordPress SQL analysis</p>
  <h1>Keep unresolved statements visible</h1>
  <p class="stand">Resolved statements are a lower bound, not the whole catalog.</p>
  <section class="sec">
    <div class="rail">
      <h2 class="label">01<br>Coverage</h2>
      <p class="sidenote">The denominator includes all cataloged statements.</p>
    </div>
    <div class="field">
      <p class="lead">35 of 844 statements were resolved.</p>
      <div class="stats">
        <div class="stat">
          <b class="stat-fig">4%</b>
          <span class="stat-label">Resolved share, rounded from 35 / 844.</span>
        </div>
      </div>
    </div>
    <p class="caveat">The remaining statements are unresolved; this is not
      complete coverage.</p>
  </section>
</article>
```

- Put `.sec` and `.hero` directly inside `.sheet`, or inside a semantic
  `.sheet-body` wrapper. Use `.sheet.sheet-inset` for an embedded report.
- For a before/after hero, use `.hero > .was` and `.hero > .now`, each with
  `.cap` and either `.fig` for a short number or `.claim` for words. Give numbers
  their meaning with `.unit`. Do not force a count onto a qualitative result.
- For a profile or theme without a comparison, `.hero > .figures` groups short
  statements. Use `.timeline` with `.timeline-item`, `.timeline-time`,
  `.timeline-title`, and `.timeline-description` for a chronology.
- Use `.rail` for section labels and `.sidenote`, `.field` for the argument,
  `.lead` for its claim, and `.note` for supporting prose. Keep notes in normal
  flow so they cannot overlap later figures.
- `.compare` with `.was` / `.now` / `.cap` compares prose; add `.compare-draw`
  for drawings. Its two-column layout needs a sufficiently wide `.field`,
  `.sheet`, or `.content` container, regardless of window width.
- Keep exact long values in a table and use explicitly rounded headline values.
  Never wrap digits or shrink `.fig` / `.stat-fig` to make them fit. Check the
  printed result because paper cannot scroll.

Source examples: `packages/doc-site/src/report.mjs` and
`packages/doc-site/src/paper.mjs` (a long profile composed as a report).
