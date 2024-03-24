import { Parcel } from '@parcel/core';
import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';

async function buildExampleDirectories() {
  const examplesDir = path.join(process.cwd(), './examples/');
  const directories = await fs.readdir(examplesDir, { withFileTypes: true });

  for (const dir of directories) {
    // Make sure the directory is a directory.
    if (!dir.isDirectory()) continue;

    // Get dir name and path to index.html.
    const exampleName = dir.name;
    const examplePath = path.join(examplesDir, exampleName, 'index.html');

    // Make sure index.html exists in the directory.
    try {
      await fs.access(examplePath);
    } catch {
      continue;
    }

    // If index.html exists, proceed with the build.
    const outputDir = path.join(process.cwd(), `./docs/public/examples/${exampleName}`);

    // Init and run the Parcel bundler.
    const parcel = new Parcel({
      entries: examplePath,
      defaultConfig: '@parcel/config-default',
      mode: 'production',
      shouldDisableCache: true,
      defaultTargetOptions: {
        shouldOptimize: false,
        distDir: outputDir,
        publicUrl: `./`,
      },
    });
    await parcel.run();
    console.log(`Built example: ${exampleName}`);
  }
}

async function buildExamplesMarkdown() {
  const examplesDir = path.join(process.cwd(), './examples/');
  const markdownFilePath = path.join(process.cwd(), './docs/docs/examples.md');

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
      let indexTsContent = await fs.readFile(indexTsPath, 'utf8');
      let indexCssContent = await fs.readFile(indexCssPath, 'utf8');
      let baseCssContent = await fs.readFile(baseCssPath, 'utf8');

      // Parse the title from the HTML content.
      const dom = new JSDOM(indexHtmlContent);
      const title = dom.window.document.title;

      // Modify the index.ts content to include the correct import path.
      indexTsContent = indexTsContent.replace('../../src', 'dragdoll');

      // Modify the base.css link from the HTML content.
      indexHtmlContent = indexHtmlContent.replace('../assets/base.css', 'base.css');

      // Append to markdown content.
      markdownContent += `## ${title}\n\n`;
      markdownContent += `<iframe src="/dragdoll/examples/${exampleName}/index.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>\n\n`;
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
