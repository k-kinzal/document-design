// The page. A deterministic program owns the HTML shape, the embedded
// stylesheet, every link and every provenance fact. The model's validated
// content is escaped into the slots the report sheet already has: masthead,
// hero, sections, comparisons, flows, facts and caveats.
import { ACTION_NAME, ACTION_VERSION } from './version.mjs';

export const LABELS = {
  en: {
    eyebrow: 'Change report', before: 'BEFORE', after: 'AFTER',
    intent: 'Intent', behaviour: 'Behaviour', structure: 'Structure', impact: 'Impact', verification: 'Verification',
    findings: 'Findings', status: 'Status', finding: 'Finding', verified: 'verified', inferred: 'inferred', unverified: 'unverified',
    migration: 'Migration', migrationLead: 'Steps the evidence shows a user must take.',
    evidence: 'Evidence', evidenceLead: 'What the report was written from.', evidenceNote: 'Evidence',
    commits: 'Commits', files: 'Files changed', file: 'File', change: 'Change', lines: 'Lines', note: 'Note',
    added: 'added', modified: 'modified', removed: 'removed', renamed: 'renamed', copied: 'copied', typeChanged: 'type changed', unmerged: 'unmerged',
    binary: 'binary; not read', lockfile: 'lockfile; diff not read', generated: 'generated; diff not read', budget: 'diff omitted: input budget', oversized: 'diff omitted: too large',
    hunks: (a, b) => `${a} of ${b} hunks read`, more: (n) => `and ${n} more`, linesAdded: (n) => `+${n} added`, linesDeleted: (n) => `−${n} removed`, filesCount: (n) => `${n} ${n === 1 ? 'file' : 'files'}`, commitsCount: (n) => `${n} ${n === 1 ? 'commit' : 'commits'}`,
    omitted: 'Not everything was read.', omissionsIntro: 'The report does not cover:',
    provenance: 'Provenance', repository: 'Repository', comparison: 'Comparison', rule: 'Rule', generated: 'Generated', generator: 'Generator', model: 'Model', modelRequested: 'requested', modelUsed: 'used', prompt: 'Prompt', cli: 'Copilot CLI', stylesheet: 'Stylesheet', run: 'Workflow run', evidenceDigest: 'Evidence digest', reportStatus: 'Report status', pullRequest: 'Pull request', release: 'Release tag',
    complete: 'complete', partial: 'partial', empty: 'empty',
    emptyTitle: 'No changes', emptyNote: 'The base and head trees are identical, so there is nothing to describe.', emptyTree: 'empty tree',
    reportOf: (repo) => `${repo}`, unverifiedNote: 'Verification: no test results were provided as evidence.',
    caveatHead: 'Caveat',
  },
  ja: {
    eyebrow: '変更レポート', before: '変更前', after: '変更後',
    intent: '意図', behaviour: '振る舞い', structure: '構造', impact: '影響', verification: '検証',
    findings: '所見', status: '区分', finding: '内容', verified: '検証済み', inferred: '推論', unverified: '未確認',
    migration: '移行手順', migrationLead: '根拠から利用者に必要とわかる手順。',
    evidence: '根拠', evidenceLead: 'このレポートの材料。', evidenceNote: '根拠',
    commits: 'コミット', files: '変更ファイル', file: 'ファイル', change: '変更', lines: '行', note: '備考',
    added: '追加', modified: '変更', removed: '削除', renamed: '名前変更', copied: '複製', typeChanged: '種別変更', unmerged: '未マージ',
    binary: 'バイナリ。内容は未読', lockfile: 'ロックファイル。差分は未読', generated: '生成物。差分は未読', budget: '差分省略: 入力上限', oversized: '差分省略: 大きすぎる',
    hunks: (a, b) => `${b} ハンク中 ${a} を読了`, more: (n) => `ほか ${n} 件`, linesAdded: (n) => `+${n} 追加`, linesDeleted: (n) => `−${n} 削除`, filesCount: (n) => `${n} ファイル`, commitsCount: (n) => `${n} コミット`,
    omitted: 'すべてを読んだわけではない。', omissionsIntro: 'このレポートが扱っていないもの:',
    provenance: '生成情報', repository: 'リポジトリ', comparison: '比較', rule: '規則', generated: '生成日時', generator: '生成系', model: 'モデル', modelRequested: '指定', modelUsed: '使用', prompt: 'プロンプト', cli: 'Copilot CLI', stylesheet: 'スタイルシート', run: 'ワークフロー実行', evidenceDigest: '根拠ダイジェスト', reportStatus: 'レポート状態', pullRequest: 'プルリクエスト', release: 'リリースタグ',
    complete: '完全', partial: '一部省略', empty: '差分なし',
    emptyTitle: '変更なし', emptyNote: '比較元と比較先のツリーは同一のため、説明する差分がない。', emptyTree: '空ツリー',
    reportOf: (repo) => `${repo}`, unverifiedNote: '検証: テスト結果は根拠として与えられていない。',
    caveatHead: '注意',
  },
};

