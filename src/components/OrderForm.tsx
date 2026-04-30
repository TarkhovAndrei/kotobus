"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import ProductChecker from "./ProductChecker";

function Input({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  className = "",
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        className="w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
      />
    </div>
  );
}

export default function OrderForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [productUrl, setProductUrl] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
      setProductUrl("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border-2 border-green-200 bg-green-50 p-8 text-center shadow-paw">
        <div className="text-5xl">🐾</div>
        <h3 className="mt-3 text-2xl font-extrabold text-green-800">{t("successTitle")}</h3>
        <p className="mt-2 text-green-700">{t("successMessage")}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full bg-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-paw transition hover:-translate-y-0.5 hover:bg-sky-700"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      {/* Product */}
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
            {/* Auto-check result appears right below the URL field */}
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
        </div>
      </fieldset>

      {/* Shipping */}
      <fieldset className="rounded-3xl border-2 border-stone-300 bg-white p-6 shadow-paw">
        <legend className="px-3 text-lg font-bold text-stone-800">
          {t("shippingTitle")}
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label={t("fullName")} name="fullName" placeholder={t("fullNamePlaceholder")} className="sm:col-span-2" />
          <Input label={t("email")} name="email" type="email" placeholder={t("emailPlaceholder")} />
          <Input label={t("phone")} name="phone" type="tel" placeholder={t("phonePlaceholder")} />
          <Input label={t("country")} name="country" placeholder={t("countryPlaceholder")} />
          <Input label={t("city")} name="city" placeholder={t("cityPlaceholder")} />
          <Input label={t("address")} name="address" placeholder={t("addressPlaceholder")} className="sm:col-span-2" />
          <Input label={t("zip")} name="zip" placeholder={t("zipPlaceholder")} />
          <Input label={t("inn")} name="inn" placeholder={t("innPlaceholder")} />
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
