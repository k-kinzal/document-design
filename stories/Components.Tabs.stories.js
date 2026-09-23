import { html } from "./helpers.js";

export default {
  title: "Components/Tabs",
  parameters: {
    docs: {
      description: {
        component:
          "One subject, several views of it.\n\n" +
          "**Only for views of the same thing.** Content a reader might want to " +
          "find without knowing it is there belongs in a disclosure or on the " +
          "page, because an inactive tab panel is invisible to the browser's " +
          "find-in-page and to anyone who arrived from a search engine.\n\n" +
          "Arrow keys move between tabs, and only the selected tab is in the tab " +
          "order, so Tab leaves the strip rather than walking every view.",
      },
    },
  },
};

export const Views = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:720px">
      <h2>The statement</h2>
      <div class="tabs" data-dd-tabs>
        <div class="tablist" role="tablist">
          <button class="tab" role="tab" aria-selected="true" aria-controls="tp-1">Resolved</button>
          <button class="tab" role="tab" aria-selected="false" aria-controls="tp-2">As written</button>
          <button class="tab" role="tab" aria-selected="false" aria-controls="tp-3">
            Findings<span class="count">2</span>
          </button>
        </div>
        <div class="tabpanel" id="tp-1" role="tabpanel" tabindex="0">
          <pre class="code"><span class="tok-kw">SELECT</span> * <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span>
<span class="tok-kw">WHERE</span> <span class="tok-id">post_status</span> = <span class="tok-ph">%s</span> <span class="tok-kw">AND</span> <span class="tok-id">ID</span> <span class="tok-kw">IN</span> (<span class="hole" title="A dependency the analyzer does not model was reached.">…unresolved</span>)</pre>
        </div>
        <div class="tabpanel" id="tp-2" role="tabpanel" tabindex="0" hidden>
          <pre class="code">"SELECT * FROM {$wpdb-&gt;posts} WHERE post_status = %s AND ID IN (" . $ids . ")"</pre>
        </div>
        <div class="tabpanel" id="tp-3" role="tabpanel" tabindex="0" hidden>
          <ul class="finding-list">
            <li><span class="chip tone-warn">medium</span><a class="mono" href="#">dynamic-sql</a>
                <span class="muted">$ids is spliced rather than bound.</span></li>
            <li><span class="chip tone-neutral">low</span><a class="mono" href="#">analysis-incomplete</a>
                <span class="muted">The search stopped at a budget.</span></li>
          </ul>
        </div>
      </div>
    </main></div></div>`,
};
