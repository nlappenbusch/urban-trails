import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { Figtree } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { buildCatalog } from "@/lib/catalog";

const figtree = Figtree({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700", "800"], variable: "--font-figtree", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Ausflugsziele und Audio-Touren in der Schweiz`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Selbstgeführte Walking-Touren durch Schweizer Städte, kostenlos: Audio-Stories an jedem Stopp, Navi, Rätsel und Geheimtipps mit Adresse.",
  keywords: [
    "Walking Tour Schweiz",
    "Zürich Stadtrundgang",
    "Audioguide Zürich",
    "Zürich Geheimtipps",
    "Stadtführung selbstgeführt",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "de_CH",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de-CH" className={figtree.variable}>
      <body className="flex min-h-screen flex-col">
        <Header catalog={buildCatalog()} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
