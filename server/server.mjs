// «Подолог» сайтының сервері: dist/ ішіндегі дайын беттерді береді және
// пікірлер API-ін жүргізеді. Сыртқы тәуелділік жоқ, тек Node.js 20+.
//
// Орта айнымалылары:
//   PORT=8080              тыңдайтын порт
//   HOST=127.0.0.1         nginx артында тұрса, тек ішкі адрес
//   ADMIN_PASSWORD=...     /admin бетіне кіру құпия сөзі (міндетті)
//   DATA_DIR=./data        reviews.json, suggestions.json, content.json, orders.json сақталатын қалта
//   TRUST_PROXY=1          nginx X-Forwarded-For жіберсе, клиент IP-ін одан алу
//   TG_BOT_TOKEN, TG_CHAT_ID  жаңа пікір/ұсыныс туралы Telegram хабарламасы (міндетті емес)
//   WA_PHONE, WA_APIKEY       жаңа пікір/ұсыныс туралы WhatsApp хабарламасы, CallMeBot арқылы (міндетті емес)
import { createServer } from 'node:http';
import { readFile, writeFile, rename, mkdir, stat } from 'node:fs/promises';
import { existsSync, readFileSync, createReadStream, createWriteStream, mkdirSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createBuilder } from './build.mjs';
import { join, normalize, extname, dirname } from 'node:path';
import { randomBytes, randomUUID, timingSafeEqual, createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '127.0.0.1';
const DIST = normalize(process.env.DIST_DIR || join(here, '..', 'dist'));
const DATA = process.env.DATA_DIR || join(here, 'data');
const FILE = join(DATA, 'reviews.json');
const SFILE = join(DATA, 'suggestions.json');
const CFILE = join(DATA, 'content.json'); // әкімші өзгерткен бағалар мен «бар/жоқ»
const OFILE = join(DATA, 'orders.json'); // дүкен тапсырыстары
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const TRUST_PROXY = process.env.TRUST_PROXY === '1';
if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 10) console.warn('[warn] ADMIN_PASSWORD орнатылмаған немесе 10 таңбадан қысқа: /admin жабық тұрады');

// ---------- Сақтау ----------
let reviews = [];
await mkdir(DATA, { recursive: true });
if (existsSync(FILE)) reviews = JSON.parse(readFileSync(FILE, 'utf8'));
let suggestions = [];
if (existsSync(SFILE)) suggestions = JSON.parse(readFileSync(SFILE, 'utf8'));
let cms = {};
const MFILE = join(DATA, 'cms.json'); // әкімші өзгерткен байланыс, фото, видео, мәтіндер
if (existsSync(MFILE)) cms = JSON.parse(readFileSync(MFILE, 'utf8'));
const UPL = join(DATA, 'uploads');
mkdirSync(UPL, { recursive: true });
let orders = [];
if (existsSync(OFILE)) orders = JSON.parse(readFileSync(OFILE, 'utf8'));
let content = { prices: {}, products: {} };
if (existsSync(CFILE)) content = JSON.parse(readFileSync(CFILE, 'utf8'));
let saving = Promise.resolve();
const write = (file, data) => (saving = saving.then(async () => {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 1));
  await rename(tmp, file);
}));
const save = () => write(FILE, reviews);
const saveS = () => write(SFILE, suggestions);
const saveC = () => write(CFILE, content);
const saveO = () => write(OFILE, orders);
const saveM = () => write(MFILE, cms);

