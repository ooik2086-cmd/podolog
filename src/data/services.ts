// Қызметтер. Дереккөз: орталық баннеріндегі «Наши услуги» және Instagram профилі.
// confirmed: false — атауы мен сипаттамасы орталықтың материалымен әлі салыстырылмаған.
// Ұзақтық орталық растағанда толтырылады.
// Негізгі мәтін қазақша, орысша мен ағылшынша аудармасы төменде (servicesFor).
import type { Lang } from '../i18n';

export interface Service {
  slug: string;
  title: string;
  short: string;
  about: string[];
  steps: string[];
  duration: string | null;
  price: number | null; // KZT, ең төменгі баға («бастап»). Дереккөз: орталық прайсы (фото, 2026-10-22), толық тізім src/data/prices.ts
  popular: boolean;
  confirmed: boolean;
  icon: 'shield' | 'insole';
  image: string; // карточка фоны (уақытша иллюстрация, нақты фото келгенде ауыстырылады)
  imagePos?: string;
  photo?: string; // қызмет бетіндегі үлкен сурет (жоқ болса image)
}

export const services: Service[] = [
  {
    slug: 'ishke-oskan-tyrnaq',
    title: 'Ішке өскен тырнақ',
    short: 'Ауыртпай және хирургиясыз көмек.',
    about: [
      'Тырнақ шеті теріге батып өскенде ауырсыну, қызару және қабыну пайда болады. Подолог тырнақ шетін ауыртпай өңдейді, хирургиялық араласусыз.',
      'Қайталанбас үшін қажет болса түзету жүйесі ұсынылады және күтім мен аяқ киім бойынша кеңес беріледі.',
    ],
    steps: ['Тексеру', 'Тырнақ шетін ауыртпай өңдеу', 'Қажет болса түзету жүйесі', 'Үйдегі күтім бойынша кеңес'],
    duration: null, price: 10000, popular: true, confirmed: true, icon: 'shield', image: '/media/cards/act-scraper.webp', imagePos: '50% 80%', photo: '/media/real/ba-nail2.webp',
  },
  {
    slug: 'tuzetu-zhuyeleri',
    title: 'Тырнақты түзету жүйелері',
    short: 'Титан жіп, ЭТО және Unibrace жүйелері.',
    about: [
      'Түзету жүйелері тырнақ пластинасының пішінін біртіндеп қалпына келтіреді және ішке өсудің қайталануын азайтады.',
      'Орталықта титан жіп, ЭТО және Unibrace жүйелері қолданылады. Қай жүйе сізге сай екенін маман тексергеннен кейін айтады.',
    ],
    steps: ['Тырнақты тексеру', 'Жүйені таңдау', 'Орнату', 'Бақылау және ауыстыру'],
    duration: null, price: 15000, popular: true, confirmed: true, icon: 'shield', image: '/media/cards/act-drill.webp', imagePos: '50% 85%', photo: '/media/real/w-titan.webp',
  },
  {
    slug: 'ortoped-ultaraq',
    title: 'Жеке ортопедиялық ұлтарақ',
    short: 'Жаңа буын түзететін ұлтарақтар. Бір келуде дайын.',
    about: [
      'Ұлтарақ табаныңызды тексеру нәтижесі бойынша жеке жасалады. Қалыңдығы 2–4 мм, сондықтан кез келген аяқ киімге сыяды және оны үнемі киюге болады.',
      'Толық ақпарат «Ортопедиялық ұлтарақтар» бетінде.',
    ],
    steps: ['Табанды тексеру', 'Өлшем алу', 'Дайындау (сол келуде)', 'Киіп көру'],
    duration: null, price: 40000, popular: true, confirmed: true, icon: 'insole', image: '/media/cards/act-consult.webp', imagePos: '50% 75%',
  },
  {
    slug: 'diabettik-taban',
    title: 'Диабеттік табан',
    short: 'Қауіпсіз күтім және асқынулардың алдын алу.',
    about: [
      'Қант диабеті кезінде табан терісі мен тырнақ ерекше мұқият күтімді қажет етеді: кішкентай жарақаттың өзі ұзақ жазылуы мүмкін.',
      'Подолог табанды қауіпсіз өңдейді, қауіпті белгілерді ерте байқауға көмектеседі және үйдегі күтімді үйретеді. Емдеу қажет болса, дәрігерге жолдама ұсынылады.',
    ],
    steps: ['Табанды тексеру', 'Қауіпсіз өңдеу', 'Күтім жоспары'],
    duration: null, price: null, popular: false, confirmed: true, icon: 'shield', image: '/media/real/w-diabetic-foot.webp', imagePos: '50% 45%',
  },
  {
    slug: 'hallux-valgus',
    title: 'Hallux valgus («сүйек шығу»)',
    short: 'Түзету, жүктемені азайту және күтім.',
    about: [
      'Бас бармақтың сүйегі шығып, саусақ қисаюы аяқ киім кигенде ауырсыну мен мүйізгек тудырады.',
      'Орталықта ортездер, ұлтарақтар және күтім арқылы ауырсынатын аймақтың жүктемесін азайтып, жайлылықты арттырады.',
    ],
    steps: ['Табанды тексеру', 'Ортез немесе ұлтарақ таңдау', 'Күтім бойынша кеңес'],
    duration: null, price: null, popular: false, confirmed: true, icon: 'shield', image: '/media/cards/insoles.webp', imagePos: '50% 100%',
  },
  {
    slug: 'sausaqaralyq-ortezder',
    title: 'Саусақаралық ортездер',
    short: 'Жайлылық және саусақ қалпын түзету.',
    about: [
      'Ортез саусақтардың арасына қойылатын жұмсақ жеке құрал. Ол саусақтардың бір-біріне үйкелуін азайтып, қалпын түзеуге көмектеседі.',
    ],
    steps: ['Тексеру', 'Ортезді жеке жасау', 'Киіп көру'],
    duration: null, price: 20000, popular: false, confirmed: true, icon: 'shield', image: '/media/real/w-toe-orthosis.webp', imagePos: '50% 65%',
  },
  {
    slug: 'muyizgek-natoptysh',
    title: 'Мүйізгек және натоптыш',
    short: 'Аппаратпен алу және алдын алу.',
    about: [
      'Табандағы қатайған тері мен мүйізгектер көбіне қысымның дұрыс таралмауынан пайда болады.',
      'Подолог оларды аппаратпен қауіпсіз алады және себебін түсіндіреді. Қайталанбас үшін ұлтарақ немесе күтім құралдары ұсынылуы мүмкін.',
    ],
    steps: ['Тері күйін бағалау', 'Аппаратпен өңдеу', 'Алдын алу жоспары'],
    duration: null, price: 10000, popular: true, confirmed: true, icon: 'shield', image: '/media/cards/act-training.webp', imagePos: '50% 50%', photo: '/media/real/ba-heels.webp',
  },
  {
    slug: 'sanyrauqulaq-suyel',
    title: 'Саңырауқұлақ және сүйел',
    short: 'Тырнақ пен табан мәселелері подологтың кеңесінен басталады.',
    about: [
      'Тырнақтың түсі өзгеріп, қалыңдаса немесе табанда сүйел пайда болса, алдымен подологқа көрінген дұрыс.',
      'Маман тырнақты өңдейді, күтім жоспарын ұсынады. Дәрі-дәрмекпен емдеу керек болса, дәрігерге жолдама береді.',
    ],
    steps: ['Подолог кеңесі', 'Тырнақ немесе тері өңдеу', 'Күтім жоспары'],
    duration: null, price: 10000, popular: false, confirmed: true, icon: 'shield', image: '/media/cards/act-closeup.webp', imagePos: '50% 60%', photo: '/media/real/w-nail-dystrophy.webp',
  },
];


