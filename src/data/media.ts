import type { Lang } from '../i18n';
import { cms, tr, type CmsMedia, type CmsCert } from './cms';
// Сертификаттар мен галерея. Суреттер public/media/ ішіне түседі.
// Құжаттағы анық оқылмайтын мәлімет ойдан толтырылмайды (year: null).

export interface Certificate {
  image: string;
  thumb: string;
  title: string;
  year: number | null;
  category: CertCategory;
  note?: string; // маманның аты-жөні
  landscape: boolean;
}

export const certCategories = [
  'Подология',
  'Ортопедия',
  'Ортопедиялық ұлтарақтар',
  'PRO стопы курстары',
  'Мозольдер және гиперкератоз',
  'PodiaFarm',
  'Семинарлар мен конгресстер',
  'Оқытушылық қызмет',
] as const;
export type CertCategory = (typeof certCategories)[number];

// Дереккөз: materials/certificates/certificates.json (сертификат фотоларын өңдеу треді)
export const certificates: Certificate[] = [
  { image: '/media/certificates/wave-master-zhanna-kim.webp', thumb: '/media/certificates/wave-master-zhanna-kim-sm.webp', title: "Wave Master System: ресми практик сертификаты, 10 сағат, Алматы, 14.04.2026", year: 2026, category: "PRO стопы курстары", note: "Zhanna Kim", landscape: false },
  { image: '/media/certificates/aprk-meeting-kim-zhanna.webp', thumb: '/media/certificates/aprk-meeting-kim-zhanna-sm.webp', title: "IV өңірлік подологтар мен дәрігерлер кездесуі, Астана, 16.11.2025 (АПРК)", year: 2025, category: "Семинарлар мен конгресстер", note: "Ким Жанна", landscape: true },
  { image: '/media/certificates/podo-toi-kim-zhanna.webp', thumb: '/media/certificates/podo-toi-kim-zhanna-sm.webp', title: "Қазақстан подологтар форумы «Podo Той 3.0», Алматы, 30.05.2025", year: 2025, category: "Семинарлар мен конгресстер", note: "Ким Жанна", landscape: false },
  { image: '/media/certificates/dorogoi-nastavnik-kim-zhanna.webp', thumb: '/media/certificates/dorogoi-nastavnik-kim-zhanna-sm.webp', title: "«Дорогой наставник» менторлық бағдарламасы, 15.03–11.05.2025 (О. және П. Янцен)", year: 2025, category: "Оқытушылық қызмет", note: "Жанна Ким", landscape: true },
  { image: '/media/certificates/podiafarm-partner-kim-zhanna.webp', thumb: '/media/certificates/podiafarm-partner-kim-zhanna-sm.webp', title: "PodiaFarm ресми серіктесі (Қызылорда), АРХОНТ мәртебесі: оқыту құқығы, Мәскеу, 15.08.2025", year: 2025, category: "PodiaFarm", note: "Ким Жанна", landscape: false },
  { image: '/media/certificates/ceta-podologia-zhanna-kim.webp', thumb: '/media/certificates/ceta-podologia-zhanna-kim-sm.webp', title: "Clínicas Ceta: «Formación Avanzada en Podología», 3 ай онлайн, Мадрид, 01.01.2024", year: 2024, category: "Подология", note: "Zhanna Kim", landscape: false },
  { image: '/media/certificates/bodyo-insoles-kim-zhanna.webp', thumb: '/media/certificates/bodyo-insoles-kim-zhanna-sm.webp', title: "BODYO (Мәскеу): жеке анатомиялық ұлтарақтар жасау семинары, 8 академ. сағат", year: 2023, category: "Ортопедиялық ұлтарақтар", note: "Ким Жанна", landscape: true },
  { image: '/media/certificates/prostopy-pro-ortopediyu-kim-zhanna.webp', thumb: '/media/certificates/prostopy-pro-ortopediyu-kim-zhanna-sm.webp', title: "PROстопы мектебі: «PRO ортопедию», 8 сағат, 18.04.2022", year: 2022, category: "PRO стопы курстары", note: "Ким Жанна", landscape: false },
  { image: '/media/certificates/prostopy-pro-razgruzki-kim-zhanna.webp', thumb: '/media/certificates/prostopy-pro-razgruzki-kim-zhanna-sm.webp', title: "PROстопы мектебі: «PRO разгрузки» (Herbitas), 2 сағат, 19.04.2022", year: 2022, category: "PRO стопы курстары", note: "Ким Жанна", landscape: false },
  { image: '/media/certificates/prostopy-norma-pedicure-kim-zhanna.webp', thumb: '/media/certificates/prostopy-norma-pedicure-kim-zhanna-sm.webp', title: "PROстопы мектебі: «NORMA pedicure», 21–25.02.2022", year: 2022, category: "PRO стопы курстары", note: "Ким Жанна", landscape: false },
  { image: '/media/certificates/nitinol-kim-zhanna.webp', thumb: '/media/certificates/nitinol-kim-zhanna-sm.webp', title: "Куәлік №001: «Нитинол жібі» практикалық тағылымдамасы, Нұр-Сұлтан, 25.05.2021", year: 2021, category: "Подология", note: "Ким Жанна", landscape: true },
  { image: '/media/certificates/podocenter-vrosshii-kim-zhanna.webp', thumb: '/media/certificates/podocenter-vrosshii-kim-zhanna-sm.webp', title: "podocenter.kz семинары: «Вросший ноготь. Раневой процесс», Алматы, 26.09.2021", year: 2021, category: "Подология", note: "Ким Жанна", landscape: false },
  { image: '/media/certificates/podiafarm-lim-svetlana.webp', thumb: '/media/certificates/podiafarm-lim-svetlana-sm.webp', title: "PodiaFarm тақырыптық семинары, 10 сағат; Подолог орталығы мен PodiaFarm", year: 2026, category: "PodiaFarm", note: "Лим Светлана Викторовна", landscape: false },
  { image: '/media/certificates/podiafarm-kim-sergei.webp', thumb: '/media/certificates/podiafarm-kim-sergei-sm.webp', title: "PodiaFarm тақырыптық семинары, 10 сағат; Подолог орталығы мен PodiaFarm", year: 2026, category: "PodiaFarm", note: "Ким Сергей Анатольевич", landscape: false },
  { image: '/media/certificates/apkr-lim-svetlana.webp', thumb: '/media/certificates/apkr-lim-svetlana-sm.webp', title: "Қазақстан подологтар қауымдастығының (АПРК) мүшесі, 06.2025 бастап", year: 2025, category: "Подология", note: "Лим Светлана", landscape: true },
  { image: '/media/certificates/podolog-borodavki-lim-svetlana.webp', thumb: '/media/certificates/podolog-borodavki-lim-svetlana-sm.webp', title: "Подолог орталығы: «Бородавки и мозоли», 9 сағат, 2025", year: 2025, category: "Мозольдер және гиперкератоз", note: "Лим Светлана", landscape: false },
  { image: '/media/certificates/podolog-apparatnyi-lim-svetlana.webp', thumb: '/media/certificates/podolog-apparatnyi-lim-svetlana-sm.webp', title: "Подолог орталығы: «Аппаратный подо-педикюр», 9 сағат, 2025", year: 2025, category: "Подология", note: "Лим Светлана", landscape: false },
  { image: '/media/certificates/prostopy-pro-nogti-kim-sergei.webp', thumb: '/media/certificates/prostopy-pro-nogti-kim-sergei-sm.webp', title: "PROстопы мектебі: «PRO ногти», 9 сағат, 10.06.2025", year: 2025, category: "PRO стопы курстары", note: "Ким Сергей", landscape: false },
  { image: '/media/certificates/podolog-vrosshii-lim-svetlana.webp', thumb: '/media/certificates/podolog-vrosshii-lim-svetlana-sm.webp', title: "Подолог орталығы: «Вросший ноготь. Раневой процесс», 10,5 сағат, 2025", year: 2025, category: "Подология", note: "Лим Светлана", landscape: false },
  { image: '/media/certificates/footmaster-orthoses-kim-sergei.webp', thumb: '/media/certificates/footmaster-orthoses-kim-sergei-sm.webp', title: "«Футмастер» (Мәскеу): подиатриялық диагностика және термопластикалық ортездер жасау, 29 маусым – 1 шілде", year: null, category: "Ортопедиялық ұлтарақтар", note: "Ким Сергей", landscape: false },
  { image: '/media/certificates/footmaster-diagnostics-kim-sergei.webp', thumb: '/media/certificates/footmaster-diagnostics-kim-sergei-sm.webp', title: "«Футмастер»: ортопедиялық-подиатриялық диагностика және термоформаланатын ортездер, 29–30 қазан", year: null, category: "Ортопедия", note: "Сергей Ким", landscape: true },
  { image: '/media/certificates/iskendirova-paramed-pedikyur.webp', thumb: '/media/certificates/iskendirova-paramed-pedikyur-sm.webp', title: "Подолог орталығы: «Парамедициналық подо педикюр», 10 сағат («Введение в подологию»)", year: null, category: "Подология", note: "Искендирова Айгерим Куандыковна", landscape: true },
  { image: '/media/certificates/iskendirova-mikoz.webp', thumb: '/media/certificates/iskendirova-mikoz-sm.webp', title: "Подолог орталығы: «Тырнақ және табан микозы», 10 сағат («Введение в подологию»)", year: null, category: "Подология", note: "Искендирова Айгерим Куандыковна", landscape: true },
  { image: '/media/certificates/iskendirova-podiafarm.webp', thumb: '/media/certificates/iskendirova-podiafarm-sm.webp', title: "PodiaFarm тақырыптық семинары, 10 сағат; Подолог орталығы мен PodiaFarm", year: null, category: "PodiaFarm", note: "Искендирова Айгерим Куандыковна", landscape: false },
  { image: '/media/certificates/iskendirova-pro-borodavki.webp', thumb: '/media/certificates/iskendirova-pro-borodavki-sm.webp', title: "Подолог орталығы: «PRO Бородавки», 10 сағат («Введение в подологию»)", year: null, category: "Мозольдер және гиперкератоз", note: "Искендирова Айгерим Куандыковна", landscape: true },
  { image: '/media/certificates/iskendirova-titanovaya-nit.webp', thumb: '/media/certificates/iskendirova-titanovaya-nit-sm.webp', title: "Подолог орталығы: «Титан жібі»: тырнақ пластинасын түзету, 10 сағат («Введение в подологию»)", year: null, category: "Подология", note: "Искендирова Айгерим Куандыковна", landscape: true },
];

