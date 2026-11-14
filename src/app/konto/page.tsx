import type { Metadata } from "next";
import Account from "@/components/Account";
import { buildCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Dein Spielstand & Konto",
  description: "Punkte, Level, Abzeichen und Rangliste für deine Urban-Trails-Touren.",
  robots: { index: false, follow: true },
};

export default function KontoPage() {
  return <Account catalog={buildCatalog()} />;
}