export const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const drawDefs = `<svg class="draw-defs" aria-hidden="true" focusable="false">
<marker id="dd-arrow" markerUnits="userSpaceOnUse" viewBox="0 0 8 6" refX="8" refY="3" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
<path class="draw-arrowhead" d="M0 0L8 3L0 6Z"/>
</marker>
</svg>`;

const STATUS_TONE = { A: 'tone-ok', M: '', D: 'tone-danger', R: 'tone-blue', C: 'tone-blue', T: 'tone-neutral', U: 'tone-warn' };
const STATUS_KEY = { A: 'added', M: 'modified', D: 'removed', R: 'renamed', C: 'copied', T: 'typeChanged', U: 'unmerged' };
const FINDING_TONE = { verified: 'tone-ok', inferred: 'tone-neutral', unverified: 'tone-warn' };

export function links({ serverUrl, repository, base, head, rule }) {
  const root = repository ? `${serverUrl}/${repository}` : null;
  const segment = (p) => p.split('/').map(encodeURIComponent).join('/');
  return {
    commit: (sha) => (root ? `${root}/commit/${sha}` : null),
    file: (file) => (root ? `${root}/blob/${file.status === 'D' ? base.sha : head.sha}/${segment(file.path)}` : null),
    compare: root && base.sha ? `${root}/compare/${base.sha}${rule === 'pr-merge-base' ? '...' : '..'}${head.sha}` : null,
    tree: (sha) => (root ? `${root}/tree/${sha}` : null),
    pull: (n) => (root ? `${root}/pull/${n}` : null),
  };
}

function link(href, text, cls = '') {
  return href ? `<a${cls ? ` class="${cls}"` : ''} href="${escape(href)}">${escape(text)}</a>` : `<span${cls ? ` class="${cls}"` : ''}>${escape(text)}</span>`;
}

function sectionEvidence(section, L, url) {
  if (!section.evidence.length) return '';
  const items = section.evidence.map((e) => (e.kind === 'file' ? link(url.file(e.file), e.file.path, 'mono') : link(url.commit(e.commit.sha), e.commit.short, 'mono')));
  return `<p class="sidenote"><span class="sidenote-label">${L.evidenceNote}</span>${items.join(' · ')}</p>`;
}

function renderSection(section, number, L, url) {
  const parts = [];
  parts.push(`<div class="rail"><div class="label">${String(number).padStart(2, '0')}<br>${L[section.kind]}</div>${sectionEvidence(section, L, url)}</div>`);
  const field = [`<p class="lead">${escape(section.lead)}</p>`];
  for (const p of section.paragraphs) field.push(`<p class="note">${escape(p)}</p>`);
  if (section.compare) {
    // The model names the two sides; a BEFORE/AFTER cap on top of that
    // said the same thing twice in two registers.
    const side = (s, cls) => `<div class="${cls}"><h3>${escape(s.title)}</h3><ul>${s.items.map((i) => `<li>${escape(i)}</li>`).join('')}</ul></div>`;
    field.push(`<div class="compare">${side(section.compare.before, 'was')}${side(section.compare.after, 'now')}</div>`);
  }
  if (section.flow) {
    field.push(`<ol class="flow" style="--dd-flow-steps:${section.flow.length}">${section.flow.map((s, i) => `<li><span class="flow-mark">${i + 1}</span><span class="flow-name">${escape(s.name)}</span>${s.detail ? `<span class="flow-detail">${escape(s.detail)}</span>` : ''}</li>`).join('')}</ol>`);
  }
  if (section.facts) {
    field.push(`<dl class="definitions">${section.facts.map((f) => `<div><dt>${escape(f.term)}</dt><dd>${escape(f.definition)}</dd></div>`).join('')}</dl>`);
  }
  parts.push(`<div class="field">${field.join('')}</div>`);
  if (section.caveat) parts.push(`<p class="caveat">${escape(section.caveat)}</p>`);
  return `<section class="sec" id="sec-${section.kind}">${parts.join('')}</section>`;
}

function renderFindings(report, number, L) {
  const rows = report.findings.map((f) => `<tr><td class="tight"><span class="chip ${FINDING_TONE[f.status]}">${L[f.status]}</span></td><td>${escape(f.text)}</td></tr>`).join('');
  return `<section class="sec" id="sec-findings"><div class="label">${String(number).padStart(2, '0')}<br>${L.findings}</div><div class="field"><div class="table-wrap"><table class="plain"><thead><tr><th class="tight">${L.status}</th><th>${L.finding}</th></tr></thead><tbody>${rows}</tbody></table></div></div></section>`;
}

