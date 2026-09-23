import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),r={title:`Components/Graph`,parameters:{docs:{description:{component:`Boxes and arrows: which layer may depend on which.

The layout is the generator's job — it knows the graph and can run a proper ranking pass. What is here is what a drawn graph should look like: the tokens, the weights, and the fact that a node is a link.

Edges are drawn **before** nodes in document order, so a node sits on top of the lines that reach it; SVG has no z-index to fix it after.`}}}},i=34,a={0:8,1:92,2:176},o=({x:e,y:t,w:n,label:r,cls:o=`node`})=>`
  <a href="#"><rect class="${o}" x="${e}" y="${a[t]}" width="${n}" height="${i}" rx="7"/>
  <text x="${e+n/2}" y="${a[t]+i/2}">${r}</text></a>`,s=(e,t)=>({x:e.x+e.w/2,y:t===`out`?a[e.y]+i:a[e.y]}),c=(e,t,n=`edge`)=>{let r=s(e,`out`),i=s(t,`in`),a=(i.y-r.y)/2;return`
  <path class="${n}" d="M ${r.x} ${r.y} C ${r.x} ${r.y+a}, ${i.x} ${i.y-a}, ${i.x} ${i.y-4}"/>
  <circle class="edge-tip" cx="${i.x}" cy="${i.y-2}" r="2.6"/>`},l={ext:{x:320,y:0,w:180,label:`PhpStanExtension (12)`},rule:{x:330,y:1,w:160,label:`PhpStanRule (176)`,cls:`node node-toned tone-indigo`},docgen:{x:40,y:1,w:160,label:`DocGen (169)`,cls:`node node-toned tone-blue`},installer:{x:620,y:1,w:160,label:`Installer (14)`},shared:{x:130,y:2,w:140,label:`Shared (33)`},doctest:{x:490,y:2,w:140,label:`Doctest (26)`},vendor:{x:660,y:2,w:140,label:`vendor`,cls:`node node-outside`}},u={render:()=>t`
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
          ${c(l.ext,l.rule)}
          ${c(l.rule,l.shared)}
          ${c(l.rule,l.doctest)}
          ${c(l.docgen,l.shared,`edge edge-dev`)}
          ${c(l.installer,l.vendor,`edge edge-weak`)}
          ${c(l.docgen,l.doctest,`edge edge-bad`)}

          ${Object.values(l).map(o).join(``)}
        </svg>
      </div>

      <p class="muted">Hover a node: the whole box is a link, and the text is
        <code>pointer-events: none</code> so the pointer never falls between letters.</p>
    </main></div></div>`},d={render:()=>t`
    <div class="doc"><div class="main"><main class="content">
      <div class="graph-wrap">
        <svg class="graph" style="--dd-draw-width:640px" viewBox="0 0 640 50" role="img" aria-label="Node variants">
          ${o({x:10,y:0,w:140,label:`plain`})}
          ${o({x:170,y:0,w:140,label:`toned`,cls:`node node-toned tone-teal`})}
          ${o({x:330,y:0,w:140,label:`toned`,cls:`node node-toned tone-violet`})}
          ${o({x:490,y:0,w:140,label:`outside`,cls:`node node-outside`})}
        </svg>
      </div>
    </main></div></div>`},f=[`Layers`,`NodeKinds`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`
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
          \${edge(N.ext, N.rule)}
          \${edge(N.rule, N.shared)}
          \${edge(N.rule, N.doctest)}
          \${edge(N.docgen, N.shared, "edge edge-dev")}
          \${edge(N.installer, N.vendor, "edge edge-weak")}
          \${edge(N.docgen, N.doctest, "edge edge-bad")}

          \${Object.values(N).map(node).join("")}
        </svg>
      </div>

      <p class="muted">Hover a node: the whole box is a link, and the text is
        <code>pointer-events: none</code> so the pointer never falls between letters.</p>
    </main></div></div>\`
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div class="doc"><div class="main"><main class="content">
      <div class="graph-wrap">
        <svg class="graph" style="--dd-draw-width:640px" viewBox="0 0 640 50" role="img" aria-label="Node variants">
          \${node({
    x: 10,
    y: 0,
    w: 140,
    label: "plain"
  })}
          \${node({
    x: 170,
    y: 0,
    w: 140,
    label: "toned",
    cls: "node node-toned tone-teal"
  })}
          \${node({
    x: 330,
    y: 0,
    w: 140,
    label: "toned",
    cls: "node node-toned tone-violet"
  })}
          \${node({
    x: 490,
    y: 0,
    w: 140,
    label: "outside",
    cls: "node node-outside"
  })}
        </svg>
      </div>
    </main></div></div>\`
}`,...d.parameters?.docs?.source},description:{story:`A node that carries identity takes a tone, like every other coloured thing
 in the system. Something outside the project is drawn but not claimed.`,...d.parameters?.docs?.description}}}})))()}p();export{u as Layers,d as NodeKinds,f as __namedExportsOrder,r as default};