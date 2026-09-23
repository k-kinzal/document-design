/* Fixed observations, not generated demo numbers. This documentation fixture
 * is owned by doc-site; builds do not import a sibling package's stories.
 * Provenance: ../README.md. No chart runtime is required by consumers. */
export const callers = [
  ['MySQL::save', 8], ['MySQL::__construct', 1], ['MySQL::load', 1],
  ['MySQL::mtime', 1], ['MySQL::touch', 1], ['MySQL::unlink', 1],
];
export const statementLines = [90, 120, 135, 142, 146, 156, 204, 208, 216, 240, 297, 317, 335];
const source = 'WordPress SQL catalog snapshot · cache_data · SimplePie/Cache/MySQL.php';

export const bars = `<figure class="plate plate-wide">
  <p><strong>Which caller contains the most statements?</strong></p>
  <p class="muted">Statements per caller · common scale: 0–8 statements</p>
  <ul class="bars">
${callers.map(([name, n]) => `    <li class="bar-row">
      <span class="bar-label mono">${name}</span>
      <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="--dd-bar:${n / 8 * 100}%"></span></span>
      <span class="bar-value">${n} ${n === 1 ? 'statement' : 'statements'}</span>
    </li>`).join('\n')}
  </ul>
  <figcaption>MySQL::save contains 8 of the 13 statements; each other caller contains one.
    <span class="plate-source">${source}. Counts describe static call sites, not execution frequency.</span>
  </figcaption>
</figure>`;

export const barsPreview = `<div>
  <p class="note">2 of 6 callers · common scale: 0–8 statements</p>
  <ul class="bars">${callers.slice(0, 2).map(([name, n]) => `<li class="bar-row">
    <span class="bar-label mono">${name}</span>
    <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="--dd-bar:${n / 8 * 100}%"></span></span>
    <span class="bar-value">${n} ${n === 1 ? 'statement' : 'statements'}</span>
  </li>`).join('')}</ul>
</div>`;

export const missingBars = `<figure class="plate plate-wide">
  <p><strong>Zero and unknown answer different questions.</strong></p>
  <ul class="bars">
    <li class="bar-row">
      <span class="bar-label">Fully traced to runtime input</span>
      <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="--dd-bar:0%"></span></span>
      <span class="bar-value">0 statements</span>
      <span class="bar-note">Observed zero in the 844-statement analysis.</span>
    </li>
    <li class="bar-row">
      <span class="bar-label">SQL executed at runtime</span>
      <span class="bar-track is-missing" aria-hidden="true"></span>
      <span class="bar-value">Not measured</span>
      <span class="bar-note">Static analysis does not record runtime execution counts.</span>
    </li>
  </ul>
  <figcaption>An absent measurement has no bar length. Do not substitute zero.
    <span class="plate-source">WordPress SQL catalog snapshot · resolution categories and analysis scope.</span>
  </figcaption>
</figure>`;

