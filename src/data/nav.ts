import { type Lang, localize } from '../i18n';
import { ui } from '../i18n/ui';

// Жолдар тілсіз жазылады, href тілге қарай префикспен беріледі
export const navFor = (lang: Lang): { path: string; href: string; label: string; short?: string; menuOnly?: boolean }[] => {
  const n = ui[lang].nav;
  return [
    { path: '/', label: n.home },
    { path: '/services', label: n.services },
    { path: '/insoles', label: n.insoles, short: n.insolesShort },
    { path: '/shop', label: n.shop, short: n.shopShort },
    { path: '/courses', label: n.courses, short: n.coursesShort },
    { path: '/certificates', label: n.certificates },
    { path: '/gallery', label: n.gallery, short: n.galleryShort },
    { path: '/reviews', label: ui[lang].reviews, short: ui[lang].reviewsShort },
    { path: '/feedback', label: ui[lang].feedback, menuOnly: true },
    { path: '/about', label: n.about },
    { path: '/mission', label: ui[lang].mission, short: ui[lang].missionShort },
    { path: '/contacts', label: n.contacts },
  ].map((x) => ({ ...x, href: localize(lang, x.path) }));
};

export const bottomNavFor = (lang: Lang) => {
  const b = ui[lang].bnav;
  return ([
    { path: '/', label: b.home, icon: 'home' },
    { path: '/services', label: b.services, icon: 'grid' },
    { path: '/booking', label: b.booking, icon: 'calendar' },
    { path: '/courses', label: b.courses, icon: 'cap' },
    { path: '/contacts', label: b.contacts, icon: 'phone' },
  ] as const).map((x) => ({ ...x, href: localize(lang, x.path) }));
};
