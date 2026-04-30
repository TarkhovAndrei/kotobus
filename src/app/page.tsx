"use client";

import { LanguageProvider } from "@/lib/LanguageContext";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ShippingRules from "@/components/ShippingRules";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <Header />
      <HeroSection />
      <ShippingRules />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <OrderForm />
        </div>
      </main>
      <Footer />
    </LanguageProvider>
  );
}
