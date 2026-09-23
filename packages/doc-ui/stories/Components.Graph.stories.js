import { html } from "./helpers.js";

export default {
  title: "Components/Graph",
  parameters: {
    docs: {
      description: {
        component:
          "Boxes and arrows: which layer may depend on which.\n\n" +
          "The layout is the generator's job — it knows the graph and can run a " +
          "proper ranking pass. What is here is what a drawn graph should look " +
          "like: the tokens, the weights, and the fact that a node is a link.\n\n" +
          "Edges are drawn **before** nodes in document order, so a node sits on " +
          "top of the lines that reach it; SVG has no z-index to fix it after.",
      },
    },
  },
};

/*
 * A row-per-rank layout, which is what a generator would emit. Nodes are
 * declared by their box; edges are drawn from the bottom edge of the parent to
 * the top edge of the child, so every arrow points down the ranks and the tip
 * lands on a border rather than inside a box.
 */
const H = 34;
const ROW = { 0: 8, 1: 92, 2: 176 };

const node = ({ x, y, w, label, cls = "node" }) => `
  <a href="#"><rect class="${cls}" x="${x}" y="${ROW[y]}" width="${w}" height="${H}" rx="7"/>
  <text x="${x + w / 2}" y="${ROW[y] + H / 2}">${label}</text></a>`;

const anchor = (n, side) => ({
  x: n.x + n.w / 2,
  y: side === "out" ? ROW[n.y] + H : ROW[n.y],
});

const edge = (from, to, cls = "edge") => {
  const a = anchor(from, "out");
  const b = anchor(to, "in");
  const bend = (b.y - a.y) / 2;
  return `
  <path class="${cls}" d="M ${a.x} ${a.y} C ${a.x} ${a.y + bend}, ${b.x} ${b.y - bend}, ${b.x} ${b.y - 4}"/>
  <circle class="edge-tip" cx="${b.x}" cy="${b.y - 2}" r="2.6"/>`;
};

const N = {
  ext:      { x: 320, y: 0, w: 180, label: "PhpStanExtension (12)" },
  rule:     { x: 330, y: 1, w: 160, label: "PhpStanRule (176)", cls: "node node-toned tone-indigo" },
  docgen:   { x: 40,  y: 1, w: 160, label: "DocGen (169)", cls: "node node-toned tone-blue" },
  installer:{ x: 620, y: 1, w: 160, label: "Installer (14)" },
  shared:   { x: 130, y: 2, w: 140, label: "Shared (33)" },
  doctest:  { x: 490, y: 2, w: 140, label: "Doctest (26)" },
  vendor:   { x: 660, y: 2, w: 140, label: "vendor", cls: "node node-outside" },
};

export const Layers = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <h2>Layers<a class="anchor" href="#">§</a></h2>
      <p class="section-description">Layers and allowed dependencies from <code>deptrac.yaml</code>.
        Layers without an arrow are dependency-free by rule.</p>

      <div class="graph-legend">
        <span><svg viewBox="0 0 28 8"><path class="edge" d="M1 4H27"/></svg> allowed</span>
        <span><svg viewBox="0 0 28 8"><path class="edge edge-dev" d="M1 4H27"/></svg> dev only</span>
        <span><svg viewBox="0 0 28 8"><path class="edge edge-weak" d="M1 4H27"/></svg> suggested</span>
        <span><svg viewBox="0 0 28 8"><path class="edge edge-bad" d="M1 4H27"/></svg> violates the rule</span>
      </div>

      <div class="graph-wrap">
        <svg class="graph" style="--dd-draw-width:820px" viewBox="0 0 820 250" role="img"
             aria-label="PhpStanExtension depends on PhpStanRule, which depends on Shared and Doctest. DocGen depends on Shared for development only. Installer suggests vendor. One violation: DocGen reaches Doctest.">
          ${edge(N.ext, N.rule)}
          ${edge(N.rule, N.shared)}
          ${edge(N.rule, N.doctest)}
          ${edge(N.docgen, N.shared, "edge edge-dev")}
          ${edge(N.installer, N.vendor, "edge edge-weak")}
          ${edge(N.docgen, N.doctest, "edge edge-bad")}

          ${Object.values(N).map(node).join("")}
        </svg>
      </div>

      <p class="muted">Hover a node: the whole box is a link, and the text is
        <code>pointer-events: none</code> so the pointer never falls between letters.</p>
    </main></div></div>`,
};

/** A node that carries identity takes a tone, like every other coloured thing
 *  in the system. Something outside the project is drawn but not claimed. */
export const NodeKinds = {
  render: () => html`
    <div class="doc"><div class="main"><main class="content">
      <div class="graph-wrap">
        <svg class="graph" style="--dd-draw-width:640px" viewBox="0 0 640 50" role="img" aria-label="Node variants">
          ${node({ x: 10, y: 0, w: 140, label: "plain" })}
          ${node({ x: 170, y: 0, w: 140, label: "toned", cls: "node node-toned tone-teal" })}
          ${node({ x: 330, y: 0, w: 140, label: "toned", cls: "node node-toned tone-violet" })}
          ${node({ x: 490, y: 0, w: 140, label: "outside", cls: "node node-outside" })}
        </svg>
      </div>
    </main></div></div>`,
};
