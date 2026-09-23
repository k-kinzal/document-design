import { html } from "./helpers.js";

export default {
  title: "Components/Notice",
  parameters: {
    docs: {
      description: {
        component:
          "Something about the page that the page itself cannot show. Toned " +
          "rather than variant-per-meaning; untoned it is a neutral aside, " +
          "which is what most of them are.",
      },
    },
  },
};

export const Tones = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="notice">
        <a href="#">812 statements</a> are lower bounds: a dependency, a cycle or a
        budget stopped the search, so the call may issue more than is listed.
      </div>
      <div class="notice tone-warn">
        <strong>Dynamic SQL.</strong> A value is spliced into the statement text
        instead of being bound. 709 statements are affected.
      </div>
      <div class="notice tone-danger">
        <strong>Followed to runtime input.</strong> The statement text cannot be
        determined from the source alone.
      </div>
      <div class="notice tone-ok">
        Every symbol in this package has a documented return type.
      </div>
    </main></div></div>`,
};

export const WithList = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="notice tone-warn">
        <strong>Three kinds are not supported</strong> and are held rather than counted:
        <ul>
          <li><code>BISON-RUNTIME-001</code> — the generated parser</li>
          <li><code>BISON-RUNTIME-002</code> — the scanner</li>
          <li><code>BISON-RUNTIME-003</code> — character encoding</li>
        </ul>
      </div>
    </main></div></div>`,
};
