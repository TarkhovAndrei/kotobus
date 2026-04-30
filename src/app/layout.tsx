import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Котобус / Kotobus — привезёт что угодно из США",
  description:
    "Котобус купит для вас любой товар из американского магазина и привезёт его до ближайшего отделения почты. Brings you anything from the USA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
