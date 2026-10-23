// Сайтты серверде қайта жинау: әкімші өзгерткен деректермен (DATA/cms.json) Astro build іске қосылады.
// Жаңа нұсқа DATA/sites/<уақыт> қалтасына жиналады, сәтті болса ғана ауыстырылады, сондықтан сайт тоқтамайды.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = join(dirname(fileURLToPath(import.meta.url)), '..');

export function createBuilder({ data, fallbackDist, codeVersion = '', onLog = () => {} }) {
  const sites = join(data, 'sites');
  const pointer = join(sites, 'current.txt');
  mkdirSync(sites, { recursive: true });
  const status = { state: 'idle', startedAt: null, finishedAt: null, ms: null, error: null, version: null };
  let running = false, queued = false, timer = null;

  const current = () => {
    try { const d = join(sites, readFileSync(pointer, 'utf8').trim()); if (existsSync(join(d, 'index.html'))) return d; } catch {}
    return fallbackDist;
  };
  const canBuild = () => existsSync(join(APP, 'node_modules', 'astro', 'astro.js')) && existsSync(join(APP, 'src'));

  function run() {
    if (!canBuild()) { status.state = 'unavailable'; return; }
    if (running) { queued = true; return; }
    running = true;
    const name = String(Date.now());
    const out = join(sites, name);
    Object.assign(status, { state: 'building', startedAt: new Date().toISOString(), error: null });
    const t0 = Date.now();
    let log = '';
    const p = spawn(process.execPath, [join(APP, 'node_modules', 'astro', 'astro.js'), 'build', '--silent'], {
      cwd: APP,
      env: { ...process.env, CMS_FILE: join(data, 'cms.json'), CMS_TEXTS_OUT: join(data, 'texts.json'), OUT_DIR: out, ASTRO_CACHE: join(data, 'astro-cache'), ASTRO_TELEMETRY_DISABLED: '1', NODE_ENV: 'production' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const keep = (c) => { log = (log + c).slice(-4000); };
    p.stdout.on('data', keep); p.stderr.on('data', keep);
    p.on('close', (code) => {
      running = false;
      status.finishedAt = new Date().toISOString(); status.ms = Date.now() - t0;
      if (code === 0 && existsSync(join(out, 'index.html'))) {
        // Іздеу жүйелері сайтты көреді; әкімші «жабу» деп белгілесе, көрмейді
        let open = true;
        try { open = JSON.parse(readFileSync(join(data, 'cms.json'), 'utf8')).seo?.open !== false; } catch {}
        writeFileSync(join(out, 'robots.txt'), open ? 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /cart\n\nSitemap: https://podology.com.kz/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n');
        writeFileSync(pointer, name);
        writeFileSync(join(sites, 'code.txt'), codeVersion);
        status.state = 'ok'; status.version = name;
        // Ескі нұсқалар: соңғы екеуі қалады
        for (const d of readdirSync(sites).filter((x) => /^\d+$/.test(x) && x !== name).sort().slice(0, -1)) rmSync(join(sites, d), { recursive: true, force: true });
        onLog(`build ok ${status.ms}ms`);
      } else {
        rmSync(out, { recursive: true, force: true });
        status.state = 'error'; status.error = log.trim().split('\n').slice(-12).join('\n');
        onLog(`build failed: ${status.error}`);
      }
      if (queued) { queued = false; run(); }
    });
  }
  // Бірнеше өзгеріс қатар сақталса, бір рет жинаймыз
  const schedule = (ms = 1500) => { clearTimeout(timer); if (status.state !== 'building') status.state = 'queued'; timer = setTimeout(run, ms); };
  // Код жаңарса (GitHub-тан), сайт жаңа кодпен қайта жиналуы керек
  const stale = () => { try { return readFileSync(join(sites, 'code.txt'), 'utf8').trim() !== codeVersion || current() === fallbackDist; } catch { return true; } };
  return { current, schedule, status, canBuild, stale };
}
