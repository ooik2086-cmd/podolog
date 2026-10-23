// Бағалар. Дереккөз: орталықтың «Прайс лист» парағы (фото, 2026-10-22).
// Прайста баға маманның санатына қарай екі бағанда тұр, сайтта ең төменгі мен ең жоғарғысы көрсетіледі.
// Күмәнді жолдар («Разгрузки (колечки)» 5000/1500, «С чисткой кутикулы») орталық растағанша қосылмады.
import type { Lang } from '../i18n';

type Name = Record<Lang, string>;
export interface PriceRow { name: Name; min: number; max: number }
export interface PriceGroup { title: Name; rows: PriceRow[] }

const r = (kk: string, ru: string, en: string, min: number, max = min): PriceRow => ({ name: { kk, ru, en }, min, max });

export const priceGroups: PriceGroup[] = [
  {
    title: { kk: 'Аяқ: тырнақ пен табан', ru: 'Ноги: ногти и стопы', en: 'Feet: nails and skin' },
    rows: [
      r('Кеңес (консультация)', 'Консультация', 'Consultation', 5000, 10000),
      r('Ортопедтің диагностикасы', 'Диагностика ортопеда', 'Orthopedic diagnostics', 5000, 10000),
      r('Тырнақ саңырауқұлағы (микоз)', 'Микоз (грибок) ногтей', 'Nail fungus (mycosis)', 20000, 60000),
      r('Қалыңдаған тырнақтарды қию', 'Стрижка утолщённых ногтей', 'Trimming thickened nails', 10000, 30000),
      r('Тырнақ тазалау (саңырауқұлақсыз)', 'Чистка ногтей без грибка', 'Nail cleaning (no fungus)', 10000, 15000),
      r('Ішке өскен тырнақ', 'Вросший ноготь', 'Ingrown toenail', 10000, 25000),
      r('Титан жіп', 'Титановая нить', 'Titanium wire', 15000, 25000),
      r('Скоба (3TO)', 'Скоба 3TO', '3TO brace', 15000, 35000),
      r('Онихогрифоз (1 саусақ)', 'Онихогрифоз (1 палец)', 'Onychogryphosis (1 toe)', 20000, 60000),
      r('Подопедикюр', 'Подо-педикюр', 'Podiatric pedicure', 15000, 60000),
      r('Саңырауқұлақ кезіндегі подопедикюр', 'Подо-педикюр при микозе', 'Podiatric pedicure with fungus', 15000, 60000),
      r('Таңу (1 саусақ)', 'Перевязка (1 палец)', 'Dressing (1 toe)', 3000, 5000),
      r('Окклюзиялық таңғыш', 'Окклюзионная повязка', 'Occlusive dressing', 5000),
      r('Тейптеу', 'Тейпирование', 'Taping', 5000),
      r('Ортез', 'Ортез', 'Orthosis', 20000, 50000),
      r('Жүктемені азайтатын бандаж', 'Разгрузочный бандаж', 'Offloading bandage', 8000, 10000),
      r('Өзекті мүйізгек (1 дана)', 'Стержневая мозоль (1 шт.)', 'Core corn (1 piece)', 10000, 20000),
      r('Сүйелді тазалау', 'Чистка бородавки', 'Wart treatment', 10000, 20000),
      r('Сүйелді күйдіру', 'Прижигание бородавки', 'Wart cauterization', 10000, 30000),
      r('Ортопедиялық ұлтарақ (1 жұп)', 'Ортопедические стельки (1 пара)', 'Orthopedic insoles (1 pair)', 40000),
      r('Балаларға жартылай ұлтарақ (1 жұп)', 'Детские полустельки (1 пара)', 'Children’s half insoles (1 pair)', 25000),
    ],
  },
  {
    title: { kk: 'Қол', ru: 'Руки', en: 'Hands' },
    rows: [
      r('Ішке өскен тырнақ', 'Вросший ноготь', 'Ingrown nail', 5000, 20000),
      r('Панариций (іріңдеу), 1 саусақ', 'Панариций (гной), 1 палец', 'Whitlow (pus), 1 finger', 10000, 15000),
      r('Тырнақ саңырауқұлағы (микоз)', 'Микоз (грибок)', 'Nail fungus (mycosis)', 15000, 60000),
    ],
  },
];

// Әкімші бөлімі бағаны осы кілт бойынша өзгертеді (server/admin.html, /api/content)
export const priceId = (g: PriceGroup, r: PriceRow) => `${g.title.ru}|${r.name.ru}`;

const num = (n: number) => n.toLocaleString('ru-RU').replace(/\s/g, ' ');
export const fmtRange = (min: number, max: number) => (min === max ? `${num(min)} ₸` : `${num(min)} – ${num(max)} ₸`);
export const fmtFrom = (lang: Lang, n: number) =>
  ({ kk: `${num(n)} ₸-ден`, ru: `от ${num(n)} ₸`, en: `from ${num(n)} ₸` })[lang];
