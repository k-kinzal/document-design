import { html, specimen } from "./helpers.js";

export default {
  title: "Components/Control",
  parameters: {
    docs: {
      description: {
        component:
          "There are few controls on purpose: a document is read, not operated. " +
          "Each one here exists because all three consuming projects had " +
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
      ${specimen("field-search", `<input type="search" class="field-input field-search" placeholder="Find a statement… ( / )">`)}
      ${specimen("field-block", `<input type="search" class="field-input field-block" placeholder="Filter rows…">`)}
    </main></div></div>`,
};

/**
 * The theme toggle cycles through three states, not two. "Auto" is a real
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
