import { html, HUES, STATES } from "./helpers.js";

export default {
  title: "Foundations/Tone",
  parameters: {
    docs: {
      description: {
        component:
          "One modifier system, read by every component that carries colour. " +
          "A tone sets two custom properties and nothing else, which is what " +
          "makes it orthogonal: the same `.tone-teal` works on a chip, a bar " +
          "segment, a notice and a marker.",
      },
    },
  },
};

const ALL = [...HUES, ...STATES];

/**
 * The same tone across four components. Adding a component means reading
 * `--dd-tone` and `--dd-tone-tint`; it then has every tone without anyone
 * writing a colour rule for it.
 */
export const Orthogonal = {
  render: () => html`
    <table class="plain">
      <thead>
        <tr><th>tone</th><th>chip</th><th>ghost</th><th>notice</th><th>meter</th></tr>
      </thead>
      <tbody>
        ${ALL.map(
          (t) => `
          <tr>
            <td><code>.tone-${t}</code></td>
            <td><span class="chip tone-${t}">${t}</span></td>
            <td><span class="chip chip-ghost tone-${t}">${t}</span></td>
            <td style="min-width:180px"><div class="notice tone-${t}" style="margin:0">A line about it.</div></td>
            <td style="min-width:120px">
              <div class="meter" style="margin:0">
                <span class="meter-part tone-${t}" style="--dd-part:60%"></span>
              </div>
            </td>
          </tr>`
        ).join("")}
      </tbody>
    </table>`,
};

/**
 * A project keeps its own vocabulary by aliasing, in one line each. This is
 * how the SQL catalog gets `.k-select` and the API reference gets `.k-class`
 * without either of them restating how a chip is tinted.
 *
 * ```css
 * .k-select { --dd-tone: var(--dd-blue); --dd-tone-tint: var(--dd-blue-tint); }
 * .k-insert { --dd-tone: var(--dd-teal); --dd-tone-tint: var(--dd-teal-tint); }
 * ```
 */
export const Aliasing = {
  render: () => {
    const node = html`
      <div>
        <style>
          .k-select { --dd-tone: var(--dd-blue);   --dd-tone-tint: var(--dd-blue-tint); }
          .k-insert { --dd-tone: var(--dd-teal);   --dd-tone-tint: var(--dd-teal-tint); }
          .k-update { --dd-tone: var(--dd-violet); --dd-tone-tint: var(--dd-violet-tint); }
          .k-delete { --dd-tone: var(--dd-pink);   --dd-tone-tint: var(--dd-pink-tint); }
          .k-schema { --dd-tone: var(--dd-indigo); --dd-tone-tint: var(--dd-indigo-tint); }
        </style>
        <div class="sb-row">
          <span class="chip k-select">SELECT</span>
          <span class="chip k-insert">INSERT</span>
          <span class="chip k-update">UPDATE</span>
          <span class="chip k-delete">DELETE</span>
          <span class="chip k-schema">ALTER</span>
        </div>
      </div>`;
    return node;
  },
};
