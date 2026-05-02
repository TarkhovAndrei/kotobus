"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

declare global {
  function gtag(...args: unknown[]): void;
}

export default function SuccessContent() {
  const router = useRouter();
  const { locale } = useLanguage();

  useEffect(() => {
    gtag("event", "conversion", {
      send_to: "AW-18133982553/hDITCP-hlqYcENm6-sZD",
      value: 1.0,
      currency: "USD",
      transaction_id: "",
    });
  }, []);

  const isRu = locale === "ru";

  return (
    <main className="flex flex-1 items-center justify-center py-16 px-4">
      <div className="mx-auto max-w-lg rounded-3xl border-2 border-green-200 bg-green-50 p-10 text-center shadow-paw">
        <div className="text-6xl">🐾</div>
        <h1 className="mt-4 text-3xl font-extrabold text-green-800">
          {isRu ? "Заказ отправлен!" : "Order sent!"}
        </h1>
        <p className="mt-3 text-green-700">
          {isRu
            ? "Мы получили ваш заказ. Свяжемся с вами в ближайшее время с оценкой стоимости."
            : "We've received your order. We'll contact you shortly with a cost estimate."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 rounded-full bg-sky-600 px-8 py-3 text-sm font-bold text-white shadow-paw transition hover:-translate-y-0.5 hover:bg-sky-700"
        >
          {isRu ? "Оформить ещё один заказ" : "Place another order"}
        </button>
      </div>
    </main>
  );
}
