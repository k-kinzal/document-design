// The action manifests, the dogfooding workflows and the shipped examples
// are contracts. This checks the parts a consumer relies on: input and
// output names, path resolution from each action's own location, pinned
// third-party actions, non-zipped uploads, and least-privilege permissions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parse } from 'yaml';
import { packageRoot, repoRoot } from './helpers.mjs';

const read = (path) => parse(readFileSync(join(repoRoot, path), 'utf8'));
const UPLOAD_ARTIFACT = 'actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a';

const COMMON_INPUTS = ['github-token', 'repository-path', 'base', 'head', 'language', 'title', 'instructions', 'model', 'report-id', 'retention-days', 'timeout-seconds', 'max-input-bytes', 'max-attempts', 'on-empty'];
const OUTPUTS = ['status', 'has-changes', 'report-path', 'manifest-path', 'artifact-id', 'artifact-url', 'manifest-artifact-id', 'base-ref', 'head-ref', 'base-sha', 'head-sha', 'base-tree', 'run-url', 'reason'];

// Resolve the DD_REPORT_ACTION_PATH expression the way the runner would,
// from the directory the action.yml lives in.
function actionPathOf(step, actionDir) {
  const expression = step.env.DD_REPORT_ACTION_PATH;
  assert.match(expression, /^\$\{\{ github\.action_path \}\}/);
  return resolve(actionDir, expression.replace('${{ github.action_path }}', '.'));
}

