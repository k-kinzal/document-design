import { html } from "./helpers.js";

export default {
  title: "Components/Timeline",
  parameters: {
    docs: {
      description: {
        component:
          "What happened, in order. For a run: the steps it took, which one " +
          "failed, how long each took. The spine is drawn on the list rather " +
          "than per item, so a list of two does not grow a line with nothing to " +
          "join.",
      },
    },
  },
};

export const Run = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <h2>What the run did</h2>
      <ol class="timeline">
        <li class="timeline-item tone-ok">
          <span class="timeline-time">14:02:11</span>
          <p class="timeline-title">Parsed the source</p>
          <p class="timeline-description">77 files, 542 symbols, 4.2s</p>
        </li>
        <li class="timeline-item tone-ok">
          <span class="timeline-time">14:02:15</span>
          <p class="timeline-title">Read the coverage report</p>
          <p class="timeline-description">16 of 16 changed units covered</p>
        </li>
        <li class="timeline-item tone-warn">
          <span class="timeline-time">14:02:18</span>
          <p class="timeline-title">Gate raised to 96</p>
          <p class="timeline-description">One unit has no behaviour to test and is left uncovered on purpose.</p>
        </li>
        <li class="timeline-item tone-danger">
          <span class="timeline-time">14:03:40</span>
          <p class="timeline-title">git fetch refused</p>
          <div class="terminal">
            <p class="terminal-command">git fetch origin main</p>
            <pre class="terminal-output terminal-error">fatal: could not read Username for 'https://github.com'</pre>
          </div>
          <p class="timeline-description">Fell back to the GitHub git data API.</p>
        </li>
        <li class="timeline-item is-open">
          <span class="timeline-time">14:04:02</span>
          <p class="timeline-title">CI pending</p>
          <p class="timeline-description">Not confirmed in this run — an outline mark, so the reader can
             see where the run actually got to.</p>
        </li>
      </ol>
    </main></div></div>`,
};

/**
 * A chronology in a report. Inside `.sheet` the entries take the report's
 * reading size — time at the label size, title and description at the body
 * size, a baseline between entries — so a career told a few sentences at a
 * time is not the one block on the page set smaller than the notes around it.
 */
export const InAReport = {
  render: () => html`
    <article class="sheet" lang="en">
      <section class="sec">
        <div class="rail"><h2 class="label">02<br>2014</h2><p class="sidenote"><span class="sidenote-label">First public works</span>PHP · Node.js · Grunt · Scala · Documentation</p></div>
        <div class="field">
          <p class="lead">Build, write and talk about the inconveniences close at hand.</p>
          <p class="note">Before the first talk, the tools built and how to use them were already published on Qiita.</p>
          <ol class="timeline">
            <li class="timeline-item">
              <span class="timeline-time">2014.05–06</span>
              <p class="timeline-title">Reporting build results to Ukagaka</p>
              <p class="timeline-description">Built grunt-sstp, which sends Grunt successes, warnings and failures to a desktop mascot. Published on Qiita on 6 May, followed on 1 June by an explanation of driving it from Scala’s SBT.<a class="cite" href="#src-1">1</a><a class="cite" href="#src-2">2</a></p>
            </li>
            <li class="timeline-item">
              <span class="timeline-time">2014.09</span>
              <p class="timeline-title">Generating documentation from code</p>
              <div class="timeline-description">
                <p>Explained ngdoc generation with Dgeni on Qiita. grunt-dgeni put documentation generation into the everyday build, and dgeni-markdown added a tool for Markdown output.<a class="cite" href="#src-3">3</a></p>
                <p>The walkthrough and the implementation that simplifies it appear side by side.</p>
              </div>
            </li>
            <li class="timeline-item tone-accent">
              <span class="timeline-time">2014.10.11 · First talk</span>
              <p class="timeline-title">A new form of notification with PHP and Ukagaka</p>
              <p class="timeline-description">A lightning talk at PHP Conference Japan 2014. The notification tools published since spring led to a talk at a technical conference.<a class="cite" href="#src-6">6</a></p>
            </li>
          </ol>
        </div>
      </section>
    </article>`,
};

/** Japanese chronology, at the same measurements as the English report. */
export const JapaneseInAReport = {
  render: () => html`
    <article class="sheet" lang="ja">
      <section class="sec">
        <div class="rail"><h2 class="label">02<br>2014</h2><p class="sidenote"><span class="sidenote-label">最初の公開活動</span>PHP · Node.js · Grunt · Scala · Documentation</p></div>
        <div class="field">
          <p class="lead">身近な不便を、作って、書いて、話す。</p>
          <p class="note">初登壇の前から、作った道具と使い方をQiitaで公開。通知の実装とドキュメント生成に、初期の関心が表れている。</p>
          <ol class="timeline">
            <li class="timeline-item">
              <span class="timeline-time">2014.05–06</span>
              <p class="timeline-title">ビルド結果を「伺か」に伝える</p>
              <p class="timeline-description">Gruntの成功・警告・失敗などをデスクトップマスコットへ通知するgrunt-sstpを制作。5月6日にQiitaで公開し、6月1日にはScalaのSBTから操作する方法も解説した。<a class="cite" href="#src-1">1</a><a class="cite" href="#src-2">2</a></p>
            </li>
            <li class="timeline-item">
              <span class="timeline-time">2014.09</span>
              <p class="timeline-title">文書を、コードから生成できるように</p>
              <p class="timeline-description">Dgeniによるngdoc生成をQiitaで解説。grunt-dgeniで日常のビルドに文書生成を組み込み、dgeni-markdownでMarkdown出力の道具も用意した。<a class="cite" href="#src-3">3</a><a class="cite" href="#src-4">4</a><a class="cite" href="#src-5">5</a></p>
            </li>
            <li class="timeline-item tone-accent">
              <span class="timeline-time">2014.10.11 · 初登壇</span>
              <p class="timeline-title">PHP＋伺かで始める新しい通知の形</p>
              <p class="timeline-description">PHP Conference Japan 2014のLT。春から公開していた通知ツールの試みが、技術カンファレンスでの発表へつながった。<a class="cite" href="#src-6">6</a><a class="cite" href="#src-7">7</a></p>
            </li>
          </ol>
        </div>
      </section>
    </article>`,
};
