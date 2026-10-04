/* Analytical values, not observations. The generator emits static HTML/SVG;
   the resulting paper needs neither JavaScript nor a network connection. */
export const entropy = p => p === 0 || p === 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
export const variance = p => 4 * p * (1 - p);
export const probabilities = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];

const copy = {
  en: {
    title: 'Uncertainty in a binary source',
    subtitle: 'An expository note on entropy and normalized variance',
    byline: 'document-design · Research paper specimen · 4 October 2026',
    abstract: 'Abstract',
    summary: 'A binary source can be described by the probability of either of its two outcomes. This note compares entropy with a normalized variance on that common probability axis. Both vanish at deterministic endpoints and reach one at equal probabilities, but they assign different values between those points. We derive the binary entropy, locate its maximum, and calculate selected values directly. The comparison separates a shared visual shape from a shared mathematical meaning.',
    keywords: 'Keywords: information theory; binary entropy; probability; analytical comparison',
    headings: ['1. Introduction', '2. Definition and stationary point', '3. Analytical comparison', '4. Interpretation and limitations', '5. Conclusion', 'References'],
    intro: 'How much uncertainty remains when a source can emit only zero or one? A count of possible outcomes cannot distinguish a nearly deterministic source from a balanced one. Probabilities provide that distinction. Shannon’s entropy assigns a value to a probability distribution; with base-two logarithms, its unit is the bit.',
    purpose: 'This is an expository typesetting specimen, not a report of a new experiment. Every plotted point and table entry is calculated from the displayed functions. No participants, measurements, fitted parameters or estimated confidence intervals are involved. The derivation below provides the complete basis for reproducing the figure.',
    definition: 'For a finite source with outcome probabilities pᵢ, entropy is the probability-weighted sum of the information associated with each outcome. Terms with zero probability are defined by continuity. The general form is',
    binary: 'Let <math><mi>X</mi></math> take the value one with probability <math><mi>p</mi></math> and zero with probability <math><mn>1</mn><mo>−</mo><mi>p</mi></math>. Substituting these two probabilities gives the binary entropy',
    endpoints: 'The convention 0 log₂ 0 = 0 gives H(0) = H(1) = 0. Exchanging the names of the two outcomes replaces p by 1 − p and leaves the entropy unchanged. This symmetry will also appear in the figure and table.',
    derivative: 'Inside the open interval 0 < p < 1, differentiation yields',
    maximum: 'The first derivative vanishes at p = 1/2. The second derivative is negative throughout the open interval, so this stationary point is the unique maximum. Substitution into the definition gives H(1/2) = 1 bit. At either endpoint the outcome is certain, and the entropy is zero.',
    comparison: 'For comparison, define V(p) = 4p(1 − p), four times the variance of a Bernoulli variable. The factor four sets its maximum to one. This normalization makes the endpoints and peak coincide with those of H, but it does not give V the unit “bit”. The shared vertical range is a device for comparing shapes.',
    figureIntro: 'The curves in',
    figureEnd: 'are evaluated at 101 evenly spaced probabilities, including both endpoints. Straight segments join adjacent calculated values. Solid circles and hollow squares identify selected values; the dashed line remains distinguishable when colour is unavailable.',
    figureLabel: 'Figure 1', tableLabel: 'Table 1',
    caption: 'Binary entropy H (solid line, filled circles) and normalized variance V (dashed line, hollow squares). The horizontal axis is probability p; the vertical axis shows H in bits and dimensionless V on the same numerical scale.',
    source: 'Source: direct evaluation of equations (2) and (4). Lines sampled at Δp = 0.01; symbols match Table 1.',
    graphTitle: 'Binary entropy and normalized variance',
    graphDesc: 'Both curves are symmetric about p = 0.5, start and end at zero, and reach one at the centre. At p = 0.1, H is approximately 0.469 and V is 0.360. Exact selected values follow in the table.',
    axis: 'Value: H [bit], V [1]', xaxis: 'Probability p',
    tableCaption: 'Selected probabilities and calculated values. H is rounded to three decimal places; V is shown at the same precision. Rounding is applied only for display.',
    probability: 'Probability p', entropy: 'Entropy H [bit]', variance: 'Variance V [1]',
    tableIntro: 'The values in',
    tableEnd: 'make the difference visible without estimating coordinates from the drawing. At p = 0.1, the displayed values are 0.469 and 0.360. The value at p = 0.9 repeats the same pair, as symmetry requires. Equality at the endpoints and the centre does not make the functions interchangeable.',
    interpretation: 'A normalized chart can make different quantities appear similar. The axis must therefore preserve the units of each series, and the caption must explain the normalization. Here one curve is an information measure in bits; the other is a scaled variance. Their common maximum is a choice of scale, not evidence that they answer the same question.',
    limitations: 'These are theoretical functions of a known probability. They do not estimate the entropy of a finite sample, model dependence between successive symbols, or quantify uncertainty about p. In particular, the figure gives no evidence about compression performance on a measured dataset.',
    accessibility: 'The table is part of the argument, not a second set of observations. It exposes selected coordinates as text, permits comparison at the stated precision, and provides a reading path independent of the drawn curves. Equations, figure and table each have a number so the prose can identify exactly what supports a statement.',
    conclusion: 'A binary source is most uncertain when its two outcomes are equally probable. Entropy expresses that uncertainty in bits. A second symmetric function can share its endpoints and maximum while assigning different intermediate values. Keeping the definition, units and calculated values together makes that distinction inspectable.',
    referenceNote: 'Definition of entropy and the binary-source example. The derivation, comparison and calculations in this specimen are presented above.',
  },
  ja: {
    title: '二値情報源における不確実性',
    subtitle: 'エントロピーと正規化分散の比較による解説',
    byline: 'document-design · 論文組版サンプル · 2026年10月4日',
    abstract: '要旨',
    summary: '二値情報源は、二つの結果の一方が生じる確率によって表せる。本稿では、同じ確率軸上でエントロピーと正規化した分散を比較する。どちらも確定的な端点でゼロとなり、等確率のときに一となるが、中間の確率には異なる値を与える。二値エントロピーの定義から最大値を導き、代表的な確率における値を直接計算する。形が似ていることと、数学的な意味が同じであることを区別する。',
    keywords: 'キーワード：情報理論、二値エントロピー、確率、解析的比較',
    headings: ['1. はじめに', '2. 定義と停留点', '3. 解析的な比較', '4. 解釈と限界', '5. 結論', '参考文献'],
    intro: 'ゼロか一だけを出力する情報源には、どれだけの不確実性があるだろうか。結果の種類を数えるだけでは、ほぼ確定的な情報源と、二つの結果が等確率で生じる情報源を区別できない。その違いを表すのが確率である。Shannonのエントロピーは確率分布に値を与え、底を二とする対数を用いたときの単位はビットとなる。',
    purpose: '本稿は解説形式の組版サンプルであり、新たな実験を報告するものではない。グラフの各点と表の各値は、明示した関数から計算している。被験者、測定、推定パラメータ、信頼区間は用いない。以下の導出だけで図の計算を再現できる。',
    definition: '各結果の確率をpᵢとする有限の情報源では、各結果の情報量をその確率で重み付けした和がエントロピーとなる。確率がゼロの項は連続性によって定義する。一般形は次式で与えられる。',
    binary: '確率変数<math><mi>X</mi></math>が確率<math><mi>p</mi></math>で一、確率<math><mn>1</mn><mo>−</mo><mi>p</mi></math>でゼロを取るとする。この二つの確率を代入すると、二値エントロピーが得られる。',
    endpoints: '0 log₂ 0 = 0とする規約により、H(0) = H(1) = 0となる。二つの結果の名前を交換するとpは1 − pに置き換わるが、エントロピーは変わらない。この対称性は、後の図と表にも現れる。',
    derivative: '開区間0 < p < 1で微分すると、次の関係が得られる。',
    maximum: '一階微分はp = 1/2でゼロとなる。二階微分は開区間全体で負となるため、この停留点が唯一の最大点である。定義に代入すればH(1/2) = 1ビットとなる。どちらの端点でも結果は確定しており、エントロピーはゼロである。',
    comparison: '比較のため、Bernoulli変数の分散を四倍したV(p) = 4p(1 − p)を定義する。係数四により最大値は一となる。この正規化で端点と最大点の値はHと一致するが、Vに「ビット」という単位が付くわけではない。縦軸の共通範囲は形を比較するための設定である。',
    figureIntro: '次の',
    figureEnd: 'では、両端を含む等間隔の101個の確率で関数を評価し、隣り合う計算値を線分で結んだ。代表値は黒丸と白抜き四角でも示す。色が使えない場合も、実線と破線で系列を見分けられる。',
    figureLabel: '図1', tableLabel: '表1',
    caption: '二値エントロピーH（実線・黒丸）と正規化分散V（破線・白抜き四角）。横軸は確率p。縦軸はビット単位のHと無次元のVを共通の数値範囲で示す。',
    source: '出典：式(2)と式(4)を直接計算。曲線の刻み幅はΔp = 0.01、記号は表1に対応する。',
    graphTitle: '二値エントロピーと正規化分散',
    graphDesc: '両曲線はp = 0.5について対称で、両端ではゼロ、中央では一となる。p = 0.1ではHが約0.469、Vが0.360となる。代表値は続く表に記す。',
    axis: '値：H [bit], V [1]', xaxis: '確率 p',
    tableCaption: '代表的な確率と計算値。Hは小数第三位に丸め、Vも同じ桁数で示す。丸めは表示時にのみ行う。',
    probability: '確率 p', entropy: 'エントロピー H [bit]', variance: '正規化分散 V [1]',
    tableIntro: '次の',
    tableEnd: 'を使えば、図から座標を読み取らずに差を比較できる。p = 0.1での表示値は0.469と0.360である。対称性からp = 0.9でも同じ値の組となる。端点と中央で一致しても、二つの関数を同じものとして扱うことはできない。',
    interpretation: '正規化した図では、異なる量が似て見えることがある。そのため軸には各系列の単位を残し、キャプションで正規化の内容を説明する必要がある。一方はビット単位の情報量、もう一方は尺度を変えた分散である。最大値が共通なのは尺度の選択によるものであり、同じ問いに答える証拠ではない。',
    limitations: '扱っているのは既知の確率に対する理論関数である。有限標本からのエントロピー推定、連続する記号の依存関係、確率p自体の不確実性は扱わない。特に、この図は実測データの圧縮性能についての根拠を与えない。',
    accessibility: '表は議論の一部であり、別の観測結果ではない。選んだ座標を文字として読み、示された精度で比較でき、曲線を見ること以外の読み方も提供する。数式、図、表にはそれぞれ番号を付け、どの内容が本文の主張を支えるかを特定できるようにする。',
    conclusion: '二値情報源は、二つの結果が等確率のときに最も不確実となる。エントロピーはその不確実性をビットで表す。別の対称な関数でも端点と最大値を共有できるが、中間の値は異なる。定義、単位、計算値を一緒に示すことで、この違いを確認できる。',
    referenceNote: 'エントロピーの定義と二値情報源の例。本サンプルの導出、比較、計算は本文に示した。',
  },
};