export interface GalleryItem {
  image: string;
  caption: string;
  category: GalleryCategory;
  sub?: string;
  video?: string;
}

export const galleryCategories = [
  'Кабинет',
  'Құралдар мен жабдықтар',
  'Ұлтарақ жасау',
  'Қабылдау процесі',
  'Сабақтар',
  'Семинарлар',
  'Өнімдер',
  'Команда',
  'Емге дейін және кейін',
  'Жиі кездесетін жағдайлар',
] as const;
export type GalleryCategory = (typeof galleryCategories)[number];

// Кабинет пен қабылдау аймағының суреттері (Aza, 2026-10-23)
export const gallery: GalleryItem[] = [
  { image: '/media/real/team7.webp', caption: 'Подолог орталығының ұжымы', category: 'Команда' },
  { image: '/media/real/ba-nail2.webp', caption: 'Ішке өскен тырнақ: емге дейін және кейін', category: 'Емге дейін және кейін' },
  { image: '/media/real/ba-nail1.webp', caption: 'Қабынған тырнақ білігі: емге дейін және кейін', category: 'Емге дейін және кейін' },
  { image: '/media/real/ba-heels2.webp', caption: 'Құрғақ, жарылған өкше: күтімге дейін және кейін', category: 'Емге дейін және кейін' },
  { image: '/media/real/ba-heels.webp', caption: 'Өкшедегі жарықтар: күтімге дейін және кейін', category: 'Емге дейін және кейін' },
  { image: '/media/real/w-ingrown-inflamed.webp', caption: 'Қабынған ішке өскен тырнақ', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-titan-wire.webp', caption: 'Титан жібі орнатылған тырнақ', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-nail-damaged.webp', caption: 'Зақымданған, түсі өзгерген тырнақ', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-heel-core.webp', caption: 'Өкшедегі өзекті мүйізгек', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-titan.webp', caption: 'Тырнақты титан жібімен түзету', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-nail-dystrophy.webp', caption: 'Зақымданған, қалыңдаған тырнақ', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-warts.webp', caption: 'Табандағы сүйел', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-heel1.webp', caption: 'Өкшедегі терең жарық', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/w-heel2.webp', caption: 'Құрғақ, жарылған өкше', category: 'Жиі кездесетін жағдайлар' },
  { image: '/media/real/zhanna-studio.webp', caption: 'Жанна Ким, орталық жетекшісі', category: 'Команда' },
  { image: '/media/real/svetlana-tool.webp', caption: 'Светлана Лим, жетекші подолог', category: 'Команда' },
  { image: '/media/real/sergei-insole.webp', caption: 'Ұлтарақ пен табан қаңқасының моделі', category: 'Ұлтарақ жасау' },
  { image: '/media/real/lesson-hallux.webp', caption: 'Сабақ: бас бармақтың қисаюы (hallux valgus)', category: 'Сабақтар' },
  { image: '/media/real/lesson-board.webp', caption: 'Орталықтағы теориялық сабақ', category: 'Сабақтар' },
  { image: '/media/real/lesson-stop.webp', caption: 'Курс тыңдаушыларымен сабақ', category: 'Сабақтар' },
  { image: '/media/real/zhanna-congress.webp', caption: 'Жанна Ким подологтар конгресінде', category: 'Семинарлар' },
  { image: '/media/real/team4-logo.webp', caption: 'Подолог орталығының командасы', category: 'Команда' },
  { image: '/media/real/team4-posters.webp', caption: 'Мамандар', category: 'Команда' },
  { image: '/media/real/aigerim-notes.webp', caption: 'Подолог қабылдауда', category: 'Команда' },
  { image: '/media/real/grad-group.webp', caption: 'Курс түлектері', category: 'Сабақтар' },
  { image: '/media/real/grad-roman-zhanna.webp', caption: 'Түлек сертификаттарымен', category: 'Сабақтар' },
  { image: '/media/real/grad-zhanna-inkar.webp', caption: 'Түлек сертификаттарымен', category: 'Сабақтар' },
  { image: '/media/real/svetlana-zhanna-cert.webp', caption: '«Бородавки и мозоли» курсының сертификаттары', category: 'Сабақтар' },
  { image: '/media/real/congress-2025.webp', caption: 'V Қазақстан подологтарының конгресі, Алматы, 2025', category: 'Семинарлар' },
  { image: '/media/real/facade.webp', caption: 'Орталықтың маңдайшасы', category: 'Кабинет' },
  { image: '/media/real/entrance.webp', caption: 'Орталыққа кіреберіс', category: 'Кабинет' },
  { image: '/media/gallery/cabinet-branded.webp', caption: 'Подолог кабинеті', category: 'Кабинет' },
  { image: '/media/gallery/reception.webp', caption: 'Қабылдау аймағы', category: 'Кабинет' },
  { image: '/media/gallery/cabinet-white.webp', caption: 'Процедура креслосы', category: 'Кабинет' },
  { image: '/media/gallery/consult.webp', caption: 'Кеңес беру және ұлтарақ таңдау', category: 'Қабылдау процесі' },
  { image: '/media/equip/eq-unit-ai.webp', caption: 'Шаң сорғышы бар подологиялық аппарат', sub: 'Тырнақ пен қатайған теріні өңдейді, шаңды бірден сорып алады.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-unit.webp', caption: 'Шаң сорғышы бар подологиялық аппарат', sub: 'Тырнақ пен қатайған теріні өңдейді, шаңды бірден сорып алады.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-chair-ai.webp', caption: 'Подологиялық кресло', sub: 'Клиентке ыңғайлы, маманға аяқты дұрыс бұрышта өңдеуге мүмкіндік береді.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-chair.webp', caption: 'Подологиялық кресло', sub: 'Клиентке ыңғайлы, маманға аяқты дұрыс бұрышта өңдеуге мүмкіндік береді.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-lamp-ai.webp', caption: 'Үлкейткіш шам', sub: 'Тырнақ пен терідегі ұсақ өзгерістерді анық көруге көмектеседі.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-lamp.webp', caption: 'Үлкейткіш шам', sub: 'Тырнақ пен терідегі ұсақ өзгерістерді анық көруге көмектеседі.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-autoclave.webp', caption: 'Автоклав', sub: 'Қайта қолданылатын құралдарды жоғары температурада стерильдейді.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-ultrasonic.webp', caption: 'Ультрадыбыстық жуғыш', sub: 'Стерильдеу алдында құралдарды терең тазартады.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-podoscope-ai.webp', caption: 'Плантоскоп және табан қысымын өлшеу', sub: 'Табанға түсетін жүктемені көрсетеді, жеке ұлтарақ таңдауға көмектеседі.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-podoscope.webp', caption: 'Плантоскоп және табан қысымын өлшеу', sub: 'Табанға түсетін жүктемені көрсетеді, жеке ұлтарақ таңдауға көмектеседі.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-monofilament.webp', caption: 'Монофиламент', sub: 'Табанның сезімталдығын тексереді, әсіресе қант диабеті кезінде.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-correction-ai.webp', caption: 'Тырнақты түзету жүйелері', sub: 'Титан жібі, серіппе және пластиналар ішке өскен тырнақты түзетеді.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-correction.webp', caption: 'Тырнақты түзету жүйелері', sub: 'Титан жібі, серіппе және пластиналар ішке өскен тырнақты түзетеді.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-tools.webp', caption: 'Кәсіби құралдар мен фрезалар', sub: 'Қысқыштар, зондтар, кюреткалар, бір реттік жүздер.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-foot-model.webp', caption: 'Табан қаңқасының моделі', sub: 'Клиентке табан сүйектері мен буындарының құрылысын көрнекі түсіндіруге арналған.', category: 'Құралдар мен жабдықтар' },
  { image: '/media/equip/eq-insoles.webp', caption: 'Ортопедиялық ұлтарақтар', sub: 'Табан күмбезін ұстап, жүктемені дұрыс бөледі.', category: 'Ұлтарақ жасау' },
  { image: '/media/equip/eq-insoles-poster.webp', caption: 'Ұлтарақ және табан моделі', category: 'Ұлтарақ жасау' },
  { image: '/media/gallery/steril.webp', caption: 'Құралдарды стерильдеу', category: 'Құралдар мен жабдықтар' },
  { image: '/media/real/proc-brace.webp', caption: 'Ішке өскен тырнаққа түзету скобасын орнату', category: 'Қабылдау процесі' },
  { image: '/media/cards/act-training.webp', caption: 'Процедура кезіндегі мұқият жұмыс', category: 'Қабылдау процесі' },
  { image: '/media/cards/act-insoles.webp', caption: 'Жеке ұлтарақты таңдау', category: 'Қабылдау процесі' },
  { image: '/media/cards/act-steril.webp', caption: 'Құралдарды стерильдеуге дайындау', category: 'Қабылдау процесі' },
  { image: '/media/cards/act-closeup.webp', caption: 'Тырнақ шетін зондпен мұқият өңдеу', category: 'Қабылдау процесі' },
  { image: '/media/cards/sergei.webp', caption: 'Сергей Ким ұлтарақтарымен', category: 'Қабылдау процесі' },
  { image: '/media/gallery/zhanna-procedure.webp', caption: 'Жанна Ким процедура кезінде', category: 'Қабылдау процесі' },
  { image: '/media/podiafarm/pf-01.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-02.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-03.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-04.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-05.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-06.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-07.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-08.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-09.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-10.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-11.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-12.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-13.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-14.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
  { image: '/media/podiafarm/pf-15.webp', caption: 'PodiaFarm өнімдері', category: 'Өнімдер' },
];

// Аудармалар: санаттар мен сертификат атаулары (кілт: суреттің файл аты)

const certCatTr: Record<'ru' | 'en', Record<CertCategory, string>> = {
  ru: {
    'Подология': 'Подология', 'Ортопедия': 'Ортопедия', 'Ортопедиялық ұлтарақтар': 'Ортопедические стельки',
    'PRO стопы курстары': 'Курсы PROстопы', 'Мозольдер және гиперкератоз': 'Мозоли и гиперкератоз', 'PodiaFarm': 'PodiaFarm',
    'Семинарлар мен конгресстер': 'Семинары и конгрессы', 'Оқытушылық қызмет': 'Преподавательская деятельность',
  },
  en: {
    'Подология': 'Podiatry', 'Ортопедия': 'Orthopedics', 'Ортопедиялық ұлтарақтар': 'Orthopedic insoles',
    'PRO стопы курстары': 'PROstopy courses', 'Мозольдер және гиперкератоз': 'Calluses and hyperkeratosis', 'PodiaFarm': 'PodiaFarm',
    'Семинарлар мен конгресстер': 'Seminars and congresses', 'Оқытушылық қызмет': 'Teaching',
  },
};

const certTitleTr: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    'wave-master-zhanna-kim': 'Wave Master System: официальный сертификат практика, 10 часов, Алматы, 14.04.2026',
    'aprk-meeting-kim-zhanna': 'IV региональная встреча подологов и врачей, Астана, 16.11.2025 (АПРК)',
    'podo-toi-kim-zhanna': 'Форум подологов Казахстана «Podo Той 3.0», Алматы, 30.05.2025',
    'dorogoi-nastavnik-kim-zhanna': 'Менторская программа «Дорогой наставник», 15.03–11.05.2025 (О. и П. Янцен)',
    'podiafarm-partner-kim-zhanna': 'Официальный партнёр PodiaFarm (Кызылорда), статус АРХОНТ: право обучения, Москва, 15.08.2025',
    'ceta-podologia-zhanna-kim': 'Clínicas Ceta: «Formación Avanzada en Podología», 3 месяца онлайн, Мадрид, 01.01.2024',
    'bodyo-insoles-kim-zhanna': 'BODYO (Москва): семинар по изготовлению индивидуальных анатомических стелек, 8 акад. часов',
    'prostopy-pro-ortopediyu-kim-zhanna': 'Школа PROстопы: «PRO ортопедию», 8 часов, 18.04.2022',
    'prostopy-pro-razgruzki-kim-zhanna': 'Школа PROстопы: «PRO разгрузки» (Herbitas), 2 часа, 19.04.2022',
    'prostopy-norma-pedicure-kim-zhanna': 'Школа PROстопы: «NORMA pedicure», 21–25.02.2022',
    'nitinol-kim-zhanna': 'Свидетельство №001: практическая стажировка «Нитиноловая нить», Нур-Султан, 25.05.2021',
    'podocenter-vrosshii-kim-zhanna': 'Семинар podocenter.kz: «Вросший ноготь. Раневой процесс», Алматы, 26.09.2021',
    'podiafarm-lim-svetlana': 'Тематический семинар PodiaFarm, 10 часов; центр «Подолог» и PodiaFarm',
    'podiafarm-kim-sergei': 'Тематический семинар PodiaFarm, 10 часов; центр «Подолог» и PodiaFarm',
    'apkr-lim-svetlana': 'Член Ассоциации подологов Казахстана (АПРК) с 06.2025',
    'podolog-borodavki-lim-svetlana': 'Центр «Подолог»: «Бородавки и мозоли», 9 часов, 2025',
    'podolog-apparatnyi-lim-svetlana': 'Центр «Подолог»: «Аппаратный подо-педикюр», 9 часов, 2025',
    'prostopy-pro-nogti-kim-sergei': 'Школа PROстопы: «PRO ногти», 9 часов, 10.06.2025',
    'podolog-vrosshii-lim-svetlana': 'Центр «Подолог»: «Вросший ноготь. Раневой процесс», 10,5 часа, 2025',
    'footmaster-orthoses-kim-sergei': '«Футмастер» (Москва): подиатрическая диагностика и изготовление термопластических ортезов, 29 июня – 1 июля',
    'footmaster-diagnostics-kim-sergei': '«Футмастер»: ортопедо-подиатрическая диагностика и термоформуемые ортезы, 29–30 октября',
    'iskendirova-paramed-pedikyur': 'Центр «Подолог»: «Парамедицинский подо педикюр», 10 часов («Введение в подологию»)',
    'iskendirova-mikoz': 'Центр «Подолог»: «Микоз ногтей и стоп», 10 часов («Введение в подологию»)',
    'iskendirova-podiafarm': 'Тематический семинар PodiaFarm, 10 часов; центр «Подолог» и PodiaFarm',
    'iskendirova-pro-borodavki': 'Центр «Подолог»: «PRO Бородавки», 10 часов («Введение в подологию»)',
    'iskendirova-titanovaya-nit': 'Центр «Подолог»: «Титановая нить»: коррекция ногтевой пластины, 10 часов («Введение в подологию»)',
  },
  en: {
    'wave-master-zhanna-kim': 'Wave Master System: official practitioner certificate, 10 hours, Almaty, 14.04.2026',
    'aprk-meeting-kim-zhanna': '4th regional meeting of podiatrists and doctors, Astana, 16.11.2025 (APRK)',
    'podo-toi-kim-zhanna': 'Kazakhstan Podiatrists Forum “Podo Toi 3.0”, Almaty, 30.05.2025',
    'dorogoi-nastavnik-kim-zhanna': '“Dear Mentor” mentoring program, 15.03–11.05.2025 (O. and P. Yantsen)',
    'podiafarm-partner-kim-zhanna': 'Official PodiaFarm partner (Kyzylorda), ARCHON status: right to teach, Moscow, 15.08.2025',
    'ceta-podologia-zhanna-kim': 'Clínicas Ceta: “Formación Avanzada en Podología”, 3 months online, Madrid, 01.01.2024',
    'bodyo-insoles-kim-zhanna': 'BODYO (Moscow): seminar on making custom anatomical insoles, 8 academic hours',
    'prostopy-pro-ortopediyu-kim-zhanna': 'PROstopy school: “PRO orthopedics”, 8 hours, 18.04.2022',
    'prostopy-pro-razgruzki-kim-zhanna': 'PROstopy school: “PRO offloading” (Herbitas), 2 hours, 19.04.2022',
    'prostopy-norma-pedicure-kim-zhanna': 'PROstopy school: “NORMA pedicure”, 21–25.02.2022',
    'nitinol-kim-zhanna': 'Certificate No. 001: “Nitinol wire” practical internship, Nur-Sultan, 25.05.2021',
    'podocenter-vrosshii-kim-zhanna': 'podocenter.kz seminar: “Ingrown nail. Wound healing”, Almaty, 26.09.2021',
    'podiafarm-lim-svetlana': 'PodiaFarm topical seminar, 10 hours; Podolog center and PodiaFarm',
    'podiafarm-kim-sergei': 'PodiaFarm topical seminar, 10 hours; Podolog center and PodiaFarm',
    'apkr-lim-svetlana': 'Member of the Association of Podiatrists of Kazakhstan (APRK) since 06.2025',
    'podolog-borodavki-lim-svetlana': 'Podolog center: “Warts and calluses”, 9 hours, 2025',
    'podolog-apparatnyi-lim-svetlana': 'Podolog center: “Device-based podo pedicure”, 9 hours, 2025',
    'prostopy-pro-nogti-kim-sergei': 'PROstopy school: “PRO nails”, 9 hours, 10.06.2025',
    'podolog-vrosshii-lim-svetlana': 'Podolog center: “Ingrown nail. Wound healing”, 10.5 hours, 2025',
    'footmaster-orthoses-kim-sergei': 'Footmaster (Moscow): podiatric diagnostics and making thermoplastic orthoses, 29 June – 1 July',
    'footmaster-diagnostics-kim-sergei': 'Footmaster: orthopedic and podiatric diagnostics and thermoformed orthoses, 29–30 October',
    'iskendirova-paramed-pedikyur': 'Podolog center: “Paramedical podo pedicure”, 10 hours (“Introduction to podiatry”)',
    'iskendirova-mikoz': 'Podolog center: “Nail and foot mycosis”, 10 hours (“Introduction to podiatry”)',
    'iskendirova-podiafarm': 'PodiaFarm topical seminar, 10 hours; Podolog center and PodiaFarm',
    'iskendirova-pro-borodavki': 'Podolog center: “PRO Warts”, 10 hours (“Introduction to podiatry”)',
    'iskendirova-titanovaya-nit': 'Podolog center: “Titanium wire”: nail plate correction, 10 hours (“Introduction to podiatry”)',
  },
};