// ---------- Сайтты қайта жинау ----------
const gitHead = () => { try { return spawnSync('git', ['-C', join(here, '..'), 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(); } catch { return ''; } };
const builder = createBuilder({ data: DATA, fallbackDist: DIST, codeVersion: gitHead(), onLog: (m) => console.log(`[build] ${m}`) });
if (builder.canBuild() && builder.stale()) builder.schedule(3000);
const pub = (r) => ({ id: r.id, name: r.name, rating: r.rating, text: r.text, createdAt: r.createdAt, ...(r.reply ? { reply: r.reply } : {}) });

// ---------- Тексеру ----------
const BAD = /(https?:|www\.|[a-z0-9-]+\.(kz|ru|com|net|org|me|io|info|site|online|shop|pro|xyz)\b|@|t\.me)/i;
const PHONE = /(\d[\s()+.-]*){7,}/;
const clean = (s) => String(s ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F​-‏‪-‮]/g, '').replace(/\n{3,}/g, '\n\n').trim();
function validate(b) {
  const name = clean(b.name).replace(/\s+/g, ' ');
  const text = clean(b.text);
  const rating = Number(b.rating);
  if (b.website) return { error: 'server', spam: true };       // бот тұзаққа түсті
  if (Number(b.elapsed) < 3000) return { error: 'fast' };       // форма 3 секундтан тез толтырылды
  if (name.length < 2 || name.length > 40 || /\d/.test(name)) return { error: 'name' };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: 'rating' };
  if (text.length < 10 || text.length > 1000) return { error: 'text' };
  if (BAD.test(name) || BAD.test(text) || PHONE.test(text)) return { error: 'link' };
  if (b.consent !== true) return { error: 'consent' };
  return { name, text, rating };
}

// Ұсыныс жарияланбайды, сондықтан телефон жазуға болады (жауап күтсе)
function validateS(b) {
  const topic = clean(b.topic).replace(/\s+/g, ' ').slice(0, 60);
  const name = clean(b.name).replace(/\s+/g, ' ');
  const phone = clean(b.phone).replace(/[^\d+]/g, '');
  const text = clean(b.text);
  if (b.website) return { error: 'server', spam: true };
  if (Number(b.elapsed) < 3000) return { error: 'fast' };
  if (name.length > 60) return { error: 'name' };
  if (text.length < 5 || text.length > 1500) return { error: 'text' };
  if (phone && (phone.length < 10 || phone.length > 16)) return { error: 'phone' };
  return { topic, name, phone, text, reply: b.reply === true };
}

// Бағалар: теңгемен бүтін сан. Кілт — прайс жолы (топтың ru аты|жолдың ru аты) немесе өнім (slug|көлемі)
const money = (n) => Number.isInteger(n) && n >= 0 && n <= 1e7;
function validateC(b) {
  const out = { prices: {}, products: {} };
  const P = b && typeof b.prices === 'object' && b.prices ? b.prices : {};
  const Q = b && typeof b.products === 'object' && b.products ? b.products : {};
  if (Object.keys(P).length > 500 || Object.keys(Q).length > 1000) return null;
  for (const [k, v] of Object.entries(P)) {
    if (k.length > 200 || !v || !money(v.min) || !money(v.max)) return null;
    out.prices[k] = { min: Math.min(v.min, v.max), max: Math.max(v.min, v.max), ...(v.hidden === true ? { hidden: true } : {}) };
  }
  for (const [k, v] of Object.entries(Q)) {
    if (k.length > 200 || !v || !(v.price === null || (money(v.price) && v.price > 0)) || ![true, false, null].includes(v.inStock)) return null;
    out.products[k] = { price: v.price, inStock: v.inStock };
  }
  return out;
}

// Тапсырыс: тауар аты мен көлемін бет жібереді, бағасын сервер өзі әкімші енгізген бағадан алады
const DELIV = ['pickup', 'city', 'other'];
function validateO(b) {
  const name = clean(b.name).replace(/\s+/g, ' ');
  const phone = clean(b.phone).replace(/[^\d+]/g, '');
  const address = clean(b.address).replace(/\s+/g, ' ');
  const note = clean(b.note);
  const no = clean(b.no);
  if (b.website) return { spam: true };
  if (!name || name.length > 80) return { error: 'name' };
  if (phone.length < 10 || phone.length > 16) return { error: 'phone' };
  if (!DELIV.includes(b.delivery)) return { error: 'delivery' };
  if (address.length > 200 || note.length > 500 || !/^PF-[\w-]{4,20}$/.test(no)) return { error: 'bad' };
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 50) return { error: 'items' };
  const items = [];
  for (const i of b.items) {
    const slug = clean(i.slug).slice(0, 80), size = clean(i.size).slice(0, 40), qty = Number(i.qty);
    if (!slug || !size || !Number.isInteger(qty) || qty < 1 || qty > 99) return { error: 'items' };
    const price = content.products[`${slug}|${size}`]?.price || null;
    items.push({ slug, size, qty, title: clean(i.title).slice(0, 160), art: clean(i.art).slice(0, 30), price });
  }
  const total = items.every((i) => i.price) ? items.reduce((s, i) => s + i.price * i.qty, 0) : null;
  return { no, name, phone, delivery: b.delivery, address, note, items, total };
}

