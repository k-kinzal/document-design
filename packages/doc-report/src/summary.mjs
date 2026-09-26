// Job Summary, pull request comment and release-notes block. All three say
// the same things: which commits were compared, whether the report is
// complete, where the HTML is, and what it takes to open it.

const TEXT = {
  en: {
    title: 'Change report', view: 'View HTML report', download: 'Download HTML (release asset)', compared: 'Compared', status: 'Status', workflow: 'Workflow', retention: (days) => `Retention: ${days} days from upload. GitHub sign-in and repository read access are required; the link stops working when the artifact expires or is deleted.`,
    statuses: { complete: 'Complete', partial: 'Partial (some evidence was not read)', empty: 'Empty (no changes)', skipped: 'Skipped', failed: 'Failed' },
    failedHead: (sha) => `Report generation failed for \`${sha}\`.`, seeRun: 'See the workflow run for details.', previous: (sha) => `Previous report (for \`${sha}\`)`, expired: 'expired', deleted: 'deleted', skippedReason: (r) => `No report was generated: ${r}`, publishFailed: (r) => `The report was generated but could not be published: ${r}`,
    releaseBlock: 'Change report', releaseAsset: 'Download the HTML report (release asset)', releaseArtifact: 'Browser preview (workflow artifact, expires)',
  },
  ja: {
    title: '変更レポート', view: 'HTMLレポートを見る', download: 'HTMLをダウンロード（Release asset）', compared: '比較', status: '状態', workflow: 'ワークフロー', retention: (days) => `保持期間: アップロードから${days}日。閲覧にはGitHubへのサインインとリポジトリの読み取り権限が必要で、Artifactの期限切れや削除後は開けない。`,
    statuses: { complete: '完全', partial: '一部省略（読んでいない根拠がある）', empty: '差分なし', skipped: 'スキップ', failed: '失敗' },
    failedHead: (sha) => `\`${sha}\` のレポート生成に失敗した。`, seeRun: '詳細はワークフロー実行を参照。', previous: (sha) => `以前のレポート（\`${sha}\` 向け）`, expired: '期限切れ', deleted: '削除済み', skippedReason: (r) => `レポートは生成されなかった: ${r}`, publishFailed: (r) => `レポートは生成されたが公開できなかった: ${r}`,
    releaseBlock: '変更レポート', releaseAsset: 'HTMLレポートをダウンロード（Release asset）', releaseArtifact: 'ブラウザ表示（ワークフローArtifact、期限付き）',
  },
};

export const t = (language) => TEXT[language] ?? TEXT.en;

const short = (sha) => (sha ? String(sha).slice(0, 12) : '—');

function comparedLine(state, T) {
  const base = state.baseSha ? `\`${short(state.baseSha)}\`` : '(empty tree)';
  return `${T.compared}: ${base} → \`${short(state.headSha)}\``;
}

export function jobSummary(state, language = 'en') {
  const T = t(language);
  const lines = [`## ${T.title}${state.reportId && state.reportId !== 'default' ? ` (${state.reportId})` : ''}`, ''];
  if (state.status === 'skipped') {
    lines.push(T.skippedReason(state.reason ?? 'skipped'));
    if (state.runUrl) lines.push('', `${T.workflow}: ${state.runUrl}`);
    return lines.join('\n') + '\n';
  }
  if (state.status === 'failed') {
    lines.push(`**${T.statuses.failed}**: ${state.reason ?? 'unknown error'}`);
    if (state.headSha) lines.push('', comparedLine(state, T));
    if (state.runUrl) lines.push('', `${T.workflow}: ${state.runUrl}`);
    return lines.join('\n') + '\n';
  }
  if (state.artifactUrl) lines.push(`**${T.view}**: ${state.artifactUrl}`, '');
  lines.push(comparedLine(state, T), `${T.status}: ${T.statuses[state.status] ?? state.status}`);
  if (state.runUrl) lines.push(`${T.workflow}: ${state.runUrl}`);
  if (state.retentionDays) lines.push(T.retention(state.retentionDays));
  if (state.notes?.length) lines.push('', ...state.notes.map((n) => `- ${n}`));
  return lines.join('\n') + '\n';
}

// ---- pull request comment ----

export const marker = (reportId) => `<!-- document-design:report:${reportId} -->`;
const META_RE = /<!--\s*document-design:report-meta\s+(\{[\s\S]*?\})\s*-->/;

export function parseCommentMeta(body) {
  const m = META_RE.exec(String(body ?? ''));
  if (!m) return null;
  try {
    const meta = JSON.parse(m[1]);
    return meta && typeof meta === 'object' ? meta : null;
  } catch {
    return null;
  }
}

export function isOurComment(body, reportId) {
  return String(body ?? '').trimStart().startsWith(marker(reportId));
}

export function prCommentBody({ reportId, language = 'en', meta, outcome, previous = null }) {
  const T = t(language);
  const lines = [marker(reportId), `<!-- document-design:report-meta ${JSON.stringify(meta).replace(/--/g, '-​-')} -->`, `## ${T.title}${reportId !== 'default' ? ` (${reportId})` : ''}`, ''];
  if (outcome === 'success') {
    lines.push(`**${T.view}**: ${meta.url}`, '');
    lines.push(comparedLine({ baseSha: meta.base, headSha: meta.head }, T), `${T.status}: ${T.statuses[meta.status] ?? meta.status}`, `${T.workflow}: ${meta.run_url}`);
    if (meta.retention) lines.push(T.retention(meta.retention));
  } else {
    lines.push(T.failedHead(short(meta.head)), T.seeRun, '', `${T.workflow}: ${meta.run_url}`);
    if (previous?.url) {
      const state = previous.expired ? ` (${T.expired})` : previous.deleted ? ` (${T.deleted})` : '';
      lines.push('', `${T.previous(short(previous.head))}${state}: ${previous.url}`);
    }
  }
  return lines.join('\n') + '\n';
}

// ---- release notes block ----

export const releaseMarkers = (reportId) => ({ start: `<!-- document-design:report:${reportId}:start -->`, end: `<!-- document-design:report:${reportId}:end -->` });

export function releaseBlock({ reportId, language = 'en', assetUrl, artifactUrl, baseSha, headSha, status, runUrl }) {
  const T = t(language);
  const { start, end } = releaseMarkers(reportId);
  const lines = [start, `### ${T.releaseBlock}${reportId !== 'release' ? ` (${reportId})` : ''}`, '', `- ${T.releaseAsset}: ${assetUrl}`];
  if (artifactUrl) lines.push(`- ${T.releaseArtifact}: ${artifactUrl}`);
  lines.push(`- ${comparedLine({ baseSha, headSha }, T)}`, `- ${T.status}: ${T.statuses[status] ?? status}`);
  if (runUrl) lines.push(`- ${T.workflow}: ${runUrl}`);
  lines.push(end);
  return lines.join('\n');
}

export function upsertReleaseBlock(body, block, reportId) {
  const { start, end } = releaseMarkers(reportId);
  const text = String(body ?? '');
  const s = text.indexOf(start);
  const e = text.indexOf(end);
  if (s >= 0 && e > s) return `${text.slice(0, s)}${block}${text.slice(e + end.length)}`;
  return text.trim() ? `${text.replace(/\s+$/, '')}\n\n${block}\n` : `${block}\n`;
}
