import "../src/index.css";
import "./storybook.css";
import { ensureBehaviour } from "./behaviour";
import { drawDefs } from "../stories/helpers";

/*
 * The arrowhead marker, once for the whole preview document.
 *
 * `.draw-arrow` sets `marker-end: url(#dd-arrow)`, and a reference that
 * resolves to nothing is not an error in SVG: the line simply ends. In a real
 * document the block goes in the page shell, which is what doc-site does. Here
 * the shell is the preview iframe, so it goes in once rather than in every
 * story that happens to draw an arrow — a story that forgot it would show a
 * headless arrow and report nothing.
 */
function ensureDrawDefs() {
  if (document.getElementById("dd-arrow")) return;
  const host = document.createElement("div");
  host.innerHTML = drawDefs;
  document.body.prepend(host.firstElementChild);
}

/*
 * The global is `ddTheme`, not `theme`: Storybook 10 ships a built-in global
 * called `theme` for the manager's own light/dark chrome, and a second
 * declaration under that name is swallowed rather than added to the toolbar.
 */
export default {
  globalTypes: {
    ddTheme: {
      description: "Colour scheme the document is rendered in",
      toolbar: {
        title: "Document",
        icon: "circlehollow",
        items: [
          { value: "auto", title: "Auto (system)" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: { ddTheme: "auto" },

  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "Getting started",
          "Foundations",
          [
            "Principles",
            "Colour", "Type", "Space", "Surface", "Grid",
            "Tone", "Cascade", "Accessibility",
          ],
          "Layouts",
          "Components",
          "Examples",
        ],
      },
    },
    docs: { toc: true },
    backgrounds: { disable: true },
    controls: { disable: true },
  },

  decorators: [
    (story, context) => {
      const theme = context.globals.ddTheme || "auto";

      /*
       * The toolbar owns the theme; the behaviour layer is told, not guessed at.
       *
       * document-design.js keeps the current theme in memory and reapplies it
       * on every start, and Storybook restarts it on every story. So writing
       * localStorage and setting the attribute behind its back does not hold:
       * the next render reapplies the cached value and the toolbar appears
       * dead. Its exported applyTheme() updates that cache, which is the
       * supported way in. Storage is still written so a reload keeps the
       * choice, and the attribute is set directly when the layer is absent.
       */
      try {
        if (theme === "auto") window.localStorage.removeItem("dd-theme");
        else window.localStorage.setItem("dd-theme", theme);
      } catch (e) { /* storage unavailable; applyTheme below still holds */ }

      /* Set synchronously as well, so anything a story schedules in its own
         frame already sees the right theme rather than the previous one. */
      const root = document.documentElement;
      if (theme === "auto") root.removeAttribute("data-dd-theme");
      else root.setAttribute("data-dd-theme", theme);

      const node = story();

      /*
       * After the next frame, not now: a decorator *returns* its node and
       * Storybook appends it afterwards, so anything that queries the DOM at
       * this point queries a document the story is not in yet. Started here
       * directly, every initializer that binds by selector — sort, filter,
       * facets, tabs, the table of contents — found nothing and silently did
       * nothing, while the document-level delegates kept working and hid it.
       */
      requestAnimationFrame(() => {
        ensureDrawDefs();
        ensureBehaviour();
        if (window.documentDesign) {
          window.documentDesign.applyTheme(theme);
        } else {
          const root = document.documentElement;
          if (theme === "auto") root.removeAttribute("data-dd-theme");
          else root.setAttribute("data-dd-theme", theme);
        }
      });

      return node;
    },
  ],
};
