import { html } from "./helpers.js";

export default {
  title: "Components/Keys",
  parameters: {
    docs: {
      description: {
        component:
          "What the keyboard does on this page. Worth having because the " +
          "behaviour layer binds `/` whether or not the page says so, and an " +
          "undiscoverable shortcut is one nobody uses.",
      },
    },
  },
};

export const Shortcuts = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:520px">
      <h2>Keyboard</h2>
      <dl class="keys">
        <div><dt><kbd>/</kbd></dt><dd>Focus search</dd></div>
        <div><dt><kbd>↑</kbd><kbd>↓</kbd></dt><dd>Move through results</dd></div>
        <div><dt><kbd>Enter</kbd></dt><dd>Open the selected result</dd></div>
        <div><dt><kbd>Esc</kbd></dt><dd>Close the results panel</dd></div>
        <div><dt><kbd>←</kbd><kbd>→</kbd></dt><dd>Move between tabs, when a tab has focus</dd></div>
      </dl>
    </main></div></div>`,
};

export const Hint = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="sb-row">
        <input type="search" class="input input-search" placeholder="Find a statement…">
        <span class="key-hint">Press <kbd>/</kbd></span>
      </div>
    </main></div></div>`,
};
