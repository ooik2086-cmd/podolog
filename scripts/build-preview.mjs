// dist/ → preview/: сілтемелерді салыстырмалы етеді, сонда сайтты
// кез келген қалтадан немесе алдын ала көру сілтемесінен ашуға болады.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync, copyFileSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

// KEEP_MAP=1: GitHub Pages демосы үшін карта қалады (out=OUT_DIR)
const src = 'dist', out = process.env.OUT_DIR || 'preview';
const keepMap = process.env.KEEP_MAP === '1';
rmSync(out, { recursive: true, force: true });
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
for (const file of walk(src)) {
  const rel = relative(src, file);
  const dest = join(out, rel);
  mkdirSync(dirname(dest), { recursive: true });
  if (!file.endsWith('.html')) { copyFileSync(file, dest); continue; }
  const up = '../'.repeat(rel.split('/').length - 1);
  let html = readFileSync(file, 'utf8').replace(/(href|src|data-lb)="\/(?!\/)([^"#?]*)([^"]*)"/g, (_, attr, path, rest) => {
    const target = path === '' ? 'index.html' : /\.\w+$/.test(path) ? path : `${path}.html`;
    return `${attr}="${up}${target}${rest}"`;
  });
  // Алдын ала қарау терезесі сыртқы iframe-ді бөгейді: карта тек нақты сайтта көрінеді
  if (!keepMap) html = html.replace(/<iframe class="cb__gmap"[^>]*><\/iframe>/g, '');
  writeFileSync(dest, html);
}
console.log('preview ready');

// Artifact беті үшін: басты беттің html/head/body қабығы алынады
const index = readFileSync(join(out, 'index.html'), 'utf8')
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>|<\/?head>|<\/?body[^>]*>/g, '');
writeFileSync(join(out, 'index.artifact.html'), index);
