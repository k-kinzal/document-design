import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,s as n}from"./iframe-fR7HCL7S.js";var r,i,a,o,s,c;function l(){return(l=e((()=>{n(),r={title:`Foundations/Cascade`,parameters:{docs:{description:{component:"How this system decides who wins — and why that lets the class names stay plain. This is a foundation, not a build detail: it is the reason `.chip` is called `.chip`."}}}},i={render:()=>t`
    <div class="definitions" style="max-width:720px">
      ${[[`dd.reset`,`box-sizing, margins, the focus ring, reduced motion`],[`dd.tokens`,`the palette, the roles, the scales, the theme switch`],[`dd.base`,`type, the tone modifiers, the skip link`],[`dd.layout`,`the two genres and the arrangements they share`],[`dd.component`,`everything with a name: chip, table, prose, diff…`],[`dd.utility`,`single-purpose overrides`],[`dd.print`,`last, so it beats anything a component says`]].map(([e,t])=>`<div><dt><code>${e}</code></dt><dd>${t}</dd></div>`).join(``)}
    </div>`},a={render:()=>t`
    <div>
      <style>
        /* unlayered — beats everything in @layer dd */
        .sb-override .chip { border-radius: 3px; font-weight: 400; letter-spacing: .04em; }
      </style>
      <p class="sb-label">as shipped</p>
      <div class="sb-row" style="margin-bottom:24px">
        <span class="chip tone-blue">SELECT</span>
        <span class="chip tone-teal">INSERT</span>
      </div>
      <p class="sb-label">with one unlayered rule</p>
      <div class="sb-row sb-override">
        <span class="chip tone-blue">SELECT</span>
        <span class="chip tone-teal">INSERT</span>
      </div>
    </div>`},o={render:()=>t`<div class="muted">See the description.</div>`},s={render:()=>t`
    <div>
      <style>.sb-teal { --dd-accent: var(--dd-teal); --dd-link: var(--dd-teal); }</style>
      <p class="sb-label">default</p>
      <div style="margin-bottom:24px">
        <div class="meter" style="max-width:320px"><span class="meter-part tone-accent" style="--dd-part:64%"></span></div>
        <a href="#">a link, and the accent</a>
      </div>
      <p class="sb-label">:root { --dd-accent: var(--dd-teal) }</p>
      <div class="sb-teal">
        <div class="meter" style="max-width:320px"><span class="meter-part tone-accent" style="--dd-part:64%"></span></div>
        <a href="#">a link, and the accent</a>
      </div>
    </div>`},c=[`Layers`,`Overriding`,`Inserting`,`Retheming`],i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:'{\n  render: () => html`\n    <div class="definitions" style="max-width:720px">\n      ${[["dd.reset", "box-sizing, margins, the focus ring, reduced motion"], ["dd.tokens", "the palette, the roles, the scales, the theme switch"], ["dd.base", "type, the tone modifiers, the skip link"], ["dd.layout", "the two genres and the arrangements they share"], ["dd.component", "everything with a name: chip, table, prose, diff…"], ["dd.utility", "single-purpose overrides"], ["dd.print", "last, so it beats anything a component says"]].map(([n, what]) => `<div><dt><code>${n}</code></dt><dd>${what}</dd></div>`).join("")}\n    </div>`\n}',...i.parameters?.docs?.source},description:{story:"Six sublayers, in this order. Later beats earlier, regardless of selector\nshape — which is why `.prose h2` (component) overrides `.doc h2` (layout)\nwithout either one having to know the other exists.\n\n```css\n@layer dd.reset, dd.tokens, dd.base, dd.layout,\n       dd.component, dd.utility, dd.print;\n```",...i.parameters?.docs?.description}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div>
      <style>
        /* unlayered — beats everything in @layer dd */
        .sb-override .chip { border-radius: 3px; font-weight: 400; letter-spacing: .04em; }
      </style>
      <p class="sb-label">as shipped</p>
      <div class="sb-row" style="margin-bottom:24px">
        <span class="chip tone-blue">SELECT</span>
        <span class="chip tone-teal">INSERT</span>
      </div>
      <p class="sb-label">with one unlayered rule</p>
      <div class="sb-row sb-override">
        <span class="chip tone-blue">SELECT</span>
        <span class="chip tone-teal">INSERT</span>
      </div>
    </div>\`
}`,...a.parameters?.docs?.source},description:{story:`Anything you write outside a layer beats everything in one, however
specific the layered selector is. That is the whole override story: no
\`!important\`, no specificity ladder, and no defensive prefix on the class
names to stay out of your way.

The chip below is restyled by a plain one-line rule that would lose to
\`.doc .card h2\` under ordinary specificity.`,...a.parameters?.docs?.description}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div class="muted">See the description.</div>\`
}`,...o.parameters?.docs?.source},description:{story:`To sit *between* two of the library's layers rather than above all of them,
insert a **sublayer of \`dd\`** and re-declare the complete order first.

\`\`\`css
@layer dd.reset, dd.tokens, dd.base, dd.layout,
       dd.mine, dd.component, dd.utility, dd.print;

@layer dd.mine {
  .chip { … }   ·  loses to dd.component, beats dd.layout
}
\`\`\`

Two things to get right, both easy to get wrong. A top-level \`mine\` declared
after \`dd\` outranks **everything** inside \`dd\`, sublayers included — it
cannot sit between two of them, only above all of them. And the list must
name every existing sublayer: declaring a partial list reorders the ones
left out, because they are then first created wherever they happen to be
used.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div>
      <style>.sb-teal { --dd-accent: var(--dd-teal); --dd-link: var(--dd-teal); }</style>
      <p class="sb-label">default</p>
      <div style="margin-bottom:24px">
        <div class="meter" style="max-width:320px"><span class="meter-part tone-accent" style="--dd-part:64%"></span></div>
        <a href="#">a link, and the accent</a>
      </div>
      <p class="sb-label">:root { --dd-accent: var(--dd-teal) }</p>
      <div class="sb-teal">
        <div class="meter" style="max-width:320px"><span class="meter-part tone-accent" style="--dd-part:64%"></span></div>
        <a href="#">a link, and the accent</a>
      </div>
    </div>\`
}`,...s.parameters?.docs?.source},description:{story:"Custom properties are the exception, and the reason they carry `--dd-`.\n\nA custom property inherits through the whole document. Neither `@layer` nor\n`@scope` contains one, so `--bg` declared here and `--bg` declared by you\nwould be the same property, and whichever won the cascade would decide for\nboth. They are also the theming API, and an API wants a name that stays out\nof the way.\n\nRetheming is therefore a `:root` rule, not an override:\n\n```css\n:root { --dd-accent: var(--dd-teal); }\n```",...s.parameters?.docs?.description}}}})))()}l();export{o as Inserting,i as Layers,a as Overriding,s as Retheming,c as __namedExportsOrder,r as default};