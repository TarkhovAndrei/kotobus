"use client";

import { useLanguage } from "@/lib/LanguageContext";
import KotobusLogo from "./KotobusLogo";

export default function Header() {
  const { t, toggleLocale } = useLanguage();

  return (
    <header className="w-full border-b border-stone-300/70 bg-stone-100/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <KotobusLogo className="h-12 w-auto sm:h-14" animated />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
              {t("siteName")}
            </h1>
            <p className="text-sm text-stone-700">{t("tagline")}</p>
          </div>
        </div>
        <button
          onClick={toggleLocale}
          className="rounded-full border-2 border-sky-300 bg-white px-4 py-1.5 text-sm font-bold text-sky-800 shadow-paw transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50"
        >
          {t("switchLang")}
        </button>
      </div>
    </header>
  );
}
