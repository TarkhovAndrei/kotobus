"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import ProductChecker from "./ProductChecker";

export default function OrderForm() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [productUrl, setProductUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productLink: data.productLink,
          productNotes: data.productNotes,
          email: data.email,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const params = new URLSearchParams({ lang: locale });
      if (data.productLink) params.set("link", String(data.productLink));
      if (data.productNotes) params.set("notes", String(data.productNotes));
      if (data.email) params.set("email", String(data.email));
      router.push(`/order?${params.toString()}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <fieldset className="rounded-3xl border-2 border-stone-300 bg-white p-6 shadow-paw">
        <legend className="px-3 text-lg font-bold text-stone-800">
          {t("orderTitle")}
        </legend>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="productLink" className="mb-1 block text-sm font-medium text-stone-700">
              {t("productLink")}
            </label>
            <input
              id="productLink"
              name="productLink"
              type="url"
              placeholder={t("productLinkPlaceholder")}
              required
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <ProductChecker url={productUrl} />
          </div>
          <div>
            <label htmlFor="productNotes" className="mb-1 block text-sm font-medium text-stone-700">
              {t("productNotes")}
            </label>
            <textarea
              id="productNotes"
              name="productNotes"
              rows={3}
              placeholder={t("productNotesPlaceholder")}
              className="w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-stone-700">
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              className="w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </fieldset>

      {status === "error" && (
        <p className="text-center text-sm text-red-600">{t("errorMessage")}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-gradient-to-br from-sky-600 to-sky-700 py-3.5 text-lg font-extrabold text-white shadow-paw transition hover:-translate-y-0.5 hover:from-sky-700 hover:to-sky-800 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {status === "submitting" ? `🐾 ${t("submitting")}` : `🐱 ${t("submitOrder")}`}
      </button>
    </form>
  );
}
