import { html } from "./helpers.js";

export default {
  title: "Components/Terminal",
  parameters: {
    docs: {
      description: {
        component:
          "A command and what it printed. The prompt mark is generated rather " +
          "than written into the text, so copying the command copies the " +
          "command and not a `$` the shell will refuse.",
      },
    },
  },
};

export const Session = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="term-cmd">composer docgen -- --diff v1.4.0</p>
        <pre class="term-out">Parsing 77 files…
Analyzed 542 symbols in 4.2s
Wrote build/docs (318 pages)</pre>
        <p class="term-exit tone-ok">exit 0</p>
      </div>
    </main></div></div>`,
};

export const Failure = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="term-cmd">vendor/bin/phpstan analyse --level 9</p>
        <pre class="term-out term-err">src/Query/QueryBuilder.php:88
  Method compile() should return string but returns string|null.</pre>
        <p class="term-exit tone-danger">exit 1</p>
      </div>
    </main></div></div>`,
};

export const Multiple = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="terminal">
        <p class="term-cmd">npm run check:contrast</p>
        <pre class="term-out">All 58 pairs meet their target.</pre>
        <p class="term-cmd">npm run build</p>
        <pre class="term-out">document-design.css    69.8 kB → min 48.9 kB</pre>
      </div>
    </main></div></div>`,
};
