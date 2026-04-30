export const SHIPPING_RULES_PROMPT = `
You are a shipping eligibility checker for Kotobus, a US-to-Russia parcel
forwarding service. Determine whether a product can be shipped under the
unified policy below.

## HARD PRICE CAP
Any single item priced above €200 (≈ $217 USD) is BANNED.
If the user input includes a "Price:" line and the value exceeds €200, you MUST
return verdict "banned" regardless of category.

## ALLOWED CATEGORIES
- Clothing, shoes, accessories (bags, belts, jewelry)
- Books, magazines and other printed materials
- Vitamins, dietary supplements, protein powders
- Cosmetics and makeup
- Skincare, shampoos, conditioners, soaps, deodorants, toothpaste, lip balm
- Perfume / cologne (small quantities)
- Toys, board games, puzzles, plush, action figures, LEGO
- Natural leather goods (small quantities)
- Non-liquid, non-perishable food products (coffee, tea, spices, snacks, chocolate)
- Watches (under €200/piece, up to 2 per package)
- Battery-powered hand tools (up to 2 sets per package)
- Vinyl records, CDs, DVDs, Blu-ray
- Acoustic musical instruments

## BANNED CATEGORIES
- Smartphones and mobile phones (any type)
- Laptops, tablets, assembled PCs
- Smartwatches and fitness trackers
- Digital cameras and camcorders (photo & video)
- Camera lenses and objectives
- PC components and electronic components
  (GPUs, RAM, SSDs/HDDs, motherboards, monitors, keyboards, mice, cases,
   transistors, chips, circuit boards)
- Audio equipment: speakers, headphones, soundbars, amplifiers, microphones,
  dictaphones, home-theater systems
- Electronic musical instruments (DJ consoles, controllers, mixers, sound effectors)
- GPS navigators, fish finders, echo sounders, chartplotters
- Routers and networking equipment
- Drones and quadcopters
- RC and motorized toys (cars, trains, planes, helicopters)
- Weapons: firearms, ammunition, bladed weapons, swords, machetes
- Alcohol of any kind
- Tobacco, cigarettes, cigars, vapes, nicotine products
- Narcotics and medicines (prescription and general)
- Military / dual-use items
- Game consoles
- Automotive / motorcycle oils, petroleum products, fuels (hazmat)
- Any single item priced above €200

## CLASSIFICATION TASK
Given the product name, category, description and (optionally) price, decide:
- "allowed" — the item fits an allowed category and is under €200
- "warning" — allowed in principle but with conditions worth flagging
- "banned"  — the item falls into any banned category, OR is over €200

Respond ONLY with a JSON object in this exact format:
{
  "verdict": "allowed" | "banned" | "warning",
  "reason_en": "Short explanation in English (1-2 sentences)",
  "reason_ru": "Short explanation in Russian (1-2 sentences)",
  "product_name": "The identified product name"
}
`;

export const ALLOWED_ITEMS_SUMMARY = {
  en: [
    "Clothing, shoes & accessories",
    "Books & printed materials",
    "Vitamins, supplements & protein powders",
    "Cosmetics & makeup",
    "Skincare, shampoos, conditioners, soaps, deodorants, toothpaste",
    "Perfume & cologne (small quantities)",
    "Toys, board games, puzzles, plush, LEGO",
    "Natural leather goods",
    "Non-liquid, non-perishable food (coffee, tea, spices, chocolate, snacks)",
    "Watches (under €200/piece, up to 2 per package)",
    "Battery-powered hand tools (up to 2 sets per package)",
    "Vinyl records, CDs, DVDs, Blu-ray",
    "Acoustic musical instruments",
  ],
  ru: [
    "Одежда, обувь и аксессуары",
    "Книги и печатные материалы",
    "Витамины, БАДы и протеиновые порошки",
    "Косметика и декоративная косметика",
    "Уход за кожей, шампуни, кондиционеры, мыло, дезодоранты, зубная паста",
    "Духи и туалетная вода (в небольших количествах)",
    "Игрушки, настольные игры, пазлы, плюшевые игрушки, LEGO",
    "Изделия из натуральной кожи",
    "Сухие и не скоропортящиеся продукты (кофе, чай, специи, шоколад, снеки)",
    "Часы (до €200 за штуку, до 2 единиц в посылке)",
    "Ручные инструменты на аккумуляторе (до 2 наборов в посылке)",
    "Виниловые пластинки, CD, DVD, Blu-ray",
    "Акустические музыкальные инструменты",
  ],
};

export const BANNED_ITEMS_SUMMARY = {
  en: [
    "Any single item priced above €200 (≈ $217 USD)",
    "Smartphones & mobile phones",
    "Laptops, tablets, assembled PCs",
    "Smartwatches & fitness trackers",
    "Digital cameras & camcorders",
    "Camera lenses & objectives",
    "PC components (GPU, RAM, SSD/HDD, motherboards, monitors, keyboards, mice, cases)",
    "Electronic components (boards, chips, transistors)",
    "Speakers, headphones, soundbars, amplifiers, microphones, dictaphones",
    "Electronic musical instruments (DJ consoles, controllers, sound effectors)",
    "GPS navigators, fish finders, chartplotters",
    "Routers & networking equipment",
    "Drones & quadcopters",
    "RC and motorized toys (cars, planes, trains, helicopters)",
    "Weapons (firearms, ammunition, bladed weapons)",
    "Alcohol",
    "Tobacco, cigarettes, vapes, nicotine products",
    "Narcotics & medicines",
    "Military / dual-use items",
    "Game consoles",
    "Automotive / motorcycle oils & petroleum products (hazmat)",
  ],
  ru: [
    "Любой товар стоимостью свыше €200 (≈ $217)",
    "Смартфоны и мобильные телефоны",
    "Ноутбуки, планшеты, собранные ПК",
    "Смарт-часы и фитнес-браслеты",
    "Цифровые фото- и видеокамеры",
    "Линзы и объективы для камер",
    "Комплектующие ПК (видеокарты, ОЗУ, SSD/HDD, мат.платы, мониторы, клавиатуры, мыши, корпуса)",
    "Электронные компоненты (платы, микросхемы, транзисторы)",
    "Колонки, наушники, саундбары, усилители, микрофоны, диктофоны",
    "Электронные музыкальные инструменты (DJ-пульты, контроллеры, звуковые процессоры)",
    "GPS-навигаторы, эхолоты, картплоттеры",
    "Роутеры и сетевое оборудование",
    "Дроны и квадрокоптеры",
    "Радиоуправляемые и моторизованные игрушки (машинки, самолёты, поезда, вертолёты)",
    "Оружие (огнестрельное, патроны, холодное)",
    "Алкоголь",
    "Табак, сигареты, вейпы, никотиновые изделия",
    "Наркотики и лекарства",
    "Товары двойного назначения (военные)",
    "Игровые консоли",
    "Автомобильные/мотоциклетные масла и нефтепродукты (опасные грузы)",
  ],
};
