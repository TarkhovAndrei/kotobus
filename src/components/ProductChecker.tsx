"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import type { CheckResult } from "@/app/api/check-product/route";

interface ProductCheckerProps {
  url: string;
}

export default function ProductChecker({ url }: ProductCheckerProps) {
  const { locale } = useLanguage();
  const [state, setState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [result, setResult] = useState<CheckResult | null>(null);

  const check = useCallback(async (productUrl: string) => {
    setState("loading");
    setResult(null);
    try {
      const res = await fetch("/api/check-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });
      const data: Partial<CheckResult> & { error?: string } = await res.json();
      if (!res.ok || !data.verdict) {
        setState("error");
        return;
      }
      setResult({
        verdict: data.verdict,
        carriers: data.carriers ?? [],
        reason_en: data.reason_en ?? "",
        reason_ru: data.reason_ru ?? "",
        product_name: data.product_name ?? "",
        price_estimate: data.price_estimate ?? null,
      });
      setState("done");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    if (!url) {
      setState("idle");
      setResult(null);
      return;
    }

    // Debounce: wait 1.5s after user stops typing
    const timer = setTimeout(() => {
      try {
        new URL(url); // validate URL format
        check(url);
      } catch {
        // not a valid URL yet, do nothing
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [url, check]);

  if (state === "idle") return null;

  if (state === "loading") {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        {locale === "ru"
          ? "Проверяем товар на соответствие правилам доставки…"
          : "Checking product against shipping rules…"}
      </div>
    );
  }

  if (state === "error" || !result) {
    return (
      <div className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600">
        {locale === "ru"
          ? "Не удалось проверить товар."
          : "Could not check product."}
      </div>
    );
  }

  const { verdict, carriers, product_name, price_estimate } = result;
  const reason = locale === "ru" ? result.reason_ru : result.reason_en;

  const styles = {
    allowed: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "✅",
      label: locale === "ru" ? "Разрешено" : "Allowed",
      text: "text-green-800",
      badge: "bg-green-100 text-green-800",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "⚠️",
      label: locale === "ru" ? "С условиями" : "Conditional",
      text: "text-yellow-900",
      badge: "bg-yellow-100 text-yellow-800",
    },
    banned: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "❌",
      label: locale === "ru" ? "Запрещено" : "Banned",
      text: "text-red-800",
      badge: "bg-red-100 text-red-800",
    },
    error: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: "❓",
      label: locale === "ru" ? "Неизвестно" : "Unknown",
      text: "text-gray-700",
      badge: "bg-gray-100 text-gray-700",
    },
  };

  const s = styles[verdict] ?? styles.error;

  return (
    <div
      className={`mt-3 rounded-lg border ${s.bg} ${s.border} px-4 py-3`}
    >
      <div className="flex items-start gap-2">
        <span className="text-base leading-5">{s.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`flex flex-wrap items-center gap-2`}>
            <span className={`font-semibold text-sm ${s.text}`}>
              {s.label}
            </span>
            {product_name && (
              <span className="truncate text-xs text-gray-500">
                — {product_name}
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm ${s.text}`}>{reason}</p>

          {price_estimate && (
            <div className="mt-3 rounded-md bg-white/60 border border-stone-200 px-3 py-2 text-sm text-stone-700">
              <p className="font-semibold text-stone-800 mb-1">
                {locale === "ru" ? "Примерная стоимость" : "Estimated cost"}
              </p>
              <div className="space-y-0.5">
                <div className="flex justify-between">
                  <span>{locale === "ru" ? "Товар" : "Product"}</span>
                  <span>${price_estimate.product_usd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === "ru" ? "Налог Калифорнии (7.25%)" : "California tax (7.25%)"}</span>
                  <span>${price_estimate.sales_tax_usd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === "ru" ? "Доставка" : "Delivery"}</span>
                  <span>${price_estimate.delivery_usd}</span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === "ru" ? "Наша комиссия" : "Service fee"}</span>
                  <span>${price_estimate.overhead_usd}</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-900 border-t border-stone-200 pt-1 mt-1">
                  <span>{locale === "ru" ? "Итого" : "Total"}</span>
                  <span>
                    ${price_estimate.total_usd.toFixed(2)}{" "}
                    <span className="text-stone-500 font-normal">
                      ≈ {price_estimate.total_rub.toLocaleString("ru-RU")} ₽
                    </span>
                  </span>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-stone-400">
                {locale === "ru"
                  ? `Курс ₽${price_estimate.rate} за $1`
                  : `Rate: ₽${price_estimate.rate} per $1`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
