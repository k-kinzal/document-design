# Markdown to HTML

The `doc-ui` CLI embeds the matching CSS and its license into a complete HTML
document. It needs Node.js 22 or newer to convert; the output needs only a
browser. In this repository, install dependencies if needed and build with
`npm run build:ui`, then run:

```sh
npx --no-install @k-kinzal/doc-ui manuscript.md --layout paper --lang en --paper a4 -o manuscript.html
```

For a Japanese manuscript, use `--lang ja`. Select the layout for the content:

| Layout | Result |
| --- | --- |
| `doc` (default) | `.doc` frame with normal Markdown heading hierarchy |
| `report` | `.sheet` with a large title and sections from top-level H2s |
| `paper` | Continuous `.sheet.sheet-paper` reading composition |
| `book` | Cover/introduction, then a chapter per top-level H2 |

- A leading H1 supplies the visible report/paper/book title. `--title` changes
  the browser title only. Nested headings do not divide report sections or
  book chapters. The CLI does not invent a missing visible title.
- `--theme auto|light|dark`, `--color color|grayscale|monochrome`,
  `--paper auto|a4|letter`, and `--print-urls inline|sources|none` select existing
  doc-ui modes. `sources` does not generate a bibliography from ordinary links.
- Use `--html` only for trusted authored HTML, including MathML or doc-ui
  components. Raw HTML is otherwise disabled and is not sanitized when enabled.
  YAML frontmatter, TeX math, and diagram extensions are not interpreted. Code
  fences retain language classes but are not syntax-highlighted.
- Images are not embedded or downloaded. Keep them with the output for offline
  use. `-o` rebases relative Markdown links and images to the output directory;
  raw HTML URLs stay as authored. Stdout preserves relative URLs, so redirected
  output must be placed accordingly. Never overwrite the input with the output.

Outside this checkout, use a verified published package version or a locally
packed archive. `npm pack --workspace @k-kinzal/doc-ui` produces the archive;
run `npx --package /path/to/the-generated.tgz doc-ui input.md -o output.html`.
Do not assume the source package's version has already been published to npm.

Inspect the generated HTML as the selected document type. `--paper` makes
printable HTML; create and verify an actual PDF if one is requested.

Implementation and option reference: `packages/doc-ui/README.md` and
`packages/doc-ui/src/cli/`.
