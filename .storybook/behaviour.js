/*
 * Loads the published behaviour layer into the preview frame and re-runs it
 * whenever a story renders. The file is taken as-is — the same classic script
 * consumers drop in — so that what Storybook demonstrates is the thing that
 * ships, not a module-shaped copy of it.
 */
import src from "../src/js/document-design.js?raw";

let loaded = false;

export function ensureBehaviour() {
  if (!loaded) {
    const el = document.createElement("script");
    el.textContent = src;
    document.head.appendChild(el);
    loaded = true;
    return;
  }
  if (window.documentDesign) {
    /* Attribute-bound listeners are per element, so a re-render needs a
       refresh; the document-level delegates are idempotent enough that a
       second pass costs nothing. */
    window.documentDesign.refresh();
  }
}
