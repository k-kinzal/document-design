import { html } from "./helpers.js";

export default {
  title: "Components/Tree",
  parameters: {
    docs: {
      description: {
        component:
          "A hierarchy you navigate: namespaces, packages, layers.\n\n" +
          "Built on `<details>`, so a branch opens with no JavaScript, keeps its " +
          "state in the DOM, and is reachable by keyboard because `<summary>` " +
          "already is. A tree built from divs and a click handler has to " +
          "re-earn all three.",
      },
    },
  },
};

export const Namespaces = {
  render: () => html`
    <div class="doc">
      <nav class="sidebar">
        <div class="sb-block">
          <p class="sb-title">Namespaces</p>
          <ul class="tree tree-mono">
            <li>
              <details open>
                <summary><span>PhpAiToolkit</span><span class="tree-count">542</span></summary>
                <ul>
                  <li>
                    <details open class="is-current">
                      <summary><span>DocGen</span><span class="tree-count">169</span></summary>
                      <ul>
                        <li class="is-current"><a href="#">Analysis</a><span class="tree-count">88</span></li>
                        <li><a href="#">Render</a><span class="tree-count">41</span></li>
                        <li><a href="#">Cli</a><span class="tree-count">12</span></li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <details>
                      <summary><span>PhpStan</span><span class="tree-count">203</span></summary>
                      <ul>
                        <li><a href="#">ErrorFormatter</a><span class="tree-count">9</span></li>
                        <li><a href="#">Rule</a><span class="tree-count">176</span></li>
                      </ul>
                    </details>
                  </li>
                  <li><a href="#">Doctest</a><span class="tree-count">26</span></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </nav>
      <div class="main"><main class="content">
        <h1>Analysis</h1>
        <p class="lede">The tree on the left keeps its open branches in the DOM, so the
           page prints with exactly what the reader had expanded.</p>
      </main></div>
    </div>`,
};

export const InContent = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content" style="max-width:520px">
      <h2>Layers</h2>
      <ul class="tree">
        <li>
          <details open>
            <summary><span>PhpStanExtension</span><span class="tree-count">12</span></summary>
            <ul>
              <li>
                <details open>
                  <summary><span>PhpStanRule</span><span class="tree-count">176</span></summary>
                  <ul>
                    <li><a href="#">Shared</a><span class="tree-count">33</span></li>
                    <li><a href="#">Doctest</a><span class="tree-count">26</span></li>
                  </ul>
                </details>
              </li>
              <li><a href="#">PhpStanErrorFormatter</a><span class="tree-count">9</span></li>
            </ul>
          </details>
        </li>
      </ul>
    </main></div></div>`,
};
