import { html } from "./helpers.js";

export default {
  title: "Components/Pagination",
  parameters: {
    docs: {
      description: {
        component:
          "The next thing along, when the things have an order.\n\n" +
          "Each link names its destination. \"Next ›\" on its own makes the " +
          "reader click to find out where they are going, and on a generated " +
          "reference the answer is usually \"not where I wanted\".",
      },
    },
  },
};

export const PrevNext = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <h1>ErrorGutter</h1>
      <p class="lede">Draws the gutter beside a reported line.</p>
      <nav class="pager">
        <a class="pager-prev" href="#">
          <span class="pager-dir">Previous</span>
          <span class="pager-name">ErrorGrouping</span>
        </a>
        <a class="pager-next" href="#">
          <span class="pager-dir">Next</span>
          <span class="pager-name">ErrorSourceReader</span>
        </a>
      </nav>
    </main></div></div>`,
};

/** Only one way to go: the remaining half is left empty rather than filled
 *  with a disabled control the reader has to evaluate. */
export const OneWay = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <nav class="pager">
        <a class="pager-next" href="#">
          <span class="pager-dir">Next</span>
          <span class="pager-name">AiRulesErrorFormatter</span>
        </a>
      </nav>
    </main></div></div>`,
};

/** Numbered pages, for a listing that had to be split. */
export const Pages = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <nav class="pages">
        <a href="#">← Previous</a>
        <a href="#">1</a>
        <span class="is-current">2</span>
        <a href="#">3</a>
        <a href="#">4</a>
        <span class="pages-gap">…</span>
        <a href="#">18</a>
        <a href="#">Next →</a>
        <span class="count" style="margin-left:auto">844 statements</span>
      </nav>
    </main></div></div>`,
};
