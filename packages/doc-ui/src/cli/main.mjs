#!/usr/bin/env node
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import pkg from '../../package.json' with { type: 'json' };
import { help, parseOptions } from './options.mjs';
import { renderMarkdown } from './render.mjs';

process.stdout.on('error', error => {
  if (error.code === 'EPIPE') process.exit(0);
  console.error(`doc-ui: ${error.message}`);
  process.exit(1);
});

async function run() {
  const options = parseOptions(process.argv.slice(2));
  if (options.help) return process.stdout.write(help);
  if (options.version) return process.stdout.write(`${pkg.version}\n`);
  if (!options.input && process.stdin.isTTY) return process.stdout.write(help);
  const input = options.input && options.input !== '-' ? resolve(options.input) : null;
  const output = options.output && options.output !== '-' ? resolve(options.output) : null;
  if (input && output) {
    const source = await stat(input);
    const destination = await stat(output).catch(error => {
      if (error.code !== 'ENOENT') throw error;
      return null;
    });
    if (input === output || (destination && source.dev === destination.dev && source.ino === destination.ino)) {
      throw new Error('Input and output must be different files.');
    }
  }
  let markdown;
  if (input) markdown = await readFile(input, 'utf8');
  else {
    process.stdin.setEncoding('utf8');
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    markdown = chunks.join('');
  }
  const css = await readFile(new URL('./document-design.min.css', import.meta.url), 'utf8');
  const html = renderMarkdown(markdown, {
    ...options, css,
    fallbackTitle: input ? basename(input).replace(/\.(?:md|markdown)$/i, '') : 'Document',
    sourceDir: input ? dirname(input) : process.cwd(),
    outputDir: output ? dirname(output) : undefined,
  });
  if (output) {
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html, 'utf8');
  } else process.stdout.write(html);
}

run().catch(error => {
  console.error(`doc-ui: ${error.message}`);
  process.exitCode = 1;
});
