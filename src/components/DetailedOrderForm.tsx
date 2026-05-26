"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

function Input({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  className = "",
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="w-full rounded-xl border-2 border-stone-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
      />
    </div>
  );
}

export default function DetailedOrderForm({
  productLink,
  productNotes,
  email,
}: {
  productLink?: string;
  productNotes?: string;
  email?: string;
}) {
  const { t, locale } = useLanguage();
  const router = useRouter();
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
        body: JSON.stringify({ ...data, productLink, productNotes }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push(`/success?lang=${locale}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="rounded-3xl border-2 border-stone-300 bg-white p-6 shadow-paw">
        <legend className="px-3 text-lg font-bold text-stone-800">
          {t("shippingTitle")}
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label={t("fullName")} name="fullName" placeholder={t("fullNamePlaceholder")} className="sm:col-span-2" />
          <Input label={t("email")} name="email" type="email" placeholder={t("emailPlaceholder")} defaultValue={email} />
          <Input label={t("phone")} name="phone" type="tel" placeholder={t("phonePlaceholder")} />
          <Input label={t("country")} name="country" placeholder={t("countryPlaceholder")} />
          <Input label={t("city")} name="city" placeholder={t("cityPlaceholder")} />
          <Input label={t("address")} name="address" placeholder={t("addressPlaceholder")} className="sm:col-span-2" />
          <Input label={t("zip")} name="zip" placeholder={t("zipPlaceholder")} />
          <Input label={t("inn")} name="inn" placeholder={t("innPlaceholder")} required={false} />
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
