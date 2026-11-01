import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const output = '.vercel/output/static';
async function walk(path, prefix = '') {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) files.push(...await walk(join(path, entry.name), `${relative}/`));
    else files.push(relative);
  }
  return files;
}
const files = await walk(output);
const publicPages = files.filter(file => file.endsWith('.html') && file !== 'offline.html').map(file => file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`);
const assetFiles = files.filter(file => file.startsWith('_app/immutable/') && /\.(js|css)$/.test(file) || file.startsWith('fonts/') || file.startsWith('images/'));
const shell = ['/offline.html', '/brand/mark.svg', '/brand/wordmark.svg', '/brand/wordmark-team.svg', '/icons/icon-192.png', ...publicPages, ...assetFiles.map(file => `/${file}`)];
const original = await readFile('static/service-worker.js', 'utf8');
const worker = original.replace(/const SHELL=\[[^;]+;/, `const SHELL=${JSON.stringify(shell)};`);
await writeFile(`${output}/service-worker.js`, worker);
await writeFile('static/service-worker.js', worker);
console.log(`Offline shell prepared: ${publicPages.length} public pages, ${assetFiles.length} assets.`);