export const comparison = `<figure class="plate plate-wide">
  <p><strong>How far did source coverage move?</strong></p>
  <div class="draw-wrap" role="region" aria-label="Source coverage comparison" tabindex="0">
    <svg class="draw" style="--dd-draw-width:768px" viewBox="0 0 768 220" role="img" aria-label="Source coverage: before 20 of 29 units, 68.97 percent; after 29 of 30 units, 96.67 percent. Increase of 27.70 percentage points. The denominator changed.">
      <text class="draw-note" x="48" y="24">Source coverage (%) · 0–100</text>
      <path class="plot-grid" d="M48 56V160 M216 56V160 M384 56V160 M552 56V160 M720 56V160"/>
      <path class="plot-axis" d="M48 160H720"/>
      <path class="plot-span" d="M511.45 116H697.6"/>
      <circle class="plot-before" cx="511.45" cy="116" r="6"/>
      <circle class="plot-point" cx="697.6" cy="116" r="6"/>
      <text class="draw-value" x="503" y="74" text-anchor="end">Before · 68.97%</text>
      <text class="draw-note" x="503" y="94" text-anchor="end">20 / 29 source units</text>
      <text class="draw-value" x="720" y="44" text-anchor="end">After · 96.67%</text>
      <text class="draw-note" x="720" y="64" text-anchor="end">29 / 30 source units</text>
      <text class="draw-note" x="48" y="184" text-anchor="middle">0</text>
      <text class="draw-note" x="216" y="184" text-anchor="middle">25</text>
      <text class="draw-note" x="384" y="184" text-anchor="middle">50</text>
      <text class="draw-note" x="552" y="184" text-anchor="middle">75</text>
      <text class="draw-note" x="720" y="184" text-anchor="middle">100</text>
    </svg>
  </div>
  <figcaption>Source coverage rose by 27.70 percentage points. Hollow = before; filled = after.
    <span class="plate-source">bison-parser 3.8.2 task report · 2026-02-11. Before: 20/29; after: 29/30 source units. The denominator grew by one; one unit remains uncovered.</span>
  </figcaption>
</figure>`;

// Cumulative static call sites by source line. A step changes only at a call
// site, so it makes no claim about unobserved intermediate measurements.
const x = n => 64 + n * 1.64;
const y = n => 244 - n * 14;
const step = statementLines.map((line, i) => `H${x(line).toFixed(2)}V${y(i + 1)}`).join(' ');
const cumulative = [0, 100, 200, 300, 400].map(line => [line, statementLines.filter(n => n <= line).length]);
export const trend = `<figure class="plate plate-wide">
  <p><strong>Where do statements accumulate in the file?</strong></p>
  <div class="draw-wrap" role="region" aria-label="Cumulative statement plot" tabindex="0">
    <svg class="draw" style="--dd-draw-width:768px" viewBox="0 0 768 320" role="img" aria-label="Cumulative statements referencing cache_data by source line: line 0, zero; line 100, one; line 200, six; line 300, eleven; line 400, thirteen. Steps occur at the 13 observed call sites.">
      <text class="draw-note" x="64" y="24">Cumulative statements</text>
      <path class="plot-grid" d="M64 62H720 M64 174H720"/>
      <path class="plot-axis" d="M64 48V244H720"/>
      <text class="draw-note" x="48" y="249" text-anchor="end">0</text>
      <text class="draw-note" x="48" y="179" text-anchor="end">5</text>
      <text class="draw-note" x="48" y="67" text-anchor="end">13</text>
      <path class="plot-line" d="M64 244 ${step} H720"/>
${cumulative.map(([line, count]) => `      <circle class="plot-point" cx="${x(line)}" cy="${y(count)}" r="4"/>
      <text class="draw-value" x="${x(line)}" y="${y(count) - 14}" text-anchor="middle">${count}</text>
      <text class="draw-note" x="${x(line)}" y="270" text-anchor="middle">${line}</text>`).join('\n')}
      <text class="draw-note" x="392" y="304" text-anchor="middle">Source line · MySQL.php</text>
    </svg>
  </div>
  <figcaption>The steps show observed call sites, not runtime activity or a time series.
    <span class="plate-source">${source}. 13 statements at lines ${statementLines.join(', ')}.</span>
  </figcaption>
</figure>`;

