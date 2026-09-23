import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./react-BXJ34t_g.js";import{a as r}from"./chunk-W22LQPXL-Bh9L8lFD.js";import{a as i,o as a}from"./blocks-DBNOqzP_.js";function o(e){let n={code:`code`,h1:`h1`,h2:`h2`,hr:`hr`,p:`p`,pre:`pre`,strong:`strong`,...t(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Getting started`}),`
`,(0,c.jsx)(n.h1,{id:`document-design`,children:`document-design`}),`
`,(0,c.jsx)(n.p,{children:`Shared CSS for generated documentation, catalogs and reports. Load one
stylesheet, write the markup it describes.`}),`
`,(0,c.jsxs)(n.p,{children:[`English is the project's default language, including these docs and the default
stories. Japanese output has dedicated typography and localized controls. Stories
named `,(0,c.jsx)(n.strong,{children:`Japanese`}),` demonstrate those features with `,(0,c.jsx)(n.code,{children:`lang="ja"`}),`; use `,(0,c.jsx)(n.code,{children:`lang="en"`}),`
for English documents and mark Japanese passages explicitly in mixed content.`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<link rel="stylesheet"
      href="https://k-kinzal.github.io/document-design/v1/document-design.css">
`})}),`
`,(0,c.jsx)(n.p,{children:`That is the whole of it. The stylesheet needs no build step, no JavaScript and
no bundler, so a PHP generator, a Rust one and a shell script can all produce
pages that look like each other.`}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`the-two-genres`,children:`The two genres`}),`
`,(0,c.jsx)(n.p,{children:`There are two kinds of page here, and they measure differently on purpose.`}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:`.doc`})}),` — a sidebar you navigate from, a bar that says where you are, and a
column you read. For anything generated per-symbol or per-record, where a
reader arrives at one page out of hundreds. Dense rows, a 13px body, space in
small steps.`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<div class="doc">
  <nav class="sidebar">…</nav>
  <div class="main">
    <header class="topbar">…</header>
    <main class="content">…</main>
  </div>
