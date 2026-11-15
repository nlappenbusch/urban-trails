import type { Metadata } from "next";
import { tours } from "@/lib/tours";
import { categories, getToursByCategory } from "@/lib/categories";
import { toTourLite } from "@/lib/tour-lite";
import TourExplorer, { type CatChip } from "@/components/TourExplorer";

export const metadata: Metadata = {
  title: "Alle Walking-Touren",
  description:
    "Alle selbstgeführten Walking-Touren von Urban Trails Switzerland: nach Stadt oder Stimmung filtern – mit Audioguide, Karte und Geheimtipps.",
  alternates: { canonical: "/touren" },
};

export default function ToursPage() {
  const lite = tours.map(toTourLite);

  const cats: CatChip[] = categories
    .filter((c) => getToursByCategory(c.slug).length > 0)
    .map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <div className="container-page py-16">
      <p className="kicker">{tours.length} Touren · {new Set(tours.map((t) => t.citySlug)).size} Städte</p>
      <h1 className="headline mt-3 text-5xl text-cream sm:text-6xl">
        Alle <em>Touren</em>
      </h1>
      <p className="mt-4 max-w-xl text-cream-dim">
        Jede Tour ist komplett ausgearbeitet: logische Route, Gehzeiten,
        GPS-Koordinaten, Audio-Story und Geheimtipps für jeden Stopp.
      </p>
      <div className="mt-8">
        <TourExplorer tours={lite} cats={cats} />
      </div>
    </div>
  );
}
