import type { Metadata, Viewport } from "next";
import { Manrope, Montserrat } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSiteData } from "@/lib/data";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sena Akvaryum · Yalvaç | Balık, Kuş, Papağan, Kaplumbağa",
    template: "%s · Sena Akvaryum",
  },
  description:
    "Yalvaç'ta akvaryum ve evcil hayvan dükkanı: balık, muhabbet kuşu, papağan, kaplumbağa ve bakım malzemeleri. Sena Akvaryum'u ziyaret edin.",
  openGraph: {
    title: "Sena Akvaryum · Yalvaç",
    description: "Balık, muhabbet kuşu, papağan, kaplumbağa — canlı dostlar, renkli dünyalar.",
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#06080c",
  colorScheme: "dark",
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, categories, products } = await getSiteData();

  return (
    <html lang="tr" className={`${montserrat.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-ink text-white">
        <Header hasNew={products.some((p) => p.isNew)} />
        {children}
        <Footer settings={settings} categories={categories} />
      </body>
    </html>
  );
}
