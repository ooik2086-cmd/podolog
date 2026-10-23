// Ортақ интерфейс мәтіндері (мәзір, батырмалар, компоненттер)
import type { Lang } from './index';
import { pageText } from '../data/cms';

const kk = {
  nav: {
    home: 'Басты бет', services: 'Қызметтер', insoles: 'Ортопедиялық ұлтарақтар', insolesShort: 'Ұлтарақтар',
    shop: 'PodiaFarm өнімдері', shopShort: 'PodiaFarm', courses: 'Онлайн оқу', coursesShort: 'Оқу',
    certificates: 'Сертификаттар', gallery: 'Жұмыс галереясы', galleryShort: 'Галерея', about: 'Біз туралы', contacts: 'Байланыс',
  },
  bnav: { home: 'Басты', services: 'Қызметтер', booking: 'Брондау', courses: 'Оқу', contacts: 'Байланыс' },
  skip: 'Негізгі мазмұнға өту',
  draft: 'Алдын ала нұсқа. Фото, сертификаттар және 2GIS карточкасы қосылғанда толық болады.',
  mainMenu: 'Негізгі мәзір', mobileMenu: 'Мобильді мәзір', menu: 'Мәзір', openMenu: 'Мәзірді ашу', closeMenu: 'Мәзірді жабу',
  quickNav: 'Жылдам навигация', lang: 'Тіл', toDark: 'Қара фон', toLight: 'Ақ фон',
  cart: 'Себет', cartN: 'Себет: {n} тауар', addedToCart: 'Себетке қосылды',
  signUp: 'Жазылу', book: 'Қабылдауға жазылу',
  headLabel: 'Жетекшісі', sections: 'Бөлімдер', center: 'Орталық', contact: 'Байланыс', privacy: 'Құпиялылық саясаты', reviews: 'Клиенттер пікірі', reviewsShort: 'Пікірлер', feedback: 'Ұсыныстар', mission: 'Миссия және стандарттар', missionShort: 'Миссия', prices: 'Бағалар',
  waWrite: 'WhatsApp-қа жазу', waFab: 'WhatsApp арқылы жазу',
  titleSuffix: 'Подолог',
  crumbs: 'Жол', more: 'Толығырақ', start: 'Бастау', all: 'Барлығы', categories: 'Санаттар',
  priceTbd: 'нақтыланады', priceTbdCap: 'Нақтыланады', price: 'Бағасы', duration: 'Ұзақтығы', tbd: 'Нақтыланады',
  photoAwaited: 'фото күтілуде', photo: 'Фото',
  logoHome: 'Подолог, басты бет', logoAlt: 'Подолог: подология және ортопедия орталығы, Center Zhanna Kim',
  ctaTitle: 'Қабылдауға жазылыңыз', ctaText: 'Қызметті және ыңғайлы күнді таңдаңыз, біз жазылуыңызды растаймыз.',
  lbDialog: 'Суретті үлкейтіп көру', close: 'Жабу', prev: 'Алдыңғы', next: 'Келесі',
  // Байланыс блогы
  address: 'Мекенжай', hours: 'Жұмыс уақыты', phone: 'Телефон', route: '2GIS арқылы жол салу',
  mapTitle: 'Карта: {a}', mapRoute: '2GIS арқылы {a} мекенжайына жол салу',
  // Өнім карточкасы
  isNew: 'Жаңа', priceLater: 'Бағасы нақтыланады', addToCart: '{n}, {s}: себетке қосу', chooseSize: '{n}: көлемін таңдау',
  // Табан картасы
  scanAria: 'Табан қысымының картасы туралы иллюстрация',
  scanTags: ['Бас бармақ', 'Табан алды', 'Бойлық күмбез', 'Өкше'], scanArch: ['Бойлық', 'күмбез'],
  pressureLow: 'Қысым аз', pressureHigh: 'Қысым көп',
};

export type UI = typeof kk;

