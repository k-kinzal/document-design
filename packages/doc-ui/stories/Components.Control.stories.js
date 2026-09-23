import { html, specimen } from "./helpers.js";

export default {
  title: "Components/Control",
  parameters: {
    docs: {
      description: {
        component:
          "There are few controls on purpose: a document is read, not operated. " +
          "Each one here exists because all figures consuming projects had " +
          "written it for themselves.",
      },
    },
  },
};

export const Buttons = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="sb-row">
        <button class="btn">Copy</button>
        <button class="btn btn-quiet" data-dd-theme-toggle>◐</button>
        <button class="btn is-done">Copied</button>
        <button class="btn" disabled>Unavailable</button>
      </div>
    </main></div></div>`,
};

export const Inputs = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      ${specimen("input-search", `<input type="search" class="input input-search" placeholder="Find a statement… ( / )">`)}
      ${specimen("input-block", `<input type="search" class="input input-block" placeholder="Filter rows…">`)}
    </main></div></div>`,
};

/**
 * The theme toggle cycles through figures states, not two. "Auto" is a real
 * answer — it means the document follows the reader's system — and a toggle
 * that only flips light and dark takes that away the first time they touch it,
 * with no way back.
 */
export const ThemeToggle = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="sb-row">
        <button class="btn" data-dd-theme-toggle>◐ Cycle theme</button>
        <span class="muted">auto → light → dark → auto</span>
      </div>
      <p class="muted" style="margin-top:12px">
        The <strong>Document</strong> control in the toolbar above drives the same
        setting, through the same stored key — so the two agree rather than fight.
        Either one moves the whole preview.
      </p>
    </main></div></div>`,
};

export const JapaneseFeedback = {
  render: () => html`
    <div class="doc doc-inset" lang="ja"><main class="content">
      <div class="code-block">
        <div class="code-head"><span>HTML</span><button class="btn" data-dd-copy="#ja-source" aria-live="polite">コピー</button></div>
        <pre class="code" id="ja-source"><code>&lt;p&gt;情報を見やすくする。&lt;/p&gt;</code></pre>
      </div>
      <button class="btn" data-dd-theme-toggle aria-label="配色を切り替える">◐</button>
      <p>コピー完了とテーマのラベルは、最も近いlang属性に従います。</p>
    </main></div>`,
};
