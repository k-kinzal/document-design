import "../src/index.css";
import "./storybook.css";
import { ensureBehaviour } from "./behaviour";

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
       * The toolbar and the behaviour layer both own the theme, so they are
       * made to agree rather than left to race.
       *
       * document-design.js reads its stored preference on every start, and
       * Storybook restarts it on every story — so setting the attribute and
       * then starting the layer means the layer immediately resets it to
       * whatever localStorage says, which is "auto" on a fresh profile. The
       * toolbar appeared to do nothing.
       *
       * Writing the choice to the same key the layer reads, before starting
       * it, makes the layer arrive at the toolbar's answer by itself. The
       * attribute is then set directly as well, for the case where the
       * behaviour layer is not loaded at all.
       */
      try {
        if (theme === "auto") window.localStorage.removeItem("dd-theme");
        else window.localStorage.setItem("dd-theme", theme);
      } catch (e) { /* storage unavailable; the direct set below still holds */ }

      const node = story();

      /*
       * After the next frame, not now: a decorator *returns* its node and
       * Storybook appends it afterwards, so anything that queries the DOM at
       * this point queries a document the story is not in yet. Started here
       * directly, every initializer that binds by selector — sort, filter,
       * facets, tabs, the table of contents — found nothing and silently did
       * nothing, while the document-level delegates (theme, copy, nav) kept
       * working and hid it.
       */
      requestAnimationFrame(ensureBehaviour);

      const root = document.documentElement;
      if (theme === "auto") root.removeAttribute("data-dd-theme");
      else root.setAttribute("data-dd-theme", theme);

      return node;
    },
  ],
};
