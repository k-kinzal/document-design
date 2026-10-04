import { parseArgs } from 'node:util';

export const choices = {
  layout: ['doc', 'report', 'paper', 'book'],
  theme: ['auto', 'light', 'dark'],
  color: ['color', 'grayscale', 'monochrome'],
  paper: ['auto', 'a4', 'letter'],
  'print-urls': ['inline', 'sources', 'none'],
};

export const defaults = {
  layout: 'doc', theme: 'auto', color: 'color', paper: 'auto',
  'print-urls': 'inline', lang: 'en', html: false,
};

export const help = `Usage: doc-ui [options] [input.md|-]

Render Markdown as an HTML document with embedded doc-ui CSS.
Read stdin when input is omitted or "-"; write stdout unless -o is given.

Options:
  -o, --output <file>      Write HTML to a file ("-" for stdout)
      --layout <name>      doc, report, paper, book (default: doc)
      --theme <name>       auto, light, dark (default: auto)
      --color <name>       color, grayscale, monochrome (default: color)
      --lang <tag>         Document language, e.g. en or ja (default: en)
      --paper <size>       auto, a4, letter (default: auto)
      --print-urls <mode>  inline, sources, none (default: inline)
      --title <text>       Browser title (default: first H1 or filename)
      --html              Allow raw HTML from trusted Markdown
  -h, --help              Show this help
  -v, --version           Show the doc-ui version

Examples:
  doc-ui README.md -o README.html
  doc-ui report.md --layout paper --lang ja --paper a4 -o report.html
  cat book.md | doc-ui --layout book --color monochrome > book.html

Report H2 headings become sections; book H2 headings start printed chapters.
Images remain references; CSS is embedded and requires no network or JavaScript.
`;

export function parseOptions(args) {
  const { values, positionals } = parseArgs({
    args, allowPositionals: true, strict: true,
    options: {
      output: { type: 'string', short: 'o' },
      ...Object.fromEntries(Object.keys(choices).map(key => [key, { type: 'string' }])),
      lang: { type: 'string' }, title: { type: 'string' },
      html: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  });
  if (positionals.length > 1) throw new Error('Expected one Markdown file or "-" for stdin.');
  const options = { ...defaults, ...values, input: positionals[0] };
  for (const [key, allowed] of Object.entries(choices)) {
    if (!allowed.includes(options[key])) throw new Error(`--${key} must be one of: ${allowed.join(', ')}.`);
  }
  try {
    const [lang] = Intl.getCanonicalLocales(options.lang);
    if (!lang) throw new Error();
    options.lang = lang;
  } catch {
    throw new Error('--lang must be a language tag, such as en or ja.');
  }
  if (options.output === '' || options.input === '') throw new Error('File paths must not be empty.');
  return options;
}
