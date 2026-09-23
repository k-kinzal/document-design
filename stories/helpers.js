/*
 * Stories are written as HTML strings, because HTML strings are the thing
 * being documented. A story that built its specimen out of helper functions
 * would demonstrate the helpers, and the reader's job here is to copy the
 * markup into a generator.
 */
export function html(strings, ...values) {
  const markup = String.raw({ raw: strings }, ...values);
  const tpl = document.createElement("template");
  tpl.innerHTML = markup.trim();
  return tpl.content.childNodes.length === 1
    ? tpl.content.firstChild
    : tpl.content;
}

/** Wraps a specimen in a labelled strip. */
export function specimen(label, markup) {
  return `<div class="sb-specimen"><p class="sb-label">${label}</p>${markup}</div>`;
}

export const HUES = ["blue", "violet", "amber", "teal", "pink", "indigo", "slate"];
export const STATES = ["ok", "warn", "danger", "neutral"];