// Аты-жөндер латынша (ағылшын нұсқасы үшін)
const nameEn: Record<string, string> = {
  'Ким Жанна': 'Zhanna Kim', 'Жанна Ким': 'Zhanna Kim', 'Лим Светлана Викторовна': 'Svetlana Lim', 'Лим Светлана': 'Svetlana Lim',
  'Ким Сергей Анатольевич': 'Sergei Kim', 'Ким Сергей': 'Sergei Kim', 'Сергей Ким': 'Sergei Kim',
  'Искендирова Айгерим Куандыковна': 'Aigerim Iskendirova',
};

const galCatTr: Record<'ru' | 'en', Record<GalleryCategory, string>> = {
  ru: { 'Кабинет': 'Кабинет', 'Құралдар мен жабдықтар': 'Инструменты и оборудование', 'Ұлтарақ жасау': 'Изготовление стелек', 'Қабылдау процесі': 'Процесс приёма', 'Сабақтар': 'Занятия', 'Семинарлар': 'Семинары', 'Өнімдер': 'Продукция', 'Команда': 'Команда', 'Емге дейін және кейін': 'До и после', 'Жиі кездесетін жағдайлар': 'Частые проблемы' },
  en: { 'Кабинет': 'Treatment room', 'Құралдар мен жабдықтар': 'Tools and equipment', 'Ұлтарақ жасау': 'Making insoles', 'Қабылдау процесі': 'Appointments', 'Сабақтар': 'Classes', 'Семинарлар': 'Seminars', 'Өнімдер': 'Products', 'Команда': 'Team', 'Емге дейін және кейін': 'Before and after', 'Жиі кездесетін жағдайлар': 'Common problems' },
};