type ServiceText = Pick<Service, 'title' | 'short' | 'about' | 'steps'>;
const tr: Record<'ru' | 'en', Record<string, ServiceText>> = {
  ru: {
    'ishke-oskan-tyrnaq': {
      title: 'Вросший ноготь',
      short: 'Безболезненная помощь без хирургии.',
      about: [
        'Когда край ногтя врастает в кожу, появляются боль, покраснение и воспаление. Подолог безболезненно обрабатывает край ногтя, без хирургического вмешательства.',
        'Чтобы проблема не повторилась, при необходимости устанавливается корректирующая система, и вы получаете рекомендации по уходу и обуви.',
      ],
      steps: ['Осмотр', 'Безболезненная обработка края ногтя', 'Корректирующая система при необходимости', 'Рекомендации по домашнему уходу'],
    },
    'tuzetu-zhuyeleri': {
      title: 'Корректирующие системы для ногтей',
      short: 'Титановая нить, ЭТО и Unibrace.',
      about: [
        'Корректирующие системы постепенно восстанавливают форму ногтевой пластины и снижают риск повторного врастания.',
        'В центре применяются титановая нить, системы ЭТО и Unibrace. Какая система подходит именно вам, специалист скажет после осмотра.',
      ],
      steps: ['Осмотр ногтя', 'Выбор системы', 'Установка', 'Контроль и замена'],
    },
    'ortoped-ultaraq': {
      title: 'Индивидуальные ортопедические стельки',
      short: 'Корригирующие стельки нового поколения. Готовы за один визит.',
      about: [
        'Стельки изготавливаются индивидуально по результатам осмотра вашей стопы. Толщина 2–4 мм, поэтому они подходят к любой обуви и их можно носить постоянно.',
        'Подробнее на странице «Ортопедические стельки».',
      ],
      steps: ['Осмотр стопы', 'Снятие мерок', 'Изготовление (в тот же визит)', 'Примерка'],
    },
    'diabettik-taban': {
      title: 'Диабетическая стопа',
      short: 'Безопасный уход и профилактика осложнений.',
      about: [
        'При сахарном диабете кожа стоп и ногти требуют особенно бережного ухода: даже небольшая травма может долго заживать.',
        'Подолог безопасно обрабатывает стопы, помогает вовремя заметить тревожные признаки и учит правильному домашнему уходу. Если нужно лечение, вас направят к врачу.',
      ],
      steps: ['Осмотр стопы', 'Безопасная обработка', 'План ухода'],
    },
    'hallux-valgus': {
      title: 'Hallux valgus («косточка»)',
      short: 'Коррекция, разгрузка и уход.',
      about: [
        'Выступающая косточка у большого пальца и его искривление вызывают боль и мозоли при ношении обуви.',
        'В центре с помощью ортезов, стелек и ухода снижают нагрузку на болезненную зону и делают ходьбу комфортнее.',
      ],
      steps: ['Осмотр стопы', 'Подбор ортеза или стелек', 'Рекомендации по уходу'],
    },
    'sausaqaralyq-ortezder': {
      title: 'Межпальцевые ортезы',
      short: 'Комфорт и коррекция положения пальцев.',
      about: [
        'Ортез — это мягкое индивидуальное изделие, которое устанавливается между пальцами. Он уменьшает трение пальцев друг о друга и помогает скорректировать их положение.',
      ],
      steps: ['Осмотр', 'Индивидуальное изготовление ортеза', 'Примерка'],
    },
    'muyizgek-natoptysh': {
      title: 'Мозоли и натоптыши',
      short: 'Аппаратное удаление и профилактика.',
      about: [
        'Огрубевшая кожа и мозоли на стопах чаще всего появляются из-за неправильного распределения давления.',
        'Подолог безопасно удаляет их аппаратом и объясняет причину. Чтобы они не возвращались, могут быть рекомендованы стельки или средства ухода.',
      ],
      steps: ['Оценка состояния кожи', 'Аппаратная обработка', 'План профилактики'],
    },
    'sanyrauqulaq-suyel': {
      title: 'Грибок и бородавки',
      short: 'Решение проблем ногтей и стоп начинается с консультации подолога.',
      about: [
        'Если ноготь изменил цвет и утолщился или на стопе появилась бородавка, сначала стоит показаться подологу.',
        'Специалист обработает ноготь и предложит план ухода. Если требуется медикаментозное лечение, он направит к врачу.',
      ],
      steps: ['Консультация подолога', 'Обработка ногтя или кожи', 'План ухода'],
    },
  },
  en: {
    'ishke-oskan-tyrnaq': {
      title: 'Ingrown toenail',
      short: 'Painless help without surgery.',
      about: [
        'When the edge of a nail grows into the skin, it causes pain, redness and inflammation. The podiatrist treats the nail edge painlessly, without surgery.',
        'To keep it from coming back, a correction system can be fitted if needed, and you get advice on care and footwear.',
      ],
      steps: ['Examination', 'Painless treatment of the nail edge', 'Correction system if needed', 'Home care advice'],
    },
    'tuzetu-zhuyeleri': {
      title: 'Nail correction systems',
      short: 'Titanium wire, ETO and Unibrace systems.',
      about: [
        'Correction systems gradually restore the shape of the nail plate and reduce the chance of the nail growing in again.',
        'The center uses titanium wire, ETO and Unibrace systems. The specialist will tell you which one suits you after an examination.',
      ],
      steps: ['Nail examination', 'Choosing a system', 'Fitting', 'Follow-up and replacement'],
    },
    'ortoped-ultaraq': {
      title: 'Custom orthopedic insoles',
      short: 'New-generation corrective insoles, ready in one visit.',
      about: [
        'The insoles are made individually based on an examination of your feet. They are 2–4 mm thick, so they fit any shoes and can be worn every day.',
        'Full details are on the “Orthopedic insoles” page.',
      ],
      steps: ['Foot examination', 'Taking measurements', 'Making the insoles (same visit)', 'Fitting'],
    },
    'diabettik-taban': {
      title: 'Diabetic foot',
      short: 'Safe care and prevention of complications.',
      about: [
        'With diabetes, the skin and nails of the feet need especially careful care: even a small injury can take a long time to heal.',
        'The podiatrist treats the feet safely, helps spot warning signs early and teaches proper home care. If treatment is needed, you will be referred to a doctor.',
      ],
      steps: ['Foot examination', 'Safe treatment', 'Care plan'],
    },
    'hallux-valgus': {
      title: 'Hallux valgus (bunion)',
      short: 'Correction, offloading and care.',
      about: [
        'A bunion at the big toe and the bending of the toe cause pain and calluses when wearing shoes.',
        'The center uses orthoses, insoles and care to reduce the load on the painful area and make walking more comfortable.',
      ],
      steps: ['Foot examination', 'Choosing an orthosis or insoles', 'Care advice'],
    },
    'sausaqaralyq-ortezder': {
      title: 'Toe orthoses',
      short: 'Comfort and correction of toe position.',
      about: [
        'A toe orthosis is a soft, custom-made device placed between the toes. It reduces friction between the toes and helps correct their position.',
      ],
      steps: ['Examination', 'Making a custom orthosis', 'Fitting'],
    },
    'muyizgek-natoptysh': {
      title: 'Calluses and corns',
      short: 'Device-based removal and prevention.',
      about: [
        'Hardened skin and calluses on the feet usually appear because pressure is not distributed correctly.',
        'The podiatrist removes them safely with a device and explains the cause. To prevent them coming back, insoles or care products may be recommended.',
      ],
      steps: ['Skin assessment', 'Device treatment', 'Prevention plan'],
    },
    'sanyrauqulaq-suyel': {
      title: 'Fungus and warts',
      short: 'Nail and foot problems start with a podiatrist consultation.',
      about: [
        'If a nail changes color and thickens, or a wart appears on the foot, it is best to see a podiatrist first.',
        'The specialist treats the nail and suggests a care plan. If medication is needed, you will be referred to a doctor.',
      ],
      steps: ['Podiatrist consultation', 'Nail or skin treatment', 'Care plan'],
    },
  },
};

export const servicesFor = (lang: Lang): Service[] =>
  lang === 'kk' ? services : services.map((s) => ({ ...s, ...(tr[lang][s.slug] ?? {}) }));
export const popularServicesFor = (lang: Lang) => servicesFor(lang).filter((s) => s.popular);
