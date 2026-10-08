import { test, expect } from '@playwright/test';
import { execFile } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const cli = fileURLToPath(new URL('../dist/cli.mjs', import.meta.url));

test('CLI captures Japanese Markdown, local images and the end of a long document at 2× resolution', async ({ playwright }) => {
  test.setTimeout(60_000);
  const dir = await mkdtemp(join(tmpdir(), 'doc-ui-image-test-'));
  // Match the CLI's bundled Chromium rather than the suite's local Chrome channel.
  const browser = await playwright.chromium.launch({ channel: undefined });
  try {
    const input = join(dir, 'input.md');
    const output = join(dir, 'nested/report.html');
    const image = join(dir, 'images/report.png');
    await writeFile(join(dir, 'local.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="60"><rect width="80" height="60" fill="#123456"/></svg>');
    await writeFile(input, '# 日本語の変更レポート\n\n' + '日本語の本文とEnglish identifiersを一緒に読めます。\n\n'.repeat(70) + '![Local image](local.svg)\n\n最後の段落。');
    const env = { ...process.env };
    delete env.FORCE_COLOR;
    const result = await run(process.execPath, [cli, input, '--lang', 'ja', '--theme', 'dark', '-o', output, '--image', image, '--image-width', '640'], { env });
    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
    const png = await readFile(image);
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.readUInt32BE(16)).toBe(1280);
    expect(png.readUInt32BE(20)).toBeGreaterThan(1800);
    const reference = await browser.newPage({ viewport: { width: 640, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark', reducedMotion: 'reduce', javaScriptEnabled: false });
    await reference.goto(pathToFileURL(output).href);
    await expect(reference.locator('p').last()).toHaveText('最後の段落。');
    expect(await reference.locator('img').evaluate(image => image.complete && image.naturalWidth === 80)).toBe(true);
    const expected = await reference.screenshot({ fullPage: true, animations: 'disabled' });
    expect(png.equals(expected), 'PNG contains the full styled HTML, including the resolved local image').toBe(true);
  } finally {
    await browser.close();
    await rm(dir, { recursive: true, force: true });
  }
});