const formulas = [
  `<mi>H</mi><mo stretchy="false">(</mo><mi>X</mi><mo stretchy="false">)</mo><mo>=</mo><mo>−</mo><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>p</mi><mi>i</mi></msub><msub><mi>log</mi><mn>2</mn></msub><msub><mi>p</mi><mi>i</mi></msub>`,
  `<mi>H</mi><mo stretchy="false">(</mo><mi>p</mi><mo stretchy="false">)</mo><mo>=</mo><mo>−</mo><mi>p</mi><msub><mi>log</mi><mn>2</mn></msub><mi>p</mi><mo>−</mo><mo stretchy="false">(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo stretchy="false">)</mo><msub><mi>log</mi><mn>2</mn></msub><mo stretchy="false">(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo stretchy="false">)</mo>`,
  `<mtable displaystyle="true"><mtr><mtd><msup><mi>H</mi><mo>′</mo></msup><mo stretchy="false">(</mo><mi>p</mi><mo stretchy="false">)</mo></mtd><mtd><mo>=</mo></mtd><mtd><msub><mi>log</mi><mn>2</mn></msub><mfrac><mrow><mn>1</mn><mo>−</mo><mi>p</mi></mrow><mi>p</mi></mfrac></mtd></mtr><mtr><mtd><msup><mi>H</mi><mo>″</mo></msup><mo stretchy="false">(</mo><mi>p</mi><mo stretchy="false">)</mo></mtd><mtd><mo>=</mo></mtd><mtd><mo>−</mo><mfrac><mn>1</mn><mrow><mi>p</mi><mo stretchy="false">(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo stretchy="false">)</mo><mi>ln</mi><mn>2</mn></mrow></mfrac></mtd></mtr></mtable>`,
  `<mi>V</mi><mo stretchy="false">(</mo><mi>p</mi><mo stretchy="false">)</mo><mo>=</mo><mn>4</mn><mi>p</mi><mo stretchy="false">(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo stretchy="false">)</mo>`,
];

