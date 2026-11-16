import type { Metadata } from "next";
import MerklisteView from "@/components/MerklisteView";

export const metadata: Metadata = {
  title: "Meine Merkliste",
  description: "Gemerkte Ausflugsziele auf einer Karte, nach Entfernung ab deiner Haltestelle – gespeichert nur in deinem Browser, ohne Konto.",
  alternates: { canonical: "/merkliste" },
  robots: { index: false, follow: true },
};

export default function MerklistePage() {
  return <MerklisteView />;
}
