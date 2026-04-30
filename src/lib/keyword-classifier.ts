/**
 * Keyword-based fallback classifier for shipping eligibility.
 * Used when the Claude API is unavailable. Less accurate than AI,
 * but covers obvious banned/allowed cases.
 */

import type { CheckResult } from "@/app/api/check-product/route";

// Patterns are case-insensitive, matched against product title + description
const BANNED_PATTERNS: Array<{ pattern: RegExp; reason_en: string; reason_ru: string }> = [
  { pattern: /\b(iphone|smartphone|cell\s?phone|mobile\s?phone|samsung\s+galaxy|pixel\s+\d)\b/i,
    reason_en: "Smartphones are banned on all carriers.",
    reason_ru: "Смартфоны запрещены на всех маршрутах." },
  { pattern: /\b(laptop|notebook|macbook|chromebook|tablet|ipad|kindle\s+fire)\b/i,
    reason_en: "Laptops, tablets and assembled PCs are banned.",
    reason_ru: "Ноутбуки, планшеты и собранные ПК запрещены." },
  { pattern: /\b(smart\s?watch|apple\s+watch|fitbit|fitness\s+tracker|garmin)\b/i,
    reason_en: "Smartwatches and fitness trackers are banned.",
    reason_ru: "Смарт-часы и фитнес-браслеты запрещены." },
  { pattern: /\b(drone|quadcopter|quad-copter|dji\s+(mavic|mini|air|phantom))\b/i,
    reason_en: "Drones and quadcopters are banned.",
    reason_ru: "Дроны и квадрокоптеры запрещены." },
  { pattern: /\b(gpu|graphics\s+card|rtx\s+\d|gtx\s+\d|radeon|geforce|video\s+card)\b/i,
    reason_en: "PC components (GPUs) are banned.",
    reason_ru: "Комплектующие ПК (видеокарты) запрещены." },
  { pattern: /\b(ssd|nvme|hard\s+drive|hdd|ram\s+(ddr|memory)|ddr[345])\b/i,
    reason_en: "PC components (storage/memory) are banned.",
    reason_ru: "Комплектующие ПК (накопители/память) запрещены." },
  { pattern: /\b(monitor|display|4k\s+(tv|screen)|computer\s+case|pc\s+case|motherboard|gaming\s+(keyboard|mouse)|computer\s+(keyboard|mouse)|mechanical\s+keyboard)\b/i,
    reason_en: "PC components (monitors, cases, motherboards, keyboards, mice) are banned.",
    reason_ru: "Комплектующие ПК (мониторы, корпуса, мат.платы, клавиатуры, мыши) запрещены." },
  { pattern: /\b(headphones?|earbuds?|airpods|bluetooth\s+speaker|soundbar|subwoofer|home\s+theater)\b/i,
    reason_en: "Audio equipment (speakers, headphones) is banned.",
    reason_ru: "Аудиотехника (колонки, наушники) запрещена." },
  { pattern: /\b(microphone|amplifier|mixer|dictaphone|voice\s+recorder)\b/i,
    reason_en: "Microphones, amplifiers and dictaphones are banned.",
    reason_ru: "Микрофоны, усилители и диктофоны запрещены." },
  { pattern: /\b(router|modem|wi-?fi\s+router|mesh\s+system|access\s+point)\b/i,
    reason_en: "Routers and networking equipment are banned.",
    reason_ru: "Роутеры и сетевое оборудование запрещены." },
  { pattern: /\b(gps|navigator|fish\s?finder|chartplotter|echo\s?sounder|transducer)\b/i,
    reason_en: "GPS devices, fish finders and chartplotters are banned.",
    reason_ru: "GPS-навигаторы, эхолоты и картплоттеры запрещены." },
  { pattern: /\b(dslr|mirrorless\s+camera|digital\s+camera|gopro|action\s+camera|camcorder)\b/i,
    reason_en: "Digital cameras are banned.",
    reason_ru: "Цифровые фото- и видеокамеры запрещены." },
  { pattern: /\b(camera\s+lens|telephoto|zoom\s+lens|prime\s+lens)\b/i,
    reason_en: "Camera lenses are banned.",
    reason_ru: "Объективы для камер запрещены." },
  { pattern: /\b(binocular|telescope|spotting\s+scope)\b/i,
    reason_en: "Binoculars and telescopes are banned.",
    reason_ru: "Бинокли и телескопы запрещены." },
  { pattern: /\b(generator|gas\s+generator|diesel\s+generator)\b/i,
    reason_en: "Generators are banned.",
    reason_ru: "Генераторы запрещены." },
  { pattern: /\b(soldering\s+iron|solder\s+gun)\b/i,
    reason_en: "Soldering irons are banned.",
    reason_ru: "Паяльники запрещены." },
  { pattern: /\b(motor\s+oil|engine\s+oil|gear\s+oil|lubricant\s+oil)\b/i,
    reason_en: "Automotive/motor oils are banned.",
    reason_ru: "Автомобильные масла запрещены." },
  { pattern: /\b(firearm|handgun|rifle|pistol|gun\s+(part|kit)|ammunition|knife\s+(set|tactical|combat)|sword|machete)\b/i,
    reason_en: "Weapons and bladed weapons are banned.",
    reason_ru: "Оружие и холодное оружие запрещены." },
  { pattern: /\b(wine|whiskey|vodka|beer|champagne|liquor|spirits|alcohol)\b/i,
    reason_en: "Alcohol is banned.",
    reason_ru: "Алкоголь запрещён." },
  { pattern: /\b(cigarette|cigar|tobacco|vape|e-cigarette|nicotine\s+(pod|liquid))\b/i,
    reason_en: "Tobacco and nicotine products are banned.",
    reason_ru: "Табачные и никотиновые изделия запрещены." },
  { pattern: /\b(prescription|rx\s+drug|antibiotic|pharmaceutical)\b/i,
    reason_en: "Prescription medicines are banned.",
    reason_ru: "Рецептурные лекарства запрещены." },
  { pattern: /\b(playstation|ps[345]|xbox|nintendo\s+switch|gaming\s+console)\b/i,
    reason_en: "Game consoles are banned.",
    reason_ru: "Игровые консоли запрещены." },
  { pattern: /\b(dj\s+(controller|console|mixer|deck)|sound\s+(effector|processor)|midi\s+controller|synthesizer)\b/i,
    reason_en: "Electronic musical instruments (DJ equipment, synthesizers) are banned.",
    reason_ru: "Электронные музыкальные инструменты (DJ-оборудование, синтезаторы) запрещены." },
  { pattern: /\b(rc\s+car|rc\s+plane|rc\s+helicopter|rc\s+train|remote\s+control\s+(car|plane|train)|radio\s+control(led)?)\b/i,
    reason_en: "RC and motorized toys are banned.",
    reason_ru: "Радиоуправляемые и моторизованные игрушки запрещены." },
  { pattern: /\b(brake\s+pad|spark\s+plug|alternator|carburetor|engine\s+part|motorcycle\s+part)\b/i,
    reason_en: "Auto and motorcycle parts are banned.",
    reason_ru: "Авто- и мотозапчасти запрещены." },
];

