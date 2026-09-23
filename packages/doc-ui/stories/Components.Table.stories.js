import { html } from "./helpers.js";

export default {
  title: "Components/Table",
};

const ROWS = [
  ["dynamic-sql", "warn", "medium", 709, "A value is spliced into the statement text instead of being bound."],
  ["analysis-incomplete", "neutral", "low", 239, "A cycle or an analysis budget stopped the search before it closed."],
  ["unresolved-sql", "neutral", "low", 25, "The statement text could not be reconstructed at all."],
  ["call-not-analyzed", "neutral", "low", 5, "A call that carries a statement was found but never examined."],
];

const body = ROWS.map(
  ([rule, tone, sev, n, what]) => `
  <tr>
    <td class="tight"><a class="mono" href="#">${rule}</a></td>
    <td class="tight"><span class="chip tone-${tone}">${sev}</span></td>
    <td class="num">${n}</td>
    <td>${what}</td>
  </tr>`
).join("");

/** Numbers line up on the right in tabular figures, so they can be compared
 *  down the column rather than read one at a time. */
export const Default = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Rule</th><th class="tight">Severity</th><th class="num">Statements</th><th>What it reports</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </main></div></div>`,
};

/** Click or press Enter on a header. Numeric columns sort numerically, so "9"
 *  sorts under "10" rather than after it. */
export const Sortable = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <input type="search" class="input input-block" placeholder="Filter rules…" data-dd-filter="#rules">
      <div class="table-wrap">
        <table class="sortable" data-dd-sortable>
          <thead><tr>
            <th data-dd-sort>Rule</th>
            <th class="tight" data-dd-sort>Severity</th>
            <th class="num" data-dd-sort>Statements</th>
            <th>What it reports</th>
          </tr></thead>
          <tbody id="rules">${body}</tbody>
        </table>
      </div>
    </main></div></div>`,
};

/** `.plain` for a table that is a layout rather than a comparison. */
export const Plain = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="table-wrap">
        <table class="plain">
          <tr><td><a href="#">k-kinzal/php-ai-toolkit</a></td><td class="num">542</td><td class="item-summary">PHPStan rules, PHPUnit reporters, config templates</td></tr>
          <tr><td><a href="#">k-kinzal/ztd-query</a></td><td class="num">318</td><td class="item-summary">Static SQL extraction for PHP</td></tr>
        </table>
      </div>
    </main></div></div>`,
};
