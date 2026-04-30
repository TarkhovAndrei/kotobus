/**
 * Shipping eligibility rules for Kotobus.
 * Consolidated allow/ban policy: an item is allowed if any of our partners
 * accepts it, and only banned if every partner refuses it.
 */

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
- Watches (under €200/piece)
- Battery-powered hand tools
- Vinyl records, CDs, DVDs, Blu-ray
- Optical equipment: binoculars, telescopes, camera lenses
- Musical instruments (acoustic and most electronic, under €200)

## BANNED CATEGORIES
- Smartphones and mobile phones (any type)
- Laptops, tablets, assembled PCs
- Smartwatches and fitness trackers
- Digital cameras and camcorders (photo & video)
- PC components and electronic components
  (GPUs, RAM, SSDs/HDDs, motherboards, monitors, transistors, chips)
- Audio equipment: speakers, headphones, soundbars, amplifiers, microphones,
  dictaphones, home-theater systems
- GPS navigators, fish finders, echo sounders, chartplotters
- Routers and networking equipment
- Drones and quadcopters
- Weapons: firearms, ammunition, bladed weapons, swords, machetes
- Alcohol of any kind
- Tobacco, cigarettes, cigars, vapes, nicotine products
- Narcotics and prescription medicines
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
    "Watches (under €200/piece)",
    "Battery-powered hand tools",
    "Vinyl records, CDs, DVDs, Blu-ray",
    "Binoculars, telescopes, camera lenses",
    "Acoustic & most electronic musical instruments (under €200)",
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
    "Часы (до €200 за штуку)",
    "Ручные инструменты на аккумуляторе",
    "Виниловые пластинки, CD, DVD, Blu-ray",
    "Бинокли, телескопы, объективы для камер",
    "Акустические и большинство электронных музыкальных инструментов (до €200)",
  ],
};

export const BANNED_ITEMS_SUMMARY = {
  en: [
    "Any single item priced above €200 (≈ $217 USD)",
    "Smartphones & mobile phones",
    "Laptops, tablets, assembled PCs",
    "Smartwatches & fitness trackers",
    "Digital cameras & camcorders",
    "PC components (GPU, RAM, SSD/HDD, motherboards, monitors)",
    "Electronic components (boards, chips, transistors)",
    "Speakers, headphones, soundbars, amplifiers, microphones, dictaphones",
    "GPS navigators, fish finders, chartplotters",
    "Routers & networking equipment",
    "Drones & quadcopters",
    "Weapons (firearms, ammunition, bladed weapons)",
    "Alcohol",
    "Tobacco, cigarettes, vapes, nicotine products",
    "Narcotics & prescription medicines",
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
    "Комплектующие ПК (видеокарты, ОЗУ, SSD/HDD, мат.платы, мониторы)",
    "Электронные компоненты (платы, микросхемы, транзисторы)",
    "Колонки, наушники, саундбары, усилители, микрофоны, диктофоны",
    "GPS-навигаторы, эхолоты, картплоттеры",
    "Роутеры и сетевое оборудование",
    "Дроны и квадрокоптеры",
    "Оружие (огнестрельное, патроны, холодное)",
    "Алкоголь",
    "Табак, сигареты, вейпы, никотиновые изделия",
    "Наркотики и рецептурные лекарства",
    "Товары двойного назначения (военные)",
    "Игровые консоли",
    "Автомобильные/мотоциклетные масла и нефтепродукты (опасные грузы)",
  ],
};
