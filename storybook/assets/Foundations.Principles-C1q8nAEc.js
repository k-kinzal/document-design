import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,r as n}from"./react-BXJ34t_g.js";import{a as r}from"./chunk-W22LQPXL-Bh9L8lFD.js";import{a as i,o as a}from"./blocks-DBNOqzP_.js";function o(e){let n={code:`code`,em:`em`,h1:`h1`,h2:`h2`,hr:`hr`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...t(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Foundations/Principles`}),`
`,(0,c.jsx)(n.h1,{id:`what-this-design-is`,children:`What this design is`}),`
`,(0,c.jsxs)(n.p,{children:[`A design system for `,(0,c.jsx)(n.strong,{children:`documents a program wrote`}),`. Not an app, not a website —
an API reference with 542 symbols, a SQL catalog with 844 statements and 978
findings, a report a run produced at 14:02 and nobody has read yet.`]}),`
`,(0,c.jsx)(n.p,{children:`That subject has properties an interface design usually does not, and they are
what the system is shaped by:`}),`
`,(0,c.jsxs)(n.ul,{children:[`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`Nobody chose to come here.`}),` A tool produced the page and someone followed
a link into the middle of it, holding one question.`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`The volume is unbounded and unedited.`}),` No one curated the 844 statements.
Some are 200 lines long. One table has 77 rows and another has 3.`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`The page is an artifact, not a session.`}),` It gets archived, mailed,
printed, opened from disk two years later, diffed against last month's.`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`It was written by string concatenation`}),`, in PHP, in Rust, in a shell
script — so the markup is the API, and it has to be writable that way.`]}),`
`]}),`
`,(0,c.jsx)(n.p,{children:`Eight principles follow from that.`}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`1-the-reader-arrived-with-a-question`,children:`1. The reader arrived with a question`}),`
`,(0,c.jsx)(n.p,{children:`Every page answers "what am I looking at" before it answers anything else, and
every page says where else there is to go. A generated reference that shows
only the thing you asked for strands a reader who asked for the wrong thing —
which, arriving from a search engine, they usually have.`}),`
`,(0,c.jsxs)(n.p,{children:[`This is why `,(0,c.jsx)(n.code,{children:`.card`}),` carries a hint and not just a list, why `,(0,c.jsx)(n.code,{children:`.lede`}),` exists as
a distinct register, and why the sidebar shows counts. `,(0,c.jsx)(n.em,{children:`Statements 844`}),` and
`,(0,c.jsx)(n.em,{children:`Statements`}),` are different amounts of help.`]}),`
`,(0,c.jsx)(n.h2,{id:`2-say-what-is-not-known`,children:`2. Say what is not known`}),`
`,(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:`This is the principle the rest of the system bends around.`})}),`
`,(0,c.jsx)(n.p,{children:`An analyzer that cannot resolve a statement has learned something, and the
page has to be able to say it. If the design can only render success, the
generator will round up — a lower bound gets printed as a total, an
unreachable branch gets counted as covered, and the document becomes
confidently wrong.`}),`
`,(0,c.jsx)(n.p,{children:`So absence is a first-class mark, not an error state:`}),`
`,(0,c.jsxs)(n.ul,{children:[`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:`.hole`}),` — a gap `,(0,c.jsx)(n.em,{children:`inside`}),` a value, with the reason on hover`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:`.meter-part.is-open`}),` — "as far as we got", drawn differently from a finished
category`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:`.empty`}),` — nothing here, and `,(0,c.jsx)(n.em,{children:`why`}),`, and the way out`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:`.caveat`}),` — something the reader would be wrong to assume still stats`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.code,{children:`.is-open`}),` on a timeline — the run has not finished`]}),`
`]}),`
`,(0,c.jsxs)(n.p,{children:[`It is also why the hue budget reserves red. Red never appears in syntax
highlighting, never marks a kind, never means "delete key". The one red on a
page always means `,(0,c.jsx)(n.em,{children:`something here needs looking at`}),` — and that is only true if
nothing else is allowed to use it.`]}),`
`,(0,c.jsx)(n.h2,{id:`3-a-number-carries-its-question`,children:`3. A number carries its question`}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.code,{children:`978`}),` is not information. `,(0,c.jsx)(n.code,{children:`978 findings`}),` is. `,(0,c.jsx)(n.code,{children:`978 findings, 709 of them dynamic SQL`}),` is better.`]}),`
`,(0,c.jsxs)(n.p,{children:[`Counts never float free: `,(0,c.jsx)(n.code,{children:`.count`}),` attaches to a heading, `,(0,c.jsx)(n.code,{children:`.facet-count`}),` rides
on the filter, `,(0,c.jsx)(n.code,{children:`.meter-legend-count`}),` sits between the chip and the sentence defining
it, `,(0,c.jsx)(n.code,{children:`.stat-label`}),` is part of `,(0,c.jsx)(n.code,{children:`.stat`}),`. A filter that turns out to match nothing
is a dead end the reader has to reverse out of — a count on the control means
they never take it.`]}),`
`,(0,c.jsx)(n.h2,{id:`4-two-speeds-two-scales`,children:`4. Two speeds, two scales`}),`
`,(0,c.jsxs)(n.p,{children:[`A catalog is `,(0,c.jsx)(n.strong,{children:`scanned`}),`: the reader is looking for one row among hundreds, so
it is dense — 13px body, small space steps, one line per item, clipped rather
than wrapped.`]}),`
`,(0,c.jsxs)(n.p,{children:[`A report is `,(0,c.jsx)(n.strong,{children:`read`}),`: it makes an argument once, start to finish, so it has
air — 16px body, a 28px baseline, twelve columns, and exactly one figure large
enough to be the point.`]}),`
`,(0,c.jsx)(n.p,{children:`Forcing both onto one scale costs the catalog its density or the report its
air. So there are two scales and two genres, and a page picks one.`}),`
`,(0,c.jsx)(n.h2,{id:`5-colour-is-vocabulary-not-decoration`,children:`5. Colour is vocabulary, not decoration`}),`
`,(0,c.jsx)(n.p,{children:`Ten hues, each spoken for:`}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:`Identity`}),` — `,(0,c.jsx)(n.code,{children:`blue`}),` `,(0,c.jsx)(n.code,{children:`violet`}),` `,(0,c.jsx)(n.code,{children:`amber`}),` `,(0,c.jsx)(n.code,{children:`teal`}),` `,(0,c.jsx)(n.code,{children:`pink`}),` `,(0,c.jsx)(n.code,{children:`indigo`}),` `,(0,c.jsx)(n.code,{children:`slate`}),` — say
what a thing `,(0,c.jsx)(n.em,{children:`is`}),`. A SELECT, a trait, a layer. No judgement: a page full of
identity colour is not a page full of warnings.`]}),`
`,(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.strong,{children:`State`}),` — `,(0,c.jsx)(n.code,{children:`green`}),` `,(0,c.jsx)(n.code,{children:`gold`}),` `,(0,c.jsx)(n.code,{children:`red`}),` — say how a thing is `,(0,c.jsx)(n.em,{children:`going`}),`.`]}),`
`,(0,c.jsx)(n.p,{children:`Mixing them is how a catalog ends up looking like an alarm panel. Syntax
highlighting reuses identity hues at text weight only, and never red.`}),`
`,(0,c.jsx)(n.h2,{id:`6-every-mark-says-it-twice`,children:`6. Every mark says it twice`}),`
`,(0,c.jsxs)(n.p,{children:[`Colour is never the only carrier. A diff line has a `,(0,c.jsx)(n.code,{children:`+`}),` as well as a tint. An
active facet has an outline as well as more opacity. The current sidebar item
has a bar on its edge as well as a wash. An unsupported graph edge is dashed as
well as amber.`]}),`
`,(0,c.jsxs)(n.p,{children:[`Partly this is contrast and colour vision. Mostly it is that `,(0,c.jsx)(n.strong,{children:`these documents
get printed`}),`, and on paper the tint is gone.`]}),`
`,(0,c.jsx)(n.h2,{id:`7-the-page-outlives-the-tool`,children:`7. The page outlives the tool`}),`
`,(0,c.jsxs)(n.p,{children:[`No build step, no JavaScript requirement, no network at render time. One
`,(0,c.jsx)(n.code,{children:`<link>`}),`.`]}),`
`,(0,c.jsxs)(n.p,{children:[`The behaviour layer is optional and additive — take it away and nothing
breaks, it is a classic script rather than a module because a module fails
outright on `,(0,c.jsx)(n.code,{children:`file://`}),`, and a README badge is rendered as text rather than as
an image request to a service that may not exist next year.`]}),`
`,(0,c.jsx)(n.p,{children:`Printing is a supported output, not an afterthought: the report a run produced
is exactly the kind of thing that gets attached to a ticket as a PDF.`}),`
`,(0,c.jsx)(n.h2,{id:`8-the-cascade-is-structural-not-a-convention`,children:`8. The cascade is structural, not a convention`}),`
`,(0,c.jsxs)(n.p,{children:[`The system is entirely inside `,(0,c.jsx)(n.code,{children:`@layer dd`}),`. Layers rank below unlayered CSS
regardless of specificity, so a consumer overrides anything by writing an
ordinary rule.`]}),`
`,(0,c.jsxs)(n.p,{children:[`That is what buys plain class names. `,(0,c.jsx)(n.code,{children:`.chip`}),` and `,(0,c.jsx)(n.code,{children:`.sidebar`}),` are not defended
by a `,(0,c.jsx)(n.code,{children:`dd-`}),` prefix, because the question a prefix was answering — `,(0,c.jsx)(n.em,{children:`who wins`}),` —
is answered by the cascade instead. Custom properties `,(0,c.jsx)(n.strong,{children:`are`}),` prefixed, because
they inherit through the whole document and no layer contains them.`]}),`
`,(0,c.jsx)(n.p,{children:`Naming discipline is a convention that each generator has to keep. A layer is
a rule the browser keeps.`}),`
`,(0,c.jsx)(n.hr,{}),`
`,(0,c.jsx)(n.h2,{id:`what-this-system-is-not`,children:`What this system is not`}),`
`,(0,c.jsxs)(n.ul,{children:[`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`Not a UI kit.`}),` There are almost no controls, because a document is read,
not operated. The few that exist — a theme toggle, a filter, a copy button —
are there because all three source projects had written them separately.`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`Not responsive-first.`}),` These pages are read on a desktop, next to an
editor. They work down to a phone; they are not designed for one.`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`Not animated.`}),` A disclosure triangle turns and a tooltip fades. That is
the whole of it, and both stop under `,(0,c.jsx)(n.code,{children:`prefers-reduced-motion`}),`.`]}),`
`,(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:`Not opinionated about your vocabulary.`}),` The tone system carries colour;
`,(0,c.jsx)(n.code,{children:`.k-select`}),` and `,(0,c.jsx)(n.code,{children:`.k-class`}),` stay yours, as one-line aliases.`]}),`
`]})]})}function s(e={}){let{wrapper:n}={...t(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=r(),n(),a()})))()}l();export{s as default};