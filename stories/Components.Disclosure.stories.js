import { html } from "./helpers.js";

export default {
  title: "Components/Disclosure",
  parameters: {
    docs: {
      description: {
        component:
          "Something the page has, but does not lead with.\n\n" +
          "Native `<details>`: it works with no JavaScript, prints open if the " +
          "reader left it open, and is findable by the browser's own in-page " +
          "search in engines that expand it to reach a match.\n\n" +
          "**The count belongs on the summary.** \"Called by\" tells a reader " +
          "nothing about whether opening it is worth the scroll; \"Called by " +
          "143\" does.",
      },
    },
  },
};

export const Group = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <div class="disclosure-group">
        <details class="disclosure" open>
          <summary>Dedicated tests<span class="count">1</span></summary>
          <div class="disclosure-body">
            <ul class="usage-list">
              <li><a href="#"><code>ErrorGroupingTest::testByFileGroupsByPath</code></a>
                  <span class="usage-kind">calls</span></li>
            </ul>
          </div>
        </details>
        <details class="disclosure">
          <summary>Other tests reaching this symbol<span class="count">52</span></summary>
          <div class="disclosure-body">
            <ul class="usage-list">
              <li><a href="#"><code>CoverageReaderTest::testReadRejectsMissingDirectory</code></a>
                  <span class="usage-kind">calls</span></li>
              <li><a href="#"><code>DiffWorkspaceTest::testOpenExplainsThatDiffModeNeedsAGitWorkingTree</code></a>
                  <span class="usage-kind">calls</span></li>
            </ul>
          </div>
        </details>
        <details class="disclosure">
          <summary>As written in source<span class="count">1</span></summary>
          <div class="disclosure-body">
            <pre class="code">"SELECT * FROM {$wpdb->posts} WHERE post_status = %s"</pre>
          </div>
        </details>
      </div>
    </main></div></div>`,
};

/** Boxed, for a disclosure that is a thing rather than a section. */
export const Boxed = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <details class="disclosure disclosure-boxed" open>
        <summary>Why this is a lower bound<span class="count">3 reasons</span></summary>
        <div class="disclosure-body">
          <ul class="peek">
            <li><a href="#">A cycle in the call graph</a><span class="peek-figures">89</span></li>
            <li><a href="#">The analysis budget ran out</a><span class="peek-figures">6</span></li>
            <li><a href="#">A dependency that is not modelled</a><span class="peek-figures">709</span></li>
          </ul>
        </div>
      </details>
      <details class="disclosure disclosure-boxed">
        <summary>Raw analyzer output<span class="count">14 kB</span></summary>
        <div class="disclosure-body"><pre class="code">{"resolution":"incomplete-model", …}</pre></div>
      </details>
    </main></div></div>`,
};