function renderMigration(report, number, L) {
  if (!report.migration.length) return '';
  return `<section class="sec" id="sec-migration"><div class="label">${String(number).padStart(2, '0')}<br>${L.migration}</div><div class="field"><p class="lead">${L.migrationLead}</p><div class="prose"><ol>${report.migration.map((m) => `<li>${escape(m)}</li>`).join('')}</ol></div></div></section>`;
}

const SHOW_COMMITS = 30;
const SHOW_FILES = 300;

function renderEvidence(evidence, number, L, url) {
  const parts = [];
  parts.push(`<div class="label">${String(number).padStart(2, '0')}<br>${L.evidence}</div>`);
  const counts = `<div class="diff-counts"><span class="chip">${L.filesCount(evidence.filesTotal)}</span><span class="chip">${L.commitsCount(evidence.commitsTotal)}</span><span class="chip tone-ok">${L.linesAdded(evidence.totals.added)}</span><span class="chip tone-danger">${L.linesDeleted(evidence.totals.deleted)}</span></div>`;
  const field = [`<p class="lead">${L.evidenceLead}</p>`, counts];
  for (const note of evidence.notes ?? []) field.push(`<p class="note">${escape(note)}</p>`);
  if (evidence.commits.length) {
    const shown = evidence.commits.slice(0, SHOW_COMMITS);
    field.push(`<h3>${L.commits}</h3><ol class="timeline">${shown.map((c) => `<li class="timeline-item"><span class="timeline-time">${escape(c.date.slice(0, 10))}</span><p class="timeline-title">${link(url.commit(c.sha), c.subject)}</p><p class="timeline-description"><span class="mono">${escape(c.short)}</span> · ${escape(c.author)}</p></li>`).join('')}${evidence.commitsTotal > shown.length ? `<li class="timeline-item is-open"><p class="timeline-description">${L.more(evidence.commitsTotal - shown.length)}</p></li>` : ''}</ol>`);
  }
  parts.push(`<div class="field">${field.join('')}</div>`);
  if (evidence.files.length) {
    const shown = evidence.files.slice(0, SHOW_FILES);
    const rows = shown.map((f) => {
      const note = f.omitted === 'partial' ? L.hunks(f.hunksIncluded, f.hunksTotal) : f.omitted ? L[f.omitted] ?? f.omitted : '';
      const lines = f.binary ? '—' : `+${f.added} −${f.deleted}`;
      const name = f.oldPath ? `${f.oldPath} → ${f.path}` : f.path;
      const tone = STATUS_TONE[f.status] ?? '';
      return `<tr><td>${link(url.file(f), name, 'mono')}</td><td class="tight"><span class="chip chip-sm${tone ? ` ${tone}` : ''}">${L[STATUS_KEY[f.status]] ?? escape(f.status)}</span></td><td class="num">${escape(lines)}</td><td>${escape(note)}</td></tr>`;
    }).join('');
    parts.push(`<figure class="plate plate-full plate-table"><figcaption>${L.files}</figcaption><div class="table-wrap"><table><thead><tr><th>${L.file}</th><th class="tight">${L.change}</th><th class="num">${L.lines}</th><th>${L.note}</th></tr></thead><tbody>${rows}</tbody></table></div>${evidence.filesTotal > shown.length ? `<p class="empty-inline">${L.more(evidence.filesTotal - shown.length)}</p>` : ''}</figure>`);
  }
  if (evidence.omissions.length) {
    parts.push(`<p class="caveat"><strong>${L.omitted}</strong> ${L.omissionsIntro} ${evidence.omissions.map((o) => `${escape(o.reason)} (${o.count})`).join(' ')}</p>`);
  }
  return `<section class="sec" id="sec-evidence">${parts.join('')}</section>`;
}

