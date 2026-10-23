// Орталықтың байланыс деректері. 5-кезеңде бұл мәндер әкімші панельге көшеді.
// null — дерек әлі расталмаған. Сайт ондай жерде ойдан мән көрсетпейді.
// Дереккөз: орталықтың баннері мен Instagram профилі (2026-10-21).
// Мәтін өрістері әр тілге siteText ішінде, siteFor(lang) оларды біріктіреді.
import { type Lang, defaultLang } from '../i18n';
import { cms } from './cms';

export interface Phone {
  number: string; // +77001234567 форматында
  display: string;
  label: string;
}

export const site = {
  name: 'Подолог',
  fullName: '«Подолог» подология және ортопедия орталығы',
  city: 'Қызылорда',
  timezone: 'Asia/Qyzylorda',
  head: 'Жанна Ким',
  experienceYears: 17,

  address: 'Абай даңғылы, 30' as string | null,
  addressNote: 'Кіреберіс Есенов көшесінен, ескі «Болашақ» ауданы',
  workingHours: [
    { days: 'Дүйсенбі – сенбі', time: '10:00 – 18:00' },
    { days: 'Жексенбі', time: '12:00 – 17:00' },
  ],
  phones: [
    { number: '+77717880184', display: '8 771 788 01 84', label: 'Орталық' },
    { number: '+77770672379', display: '8 777 067 23 79', label: 'Орталық' },
    { number: '+77777100084', display: '8 777 710 00 84', label: 'Орталық' },
  ] as Phone[],

  // Онлайн жазылу (Altegio): бос уақыт, маман және растау осы жүйеде
  bookingUrl: 'https://n1389317.alteg.io' as string | null,

  // WhatsApp: баннердегі QR-кодтағы бизнес-сілтеме. Ол дайын мәтінді қабылдамайды,
  // сондықтан WhatsApp нөмірі белгілі болғанда whatsapp өрісін толтыру керек.
  whatsapp: null as string | null, // тек сандар: 77001234567
  whatsappLink: 'https://wa.me/message/E6R5V23RWFHOK1' as string | null,

  // 2GIS: орталықтың карточкасы. Дереккөз: орталықтағы QR-стенд пен «2GIS пікір» плакатының QR-коды (2026-10-22).
  twoGis: {
    firmUrl: 'https://2gis.kz/kyzylorda/firm/70000001079125658' as string | null,
    reviewsUrl: 'https://2gis.kz/kyzylorda/firm/70000001079125658/tab/reviews' as string | null,
    searchUrl: 'https://2gis.kz/kyzylorda/search/' + encodeURIComponent('проспект Абая, 30'),
    embedUrl: null as string | null,
    // Абай даңғылы, 30 ғимаратының 2GIS-тегі нүктесі (сол үйдегі басқа ұйым карточкасынан, 2026-10-21)
    point: { lon: 65.512273, lat: 44.829126 },
  },

  social: {
    instagram: 'https://www.instagram.com/podology.kzo/' as string | null,
    tiktok: 'https://www.tiktok.com/@podolog.kyzylorda' as string | null, // QR-стендтегі аккаунт
    youtube: null as string | null,
  },
};

// Әкімші бөлімінде өзгертілген байланыс деректері (cms.json)
const raw = structuredClone(site); // әкімші бөліміне бастапқы мән ретінде беріледі
const C = cms.contacts ?? {};
const has = (k: keyof typeof C) => Object.prototype.hasOwnProperty.call(C, k);
const digits = (v: string) => v.replace(/\D/g, '').replace(/^8(?=\d{10}$)/, '7');
if (C.phones) site.phones = C.phones.filter((p) => digits(p.number || p.display).length >= 10).map((p) => ({ number: `+${digits(p.number || p.display)}`, display: p.display || p.number, label: 'Орталық' }));
if (has('whatsapp')) site.whatsapp = C.whatsapp ? digits(C.whatsapp) : null;
if (has('whatsappLink')) site.whatsappLink = C.whatsappLink || null;
if (has('instagram')) site.social.instagram = C.instagram || null;
if (has('tiktok')) site.social.tiktok = C.tiktok || null;
if (has('youtube')) site.social.youtube = C.youtube || null;
if (has('bookingUrl')) site.bookingUrl = C.bookingUrl || null;
if (C.twoGisUrl) { site.twoGis.firmUrl = C.twoGisUrl.replace(/\/tab\/.*$/, ''); site.twoGis.reviewsUrl = `${site.twoGis.firmUrl.replace(/\/$/, '')}/tab/reviews`; }
if (C.hours?.length) site.workingHours = C.hours.map((h) => ({ days: h.days.kk || h.days.ru, time: h.time }));