// "Allowed-leaning" patterns help override accidental matches and confirm safe categories
const ALLOWED_HINTS: RegExp[] = [
  /\b(coffee|tea|spice|seasoning|chocolate|candy|snack|cookie|granola)\b/i,
  /\b(book|novel|paperback|hardcover|magazine)\b/i,
  /\b(vitamin|supplement|protein\s+powder|fish\s+oil|melatonin|probiotic)\b/i,
  /\b(t-?shirt|shirt|jeans|dress|jacket|coat|sneakers?|shoes?|boots?|hat|scarf|gloves?)\b/i,
  /\b(toy|lego|puzzle|board\s+game|doll|action\s+figure)\b/i,
  /\b(deodorant|toothpaste|lip\s+balm|shower\s+gel|liquid\s+soap|perfume|cologne)\b/i,
  /\b(handbag|wallet|belt|leather\s+(bag|wallet|jacket))\b/i,
  /\b(acoustic\s+guitar|classical\s+guitar|violin|cello|saxophone|trumpet|flute|ukulele|harmonica)\b/i,
];

export function classifyWithKeywords(productInfo: string): CheckResult {
  const text = productInfo.toLowerCase();

  // Try to extract a product name from "Product title:" line
  const titleMatch = productInfo.match(/Product title:\s*([^\n]+)/i);
  const product_name = titleMatch ? titleMatch[1].trim().substring(0, 120) : "";

  // Check banned patterns first
  for (const { pattern, reason_en, reason_ru } of BANNED_PATTERNS) {
    if (pattern.test(text)) {
      return {
        verdict: "banned",
        carriers: [],
        reason_en: reason_en,
        reason_ru: reason_ru,
        product_name,
      };
    }
  }

  // Check allowed hints
  const isLikelyAllowed = ALLOWED_HINTS.some((p) => p.test(text));
  if (isLikelyAllowed) {
    return {
      verdict: "allowed",
      carriers: [],
      reason_en: "Product is allowed for delivery.",
      reason_ru: "Товар разрешен к доставке.",
      product_name,
    };
  }

  // No clear signal — show a warning
  return {
    verdict: "warning",
    carriers: [],
    reason_en: "Could not automatically classify this product. Place an order and we'll verify it manually.",
    reason_ru: "Не удалось автоматически определить категорию товара. Отправьте заказ, и мы проверим его вручную.",
    product_name,
  };
}
