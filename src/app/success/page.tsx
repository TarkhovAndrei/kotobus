import Script from "next/script";
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
      <Script id="gtag-conversion" strategy="afterInteractive">{`
        gtag('event', 'conversion', {
          'send_to': 'AW-18133982553/hDITCP-hlqYcENm6-sZD',
          'value': 1.0,
          'currency': 'USD',
          'transaction_id': ''
        });
      `}</Script>
      <Header />
      <SuccessContent />
      <Footer />
    </LanguageProvider>
  );
}
