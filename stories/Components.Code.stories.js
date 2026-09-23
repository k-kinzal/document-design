import { html, specimen } from "./helpers.js";

export default {
  title: "Components/Code",
  parameters: {
    docs: {
      description: {
        component:
          "Wrapped rather than scrolled by default: a generated statement is " +
          "often one very long line, and a reader who has to scroll sideways to " +
          "find the end of a WHERE clause will not do it.",
      },
    },
  },
};

const SQL = `<span class="tok-kw">SELECT</span> <span class="tok-id">p</span>.* <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span> <span class="tok-id">p</span>
<span class="tok-kw">WHERE</span> <span class="tok-id">p</span>.<span class="tok-id">post_status</span> = <span class="tok-str">'publish'</span>
  <span class="tok-kw">AND</span> <span class="tok-id">p</span>.<span class="tok-id">post_type</span> = <span class="tok-ph">%s</span>
<span class="tok-kw">ORDER BY</span> <span class="tok-id">p</span>.<span class="tok-id">post_date</span> <span class="tok-kw">DESC</span> <span class="tok-kw">LIMIT</span> <span class="tok-num">10</span>`;

export const Block = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="code-block">
        <pre class="code">${SQL}</pre>
        <button class="btn copy" data-dd-copy>Copy</button>
      </div>
    </main></div></div>`,
};

/** The statement as the subject of the page rather than as an example. */
export const Lead = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="code-block">
        <pre class="code code-lead">${SQL}</pre>
        <button class="btn copy" data-dd-copy>Copy</button>
      </div>
    </main></div></div>`,
};

/**
 * A hole is a claim about the analysis, not about the code, so it is marked
 * rather than merely written — and carries a title saying where it came from.
 * Tone picks which kind of gap it is.
 */
export const Holes = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code"><span class="tok-kw">SELECT</span> * <span class="tok-kw">FROM</span> <span class="tok-id">{$}posts</span> <span class="tok-kw">WHERE</span> <span class="tok-id">ID</span> <span class="tok-kw">IN</span> (<span class="hole" title="A dependency the analyzer does not model was reached.">…unresolved</span>)
  <span class="tok-kw">AND</span> <span class="tok-id">post_author</span> = <span class="hole tone-danger" title="Followed to runtime input; the text cannot be fixed.">…external</span>
  <span class="tok-kw">AND</span> <span class="tok-id">post_type</span> = <span class="hole tone-neutral" title="The call was found but never examined.">…not analyzed</span></pre>
      <div class="sb-row" style="margin-top:12px">
        <span class="hole">warn — a gap the analysis knows about</span>
        <span class="hole tone-danger">danger — it cannot be closed</span>
        <span class="hole tone-neutral">neutral — nobody looked</span>
      </div>
    </main></div></div>`,
};

export const Variants = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      ${specimen("pre.code — wrapped (default)", `<pre class="code">${SQL}</pre>`)}
      ${specimen(
        "pre.code-scroll — where line structure is the point",
        `<pre class="code code-scroll">${SQL}</pre>`
      )}
      ${specimen(
        "with line numbers",
        `<pre class="code code-scroll"><span class="src-line"><span class="ln">1238</span>  public function query( $query ) {</span>
<span class="src-line is-target"><span class="ln">1240</span>      $this->result = $this->dbh->query( $query );</span>
<span class="src-line"><span class="ln">1241</span>  }</span></pre>`
      )}
      ${specimen(
        "details.as-written — the raw form, if wanted",
        `<details class="as-written"><summary>As written in source</summary>
           <pre class="code">"SELECT * FROM {$wpdb->posts} WHERE post_status = %s"</pre>
         </details>`
      )}
    </main></div></div>`,
};

/** Syntax reuses identity hues at text weight only, and never red — so the one
 *  red on a page always means something wants looking at. */
export const SyntaxTokens = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <pre class="code"><span class="tok-kw">.tok-kw</span>  keyword
<span class="tok-str">.tok-str</span> string
<span class="tok-num">.tok-num</span> number
<span class="tok-com">.tok-com</span> comment
<span class="tok-var">.tok-var</span> variable
<span class="tok-ph">.tok-ph</span>  placeholder
<span class="tok-id">.tok-id</span>  identifier</pre>
    </main></div></div>`,
};
