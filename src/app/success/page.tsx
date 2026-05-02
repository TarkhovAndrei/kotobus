import { LanguageProvider } from "@/lib/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Locale } from "@/lib/i18n";
import SuccessContent from "./SuccessContent";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: Locale = lang === "en" ? "en" : "ru";

  return (
    <LanguageProvider initialLocale={locale}>
      <Header />
      <SuccessContent />
      <Footer />
    </LanguageProvider>
  );
}
