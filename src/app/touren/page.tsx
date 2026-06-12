import type { Metadata } from "next";
import { tours } from "@/lib/tours";
import { getDestination } from "@/data/destinations";
import { categories, getToursByCategory, getCategory } from "@/lib/categories";
import { getTourHeroImage } from "@/data/images";
import TourExplorer, { type TourLite, type CatChip } from "@/components/TourExplorer";

export const metadata: Metadata = {
  title: "Alle Walking-Touren",
  description:
    "Alle selbstgeführten Walking-Touren von Urban Trails Switzerland: nach Stadt, Stimmung oder Budget filtern – mit Audioguide, Karte und Geheimtipps.",
  alternates: { canonical: "/touren" },
};

export default function ToursPage() {
  const lite: TourLite[] = tours.map((t) => {
    const cat = t.category ? getCategory(t.category) : undefined;
    return {
      slug: t.slug,
      citySlug: t.citySlug,
      cityName: getDestination(t.citySlug)?.name ?? t.citySlug,
      name: t.name,
      teaser: t.teaser,
      gradient: t.gradient,
      durationMinutes: t.durationMinutes,
      distanceKm: t.distanceKm,
      stops: t.stops.length,
      gems: t.stops.filter((s) => s.isHiddenGem).length,
      isPremium: t.isPremium,
      priceChf: t.priceChf,
      category: t.category,
      categoryName: cat?.name,
      categoryEmoji: cat?.emoji,
      heroUrl: getTourHeroImage(t.slug)?.url,
    };
  });

  const cats: CatChip[] = categories
    .filter((c) => getToursByCategory(c.slug).length > 0)
    .map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }));

  return (
    <div className="container-page py-16">
      <p className="kicker">{tours.length} Touren · {new Set(tours.map((t) => t.citySlug)).size} Städte</p>
      <h1 className="headline mt-3 text-5xl text-cream sm:text-6xl">
        Alle <em>Touren</em>
      </h1>
      <p className="mt-4 max-w-xl text-cream-dim">
        Jede Tour ist komplett ausgearbeitet: logische Route, Gehzeiten,
        GPS-Koordinaten, Storytelling-Audioguide und Geheimtipps, die nicht in
        Reiseführern stehen. Filter dich durch:
      </p>
      <div className="mt-8">
        <TourExplorer tours={lite} cats={cats} />
      </div>
    </div>
  );
}
