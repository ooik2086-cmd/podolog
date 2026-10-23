// dist/ ішіндегі барлық ішкі сілтемелердің бетке апаратынын тексереді.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = 'dist';
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(root).filter((f) => f.endsWith('.html'));
let bad = 0;
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    if (url.startsWith('//')) continue;
    const target = url === '/' ? 'index.html' : /\.\w+$/.test(url) ? url.slice(1) : `${url.slice(1)}.html`;
    if (!existsSync(join(root, target))) { bad++; console.log(`✗ ${relative(root, file)} → ${url}`); }
  }
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
    if (!html.includes(`id="${id}"`)) { bad++; console.log(`✗ ${relative(root, file)} → #${id}`); }
  }
}
console.log(bad ? `${bad} broken link(s)` : `✓ ${pages.length} pages, all internal links resolve`);
process.exit(bad ? 1 : 0);