export const missingTrend = `<figure class="plate plate-wide">
  <p><strong>Two snapshots do not establish the path between them.</strong></p>
  <div class="draw-wrap" role="region" aria-label="Coverage with an unrecorded interval" tabindex="0">
    <svg class="draw" style="--dd-draw-width:768px" viewBox="0 0 768 296" role="img" aria-label="Coverage before: 68.97 percent. During the change: not recorded. After: 96.67 percent. No line connects the two snapshots.">
      <text class="draw-note" x="64" y="24">Source coverage (%)</text>
      <path class="plot-grid" d="M64 56H704 M64 140H704"/>
      <path class="plot-axis" d="M64 48V224H704"/>
      <text class="draw-note" x="48" y="61" text-anchor="end">100</text>
      <text class="draw-note" x="48" y="145" text-anchor="end">50</text>
      <text class="draw-note" x="48" y="229" text-anchor="end">0</text>
      <rect class="plot-missing" x="288" y="56" width="192" height="168"/>
      <text class="plot-missing-label" x="384" y="132" text-anchor="middle">Not recorded</text>
      <text class="draw-note" x="384" y="154" text-anchor="middle">No interpolation</text>
      <circle class="plot-before" cx="160" cy="108.14" r="6"/>
      <text class="draw-value" x="160" y="88" text-anchor="middle">68.97%</text>
      <circle class="plot-point" cx="608" cy="61.6" r="6"/>
      <text class="draw-value" x="608" y="42" text-anchor="middle">96.67%</text>
      <text class="draw-label" x="160" y="252" text-anchor="middle">Before</text>
      <text class="draw-label" x="384" y="252" text-anchor="middle">During change</text>
      <text class="draw-label" x="608" y="252" text-anchor="middle">After</text>
    </svg>
  </div>
  <figcaption>Leave the interval open when no measurements exist. The horizontal positions identify phases, not elapsed time.
    <span class="plate-source">bison-parser 3.8.2 task report · 2026-02-11. Only before (20/29) and after (29/30) coverage are reported.</span>
  </figcaption>
</figure>`;

export const bins = [[1, 2], [3, 4], [5, 6], [7, 8]].map(([lo, hi]) => ({lo, hi, count: callers.filter(([, n]) => n >= lo && n <= hi).length}));
export const histogram = `<figure class="plate plate-wide">
  <p><strong>Are statements spread evenly across callers?</strong></p>
  <div class="draw-wrap" role="region" aria-label="Statements per caller distribution" tabindex="0">
    <svg class="draw" style="--dd-draw-width:768px" viewBox="0 0 768 320" role="img" aria-label="Six callers grouped by statements per caller. 1–2 statements: five callers; 3–4: zero; 5–6: zero; 7–8: one. All bins have width two statements.">
      <text class="draw-note" x="64" y="24">Callers per bin · 6 callers observed</text>
      <path class="plot-grid" d="M64 64H704 M64 136H704"/>
      <path class="plot-axis" d="M64 48V244H704"/>
      <text class="draw-note" x="48" y="249" text-anchor="end">0</text>
      <text class="draw-note" x="48" y="141" text-anchor="end">3</text>
      <text class="draw-note" x="48" y="69" text-anchor="end">5</text>
${bins.map(({lo, hi, count}, i) => `      ${count ? `<rect class="plot-bin" x="${64 + i * 160}" y="${244 - count * 36}" width="160" height="${count * 36}"/>` : `<path class="plot-zero" d="M${64 + i * 160} 244h160"/>`}
      <text class="draw-value" x="${144 + i * 160}" y="${230 - count * 36}" text-anchor="middle">${count} ${count === 1 ? 'caller' : 'callers'}</text>
      <text class="draw-note" x="${144 + i * 160}" y="272" text-anchor="middle">${lo}–${hi}</text>`).join('\n')}
      <text class="draw-note" x="384" y="304" text-anchor="middle">Statements per caller · inclusive integer bins</text>
    </svg>
  </div>
  <figcaption>Five callers contain one statement each; one contains eight. Empty bins are observed zeros, not missing measurements.
    <span class="plate-source">${source}. All 6 callers, 13 statements; bin width: 2 statements. This small sample describes one table only.</span>
  </figcaption>
</figure>`;

