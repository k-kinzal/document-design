import { html, drawDefs } from './helpers.js';

export default {
  title: "Examples/Run report",
  parameters: {
    docs: {
      description: {
        component:
          "QuuuAI's task report, rebuilt on this stylesheet. Same report, same " +
          "figures and the same five drawings: 68.97 \u2192 96.67, nine empty " +
          "units resolved as seven tied / one tried / one left. What changed is " +
          "the plumbing \u2014 the sheet carries the genre instead of a class on " +
          "<body>, and the drawings read the shared tokens, so a diagram follows " +
          "the theme along with everything around it.",
      },
    },
  },
};

/** The page as the runner writes it. */
export const Report = {
  render: () => html`
${drawDefs}
<article class="sheet" lang="ja">
  <p class="eyebrow">変更意図 · bison-parser 出典カバレッジ</p>
  <h1>挙動がある<br>単位だけ結ぶ</h1>
  <p class="stand">未カバーは実装漏れではなかった。仕様が出典に触れていなかった。導入文は空のまま。</p>

  <div class="hero">
    <div class="was">
      <span class="cap">BEFORE</span>
      <span class="fig">68.97</span>
      <span class="unit">出典 20/29 · ゲート 68</span>
    </div>
    <div class="mid">
      <svg class="draw" style="--dd-draw-width:56px" viewBox="0 0 56 16" aria-hidden="true">
        <path class="draw-line draw-arrow tone-accent" d="M2 8H54"/>
        <path class="draw-line tone-accent" d="M36 2L54 8L36 14"/>
      </svg></div>
    <div class="now">
      <span class="cap">AFTER</span>
      <span class="fig">96.67</span>
      <span class="unit">出典 29/30 · ゲート 96 · 正直な上限</span>
    </div>
  </div>

  <section class="sec">
    <div class="rail">
      <div class="label">01<br>仕様</div>
      <p class="sidenote"><span class="sidenote-label">出典</span>bison 3.8.2 のマニュアル。2026-02-11 に取得したもので、以後の版は見ていない。</p>
    </div>
    <div class="field">
      <p class="lead">9 の穴は、結ぶ・試す・残す。100 にはしない。</p>
      <p class="note">出典 29 単位のうち 9 が空だった。内訳は <a class="ref" href="#fig-holes">図 1</a> のとおりで、7 は既存シナリオに ID を付けるだけで結べる。</p>
    </div>
    <figure class="plate plate-full diagram" id="fig-holes"><div class="compare compare-draw">
        <div class="was"><span class="cap">変更前 · 9 空</span>
          <div class="draw-wrap"><svg class="draw" style="--dd-draw-width:268px" viewBox="0 30 268 270" role="img" aria-hidden="true">
        <rect class="draw-group" x="24" y="40" width="232" height="236" rx="12"/>
        <rect class="draw-box-open tone-neutral" x="48" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="84" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="120" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="156" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="192" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="48" y="100" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="84" y="100" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="120" y="100" width="28" height="28" rx="6"/>
        <rect class="draw-box-open tone-neutral" x="156" y="100" width="28" height="28" rx="6"/>
        <text x="140" y="160" text-anchor="middle" class="draw-note">Symbols 6 · Rules 3</text>
        <text x="140" y="182" text-anchor="middle" class="draw-note">リーダーは読む</text>
        <text x="140" y="204" text-anchor="middle" class="draw-note">仕様が触れていない</text>
        <text x="140" y="248" text-anchor="middle" class="draw-mono draw-note">20 / 29</text>
          </svg></div>
        </div>
        <div class="now"><span class="cap">最終 · 7 結ぶ / 1 試す / 1 残す</span>
          <div class="draw-wrap"><svg class="draw" style="--dd-draw-width:532px" viewBox="268 30 532 270" role="img" aria-hidden="true">
        <rect class="draw-group tone-accent" x="280" y="40" width="516" height="236" rx="12"/>
        <rect class="draw-box-toned tone-accent" x="304" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-toned tone-accent" x="340" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-toned tone-accent" x="376" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-toned tone-accent" x="412" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-toned tone-accent" x="448" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-toned tone-accent" x="484" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-toned tone-accent" x="520" y="64" width="28" height="28" rx="6"/>
        <text x="412" y="114" text-anchor="middle" class="draw-accent">既存シナリオへ</text>
        <text x="412" y="132" text-anchor="middle" class="draw-mono draw-accent">005–008 · RULE-007 · 001</text>
        <rect class="draw-box-toned tone-accent" x="572" y="64" width="28" height="28" rx="6"/>
        <rect class="draw-box-alt tone-accent" x="608" y="56" width="28" height="28" rx="6"/>
        <text x="622" y="74" text-anchor="middle" class="draw-accent">+</text>
        <text x="618" y="114" text-anchor="middle" class="draw-accent">シナリオ新設</text>
        <text x="618" y="132" text-anchor="middle" class="draw-mono draw-accent">SYMBOL-009</text>
        <rect class="draw-box-open" x="692" y="64" width="28" height="28" rx="6"/>
        <text x="748" y="82" class="draw-warn">導入文</text>
        <text x="706" y="114" text-anchor="middle" class="draw-warn">空のまま</text>
        <text x="706" y="132" text-anchor="middle" class="draw-warn">挙動なし</text>
        <path class="draw-guide" d="M304 160H748"/>
        <rect class="draw-box" x="304" y="176" width="200" height="76" rx="8"/>
        <text x="404" y="208" text-anchor="middle">対応 26</text>
        <text x="404" y="230" text-anchor="middle" class="draw-note">理由付き非対応 3</text>
        <rect class="draw-box-open" x="520" y="176" width="112" height="76" rx="8"/>
        <text x="576" y="208" text-anchor="middle" class="draw-warn">未カバー 1</text>
        <text x="576" y="230" text-anchor="middle" class="draw-warn">水増ししない</text>
        <rect class="draw-box-toned tone-accent" x="648" y="176" width="112" height="76" rx="8"/>
        <text x="704" y="208" text-anchor="middle" class="draw-accent">29 / 30</text>
        <text x="704" y="230" text-anchor="middle" class="draw-accent">例 +1 単位</text>
          </svg></div>
        </div>
      </div>
      <figcaption>出典 9 単位の行き先。7 は既存シナリオに結び、1 はシナリオを新設し、導入文の 1 は空のまま残す。<span class="plate-source">bison-parser 3.8.2 · symbols.yaml / rules.yaml 時点</span></figcaption>
    </figure>
    <p class="caveat">終端の3書き方・定義・綴り・非終端、例文2断片、通常アクションは既存 Behat へ。文字集合だけシナリオを足す。導入文「grammatical classifications」は仕様化しない。</p>
  </section>

  <section class="sec">
    <div class="label">02<br>概念</div>
    <div class="field">
      <p class="lead">計上は解釈があること。非対応は生成系だけ。</p>
    </div>
    <figure class="plate plate-full diagram" id="fig-scale"><div class="draw-wrap"><svg class="draw" style="--dd-draw-width:820px" viewBox="0 0 820 220" role="img" aria-label="0から100の尺。68.97が変更前。96.67が正直な上限。100は斜線で封じ、unsupportedへの付け替えをしない。">
        <line class="draw-line" x1="40" y1="88" x2="780" y2="88"/>
        <circle class="plot-point tone-neutral" cx="40" cy="88" r="4"/>
        <circle class="draw-box-alt tone-danger" cx="780" cy="88" r="4"/>
        <path class="draw-line tone-danger" d="M768 76L792 100M792 76L768 100"/>

        <circle class="plot-point tone-neutral" cx="550" cy="88" r="5"/>
        <line class="leader" x1="550" y1="88" x2="550" y2="48"/>
        <text x="550" y="36" text-anchor="middle" class="draw-note">68.97</text>

        <circle class="plot-point tone-accent" cx="756" cy="88" r="6"/>
        <line class="leader tone-accent" x1="756" y1="88" x2="756" y2="48"/>
        <text x="720" y="36" text-anchor="middle" class="draw-accent">96.67</text>

        <text x="40" y="120" class="draw-note">0</text>
        <text x="400" y="120" text-anchor="middle" class="draw-note">カバレッジ %</text>
        <text x="780" y="120" text-anchor="end" class="draw-warn">100</text>
        <text x="780" y="140" text-anchor="end" class="draw-warn">非対応に付け替えない</text>

        <!-- 30 units across the same 40→780 as the scale above, so 29/30 lands
             on 96.67 and the two rows can be read against each other. -->
        <rect class="draw-box-toned tone-accent" x="40" y="160" width="641" height="36" rx="6"/>
        <rect class="draw-box" x="681" y="160" width="74" height="36" rx="6"/>
        <rect class="draw-box-open" x="755" y="160" width="25" height="36" rx="6"/>
        <line class="leader tone-accent" x1="755" y1="96" x2="755" y2="160"/>
        <text x="360" y="184" text-anchor="middle" class="draw-accent">対応 26</text>
        <text x="718" y="184" text-anchor="middle" class="draw-note">非対応 3</text>
        <text x="767" y="212" text-anchor="middle" class="draw-warn">空 1</text>
        <text x="40" y="212" class="draw-note">出典 30 単位</text>
      </svg></div>
      <figcaption>カバレッジの尺。96.67 は正直な上限であり、100 は非対応への付け替えで作らない。<span class="plate-source">ゲート 96 · bison-parser 3.8.2</span></figcaption>
    </figure>
    <div class="figures">
      <figure>
        <svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 96" role="img" aria-label="対応と理由付き非対応を足して計上する。">
          <rect class="draw-box-toned tone-accent" x="6" y="28" width="98" height="40" rx="8"/>
          <rect class="draw-box" x="116" y="28" width="78" height="40" rx="8"/>
          <text x="55" y="54" text-anchor="middle" class="draw-label">対応</text>
          <text x="155" y="54" text-anchor="middle" class="draw-note">非対応</text>
          <path class="draw-line tone-accent" d="M208 42H232M208 54H232"/>
        </svg>
        <h3>計上</h3>
        <p>解釈がある単位。検証済みと、理由付き非対応を足す。</p>
      </figure>
      <figure>
        <svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 96" role="img" aria-label="空の単位は見える。斜線の非対応にはしない。">
          <rect class="draw-box-open" x="6" y="28" width="76" height="40" rx="8"/>
          <text x="44" y="54" text-anchor="middle" class="draw-warn">空</text>
          <path class="draw-line draw-arrow" d="M94 48H136"/>
          <rect class="draw-box-alt tone-danger" x="148" y="28" width="66" height="40" rx="8"/>
          <path class="draw-line tone-danger" d="M158 36L204 60M204 36L158 60"/>
        </svg>
        <h3>未カバーは見える</h3>
        <p>導入文は空。非対応ラベルで消さない。</p>
      </figure>
      <figure>
        <svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 96" role="img" aria-label="非対応3は生成パーサ・スキャナ・文字集合の実行系のまま。">
          <rect class="draw-box" x="4" y="28" width="68" height="40" rx="8"/>
          <rect class="draw-box" x="86" y="28" width="68" height="40" rx="8"/>
          <rect class="draw-box" x="168" y="28" width="68" height="40" rx="8"/>
          <text x="38" y="54" text-anchor="middle" class="draw-mono draw-note">yylex</text>
          <text x="120" y="54" text-anchor="middle" class="draw-mono draw-note">-d</text>
          <text x="202" y="54" text-anchor="middle" class="draw-note">符号</text>
        </svg>
        <h3>非対応は生成系</h3>
        <p><code>BISON-RUNTIME-001–003</code> は据え置き。リーダーの外。</p>
      </figure>
    </div>
  </section>

  <section class="sec">
    <div class="label">03<br>手続き</div>
    <div class="field">
      <p class="lead">出典、仕様、Behat を一本にする。パーサは触らない。</p>
    </div>
    <figure class="plate plate-full diagram" id="fig-chain"><div class="compare compare-draw">
        <div class="was"><span class="cap">変更前</span>
          <div class="draw-wrap"><svg class="draw" style="--dd-draw-width:380px" viewBox="0 30 380 218" role="img" aria-hidden="true">
        <rect class="draw-group" x="24" y="40" width="344" height="188" rx="12"/>
        <rect class="draw-box" x="48" y="64" width="120" height="44" rx="8"/>
        <text x="108" y="92" text-anchor="middle">出典</text>
        <rect class="draw-box" x="224" y="64" width="120" height="44" rx="8"/>
        <text x="284" y="92" text-anchor="middle" class="draw-note">Behat</text>
        <path class="draw-line-open tone-neutral" d="M176 86H216"/>
        <path class="draw-line tone-neutral" d="M168 78L184 94M184 78L168 94"/>
        <rect class="draw-box-open tone-neutral" x="136" y="132" width="120" height="44" rx="8"/>
        <text x="196" y="160" text-anchor="middle" class="draw-note">仕様 欠</text>
        <text x="196" y="204" text-anchor="middle" class="draw-note">本番コードも feature も据え置き</text>
          </svg></div>
        </div>
        <div class="now"><span class="cap">最終</span>
          <div class="draw-wrap"><svg class="draw" style="--dd-draw-width:420px" viewBox="380 30 420 218" role="img" aria-hidden="true">
        <rect class="draw-group tone-accent" x="392" y="40" width="404" height="188" rx="12"/>
        <rect class="draw-box" x="416" y="64" width="88" height="44" rx="8"/>
        <text x="460" y="92" text-anchor="middle">出典</text>
        <path class="draw-line draw-arrow tone-accent" d="M512 86H548"/>
        <rect class="draw-box-toned tone-accent" x="556" y="64" width="88" height="44" rx="8"/>
        <text x="600" y="92" text-anchor="middle">仕様</text>
        <path class="draw-line draw-arrow tone-accent" d="M652 86H688"/>
        <rect class="draw-box-toned tone-accent" x="696" y="64" width="76" height="44" rx="8"/>
        <text x="734" y="92" text-anchor="middle">Behat</text>
        <rect class="draw-box-open" x="416" y="132" width="88" height="44" rx="8"/>
        <text x="460" y="160" text-anchor="middle" class="draw-warn">導入文</text>
        <path class="draw-line-open draw-arrow" d="M512 154H548"/>
        <rect class="draw-box" x="556" y="132" width="216" height="44" rx="8"/>
        <text x="664" y="160" text-anchor="middle" class="draw-note">パーサ src は無変更</text>
        <text x="594" y="204" text-anchor="middle" class="draw-accent">Symbols セレクタに example を足す</text>
          </svg></div>
        </div>
      </div>
      <figcaption>出典から仕様へ、仕様から Behat へ。導入文だけが仕様に入らず、本番パーサは範囲の外に置いたまま。<span class="plate-source">リーダーの外の 3 件は BISON-RUNTIME-001–003</span></figcaption>
    </figure>
    <div class="figures">
      <figure>
        <svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 96" role="img" aria-label="出典の箱から仕様の箱へ実線。">
          <rect class="draw-box" x="6" y="28" width="84" height="40" rx="8"/>
          <rect class="draw-box-toned tone-accent" x="150" y="28" width="84" height="40" rx="8"/>
          <path class="draw-line tone-accent" d="M100 48H138"/>
          <path class="draw-line tone-accent" d="M130 42L138 48L130 54"/>
        </svg>
        <h3>結ぶ</h3>
        <p>既存シナリオに ID を付ける。<code>symbols.yaml</code> / <code>rules.yaml</code>。</p>
      </figure>
      <figure>
        <svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 96" role="img" aria-label="箱を一つ足してから結ぶ。">
          <rect class="draw-box" x="4" y="28" width="64" height="40" rx="8"/>
          <rect class="draw-box-alt tone-accent" x="88" y="20" width="64" height="40" rx="8"/>
          <path class="draw-line tone-accent" d="M110 40H130M120 30V50"/>
          <rect class="draw-box-toned tone-accent" x="172" y="28" width="64" height="40" rx="8"/>
        </svg>
        <h3>試す</h3>
        <p>文字集合だけ <code>symbols.feature</code> にシナリオを足す。</p>
      </figure>
      <figure>
        <svg class="draw" style="--dd-draw-width:240px" viewBox="0 0 240 96" role="img" aria-label="点線の箱が仕様に入らず、非対応の箱は斜線。">
          <rect class="draw-box-open" x="6" y="28" width="94" height="40" rx="8"/>
          <rect class="draw-box-alt tone-danger" x="140" y="28" width="94" height="40" rx="8"/>
          <path class="draw-line tone-danger" d="M150 36L224 60M224 36L150 60"/>
        </svg>
        <h3>残す</h3>
        <p>README に理由を書く。ゲートを 96 に上げ、それ以上は要求しない。</p>
      </figure>
    </div>
  </section>

  <section class="sec">
    <div class="label">04<br>検証</div>
    <div class="field">
      <p class="lead">ローカルは通った。作業ディレクトリは空のまま。</p>
    </div>
    <div class="stats">
      <div class="stat"><b class="stat-fig">16/16</b><span class="stat-label">変更 unit の差分カバレッジ。lint 23 件、Behat 307 がローカルで通過。</span></div>
      <div class="stat"><b class="stat-fig">6</b><span class="stat-label">ファイル。baseline、ゲート、README、定義2、feature 1。パーサ src は無し。</span></div>
      <div class="stat"><b class="stat-fig">393</b><span class="stat-label">PR。fetch が拒否されたため GitHub git data API で main 直上に同じ6ファイルを載せた。</span></div>
      <div class="stat"><b class="stat-fig">0</b><span class="stat-label">作業ディレクトリの差分。開始 tree と終了 tree は同一。変更は worktree と PR 側。</span></div>
    </div>
    <p class="caveat">CI は作成時点で pending。このランでは成功未確認。空 blob アップロードは JSON 本文を付けて再送した。throwaway の autoload パス誤りは成果物ではない。ローカル worktree は PR #380 相当の古い基点のままなので、続けるなら fetch 後にリモートへ合わせる。</p>
  </section>
</article>`,
};
