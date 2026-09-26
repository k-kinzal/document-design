#!/usr/bin/env node
// A stand-in for the Copilot CLI used by tests and local dry runs. It takes
// the same flags, records what it was given, and prints a canned answer.
// Its output is fake and says nothing about real generation quality.
//
//   FAKE_COPILOT_RESPONSE   path of the response file to print, or one of
//                           the built-in names below
//   FAKE_COPILOT_RECORD     path where the received arguments, environment
//                           and prompt are written as JSON
//   FAKE_COPILOT_EXIT       exit code to fail with (default 0)
//   FAKE_COPILOT_STDERR     text to print on stderr before exiting
//   FAKE_COPILOT_SLEEP_MS   delay before answering
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const prompt = args[args.indexOf('-p') + 1] ?? '';
const usageFile = args[args.indexOf('--usage-output-file') + 1];
const promptFile = /Read the file (\S+) in the current directory/.exec(prompt)?.[1];
const fullPrompt = promptFile && existsSync(join(process.cwd(), promptFile)) ? readFileSync(join(process.cwd(), promptFile), 'utf8') : prompt;

if (process.env.FAKE_COPILOT_RECORD) {
  writeFileSync(process.env.FAKE_COPILOT_RECORD, JSON.stringify({ args, cwd: process.cwd(), env: process.env, prompt: fullPrompt, promptFile: promptFile ?? null }, null, 2));
}

const delay = Number(process.env.FAKE_COPILOT_SLEEP_MS || 0);
if (delay) await new Promise((r) => setTimeout(r, delay));

if (process.env.FAKE_COPILOT_STDERR) process.stderr.write(process.env.FAKE_COPILOT_STDERR + '\n');
if (Number(process.env.FAKE_COPILOT_EXIT || 0)) process.exit(Number(process.env.FAKE_COPILOT_EXIT));

if (usageFile) writeFileSync(usageFile, JSON.stringify({ models: { 'fake-model-1': { requests: 1, usage: { inputTokens: 1200, outputTokens: 300 } } } }));

const builtin = {
  // Cites the first file and first commit it finds in the prompt.
  valid: () => {
    const file = /^- [AMDRCT]\d* (\S+)/m.exec(fullPrompt)?.[1] ?? 'README.md';
    const sha = /^- ([0-9a-f]{40}) /m.exec(fullPrompt)?.[1];
    const ja = /Write every string in Japanese/.test(fullPrompt);
    return JSON.stringify(ja ? {
      title: '生成物を一つの入口へまとめる',
      standfirst: '別々に育っていた三つの生成器の出力を、同じ約束の下に置き直す。',
      hero: { before: '生成器ごとに別の出力', after: '一つの契約で生成', unit: null },
      sections: [
        { kind: 'intent', lead: '一つの契約に集めるための変更。', paragraphs: ['各生成器が独自に決めていた出力形式を、共有の形に置き換える。'], compare: { before: { title: '変更前', items: ['形式が三つ', '説明は各自'] }, after: { title: '変更後', items: ['形式が一つ', '説明は共有'] } }, flow: null, facts: null, evidence: [file, ...(sha ? [sha] : [])], caveat: 'テスト結果は根拠に含まれていない。' },
        { kind: 'verification', lead: '検証は根拠に含まれない。', paragraphs: [], compare: null, flow: [{ name: '読む', detail: '差分を読む' }, { name: '書く', detail: 'レポートを書く' }], facts: [{ term: '契約', definition: '生成器が守る出力の形。' }], evidence: [], caveat: null },
      ],
      findings: [{ status: 'verified', text: `${file} が変更された。` }, { status: 'unverified', text: 'テストの通過は確認できない。' }],
      migration: [],
    } : {
      title: 'One entry point for the generated pages',
      standfirst: 'Three generators that had grown apart are put back under one promise.',
      hero: { before: 'A format per generator', after: 'One contract', unit: null },
      sections: [
        { kind: 'intent', lead: 'The change gathers the output formats into one contract.', paragraphs: ['Each generator had decided its own output shape; the shared shape replaces them.'], compare: { before: { title: 'Before', items: ['Three formats', 'Explanations per generator'] }, after: { title: 'After', items: ['One format', 'Shared explanation'] } }, flow: null, facts: null, evidence: [file, ...(sha ? [sha] : [])], caveat: 'No test results were part of the evidence.' },
        { kind: 'verification', lead: 'Verification is not in the evidence.', paragraphs: [], compare: null, flow: [{ name: 'Read', detail: 'Read the diff' }, { name: 'Write', detail: 'Write the report' }], facts: [{ term: 'Contract', definition: 'The output shape every generator keeps.' }], evidence: [], caveat: null },
      ],
      findings: [{ status: 'verified', text: `${file} changed.` }, { status: 'unverified', text: 'Test success cannot be confirmed.' }],
      migration: [],
    });
  },
  invalid: () => '{"title": "Missing everything"}',
  garbage: () => 'I cannot help with that.',
  // Cites something the evidence does not contain.
  hallucinated: () => JSON.stringify({ title: 'x', standfirst: 'y', hero: { before: 'a', after: 'b', unit: null }, sections: [{ kind: 'intent', lead: 'lead', paragraphs: [], compare: null, flow: null, facts: null, evidence: ['src/does-not-exist.php'], caveat: null }], findings: [{ status: 'verified', text: 'ok' }], migration: [] }),
  // Tries to smuggle markup and a script through the strings.
  hostile: () => JSON.stringify({ title: '<script>alert(1)</script>Title', standfirst: 'y <img src=x onerror=alert(1)>', hero: { before: 'a', after: 'b', unit: null }, sections: [{ kind: 'intent', lead: 'lead', paragraphs: ['javascript:alert(1)'], compare: null, flow: null, facts: null, evidence: [], caveat: null }], findings: [{ status: 'verified', text: 'ok' }], migration: [] }),
};

const which = process.env.FAKE_COPILOT_RESPONSE || 'valid';
const text = builtin[which] ? builtin[which]() : readFileSync(which, 'utf8');
process.stdout.write(text + '\n');
