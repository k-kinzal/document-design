import { html } from './helpers.js';

export default { title: 'Components/Topbar' };

// The same controls fit in a narrow embedded column on a wide screen.
export const Languages = {
  render: () => html`
    <div class="doc doc-inset" lang="en" style="max-width:320px">
      <header class="topbar">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="#">doc-ui</a><span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Typography</span>
        </nav>
        <div class="topbar-tools">
          <input class="input input-search" type="search" aria-label="Search" placeholder="Search /">
          <a class="btn btn-quiet" href="#" lang="ja" hreflang="ja">日本語</a>
          <button class="btn" data-dd-theme-toggle aria-label="Switch color theme">◐</button>
        </div>
      </header>
      <main class="content prose">
        <h2>Body text and headings</h2>
        <p>Body text keeps its natural spacing. Headings and short labels use proportional metrics.</p>
      </main>
    </div>`,
};

/** The same narrow topbar with Japanese labels and localized controls. */
export const Japanese = {
  render: () => html`
    <div class="doc doc-inset" lang="ja" style="max-width:320px">
      <header class="topbar">
        <nav class="breadcrumbs" aria-label="パンくず">
          <a href="#">doc-ui</a><span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">組版</span>
        </nav>
        <div class="topbar-tools">
          <input class="input input-search" type="search" aria-label="検索" placeholder="検索 /">
          <a class="btn btn-quiet" href="#" lang="en" hreflang="en">English</a>
          <button class="btn" data-dd-theme-toggle aria-label="配色を切り替える">◐</button>
        </div>
      </header>
      <main class="content prose">
        <h2>本文と見出し</h2>
        <p>本文はベタ組を保ち、見出しや短いラベルにはプロポーショナルメトリクスを使います。</p>
      </main>
    </div>`,
};
