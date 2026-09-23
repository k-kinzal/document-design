# Graph example data

`graph-examples.js` stores fixed observations from the project’s supplied
documents. No build reads an external file or fetches data. The doc-site package
owns a separate HTML specimen copy for its standalone documentation build.

- WordPress SQL catalog, `tables/cache-data.html`: six callers of
  `{$}cache_data`. `MySQL::save` contains eight statements; `__construct`,
  `load`, `mtime`, `touch`, and `unlink` contain one each. Total: 13.
- Statement source lines in `wp-includes/SimplePie/src/Cache/MySQL.php`:
  90, 120, 135, 142, 146, 156, 204, 208, 216, 240, 297, 317, 335.
  The cumulative step plot increments at these positions, not at invented
  timestamps. The histogram counts callers in inclusive bins 1–2, 3–4,
  5–6, 7–8: 5, 0, 0, 1 callers. Bin widths and axis limits are presentation
  choices; the underlying observations are unchanged.
- The catalog’s 844-statement analysis reports zero statements fully traced
  to runtime input. Runtime execution counts are not measured. The zero/unknown
  specimen intentionally compares data availability, not the magnitudes of
  those different measures.
- The bison-parser 3.8.2 report dated 2026-02-11 records source coverage
  20/29 (68.97%) before and 29/30 (96.67%) after: +27.70 percentage points,
  with a changed denominator. It reports no intermediate measurements. The
  missing-interval specimen is categorical (before/during/after), not elapsed
  time, and draws no line between the snapshots.
- The decision diagram illustrates doc-ui’s documented reading modes; its
  arrows indicate a choice of layout, not an execution trace.

SHA-256 identifiers of the supplied files:

| File | SHA-256 |
| --- | --- |
| `wordpress-sql-catalog/index.html` | `2348db595ce2e016269e295f6f21333438382a3f052531f3e1a9ad5166fab647` |
| `wordpress-sql-catalog/tables/cache-data.html` | `94bfe1007d0e5641dc6a36a64e742ca58d1039cf3ad568b8f58f79036813b9d1` |
| `rpt_2f13da82c39248859bc8.html` | `f2db0e1382ad378649fc32354d7f83103997dba6d8fd23fdb7a926be93b40444` |
