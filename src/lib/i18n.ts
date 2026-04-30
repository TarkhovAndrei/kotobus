export type Locale = "en" | "ru";

export const translations = {
  en: {
    // Header
    siteName: "Kotobus",
    tagline: "Will deliver anything from the USA.",
    switchLang: "RU",

    // Hero
    heroTitle: "Will deliver anything from the USA.",
    heroSubtitle:
      "Send Kotobus a link to any product from an American store. It will buy it and deliver it to the post office nearest your address.",
    howItWorks: "How Kotobus works",
    step1Title: "1. Send a link",
    step1Desc: "Paste a link to anything from any American store.",
    step2Title: "2. Kotobus buys it",
    step2Desc: "We buy the item and pack it for the long journey.",
    step3Title: "3. Delivers to you",
    step3Desc:
      "The package will arrive at the post office nearest your address.",

    // Form
    orderTitle: "Place an order",
    productLink: "Product link",
    productLinkPlaceholder: "https://www.amazon.com/...",
    productNotes: "Notes (size, color, quantity, etc.)",
    productNotesPlaceholder: "e.g. Size L, Color: Blue, Qty: 2",

    shippingTitle: "Delivery address",
    fullName: "Full name",
    fullNamePlaceholder: "Ivanov Ivan Ivanovich",
    email: "Email",
    emailPlaceholder: "john@example.com",
    phone: "Phone",
    phonePlaceholder: "+7 999 123 45 67",
    country: "Country",
    countryPlaceholder: "Russia",
    city: "City",
    cityPlaceholder: "Moscow",
    address: "Address",
    addressPlaceholder: "Street, building, apartment",
    zip: "Postal code",
    zipPlaceholder: "123456",
    inn: "Tax ID (for customs)",
    innPlaceholder: "12-digit personal taxpayer number",

    submitOrder: "Send order",
    submitting: "Sending...",
    successTitle: "Order sent!",
    successMessage:
      "We've received your order. We'll review the product link and contact you shortly with a cost estimate.",
    submitAnother: "Place another order",
    errorMessage: "Something went wrong. Please try again.",

    // Shipping rules section
    shippingRulesTitle: "What can & can't be shipped?",
    allowedTitle: "Allowed items",
    bannedTitle: "Banned items",

    // Footer
    footerText: "© 2026 Kotobus. Delivers across the ocean.",
    contactUs: "Contact us",
  },
  ru: {
    // Header
    siteName: "Котобус",
    tagline: "Привезёт что угодно из США.",
    switchLang: "EN",

    // Hero
    heroTitle: "Доставит что угодно из США.",
    heroSubtitle:
      "Кидайте Котобусу ссылку на любой товар из американского магазина. Он его купит и привезёт до ближайшего отделения почты.",
    howItWorks: "Как работает Котобус",
    step1Title: "1. Кидайте ссылку",
    step1Desc: "Вставьте ссылку на что угодно из любого американского магазина.",
    step2Title: "2. Котобус выкупает",
    step2Desc: "Мы покупаем товар и пакуем его в дальнюю дорогу.",
    step3Title: "3. Доставит до вас",
    step3Desc:
      "Посылка приедет в ближайшее к вашему адресу отделение почты.",

    // Form
    orderTitle: "Оформить заказ",
    productLink: "Ссылка на товар",
    productLinkPlaceholder: "https://www.amazon.com/...",
    productNotes: "Примечания (размер, цвет, количество и т.д.)",
    productNotesPlaceholder: "напр. Размер L, Цвет: Синий, Кол-во: 2",

    shippingTitle: "Адрес доставки",
    fullName: "ФИО",
    fullNamePlaceholder: "Иванов Иван Иванович",
    email: "Email",
    emailPlaceholder: "ivan@example.com",
    phone: "Телефон",
    phonePlaceholder: "+7 999 123 45 67",
    country: "Страна",
    countryPlaceholder: "Россия",
    city: "Город",
    cityPlaceholder: "Москва",
    address: "Адрес",
    addressPlaceholder: "Улица, дом, квартира",
    zip: "Почтовый индекс",
    zipPlaceholder: "123456",
    inn: "ИНН (для таможни)",
    innPlaceholder: "12-значный ИНН физического лица",

    submitOrder: "Отправить заказ",
    submitting: "Отправка...",
    successTitle: "Заказ отправлен!",
    successMessage:
      "Мы получили ваш заказ. Мы проверим ссылку на товар и свяжемся с вами в ближайшее время с оценкой стоимости.",
    submitAnother: "Оформить ещё один заказ",
    errorMessage: "Что-то пошло не так. Попробуйте ещё раз.",

    // Shipping rules section
    shippingRulesTitle: "Что можно и нельзя отправить?",
    allowedTitle: "Разрешённые товары",
    bannedTitle: "Запрещённые товары",

    // Footer
    footerText: "© 2026 Котобус. Доставит через океан.",
    contactUs: "Связаться с нами",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