function plot(t, id, width = 576) {
  // A prose-width drawing stays at 1:1 even on an A4 sheet with margins.
  const x = p => 56 + (width - 112) * p;
  const y = value => 282 - 220 * value;
  const path = fn => Array.from({ length: 101 }, (_, i) => `${i ? 'L' : 'M'}${x(i / 100).toFixed(2)} ${y(fn(i / 100)).toFixed(2)}`).join(' ');
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return `<div class="draw-wrap" tabindex="0" role="region" aria-label="${t.graphTitle}">
    <svg class="draw" style="--dd-draw-width: ${width}px" viewBox="0 0 ${width} 356" role="img" aria-labelledby="${id}-plot-title ${id}-plot-desc">
      <title id="${id}-plot-title">${t.graphTitle}</title><desc id="${id}-plot-desc">${t.graphDesc}</desc>
      <text class="draw-label" x="56" y="24">${t.axis}</text>
      ${ticks.map(v => `<path class="plot-grid" d="M56 ${y(v)}H${width - 56}"/><text class="draw-note" x="44" y="${y(v) + 5}" text-anchor="end">${v}</text><text class="draw-note" x="${x(v)}" y="307" text-anchor="middle">${v}</text>`).join('')}
      <path class="plot-axis" d="M56 62V282H${width - 56}"/>
      <path class="plot-line tone-blue" d="${path(entropy)}"/>
      <path class="plot-line plot-line-alt tone-violet" d="${path(variance)}"/>
      ${probabilities.map(p => `<circle class="plot-point tone-blue" cx="${x(p)}" cy="${y(entropy(p))}" r="3.5"/><rect class="plot-point plot-point-alt tone-violet" x="${x(p) - 3.5}" y="${y(variance(p)) - 3.5}" width="7" height="7"/>`).join('')}
      <text class="draw-label" x="${width / 2}" y="343" text-anchor="middle">${t.xaxis}</text>
      <text class="draw-strong tone-blue draw-toned" x="${x(0.8276)}" y="99">H</text>
      <text class="draw-strong tone-violet draw-toned" x="${x(0.8384)}" y="180">V</text>
    </svg>
  </div>`;
}

