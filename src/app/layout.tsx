import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Walking-Touren mit Audioguide & Geheimtipps`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Selbstgeführte Premium-Walking-Touren durch Schweizer Städte: Storytelling-Audioguides, interaktive Karten, Geheimtipps und Routen, die sich deinem Tag anpassen.",
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
    <html lang="de-CH">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
