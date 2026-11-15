/**
 * Typen + reine Hilfsfunktionen für Ausflüge – ohne Daten-Import, damit
 * Client-Komponenten nicht die ganze Ortsdatenbank ins Bundle ziehen.
 */
import type { StopImage } from "@/lib/types";

export type PlaceKind = "hotel" | "restaurant" | "cafe" | "bar" | "aktivitaet" | "sehenswuerdigkeit" | "aussicht" | "bad";

export interface PriceInfo {
  from: number;
  to?: number;
  unit: string;
  note?: string;
}

export interface PlaceImageSource {
  source: string;
  alt: string;
  credit: string;
}

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
  priceInfo?: PriceInfo;
  image?: PlaceImageSource;
  /** eigene Kopie des Fotos (vom Server ergänzt) */
  img?: StopImage;
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

const chf = (x: number) => (x % 1 ? x.toFixed(2) : String(x));
const isRoom = (unit: string) => /zimmer|nacht/i.test(unit);

/** «CHF 28–42 · Hauptgang», «ab CHF 190 · Doppelzimmer pro Nacht», «gratis». */
export function priceText(pi?: PriceInfo) {
  if (!pi) return "";
  if (pi.from === 0 && !pi.to) return /eintritt/i.test(pi.unit) ? "Eintritt frei" : "gratis";
  const range = pi.to && pi.to !== pi.from ? `CHF ${chf(pi.from)}–${chf(pi.to)}` : `${isRoom(pi.unit) ? "ab " : ""}CHF ${chf(pi.from)}`;
  return /^gratis$/i.test(pi.unit) ? range : `${range} · ${pi.unit}`;
}

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

const PAYS: PlaceKind[] = ["restaurant", "cafe", "bar", "aktivitaet", "bad"];

export interface Budget {
  low: number;
  high: number;
  /** Programmpunkte, die etwas kosten, für die aber kein Preis belegt ist */
  missing: string[];
  nights: number;
  /** Hotel, dessen Preis eingerechnet ist */
  hotel?: string;
}

/**
 * Grobe Kosten pro Person ohne Anreise: Eintritte/Billette, Essen (Hauptgang bzw. Menü),
 * Hotel im Doppelzimmer geteilt. Nur belegte Preise – was fehlt, steht in `missing`.
 */
export function tripBudget(days: TripDay[], places: Record<string, Place>, hotel?: Place, rain = false): Budget {
  let low = 0, high = 0;
  const missing: string[] = [];
  let prev: string | undefined;
  for (const raw of days.flatMap((d) => d.slots)) {
    const s = effectiveSlot(raw, rain);
    const p = s.placeId ? places[s.placeId] : undefined;
    const same = s.placeId === prev;
    prev = s.placeId;
    if (!p || p.kind === "hotel" || same) continue;
    const pi = p.priceInfo;
    if (!pi || /familie|gruppe|pauschal/i.test(pi.unit)) {
      if (PAYS.includes(p.kind)) missing.push(p.name);
      continue;
    }
    low += pi.from;
    high += pi.to ?? pi.from;
  }
  const nights = Math.max(0, days.length - 1);
  if (nights && hotel?.priceInfo) {
    const share = /doppel/i.test(hotel.priceInfo.unit) ? 2 : 1;
    low += (hotel.priceInfo.from / share) * nights;
    high += ((hotel.priceInfo.to ?? hotel.priceInfo.from) / share) * nights;
  } else if (nights && hotel) missing.push(hotel.name);
  const hotelIncluded = Boolean(nights && hotel?.priceInfo);
  return { low: Math.floor(low / 10) * 10, high: Math.ceil(high / 10) * 10, missing, nights, hotel: hotelIncluded ? hotel!.name : undefined };
}
