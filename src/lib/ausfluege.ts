/**
 * Ausflüge: Ortsdatenbank (Hotels, Gastro, Aktivitäten) + fertig getaktete Programme.
 * Daten liegen als JSON in src/data/ausfluege/<regionen>.json – recherchiert und mit
 * Quelle + Prüfdatum versehen. Programme verweisen per placeId bzw. tourSlug darauf.
 */
import soloRap from "@/data/ausfluege/solothurn-rapperswil.json";
import luzThun from "@/data/ausfluege/luzern-thun.json";
import lugBern from "@/data/ausfluege/lugano-bern.json";

export type PlaceKind = "hotel" | "restaurant" | "cafe" | "bar" | "aktivitaet" | "sehenswuerdigkeit" | "aussicht" | "bad";

export interface Place {
  id: string;
  kind: PlaceKind;
  name: string;
  region: string;
  town: string;
  address?: string;
  coords?: { lat: number; lng: number } | null;
  url?: string;
  price?: number;
  tags: string[];
  weatherProof?: boolean;
  season?: string;
  hours?: string;
  durationMin?: number;
  text: string;
  tip?: string;
  source?: string;
  checked?: string;
}

export interface TripAlt {
  placeId?: string;
  title: string;
  text: string;
}

export interface TripSlot {
  time: string;
  placeId?: string;
  tourSlug?: string;
  title: string;
  text: string;
  travel?: string;
  rain?: TripAlt;
}

export interface TripDay {
  title: string;
  slots: TripSlot[];
}

export interface Trip {
  slug: string;
  title: string;
  teaser: string;
  region: string;
  days: number;
  moods: string[];
  audience: string[];
  season?: string;
  arrival?: { from: string; minutes: number }[];
  hotelIds?: string[];
  dayPlans: TripDay[];
}

interface Bundle {
  places: Place[];
  trips: Trip[];
}

const bundles = [soloRap, luzThun, lugBern] as unknown as Bundle[];

export const places: Place[] = bundles.flatMap((b) => b.places);
export const trips: Trip[] = bundles.flatMap((b) => b.trips);

const placeIndex = new Map(places.map((p) => [p.id, p]));
export const getPlace = (id?: string) => (id ? placeIndex.get(id) : undefined);
export const getTrip = (slug: string) => trips.find((t) => t.slug === slug);

export const regions = [...new Set(places.map((p) => p.region))];

export const MOODS: Record<string, string> = {
  genuss: "Genuss",
  kultur: "Kultur",
  natur: "Natur",
  aktiv: "Aktiv",
  erholung: "Erholung",
  romantik: "Romantik",
  familie: "Familie",
};

export const AUDIENCE: Record<string, string> = {
  paar: "Zu zweit",
  freunde: "Mit Freunden",
  familie: "Mit Kindern",
  allein: "Allein",
};

export const KIND_LABEL: Record<PlaceKind, string> = {
  hotel: "Hotel",
  restaurant: "Restaurant",
  cafe: "Café",
  bar: "Bar",
  aktivitaet: "Erlebnis",
  sehenswuerdigkeit: "Sehenswert",
  aussicht: "Aussicht",
  bad: "Baden",
};

export const daysLabel = (n: number) => (n === 1 ? "1 Tag" : `${n} Tage`);
export const priceLabel = (p?: number) => (p ? ["", "günstig", "mittel", "gehoben", "Luxus"][p] ?? "" : "");

/** Programmpunkt bei Regen: Plan B, falls vorhanden. */
export function effectiveSlot(s: TripSlot, rain: boolean): TripSlot & { swapped?: boolean } {
  if (!rain || !s.rain) return s;
  return { ...s, placeId: s.rain.placeId, tourSlug: undefined, title: s.rain.title, text: s.rain.text, swapped: true };
}

export function fmtMin(m: number) {
  if (m < 60) return `${m} Min.`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${r} Min.` : `${h} h`;
}