export const branching = `<figure class="plate plate-wide">
  <p><strong>Which reading mode fits the reader’s task?</strong></p>
  <div class="draw-wrap" role="region" aria-label="Reading mode decision diagram" tabindex="0">
    <svg class="draw" style="--dd-draw-width:768px" viewBox="0 0 768 352" role="img" aria-label="Organize the information by the reader’s task. To find one entry, choose the doc catalog layout. To understand the whole, choose the sheet report layout.">
      <!-- One node module: 224 × 64. Row pitch: 112 (64 + 48). -->
      <path class="edge-flow draw-arrow" d="M384 80V120"/>
      <path class="edge-flow draw-arrow" d="M272 160H160V232"/>
      <path class="edge-flow draw-arrow" d="M496 160H608V232"/>
      <rect class="node-action" x="272" y="16" width="224" height="64" rx="4"/>
      <text class="draw-strong" x="384" y="48" text-anchor="middle" dominant-baseline="middle">Organize the information</text>
      <path class="node-decision" d="M384 128L496 160L384 192L272 160Z"/>
      <text class="draw-strong" x="384" y="160" text-anchor="middle" dominant-baseline="middle">Reader’s task</text>
      <text class="draw-label edge-label" x="160" y="144" text-anchor="middle">Find one entry</text>
      <text class="draw-label edge-label" x="608" y="144" text-anchor="middle">Understand the whole</text>
      <rect class="node-terminal tone-blue" x="48" y="240" width="224" height="64" rx="32"/>
      <text class="draw-strong" x="160" y="272" text-anchor="middle" dominant-baseline="middle">Catalog · .doc</text>
      <text class="draw-note" x="160" y="328" text-anchor="middle">Dense, aligned entries</text>
      <rect class="node-terminal tone-teal" x="496" y="240" width="224" height="64" rx="32"/>
      <text class="draw-strong" x="608" y="272" text-anchor="middle" dominant-baseline="middle">Report · .sheet</text>
      <text class="draw-note" x="608" y="328" text-anchor="middle">Point, evidence, meaning</text>
    </svg>
  </div>
  <figcaption>A diamond asks the question; labeled arrows carry each answer to an outcome. Read from top to bottom.
    <span class="plate-source">doc-ui reading modes. A document may combine both layouts.</span>
  </figcaption>
</figure>`;

/* Index specimens are authored at 240px, not scaled-down report figures.
 * Keep all marks in view and the same 14px type. The linked full figure carries
 * the caption, denominators and source. These use only public drawing roles. */
export const comparisonPreview = `<svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 168" role="img" aria-label="Source coverage before 68.97 percent, after 96.67 percent. Full conditions in the comparison example.">
  <text class="draw-note" x="8" y="20">Source coverage (%)</text>
  <text class="draw-value" x="8" y="48">Before · 68.97%</text>
  <text class="draw-value" x="232" y="72" text-anchor="end">After · 96.67%</text>
  <path class="plot-axis" d="M16 120H224"/>
  <path class="plot-span" d="M159.45 100H217.07"/>
  <circle class="plot-before" cx="159.45" cy="100" r="5"/>
  <circle class="plot-point" cx="217.07" cy="100" r="5"/>
  <text class="draw-note" x="16" y="146">0</text>
  <text class="draw-note" x="224" y="146" text-anchor="end">100%</text>
</svg>`;

const smallStep = statementLines.map((line, i) => `H${(32 + line * .46).toFixed(2)}V${(128 - (i + 1) * 96 / 13).toFixed(2)}`).join(' ');
export const trendPreview = `<svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 168" role="img" aria-label="13 cumulative statements across source lines 0 to 400. Full observations in the line plot example.">
  <text class="draw-note" x="8" y="18">Statements by source line</text>
  <path class="plot-axis" d="M32 28V128H216"/>
  <path class="plot-line" d="M32 128 ${smallStep} H216"/>
  <circle class="plot-point" cx="216" cy="32" r="4"/>
  <text class="draw-note" x="24" y="37" text-anchor="end">13</text>
  <text class="draw-note" x="24" y="133" text-anchor="end">0</text>
  <text class="draw-note" x="32" y="152">0</text>
  <text class="draw-note" x="216" y="152" text-anchor="end">400</text>
</svg>`;

