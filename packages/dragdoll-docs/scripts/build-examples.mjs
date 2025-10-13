import fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import path from 'path';
import { build } from 'rolldown';

function createUmdName(exampleName) {
  const base = exampleName.replace(/[^a-zA-Z0-9_$]/g, '_');
  return base.length ? `Example_${base}` : 'ExampleBundle';
}

async function buildExampleDirectories() {
  const examplesDir = path.join(process.cwd(), './examples/');
  const directories = await fs.readdir(examplesDir, { withFileTypes: true });

  for (const dir of directories) {
    // Make sure the directory is a directory.
    if (!dir.isDirectory()) continue;

    // Get dir name and path to index.html.
    const exampleName = dir.name;
    const exampleHtmlPath = path.join(examplesDir, exampleName, 'index.html');
    const exampleTsPath = path.join(examplesDir, exampleName, 'index.ts');
    const exampleCssPath = path.join(examplesDir, exampleName, 'index.css');
    const baseCssSrcPath = path.join(examplesDir, 'assets', 'base.css');

    // Make sure index.html exists in the directory.
    try {
      await fs.access(exampleHtmlPath);
    } catch {
      continue;
    }

    // Ensure TS entry exists for bundling.
    try {
      await fs.access(exampleTsPath);
    } catch {
      continue;
    }

    // If index.html exists, proceed with the build.
    const outputDir = path.join(process.cwd(), `./docs/public/examples/${exampleName}`);
    await fs.mkdir(outputDir, { recursive: true });

    // Bundle JS with rolldown to UMD.
    const umdName = createUmdName(exampleName);
    await build({
      input: exampleTsPath,
      output: {
        file: path.join(outputDir, 'index.umd.js'),
        format: 'umd',
        name: umdName,
      },
    });

    // Copy CSS files.
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

    // Rewrite and copy HTML.
    try {
      const html = await fs.readFile(exampleHtmlPath, 'utf8');
      const dom = new JSDOM(html);
      const { document } = dom.window;

      // Replace base.css link to local file.
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (href.includes('../assets/base.css')) {
          link.setAttribute('href', 'base.css');
        }
      });

      // Replace module script pointing to TS with UMD JS.
      const scripts = Array.from(document.querySelectorAll('script'));
      scripts.forEach((script) => {
        const src = script.getAttribute('src') || '';
        if (src.endsWith('index.ts')) {
          script.removeAttribute('type');
          script.setAttribute('src', 'index.umd.js');
        }
      });

      await fs.writeFile(path.join(outputDir, 'index.html'), dom.serialize());
    } catch {
      // TODO: Consider logging HTML processing errors per example.
    }

    console.log(`Built example: ${exampleName}`);
  }
}

async function buildExamplesMarkdown() {
  const examplesDir = path.join(process.cwd(), './examples/');
  const markdownFilePath = path.join(process.cwd(), './docs/examples.md');

  // Start the markdown file with a header.
  let markdownContent = '# Examples\n\n';

  const directories = await fs.readdir(examplesDir, { withFileTypes: true });
  for (const dir of directories) {
    if (!dir.isDirectory()) continue;

    const exampleName = dir.name;

    // Get file paths.
    const indexHtmlPath = path.join(examplesDir, exampleName, 'index.html');
    const indexTsPath = path.join(examplesDir, exampleName, 'index.ts');
    const indexCssPath = path.join(examplesDir, exampleName, 'index.css');
    const baseCssPath = path.join(examplesDir, 'assets', 'base.css');
    try {
      await fs.access(indexHtmlPath);
      await fs.access(indexTsPath);
      await fs.access(indexCssPath);
      await fs.access(baseCssPath);
    } catch {
      continue;
    }

    try {
      // Get file contents.
      let indexHtmlContent = await fs.readFile(indexHtmlPath, 'utf8');
      const indexTsContent = await fs.readFile(indexTsPath, 'utf8');
      const indexCssContent = await fs.readFile(indexCssPath, 'utf8');
      const baseCssContent = await fs.readFile(baseCssPath, 'utf8');

      // Parse the title and description from the HTML content.
      const dom = new JSDOM(indexHtmlContent);
      const { document } = dom.window;
      const title = document.title;
      const description = document.querySelector('meta[name="description"]')?.content || '';

      // Modify the base.css link from the HTML content.
      indexHtmlContent = indexHtmlContent.replace('../assets/base.css', 'base.css');

      // Append to markdown content.
      markdownContent += `## ${title}\n\n`;
      if (description.length) {
        markdownContent += `${description}\n\n`;
      }
      markdownContent += `<div class="example">`;
      markdownContent += `<iframe src="/dragdoll/examples/${exampleName}/index.html"></iframe>`;
      markdownContent += `<a class="example-link" target="_blank" href="/dragdoll/examples/${exampleName}/index.html" title="Open in a new tab">`;
      markdownContent += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">`;
      markdownContent += `<path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path>`;
      markdownContent += `</svg>`;
      markdownContent += `</a>`;
      markdownContent += `</div>\n\n`;
      markdownContent += `::: code-group\n\n`;
      markdownContent += '```ts [index.ts]\n' + indexTsContent + '\n```\n\n';
      markdownContent += '```html [index.html]\n' + indexHtmlContent + '\n```\n\n';
      markdownContent += '```css [index.css]\n' + indexCssContent + '\n```\n\n';
      markdownContent += '```css [base.css]\n' + baseCssContent + '\n```\n\n';
      markdownContent += `:::\n\n`;
      console.log(`Added example documentation: ${exampleName}`);
    } catch (error) {
      console.log(`Error processing example documentation: ${exampleName}`);
      console.log(error);
    }
  }

  // Write the final markdown content to file.
  await fs.writeFile(markdownFilePath, markdownContent);
}

async function buildAll() {
  await buildExampleDirectories();
  await buildExamplesMarkdown();
}

buildAll();
