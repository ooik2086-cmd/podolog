// Әкімші бөлімінде өзгертілген мәндер. Сервер сайтты қайта жинағанда CMS_FILE (DATA/cms.json) береді.
// Файл жоқ болса (компьютерде жинау, GitHub Pages демосы), кодтағы бастапқы мәндер қолданылады.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import type { Lang } from '../i18n';

export type L3 = Record<Lang, string>;
export interface CmsPhone { number: string; display: string }
export interface CmsContacts {
  phones?: CmsPhone[];
  whatsapp?: string | null; // тек сандар: 77001234567
  whatsappLink?: string | null;
  ordersWhatsapp?: string;
  feedbackWhatsapp?: string;
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  bookingUrl?: string | null;
  twoGisUrl?: string | null;
  address?: L3;
  addressNote?: L3;
  hours?: { days: L3; time: string }[];
}
export interface CmsMedia {
  id: string;
  image: string; // постер видео үшін
  video?: string;
  caption: L3;
  sub?: L3;
  category: string; // галерея санатының қазақша аты
  hidden?: boolean;
}
export interface CmsVideo { id: string; src: string; poster: string; caption?: L3; hidden?: boolean }
export interface CmsCert {
  id: string; image: string; thumb: string; title: L3; year: number | null; category: string; note?: string; landscape: boolean; hidden?: boolean;
}
export interface Cms {
  contacts?: CmsContacts;
  gallery?: CmsMedia[];
  videos?: Record<string, CmsVideo[]>; // топ (reviews, tips, ...) → видеолар реті
  certificates?: CmsCert[];
  texts?: Record<string, Record<string, Partial<L3>>>; // бет → жол (h1, paths.0.title) → тіл → мәтін
  services?: Record<string, { image?: string; hidden?: boolean }>; // қызмет суреті, жасыру
  products?: Record<string, { image?: string; thumb?: string; hidden?: boolean }>; // тауар суреті, жасыру
  seo?: { open?: boolean; google?: string; yandex?: string }; // Search Console мен Яндекс Вебмастер растау кодтары
}

const file = process.env.CMS_FILE;
export const cms: Cms = file && existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};

// Бос болса басқа тілдегі мәтін алынады, сонда сайтта бос орын қалмайды
export const tr = (v: Partial<L3> | undefined, lang: Lang, fallback = '') => v?.[lang] || v?.ru || v?.kk || fallback;

// ---------- Беттердегі мәтіндер ----------
// Әр бет өз мәтіндерін pageText('index', { kk: {...}, ru: {...}, en: {...} }) арқылы береді.
// Әкімші өзгерткен жолдар ауыстырылады; бастапқы мәтіндер әкімші бөліміне тізім болып жазылады (CMS_TEXTS_OUT).
type Obj = Record<string, unknown>;
const flat = (v: unknown, pre = '', out: Record<string, string> = {}) => {
  if (typeof v === 'string') out[pre] = v;
  else if (Array.isArray(v)) v.forEach((x, i) => flat(x, pre ? `${pre}.${i}` : String(i), out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) flat(x, pre ? `${pre}.${k}` : k, out);
  return out;
};
const setPath = (o: unknown, path: string, val: string) => {
  const ks = path.split('.');
  let cur = o as Obj;
  for (const k of ks.slice(0, -1)) { cur = cur?.[k] as Obj; if (!cur || typeof cur !== 'object') return; }
  const last = ks[ks.length - 1];
  if (typeof cur[last] === 'string') cur[last] = val;
};
const clone = <T>(v: T): T => (typeof v === 'string' || !v || typeof v !== 'object' ? v : Array.isArray(v) ? (v.map(clone) as T) : (Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clone(x)])) as T));

const seen: Record<string, Record<string, Partial<L3>>> = {};
const textsOut = process.env.CMS_TEXTS_OUT;
export function pageText<T extends Record<Lang, unknown>>(page: string, all: T): T {
  if (textsOut && !seen[page]) {
    const rows: Record<string, Partial<L3>> = {};
    for (const lang of ['kk', 'ru', 'en'] as Lang[]) for (const [k, v] of Object.entries(flat(all[lang]))) (rows[k] ??= {})[lang] = v;
    seen[page] = rows;
    try { writeFileSync(textsOut, JSON.stringify(seen)); } catch {}
  }
  const ov = cms.texts?.[page];
  if (!ov) return all;
  const out = clone(all);
  for (const [path, v] of Object.entries(ov)) for (const lang of ['kk', 'ru', 'en'] as Lang[]) if (v[lang]) setPath(out[lang], path, v[lang]!);
  return out;
}
