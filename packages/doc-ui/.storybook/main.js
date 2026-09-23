import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import { licenseNotices } from "./licenses.mjs";

/** @type {import('@storybook/html-vite').StorybookConfig} */
export default {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.js"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/html-vite", options: {} },
  core: { disableTelemetry: true },

  viteFinal(config) {
    /*
     * Lightning CSS here too, not just in the build. Vite's default CSS path
     * uses postcss-import, which resolves `@import url(…) layer(name)` by
     * dropping the layer — so the cascade the stylesheet is designed around
     * would exist in the published file and not in Storybook, and every
     * override question would get a different answer in the two places.
     */
    config.css = {
      ...config.css,
      transformer: "lightningcss",
      lightningcss: {
        targets: browserslistToTargets(browserslist("> 0.3%, last 3 years, not dead")),
      },
    };
    config.build = {
      ...config.build,
      cssMinify: "lightningcss",
      license: { fileName: "third-party-licenses.json" },
    };
    config.plugins = [...(config.plugins ?? []), licenseNotices()];
    return config;
  },
};
