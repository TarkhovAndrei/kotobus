// Generates Google Ads images in the three standard sizes.
// Run with: node scripts/generate-ads.js

const sharp = require("../node_modules/sharp");
const fs = require("fs");
const path = require("path");

const ADS_DIR = path.join(__dirname, "../public/ads");
if (!fs.existsSync(ADS_DIR)) fs.mkdirSync(ADS_DIR, { recursive: true });

// Bus content bounds in original coords: x=[14,224] y=[45,136], center=(119, 90.5)
function bus(cx, cy, scale) {
  const tx = cx - 119 * scale;
  const ty = cy - 90.5 * scale;
  const s = scale;
  return `<g transform="translate(${tx},${ty}) scale(${s})">
    <ellipse cx="120" cy="126" rx="95" ry="10" fill="#2f221b" opacity="0.18"/>
    <rect x="16" y="42" width="206" height="58" rx="14" fill="url(#busBody)"/>
    <rect x="16" y="87" width="206" height="13" rx="6" fill="#4b362c"/>
    <rect x="24" y="50" width="44" height="28" rx="6" fill="url(#busGlass)" stroke="#2f221b" stroke-width="2"/>
    <rect x="78"  y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" stroke-width="1.6"/>
    <rect x="104" y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" stroke-width="1.6"/>
    <rect x="130" y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" stroke-width="1.6"/>
    <rect x="156" y="50" width="20" height="20" rx="4" fill="#e0f2fe" stroke="#2f221b" stroke-width="1.6"/>
    <rect x="184" y="52" width="28" height="40" rx="5" fill="#d6c2ad" stroke="#2f221b" stroke-width="2"/>
    <line x1="198" y1="52" x2="198" y2="92" stroke="#2f221b" stroke-width="1.5"/>
    <path d="M33 57 L29 45 L39 52 Z" fill="#3f2b22"/>
    <path d="M33 57 L33 50 L37 53 Z" fill="#d6b3aa"/>
    <path d="M54 57 L58 45 L48 52 Z" fill="#3f2b22"/>
    <path d="M54 57 L54 50 L50 53 Z" fill="#d6b3aa"/>
    <ellipse cx="44" cy="63" rx="14" ry="12" fill="#e8d8bf"/>
    <ellipse cx="44" cy="63" rx="11" ry="10" fill="#5a4032" opacity="0.85"/>
    <ellipse cx="44" cy="68" rx="7"  ry="5"  fill="#f6efe2"/>
    <ellipse cx="39" cy="62" rx="3.1" ry="2.4" fill="#eff6ff"/>
    <ellipse cx="49" cy="62" rx="3.1" ry="2.4" fill="#eff6ff"/>
    <ellipse cx="39" cy="62" rx="1.8" ry="1.9" fill="#2563eb"/>
    <ellipse cx="49" cy="62" rx="1.8" ry="1.9" fill="#2563eb"/>
    <ellipse cx="39" cy="62" rx="0.5" ry="1.8" fill="#0f172a"/>
    <ellipse cx="49" cy="62" rx="0.5" ry="1.8" fill="#0f172a"/>
    <circle cx="39.6" cy="61.2" r="0.4" fill="#fff"/>
    <circle cx="49.6" cy="61.2" r="0.4" fill="#fff"/>
    <path d="M42 67 Q44 69 46 67 Q44 70 42 67 Z" fill="#cfa699" stroke="#2f221b" stroke-width="0.8"/>
    <circle cx="57" cy="74" r="5" fill="none" stroke="#2f221b" stroke-width="2"/>
    <line x1="57" y1="69" x2="57" y2="79" stroke="#2f221b" stroke-width="1.5"/>
    <line x1="52" y1="74" x2="62" y2="74" stroke="#2f221b" stroke-width="1.5"/>
    <circle cx="24"  cy="96" r="4" fill="#dbeafe"/>
    <circle cx="214" cy="96" r="4" fill="#dbeafe"/>
    <rect x="14" y="98" width="210" height="5" rx="2.5" fill="#2f221b" opacity="0.55"/>
    <circle cx="62"  cy="108" r="14" fill="#2f221b"/>
    <circle cx="62"  cy="108" r="6"  fill="#d6c2ad"/>
    <circle cx="176" cy="108" r="14" fill="#2f221b"/>
    <circle cx="176" cy="108" r="6"  fill="#d6c2ad"/>
  </g>`;
}

const DEFS = `
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#f7ede0"/>
    <stop offset="100%" stop-color="#e8d5be"/>
  </linearGradient>
  <linearGradient id="busBody" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#8b6a58"/>
    <stop offset="100%" stop-color="#64493b"/>
  </linearGradient>
  <linearGradient id="busGlass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ecfeff"/>
    <stop offset="100%" stop-color="#bae6fd"/>
  </linearGradient>`;

const FONT = `font-family="'Helvetica Neue', Arial, sans-serif"`;

// ── 1. Landscape 1200×628 ──────────────────────────────────────────────────
const landscape = `<svg viewBox="0 0 1200 628" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>

  <rect width="1200" height="628" fill="url(#bg)"/>

  <!-- Text (left ~560px, bus starts ~750px) -->
  <text x="60" y="248" ${FONT} font-size="72" font-weight="900" fill="#292524" letter-spacing="-2">КОТОБУС —</text>
  <text x="60" y="344" ${FONT} font-size="66" font-weight="900" fill="#4b362c" letter-spacing="-2">доставит из США</text>

  <!-- Bus illustration, right section, left edge ~750px -->
  ${bus(960, 314, 2.0)}
</svg>`;

// ── 2. Square 1200×1200 ───────────────────────────────────────────────────
const square = `<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>

  <rect width="1200" height="1200" fill="url(#bg)"/>

  <!-- Bus centered in upper half -->
  ${bus(600, 420, 3.6)}

  <!-- Text -->
  <text x="600" y="870" ${FONT} font-size="120" font-weight="900" fill="#292524" letter-spacing="-2" text-anchor="middle">КОТОБУС —</text>
  <text x="600" y="1000" ${FONT} font-size="100" font-weight="900" fill="#4b362c" letter-spacing="-2" text-anchor="middle">доставит из США</text>
</svg>`;

// ── 3. Portrait 960×1200 ──────────────────────────────────────────────────
const portrait = `<svg viewBox="0 0 960 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>${DEFS}</defs>

  <rect width="960" height="1200" fill="url(#bg)"/>

  <!-- Bus centered in upper area -->
  ${bus(480, 370, 3.0)}

  <!-- Text -->
  <text x="480" y="790" ${FONT} font-size="100" font-weight="900" fill="#292524" letter-spacing="-2" text-anchor="middle">КОТОБУС —</text>
  <text x="480" y="910" ${FONT} font-size="90" font-weight="900" fill="#4b362c" letter-spacing="-2" text-anchor="middle">доставит из США</text>
</svg>`;

const ads = [
  { name: "kotobus-1200x628.png",  width: 1200, height: 628,  svg: landscape },
  { name: "kotobus-1200x1200.png", width: 1200, height: 1200, svg: square    },
  { name: "kotobus-960x1200.png",  width: 960,  height: 1200, svg: portrait  },
];

(async () => {
  for (const { name, width, height, svg } of ads) {
    const out = path.join(ADS_DIR, name);
    await sharp(Buffer.from(svg))
      .resize(width, height)
      .png()
      .toFile(out);
    console.log(`✓ ${name}`);
  }
})();