for (const [file, expectedInputs, defaults] of [
  ['action.yml', [...COMMON_INPUTS, 'mode', 'pr-number'], { mode: 'auto', 'report-id': 'default' }],
  ['actions/release/action.yml', [...COMMON_INPUTS, 'base-strategy', 'initial-release'], { 'report-id': 'release', 'base-strategy': 'previous-stable', 'initial-release': 'full' }],
]) {
  test(`${file}: inputs, outputs, steps and path resolution`, () => {
    const action = read(file);
    assert.deepEqual(Object.keys(action.inputs).sort(), expectedInputs.sort());
    assert.deepEqual(Object.keys(action.outputs).sort(), OUTPUTS.sort());
    for (const [name, value] of Object.entries(defaults)) assert.equal(action.inputs[name].default, value, name);
    assert.equal(action.inputs['github-token'].default, '${{ github.token }}');
    assert.equal(action.inputs['retention-days'].default, '30');
    assert.equal(action.inputs['timeout-seconds'].default, '600');
    assert.equal(action.inputs['max-input-bytes'].default, '200000');
    assert.equal(action.inputs['max-attempts'].default, '2');
    assert.equal(action.inputs['on-empty'].default, 'report');
    assert.equal(action.inputs.model.default, 'auto');
    assert.equal(action.runs.using, 'composite');
    const steps = Object.fromEntries(action.runs.steps.map((s) => [s.id, s]));
    assert.deepEqual(Object.keys(steps), ['generate', 'upload', 'manifest', 'upload-manifest', 'finish']);
    const actionDir = dirname(join(repoRoot, file));
    for (const id of ['generate', 'manifest', 'finish']) {
      const root = actionPathOf(steps[id], actionDir);
      assert.equal(root, repoRoot, `${id} resolves the repository root from ${file}`);
      assert.ok(existsSync(join(root, 'packages/doc-report/dist/report.mjs')));
      assert.match(steps[id].run, /packages\/doc-report\/dist\/report\.mjs/);
      assert.equal(steps[id].shell, 'bash');
      assert.match(steps[id].env.DD_REPORT_STATE_DIR, /^\$\{\{ runner\.temp \}\}\/document-design-report\/\$\{\{ github\.action \}\}$/);
    }
    assert.equal(steps.finish.if, 'always()');
    for (const id of ['upload', 'upload-manifest']) {
      assert.equal(steps[id].uses, UPLOAD_ARTIFACT);
      assert.equal(steps[id].with.archive, false);
      assert.equal(steps[id].with['if-no-files-found'], 'error');
      assert.equal(steps[id].with['retention-days'], '${{ inputs.retention-days }}');
    }
    assert.equal(steps.upload.if, "steps.generate.outputs.upload == 'true'");
    assert.equal(steps['upload-manifest'].if, "steps.manifest.outputs.upload == 'true'");
    // Every input reaches the generator as an environment variable, never
    // interpolated into the shell script.
    for (const name of expectedInputs) {
      const key = `DD_INPUT_${name.toUpperCase().replace(/-/g, '_')}`;
      assert.equal(steps.generate.env[key], `\${{ inputs.${name} }}`, key);
    }
    assert.ok(!/\$\{\{\s*inputs\./.test(steps.generate.run), 'no input expression inside run:');
    const modeFlag = /--mode=(\w+) --report-id=(\w+)/.exec(steps.generate.run);
    assert.equal(modeFlag[1], file === 'action.yml' ? 'auto' : 'release');
    assert.equal(modeFlag[2], defaults['report-id']);
  });
}

test('actions/publish/action.yml: inputs, outputs and path resolution', () => {
  const action = read('actions/publish/action.yml');
  assert.deepEqual(Object.keys(action.inputs).sort(), ['comment-author', 'create-draft', 'generation-result', 'github-token', 'pr-number', 'release-tag', 'replace-assets', 'report-id', 'source-run-id', 'target', 'update-release-body'].sort());
  assert.equal(action.inputs.target.required, true);
  assert.equal(action.inputs['source-run-id'].default, '${{ github.run_id }}');
  assert.equal(action.inputs['create-draft'].default, 'false');
  assert.equal(action.inputs['update-release-body'].default, 'true');
  assert.equal(action.inputs['replace-assets'].default, 'false');
  assert.deepEqual(Object.keys(action.outputs).sort(), ['asset-url', 'comment-url', 'message', 'outcome', 'release-url']);
  const [step] = action.runs.steps;
  assert.equal(actionPathOf(step, join(repoRoot, 'actions/publish')), repoRoot);
  assert.match(step.run, /report\.mjs" publish/);
  assert.ok(!step.env.DD_INPUT_MODE, 'the publisher takes no generation inputs');
});

function checkWorkflowPermissions(workflow, file) {
  assert.deepEqual(workflow.permissions, {}, `${file}: top-level permissions are empty`);
  for (const [name, job] of Object.entries(workflow.jobs)) {
    assert.ok(job.permissions !== undefined, `${file}: job ${name} declares permissions`);
    const perms = job.permissions ?? {};
    const usesGenerator = (job.steps ?? []).some((s) => /document-design(@|\/actions\/release@)|^\.\/$|actions\/release$/.test(String(s.uses ?? '')));
    const usesPublisher = (job.steps ?? []).some((s) => /actions\/publish(@|$)/.test(String(s.uses ?? '')));
    if (usesGenerator) {
      assert.equal(perms['copilot-requests'], 'write', `${file}: ${name} needs copilot-requests: write`);
      assert.equal(perms.contents, 'read', `${file}: ${name} reads contents only`);
      for (const key of ['pull-requests', 'issues', 'actions']) assert.notEqual(perms[key], 'write', `${file}: ${name} must not write ${key}`);
    }
    if (usesPublisher) {
      assert.equal(perms['copilot-requests'], undefined, `${file}: ${name} runs no model`);
      assert.equal(perms.actions, 'read', `${file}: ${name} reads artifacts`);
      assert.ok(perms['pull-requests'] === 'write' || perms.contents === 'write', `${file}: ${name} writes its target`);
    }
    for (const step of job.steps ?? []) {
      const uses = String(step.uses ?? '');
      if (uses.startsWith('actions/')) assert.match(uses, /@[0-9a-f]{40} ?/, `${file}: ${name} pins ${uses} to a commit`);
      if (step.run) assert.ok(!/\$\{\{\s*(github\.event\.|inputs\.)/.test(step.run), `${file}: ${name} does not interpolate event data into run:`);
    }
  }
}

test('dogfooding workflows use the local action code and least privilege', () => {
  const main = read('.github/workflows/report-main.yml');
  assert.deepEqual(main.on.push.branches, ['main']);
  assert.ok(main.on.workflow_dispatch.inputs.base.required && main.on.workflow_dispatch.inputs.head.required);
  checkWorkflowPermissions(main, 'report-main.yml');
  const reportSteps = main.jobs.report.steps;
  assert.ok(reportSteps.some((s) => s.uses === './'), 'main uses the action at the pushed commit');
  assert.ok(reportSteps.some((s) => s.run === 'npm run build:report'));
  assert.equal(main.concurrency, undefined, 'each main push is an independent comparison');
  assert.ok(!('cancel-in-progress' in (main.concurrency ?? {})));

  const release = read('.github/workflows/report-release.yml');
  assert.deepEqual(release.on.push.tags, ['v*.*.*']);
  checkWorkflowPermissions(release, 'report-release.yml');
  const steps = release.jobs.report.steps;
  const checkouts = steps.filter((s) => s.uses?.startsWith('actions/checkout@'));
  assert.equal(checkouts.length, 2, 'the action (main) and the target are separate checkouts');
  assert.equal(checkouts[0].with.ref, 'main');
  assert.equal(checkouts[0].with.path, 'action');
  assert.equal(checkouts[1].with['fetch-depth'], 0);
  assert.equal(checkouts[1].with.path, 'target');
  const use = steps.find((s) => s.uses === './action/actions/release');
  assert.equal(use.with['repository-path'], 'target');
  assert.match(release.jobs.attach.if, /inputs\.attach/);
  assert.equal(release.jobs.attach.steps.at(-1).with['create-draft'], true);
  assert.equal(release.jobs.attach.steps.at(-1).uses, './action/actions/publish');

  // The action's own tags stay out of the product publication.
  const pages = read('.github/workflows/pages.yml');
  assert.deepEqual(pages.on.push.tags, ['v*.*.*']);
  assert.ok(!/report-v/.test('report-v1.0.0'.match(/^v\*\.\*\.\*$/)?.[0] ?? ''));
});

test('shipped examples are complete workflows with least privilege', () => {
  const dir = join(packageRoot, 'examples');
  const files = readdirSync(dir).filter((f) => f.endsWith('.yml'));
  assert.deepEqual(files.sort(), ['main-push-report.yml', 'manual-range-report.yml', 'pr-report.yml', 'prepare-release-report.yml', 'release-pipeline-step.yml', 'release-published-report.yml', 'tag-push-report.yml']);
  for (const file of files) {
    const workflow = parse(readFileSync(join(dir, file), 'utf8'));
    assert.ok(workflow.name && workflow.on && workflow.jobs, file);
    checkWorkflowPermissions(workflow, file);
    for (const job of Object.values(workflow.jobs)) for (const step of job.steps ?? []) {
      const uses = String(step.uses ?? '');
      if (uses.startsWith('k-kinzal/document-design')) assert.match(uses, /@report-v1$/, `${file}: ${uses}`);
    }
  }
  const pr = parse(readFileSync(join(dir, 'pr-report.yml'), 'utf8'));
  assert.match(pr.jobs.report.if, /head\.repo\.full_name == github\.repository/);
  assert.match(pr.jobs.report.if, /!github\.event\.pull_request\.draft/);
  assert.equal(pr.jobs.report.steps.find((s) => s.uses?.startsWith('actions/checkout')).with.ref, '${{ github.event.pull_request.head.sha }}');
  assert.match(pr.jobs.publish.if, /always\(\)/);
  assert.equal(pr.jobs.publish.concurrency['cancel-in-progress'], false);
  assert.ok(!pr.jobs.publish.steps.some((s) => s.uses?.startsWith('actions/checkout')), 'the publish job needs no checkout');
  assert.equal(pr.jobs.publish.steps.at(-1).with['generation-result'], '${{ needs.report.result }}');
  assert.ok(!Object.keys(pr.on).includes('pull_request_target'));
  const published = parse(readFileSync(join(dir, 'release-published-report.yml'), 'utf8'));
  assert.deepEqual(published.on.release.types, ['published']);
  assert.equal(Object.keys(published.jobs).length, 1, 'report-only on published releases');
});