const pfCap = { ru: 'Продукция PodiaFarm', en: 'PodiaFarm products' };
const key = (image: string) => image.split('/').pop()!.replace(/\.\w+$/, '').replace(/-ai$/, '');
export const certCategoriesFor = (lang: Lang): string[] => certCategories.map((c) => (lang === 'kk' ? c : certCatTr[lang][c]));
const idOf = (path: string) => path.split('/').pop()!.replace(/\.\w+$/, '');
// Әкімші бөліміне берілетін бастапқы тізім: әр жазуы үш тілде
export const certDefaults = (): CmsCert[] => certificates.map((c) => ({
  id: idOf(c.image), image: c.image, thumb: c.thumb, year: c.year, category: c.category, note: c.note, landscape: c.landscape,
  title: { kk: c.title, ru: certTitleTr.ru[key(c.image)] ?? c.title, en: certTitleTr.en[key(c.image)] ?? c.title },
}));
export const certificatesFor = (lang: Lang) =>
  (cms.certificates ?? certDefaults()).filter((c) => !c.hidden).map((c) => ({
    image: c.image, thumb: c.thumb, year: c.year, landscape: c.landscape,
    title: tr(c.title, lang),
    category: lang === 'kk' ? c.category : certCatTr[lang][c.category as CertCategory] ?? c.category,
    note: lang === 'en' && c.note ? nameEn[c.note] ?? c.note : c.note,
  }));
