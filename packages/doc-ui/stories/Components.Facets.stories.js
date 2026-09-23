import { html } from "./helpers.js";

export default {
  title: "Components/Facets",
  parameters: {
    docs: {
      description: {
        component:
          "Narrowing a long listing without leaving the page. Every facet " +
          "carries its count: a filter that turns out to match nothing is a " +
          "dead end the reader has to back out of, and a count on the control " +
          "means they never take it. Within a group facets are an OR; across " +
          "groups they are an AND.",
      },
    },
  },
};

const ROWS = [
  ["select", "ok", "blue", "SELECT", "SELECT * FROM {$}posts WHERE ID = %d"],
  ["select", "open", "blue", "SELECT", "SELECT option_value FROM {$}options WHERE option_name = %s"],
  ["update", "open", "violet", "UPDATE", "UPDATE {$}posts SET post_status = %s WHERE ID = %d"],
  ["insert", "ok", "teal", "INSERT", "INSERT INTO {$}postmeta (post_id, meta_key) VALUES (%d, %s)"],
  ["delete", "open", "pink", "DELETE", "DELETE FROM {$}postmeta WHERE post_id = %d"],
];

export const Faceted = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="facets" data-dd-facets="#listing">
        <input type="search" class="input" placeholder="Find a statement…" data-dd-facet-search>
        <div class="facet-group">
          ${[["select", "SELECT", 639, "blue"], ["update", "UPDATE", 44, "violet"], ["insert", "INSERT", 35, "teal"], ["delete", "DELETE", 28, "pink"]]
            .map(([v, label, n, tone]) =>
              `<button class="chip facet tone-${tone}" data-dd-facet="kind:${v}">${label}<span class="facet-count">${n}</span></button>`
            ).join("")}
        </div>
        <div class="facet-group">
          <button class="chip facet tone-ok" data-dd-facet="resolution:ok">resolved<span class="facet-count">35</span></button>
          <button class="chip facet tone-neutral" data-dd-facet="resolution:open">incomplete<span class="facet-count">809</span></button>
        </div>
        <button class="btn" data-dd-facet-clear>Clear</button>
        <span class="facet-shown"></span>
      </div>
      <ul class="rows" id="listing">
        ${ROWS.map(
          ([kind, res, tone, label, sql]) => `
          <li class="row" data-dd-kind="${kind}" data-dd-resolution="${res}">
            <a class="row-main" href="#">
              <span class="chip tone-${tone}">${label}</span>
              <span class="row-body">${sql}</span>
            </a>
          </li>`
        ).join("")}
      </ul>
    </main></div></div>`,
};
