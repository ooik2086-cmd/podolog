// Сайт тілдері. Орысша негізгі тіл: түбір мекенжайда ашылады (/),
// қазақша /kk/..., ағылшынша /en/... астында.
export const langs = ['ru', 'kk', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'ru';
export type Tr<T = string> = Record<Lang, T>;

export const langInfo: Record<Lang, { short: string; name: string; html: string; og: string }> = {
  ru: { short: 'RU', name: 'Русский', html: 'ru', og: 'ru_RU' },
  kk: { short: 'KZ', name: 'Қазақша', html: 'kk', og: 'kk_KZ' },
  en: { short: 'EN', name: 'English', html: 'en', og: 'en_US' },
};

const isLang = (v: unknown): v is Lang => langs.includes(v as Lang);

// Беттер мен компоненттер тілді маршрут параметрінен алады
export const getLang = (A: { params: Record<string, string | undefined> }): Lang =>
  isLang(A.params.lang) ? A.params.lang : defaultLang;

// Тілсіз жолға тіл префиксін қосады: localize('kk', '/shop') → '/kk/shop'
export const localize = (lang: Lang, path: string): string => {
  if (lang === defaultLang || !path.startsWith('/') || path.startsWith('//')) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
};

// getStaticPaths үшін: әр тілге бір нұсқа (орысшада параметр жоқ)
export const langPaths = <P extends Record<string, unknown>>(extra: (lang: Lang) => { params?: Record<string, string>; props?: P }[] = () => [{}]) =>
  langs.flatMap((lang) =>
    extra(lang).map((e) => ({
      params: { lang: lang === defaultLang ? undefined : lang, ...(e.params ?? {}) },
      props: { ...(e.props ?? {}) } as P,
    })),
  );

export const pick = <T>(lang: Lang, v: Tr<T>): T => v[lang];
