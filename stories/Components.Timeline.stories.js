import { html } from "./helpers.js";

export default {
  title: "Components/Timeline",
  parameters: {
    docs: {
      description: {
        component:
          "What happened, in order. For a run: the steps it took, which one " +
          "failed, how long each took. The spine is drawn on the list rather " +
          "than per item, so a list of two does not grow a line with nothing to " +
          "join.",
      },
    },
  },
};

export const Run = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:640px">
      <h2>What the run did</h2>
      <ol class="timeline">
        <li class="tl-item tone-ok">
          <span class="tl-time">14:02:11</span>
          <p class="tl-title">Parsed the source</p>
          <p class="tl-note">77 files, 542 symbols, 4.2s</p>
        </li>
        <li class="tl-item tone-ok">
          <span class="tl-time">14:02:15</span>
          <p class="tl-title">Read the coverage report</p>
          <p class="tl-note">16 of 16 changed units covered</p>
        </li>
        <li class="tl-item tone-warn">
          <span class="tl-time">14:02:18</span>
          <p class="tl-title">Gate raised to 96</p>
          <p class="tl-note">One unit has no behaviour to test and is left uncovered on purpose.</p>
        </li>
        <li class="tl-item tone-danger">
          <span class="tl-time">14:03:40</span>
          <p class="tl-title">git fetch refused</p>
          <div class="terminal">
            <p class="term-cmd">git fetch origin main</p>
            <pre class="term-out term-err">fatal: could not read Username for 'https://github.com'</pre>
          </div>
          <p class="tl-note">Fell back to the GitHub git data API.</p>
        </li>
        <li class="tl-item is-open">
          <span class="tl-time">14:04:02</span>
          <p class="tl-title">CI pending</p>
          <p class="tl-note">Not confirmed in this run — an outline mark, so the reader can
             see where the run actually got to.</p>
        </li>
      </ol>
    </main></div></div>`,
};
