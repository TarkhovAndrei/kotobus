import { LanguageProvider } from "@/lib/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DetailedOrderForm from "@/components/DetailedOrderForm";
import type { Locale } from "@/lib/i18n";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ link?: string; notes?: string; email?: string; lang?: string }>;
}) {
  const { link, notes, email, lang } = await searchParams;
  const locale: Locale = lang === "en" ? "en" : "ru";

  return (
    <LanguageProvider initialLocale={locale}>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-2xl space-y-8 px-4 sm:px-6">
          <div className="rounded-3xl border-2 border-sky-200 bg-sky-50 p-6 text-center shadow-paw">
            <div className="text-4xl">🐾</div>
            <p className="mt-3 text-base leading-relaxed text-stone-800">
              Мы свяжемся с вами в ближайшее время по поводу вашего заказа, если вы хотите ускорить его обработку — заполните форму с вашим адресом заранее!
            </p>
          </div>
          <DetailedOrderForm productLink={link} productNotes={notes} email={email} />
        </div>
      </main>
      <Footer />
    </LanguageProvider>
  );
}
