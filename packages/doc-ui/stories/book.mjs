import { entropy, variance, probabilities, entropyPlot } from './research-paper.mjs';
import { bookGeometry, bookVariables, bookPageCSS } from '../src/book.mjs';

// Vite copies these local assets; the standalone tests embed their bytes.
export const bookImages = {
  color: new URL('./assets/probability-color.png', import.meta.url).href,
  monochrome: new URL('./assets/probability-monochrome.png', import.meta.url).href,
};

const copy = {
  en: {
    title: 'A small book of uncertainty',
    subtitle: 'From a probability to an equation, a curve and an image',
    edition: 'document-design · An illustrated mathematical reader',
    contents: 'Contents',
    chapters: ['Two outcomes, one probability', 'A field of probabilities', 'Reading a curve without colour', 'What a threshold keeps', 'Sources and colophon'],
    preface: 'About this book',
    prefaceText: 'This is an expository typesetting specimen. Its numerical values and raster artwork are calculated from the functions printed here. They are not observations of people, experiments or model performance. The colour plates, grayscale analysis and monochrome appendix offer different views of those same calculations.',
    theory: [
      'Imagine a source that can emit either zero or one. Let p be the probability of one; the probability of zero is then 1 − p. Naming two outcomes tells us what can happen, but not how surprising either outcome will be. A source that almost always emits zero behaves differently from one that chooses its two outcomes with equal probability.',
      'Shannon’s entropy describes a probability distribution by the average information associated with its outcomes. With logarithms to base two, the unit is the bit. For a binary source the definition reduces to two terms, one for each possible outcome.',
      'At either endpoint, one outcome is certain. The convention 0 log₂ 0 = 0 extends the formula continuously and gives H(0) = H(1) = 0. When both outcomes are equally probable, substituting p = 1/2 gives H(1/2) = 1 bit. The label “bit” belongs to the information measure, not to the probability itself.',
      'Swapping the names zero and one changes p to 1 − p. It changes neither the distribution of information nor the entropy. Consequently, the curve is symmetric about p = 1/2. A plot that lacks that symmetry would contradict the formula, even if the axes and typography looked convincing.',
      'Knowing the probability is an assumption of this calculation. If p were estimated from a finite sample, we would also need to discuss that estimate and its uncertainty. The smooth curve here makes no statement about sample size, dependence between symbols or the behaviour of a particular compression program.',
      'The following chapters separate three ways of seeing the same mathematical object. An image gives an overview of many probabilities arranged in space. A curve shows how a measure changes as its input changes. A table preserves selected values at an explicit precision. Each answers a different reading task.',
    ],
    fieldIntro: 'A formula can also provide the pixels of an image. On the unit square, define a probability at every position (x, y) by',
    fieldEnd: 'Sine and cosine each lie between −1 and 1. Their product therefore stays in that interval, and the affine transformation maps it into [0, 1]. This is a constructed probability field, not a photograph or a measurement.',
    fieldCaption: 'The probability field on 0 ≤ x, y ≤ 1. White represents p = 0 and the darkest tone represents p = 1; x increases to the right and y upward.',
    fieldSource: 'Source: equation (2), sampled on a 1152 × 576 grid including its endpoints. RGB is interpolated from (255, 255, 255) to (0, 72, 112).',
    fieldAlt: 'Two repeating lobes across a probability field. Dark values near the upper left repeat at the lower left and invert through the middle horizontal band.',
    grayIntro: 'Colour is only one way to distinguish quantities. In Figure 2, entropy H uses a solid line and filled circles. The comparison V uses a dashed line and hollow squares. The identity survives when both curves are printed with neutral inks.',
    varianceIntro: 'Define a normalized variance for comparison:',
    plotCaption: 'Entropy H in bits and normalized variance V without units. Both reach one at p = 1/2. Lines are evaluated at increments of 0.01; the symbols identify the tabulated probabilities.',
    tableCaption: 'Values calculated from equations (1) and (3), rounded to three decimal places for display.',
    tableHeads: ['Probability p', 'Entropy H [bit]', 'Variance V [1]'],
    grayCaption: 'The same raster as Figure 1, rendered in grayscale. The spatial pattern remains, while the blue hue is removed.',
    grayText: 'At p = 0.1, H is approximately 0.469 bit and V is 0.360. Their endpoints and maxima agree, but their intermediate values do not. A common numerical range does not make two quantities interchangeable. Keep the units next to the values when comparing them.',
    thresholdIntro: 'A two-ink image must discard or encode its intermediate tones. Here the image is recalculated as black wherever p ≥ 1/2 and white elsewhere. The decision boundary remains; the magnitude within each region is lost.',
    thresholdCaption: 'Thresholded probability field. Black means p ≥ 1/2; white means p < 1/2. This local PNG contains only black and white source pixels.',
    thresholdEnd: 'A dark region no longer tells us whether the probability was just above one half or close to one. This loss is part of the representation, so the caption states the threshold. The appendix uses the same distinction in its text, rules and illustration: black ink, white paper, explicit labels.',
    closing: 'A picture does not remove the need for a definition. Equations specify the quantities, captions explain the encoding, and tables preserve values that can be compared without judging a shade or tracing a curve.',
    sourceNote: 'The definition of entropy. The probability field, normalized variance comparison, calculations and illustrations in this book are original expository examples.',
    colophon: 'Typeset with doc-ui. Native MathML, SVG curves and local PNG artwork share the reading layout. Text stays selectable. The HTML can be read and printed without scripts or network access.',
  },
  ja: {
    title: '不確実性を読む小さな本',
    subtitle: '一つの確率から、数式・曲線・画像へ',
    edition: 'document-design · 図解で読む数学',
    contents: '目次',
    chapters: ['二つの結果と一つの確率', '確率を画像にする', '色に頼らず曲線を読む', 'しきい値が残すもの', '参考文献・奥付'],
    preface: '本書について',
    prefaceText: '本書は解説形式の組版サンプルである。数値と画像は、本文に示した関数から計算した。人物や実験、モデル性能の観測結果ではない。カラー図版、グレースケールの分析、白黒の付録を通して、同じ計算を異なる表現で読む。',
    theory: [
      'ゼロか一を出力する情報源を考える。一が出る確率をpとすると、ゼロが出る確率は1 − pとなる。結果を二つ挙げれば何が起こりうるかは分かるが、それぞれの結果がどれだけ意外かは分からない。ほとんど常にゼロを出す情報源と、二つの結果を等確率で選ぶ情報源は異なる。',
      'Shannonのエントロピーは、各結果に対応する情報量の平均によって確率分布を記述する。底を二とする対数を用いると、単位はビットとなる。二値情報源では、定義はそれぞれの結果に対応する二つの項にまとめられる。',
      'どちらの端点でも、一方の結果が確定している。0 log₂ 0 = 0という規約で式を連続的に拡張すると、H(0) = H(1) = 0となる。二つの結果が等確率のとき、p = 1/2を代入すればH(1/2) = 1ビットを得る。「ビット」という単位は情報量に属し、確率そのものに付くわけではない。',
      'ゼロと一の名前を入れ替えると、pは1 − pに変わる。情報量の分布もエントロピーも変わらない。そのため曲線はp = 1/2について対称となる。この対称性がないグラフは、軸や文字が整っていても、定義式と矛盾している。',
      'この計算では、確率が既知であると仮定している。有限の標本からpを推定するなら、推定方法とその不確実性も論じる必要がある。ここに示した滑らかな曲線から、標本数や記号間の依存関係、特定の圧縮プログラムの動作を判断することはできない。',
      '続く章では、同じ数学的対象を三つの読み方に分ける。画像は空間に並ぶ多くの確率を概観させる。曲線は入力の変化に対して指標がどう変わるかを示す。表は、選んだ値を明示した精度で残す。それぞれが異なる読み方に答える。',
    ],
    fieldIntro: '数式から画像の画素を作ることもできる。単位正方形の位置(x, y)ごとに、確率を次のように定義する。',
    fieldEnd: '正弦と余弦は、それぞれ−1から1の間の値を取る。その積も同じ区間に収まり、最後の変換で[0, 1]に写される。これは構成した確率場であり、写真でも測定値でもない。',
    fieldCaption: '0 ≤ x, y ≤ 1における確率場。白はp = 0、最も濃い色はp = 1を表す。xは右へ、yは上へ増加する。',
    fieldSource: '出典：式(2)を両端を含む1152 × 576格子で計算。RGBを(255, 255, 255)から(0, 72, 112)へ補間した。',
    fieldAlt: '横方向に二周期を持つ確率場。左上の濃い領域は左下にも現れ、中央の帯では濃淡が反転する。',
    grayIntro: '量を見分ける方法は色だけではない。図2では、エントロピーHを実線と黒丸で、比較するVを破線と白抜き四角で示す。どちらも無彩色のインクで印刷しても、系列の区別が残る。',
    varianceIntro: '比較のため、正規化した分散を定義する。',
    plotCaption: 'ビット単位のエントロピーHと、無次元の正規化分散V。どちらもp = 1/2で一となる。曲線の刻み幅は0.01、記号は表の確率に対応する。',
    tableCaption: '式(1)と式(3)から計算した値。表示時に小数第三位へ丸めた。',
    tableHeads: ['確率 p', 'エントロピー H [bit]', '分散 V [1]'],
    grayCaption: '図1と同じ画像をグレースケールで表示したもの。青の色相は失われるが、空間的な濃淡のパターンは残る。',
    grayText: 'p = 0.1では、Hは約0.469ビット、Vは0.360となる。両端と最大値は一致しても、中間の値は一致しない。数値の範囲が共通でも、二つの量を置き換えることはできない。比較するときは、値のそばに単位を残す必要がある。',
    thresholdIntro: '二色だけの画像では、中間の階調を捨てるか、別の形に符号化する必要がある。ここではp ≥ 1/2の画素を黒、それ以外を白として再計算した。判定の境界は残るが、領域内の大きさの違いは失われる。',
    thresholdCaption: '確率場を二値化した画像。黒はp ≥ 1/2、白はp < 1/2を表す。同梱したPNGの元の画素は黒と白だけである。',
    thresholdEnd: '黒い領域を見ても、確率が二分の一を少し超えたのか、一に近かったのかは分からない。この情報の欠落は表現の一部なので、キャプションにしきい値を示す。付録の文字・罫線・図版も、黒いインクと白い紙、明示したラベルで同じ区別を保つ。',
    closing: '画像を使っても定義は必要である。数式が量を定め、キャプションが符号化を説明し、表が濃淡や曲線の読み取りに頼らず比較できる値を残す。',
    sourceNote: 'エントロピーの定義を参照。本書の確率場、正規化分散との比較、計算、図版は、解説のために独自に構成した。',
    colophon: 'doc-uiによる組版。MathMLの数式、SVGの曲線、同梱したPNG画像を同じ読むためのレイアウトに配置した。文字は選択でき、HTMLの閲覧と印刷にスクリプトや外部通信は必要ない。',
  },
};

