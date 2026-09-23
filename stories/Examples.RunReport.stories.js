import { html } from "./helpers.js";

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
<article class="sheet">
  <p class="eyebrow">変更意図 · bison-parser 出典カバレッジ</p>
  <h1>挙動がある<br>単位だけ結ぶ</h1>
  <p class="stand">未カバーは実装漏れではなかった。仕様が出典に触れていなかった。導入文は空のまま。</p>

  <div class="hero">
    <div class="was">
      <span class="cap">BEFORE</span>
      <span class="fig">68.97</span>
      <span class="unit">出典 20/29 · ゲート 68 / 57 / 80</span>
    </div>
    <div class="mid">
      <svg viewBox="0 0 56 16" aria-hidden="true">
        <path d="M2 8H42" fill="none" stroke="var(--dd-rule)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M36 2L54 8L36 14" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="now">
      <span class="cap">AFTER</span>
      <span class="fig">96.67</span>
      <span class="unit">出典 29/30 · ゲート 96 / 93 / 100 · 正直な上限</span>
    </div>
  </div>

  <section class="sec">
    <div class="label">01<br>仕様</div>
    <div class="field">
      <p class="lead">9 の穴は、結ぶ・試す・残す。100 にはしない。</p>
      <svg viewBox="0 0 820 300" role="img" aria-label="変更前は出典9単位がすべて空。最終は7を既存テストへ結び、1にシナリオを足し、導入文1を空のまま残す。セレクタ拡張で例が1単位増える。">
        <text x="140" y="22" text-anchor="middle" font-size="12" font-weight="600" letter-spacing="1.6" fill="var(--dd-fg-subtle)">変更前 · 9 空</text>
        <text x="500" y="22" text-anchor="middle" font-size="12" font-weight="600" letter-spacing="1.6" fill="var(--dd-accent)">最終 · 7 結ぶ / 1 試す / 1 残す</text>

        <rect x="24" y="40" width="232" height="236" rx="12" fill="none" stroke="var(--dd-border)" stroke-width="1.5"/>
        <rect x="280" y="40" width="516" height="236" rx="12" fill="none" stroke="var(--dd-accent)" stroke-width="1.5"/>

        <rect x="48" y="64" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="84" y="64" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="120" y="64" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="156" y="64" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="192" y="64" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="48" y="100" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="84" y="100" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="120" y="100" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="156" y="100" width="28" height="28" rx="6" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <text x="140" y="160" text-anchor="middle" font-size="13" fill="var(--dd-fg-subtle)">Symbols 6 · Rules 3</text>
        <text x="140" y="182" text-anchor="middle" font-size="12" fill="var(--dd-fg-subtle)">リーダーは読む</text>
        <text x="140" y="204" text-anchor="middle" font-size="12" fill="var(--dd-fg-subtle)">仕様が触れていない</text>
        <text x="140" y="248" text-anchor="middle" font-size="12" class="svg-mono" fill="var(--dd-fg-subtle)">20 / 29</text>

        <rect x="304" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="340" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="376" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="412" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="448" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="484" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="520" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <text x="412" y="114" text-anchor="middle" font-size="12" fill="var(--dd-accent)">既存シナリオへ</text>
        <text x="412" y="132" text-anchor="middle" font-size="11" class="svg-mono" fill="var(--dd-accent)">005–008 · RULE-007 · 001</text>

        <rect x="572" y="64" width="28" height="28" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="608" y="56" width="28" height="28" rx="6" fill="none" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <text x="622" y="74" text-anchor="middle" font-size="13" fill="var(--dd-accent)">+</text>
        <text x="618" y="114" text-anchor="middle" font-size="12" fill="var(--dd-accent)">シナリオ新設</text>
        <text x="618" y="132" text-anchor="middle" font-size="11" class="svg-mono" fill="var(--dd-accent)">SYMBOL-009</text>

        <rect x="692" y="64" width="28" height="28" rx="6" fill="none" stroke="var(--dd-warn)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <text x="748" y="82" font-size="12" fill="var(--dd-warn)">導入文</text>
        <text x="706" y="114" text-anchor="middle" font-size="12" fill="var(--dd-warn)">空のまま</text>
        <text x="706" y="132" text-anchor="middle" font-size="11" fill="var(--dd-warn)">挙動なし</text>

        <path d="M304 160H748" fill="none" stroke="var(--dd-border)" stroke-width="1.5"/>
        <rect x="304" y="176" width="200" height="76" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
        <text x="404" y="208" text-anchor="middle" font-size="13">対応 26</text>
        <text x="404" y="230" text-anchor="middle" font-size="12" fill="var(--dd-fg-subtle)">理由付き非対応 3</text>
        <rect x="520" y="176" width="112" height="76" rx="8" fill="none" stroke="var(--dd-warn)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <text x="576" y="208" text-anchor="middle" font-size="13" fill="var(--dd-warn)">未カバー 1</text>
        <text x="576" y="230" text-anchor="middle" font-size="12" fill="var(--dd-warn)">水増ししない</text>
        <rect x="648" y="176" width="112" height="76" rx="8" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <text x="704" y="208" text-anchor="middle" font-size="13" fill="var(--dd-accent)">29 / 30</text>
        <text x="704" y="230" text-anchor="middle" font-size="12" fill="var(--dd-accent)">例 +1 単位</text>
      </svg>
    </div>
    <p class="caveat">終端の3書き方・定義・綴り・非終端、例文2断片、通常アクションは既存 Behat へ。文字集合だけシナリオを足す。導入文「grammatical classifications」は仕様化しない。</p>
  </section>

  <section class="sec">
    <div class="label">02<br>概念</div>
    <div class="field">
      <p class="lead">計上は解釈があること。非対応は生成系だけ。</p>
      <svg viewBox="0 0 820 220" role="img" aria-label="0から100の尺。68.97が変更前。96.67が正直な上限。100は斜線で封じ、unsupportedへの付け替えをしない。">
        <line x1="40" y1="88" x2="780" y2="88" stroke="var(--dd-rule)" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="40" cy="88" r="4" fill="var(--dd-rule)"/>
        <circle cx="780" cy="88" r="4" fill="none" stroke="var(--dd-red)" stroke-width="1.5"/>
        <path d="M768 76L792 100M792 76L768 100" fill="none" stroke="var(--dd-red)" stroke-width="1.5" stroke-linecap="round"/>

        <circle cx="550" cy="88" r="5" fill="var(--dd-fg-subtle)"/>
        <line x1="550" y1="88" x2="550" y2="48" stroke="var(--dd-fg-subtle)" stroke-width="1.5"/>
        <text x="550" y="36" text-anchor="middle" font-size="13" fill="var(--dd-fg-subtle)">68.97</text>

        <circle cx="756" cy="88" r="6" fill="var(--dd-accent)"/>
        <line x1="756" y1="88" x2="756" y2="48" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <text x="720" y="36" text-anchor="middle" font-size="13" fill="var(--dd-accent)">96.67</text>

        <text x="40" y="120" font-size="12" fill="var(--dd-fg-subtle)">0</text>
        <text x="780" y="120" text-anchor="end" font-size="12" fill="var(--dd-red)">100</text>
        <text x="780" y="140" text-anchor="end" font-size="12" fill="var(--dd-red)">非対応に付け替えない</text>

        <rect x="40" y="160" width="520" height="36" rx="6" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <rect x="560" y="160" width="60" height="36" rx="6" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
        <rect x="620" y="160" width="20" height="36" rx="6" fill="none" stroke="var(--dd-warn)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <rect x="760" y="160" width="20" height="36" rx="6" fill="none" stroke="var(--dd-red)" stroke-width="1.5"/>
        <text x="300" y="184" text-anchor="middle" font-size="12" fill="var(--dd-accent)">対応 26</text>
        <text x="590" y="184" text-anchor="middle" font-size="11" fill="var(--dd-fg-subtle)">非対応 3</text>
        <text x="630" y="212" text-anchor="middle" font-size="11" fill="var(--dd-warn)">空 1</text>
      </svg>
    </div>
    <div class="three">
      <figure>
        <svg viewBox="0 0 260 96" role="img" aria-label="対応と理由付き非対応を足して計上する。">
          <rect x="16" y="28" width="112" height="40" rx="8" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
          <rect x="140" y="28" width="48" height="40" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
          <text x="72" y="54" text-anchor="middle" font-size="13">対応</text>
          <text x="164" y="54" text-anchor="middle" font-size="13" fill="var(--dd-fg-subtle)">非対応</text>
          <text x="212" y="54" font-size="20" fill="var(--dd-accent)">=</text>
        </svg>
        <h3>計上</h3>
        <p>解釈がある単位。検証済みと、理由付き非対応を足す。</p>
      </figure>
      <figure>
        <svg viewBox="0 0 260 96" role="img" aria-label="空の単位は見える。斜線の非対応にはしない。">
          <rect x="36" y="28" width="72" height="40" rx="8" fill="none" stroke="var(--dd-warn)" stroke-width="1.5" stroke-dasharray="5 4"/>
          <path d="M140 48H188" fill="none" stroke="var(--dd-rule)" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M180 42L188 48L180 54" fill="none" stroke="var(--dd-rule)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="200" y="28" width="40" height="40" rx="8" fill="none" stroke="var(--dd-red)" stroke-width="1.5"/>
          <path d="M208 36L232 60M232 36L208 60" fill="none" stroke="var(--dd-red)" stroke-width="1.5" stroke-linecap="round"/>
          <text x="72" y="54" text-anchor="middle" font-size="13" fill="var(--dd-warn)">空</text>
        </svg>
        <h3>未カバーは見える</h3>
        <p>導入文は空。非対応ラベルで消さない。</p>
      </figure>
      <figure>
        <svg viewBox="0 0 260 96" role="img" aria-label="非対応3は生成パーサ・スキャナ・文字集合の実行系のまま。">
          <rect x="28" y="28" width="56" height="40" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
          <rect x="100" y="28" width="56" height="40" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
          <rect x="172" y="28" width="56" height="40" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
          <text x="56" y="54" text-anchor="middle" font-size="12" fill="var(--dd-fg-subtle)">yylex</text>
          <text x="128" y="54" text-anchor="middle" font-size="12" fill="var(--dd-fg-subtle)">-d</text>
          <text x="200" y="54" text-anchor="middle" font-size="12" fill="var(--dd-fg-subtle)">符号</text>
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
      <svg viewBox="0 0 820 248" role="img" aria-label="変更前はマニュアルとBehatが切れている。最終は出典から仕様へ、仕様からBehatへ。導入文だけ仕様に入らない。本番パーサは横に置いたまま。">
        <text x="196" y="22" text-anchor="middle" font-size="12" font-weight="600" letter-spacing="1.6" fill="var(--dd-fg-subtle)">変更前</text>
        <text x="624" y="22" text-anchor="middle" font-size="12" font-weight="600" letter-spacing="1.6" fill="var(--dd-accent)">最終</text>

        <rect x="24" y="40" width="344" height="188" rx="12" fill="none" stroke="var(--dd-border)" stroke-width="1.5"/>
        <rect x="392" y="40" width="404" height="188" rx="12" fill="none" stroke="var(--dd-accent)" stroke-width="1.5"/>

        <rect x="48" y="64" width="120" height="44" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
        <text x="108" y="92" text-anchor="middle" font-size="13">出典</text>
        <rect x="224" y="64" width="120" height="44" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
        <text x="284" y="92" text-anchor="middle" font-size="13" fill="var(--dd-fg-subtle)">Behat</text>
        <path d="M176 86H216" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-dasharray="5 4" stroke-linecap="round"/>
        <path d="M168 78L184 94M184 78L168 94" fill="none" stroke="var(--dd-fg-subtle)" stroke-width="1.5" stroke-linecap="round"/>
        <rect x="136" y="132" width="120" height="44" rx="8" fill="none" stroke="var(--dd-border)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <text x="196" y="160" text-anchor="middle" font-size="13" fill="var(--dd-fg-subtle)">仕様 欠</text>
        <text x="196" y="204" text-anchor="middle" font-size="12" fill="var(--dd-fg-subtle)">本番コードも feature も据え置き</text>

        <rect x="416" y="64" width="88" height="44" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
        <text x="460" y="92" text-anchor="middle" font-size="13">出典</text>
        <path d="M512 86H548" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M540 80L548 86L540 92" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="556" y="64" width="88" height="44" rx="8" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <text x="600" y="92" text-anchor="middle" font-size="13">仕様</text>
        <path d="M652 86H688" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M680 80L688 86L680 92" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="696" y="64" width="76" height="44" rx="8" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        <text x="734" y="92" text-anchor="middle" font-size="13">Behat</text>

        <rect x="416" y="132" width="88" height="44" rx="8" fill="none" stroke="var(--dd-warn)" stroke-width="1.5" stroke-dasharray="5 4"/>
        <text x="460" y="160" text-anchor="middle" font-size="12" fill="var(--dd-warn)">導入文</text>
        <path d="M512 154H548" fill="none" stroke="var(--dd-warn)" stroke-width="1.5" stroke-dasharray="5 4" stroke-linecap="round"/>
        <rect x="556" y="132" width="216" height="44" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
        <text x="664" y="160" text-anchor="middle" font-size="13" fill="var(--dd-fg-subtle)">パーサ src は無変更</text>
        <text x="594" y="204" text-anchor="middle" font-size="12" fill="var(--dd-accent)">Symbols セレクタに example を足す</text>
      </svg>
    </div>
    <div class="three">
      <figure>
        <svg viewBox="0 0 260 96" role="img" aria-label="出典の箱から仕様の箱へ実線。">
          <rect x="16" y="28" width="88" height="40" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
          <rect x="156" y="28" width="88" height="40" rx="8" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
          <path d="M112 48H148" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M140 42L148 48L140 54" fill="none" stroke="var(--dd-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>結ぶ</h3>
        <p>既存シナリオに ID を付ける。<code>symbols.yaml</code> / <code>rules.yaml</code>。</p>
      </figure>
      <figure>
        <svg viewBox="0 0 260 96" role="img" aria-label="箱を一つ足してから結ぶ。">
          <rect x="16" y="28" width="64" height="40" rx="8" fill="var(--dd-surface)" stroke="var(--dd-border)" stroke-width="1.5"/>
          <rect x="98" y="20" width="64" height="40" rx="8" fill="none" stroke="var(--dd-accent)" stroke-width="1.5"/>
          <text x="130" y="46" text-anchor="middle" font-size="16" fill="var(--dd-accent)">+</text>
          <rect x="180" y="28" width="64" height="40" rx="8" fill="var(--dd-accent)" fill-opacity=".12" stroke="var(--dd-accent)" stroke-width="1.5"/>
        </svg>
        <h3>試す</h3>
        <p>文字集合だけ <code>symbols.feature</code> にシナリオを足す。</p>
      </figure>
      <figure>
        <svg viewBox="0 0 260 96" role="img" aria-label="点線の箱が仕様に入らず、非対応の箱は斜線。">
          <rect x="28" y="28" width="72" height="40" rx="8" fill="none" stroke="var(--dd-warn)" stroke-width="1.5" stroke-dasharray="5 4"/>
          <rect x="160" y="28" width="72" height="40" rx="8" fill="none" stroke="var(--dd-red)" stroke-width="1.5"/>
          <path d="M172 36L220 60M220 36L172 60" fill="none" stroke="var(--dd-red)" stroke-width="1.5" stroke-linecap="round"/>
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
    <div class="holds">
      <div class="hold"><b>16/16</b><span>変更 unit の差分カバレッジ。lint 23 件、Behat 307 がローカルで通過。</span></div>
      <div class="hold"><b>6</b><span>ファイル。baseline、ゲート、README、定義2、feature 1。パーサ src は無し。</span></div>
      <div class="hold"><b>393</b><span>PR。fetch が拒否されたため GitHub git data API で main 直上に同じ6ファイルを載せた。</span></div>
      <div class="hold"><b>0</b><span>作業ディレクトリの差分。開始 tree と終了 tree は同一。変更は worktree と PR 側。</span></div>
    </div>
    <p class="caveat">CI は作成時点で pending。このランでは成功未確認。空 blob アップロードは JSON 本文を付けて再送した。throwaway の autoload パス誤りは成果物ではない。ローカル worktree は PR #380 相当の古い基点のままなので、続けるなら fetch 後にリモートへ合わせる。</p>
  </section>
</article>`,
};