</div>
`})}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:`.sheet`})}),` — one page, read straight through, that says what changed and what
it cost. Twelve columns, a 28px baseline, one large figure. For a report at the
end of a run.`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<article class="sheet">
  <p class="eyebrow">…</p>
  <h1>…</h1>
  <p class="stand">…</p>
  <div class="hero">…</div>
  <section class="sec">
    <div class="label">01<br>spec</div>
    <div class="field">…</div>
  </section>
</article>
`})}),`
`,(0,c.jsxs)(n.p,{children:[`Each genre is one wrapper element rather than a class on `,(0,c.jsx)(n.code,{children:`<body>`}),`, so a frame
can be nested — inside a preview pane, inside a page that already has a header
— without the layout depending on where it sits.`]}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`colour-comes-from-tone-not-from-components`,children:`Colour comes from tone, not from components`}),`
`,(0,c.jsx)(n.p,{children:`A tone sets two custom properties. Every component that carries colour reads
them.`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<span class="chip tone-blue">SELECT</span>
<div class="notice tone-warn">…</div>
<span class="meter-part tone-ok" style="--dd-part:4%"></span>
`})}),`
`,(0,c.jsxs)(n.p,{children:[`Identity hues — `,(0,c.jsx)(n.code,{children:`blue`}),` `,(0,c.jsx)(n.code,{children:`violet`}),` `,(0,c.jsx)(n.code,{children:`amber`}),` `,(0,c.jsx)(n.code,{children:`teal`}),` `,(0,c.jsx)(n.code,{children:`pink`}),` `,(0,c.jsx)(n.code,{children:`indigo`}),` `,(0,c.jsx)(n.code,{children:`slate`}),` — say
what a thing `,(0,c.jsx)(n.strong,{children:`is`}),`. State tones — `,(0,c.jsx)(n.code,{children:`ok`}),` `,(0,c.jsx)(n.code,{children:`warn`}),` `,(0,c.jsx)(n.code,{children:`danger`}),` `,(0,c.jsx)(n.code,{children:`neutral`}),` — say how it
is `,(0,c.jsx)(n.strong,{children:`going`}),`. Keeping them apart is what stops a page of SELECTs from reading
as a page of warnings.`]}),`
`,(0,c.jsx)(n.p,{children:`Your project keeps its own vocabulary by aliasing, one line each:`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-css`,children:`.k-select { --dd-tone: var(--dd-blue); --dd-tone-tint: var(--dd-blue-tint); }
.k-insert { --dd-tone: var(--dd-teal); --dd-tone-tint: var(--dd-teal-tint); }
`})}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`overriding`,children:`Overriding`}),`
`,(0,c.jsxs)(n.p,{children:[`Everything ships inside `,(0,c.jsx)(n.code,{children:`@layer dd`}),`. Cascade layers rank below unlayered CSS
regardless of specificity, so your own rule wins without `,(0,c.jsx)(n.code,{children:`!important`}),` and
without a specificity ladder:`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-css`,children:`/* this beats \`.doc .card h2\`, and anything else in the library */
.chip { font-weight: 400; }
`})}),`
`,(0,c.jsxs)(n.p,{children:[`To put your CSS `,(0,c.jsx)(n.strong,{children:`between`}),` two of the library's layers, declare a sublayer of
`,(0,c.jsx)(n.code,{children:`dd`}),` and restate the whole order first:`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-css`,children:`@layer dd.reset, dd.tokens, dd.base, dd.layout,
       dd.mine, dd.component, dd.utility, dd.print;

@layer dd.mine { .chip { … } }
`})}),`
`,(0,c.jsxs)(n.p,{children:[`A top-level layer declared after `,(0,c.jsx)(n.code,{children:`dd`}),` outranks everything inside `,(0,c.jsx)(n.code,{children:`dd`}),` — it can
only sit above all of it, never between two sublayers. And the list has to name
every existing sublayer: one left out is created wherever it is first used,
which reorders it.`]}),`
`,(0,c.jsxs)(n.p,{children:[`To retheme rather than override, redefine tokens on `,(0,c.jsx)(n.code,{children:`:root`}),`. Both the palette
(`,(0,c.jsx)(n.code,{children:`--dd-blue`}),`) and the roles (`,(0,c.jsx)(n.code,{children:`--dd-accent`}),`, `,(0,c.jsx)(n.code,{children:`--dd-warn`}),`) are public.`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-css`,children:`:root { --dd-accent: var(--dd-teal); }
`})}),`
`,(0,c.jsxs)(n.p,{children:[`Custom properties are prefixed and class names are not, and that is deliberate:
a custom property inherits through the whole document and neither `,(0,c.jsx)(n.code,{children:`@layer`}),` nor
`,(0,c.jsx)(n.code,{children:`@scope`}),` contains one, so `,(0,c.jsx)(n.code,{children:`--bg`}),` set here and `,(0,c.jsx)(n.code,{children:`--bg`}),` set by you would be the
same property. Class names have no such problem — this stylesheet owns the
document it is loaded into, and `,(0,c.jsx)(n.code,{children:`@layer`}),` already settles who wins.`]}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`themes`,children:`Themes`}),`
`,(0,c.jsxs)(n.p,{children:[`The palette is written once with `,(0,c.jsx)(n.code,{children:`light-dark()`}),`, and `,(0,c.jsx)(n.code,{children:`color-scheme`}),` is what
selects between them. A document follows the reader's system by default.`]}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<html data-dd-theme="dark">   <!-- force -->
<html>                        <!-- follow the system -->
`})}),`
`,(0,c.jsx)(n.p,{children:`To avoid a flash of the wrong theme, set the attribute before the stylesheet
paints:`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<script>try{var t=localStorage.getItem("dd-theme");
  if(t)document.documentElement.dataset.ddTheme=t}catch(e){}<\/script>
`})}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`the-optional-behaviour-layer`,children:`The optional behaviour layer`}),`
`,(0,c.jsx)(n.p,{children:`Everything above works with no JavaScript at all. If you want the behaviours
that generated documentation usually grows — a theme toggle, client-side
search, sortable tables, copy buttons, facets, a sidebar that opens on a phone,
a table of contents that tracks the heading you are reading — add one file and
some attributes.`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<script src="https://k-kinzal.github.io/document-design/v1/document-design.js" defer><\/script>

<button class="btn" data-dd-theme-toggle>◐</button>
<table class="sortable" data-dd-sortable><th data-dd-sort>Name</th>…</table>
<div class="code-block"><pre class="code">…</pre>
     <button class="btn copy" data-dd-copy>Copy</button></div>
<input type="search" data-dd-filter="#rows">
`})}),`
`,(0,c.jsxs)(n.p,{children:[`There is no API to call. It is a classic script, not a module, because these
documents are opened from disk as often as they are served and a module script
fails outright on `,(0,c.jsx)(n.code,{children:`file://`}),`.`]}),`
`,(0,c.jsx)(n.p,{children:`For search, provide the index — only your generator knows what is worth
finding:`}),`
`,(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:`language-html`,children:`<input type="search" data-dd-search>
<div data-dd-search-results hidden></div>
<script>window.ddSearchIndex = [{name, where, body, href}, …]<\/script>
`})}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`what-is-in-here`,children:`What is in here`}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:`Foundations`}),` — start with `,(0,c.jsx)(n.strong,{children:`Principles`}),`: what this design is and why. Then
the palette, the two type scales, space, surfaces, the grid, the tone system,
the cascade architecture, and accessibility.`]}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:`Layouts`}),` — the two genres and the arrangements they share.`]}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:`Components`}),` — 29 of them:`]}),`
`,(0,c.jsx)(n.p,{children:`| | |
|---|---|
| reading | prose · callout · quote · definitions |
| code | code · diff · terminal · file tree |
| structure | tree · graph · disclosure · tabs · pagination |
| data | table · listing · meter · stat · facts · symbol |
| status | chip · notice · banner · empty · timeline |
| frame | sidebar · topbar · control · search · facets · card |
| aids | keys · tooltip |`}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:`Examples`}),` — the figures projects this was factored out of, rebuilt on it.`]})]})}function s(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),n(),a()})))()}l();export{s as default};