export const galleryCategoriesFor = (lang: Lang): string[] => galleryCategories.map((c) => (lang === 'kk' ? c : galCatTr[lang][c]));
const galCapTr: Record<'ru' | 'en', Record<string, string>> = {
  ru: { 'team7': 'Коллектив центра «Подолог»', facade: 'Вывеска центра', entrance: 'Вход в центр', 'cabinet-branded': 'Кабинет подолога', reception: 'Зона ресепшн', 'cabinet-white': 'Процедурное кресло', 'team4-logo': 'Команда центра «Подолог»', 'team4-posters': 'Специалисты центра', 'sergei-foot-model': 'Стелька и модель стопы', 'aigerim-notes': 'Подолог на приёме', 'grad-group': 'Выпускники курса', 'grad-roman-zhanna': 'Выпускник с сертификатами', 'grad-zhanna-inkar': 'Выпускница с сертификатами', 'svetlana-zhanna-cert': 'Сертификаты курса «Бородавки и мозоли»', 'congress-2025': 'V Конгресс подологов Казахстана, Алматы, 2025', 'zhanna-procedure': 'Жанна Ким во время процедуры', 'nail-scraper-full': 'Работа с вросшим ногтем', 'nail-scraper2-full': 'Вросший ноготь: лечение и уход', 'nail-drill-full': 'Аппаратная обработка ногтя', 'nail-closeup-full': 'Бережная обработка края ногтя', consult: 'Консультация и подбор стелек', steril: 'Стерилизация инструментов', procedure2: 'Аппаратная обработка', 'ba-nail2': 'Вросший ноготь: до и после лечения', 'ba-nail1': 'Воспалённый околоногтевой валик: до и после', 'ba-heels': 'Трещины на пятках: до и после ухода', 'w-titan': 'Коррекция ногтя титановой нитью', 'w-nail-dystrophy': 'Повреждённый, утолщённый ноготь', 'w-warts': 'Подошвенная бородавка', 'w-heel1': 'Глубокая трещина на пятке', 'w-heel2': 'Сухая, потрескавшаяся пятка', 'zhanna-studio': 'Жанна Ким, руководитель центра', 'svetlana-tool': 'Светлана Лим, ведущий подолог', 'sergei-insole': 'Стелька и модель скелета стопы', 'lesson-hallux': 'Занятие: вальгусная деформация (hallux valgus)', 'lesson-board': 'Теоретическое занятие в центре', 'lesson-stop': 'Занятие со слушателями курса', 'zhanna-congress': 'Жанна Ким на конгрессе подологов', 'eq-unit': 'Подологический аппарат с пылесосом', 'eq-chair': 'Подологическое кресло', 'eq-lamp': 'Лампа-лупа', 'eq-autoclave': 'Автоклав', 'eq-ultrasonic': 'Ультразвуковая мойка', 'eq-podoscope': 'Плантоскоп и измерение давления стопы', 'eq-monofilament': 'Монофиламент', 'eq-correction': 'Системы коррекции ногтей', 'eq-tools': 'Профессиональные инструменты и фрезы', 'eq-foot-model': 'Модель скелета стопы', 'eq-insoles': 'Ортопедические стельки', 'eq-insoles-poster': 'Стелька и модель стопы', 'ba-heels2': 'Сухая, потрескавшаяся пятка: до и после ухода', 'w-ingrown-inflamed': 'Воспалённый вросший ноготь', 'w-titan-wire': 'Ноготь с установленной титановой нитью', 'w-nail-damaged': 'Повреждённый, изменивший цвет ноготь', 'w-heel-core': 'Стержневая мозоль на пятке', 'proc-brace': 'Установка корректирующей скобы на вросший ноготь', 'procedure-training': 'Аппаратная обработка стопы', 'act-training': 'Аккуратная работа во время процедуры', 'act-insoles': 'Подбор индивидуальных стелек', 'act-steril': 'Подготовка инструментов к стерилизации', 'act-closeup': 'Бережная обработка края ногтя зондом', 'sergei': 'Сергей Ким со стельками' },
  en: { 'team7': 'The Podolog center staff', facade: 'Our sign at the entrance', entrance: 'Entrance to the center', 'cabinet-branded': 'Podiatry room', reception: 'Reception area', 'cabinet-white': 'Treatment chair', 'team4-logo': 'The Podolog center team', 'team4-posters': 'Our specialists', 'sergei-foot-model': 'Insole and foot model', 'aigerim-notes': 'Podiatrist at work', 'grad-group': 'Course graduates', 'grad-roman-zhanna': 'A graduate with certificates', 'grad-zhanna-inkar': 'A graduate with certificates', 'svetlana-zhanna-cert': 'Certificates of the “Warts and calluses” course', 'congress-2025': '5th Congress of Podiatrists of Kazakhstan, Almaty, 2025', 'zhanna-procedure': 'Zhanna Kim during a procedure', 'nail-scraper-full': 'Treating an ingrown nail', 'nail-scraper2-full': 'Ingrown nail: treatment and care', 'nail-drill-full': 'Hardware nail treatment', 'nail-closeup-full': 'Careful nail edge treatment', consult: 'Consultation and insole fitting', steril: 'Instrument sterilisation', procedure2: 'Hardware treatment', 'ba-nail2': 'Ingrown nail: before and after treatment', 'ba-nail1': 'Inflamed nail fold: before and after', 'ba-heels': 'Cracked heels: before and after care', 'w-titan': 'Nail correction with titanium wire', 'w-nail-dystrophy': 'Damaged, thickened nail', 'w-warts': 'Plantar wart', 'w-heel1': 'Deep heel crack', 'w-heel2': 'Dry, cracked heel', 'zhanna-studio': 'Zhanna Kim, head of the center', 'svetlana-tool': 'Svetlana Lim, lead podiatrist', 'sergei-insole': 'Insole and foot skeleton model', 'lesson-hallux': 'Class: hallux valgus', 'lesson-board': 'Theory class at the center', 'lesson-stop': 'Class with course students', 'zhanna-congress': 'Zhanna Kim at a podiatry congress', 'eq-unit': 'Podiatry unit with dust extraction', 'eq-chair': 'Podiatry chair', 'eq-lamp': 'Magnifying lamp', 'eq-autoclave': 'Autoclave', 'eq-ultrasonic': 'Ultrasonic cleaner', 'eq-podoscope': 'Podoscope and foot pressure measurement', 'eq-monofilament': 'Monofilament', 'eq-correction': 'Nail correction systems', 'eq-tools': 'Professional instruments and burs', 'eq-foot-model': 'Foot skeleton model', 'eq-insoles': 'Orthopedic insoles', 'eq-insoles-poster': 'Insole and foot model', 'ba-heels2': 'Dry, cracked heel: before and after care', 'w-ingrown-inflamed': 'Inflamed ingrown nail', 'w-titan-wire': 'Nail fitted with titanium wire', 'w-nail-damaged': 'Damaged, discoloured nail', 'w-heel-core': 'Core callus on the heel', 'proc-brace': 'Fitting a correction brace on an ingrown nail', 'procedure-training': 'Hardware foot treatment', 'act-training': 'Careful work during a procedure', 'act-insoles': 'Choosing custom insoles', 'act-steril': 'Preparing instruments for sterilisation', 'act-closeup': 'Careful nail edge treatment with a probe', 'sergei': 'Sergei Kim with insoles' },
};
const galSubTr: Record<'ru' | 'en', Record<string, string>> = {
  ru: { 'eq-unit': 'Обрабатывает ногти и огрубевшую кожу, сразу собирает пыль.', 'eq-chair': 'Удобно клиенту и позволяет специалисту работать под правильным углом.', 'eq-lamp': 'Помогает чётко видеть мелкие изменения ногтей и кожи.', 'eq-autoclave': 'Стерилизует многоразовые инструменты при высокой температуре.', 'eq-ultrasonic': 'Глубоко очищает инструменты перед стерилизацией.', 'eq-podoscope': 'Показывает нагрузку на стопу и помогает подобрать индивидуальные стельки.', 'eq-monofilament': 'Проверяет чувствительность стопы, особенно при сахарном диабете.', 'eq-correction': 'Титановая нить, скобы и пластины исправляют вросший ноготь.', 'eq-tools': 'Кусачки, зонды, кюретки, одноразовые лезвия.', 'eq-foot-model': 'Для наглядного объяснения строения костей и суставов стопы.', 'eq-insoles': 'Поддерживают свод стопы и правильно распределяют нагрузку.' },
  en: { 'eq-unit': 'Treats nails and hard skin and removes the dust right away.', 'eq-chair': 'Comfortable for the client and lets the specialist work at the right angle.', 'eq-lamp': 'Helps to see small changes in nails and skin clearly.', 'eq-autoclave': 'Sterilises reusable instruments at high temperature.', 'eq-ultrasonic': 'Deep-cleans instruments before sterilisation.', 'eq-podoscope': 'Shows the load on the foot and helps to choose custom insoles.', 'eq-monofilament': 'Tests foot sensitivity, especially in diabetes.', 'eq-correction': 'Titanium wire, braces and plates correct ingrown nails.', 'eq-tools': 'Nippers, probes, curettes, single-use blades.', 'eq-foot-model': 'Used to show clients how the bones and joints of the foot are built.', 'eq-insoles': 'Support the arch and spread the load correctly.' },
};
export const galleryDefaults = (): CmsMedia[] => gallery.map((g) => {
  const k = key(g.image);
  const cap = (l: 'ru' | 'en') => galCapTr[l][k] ?? (k.startsWith('pf-') ? pfCap[l] : g.caption);
  return {
    id: idOf(g.video ?? g.image), image: g.image, ...(g.video ? { video: g.video } : {}), category: g.category,
    caption: { kk: g.caption, ru: cap('ru'), en: cap('en') },
    ...(g.sub ? { sub: { kk: g.sub, ru: galSubTr.ru[k] ?? g.sub, en: galSubTr.en[k] ?? g.sub } } : {}),
  };
});
export const galleryFor = (lang: Lang) =>
  (cms.gallery ?? galleryDefaults()).filter((g) => !g.hidden).map((g) => ({
    image: g.image, video: g.video,
    caption: tr(g.caption, lang), sub: g.sub ? tr(g.sub, lang) || undefined : undefined,
    category: lang === 'kk' ? g.category : galCatTr[lang][g.category as GalleryCategory] ?? g.category,
  }));
