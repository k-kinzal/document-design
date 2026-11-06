import hljs from 'highlight.js';

// Only doc-ui's existing token vocabulary reaches the generated document.
// Unknown languages stay literal; guessing can misrepresent plain examples.
const kinds = {
  keyword: 'kw', built_in: 'kw', type: 'kw', name: 'kw', selector_tag: 'kw',
  string: 'str', regexp: 'str', char: 'str',
  number: 'num', literal: 'num',
  comment: 'com', quote: 'com', doctag: 'com',
  variable: 'var', attr: 'var', attribute: 'var', property: 'var', params: 'var',
  title: 'id', symbol: 'id', meta: 'kw', addition: 'str', deletion: 'com',
};

export function highlight(source, language) {
  if (!language || !hljs.getLanguage(language)) return '';
  return hljs.highlight(source, { language, ignoreIllegals: true }).value
    .replace(/class="([^"]+)"/g, (_, classes) => {
      const scope = classes.split(' ').find(name => name.startsWith('hljs-'))?.slice(5);
      return `class="tok-${kinds[scope] ?? 'id'}"`;
    });
}