export const entropyPlot = (lang, id, width) => plot(copy[lang], id, width);

export function researchPaper({ lang = 'en', color = 'grayscale' } = {}) {
  const t = copy[lang];
  const id = `research-${lang}-${color}`;
  const equation = n => `<div class="equation" id="${id}-eq-${n}"><div class="eq-body" tabindex="0" role="region" aria-label="${lang === 'ja' ? '式' : 'Equation'} ${n}"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML">${formulas[n - 1]}</math></div><a class="eq-number" href="#${id}-eq-${n}" aria-label="${lang === 'ja' ? '式' : 'Equation'} ${n}">(${n})</a></div>`;
  return `<article class="sheet sheet-paper" lang="${lang}"${color === 'color' ? '' : ` data-dd-color="${color}"`} data-dd-paper="a4" data-dd-print-urls="sources">
    <header class="paper-head">
      <p class="eyebrow">INFORMATION THEORY / EXPOSITORY NOTE</p>
      <h1>${t.title}</h1><p>${t.subtitle}</p><p class="paper-byline">${t.byline}</p>
    </header>
    <section class="abstract prose" aria-labelledby="${id}-abstract"><h2 id="${id}-abstract">${t.abstract}</h2><p>${t.summary}</p><p class="muted">${t.keywords}</p></section>
    <section class="prose"><h2>${t.headings[0]}</h2><p>${t.intro}<a class="cite" href="#${id}-src-1">1</a></p><p>${t.purpose}</p></section>
    <section class="prose"><h2>${t.headings[1]}</h2><p>${t.definition}</p>${equation(1)}<p>${t.binary}</p>${equation(2)}<p>${t.endpoints}</p><p>${t.derivative}</p>${equation(3)}<p>${t.maximum}</p></section>
    <section class="prose"><h2>${t.headings[2]}</h2><p>${t.comparison}</p>${equation(4)}
      <p>${t.figureIntro} <a class="ref" href="#${id}-fig-1">${t.figureLabel}</a> ${t.figureEnd}</p>
      <figure class="plate" id="${id}-fig-1">${plot(t, id)}<figcaption>${t.caption}<span class="plate-source">${t.source}</span></figcaption></figure>
      <p>${t.tableIntro} <a class="ref" href="#${id}-table-1">${t.tableLabel}</a> ${t.tableEnd}</p>
      <figure class="plate plate-table plate-wide" id="${id}-table-1"><figcaption id="${id}-table-caption">${t.tableCaption}</figcaption>
        <div class="table-wrap"><table aria-labelledby="${id}-table-caption"><thead><tr><th scope="col">${t.probability}</th><th scope="col">${t.entropy}</th><th scope="col">${t.variance}</th></tr></thead>
          <tbody>${probabilities.map(p => `<tr><th scope="row" class="num">${p.toFixed(2)}</th><td class="num">${entropy(p).toFixed(3)}</td><td class="num">${variance(p).toFixed(3)}</td></tr>`).join('')}</tbody></table></div>
      </figure>
    </section>
    <section class="prose"><h2>${t.headings[3]}</h2><p>${t.interpretation}</p><p>${t.limitations}</p><p>${t.accessibility}</p></section>
    <section class="prose"><h2>${t.headings[4]}</h2><p>${t.conclusion}</p></section>
    <section class="prose"><h2>${t.headings[5]}</h2><ol class="sources"><li id="${id}-src-1"><a lang="en" href="https://web.mit.edu/6.976/www/handout/shannon.pdf">C. E. Shannon. A Mathematical Theory of Communication.</a><span class="source-meta" lang="en">The Bell System Technical Journal, 27, 379–423, 623–656 (1948).</span><p>${t.referenceNote}</p></li></ol></section>
  </article>`;
}
