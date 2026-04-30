import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SHIPPING_RULES_PROMPT } from "@/lib/shipping-rules";
import { classifyWithKeywords } from "@/lib/keyword-classifier";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Approximate USD→EUR conversion rate used for the €200 cap check. */
const USD_TO_EUR = 0.92;
/** €200 cap from Berlin Post / Euro Cargo / Euro Post rules. */
const PRICE_CAP_EUR = 200;

type ProductInfo = {
  text: string;
  priceEur: number | null;
  rawPrice: string | null;
};

/** Try to pull a price (and currency) out of a product HTML page. */
function extractPrice(html: string): { priceEur: number | null; raw: string | null } {
  const patterns: Array<{ re: RegExp; currency?: "USD" | "EUR" }> = [
    // OpenGraph / schema.org meta tags
    { re: /<meta[^>]+property="product:price:amount"[^>]+content="([\d.,]+)"/i },
    { re: /<meta[^>]+property="og:price:amount"[^>]+content="([\d.,]+)"/i },
    { re: /<meta[^>]+itemprop="price"[^>]+content="([\d.,]+)"/i },
    // Amazon-specific
    { re: /"priceAmount"\s*:\s*([\d.]+)/, currency: "USD" },
    { re: /id="priceblock_(?:ourprice|dealprice|saleprice)"[^>]*>\s*\$?\s*([\d.,]+)/i, currency: "USD" },
    { re: /<span[^>]+class="a-offscreen"[^>]*>\s*\$\s*([\d.,]+)\s*<\/span>/i, currency: "USD" },
    // Generic price strings
    { re: /\$\s*([\d]{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/, currency: "USD" },
    { re: /€\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\b/, currency: "EUR" },
  ];

  // Detect currency from a meta tag if available
  const currencyMeta =
    html.match(/<meta[^>]+property="product:price:currency"[^>]+content="([A-Z]{3})"/i)?.[1] ||
    html.match(/<meta[^>]+property="og:price:currency"[^>]+content="([A-Z]{3})"/i)?.[1] ||
    html.match(/"currency"\s*:\s*"([A-Z]{3})"/)?.[1] ||
    null;

  for (const { re, currency } of patterns) {
    const m = html.match(re);
    if (!m) continue;
    const raw = m[1].replace(/,(?=\d{3}\b)/g, "").replace(",", ".");
    const num = parseFloat(raw);
    if (!isFinite(num) || num <= 0) continue;
    const cur = currency ?? currencyMeta ?? "USD";
    const priceEur = cur === "EUR" ? num : num * USD_TO_EUR;
    return { priceEur, raw: `${cur} ${num}` };
  }
  return { priceEur: null, raw: null };
}

/** Extract product metadata from any URL by fetching its HTML */
async function fetchProductInfo(url: string): Promise<ProductInfo> {
  // For Amazon URLs, extract ASIN and build a clean product URL
  const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/) ||
    url.match(/\/gp\/product\/([A-Z0-9]{10})/) ||
    url.match(/[?&](?:asin|ASIN)=([A-Z0-9]{10})/);

  // Decode ats param for Amazon Buy Again pages
  const atsMatch = url.match(/[?&]ats=([^&]+)/);
  if (atsMatch && !asinMatch) {
    try {
      const decoded = Buffer.from(
        decodeURIComponent(atsMatch[1]),
        "base64"
      ).toString("utf-8");
      const data = JSON.parse(decoded);
      const candidates = data.explicitCandidates || data.candidates || "";
      const firstAsin = candidates.split(",")[0].trim();
      if (firstAsin) {
        return await fetchProductInfo(
          `https://www.amazon.com/dp/${firstAsin}`
        );
      }
    } catch {
      // ignore decode errors
    }
  }

  const fetchUrl = asinMatch
    ? `https://www.amazon.com/dp/${asinMatch[1]}`
    : url;

  const response = await fetch(fetchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(8000),
  });

  const html = await response.text();

  // Extract useful metadata from HTML
  const get = (pattern: RegExp) => {
    const m = html.match(pattern);
    return m ? m[1].replace(/&amp;/g, "&").replace(/&#\d+;/g, "").trim() : "";
  };

  const title =
    get(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i) ||
    get(/<title>([^<]+)<\/title>/i) ||
    get(/<span[^>]+id="productTitle"[^>]*>([^<]+)</i);

  const description =
    get(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i) ||
    get(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);

  const category =
    get(/<span[^>]+class="[^"]*nav-a-content[^"]*"[^>]*>([^<]+)</i) ||
    get(/breadcrumb[^>]*>[\s\S]*?<[^>]+>([^<]{3,30})<\//i);

  const { priceEur, raw: rawPrice } = extractPrice(html);

  const text = [
    `URL: ${fetchUrl}`,
    title ? `Product title: ${title.substring(0, 200)}` : "",
    category ? `Category: ${category.substring(0, 100)}` : "",
    description ? `Description: ${description.substring(0, 400)}` : "",
    rawPrice ? `Price: ${rawPrice}${priceEur ? ` (≈ €${priceEur.toFixed(2)})` : ""}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { text, priceEur, rawPrice };
}

export type CheckResult = {
  verdict: "allowed" | "banned" | "warning" | "error";
  carriers: string[];
  reason_en: string;
  reason_ru: string;
  product_name: string;
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Step 1: Fetch product info from the URL
    let productInfo: ProductInfo;
    try {
      productInfo = await fetchProductInfo(url);
    } catch {
      productInfo = {
        text: `URL: ${url}\n(Could not fetch product page — please classify based on URL alone if possible)`,
        priceEur: null,
        rawPrice: null,
      };
    }

    // Step 2: Hard price-cap check — if price is over €200, ban regardless of category.
    if (productInfo.priceEur !== null && productInfo.priceEur > PRICE_CAP_EUR) {
      const titleMatch = productInfo.text.match(/Product title:\s*([^\n]+)/i);
      const product_name = titleMatch ? titleMatch[1].trim().substring(0, 120) : "";
      const eur = productInfo.priceEur.toFixed(2);
      return NextResponse.json({
        verdict: "banned",
        carriers: [],
        reason_en: `Item price ≈ €${eur} exceeds the €${PRICE_CAP_EUR} per-item cap — cannot be shipped on any carrier.`,
        reason_ru: `Цена товара ≈ €${eur} превышает лимит €${PRICE_CAP_EUR} за единицу — отправка невозможна ни одним из операторов.`,
        product_name,
      } satisfies CheckResult);
    }

    // Step 3: Try Claude classification; fall back to keyword classifier on any failure
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const message = await client.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 512,
          system: SHIPPING_RULES_PROMPT,
          messages: [
            {
              role: "user",
              content: `Please check if this product is allowed for shipping:\n\n${productInfo.text}`,
            },
          ],
        });

        const text =
          message.content[0].type === "text" ? message.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result: CheckResult = JSON.parse(jsonMatch[0]);
          return NextResponse.json(result);
        }
      } catch (err) {
        console.warn("Claude API unavailable, falling back to keyword check:", err instanceof Error ? err.message : err);
      }
    }

    // Fallback: keyword-based classifier
    return NextResponse.json(classifyWithKeywords(productInfo.text));
  } catch (error) {
    console.error("check-product error:", error);
    return NextResponse.json(
      {
        verdict: "error",
        carriers: [],
        reason_en: "Could not check this product. Please verify manually.",
        reason_ru: "Не удалось проверить товар. Пожалуйста, проверьте вручную.",
        product_name: "",
      } satisfies CheckResult,
      { status: 200 }
    );
  }
}
