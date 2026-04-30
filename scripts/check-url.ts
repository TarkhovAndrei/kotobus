/**
 * CLI tool: check whether a product URL is shippable.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/check-url.ts <product-url>
 *
 * Example:
 *   npx tsx scripts/check-url.ts "https://www.amazon.com/dp/B000CMFKNS"
 */

import Anthropic from "@anthropic-ai/sdk";
import { SHIPPING_RULES_PROMPT } from "../src/lib/shipping-rules";

const client = new Anthropic();

async function fetchProductInfo(url: string): Promise<string> {
  // Decode Amazon "buyagain" pages with ats= base64 param
  const atsMatch = url.match(/[?&]ats=([^&]+)/);
  if (atsMatch) {
    try {
      const decoded = Buffer.from(
        decodeURIComponent(atsMatch[1]),
        "base64",
      ).toString("utf-8");
      const data = JSON.parse(decoded);
      const candidates = data.explicitCandidates || data.candidates || "";
      const firstAsin = candidates.split(",")[0].trim();
      if (firstAsin) {
        return await fetchProductInfo(`https://www.amazon.com/dp/${firstAsin}`);
      }
    } catch {
      /* ignore */
    }
  }

  const asinMatch =
    url.match(/\/dp\/([A-Z0-9]{10})/) || url.match(/\/gp\/product\/([A-Z0-9]{10})/);
  const fetchUrl = asinMatch ? `https://www.amazon.com/dp/${asinMatch[1]}` : url;

  const response = await fetch(fetchUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  const html = await response.text();

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

  // Best-effort USD price detection for the €200 cap check.
  const priceMatch =
    html.match(/"priceAmount"\s*:\s*([\d.]+)/) ||
    html.match(/<span[^>]+class="a-offscreen"[^>]*>\s*\$\s*([\d.,]+)/i) ||
    html.match(/\$\s*([\d]{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/);
  const priceUsd = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, "")) : null;
  const priceEur = priceUsd !== null ? priceUsd * 0.92 : null;

  return [
    `URL: ${fetchUrl}`,
    title && `Product title: ${title.substring(0, 200)}`,
    description && `Description: ${description.substring(0, 400)}`,
    priceUsd !== null
      ? `Price: USD ${priceUsd.toFixed(2)} (≈ €${priceEur!.toFixed(2)})`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: npx tsx scripts/check-url.ts <product-url>");
    process.exit(1);
  }

  console.log("📦 Fetching product info...");
  const productInfo = await fetchProductInfo(url);
  console.log(productInfo);
  console.log();

  console.log("🔍 Classifying with Claude...");
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 512,
    system: SHIPPING_RULES_PROMPT,
    messages: [
      {
        role: "user",
        content: `Please check if this product is allowed for shipping:\n\n${productInfo}`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.log("Raw response:", text);
    return;
  }

  const result = JSON.parse(jsonMatch[0]);
  const icon =
    result.verdict === "allowed" ? "✅" : result.verdict === "warning" ? "⚠️" : "❌";

  console.log(`\n${icon} ${result.verdict.toUpperCase()}: ${result.product_name}`);
  console.log(`\n${result.reason_en}`);
  if (result.carriers?.length) {
    console.log(`\nShippable via: ${result.carriers.join(", ")}`);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
