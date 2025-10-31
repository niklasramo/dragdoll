import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import path from 'path';
import { build } from 'rolldown';

const CONFIG = {
  sourceDir: './examples/',
  publicSubdir: 'examples',
  markdownPath: './docs/examples.md',
  entryCandidates: ['index.tsx', 'index.ts'],
  iframeBase: '/dragdoll-react/examples/',
  codeLabel: (filename) => (filename.endsWith('.tsx') ? 'tsx' : 'ts'),
  reactVersion: '19.2.0',
  reactCDN: 'https://unpkg.com',
};

function createUmdName(exampleName) {
  const base = exampleName.replace(/[^a-zA-Z0-9_$]/g, '_');
  return base.length ? `Example_${base}` : 'ExampleBundle';
}

async function resolveEntryFile(dirPath, candidates) {
  for (const candidate of candidates) {
    const entryPath = path.join(dirPath, candidate);
    try {
      await fs.access(entryPath);
      return { entryPath, entryFile: candidate };
    } catch {
      // continue searching
    }
  }
  return null;
}

async function buildExampleDirectories() {
  const rootDir = path.join(process.cwd(), CONFIG.sourceDir);
  const directories = await fs.readdir(rootDir, { withFileTypes: true });

  for (const dir of directories) {
    if (!dir.isDirectory()) continue;

    const exampleName = dir.name;
    const exampleDir = path.join(rootDir, exampleName);
    const exampleHtmlPath = path.join(exampleDir, 'index.html');
    const exampleCssPath = path.join(exampleDir, 'index.css');
    const baseCssSrcPath = path.join(rootDir, 'assets', 'base.css');

    try {
      await fs.access(exampleHtmlPath);
    } catch {
      continue;
    }

    const entryInfo = await resolveEntryFile(exampleDir, CONFIG.entryCandidates);
    if (!entryInfo) continue;

    const { entryPath, entryFile } = entryInfo;

    const outputDir = path.join(
      process.cwd(),
      `./docs/public/${CONFIG.publicSubdir}/${exampleName}`,
    );
    await fs.mkdir(outputDir, { recursive: true });

    const umdName = createUmdName(exampleName);
    if (entryFile.endsWith('.tsx') || entryFile.endsWith('.ts')) {
      await build({
        input: entryPath,
        output: {
          file: path.join(outputDir, 'index.umd.js'),
          format: 'umd',
          name: umdName,
        },
      });
    }

    try {
      await fs.copyFile(exampleCssPath, path.join(outputDir, 'index.css'));
    } catch {
      console.log(`Error copying CSS file: ${exampleCssPath}`);
    }
    try {
      await fs.copyFile(baseCssSrcPath, path.join(outputDir, 'base.css'));
    } catch {
      console.log(`Error copying base CSS file: ${baseCssSrcPath}`);
    }

    try {
      const html = await fs.readFile(exampleHtmlPath, 'utf8');
      const dom = new JSDOM(html);
      const { document } = dom.window;

      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href.includes('../assets/base.css') || href.includes('../examples/assets/base.css')) {
          link.setAttribute('href', 'base.css');
        }
      });

      const scripts = Array.from(document.querySelectorAll('script'));
      scripts.forEach((script) => {
        const src = script.getAttribute('src') || '';
        if (CONFIG.entryCandidates.some((candidate) => src.endsWith(candidate))) {
          script.removeAttribute('type');
          script.setAttribute('src', 'index.umd.js');
        }
      });

      await fs.writeFile(path.join(outputDir, 'index.html'), dom.serialize());
    } catch (error) {
      console.log(`Error processing HTML for example: ${exampleName}`);
      console.log(error);
    }

    console.log(`Built example: ${CONFIG.publicSubdir}/${exampleName}`);
  }
}

async function buildExamplesMarkdown() {
  const rootDir = path.join(process.cwd(), CONFIG.sourceDir);
  const markdownFilePath = path.join(process.cwd(), CONFIG.markdownPath);

  let markdownContent = '# Examples\n\n';

  const directories = await fs.readdir(rootDir, { withFileTypes: true });
  for (const dir of directories) {
    if (!dir.isDirectory()) continue;

    const exampleName = dir.name;
    const exampleDir = path.join(rootDir, exampleName);
    const indexHtmlPath = path.join(exampleDir, 'index.html');
    const indexCssPath = path.join(exampleDir, 'index.css');
    const baseCssPath = path.join(rootDir, 'assets', 'base.css');

    const entryInfo = await resolveEntryFile(exampleDir, CONFIG.entryCandidates);
    if (!entryInfo) continue;
    const { entryPath, entryFile } = entryInfo;

    try {
      await fs.access(indexHtmlPath);
      await fs.access(indexCssPath);
      await fs.access(baseCssPath);
    } catch {
      continue;
    }

    try {
      let indexHtmlContent = await fs.readFile(indexHtmlPath, 'utf8');
      const entryContent = await fs.readFile(entryPath, 'utf8');
      const indexCssContent = await fs.readFile(indexCssPath, 'utf8');
      const baseCssContent = await fs.readFile(baseCssPath, 'utf8');

      const dom = new JSDOM(indexHtmlContent);
      const { document } = dom.window;
      const title = document.title || exampleName;
      const description = document.querySelector('meta[name="description"]')?.content || '';

      indexHtmlContent = indexHtmlContent.replace('../examples/assets/base.css', 'base.css');

      markdownContent += `## ${title}\n\n`;
      if (description.length) {
        markdownContent += `${description}\n\n`;
      }
      markdownContent += `<div class="example">`;
      markdownContent += `<iframe src="${CONFIG.iframeBase}${exampleName}/index.html"></iframe>`;
      markdownContent += `<a class="example-link" target="_blank" href="${CONFIG.iframeBase}${exampleName}/index.html" title="Open in a new tab">`;
      markdownContent += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">`;
      markdownContent += `<path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path>`;
      markdownContent += `</svg>`;
      markdownContent += `</a>`;
      markdownContent += `</div>\n\n`;
      markdownContent += `::: code-group\n\n`;
      markdownContent += `\`\`\`${CONFIG.codeLabel(entryFile)} [${entryFile}]\n${entryContent}\n\`\`\`\n\n`;
      markdownContent += '```html [index.html]\n' + indexHtmlContent + '\n```\n\n';
      markdownContent += '```css [index.css]\n' + indexCssContent + '\n```\n\n';
      markdownContent += '```css [base.css]\n' + baseCssContent + '\n```\n\n';
      markdownContent += ':::\n\n';
      console.log(`Added example documentation: ${CONFIG.publicSubdir}/${exampleName}`);
    } catch (error) {
      console.log(`Error processing example documentation: ${CONFIG.publicSubdir}/${exampleName}`);
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