const ru: UI = {
  nav: {
    home: 'Главная', services: 'Услуги', insoles: 'Ортопедические стельки', insolesShort: 'Стельки',
    shop: 'Продукция PodiaFarm', shopShort: 'PodiaFarm', courses: 'Онлайн-обучение', coursesShort: 'Обучение',
    certificates: 'Сертификаты', gallery: 'Галерея работ', galleryShort: 'Галерея', about: 'О нас', contacts: 'Контакты',
  },
  bnav: { home: 'Главная', services: 'Услуги', booking: 'Запись', courses: 'Обучение', contacts: 'Контакты' },
  skip: 'Перейти к основному содержанию',
  draft: 'Предварительная версия. Сайт будет полным после добавления фото, сертификатов и карточки 2GIS.',
  mainMenu: 'Главное меню', mobileMenu: 'Мобильное меню', menu: 'Меню', openMenu: 'Открыть меню', closeMenu: 'Закрыть меню',
  quickNav: 'Быстрая навигация', lang: 'Язык', toDark: 'Тёмный фон', toLight: 'Светлый фон',
  cart: 'Корзина', cartN: 'Корзина: {n} шт.', addedToCart: 'Добавлено в корзину',
  signUp: 'Записаться', book: 'Записаться на приём',
  headLabel: 'Руководитель', sections: 'Разделы', center: 'Центр', contact: 'Контакты', privacy: 'Политика конфиденциальности', reviews: 'Отзывы клиентов', reviewsShort: 'Отзывы', feedback: 'Предложения', mission: 'Миссия и стандарты', missionShort: 'Миссия', prices: 'Цены',
  waWrite: 'Написать в WhatsApp', waFab: 'Написать в WhatsApp',
  titleSuffix: 'Подолог',
  crumbs: 'Навигация', more: 'Подробнее', start: 'Начать', all: 'Все', categories: 'Категории',
  priceTbd: 'уточняется', priceTbdCap: 'Уточняется', price: 'Цена', duration: 'Длительность', tbd: 'Уточняется',
  photoAwaited: 'фото скоро появится', photo: 'Фото',
  logoHome: 'Подолог, главная страница', logoAlt: 'Подолог: центр подологии и ортопедии, Center Zhanna Kim',
  ctaTitle: 'Запишитесь на приём', ctaText: 'Выберите услугу и удобный день, мы подтвердим вашу запись.',
  lbDialog: 'Просмотр изображения', close: 'Закрыть', prev: 'Предыдущее', next: 'Следующее',
  address: 'Адрес', hours: 'Время работы', phone: 'Телефон', route: 'Построить маршрут в 2GIS',
  mapTitle: 'Карта: {a}', mapRoute: 'Построить маршрут в 2GIS до адреса {a}',
  isNew: 'Новинка', priceLater: 'Цена уточняется', addToCart: '{n}, {s}: добавить в корзину', chooseSize: '{n}: выбрать объём',
  scanAria: 'Иллюстрация карты давления стопы',
  scanTags: ['Большой палец', 'Плюсна', 'Свод стопы', 'Пятка'], scanArch: ['Продольный', 'свод'],
  pressureLow: 'Давление ниже', pressureHigh: 'Давление выше',
};

const en: UI = {
  nav: {
    home: 'Home', services: 'Services', insoles: 'Orthopedic insoles', insolesShort: 'Insoles',
    shop: 'PodiaFarm products', shopShort: 'PodiaFarm', courses: 'Online learning', coursesShort: 'Courses',
    certificates: 'Certificates', gallery: 'Work gallery', galleryShort: 'Gallery', about: 'About us', contacts: 'Contacts',
  },
  bnav: { home: 'Home', services: 'Services', booking: 'Book', courses: 'Courses', contacts: 'Contacts' },
  skip: 'Skip to main content',
  draft: 'Preview version. The site will be complete once photos, certificates and the 2GIS listing are added.',
  mainMenu: 'Main menu', mobileMenu: 'Mobile menu', menu: 'Menu', openMenu: 'Open menu', closeMenu: 'Close menu',
  quickNav: 'Quick navigation', lang: 'Language', toDark: 'Dark mode', toLight: 'Light mode',
  cart: 'Cart', cartN: 'Cart: {n} items', addedToCart: 'Added to cart',
  signUp: 'Book', book: 'Book an appointment',
  headLabel: 'Head', sections: 'Sections', center: 'Center', contact: 'Contacts', privacy: 'Privacy policy', reviews: 'Client reviews', reviewsShort: 'Reviews', feedback: 'Suggestions', mission: 'Mission and standards', missionShort: 'Mission', prices: 'Prices',
  waWrite: 'Message on WhatsApp', waFab: 'Message us on WhatsApp',
  titleSuffix: 'Podolog',
  crumbs: 'Breadcrumbs', more: 'Learn more', start: 'Start', all: 'All', categories: 'Categories',
  priceTbd: 'on request', priceTbdCap: 'On request', price: 'Price', duration: 'Duration', tbd: 'To be confirmed',
  photoAwaited: 'photo coming soon', photo: 'Photo',
  logoHome: 'Podolog, home page', logoAlt: 'Podolog: podiatry and orthopedics center, Center Zhanna Kim',
  ctaTitle: 'Book an appointment', ctaText: 'Choose a service and a convenient day, and we will confirm your booking.',
  lbDialog: 'Image viewer', close: 'Close', prev: 'Previous', next: 'Next',
  address: 'Address', hours: 'Opening hours', phone: 'Phone', route: 'Get directions in 2GIS',
  mapTitle: 'Map: {a}', mapRoute: 'Get directions in 2GIS to {a}',
  isNew: 'New', priceLater: 'Price on request', addToCart: '{n}, {s}: add to cart', chooseSize: '{n}: choose size',
  scanAria: 'Illustration of a foot pressure map',
  scanTags: ['Big toe', 'Forefoot', 'Arch', 'Heel'], scanArch: ['Longitudinal', 'arch'],
  pressureLow: 'Lower pressure', pressureHigh: 'Higher pressure',
};

export const ui: Record<Lang, UI> = pageText('common', { ru, kk, en });
export const fmt = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