export const histogramPreview = `<svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 176" role="img" aria-label="Callers in two-statement bins: 1–2, five; 3–4, zero; 5–6, zero; 7–8, one.">
  <text class="draw-note" x="8" y="18">Callers · n = 6</text>
  <path class="plot-axis" d="M16 32V120H224"/>
${bins.map(({lo, hi, count}, i) => `  ${count ? `<rect class="plot-bin" x="${16 + i * 52}" y="${120 - count * 16}" width="52" height="${count * 16}"/>` : `<path class="plot-zero" d="M${16 + i * 52} 120h52"/>`}
  <text class="draw-value" x="${42 + i * 52}" y="${112 - count * 16}" text-anchor="middle">${count}</text>
  <text class="draw-note" x="${42 + i * 52}" y="143" text-anchor="middle">${lo}–${hi}</text>`).join('\n')}
  <text class="draw-note" x="120" y="168" text-anchor="middle">Statements per caller</text>
</svg>`;

export const branchingPreview = `<svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 168" role="img" aria-label="Reader’s task: find one entry, choose Catalog; understand the whole, choose Report.">
  <!-- Short labels use one compact module: 96 × 40, with full-size type. -->
  <path class="edge-flow draw-arrow" d="M72 28H16V96H56V112"/>
  <path class="edge-flow draw-arrow" d="M168 28H224V96H184V112"/>
  <path class="node-decision" d="M120 8L168 28L120 48L72 28Z"/>
  <text class="draw-strong" x="120" y="28" text-anchor="middle" dominant-baseline="middle">Task</text>
  <text class="draw-label edge-label" x="68" y="84" text-anchor="middle">Find one</text>
  <text class="draw-label edge-label" x="172" y="84" text-anchor="middle">Understand</text>
  <rect class="node-terminal tone-blue" x="8" y="120" width="96" height="40" rx="20"/>
  <text class="draw-strong" x="56" y="140" text-anchor="middle" dominant-baseline="middle">Catalog</text>
  <rect class="node-terminal tone-teal" x="136" y="120" width="96" height="40" rx="20"/>
  <text class="draw-strong" x="184" y="140" text-anchor="middle" dominant-baseline="middle">Report</text>
</svg>`;

/*
 * Where a statement stops — the callout figure, on the resolution counts the
 * catalog actually reports: 35 + 709 + 95 + 5 = 844.
 *
 * Drawn around the 809 that do not arrive, because that is what a reader has
 * to know before reading any other number on the page. A figure showing only
 * the 35 would be the invented-coverage failure again, in a picture.
 *
 * Numbers in the drawing, sentences in the key. A drawing has room for "709"
 * and not for the clause that explains it — and the clause is the half that
 * has to reflow, print at the reader's size and be searchable.
 */
const STAGES = [
  { x: 16, w: 148, value: '844', note: 'statements' },
  { x: 212, w: 148, value: 'callers', note: 'resolved' },
  { x: 408, w: 148, value: 'dependencies', note: 'followed' },
];
const EXITS = [
  { x: 18, w: 144, cx: 90, value: '5', note: 'not analyzed', tone: ' tone-danger' },
  { x: 214, w: 144, cx: 286, value: '709', note: 'no model', tone: '' },
  { x: 410, w: 144, cx: 482, value: '95', note: 'cycle or limit', tone: '' },
];