export function bookSettings({ lang = 'en', mode = 'mixed', format = 'a5', geometry = {} } = {}) {
  const t = copy[lang], id = `book-${lang}-${mode}`;
  const g = bookGeometry(format, geometry);
  const pages = ['title', 'contents', ...t.chapters.map((_, i) => `chapter-${i + 1}`), 'blank'];
  const css = pages.map((name, i) => bookPageCSS(`${id}-${name}`, {
    geometry: g, title: t.title,
    chapter: name === 'contents' ? t.contents : t.chapters[i - 2] ?? '',
    furniture: name !== 'title' && name !== 'blank',
  })).join('\n');
  return { id, geometry: g, css, title: t.title, contents: t.contents, chapters: t.chapters };
}

export function book({ lang = 'en', mode = 'mixed', images = bookImages, format = 'a5', geometry = {}, blankBefore = [], folios = {} } = {}) {
  const t = copy[lang], id = `book-${lang}-${mode}`;
  const { geometry: g } = bookSettings({ lang, mode, format, geometry });
  const color = preferred => mode === 'mixed' ? preferred : mode;
  const label = n => lang === 'ja' ? `第${n}章` : `Chapter ${n}`;
  const equation = (n, formula) => `<div class="equation" id="${id}-eq-${n}"><div class="eq-body" tabindex="0" role="region" aria-label="${lang === 'ja' ? '式' : 'Equation'} ${n}"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML">${formula}</math></div><a class="eq-number" href="#${id}-eq-${n}">(${n})</a></div>`;
  const image = (preferred, caption, number) => `<figure class="plate${number ? '' : ' plate-unnumbered'}"${number ? ` id="${id}-fig-${number}"` : ''}><img src="${images[preferred === 'monochrome' || color(preferred) === 'monochrome' ? 'monochrome' : 'color']}" width="1152" height="576" alt="${t.fieldAlt}"><figcaption>${caption}</figcaption></figure>`;
  const blank = n => blankBefore.includes(n) ? `<section class="book-page book-blank" aria-hidden="true" style="--dd-book-page: ${id}-blank">&#160;</section>` : '';
  const start = (n, preferred) => `${blank(n)}<section class="book-page" data-dd-chapter="${n}" style="--dd-book-page: ${id}-chapter-${n}" data-dd-color="${color(preferred)}" aria-labelledby="${id}-chapter-${n}"><header class="paper-head"><p class="eyebrow">${label(n)}</p><h2 id="${id}-chapter-${n}">${t.chapters[n - 1]}</h2></header>`;
  return `<article class="sheet sheet-paper sheet-book" lang="${lang}" data-dd-book="${format}" style="${bookVariables(g)}" data-dd-color="${mode === 'mixed' ? 'monochrome' : mode}" data-dd-print-urls="sources">
    <section class="book-page book-cover" data-dd-color="${color('color')}" style="--dd-book-page: ${id}-title">
      <header class="paper-head"><p class="eyebrow" lang="en">MATHEMATICAL READER / 01</p><h1>${t.title}</h1><p class="stand">${t.subtitle}</p></header>
      ${image('color', t.edition, false)}
    </section>
    <section class="book-page" data-dd-color="${color('monochrome')}" style="--dd-book-page: ${id}-contents" aria-labelledby="${id}-contents">
      <header class="paper-head"><p class="eyebrow" lang="en">CONTENTS</p><h2 id="${id}-contents">${t.contents}</h2></header>
      <nav aria-label="${t.contents}"><ol class="book-toc">${t.chapters.map((title, i) => `<li><a href="#${id}-chapter-${i + 1}">${title}<span>${folios[i + 1] ?? label(i + 1)}</span></a></li>`).join('')}</ol></nav>
      <div class="prose"><h3>${t.preface}</h3><p>${t.prefaceText}</p></div>
    </section>
    ${start(1, 'monochrome')}<div class="prose">
      <p>${t.theory[0]}</p><p>${t.theory[1]}<a class="cite" href="#${id}-source">1</a></p>
      ${equation(1, '<mi>H</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo><mo>−</mo><mi>p</mi><msub><mi>log</mi><mn>2</mn></msub><mi>p</mi><mo>−</mo><mo>(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo>)</mo><msub><mi>log</mi><mn>2</mn></msub><mo>(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo>)</mo>')}
      ${t.theory.slice(2).map(p => `<p>${p}</p>`).join('')}
    </div></section>
    ${start(2, 'color')}<div class="prose"><p>${t.fieldIntro}</p>
      ${equation(2, '<mi>p</mi><mo>(</mo><mi>x</mi><mo>,</mo><mi>y</mi><mo>)</mo><mo>=</mo><mfrac><mrow><mn>1</mn><mo>+</mo><mi>sin</mi><mo>(</mo><mn>4</mn><mi>π</mi><mi>x</mi><mo>)</mo><mi>cos</mi><mo>(</mo><mn>2</mn><mi>π</mi><mi>y</mi><mo>)</mo></mrow><mn>2</mn></mfrac>')}
      <p>${t.fieldEnd}</p>${image('color', mode === 'monochrome' ? t.thresholdCaption : `${t.fieldCaption}<span class="plate-source">${t.fieldSource}</span>`, 1)}
    </div></section>
    ${start(3, 'grayscale')}<div class="prose"><p>${t.grayIntro}</p><p>${t.varianceIntro}</p>
      ${equation(3, '<mi>V</mi><mo>(</mo><mi>p</mi><mo>)</mo><mo>=</mo><mn>4</mn><mi>p</mi><mo>(</mo><mn>1</mn><mo>−</mo><mi>p</mi><mo>)</mo>')}
      <figure class="plate" id="${id}-fig-2">${entropyPlot(lang, id, Math.floor(g.measure * 96 / 25.4))}<figcaption>${t.plotCaption}</figcaption></figure>
      <figure class="plate plate-table"><figcaption id="${id}-table-caption">${t.tableCaption}</figcaption><div class="table-wrap"><table aria-labelledby="${id}-table-caption"><thead><tr>${t.tableHeads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${probabilities.map(p => `<tr><th scope="row" class="num">${p.toFixed(2)}</th><td class="num">${entropy(p).toFixed(3)}</td><td class="num">${variance(p).toFixed(3)}</td></tr>`).join('')}</tbody></table></div></figure>
      <p>${t.grayText}</p>${image('grayscale', mode === 'monochrome' ? t.thresholdCaption : t.grayCaption, 3)}
    </div></section>
    ${start(4, 'monochrome')}<div class="prose"><p>${t.thresholdIntro}</p>${image('monochrome', t.thresholdCaption, 4)}<p>${t.thresholdEnd}</p><p>${t.closing}</p></div></section>
    ${start(5, 'monochrome')}<div class="prose"><ol class="sources"><li id="${id}-source"><a lang="en" href="https://web.mit.edu/6.976/www/handout/shannon.pdf">C. E. Shannon. A Mathematical Theory of Communication.</a><span class="source-meta" lang="en">The Bell System Technical Journal, 27, 379–423, 623–656 (1948).</span><p>${t.sourceNote}</p></li></ol><p>${t.colophon}</p></div>
    </section>
  </article>`;
}
