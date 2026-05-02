"use client";

import { useLanguage } from "@/lib/LanguageContext";
import KotobusLogo from "./KotobusLogo";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50 to-sky-100 py-16">
      {/* Floating sparkles / paws decoration */}
      <div className="pointer-events-none absolute inset-0 select-none text-sky-300/40">
        <span className="absolute left-[6%] top-10 text-3xl">🐾</span>
        <span className="absolute right-[8%] top-24 text-2xl">📦</span>
        <span className="absolute left-[12%] bottom-12 text-2xl">✨</span>
        <span className="absolute right-[14%] bottom-20 text-3xl">🐾</span>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="mx-auto mb-6 max-w-md">
          <KotobusLogo className="h-32 w-auto sm:h-40 mx-auto drop-shadow-lg" animated />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-700">
          {t("heroSubtitle")}
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-4xl px-4 sm:px-6">
        <h3 className="mb-8 text-center text-xl font-bold text-stone-900">
          {t("howItWorks")}
        </h3>
        <div className="grid gap-6 sm:grid-cols-3">
          {(["step1", "step2", "step3"] as const).map((step, i) => (
            <div
              key={step}
              className={`rounded-3xl border-2 border-stone-300 bg-white/90 p-6 text-center shadow-paw backdrop-blur-sm transition hover:-translate-y-1 ${
                i === 0 ? "tilt-left" : i === 2 ? "tilt-right" : ""
              }`}
            >
              <div className="text-3xl">
                {i === 0 ? "🔗" : i === 1 ? "🐱" : "📬"}
              </div>
              <h4 className="mt-2 text-lg font-bold text-stone-800">
                {t(`${step}Title` as const)}
              </h4>
              <p className="mt-2 text-sm text-stone-700">
                {t(`${step}Desc` as const)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
