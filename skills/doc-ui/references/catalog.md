# Catalogs and API documentation

Use `.doc` when readers find an item among many. A `.sidebar` is optional;
`.main > .content` holds the document. Keep each record's full content reachable
from its listing preview.

```html
<div class="doc" lang="en">
  <nav class="sidebar" aria-label="Catalog">
    <div class="sidebar-header"><a class="sidebar-site" href="./index.html">SQL catalog</a></div>
    <ul class="sidebar-list">
      <li class="is-active"><a href="#statements" aria-current="page">Statements</a></li>
    </ul>
  </nav>
  <div class="main">
    <main class="content" id="statements">
      <h1>Statements</h1>
      <p class="lede">Browse the SQL emitted by the project.</p>
      <p class="listing-range">Showing 1 of 844 WordPress statements.</p>
      <ul class="rows" data-dd-defer>
        <li class="row">
          <a class="row-main" href="#statement-detail">
            <span class="chip tone-blue">SELECT</span>
            <span class="row-body">get_posts</span>
          </a>
          <div class="row-meta">wp-includes/post.php</div>
        </li>
      </ul>
      <section id="statement-detail">
        <h2>get_posts</h2>
        <p>Reads posts matching the requested query.</p>
      </section>
    </main>
  </div>
</div>
```

- Always supply `.listing-range`: shown count, total, and the scope of search
  or facets. Recompute these from the data and active filters; CSS does not
  calculate counts. Distinguish a sample or page from the complete dataset.
- `.rows` with `.row-main`, `.row-body`, and `.row-meta` handles variable-length
  previews; `.items` tables suit short symbol summaries. For full API entries,
  reuse `.symbol-head`, `pre.signature`, `.member`, `.definitions`, `.code`, and
  `.prose` as needed.
- Keep category hues (`.tone-blue`, `.tone-violet`, etc.) distinct from state
  (`.tone-warn`, unresolved information). Red is not a syntax or category color.
- `data-dd-defer` on a long list defers off-screen rendering without removing
  records. Pagination still needs real links and explicit range text.

For optional interaction, load the matching classic `document-design.js`.
`data-dd-filter="#record-list"` filters local children; a facets bar uses
`data-dd-facets="#record-list"`. Read the matching behavior example before
adding item metadata. `data-dd-search` is a separate search interface requiring
search data and a results panel; an input alone does not build a search index.
Hide JavaScript-only controls with `data-dd-enhance hidden`, not their content.

Verify a short and a very long record, narrow navigation, no-result states,
and the page with JavaScript disabled. Print should expose filtered rows,
closed details, and inactive tabs.

Source examples: `packages/doc-ui/stories/Examples.SqlCatalog.stories.js`,
`packages/doc-ui/stories/Examples.ApiReference.stories.js`, and
`packages/doc-ui/src/js/document-design.js`.
