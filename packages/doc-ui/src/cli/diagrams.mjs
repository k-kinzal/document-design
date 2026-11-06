import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadChromium } from '../image.mjs';

async function boundedRender(promise) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Diagram rendering exceeded 30 seconds. Simplify the diagram.')), 30_000);
    })]);
  } finally { clearTimeout(timer); }
}

export async function renderDiagrams(tokens, options) {
  if (!tokens.length) return;
  const chromium = options.chromium ?? await loadChromium('Mermaid rendering');
  let browser;
  try {
    browser = await chromium.launch(options.launchOptions ?? {});
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, javaScriptEnabled: true, serviceWorkers: 'block' });
    page.setDefaultTimeout(30_000);
    // Diagram input must never fetch resources, including from the local disk.
    await page.route('**/*', route => route.abort());
    await page.setContent('<!doctype html><html><head></head><body></body></html>');
    await page.addStyleTag({ content: options.css ?? '' });
    const shipped = new URL('./mermaid.js', import.meta.url);
    const bundle = existsSync(shipped) ? shipped : new URL('../../dist/mermaid.js', import.meta.url);
    await page.addScriptTag({ path: fileURLToPath(bundle) });
    for (const [index, token] of tokens.entries()) {
      try {
        token.meta = await boundedRender(page.evaluate(async ({ source, index, color, lang }) => {
          const images = {};
          for (const theme of ['light', 'dark']) {
            document.documentElement.dataset.ddTheme = theme;
            document.documentElement.dataset.ddColor = color;
            document.documentElement.lang = lang;
            const probe = document.createElement('span');
            document.body.append(probe);
            const colorValue = name => {
              probe.style.color = `var(--dd-${name})`;
              const canvas = document.createElement('canvas').getContext('2d');
              canvas.fillStyle = getComputedStyle(probe).color;
              // Canvas normalizes CSS colors for Mermaid's color arithmetic.
              canvas.fillRect(0, 0, 1, 1);
              return '#' + [...canvas.getImageData(0, 0, 1, 1).data].slice(0, 3).map(n => n.toString(16).padStart(2, '0')).join('');
            };
            const fg = colorValue('fg');
            const bg = colorValue('bg');
            const surface = colorValue('surface');
            const border = colorValue('border-strong');
            const accent = colorValue('accent');
            probe.style.fontSize = 'var(--dd-text-md)';
            const fontSize = getComputedStyle(probe).fontSize;
            const fontFamily = getComputedStyle(document.body).fontFamily;
            probe.remove();
            globalThis.docUiMermaid.initialize({
              startOnLoad: false, securityLevel: 'strict', htmlLabels: false,
              theme: 'base', fontFamily, fontSize: parseFloat(fontSize),
              deterministicIds: true, deterministicIDSeed: `dd-diagram-${index}-${theme}`,
              // Authored config cannot enable script/HTML, inject CSS or load a
              // different renderer. Local styling remains part of the diagram.
              secure: ['secure', 'securityLevel', 'startOnLoad', 'htmlLabels', 'theme', 'themeCSS', 'themeVariables', 'fontFamily', 'fontSize', 'layout', 'look', 'maxTextSize', 'maxEdges'],
              themeVariables: {
                darkMode: theme === 'dark', fontFamily, fontSize,
                background: bg, primaryColor: surface, primaryTextColor: fg,
                primaryBorderColor: border, secondaryColor: surface, secondaryTextColor: fg,
                secondaryBorderColor: border, tertiaryColor: bg, tertiaryTextColor: fg,
                tertiaryBorderColor: border, lineColor: fg, textColor: fg,
                mainBkg: surface, nodeBorder: border, clusterBkg: bg, clusterBorder: border,
                edgeLabelBackground: bg, titleColor: fg, actorBkg: surface,
                actorBorder: border, actorTextColor: fg, actorLineColor: border,
                signalColor: fg, signalTextColor: fg, labelBoxBkgColor: surface,
                labelBoxBorderColor: border, labelTextColor: fg, loopTextColor: fg,
                noteBkgColor: surface, noteTextColor: fg, noteBorderColor: border,
                activationBkgColor: surface, activationBorderColor: border,
                cScale0: surface, cScaleLabel0: fg, taskBkgColor: surface,
                taskBorderColor: border, taskTextColor: fg, activeTaskBkgColor: surface,
                activeTaskBorderColor: accent, doneTaskBkgColor: surface,
                doneTaskBorderColor: border, todayLineColor: accent,
              },
            });
            const { svg } = await globalThis.docUiMermaid.render(`dd-diagram-${index}-${theme}`, source);
            const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
            const root = doc.documentElement;
            const viewBox = root.getAttribute('viewBox')?.split(/[\s,]+/).map(Number);
            if (!viewBox || viewBox.length !== 4 || !viewBox.every(Number.isFinite) || viewBox[2] <= 0 || viewBox[3] <= 0) throw new Error('Diagram has no usable dimensions.');
            root.setAttribute('width', viewBox[2]);
            root.setAttribute('height', viewBox[3]);
            root.style.maxWidth = 'none';
            // An SVG image is inert in the output. Also strip resource and
            // navigation targets so it stays self-contained when extracted.
            if (root.querySelector('foreignObject, image')) throw new Error('Use plain text labels; HTML labels and external images are not supported.');
            for (const element of root.querySelectorAll('script')) element.remove();
            for (const element of [root, ...root.querySelectorAll('*')]) {
              for (const attribute of [...element.attributes]) {
                if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
                if (/^(?:href|xlink:href)$/i.test(attribute.name)) {
                  if (element.localName === 'use' && attribute.value.startsWith('#')) continue;
                  if (element.localName === 'use') throw new Error('External SVG resources are not supported.');
                  element.removeAttribute(attribute.name);
                }
              }
            }
            images[theme] = { svg: new XMLSerializer().serializeToString(root), width: viewBox[2], height: viewBox[3] };
            images.title ??= root.querySelector('title')?.textContent || '';
            images.description ??= root.querySelector('desc')?.textContent || '';
          }
          return images;
        }, { source: token.content, index, color: options.color, lang: options.lang }));
      } catch (error) {
        throw new Error(`Mermaid block at line ${(token.map?.[0] ?? 0) + 1}: ${error.message}`, { cause: error });
      }
    }
  } finally {
    await browser?.close();
  }
}
