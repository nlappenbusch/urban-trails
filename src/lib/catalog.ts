import { tours } from "./tours";
import { getDestination } from "@/data/destinations";
import { riddlesByTour } from "@/data/riddles";
import type { Catalog } from "./game";

/** Kompakte Liste aller Touren/Stopps mit Rätselpunkten – Grundlage der Punkteberechnung. */
export function buildCatalog(): Catalog {
  return tours.map((t) => {
    const key = `${t.citySlug}/${t.slug}`;
    const riddles = riddlesByTour[key] ?? {};
    return {
      key,
      city: t.citySlug,
      cityName: getDestination(t.citySlug)?.name ?? t.citySlug,
      name: t.name,
      stops: t.stops.map((s) => ({ id: s.id, gem: Boolean(s.isHiddenGem), pts: riddles[s.id]?.points ?? 0 })),
    };
  });
}