export type WaTopic = 'general' | 'booking' | 'insoles' | 'products' | 'courses' | 'clinics';

// Әр әрекетке бөлек дайын мәтін (WhatsApp нөмірі қосылғанда іске қосылады)
export const waMessages: Record<Lang, Record<WaTopic, string>> = {
  kk: {
    general: 'Сәлеметсіз бе! Сайттан жазып отырмын, сұрағым бар.',
    booking: 'Сәлеметсіз бе! Подологтың қабылдауына жазылғым келеді.',
    insoles: 'Сәлеметсіз бе! Жеке ортопедиялық ұлтарақ жасатқым келеді. Қалай бастаймыз?',
    products: 'Сәлеметсіз бе! PodiaFarm өнімдеріне тапсырыс бергім келеді.',
    courses: 'Сәлеметсіз бе! Оқу бағдарламалары бойынша кеңес алғым келеді.',
    clinics: 'Сәлеметсіз бе! Клиникамызда подологиялық кабинет ашу және командаға оқыту туралы білгім келеді.',
  },
  ru: {
    general: 'Здравствуйте! Пишу с сайта, у меня вопрос.',
    booking: 'Здравствуйте! Хочу записаться на приём к подологу.',
    insoles: 'Здравствуйте! Хочу заказать индивидуальные ортопедические стельки. С чего начать?',
    products: 'Здравствуйте! Хочу заказать продукцию PodiaFarm.',
    courses: 'Здравствуйте! Хочу получить консультацию по программам обучения.',
    clinics: 'Здравствуйте! Хотим открыть подологический кабинет в нашей клинике и обучить команду. Расскажите подробнее.',
  },
  en: {
    general: 'Hello! I am writing from your website and have a question.',
    booking: 'Hello! I would like to book an appointment with a podiatrist.',
    insoles: 'Hello! I would like to order custom orthopedic insoles. How do we start?',
    products: 'Hello! I would like to order PodiaFarm products.',
    courses: 'Hello! I would like advice on your training programs.',
    clinics: 'Hello! We would like to open a podiatry room at our clinic and train our team. Please tell us more.',
  },
};

// PodiaFarm өнімдерінің тапсырыстары тек осы нөмірге келеді (Aza, 2026-10-22: 8 777 710 00 84).
// Қалған сұрақтар негізгі WhatsApp-қа барады.
export const ordersWhatsapp = C.ordersWhatsapp ? digits(C.ordersWhatsapp) : '77777100084';
export const ordersPhoneDisplay = ordersWhatsapp.replace(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/, '8 $1 $2 $3 $4');

export function waLink(topic: WaTopic = 'general', extra = '', lang: Lang = defaultLang): string | null {
  if (topic === 'products') {
    const text = waMessages[lang][topic] + (extra ? `\n${extra}` : '');
    return `https://wa.me/${ordersWhatsapp}?text=${encodeURIComponent(text)}`;
  }
  if (site.whatsapp) {
    const text = waMessages[lang][topic] + (extra ? `\n${extra}` : '');
    return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
  }
  return site.whatsappLink;
}