function renderProvenance(p, evidence, number, L, url) {
  const rows = [];
  const fact = (dt, dd) => rows.push(`<div><dt>${dt}</dt><dd>${dd}</dd></div>`);
  fact(L.repository, link(url.tree(evidence.head.sha) && `${p.serverUrl}/${p.repository}`, p.repository ?? '—'));
  const baseText = evidence.base.sha ? `${evidence.base.ref} (${evidence.base.sha.slice(0, 12)})` : L.emptyTree;
  fact(L.comparison, `${evidence.base.sha ? link(url.commit(evidence.base.sha), baseText, 'mono') : `<span class="mono">${escape(baseText)}</span>`} → ${link(url.commit(evidence.head.sha), `${evidence.head.ref} (${evidence.head.sha.slice(0, 12)})`, 'mono')}${url.compare ? ` · ${link(url.compare, 'compare')}` : ''}`);
  fact(L.rule, `<span class="mono">${escape(evidence.rule)}</span>`);
  if (p.pullRequest) fact(L.pullRequest, link(url.pull(p.pullRequest), `#${p.pullRequest}`));
  if (p.releaseTag) fact(L.release, `<span class="mono">${escape(p.releaseTag)}</span>`);
  fact(L.reportStatus, `<span class="chip ${p.status === 'complete' ? 'tone-ok' : p.status === 'partial' ? 'tone-warn' : ''}">${L[p.status] ?? escape(p.status)}</span>`);
  fact(L.generated, `<time datetime="${escape(p.generatedAt)}">${escape(p.generatedAt)}</time>`);
  fact(L.generator, `<span class="mono">${escape(`${ACTION_NAME} ${ACTION_VERSION}`)}${p.actionRevision ? ` @ ${escape(p.actionRevision)}` : ''}</span>`);
  if (p.model) fact(L.model, `<span class="mono">${escape(p.model.requested)}</span> (${L.modelRequested})${p.model.used?.length ? ` · <span class="mono">${escape(p.model.used.join(', '))}</span> (${L.modelUsed})` : ''}`);
  if (p.promptVersion) fact(L.prompt, `<span class="mono">v${escape(p.promptVersion)}</span>`);
  if (p.cliVersion) fact(L.cli, `<span class="mono">${escape(p.cliVersion)}</span>`);
  fact(L.stylesheet, `<span class="mono">doc-ui ${escape(p.docUiVersion ?? 'unknown')}</span>`);
  if (p.runUrl) fact(L.run, link(p.runUrl, p.runUrl.replace(/^https?:\/\//, '')));
  fact(L.evidenceDigest, `<span class="mono">${escape(evidence.digest ?? '—')}</span>`);
  return `<section class="sec" id="sec-provenance"><div class="label">${String(number).padStart(2, '0')}<br>${L.provenance}</div><div class="field"><dl class="facts">${rows.join('')}</dl></div></section>`;
}

function eyebrow(p, evidence, L) {
  const parts = [L.eyebrow];
  if (p.repository) parts.push(p.repository);
  if (p.pullRequest) parts.push(`#${p.pullRequest}`);
  else if (p.releaseTag) parts.push(p.releaseTag);
  parts.push(`${evidence.base.sha ? evidence.base.sha.slice(0, 7) : L.emptyTree} → ${evidence.head.sha.slice(0, 7)}`);
  if (p.status !== 'complete') parts.push(L[p.status] ?? p.status);
  return parts.map(escape).join(' · ');
}

export function renderReport({ report, evidence, provenance, language, title, css }) {
  const L = LABELS[language] ?? LABELS.en;
  const url = links({ serverUrl: provenance.serverUrl, repository: provenance.repository, base: evidence.base, head: evidence.head, rule: evidence.rule });
  const body = [];
  body.push(`<p class="eyebrow">${eyebrow(provenance, evidence, L)}</p>`);
  let n = 0;
  if (report) {
    body.push(`<h1>${escape(report.title)}</h1>`);
    body.push(`<p class="stand">${escape(report.standfirst)}</p>`);
    body.push(`<div class="hero"><div class="was"><span class="cap">${L.before}</span><span class="claim">${escape(report.hero.before)}</span></div><div class="mid"><svg class="draw" style="--dd-draw-width:56px" viewBox="0 0 56 16" aria-hidden="true"><path class="draw-line draw-arrow tone-accent" d="M2 8H54"/></svg></div><div class="now"><span class="cap">${L.after}</span><span class="claim">${escape(report.hero.after)}</span>${report.hero.unit ? `<span class="unit">${escape(report.hero.unit)}</span>` : ''}</div></div>`);
    for (const section of report.sections) body.push(renderSection(section, ++n, L, url));
    body.push(renderFindings(report, ++n, L));
    if (report.migration.length) body.push(renderMigration(report, ++n, L));
  } else {
    body.push(`<h1>${escape(title)}</h1>`);
    body.push(`<div class="empty"><p class="empty-title">${L.emptyTitle}</p><p class="empty-note">${L.emptyNote}</p></div>`);
  }
  if (report || evidence.files.length || evidence.commits.length) body.push(renderEvidence(evidence, ++n, L, url));
  body.push(renderProvenance(provenance, evidence, ++n, L, url));

  return `<!doctype html>
<html lang="${escape(language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'">
<meta name="color-scheme" content="light dark">
<meta name="generator" content="${escape(`${ACTION_NAME} ${ACTION_VERSION}`)}">
<meta name="robots" content="noindex">
<title>${escape(title)}</title>
<style>
${css}
</style>
</head>
<body>
${drawDefs}
<article class="sheet" lang="${escape(language)}">
${body.join('\n')}
</article>
</body>
</html>
`;
}
