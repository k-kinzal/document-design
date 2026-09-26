import { html } from './helpers.js';

export default {
  title: "Examples/Paper",
  parameters: {
    docs: {
      description: {
        component:
          "A long paper, read straight through and printed to PDF: a profile " +
          "that leads with words instead of a number, a chronology set at the " +
          "report's reading size, a result with its caveat, and the sources " +
          "the text cites by number. This is an excerpt of the complete " +
          "example on the product site (examples/paper.html), which runs to " +
          "nine periods and sixty-two sources; the content is the public " +
          "record of k-kinzal's work and is not invented. The only things " +
          "the document says about paper are two attributes on the root: " +
          "`data-dd-paper=\"a4\"` sets the sheet, its margins and its page " +
          "numbers, and `data-dd-print-urls=\"sources\"` keeps addresses to " +
          "the sources list.",
      },
    },
  },
};

/** English translation of the paper's opening, one period, its result and its sources. */
export const Paper = {
  render: () => html`
    <article class="sheet" lang="en" data-dd-paper="a4" data-dd-print-urls="sources">
      <p class="eyebrow">k_kinzal / ENGINEERING WORKS · 2014–2026</p>
      <h1>k_kinzal</h1>
      <p class="stand">Turns complex technology into usable tools and knowledge that carries.</p>
      <div class="hero">
        <div class="figures">
          <figure><h3>Builds usable tools</h3><p>Documentation generation, deployment, PHP test environments, AI development.</p></figure>
          <figure><h3>Changes things safely</h3><p>Platform migration, design through types, automated tests and quality verification.</p></figure>
          <figure><h3>Passes knowledge on</h3><p>Articles on Qiita and Zenn, conference talks, Rust and Solana course material.</p></figure>
        </div>
      </div>

      <section class="sec">
        <div class="rail"><h2 class="label">01<br>Profile</h2><p class="sidenote"><span class="sidenote-label">How to read</span>Each period’s heading is the claim, the paragraph after it the context, and the chronology the evidence. Numbers in the text point to the sources at the end.</p></div>
        <div class="field">
          <p class="lead">Solves in code the inconveniences met in development and operations.</p>
          <p class="note">Digs into how things work and confirms them in running form. The process is published as open source, articles, talks and course material.</p>
          <p class="note">A paper tracing public work from the first talk in 2014 to the present. The profile is an editorial summary based on the work recorded in this paper. Checked on 26 September 2026.</p>
        </div>
      </section>

      <section class="sec">
        <div class="rail"><h2 class="label">05<br>2020–2021</h2><p class="sidenote"><span class="sidenote-label">Reliable change</span>PHP · Kubernetes · Helm · Observability · Reliability</p></div>
        <div class="field">
          <p class="lead">Keep a running system changeable.</p>
          <p class="note">The migration of an existing PHP system to Kubernetes was published as talks, a series and Q&amp;A. Interest widened to operating after the migration and to the handling of alerts.</p>
          <ol class="timeline">
            <li class="timeline-item">
              <span class="timeline-time">2020.10–12</span>
              <p class="timeline-title">Sharing the issues met in the migration, in practical terms</p>
              <p class="timeline-description">AWS DevDay in October, a series from November and PHP Conference in December described moving from EC2 to Kubernetes. Configuration injection, logging, container shutdown and development environments were handled concretely.<a class="cite" href="#paper-src-1">1</a><a class="cite" href="#paper-src-2">2</a><a class="cite" href="#paper-src-4">4</a></p>
            </li>
            <li class="timeline-item">
              <span class="timeline-time">2021.01</span>
              <p class="timeline-title">Alerts are not only a notification problem</p>
              <p class="timeline-description">“We cannot manage alerts” on Zenn separated detection, removing the effect on users, and resolving the root cause. It discussed the burden on responders, responsibilities, accumulated knowledge and the difficulty of metrics.<a class="cite" href="#paper-src-5">5</a></p>
            </li>
            <li class="timeline-item">
              <span class="timeline-time">2021.03</span>
              <p class="timeline-title">Sharing what it takes to keep operating Helm charts</p>
              <p class="timeline-description">At CloudNative Days Spring 2021, a look back at two and a half years of running a chart repository: automating distribution, managing several charts, keeping up with Kubernetes releases, and testing.<a class="cite" href="#paper-src-6">6</a></p>
            </li>
          </ol>
        </div>
      </section>

      <section class="sec">
        <div class="rail"><h2 class="label">11<br>Main results</h2></div>
        <div class="field">
          <p class="lead">The change shown by the platform migration the author joined.</p>
          <p class="note">Figures recorded in a 2020 published case study, after the migration from EC2 to Kubernetes.<a class="cite" href="#paper-src-3">3</a></p>
          <div class="stats">
            <div class="stat"><b class="stat-fig">20 → 5 min</b><span class="stat-label">Time taken by a deployment. About 5 minutes after the migration.</span></div>
            <div class="stat"><b class="stat-fig">1/20</b><span class="stat-label">Time to roll back a failed release.</span></div>
            <div class="stat"><b class="stat-fig">1/10</b><span class="stat-label">Operational cost of a release.</span></div>
          </div>
        </div>
        <p class="caveat">Results of the team, as recorded in the published case study. The figures do not represent one person’s work.</p>
      </section>

      <section class="sec">
        <div class="rail"><h2 class="label">12<br>Sources</h2><p class="sidenote">6 of 62 sources</p></div>
        <div class="field">
          <p class="lead">Follow the public record.</p>
          <p class="note">A number in the text leads to its source; each title leads to the original. In print, URLs appear only in this list.</p>
          <ol class="sources">
            <li id="paper-src-1"><a href="https://speakerdeck.com/cwozaki/aws-devday-2020-c-8-resientosisutemuwoec2karakubernetesnizhi-kihuan-eruzhan-i-number-awsdevday" lang="ja">EC2からKubernetesへ移行する取り組み［内容名］</a><span class="source-meta">Slides · 2020.10.20 · AWS DevDay 2020 C-8. Dated by publication of the slides</span></li>
            <li id="paper-src-2"><a href="https://creators-note.chatwork.com/entry/2020/11/04/141050" lang="ja">PHPシステムのKubernetes移行・第1回［内容名］</a><span class="source-meta">Article · 2020.11.04 · First part of the author’s series on the migration</span></li>
            <li id="paper-src-3"><a href="https://d1.awsstatic.com/case-studies/jp/pdf/chatwork.pdf" lang="ja">Kubernetes基盤の移行事例［内容名］</a><span class="source-meta">Published case study (PDF) · 2020 · Quantified results of the team the author joined</span></li>
            <li id="paper-src-4"><a href="https://creators-note.chatwork.com/entry/2020/12/12/140539">PHP on Kubernetes</a><span class="source-meta">Talk report · 2020.12.12 · Summary and Q&amp;A from PHP Conference 2020</span></li>
            <li id="paper-src-5"><a href="https://zenn.dev/kinzal/articles/998707314a8f6e" lang="ja">僕たちはアラートを管理できない</a><span class="source-meta">Zenn · 2021.01.24 · Responsibilities and metrics for detection, response and root cause</span></li>
            <li id="paper-src-6"><a href="https://speakerdeck.com/cwozaki/helm-chartrihositoriwo2nian-ban-yun-yong-sitewakatutairoironahua-cloudnative-days-spring-2021-online-number-cndo2021" lang="ja">Helm Chartリポジトリの2年半の運用</a><span class="source-meta">Slides · 2021.03.12 · CloudNative Days Spring 2021</span></li>
          </ol>
        </div>
      </section>
    </article>`,
};