// ---------- Жиілік шегі: бір IP-ден сағатына 3, тәулігіне 6 пікір ----------
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 864e5);
  hits.set(ip, list);
  return list.filter((t) => now - t < 36e5).length >= 3 || list.length >= 6;
};
const hit = (ip) => hits.get(ip).push(Date.now());
const oHits = new Map(); // тапсырыс: бір IP-ден сағатына 10
const oLimited = (ip) => { const now = Date.now(); const l = (oHits.get(ip) || []).filter((t) => now - t < 36e5); oHits.set(ip, l); return l.length >= 10; };
setInterval(() => { const now = Date.now(); for (const [k, v] of oHits) if (!v.some((t) => now - t < 36e5)) oHits.delete(k); }, 36e5).unref();
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (!v.some((t) => now - t < 864e5)) hits.delete(k); }, 36e5).unref();

// ---------- Әкімші сессиялары ----------
const sessions = new Map(); // token → expires
const loginFails = new Map(); // ip → [times]
const sha = (s) => createHash('sha256').update(s).digest();
const passOk = (p) => ADMIN_PASSWORD.length >= 10 && timingSafeEqual(sha(String(p)), sha(ADMIN_PASSWORD));
const cookie = (req, k) => (req.headers.cookie || '').split(/;\s*/).map((c) => c.split('=')).find(([n]) => n === k)?.[1];
const isAdmin = (req) => { const t = cookie(req, 'pd_admin'); const e = t && sessions.get(t); return !!e && e > Date.now(); };

// ---------- Хабарлама: Telegram және WhatsApp (міндетті емес) ----------
function send(text) {
  const { TG_BOT_TOKEN: tok, TG_CHAT_ID: chat, WA_PHONE: wa, WA_APIKEY: key } = process.env;
  if (tok && chat) fetch(`https://api.telegram.org/bot${tok}/sendMessage`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text }) }).catch(() => {});
  if (wa && key) fetch(`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wa)}&apikey=${encodeURIComponent(key)}&text=${encodeURIComponent(text)}`).catch(() => {});
}
const notify = (r) => send(`Жаңа пікір ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}\n${r.name}: ${r.text}\n\nӨшіру не жасыру: /admin`);
const fmtT = (n) => `${Number(n).toLocaleString('ru-RU').replace(/\s/g, ' ')} ₸`;
const notifyO = (o) => send(`Жаңа тапсырыс ${o.no}\n${o.items.map((i, k) => `${k + 1}. ${i.title || i.slug}, ${i.size} × ${i.qty}${i.price ? ` = ${fmtT(i.price * i.qty)}` : ''}`).join('\n')}${o.total ? `\nЖиыны: ${fmtT(o.total)}` : ''}\n\n${o.name}, ${o.phone}\nБарлығы: /admin`);
const notifyS = (r) => send(`Жаңа ұсыныс: ${r.topic || '–'}\n${r.text}\n${r.name ? `\nАты: ${r.name}` : ''}${r.phone ? `\nТелефон: ${r.phone}` : ''}${r.reply ? '\nЖауап күтеді' : ''}\n\nБарлығы: /admin`);

// ---------- Көмекшілер ----------
const ipOf = (req) => (TRUST_PROXY && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || '';
const json = (res, code, body, extra = {}) => { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra }); res.end(JSON.stringify(body)); };
const body = (req, max = 8192) => new Promise((ok, fail) => {
  let s = ''; req.setEncoding('utf8');
  req.on('data', (c) => { s += c; if (s.length > max) { fail(new Error('big')); req.destroy(); } });
  req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch { fail(new Error('json')); } });
});
const sameOrigin = (req) => { const o = req.headers.origin; return !o || o === `https://${req.headers.host}` || o === `http://${req.headers.host}`; };

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.mp4': 'video/mp4', '.pdf': 'application/pdf' };
const SEC = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'SAMEORIGIN' };

