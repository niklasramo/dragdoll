import esbuild from 'esbuild';
import { solidPlugin } from 'esbuild-plugin-solid';
import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import path from 'path';

function createUmdName(exampleName) {
  const base = exampleName.replace(/[^a-zA-Z0-9_$]/g, '_');
  return base.length ? `SolidExample_${base}` : 'SolidExampleBundle';
}

async function buildExampleDirectories() {
  const examplesDir = path.join(process.cwd(), './solid-examples/');
  const directories = await fs.readdir(examplesDir, { withFileTypes: true });

  for (const dir of directories) {
    if (!dir.isDirectory()) continue;

    const exampleName = dir.name;
    const exampleHtmlPath = path.join(examplesDir, exampleName, 'index.html');
    const exampleTsPath = path.join(examplesDir, exampleName, 'index.tsx');
    const exampleCssPath = path.join(examplesDir, exampleName, 'index.css');
    const baseCssSrcPath = path.join(examplesDir, 'assets', 'base.css');

    try {
      await Promise.all([
        fs.access(exampleHtmlPath),
        fs.access(exampleTsPath),
        fs.access(exampleCssPath),
        fs.access(baseCssSrcPath),
      ]);
    } catch {
      continue;
    }

    const outputDir = path.join(process.cwd(), `./docs/public/solid-examples/${exampleName}`);
    await fs.mkdir(outputDir, { recursive: true });

    const outfile = path.join(outputDir, 'index.umd.js');
    await esbuild.build({
      entryPoints: [exampleTsPath],
      outfile,
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      jsx: 'automatic',
      jsxImportSource: 'solid-js',
      sourcemap: false,
      minify: true,
      logLevel: 'silent',
      globalName: createUmdName(exampleName),
      alias: {
        'dragdoll-solid': path.resolve(process.cwd(), '../dragdoll-solid/src/index.ts'),
      },
      plugins: [
        solidPlugin({
          dev: false,
          generate: 'dom',
        }),
      ],
    });

    await fs.copyFile(exampleCssPath, path.join(outputDir, 'index.css')).catch(() => {});
    await fs.copyFile(baseCssSrcPath, path.join(outputDir, 'base.css')).catch(() => {});

    try {
      const html = await fs.readFile(exampleHtmlPath, 'utf8');
      const dom = new JSDOM(html);
      const { document } = dom.window;

      Array.from(document.querySelectorAll('link[rel="stylesheet"]')).forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href.includes('../assets/base.css')) {
          link.setAttribute('href', 'base.css');
        }
      });

      Array.from(document.querySelectorAll('script')).forEach((script) => {
        const src = script.getAttribute('src') || '';
        if (src.endsWith('index.tsx')) {
          script.removeAttribute('type');
          script.setAttribute('src', 'index.umd.js');
        }
      });

      await fs.writeFile(path.join(outputDir, 'index.html'), dom.serialize());
    } catch {
      // TODO: add logging if needed
    }

    console.log(`Built Solid example: ${exampleName}`);
  }
}

async function buildExamplesMarkdown() {
  const examplesDir = path.join(process.cwd(), './solid-examples/');
  const markdownFilePath = path.join(process.cwd(), './docs/solid/examples.md');
  await fs.mkdir(path.dirname(markdownFilePath), { recursive: true });

  let markdownContent = '# Solid Examples\n\n';

  const directories = await fs.readdir(examplesDir, { withFileTypes: true });
  for (const dir of directories) {
    if (!dir.isDirectory()) continue;

    const exampleName = dir.name;
    const indexHtmlPath = path.join(examplesDir, exampleName, 'index.html');
    const indexTsPath = path.join(examplesDir, exampleName, 'index.tsx');
    const indexCssPath = path.join(examplesDir, exampleName, 'index.css');
    const baseCssPath = path.join(examplesDir, 'assets', 'base.css');

    try {
      await Promise.all([
        fs.access(indexHtmlPath),
        fs.access(indexTsPath),
        fs.access(indexCssPath),
        fs.access(baseCssPath),
      ]);
    } catch {
      continue;
    }

    try {
      let indexHtmlContent = await fs.readFile(indexHtmlPath, 'utf8');
      const indexTsContent = await fs.readFile(indexTsPath, 'utf8');
      const indexCssContent = await fs.readFile(indexCssPath, 'utf8');
      const baseCssContent = await fs.readFile(baseCssPath, 'utf8');

      const dom = new JSDOM(indexHtmlContent);
      const { document } = dom.window;
      const title = document.title || exampleName;
      const description = document.querySelector('meta[name="description"]')?.content || '';

      indexHtmlContent = indexHtmlContent.replace('../assets/base.css', 'base.css');

      markdownContent += `## ${title}\n\n`;
      if (description) {
        markdownContent += `${description}\n\n`;
      }
      markdownContent += `<div class="example"><iframe src="/dragdoll/solid-examples/${exampleName}/index.html"></iframe>`;
      markdownContent += `<a class="example-link" target="_blank" href="/dragdoll/solid-examples/${exampleName}/index.html" title="Open in a new tab">`;
      markdownContent += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>\n\n`;
      markdownContent += '::: code-group\n\n';
      markdownContent += '```tsx [index.tsx]\n' + indexTsContent + '\n```\n\n';
      markdownContent += '```html [index.html]\n' + indexHtmlContent + '\n```\n\n';
      markdownContent += '```css [index.css]\n' + indexCssContent + '\n```\n\n';
      markdownContent += '```css [base.css]\n' + baseCssContent + '\n```\n\n';
      markdownContent += ':::\n\n';
      console.log(`Added Solid example documentation: ${exampleName}`);
    } catch (error) {
      console.log(`Error processing Solid example documentation: ${exampleName}`);
      console.log(error);
    }
  }

  await fs.writeFile(markdownFilePath, markdownContent);
}

async function buildAll() {
  await buildExampleDirectories();
  await buildExamplesMarkdown();
}

buildAll();
