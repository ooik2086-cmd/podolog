// Беттердегі видеолар топтары. Әкімші бөлімінде ауыстыруға, қосуға, жасыруға, атын өзгертуге болады (cms.videos).
import type { Lang } from '../i18n';
import { cms, tr, type L3 } from './cms';

export interface VideoItem { id: string; src: string; poster: string; caption?: L3; hidden?: boolean }
export interface VideoGroup { id: string; title: L3; single?: boolean; items: VideoItem[] }

const v = (id: string, caption?: L3): VideoItem => ({ id, src: `/media/video/${id}.mp4`, poster: `/media/video/${id}.webp`, ...(caption ? { caption } : {}) });

export const videoGroups: VideoGroup[] = [
  { id: 'reviews', title: { kk: 'Видео-пікірлер (Пікірлер беті)', ru: 'Видео-отзывы (страница «Отзывы»)', en: 'Video reviews (Reviews page)' },
    items: ['rv-6', 'rv-9', 'rv-3', 'rv-13', 'rv-7', 'rv-5', 'rv-14', 'rv-8', 'rv-4', 'rv-12', 'rv-10', 'rv-2', 'rv-11', 'rv-1', 'review-2'].map((id) => v(id)) },
  { id: 'procedures', title: { kk: 'Процедурадан көріністер (Пікірлер беті)', ru: 'Кадры с процедур (страница «Отзывы»)', en: 'From procedures (Reviews page)' },
    items: ['review-1', 'pr-1', 'pr-2', 'pr-3', 'pr-4'].map((id) => v(id)) },
  { id: 'tips', title: { kk: 'Подолог түсіндіреді (Қызметтер беті)', ru: 'Подолог объясняет (страница «Услуги»)', en: 'A podiatrist explains (Services page)' },
    items: [
      v('tip-specialist', { kk: 'Маман кеңесі', ru: 'Совет специалиста', en: 'Specialist advice' }),
      v('tip-myths', { kk: 'Подология туралы мифтер', ru: 'Мифы о подологии', en: 'Myths about podiatry' }),
      v('tip-self', { kk: 'Өздігінен кетпейді', ru: 'Само не пройдёт', en: 'It will not go away by itself' }),
    ] },
  { id: 'insoles-explain', single: true, title: { kk: 'Ұлтарақ туралы видео (Ұлтарақтар беті)', ru: 'Видео о стельках (страница «Стельки»)', en: 'Insoles video (Insoles page)' }, items: [v('insoles-explain')] },
  { id: 'plantoscope', single: true, title: { kk: 'Плантоскоп (Ұлтарақтар беті, дыбыссыз)', ru: 'Плантоскоп (страница «Стельки», без звука)', en: 'Plantoscope (Insoles page, muted)' }, items: [v('plantoscope')] },
  { id: 'congress', single: true, title: { kk: 'Конгресс видеосы (Біз туралы беті)', ru: 'Видео с конгресса (страница «О нас»)', en: 'Congress video (About page)' }, items: [v('congress-2025')] },
];

// Беттегі көрінетін видеолар: әкімші өзгерткен тізім, болмаса бастапқысы
export const videosFor = (group: string, lang: Lang) => {
  const items = cms.videos?.[group] ?? videoGroups.find((g) => g.id === group)?.items ?? [];
  return items.filter((i) => !i.hidden && i.src).map((i) => ({ ...i, caption: tr(i.caption, lang) }));
};