export const callouts = `<figure class="plate plate-wide" id="fig-stops">
  <p><strong>Where does a statement stop?</strong></p>
  <div class="draw-wrap" role="region" aria-label="Statement resolution and its three exits" tabindex="0">
    <svg class="draw" style="--dd-draw-width:768px" viewBox="0 0 768 216" role="img" aria-label="Of 844 statements, 5 are not analyzed, 709 stop where a dependency is not modeled, 95 stop at a cycle or a search limit, and 35 are fully determined.">
${STAGES.map(s => `      <rect class="draw-box" x="${s.x}" y="24" width="${s.w}" height="56" rx="8"/>
      <text class="draw-value" x="${s.x + s.w / 2}" y="46" text-anchor="middle">${s.value}</text>
      <text class="draw-note" x="${s.x + s.w / 2}" y="66" text-anchor="middle">${s.note}</text>`).join('\n')}
      <rect class="draw-box-toned tone-accent" x="604" y="24" width="148" height="56" rx="8"/>
      <text class="draw-value draw-accent" x="678" y="46" text-anchor="middle">35</text>
      <text class="draw-note" x="678" y="66" text-anchor="middle">fully determined</text>

      <path class="draw-line draw-arrow" d="M168 52H208"/>
      <path class="draw-line draw-arrow" d="M364 52H404"/>
      <path class="draw-line draw-arrow" d="M560 52H600"/>

${EXITS.map((e, i) => `      <path class="draw-line draw-arrow" d="M${e.cx} 84V144"/>
      <rect class="draw-box-open${e.tone}" x="${e.x}" y="148" width="${e.w}" height="52" rx="8"/>
      <text class="draw-value" x="${e.cx}" y="170" text-anchor="middle">${e.value}</text>
      <text class="draw-note" x="${e.cx}" y="190" text-anchor="middle">${e.note}</text>
      <g class="mark mark-open${e.tone}" transform="translate(${e.x + e.w + 20} 174)"><circle/><text>${i + 1}</text></g>`).join('\n')}
    </svg>
  </div>
  <ol class="legend legend-key">
    <li class="mark-open tone-danger"><span class="legend-name">Not analyzed</span> — 5 statements the run never reached. An absence of measurement, not a measurement of zero.</li>
    <li class="mark-open"><span class="legend-name">Dependency not modeled</span> — 709 statements stop where a call leaves the analyzed set. The catalog knows they exist and not what they say.</li>
    <li class="mark-open"><span class="legend-name">Stopped at a cycle or limit</span> — 95 statements reached the search budget. A larger budget would move some of them; how many is not known.</li>
  </ol>
  <figcaption>35 of 844 statements are fully determined. The other 809 are what this figure is about.
    <span class="plate-source">WordPress SQL catalog snapshot · resolution categories, 35 + 709 + 95 + 5 = 844. Counts describe one analysis run, not WordPress.</span>
  </figcaption>
</figure>`;

/* The index specimen. The marks stay 22px: a callout that shrinks with its
 * drawing is a callout nobody reads, which is the argument draw.css makes for
 * labels — and a number in a disc is a label with nowhere to reflow to. */
export const calloutsPreview = `<svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 152" role="img" aria-label="Of 844 statements, 35 are fully determined; 809 stop at one of three exits.">
  <rect class="draw-box" x="8" y="16" width="86" height="40" rx="6"/>
  <text class="draw-value" x="51" y="34" text-anchor="middle">844</text>
  <text class="draw-note" x="51" y="50" text-anchor="middle">statements</text>
  <path class="draw-line draw-arrow" d="M98 36H130"/>
  <rect class="draw-box-toned tone-accent" x="134" y="16" width="86" height="40" rx="6"/>
  <text class="draw-value draw-accent" x="177" y="34" text-anchor="middle">35</text>
  <text class="draw-note" x="177" y="50" text-anchor="middle">determined</text>
  <path class="draw-line draw-arrow" d="M51 60V92"/>
  <rect class="draw-box-open" x="8" y="96" width="120" height="40" rx="6"/>
  <text class="draw-value" x="68" y="114" text-anchor="middle">809</text>
  <text class="draw-note" x="68" y="130" text-anchor="middle">stop before the end</text>
  <g class="mark mark-open" transform="translate(150 116)"><circle/><text>1</text></g>
</svg>`;
/*
 * The specimen sheet: every mark a drawing is made of, drawn once.
 *
 * Here because the vocabulary had no page. `.draw-box`, `.draw-line` and the
 * type roles are what every other figure in this system is built out of, and
 * they were documented only inside the figures that happened to use them —
 * which is how 78 of 146 marks came to be painted by hand instead.
 */
