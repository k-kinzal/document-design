import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { packageRoot, tempDir } from './helpers.mjs';

for (const uploaded of [true, false]) {
  test(`image upload ${uploaded ? 'succeeds and records provenance' : 'fails the finishing step'}`, t => {
    const { dir, cleanup } = tempDir();
    t.after(cleanup);
    const manifestPath = join(dir, 'report.manifest.json');
    writeFileSync(manifestPath, JSON.stringify({ image: { file: 'report.png', digest: 'sha256:test' } }));
    writeFileSync(join(dir, 'state.json'), JSON.stringify({ status: 'complete', upload: true, imagePath: join(dir, 'report.png'), manifestPath, files: { html: 'report.html' }, retentionDays: 30 }));
    const env = {
      ...process.env, DD_REPORT_STATE_DIR: dir, GITHUB_OUTPUT: join(dir, 'outputs'), GITHUB_STEP_SUMMARY: join(dir, 'summary'),
      DD_ARTIFACT_ID: '5', DD_ARTIFACT_URL: 'https://artifacts/5', DD_IMAGE_ARTIFACT_ID: uploaded ? '8' : '', DD_IMAGE_ARTIFACT_URL: uploaded ? 'https://artifacts/8' : '',
      DD_MANIFEST_ARTIFACT_ID: '6', DD_MANIFEST_ARTIFACT_URL: 'https://artifacts/6',
    };
    const run = command => spawnSync(process.execPath, [join(packageRoot, 'src/cli.mjs'), command], { env, encoding: 'utf8' });
    const manifest = run('manifest');
    assert.equal(manifest.status, 0, manifest.stderr);
    const state = JSON.parse(readFileSync(join(dir, 'state.json')));
    assert.equal(state.upload, uploaded);
    const finish = run('finish');
    assert.equal(finish.status, uploaded ? 0 : 1, finish.stderr);
    if (uploaded) {
      assert.deepEqual(JSON.parse(readFileSync(manifestPath)).image.artifact, { id: 8, url: 'https://artifacts/8' });
      assert.match(readFileSync(env.GITHUB_OUTPUT, 'utf8'), /image-artifact-id=8\n/);
    } else {
      assert.match(state.reason, /PNG artifact upload/);
      assert.match(readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8'), /Failed/);
    }
  });
}
