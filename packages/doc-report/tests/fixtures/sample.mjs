// A representative evidence set and model answer, shared by the unit tests
// and the browser checks. The numbers are illustrative test data, not a
// measurement of anything.
import { readFileSync } from 'node:fs';
import { evidenceIndex } from '../../src/evidence.mjs';
import { stylesheetPath } from '../../src/paths.mjs';
import { renderReport } from '../../src/render.mjs';
import { validateReport } from '../../src/schema.mjs';

export const sampleEvidence = () => ({
  repository: 'octo/consumer',
  base: { ref: 'v1.0.0', sha: 'a'.repeat(40), tree: 't1' }, head: { ref: 'v1.1.0', sha: 'b'.repeat(40), tree: 't2' }, rule: 'range-direct', notes: ['A note about the comparison.'],
  commits: [{ sha: 'b'.repeat(40), short: 'bbbbbbb', author: 'Ada <x>', date: '2026-01-02T03:04:05Z', subject: 'Change <things> & more', body: '' }], commitsTotal: 1,
  files: [
    { path: 'src/a & b.php', oldPath: null, status: 'M', added: 3, deleted: 1, binary: false, category: 'text', diff: '+x', omitted: null, hunksIncluded: 1, hunksTotal: 1 },
    { path: 'gone.txt', oldPath: null, status: 'D', added: 0, deleted: 5, binary: false, category: 'text', diff: '-y', omitted: null, hunksIncluded: 1, hunksTotal: 1 },
    { path: 'logo.png', oldPath: null, status: 'A', added: null, deleted: null, binary: true, category: 'binary', diff: null, omitted: 'binary' },
    { path: 'big.txt', oldPath: null, status: 'M', added: 900, deleted: 800, binary: false, category: 'text', diff: '+z', omitted: 'partial', hunksIncluded: 2, hunksTotal: 9 },
    { path: 'docs/a-very-long-directory-name/with-an-even-longer-file-name-that-should-wrap-inside-its-cell-rather-than-overflow.md', oldPath: 'docs/old.md', status: 'R', added: 1, deleted: 1, binary: false, category: 'text', diff: '+w', omitted: null, hunksIncluded: 1, hunksTotal: 1 },
  ], filesTotal: 5,
  discussion: null, omissions: [{ kind: 'binary', count: 1, reason: 'Binary files are listed by name; their contents are not read.' }, { kind: 'budget-hunks', count: 7, reason: 'Hunks dropped from files that exceeded their share of the input budget.' }], partial: true,
  budget: { max: 200000, used: 1234 }, totals: { added: 905, deleted: 807 }, digest: 'sha256:' + 'c'.repeat(64),
});

const answers = {
  en: {
    title: 'Read the input in one place',
    standfirst: 'Three readers became one; callers changed, behaviour did not.',
    hero: { before: 'Read separately in 3 places', after: 'Only the reader reads', unit: 'Callers: 12 → 1' },
    sections: [
      { kind: 'intent', lead: 'The parser owned the input.', paragraphs: ['It read the stream directly & parsed it, which meant every caller had to know the stream format (bytes > tokens) before it could ask a question about the grammar.'], compare: { before: { title: 'Before', items: ['Three call sites read the stream', 'Each one handled encoding'] }, after: { title: 'After', items: ['One call site', 'Encoding handled once'] } }, flow: null, facts: null, evidence: ['src/a & b.php', 'bbbbbbb'], caveat: 'No benchmark was run; the change is about structure, not speed.' },
      { kind: 'structure', lead: 'A reader module replaces inline reads.', paragraphs: [], compare: null, flow: [{ name: 'Open', detail: 'Open the stream' }, { name: 'Read', detail: 'Read tokens' }, { name: 'Close', detail: null }], facts: [{ term: 'Reader', definition: 'Owns the stream and the encoding.' }], evidence: ['gone.txt'], caveat: null },
      { kind: 'verification', lead: 'Tests were not part of the evidence.', paragraphs: [], compare: null, flow: null, facts: null, evidence: [], caveat: null },
    ],
    findings: [{ status: 'verified', text: 'gone.txt was deleted.' }, { status: 'inferred', text: 'Callers moved to the reader.' }, { status: 'unverified', text: 'Tests pass.' }],
    migration: ['Replace direct reads with Reader::read().'],
  },
  ja: {
    title: '入力を一か所で読む',
    standfirst: '三つあった読み取りが一つになった。呼び出し側は変わり、振る舞いは変わらない。',
    hero: { before: '3か所で別々に読む', after: 'リーダーだけが読む', unit: '呼び出し元: 12 → 1' },
    sections: [
      { kind: 'intent', lead: 'パーサが入力を抱えていた。', paragraphs: ['ストリームを直接読んで解析していたため、文法について問う前に、すべての呼び出し側がストリームの形式を知る必要があった。'], compare: { before: { title: '変更前', items: ['3か所がストリームを読む', 'それぞれが符号化を扱う'] }, after: { title: '変更後', items: ['1か所だけが読む', '符号化は一度だけ扱う'] } }, flow: null, facts: null, evidence: ['src/a & b.php', 'bbbbbbb'], caveat: 'ベンチマークは実行していない。構造の変更であり、速度の変更ではない。' },
      { kind: 'structure', lead: 'リーダーモジュールがインラインの読み取りを置き換える。', paragraphs: [], compare: null, flow: [{ name: '開く', detail: 'ストリームを開く' }, { name: '読む', detail: 'トークンを読む' }, { name: '閉じる', detail: null }], facts: [{ term: 'リーダー', definition: 'ストリームと符号化を所有する。' }], evidence: ['gone.txt'], caveat: null },
      { kind: 'verification', lead: 'テストは根拠に含まれていない。', paragraphs: [], compare: null, flow: null, facts: null, evidence: [], caveat: null },
    ],
    findings: [{ status: 'verified', text: 'gone.txt は削除された。' }, { status: 'inferred', text: '呼び出し元はリーダーへ移った。' }, { status: 'unverified', text: 'テストは通過する。' }],
    migration: ['直接の読み取りを Reader::read() に置き換える。'],
  },
};

export const sampleReport = (evidence, language = 'en') => validateReport(answers[language] ?? answers.en, evidenceIndex(evidence));

export const sampleProvenance = (extra = {}) => ({ serverUrl: 'https://github.com', repository: 'octo/consumer', runUrl: 'https://github.com/octo/consumer/actions/runs/1', generatedAt: '2026-09-26T00:00:00.000Z', actionRevision: 'd'.repeat(40), docUiVersion: '1.0.0', pullRequest: null, releaseTag: null, promptVersion: '1', status: 'partial', model: { requested: 'auto', used: ['fake-model-1'] }, cliVersion: '1.0.88', ...extra });

export const sampleCss = () => readFileSync(stylesheetPath(), 'utf8');

export function renderSample({ language = 'en', empty = false, status } = {}) {
  const evidence = sampleEvidence();
  const report = empty ? null : sampleReport(evidence, language);
  const title = language === 'ja' ? '変更レポート · octo/consumer · aaaaaaa → bbbbbbb' : 'Change report · octo/consumer · aaaaaaa → bbbbbbb';
  return renderReport({ report, evidence, provenance: sampleProvenance({ status: status ?? (empty ? 'empty' : 'partial') }), language, title, css: sampleCss() });
}