/** The original Japanese, at the same measurements. */
export const Japanese = {
  render: () => html`
    <article class="sheet" lang="ja" data-dd-paper="a4" data-dd-print-urls="sources">
      <p class="eyebrow">k_kinzal / ENGINEERING WORKS · 2014–2026</p>
      <h1>k_kinzal</h1>
      <p class="stand">複雑な技術を、使える道具と伝わる知識に変える人。</p>
      <div class="hero">
        <div class="figures">
          <figure><h3>使える道具を作る</h3><p>文書生成、デプロイ、PHPのテスト環境、AI開発。</p></figure>
          <figure><h3>安全に変える</h3><p>基盤移行、型による設計、自動テストと品質の検証。</p></figure>
          <figure><h3>知識を伝える</h3><p>Qiita・Zennでの発信、技術登壇、Rust・Solana教材。</p></figure>
        </div>
      </div>

      <section class="sec">
        <div class="rail"><h2 class="label">01<br>プロフィール</h2><p class="sidenote"><span class="sidenote-label">読み方</span>各期の見出しが主張、続く段落が文脈、年表が根拠。本文の番号は文末の出典を指す。</p></div>
        <div class="field">
          <p class="lead">開発や運用で感じた不便を、コードで解く。</p>
          <p class="note">仕組みを掘り下げ、動く形で確かめる。その過程を、OSS・記事・登壇・教材として公開する。</p>
          <p class="note">2014年の初登壇から現在までの、公開活動をたどるペーパー。人物紹介は本書に収録した活動をもとにした編集上の要約。確認日：2026年9月26日。</p>
        </div>
      </section>

      <section class="sec">
        <div class="rail"><h2 class="label">05<br>2020–2021</h2><p class="sidenote"><span class="sidenote-label">信頼できる変更</span>PHP · Kubernetes · Helm · Observability · Reliability</p></div>
        <div class="field">
          <p class="lead">動いているシステムを、変え続けられるように。</p>
          <p class="note">既存PHPシステムのKubernetes移行を、発表・連載・質疑応答として公開。移行後の運用や、アラートの扱いまで関心が広がる。</p>
          <ol class="timeline">
            <li class="timeline-item">
              <span class="timeline-time">2020.10–12</span>
              <p class="timeline-title">移行で直面した論点を、実務の言葉で共有</p>
              <p class="timeline-description">10月のAWS DevDay、11月からの連載、12月のPHP Conferenceで、EC2からKubernetesへ移す取り組みを説明。設定の注入、ログ、コンテナの終了処理、開発環境など、移行を進める際の課題を具体的に扱った。<a class="cite" href="#paper-ja-src-1">1</a><a class="cite" href="#paper-ja-src-2">2</a><a class="cite" href="#paper-ja-src-4">4</a></p>
            </li>
            <li class="timeline-item">
              <span class="timeline-time">2021.01</span>
              <p class="timeline-title">アラートを、通知だけの問題にしない</p>
              <p class="timeline-description">Zennの「僕たちはアラートを管理できない」では、検知、利用者への影響の解消、原因の根本解決を分けて整理。対応する人の負担、責務、知識の蓄積、指標の難しさを、自身の課題意識から論じた。<a class="cite" href="#paper-ja-src-5">5</a></p>
            </li>
            <li class="timeline-item">
              <span class="timeline-time">2021.03</span>
              <p class="timeline-title">Helm Chartを運用し続ける知見を共有</p>
              <p class="timeline-description">CloudNative Days Spring 2021で、2年半のChartリポジトリ運用を振り返る。配布の自動化、複数Chartの管理、Kubernetes更新への追従、テストなど、導入後に続く作業を整理した。<a class="cite" href="#paper-ja-src-6">6</a></p>
            </li>
          </ol>
        </div>
      </section>

      <section class="sec">
        <div class="rail"><h2 class="label">11<br>主な成果</h2></div>
        <div class="field">
          <p class="lead">参画した基盤移行で示された変化。</p>
          <p class="note">2020年の公開事例に記載された、EC2からKubernetesへの移行後の指標。<a class="cite" href="#paper-ja-src-3">3</a></p>
          <div class="stats">
            <div class="stat"><b class="stat-fig">20分 → 5分</b><span class="stat-label">デプロイに要する時間。移行後は5分程度。</span></div>
            <div class="stat"><b class="stat-fig">1/20</b><span class="stat-label">リリース障害時の切り戻し時間。</span></div>
            <div class="stat"><b class="stat-fig">1/10</b><span class="stat-label">リリース時のオペレーションコスト。</span></div>
          </div>
        </div>
        <p class="caveat">公開事例に記載されたチームの成果。個人単独の成果を示す数値ではない。</p>
      </section>

      <section class="sec">
        <div class="rail"><h2 class="label">12<br>出典</h2><p class="sidenote">62件のうち6件</p></div>
        <div class="field">
          <p class="lead">公開資料をたどる。</p>
          <p class="note">本文の番号から出典へ、各タイトルから原資料へ移動できる。印刷時はURLをこの一覧にのみ記す。</p>
          <ol class="sources">
            <li id="paper-ja-src-1"><a href="https://speakerdeck.com/cwozaki/aws-devday-2020-c-8-resientosisutemuwoec2karakubernetesnizhi-kihuan-eruzhan-i-number-awsdevday">EC2からKubernetesへ移行する取り組み［内容名］</a><span class="source-meta">登壇資料 · 2020.10.20 · AWS DevDay 2020 C-8。日付は資料公開日</span></li>
            <li id="paper-ja-src-2"><a href="https://creators-note.chatwork.com/entry/2020/11/04/141050">PHPシステムのKubernetes移行・第1回［内容名］</a><span class="source-meta">技術記事 · 2020.11.04 · 本人による移行解説連載の第1回</span></li>
            <li id="paper-ja-src-3"><a href="https://d1.awsstatic.com/case-studies/jp/pdf/chatwork.pdf">Kubernetes基盤の移行事例［内容名］</a><span class="source-meta">公開事例PDF · 2020 · 移行に参画したチームの定量的な成果</span></li>
            <li id="paper-ja-src-4"><a href="https://creators-note.chatwork.com/entry/2020/12/12/140539">PHP on Kubernetes</a><span class="source-meta">登壇報告 · 2020.12.12 · PHP Conference 2020の概要・質疑応答</span></li>
            <li id="paper-ja-src-5"><a href="https://zenn.dev/kinzal/articles/998707314a8f6e">僕たちはアラートを管理できない</a><span class="source-meta">Zenn · 2021.01.24 · 検知・対応・根本解決の責務と指標を整理</span></li>
            <li id="paper-ja-src-6"><a href="https://speakerdeck.com/cwozaki/helm-chartrihositoriwo2nian-ban-yun-yong-sitewakatutairoironahua-cloudnative-days-spring-2021-online-number-cndo2021">Helm Chartリポジトリの2年半の運用</a><span class="source-meta">登壇資料 · 2021.03.12 · CloudNative Days Spring 2021</span></li>
          </ol>
        </div>
      </section>
    </article>`,
};
