import test from 'node:test';
import assert from 'node:assert/strict';
import { isOurComment, jobSummary, marker, parseCommentMeta, prCommentBody, releaseBlock, upsertReleaseBlock } from '../src/summary.mjs';

test('job summary lists the link, the compared SHAs, the status and the retention terms', () => {
  const md = jobSummary({ status: 'partial', reportId: 'main', baseSha: 'a'.repeat(40), headSha: 'b'.repeat(40), artifactUrl: 'https://github.com/o/r/actions/runs/1/artifacts/2', runUrl: 'https://github.com/o/r/actions/runs/1', retentionDays: 30, notes: ['n1'] });
  assert.match(md, /^## Change report \(main\)/);
  assert.match(md, /\*\*View HTML report\*\*: https:\/\/github\.com\/o\/r\/actions\/runs\/1\/artifacts\/2/);
  assert.match(md, /Compared: `aaaaaaaaaaaa` → `bbbbbbbbbbbb`/);
  assert.match(md, /Status: Partial/);
  assert.match(md, /Retention: 30 days/);
  assert.match(md, /sign-in/);
  assert.match(md, /- n1/);
  const skipped = jobSummary({ status: 'skipped', reason: 'fork', runUrl: 'u' });
  assert.match(skipped, /No report was generated: fork/);
  assert.ok(!/artifacts/.test(skipped), 'no artifact link when skipped');
  const failed = jobSummary({ status: 'failed', reason: 'boom', runUrl: 'u' }, 'ja');
  assert.match(failed, /失敗/);
});

test('comment bodies start with the marker, carry parsable metadata and no placeholders', () => {
  const meta = { v: 1, repo: 'o/r', pr: 3, head: 'h', base: 'b', run: 10, attempt: 1, status: 'complete', artifact: 5, url: 'https://github.com/o/r/actions/runs/10/artifacts/5', evidence: 'sha256:x', retention: 30, run_url: 'https://github.com/o/r/actions/runs/10', outcome: 'success', language: 'en' };
  const body = prCommentBody({ reportId: 'default', language: 'en', meta, outcome: 'success' });
  assert.ok(body.startsWith(marker('default') + '\n'));
  assert.ok(isOurComment(body, 'default'));
  assert.ok(!isOurComment(body, 'other'));
  assert.deepEqual(parseCommentMeta(body), meta);
  assert.ok(!body.includes('<HTML'), 'no angle-bracket placeholders');
  assert.match(body, /\*\*View HTML report\*\*: https:/);
  const failure = prCommentBody({ reportId: 'default', language: 'ja', meta: { ...meta, outcome: 'failure' }, outcome: 'failure', previous: { url: 'https://old', head: 'oldhead1234567', expired: true } });
  assert.match(failure, /生成に失敗/);
  assert.match(failure, /以前のレポート（`oldhead12345` 向け） \(期限切れ\): https:\/\/old/);
  assert.equal(parseCommentMeta('no meta here'), null);
});

test('metadata containing "--" cannot close the HTML comment early', () => {
  const body = prCommentBody({ reportId: 'x', meta: { url: 'https://a--b', outcome: 'success', head: 'h', run_url: 'r', status: 'complete' }, outcome: 'success' });
  const comment = body.split('\n')[1];
  assert.ok(!/--[^>]*-->/.test(comment.slice(4, -3)), comment);
});

test('release notes blocks are upserted between markers and preserve the rest of the body', () => {
  const block = releaseBlock({ reportId: 'release', assetUrl: 'https://dl/a.html', artifactUrl: 'https://art', baseSha: 'a'.repeat(40), headSha: 'b'.repeat(40), status: 'complete', runUrl: 'https://run' });
  assert.match(block, /Download the HTML report \(release asset\): https:\/\/dl\/a\.html/);
  assert.match(block, /Browser preview \(workflow artifact, expires\): https:\/\/art/);
  const first = upsertReleaseBlock('## Notes\n\nHand-written.', block, 'release');
  assert.match(first, /^## Notes\n\nHand-written\.\n\n<!-- document-design:report:release:start -->/);
  const partial = releaseBlock({ reportId: 'release', assetUrl: 'https://dl/a.html', artifactUrl: null, baseSha: 'a'.repeat(40), headSha: 'b'.repeat(40), status: 'partial', runUrl: null });
  const again = upsertReleaseBlock(first + '\n\nTrailing text.', partial, 'release');
  assert.ok(again.includes('Hand-written.'));
  assert.ok(again.includes('Trailing text.'));
  assert.equal((again.match(/document-design:report:release:start/g) ?? []).length, 1);
  assert.match(again, /Status: Partial/);
});