const COL = i => 16 + i * 108;          /* 7 columns of 92, 16 apart */
const MID = i => COL(i) + 46;
const AREAS = [
  ['draw-box', 'thing'],
  ['draw-box-toned tone-accent', 'identity'],
  ['draw-box-alt tone-accent', 'other state'],
  ['draw-box-open', 'left open'],
  ['draw-box-open tone-neutral', 'a hole'],
  ['draw-fill tone-accent', 'a region'],
  ['draw-group', 'grouped'],
];
const LINES = [
  ['draw-line draw-arrow', 'directed'],
  ['draw-line-open draw-arrow', 'not established'],
  ['draw-guide', 'apparatus'],
  ['draw-line draw-focus tone-accent', 'the subject'],
  ['leader', 'names a place'],
];

export const marks = `<figure class="plate plate-wide" id="fig-marks">
  <p><strong>What a drawing is made of.</strong></p>
  <div class="draw-wrap" role="region" aria-label="The marks a drawing is made of" tabindex="0">
    <svg class="draw" style="--dd-draw-width:768px" viewBox="0 0 768 184" role="img" aria-label="Seven area marks — a thing, a thing with identity, its other state, something left open, a hole, a region and a grouping — and five line marks: directed, not established, apparatus, the subject, and a leader.">
      <text class="draw-cap" x="16" y="16">AREAS</text>
${AREAS.map(([cls, name], i) => `      <rect class="${cls}" x="${COL(i)}" y="28" width="92" height="44" rx="6"/>
      <text class="draw-note" x="${MID(i)}" y="90" text-anchor="middle">${name}</text>`).join('\n')}
      <text class="draw-cap" x="16" y="122">LINES</text>
${LINES.map(([cls, name], i) => `      <path class="${cls}" d="M${COL(i)} 142H${COL(i) + 92}"/>${cls === 'leader' ? `\n      <circle class="leader-foot" cx="${COL(i)}" cy="142"/>` : ''}
      <text class="draw-note" x="${MID(i)}" y="172" text-anchor="middle">${name}</text>`).join('\n')}
    </svg>
  </div>
  <ul class="legend legend-inline">
    <li><svg viewBox="0 0 28 8" aria-hidden="true"><path class="draw-line" d="M1 4H27"/></svg>solid: established</li>
    <li><svg viewBox="0 0 28 8" aria-hidden="true"><path class="draw-line-open" d="M1 4H27"/></svg>dashed: absent or unsettled</li>
    <li><svg viewBox="0 0 28 8" aria-hidden="true"><path class="draw-guide" d="M1 4H27"/></svg>hairline: apparatus</li>
  </ul>
  <figcaption>Geometry is the generator’s; paint is the system’s. Absence is dashed in every mark, and the tone says which kind of absence — so the claim survives a reader who cannot see the hue.
    <span class="plate-source">Specimen. Every mark here is a public class; none of them sets a colour in the markup.</span>
  </figcaption>
</figure>`;

export const marksPreview = `<svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 120" role="img" aria-label="A thing, a thing with identity and something left open, joined by a directed line and a dashed one.">
  <rect class="draw-box" x="8" y="16" width="64" height="36" rx="6"/>
  <rect class="draw-box-toned tone-accent" x="88" y="16" width="64" height="36" rx="6"/>
  <rect class="draw-box-open" x="168" y="16" width="64" height="36" rx="6"/>
  <path class="draw-line draw-arrow" d="M76 34H84"/>
  <path class="draw-line-open draw-arrow" d="M156 34H164"/>
  <text class="draw-note" x="40" y="72" text-anchor="middle">thing</text>
  <text class="draw-note" x="120" y="72" text-anchor="middle">identity</text>
  <text class="draw-note" x="200" y="72" text-anchor="middle">left open</text>
  <path class="draw-guide" d="M8 92H232"/>
  <text class="draw-cap" x="8" y="112">MARKS</text>
</svg>`;
