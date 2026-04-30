"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-stone-300/70 bg-stone-100/80 py-6">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-stone-700 sm:px-6">
        🐾 {t("footerText")}
      </div>
    </footer>
  );
}
