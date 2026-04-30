"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { ALLOWED_ITEMS_SUMMARY, BANNED_ITEMS_SUMMARY } from "@/lib/shipping-rules";

export default function ShippingRules() {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const allowed = ALLOWED_ITEMS_SUMMARY[locale];
  const banned = BANNED_ITEMS_SUMMARY[locale];

  return (
    <section className="border-t border-stone-300/70 bg-stone-100/60 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="text-lg font-bold text-stone-900">
            🐾 {t("shippingRulesTitle")}
          </h2>
          <svg
            className={`h-5 w-5 text-sky-800 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Allowed */}
            <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 shadow-paw">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-800">
                <span>✅</span> {t("allowedTitle")}
              </h3>
              <ul className="space-y-1">
                {allowed.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                    <span className="mt-0.5 text-green-500">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Banned */}
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 shadow-paw">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-800">
                <span>❌</span> {t("bannedTitle")}
              </h3>
              <ul className="space-y-1">
                {banned.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-900">
                    <span className="mt-0.5 text-red-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
