import { html } from "./helpers.js";

export default {
  title: "Components/Stat",
  parameters: {
    docs: {
      description: {
        component:
          "A figure that is the answer to something, with the question under " +
          "it. The catalog counterpart of the report sheet's `.stat` — kept " +
          "separate because they are sized for different reading.\n\n" +
          "Figures are tabular here, unlike the report's lead number: these sit " +
          "in a row and are meant to be compared, which is exactly when digits " +
          "should line up.",
      },
    },
  },
};

export const Row = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <h1>Overview</h1>
      <div class="stats">
        <a class="stat" href="#"><b class="stat-fig">844</b><span class="stat-label">statements</span></a>
        <a class="stat" href="#"><b class="stat-fig">12</b><span class="stat-label">tables</span></a>
        <a class="stat" href="#"><b class="stat-fig">77</b><span class="stat-label">files</span></a>
        <a class="stat tone-warn" href="#"><b class="stat-fig">978</b>
          <span class="stat-label">findings</span>
          <span class="stat-note">709 of them dynamic SQL</span></a>
      </div>
    </main></div></div>`,
};

/** A direction, where one exists — never on its own, because a lone arrow does
 *  not say whether up is good. */
export const WithDelta = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="stats">
        <div class="stat tone-ok">
          <b class="stat-fig">96.67<span class="stat-delta stat-up">27.7</span></b>
          <span class="stat-label">source coverage</span>
          <span class="stat-note">was 68.97 before this change</span>
        </div>
        <div class="stat tone-danger">
          <b class="stat-fig">3<span class="stat-delta stat-flat">0</span></b>
          <span class="stat-label">unsupported</span>
          <span class="stat-note">the generated parser, unchanged</span>
        </div>
        <div class="stat">
          <b class="stat-fig">542<span class="stat-delta stat-up">12</span></b>
          <span class="stat-label">symbols</span>
        </div>
      </div>
    </main></div></div>`,
};

/** Bare, for a row of figures that does not want four boxes. */
export const Plain = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="stats stats-plain">
        <div class="stat"><b class="stat-fig">4.2s</b><span class="stat-label">analysis</span></div>
        <div class="stat"><b class="stat-fig">318</b><span class="stat-label">pages written</span></div>
        <div class="stat"><b class="stat-fig">1.4 MB</b><span class="stat-label">output</span></div>
      </div>
    </main></div></div>`,
};
