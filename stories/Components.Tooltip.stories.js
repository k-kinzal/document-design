import { html } from "./helpers.js";

export default {
  title: "Components/Tooltip",
  parameters: {
    docs: {
      description: {
        component:
          "The long form of something the page can only show short. CSS only — " +
          "these documents are read offline and printed, and a tooltip that " +
          "needs JavaScript is one more thing that is not there when the page " +
          "is a file on disk.\n\n" +
          "**It is an addition, never the only copy.** Anything a reader must " +
          "have is written on the page: a tooltip cannot be reached by touch, " +
          "by find-in-page, or by print. In print it is spelled out in " +
          "parentheses instead.",
      },
    },
  },
};

export const Hints = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <p>The statement resolved to
        <span class="hint" data-dd-hint="A dependency the analyzer does not model was reached." tabindex="0">incomplete-model</span>,
        which means the text shown is partly known.</p>
      <p>Coverage is
        <span class="hint" data-dd-hint="3 of 4 executable lines executed by the test suite" tabindex="0">75%</span>
        for this method.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Rule</th><th class="num">Statements</th></tr></thead>
          <tbody>
            <tr>
              <td><span class="hint" data-dd-hint="A value is spliced into the statement text instead of being bound." tabindex="0">dynamic-sql</span></td>
              <td class="num">709</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main></div></div>`,
};

/** Near the right edge the box would be cut off by the content column, so it
 *  anchors to the other side. */
export const AtTheEdge = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div style="display:flex;justify-content:flex-end">
        <span class="hint hint-end" data-dd-hint="Anchored to the right so the box stays inside the column." tabindex="0">at the edge</span>
      </div>
    </main></div></div>`,
};