async function sendFile(req, res, f, cache) {
  const s = await stat(f);
  const ext = extname(f).toLowerCase();
  const head = { 'content-type': TYPES[ext] || 'application/octet-stream', 'cache-control': cache, 'accept-ranges': 'bytes', ...SEC };
  // Видео үшін Range керек: iPhone онсыз ойнатпайды, айналдыру да осымен істейді
  const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (m) {
    let start = m[1] ? Number(m[1]) : s.size - Number(m[2]);
    let end = m[1] && m[2] ? Math.min(Number(m[2]), s.size - 1) : s.size - 1;
    if (!(start >= 0 && start <= end && end < s.size)) { res.writeHead(416, { 'content-range': `bytes */${s.size}` }); return res.end(); }
    res.writeHead(206, { ...head, 'content-range': `bytes ${start}-${end}/${s.size}`, 'content-length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    return createReadStream(f, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...head, 'content-length': s.size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(f).pipe(res);
}

async function serveStatic(req, res, path) {
  const root = builder.current();
  let p = decodeURIComponent(path).replace(/\/+$/, '') || '/';
  const tries = p === '/' ? ['index.html'] : [p.slice(1), `${p.slice(1)}.html`, `${p.slice(1)}/index.html`];
  for (const t of tries) {
    const f = normalize(join(root, t));
    if (!f.startsWith(root)) break;
    try {
      const s = await stat(f);
      if (!s.isFile()) continue;
      const ext = extname(f);
      const cache = ext === '.html' || ext === '.json' || ext === '.xml' || ext === '.txt' ? 'no-cache' : f.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=86400';
      return await sendFile(req, res, f, cache);
    } catch {}
  }
  const nf = join(root, '404.html');
  res.writeHead(404, { 'content-type': 'text/html; charset=utf-8', ...SEC });
  res.end(existsSync(nf) ? await readFile(nf) : 'Not found');
}

// ---------- Файл жүктеу (әкімші): сурет пен видео DATA/uploads ішіне түседі ----------
const UPLOAD_TYPES = { '.webp': 4e7, '.jpg': 4e7, '.jpeg': 4e7, '.png': 4e7, '.mp4': 4e8, '.webm': 4e8, '.mov': 4e8 };
function upload(req, res, url) {
  const raw = String(url.searchParams.get('name') || 'file');
  const ext = (extname(raw).toLowerCase() || '').replace('.jpeg', '.jpg');
  const max = UPLOAD_TYPES[ext];
  if (!max) return json(res, 400, { error: 'type' });
  const base = raw.slice(0, -extname(raw).length).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file';
  const name = `${Date.now().toString(36)}-${randomBytes(3).toString('hex')}-${base}${ext}`;
  const f = join(UPL, name);
  let size = 0, done = false;
  const out = createWriteStream(f);
  const fail = (code, err) => { if (done) return; done = true; out.destroy(); try { unlinkSync(f); } catch {} json(res, code, { error: err }); };
  req.on('data', (c) => { size += c.length; if (size > max) { req.unpipe(out); req.resume(); fail(413, 'big'); } });
  req.on('error', () => fail(400, 'upload'));
  out.on('error', () => fail(500, 'disk'));
  out.on('finish', () => { if (done) return; done = true; if (!size) { try { unlinkSync(f); } catch {} return json(res, 400, { error: 'empty' }); } json(res, 201, { url: `/uploads/${name}`, size }); });
  req.pipe(out);
}

// Әкімші бөлімінен келген cms бөлімдерін тексеру: тек белгілі кілттер, мәтін ұзындығы шектеулі
const CMS_KEYS = ['contacts', 'gallery', 'videos', 'certificates', 'texts', 'seo', 'services', 'products'];
const okUrl = (v) => v === null || v === '' || (typeof v === 'string' && v.length < 500 && /^(https?:\/\/|\/uploads\/|\/media\/)/.test(v));
const okLocal = (v) => typeof v === 'string' && v.length < 300 && /^\/(uploads|media)\/[\w./-]+$/.test(v) && !v.includes('..');
function checkCms(key, v) {
  const str = (x, n = 2000) => x === undefined || (typeof x === 'string' && x.length <= n);
  const l3 = (x, n) => x === undefined || (x && typeof x === 'object' && ['kk', 'ru', 'en'].every((l) => str(x[l], n)));
  const list = (x, n) => Array.isArray(x) && x.length <= n;
  if (key === 'contacts') {
    if (!v || typeof v !== 'object') return false;
    if (v.phones && !(list(v.phones, 10) && v.phones.every((p) => str(p.number, 30) && str(p.display, 30)))) return false;
    for (const k of ['whatsappLink', 'instagram', 'tiktok', 'youtube', 'bookingUrl', 'twoGisUrl']) if (k in v && !okUrl(v[k])) return false;
    for (const k of ['whatsapp', 'ordersWhatsapp', 'feedbackWhatsapp']) if (k in v && !(v[k] === null || str(v[k], 30))) return false;
    if (!l3(v.address, 200) || !l3(v.addressNote, 300)) return false;
    if (v.hours && !(list(v.hours, 7) && v.hours.every((h) => l3(h.days, 60) && str(h.time, 40)))) return false;
    return true;
  }
  if (key === 'gallery') return list(v, 1000) && v.every((g) => str(g.id, 120) && okLocal(g.image) && (g.video === undefined || okLocal(g.video)) && l3(g.caption, 300) && l3(g.sub, 600) && str(g.category, 80));
  if (key === 'certificates') return list(v, 500) && v.every((c) => str(c.id, 120) && okLocal(c.image) && okLocal(c.thumb) && l3(c.title, 400) && str(c.category, 80) && str(c.note, 120) && (c.year === null || Number.isInteger(c.year)));
  if (key === 'videos') return v && typeof v === 'object' && Object.keys(v).length <= 30 && Object.values(v).every((g) => list(g, 200) && g.every((i) => str(i.id, 120) && okLocal(i.src) && (i.poster === '' || okLocal(i.poster)) && l3(i.caption, 300)));
  if (key === 'texts') return v && typeof v === 'object' && JSON.stringify(v).length < 500000 && Object.values(v).every((pg) => pg && typeof pg === 'object' && Object.values(pg).every((x) => l3(x, 5000)));
  if (key === 'services' || key === 'products') return v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length < 300 && Object.entries(v).every(([k, x]) => /^[\w-]{1,80}$/.test(k) && x && typeof x === 'object' && ['image', 'thumb'].every((f) => x[f] === undefined || okLocal(x[f])) && (x.hidden === undefined || typeof x.hidden === 'boolean'));
  if (key === 'seo') return v && typeof v === 'object' && typeof v.open === 'boolean' && ['google', 'yandex'].every((k) => v[k] === undefined || (typeof v[k] === 'string' && /^[\w-]{0,100}$/.test(v[k])));
  return false;
}

// ---------- Маршруттар ----------
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const path = url.pathname;
  try {
    if (path === '/api/reviews' && req.method === 'GET') {
      const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 100, 1), 200);
      const list = reviews.filter((r) => !r.hidden).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const avg = list.length ? Math.round((list.reduce((s, r) => s + r.rating, 0) / list.length) * 10) / 10 : null;
      return json(res, 200, { reviews: list.slice(0, limit).map(pub), total: list.length, average: avg });
    }
    if (path === '/api/reviews' && req.method === 'POST') {
      if (!sameOrigin(req)) return json(res, 403, { error: 'server' });
      const ip = ipOf(req);
      if (limited(ip)) return json(res, 429, { error: 'rate' });
      const v = validate(await body(req));
      if (v.spam) return json(res, 201, { review: { id: 'x', name: 'x', rating: 5, text: '', createdAt: new Date().toISOString() } });
      if (v.error) return json(res, 400, { error: v.error });
      hit(ip);
      const r = { id: randomUUID(), ...v, createdAt: new Date().toISOString(), hidden: false, ipHash: createHash('sha256').update(ip + 'podolog').digest('hex').slice(0, 16) };
      reviews.push(r); await save(); notify(r);
      return json(res, 201, { review: pub(r) });
    }

    if (path === '/api/content' && req.method === 'GET') return json(res, 200, content);
    if (path.startsWith('/uploads/') && (req.method === 'GET' || req.method === 'HEAD')) {
      const f = normalize(join(UPL, decodeURIComponent(path.slice(9))));
      if (!f.startsWith(UPL + '/') || !existsSync(f)) { res.writeHead(404); return res.end(); }
      return await sendFile(req, res, f, 'public, max-age=31536000, immutable');
    }

    if (path === '/api/orders' && req.method === 'POST') {
      if (!sameOrigin(req)) return json(res, 403, { error: 'server' });
      const ip = ipOf(req);
      if (oLimited(ip)) return json(res, 429, { error: 'rate' });
      const v = validateO(await body(req, 32768));
      if (v.spam) return json(res, 201, { ok: true });
      if (v.error) return json(res, 400, { error: v.error });
      oHits.get(ip).push(Date.now());
      if (orders.some((o) => o.no === v.no)) return json(res, 200, { ok: true }); // қайта жіберілсе, екі рет жазбаймыз
      const o = { id: randomUUID(), ...v, status: 'new', createdAt: new Date().toISOString() };
      orders.push(o); await saveO(); notifyO(o);
      return json(res, 201, { ok: true });
    }

    if (path === '/api/suggestions' && req.method === 'POST') {
      if (!sameOrigin(req)) return json(res, 403, { error: 'server' });
      const ip = ipOf(req);
      if (limited(ip)) return json(res, 429, { error: 'rate' });
      const v = validateS(await body(req));
      if (v.spam) return json(res, 201, { ok: true });
      if (v.error) return json(res, 400, { error: v.error });
      hit(ip);
      const r = { id: randomUUID(), ...v, createdAt: new Date().toISOString(), read: false };
      suggestions.push(r); await saveS(); notifyS(r);
      return json(res, 201, { ok: true });
    }

    // Әкімші
    if (path === '/admin' || path === '/admin/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...SEC });
      return res.end(await readFile(join(here, 'admin.html')));
    }
    // Телефонда «Басты экранға қосу»: әкімші бөлімі жеке қосымша сияқты ашылады
    if (path === '/admin.webmanifest') {
      res.writeHead(200, { 'content-type': 'application/manifest+json', 'cache-control': 'no-cache', ...SEC });
      return res.end(JSON.stringify({ name: 'Подолог · Әкімші', short_name: 'Подолог әкімші', start_url: '/admin', scope: '/admin', display: 'standalone', background_color: '#F4F7FA', theme_color: '#173B57', lang: 'kk',
        icons: [{ src: '/admin-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' }, { src: '/admin-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] }));
    }
    const ai = path.match(/^\/admin-icon-(180|192|512)\.png$/);
    if (ai) {
      res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400', ...SEC });
      return res.end(await readFile(join(here, `admin-icon-${ai[1]}.png`)));
    }
    if (path === '/api/admin/login' && req.method === 'POST') {
      if (!sameOrigin(req)) return json(res, 403, { error: 'origin' });
      const ip = ipOf(req); const now = Date.now();
      const fails = (loginFails.get(ip) || []).filter((t) => now - t < 9e5);
      if (fails.length >= 5) return json(res, 429, { error: 'Тым көп әрекет. 15 минуттан соң қайталаңыз.' });
      const { password } = await body(req, 1024);
      if (!passOk(password)) { loginFails.set(ip, [...fails, now]); return json(res, 401, { error: 'Құпия сөз қате' }); }
      const t = randomBytes(32).toString('hex'); sessions.set(t, now + 12 * 36e5);
      const secure = req.headers['x-forwarded-proto'] === 'https' || process.env.COOKIE_SECURE === '1' ? '; Secure' : '';
      return json(res, 200, { ok: true }, { 'set-cookie': `pd_admin=${t}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${secure}` });
    }
    if (path.startsWith('/api/admin/')) {
      if (!isAdmin(req)) return json(res, 401, { error: 'login' });
      if (req.method !== 'GET' && !sameOrigin(req)) return json(res, 403, { error: 'origin' });
      if (path === '/api/admin/logout' && req.method === 'POST') { sessions.delete(cookie(req, 'pd_admin')); return json(res, 200, { ok: true }, { 'set-cookie': 'pd_admin=; Path=/; Max-Age=0' }); }
      if (path === '/api/admin/reviews' && req.method === 'GET') return json(res, 200, { reviews: [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
      if (path === '/api/admin/suggestions' && req.method === 'GET') return json(res, 200, { suggestions: [...suggestions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
      if (path === '/api/admin/content' && req.method === 'PUT') {
        const v = validateC(await body(req, 200000));
        if (!v) return json(res, 400, { error: 'bad' });
        content = { ...v, updatedAt: new Date().toISOString() }; await saveC();
        return json(res, 200, content);
      }
      if (path === '/api/admin/upload' && req.method === 'PUT') return upload(req, res, url);
      if (path === '/api/admin/cms' && req.method === 'GET') {
        let texts = {};
        try { texts = JSON.parse(await readFile(join(DATA, 'texts.json'), 'utf8')); } catch {}
        return json(res, 200, { cms, texts, build: builder.status, canBuild: builder.canBuild() });
      }
      const mc = path.match(/^\/api\/admin\/cms\/(\w+)$/);
      if (mc && (req.method === 'PUT' || req.method === 'DELETE')) {
        const key = mc[1];
        if (!CMS_KEYS.includes(key)) return json(res, 404, { error: 'not found' });
        if (req.method === 'DELETE') delete cms[key];
        else { const v = await body(req, 2e6); if (!checkCms(key, v)) return json(res, 400, { error: 'bad' }); cms[key] = v; }
        cms.updatedAt = new Date().toISOString();
        await saveM(); builder.schedule();
        return json(res, 200, { ok: true, build: builder.status });
      }
      if (path === '/api/admin/build' && req.method === 'GET') return json(res, 200, { build: builder.status, canBuild: builder.canBuild() });
      if (path === '/api/admin/orders' && req.method === 'GET') return json(res, 200, { orders: [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
      const mo = path.match(/^\/api\/admin\/orders\/([\w-]+)$/);
      const od = mo && orders.find((x) => x.id === mo[1]);
      if (mo && !od) return json(res, 404, { error: 'not found' });
      if (od && req.method === 'PATCH') { const b = await body(req, 1024); if (!['new', 'done', 'cancel'].includes(b.status)) return json(res, 400, { error: 'bad' }); od.status = b.status; await saveO(); return json(res, 200, { order: od }); }
      if (od && req.method === 'DELETE') { orders = orders.filter((x) => x !== od); await saveO(); return json(res, 200, { ok: true }); }
      const ms = path.match(/^\/api\/admin\/suggestions\/([\w-]+)$/);
      const sg = ms && suggestions.find((x) => x.id === ms[1]);
      if (ms && !sg) return json(res, 404, { error: 'not found' });
      if (sg && req.method === 'PATCH') { const b = await body(req, 1024); sg.read = !!b.read; await saveS(); return json(res, 200, { suggestion: sg }); }
      if (sg && req.method === 'DELETE') { suggestions = suggestions.filter((x) => x !== sg); await saveS(); return json(res, 200, { ok: true }); }
      const m = path.match(/^\/api\/admin\/reviews\/([\w-]+)$/);
      const r = m && reviews.find((x) => x.id === m[1]);
      if (m && !r) return json(res, 404, { error: 'not found' });
      if (r && req.method === 'PATCH') {
        const b = await body(req, 8192);
        if ('hidden' in b) r.hidden = !!b.hidden;
        if ('reply' in b) { const t = clean(b.reply).slice(0, 1500); if (t) { r.reply = t; r.replyAt = new Date().toISOString(); } else { delete r.reply; delete r.replyAt; } }
        await save(); return json(res, 200, { review: r });
      }
      if (r && req.method === 'DELETE') { reviews = reviews.filter((x) => x !== r); await save(); return json(res, 200, { ok: true }); }
      return json(res, 404, { error: 'not found' });
    }
    if (path.startsWith('/api/')) return json(res, 404, { error: 'not found' });
    if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res, path);
    res.writeHead(405); res.end();
  } catch (e) {
    if (!res.headersSent) json(res, 400, { error: 'server' });
  }
});
server.listen(PORT, HOST, () => console.log(`podolog server: http://${HOST}:${PORT}`));
