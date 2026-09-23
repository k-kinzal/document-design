import { html } from "./helpers.js";

export default {
  title: "Components/Quote",
  parameters: {
    docs: {
      description: {
        component:
          "Someone else's words, or the page's own, lifted out. The pull " +
          "variant is quiet about being a quote — no marks, no italics — " +
          "because it is usually the page quoting itself.",
      },
    },
  },
};

export const Blockquote = {
  render: () => html`
    <article class="prose" style="padding:24px">
      <blockquote class="quote">
        <p>Layers without an arrow are dependency-free by rule.</p>
        <cite class="quote-source">deptrac.yaml</cite>
      </blockquote>
      <blockquote class="quote tone-warn">
        <p>The gate is set to 96 and no higher. The remaining unit has no behaviour
           to test.</p>
        <cite class="quote-source">README, on why coverage stops short of 100</cite>
      </blockquote>
    </article>`,
};

/** In a report: one line of the argument set large, so a reader skimming the
 *  page still collects the point. */
export const Pull = {
  render: () => html`
    <article class="sheet">
      <section class="sec" style="margin-top:0">
        <div class="label">02<br>Concept</div>
        <div class="field">
          <p class="note">Of nine uncovered units, eight were missing links from specifications to sources.</p>
          <blockquote class="quote pull">
            <p>The implementation was present. The specifications did not reference the sources.</p>
          </blockquote>
          <p class="note">The remaining unit is introductory prose with no behaviour to test. Leave it empty.</p>
        </div>
      </section>
    </article>`,
};
