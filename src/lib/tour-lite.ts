import type { Tour } from "@/lib/types";
import { getDestination } from "@/data/destinations";
import { getCategory } from "@/lib/categories";
import { getTourHeroImage } from "@/data/images";

/** Schlanke Tourdaten für Karten in Client-Komponenten (ohne Stopp-Texte). */
export interface TourLite {
  slug: string;
  citySlug: string;
  cityName: string;
  name: string;
  teaser: string;
  gradient: [string, string];
  durationMinutes: number;
  distanceKm: number;
  stops: number;
  gems: number;
  category?: string;
  categoryName?: string;
  categoryEmoji?: string;
  heroUrl?: string;
  heroAlt?: string;
}

export function toTourLite(t: Tour): TourLite {
  const cat = t.category ? getCategory(t.category) : undefined;
  const hero = getTourHeroImage(t.slug);
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
    category: t.category,
    categoryName: cat?.name,
    categoryEmoji: cat?.emoji,
    heroUrl: hero?.url,
    heroAlt: hero?.alt,
  };
}