// Тілге тәуелді мәтін өрістері
const siteText = {
  kk: {
    fullName: '«Подолог» подология және ортопедия орталығы', city: 'Қызылорда', head: 'Жанна Ким',
    address: 'Абай даңғылы, 30', addressNote: 'Кіреберіс Есенов көшесінен, ескі «Болашақ» ауданы',
    days: ['Дүйсенбі – сенбі', 'Жексенбі'], phoneLabel: 'Орталық',
  },
  ru: {
    fullName: 'Центр подологии и ортопедии «Подолог»', city: 'Кызылорда', head: 'Жанна Ким',
    address: 'проспект Абая, 30', addressNote: 'Вход с улицы Есенова, район старого «Болашака»',
    days: ['Понедельник – суббота', 'Воскресенье'], phoneLabel: 'Центр',
  },
  en: {
    fullName: 'Podolog Podiatry and Orthopedics Center', city: 'Kyzylorda', head: 'Zhanna Kim',
    address: '30 Abay Avenue', addressNote: 'Entrance from Yesenov Street, old Bolashak district',
    days: ['Monday – Saturday', 'Sunday'], phoneLabel: 'Center',
  },
} satisfies Record<Lang, unknown>;
const L = (f: (t: (typeof siteText)['kk']) => string) => ({ kk: f(siteText.kk), ru: f(siteText.ru), en: f(siteText.en) });
export const contactDefaults = {
  phones: raw.phones.map((p) => ({ number: p.number, display: p.display })),
  whatsapp: raw.whatsapp, whatsappLink: raw.whatsappLink, ordersWhatsapp: '77777100084', feedbackWhatsapp: '77059525231',
  instagram: raw.social.instagram, tiktok: raw.social.tiktok, youtube: raw.social.youtube,
  bookingUrl: raw.bookingUrl, twoGisUrl: raw.twoGis.firmUrl,
  address: L((t) => t.address), addressNote: L((t) => t.addressNote),
  hours: raw.workingHours.map((h, i) => ({ days: L((t) => t.days[i]), time: h.time })),
};
for (const l of ['kk', 'ru', 'en'] as Lang[]) {
  if (C.address?.[l]) siteText[l].address = C.address[l];
  if (C.addressNote?.[l] !== undefined && C.addressNote) siteText[l].addressNote = C.addressNote[l] || '';
  if (C.hours?.length) siteText[l].days = C.hours.map((h) => h.days[l] || h.days.ru || h.days.kk);
}
if (C.address && !C.address.kk && !C.address.ru) site.address = null;

export const siteFor = (lang: Lang) => {
  const t = siteText[lang];
  return {
    ...site,
    fullName: t.fullName, city: t.city, head: t.head,
    address: site.address ? t.address : null, addressNote: t.addressNote,
    workingHours: site.workingHours.map((h, i) => ({ ...h, days: t.days[i] ?? h.days })),
    phones: site.phones.map((p) => ({ ...p, label: t.phoneLabel })),
  };
};
export const fullAddressFor = (lang: Lang) => {
  const s = siteFor(lang);
  return s.address ? `${s.city}, ${s.address}` : s.city;
};

export const mapUrl = site.twoGis.firmUrl ?? site.twoGis.searchUrl;

// Маршрут: веб-нұсқа (браузер) және 2GIS қолданбасы (Android intent, iOS universal link веб-сілтеме арқылы)
const { lon, lat } = site.twoGis.point;
export const routeUrl = `https://2gis.kz/kyzylorda/directions/points/%7C${lon}%2C${lat}`;

// Android-та https сілтеме браузерде ашылады, сондықтан қолданбаны intent арқылы ашамыз.
// Қолданба жоқ болса, browser_fallback_url веб-нұсқаны ашады.
const intent = (path: string, scheme: string, pkg: string, fallback: string) =>
  `intent://${path}#Intent;scheme=${scheme};package=${pkg};S.browser_fallback_url=${encodeURIComponent(fallback)};end`;
const igUser = site.social.instagram?.match(/instagram\.com\/([^/?#]+)/)?.[1];
export const androidAppLinks: Record<string, string> = {
  [routeUrl]: intent(`2gis.ru/routeSearch/rsType/car/to/${lon},${lat}`, 'dgis', 'ru.dublgis.dgismobile', routeUrl),
  ...(site.social.instagram && igUser
    ? { [site.social.instagram]: intent(`instagram.com/_u/${igUser}/`, 'https', 'com.instagram.android', site.social.instagram) }
    : {}),
};

export const missing = {
  contacts: site.phones.length === 0 || !waLink() || !site.address,
  map: !site.twoGis.firmUrl,
};

// Ұсыныстар осы WhatsApp нөміріне келеді (Aza, 2026-10-22: 8 705 952 52 31)
export const feedbackWhatsapp = C.feedbackWhatsapp ? digits(C.feedbackWhatsapp) : '77059525231';
