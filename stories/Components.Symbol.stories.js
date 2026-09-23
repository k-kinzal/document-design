import { html } from "./helpers.js";

export default {
  title: "Components/Symbol",
  parameters: {
    docs: {
      description: {
        component:
          "A declared thing and its members — the shape an API reference is " +
          "made of. A signature is read for its shape, so it is not wrapped: " +
          "the indentation of a long parameter list is what makes it legible.",
      },
    },
  },
};

export const Head = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="symbol-head">
        <h1><code>QueryBuilder</code><span class="chip tone-violet">interface</span></h1>
        <p class="symbol-meta">Ztd\\Query\\QueryBuilder · src/Query/QueryBuilder.php</p>
      </div>
      <p class="lede">Builds a statement from a set of conditions. Implementations decide
        how a condition becomes SQL; the analysis follows whichever one the call site names.</p>
      <pre class="signature"><span class="t-key">interface</span> <span class="sig-name">QueryBuilder</span>
{
    <span class="t-key">public function</span> <span class="sig-name">where</span>(<span class="t-name">string</span> <span class="sig-param">$column</span>, <span class="t-name">mixed</span> <span class="sig-param">$value</span>): <span class="t-key">static</span>;
    <span class="t-key">public function</span> <span class="sig-name">build</span>(): <span class="t-name">Statement</span>;
}</pre>
    </main></div></div>`,
};

/** A member that is not part of the surface is dimmed rather than hidden: a
 *  reader working out why a public method behaves as it does still needs to
 *  see that a private one exists. */
export const Members = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <h2>Methods</h2>

      <section class="member">
        <div class="member-head">
          <h3 id="m-where"><code>where()</code><span class="chip chip-sm tone-ok">public</span>
            <a class="anchor" href="#m-where">§</a></h3>
          <span class="member-meta">src/Query/QueryBuilder.php:24</span>
        </div>
        <div class="member-body">
          <p class="member-sig"><span class="t-key">public function</span> where(<span class="t-name">string</span> <span class="sig-param">$column</span>, <span class="t-name">mixed</span> <span class="sig-param">$value</span>): <span class="t-key">static</span></p>
          <p>Adds an equality condition. The value is bound, never spliced.</p>
          <div class="table-wrap">
            <table class="param-table">
              <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td>$column</td><td><span class="t-name">string</span></td><td>Column name, quoted by the driver.</td></tr>
                <tr><td>$value</td><td><span class="t-name">mixed</span></td><td>Bound as a parameter.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="example">
            <p class="example-title">Example</p>
            <pre class="code"><span class="tok-var">$q</span>-&gt;<span class="tok-id">where</span>(<span class="tok-str">'post_status'</span>, <span class="tok-str">'publish'</span>)-&gt;<span class="tok-id">build</span>();</pre>
            <p class="example-output">SELECT * FROM posts WHERE post_status = ?</p>
          </div>
        </div>
      </section>

      <section class="member private-surface">
        <div class="member-head">
          <h3 id="m-compile"><code>compile()</code><span class="chip chip-sm">private</span>
            <a class="anchor" href="#m-compile">§</a></h3>
          <span class="member-meta">src/Query/QueryBuilder.php:88</span>
        </div>
        <div class="member-body">
          <p class="member-sig"><span class="t-key">private function</span> compile(<span class="t-name">array</span> <span class="sig-param">$conditions</span>): <span class="t-name">string</span></p>
          <p>Joins the conditions. Not part of the surface; shown because the
             analysis follows it.</p>
        </div>
      </section>
    </main></div></div>`,
};

/** Type names are identity, so they take identity hues and never red. */
export const Types = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <pre class="signature"><span class="t-key">public function</span> <span class="sig-name">find</span>(
    <span class="t-name">Statement</span>|<span class="t-key">null</span> <span class="sig-param">$statement</span>,
    <span class="t-name">array</span>&lt;<span class="t-name">string</span>, <span class="t-gen">mixed</span>&gt; <span class="sig-param">$bindings</span> = [],
    <span class="t-lit">'strict'</span>|<span class="t-lit">'loose'</span> <span class="sig-param">$mode</span> = <span class="t-lit">'strict'</span>,
    <span class="t-alias">ResolutionSet</span> <span class="sig-param">$only</span> = <span class="t-alias">ResolutionSet</span>::All,
): <span class="t-name">Result</span></pre>
      <div class="sb-row">
        <span class="mono t-name">.t-name</span><span class="mono t-key">.t-key</span>
        <span class="mono t-lit">.t-lit</span><span class="mono t-gen">.t-gen</span>
        <span class="mono t-alias">.t-alias</span><span class="mono t-var">.t-var</span>
      </div>
    </main></div></div>`,
};
