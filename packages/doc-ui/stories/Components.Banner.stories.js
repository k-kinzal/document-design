import { html } from "./helpers.js";

export default {
  title: "Components/Banner",
  parameters: {
    docs: {
      description: {
        component:
          "A fact about the whole page, carried at the top of it.\n\n" +
          "Distinct from `.notice`, which sits in the flow next to what it " +
          "qualifies. A banner is the page's **mode** — \"this is a diff\", " +
          "\"this build is stale\" — and applies to everything under it.",
      },
    },
  },
};

export const Modes = {
  render: () => html`
    <div class="doc"><div class="main">
      <div class="banner tone-warn">
        <span class="banner-label">Diff</span>
        <span class="banner-body">Comparing <code>v1.4.0</code> against <code>main</code>. Unchanged symbols are hidden.</span>
        <a class="banner-action" href="#">Show everything</a>
      </div>
      <div class="banner">
        <span class="banner-label">Generated</span>
        <span class="banner-body">From commit <code>9d05c35</code> on 2026-09-23. The working tree had uncommitted changes.</span>
      </div>
      <div class="banner tone-danger">
        <span class="banner-label">Stale</span>
        <span class="banner-body">The analysis is 14 days older than the source it describes.</span>
        <a class="banner-action" href="#">How to regenerate</a>
      </div>
      <main class="content">
        <h1>Symbols</h1>
        <p class="lede">The banners above apply to this page, not to any one thing on it.</p>
      </main>
    </div></div>`,
};
