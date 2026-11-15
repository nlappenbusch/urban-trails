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

/** Öffnungszeiten maschinenlesbar: week 0=So … 6=Sa ([] = zu, fehlender Tag = unbekannt), months = Betriebsmonate. */
export interface OpenHours {
  week?: Record<string, [string, string][]>;
  months?: number[];
}

export type OpenState = "offen" | "zu" | "unbekannt";

/** Hat der Ort an diesem Datum (YYYY-MM-DD) – optional im Zeitfenster from–to – offen? */
export function openState(p: Pick<Place, "open">, date: string, from?: string, to?: string): OpenState {
  const o = p.open;
  if (!o) return "unbekannt";
  const d = new Date(`${date}T12:00:00Z`);
  if (o.months?.length && !o.months.includes(d.getUTCMonth() + 1)) return "zu";
  const day = o.week?.[String(d.getUTCDay())];
  if (!day) return o.months?.length ? "offen" : "unbekannt";
  if (day.length === 0) return "zu";
  if (!from) return "offen";
  const end = to ?? from;
  return day.some(([a, b]) => a <= end && b > from) ? "offen" : "zu";
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toHm = (m: number) => `${String(Math.floor(Math.min(m, 1439) / 60)).padStart(2, "0")}:${String(Math.min(m, 1439) % 60).padStart(2, "0")}`;

/** Tagesprogramm so verschieben, dass es frühestens um `earliest` beginnt (z. B. Ankunft + 15 Min.). */
export function shiftDay(day: TripDay, earliest: string): TripDay {
  const first = day.slots[0]?.time;
  if (!first || toMin(first) >= toMin(earliest)) return day;
  const delta = Math.ceil((toMin(earliest) - toMin(first)) / 15) * 15; // auf Viertelstunden
  return { ...day, slots: day.slots.map((s) => ({ ...s, time: toHm(toMin(s.time) + delta) })) };
}

/** Datum + n Tage als YYYY-MM-DD. */
export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
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
  open?: OpenHours;
  /** eigene Kopie des Fotos (vom Server ergänzt) */
  img?: StopImage;
  tags: string[];
  weatherProof?: boolean;
  season?: string;
  hours?: string;
  durationMin?: number;
  text: string;
  tip?: string;
  /** harte Tatsache, warum der Ort aussergewöhnlich ist (nur bei «besonders»/«geheimtipp») */
  wow?: string;
  /** Wanderung: Eckdaten laut SchweizMobil/Tourismus */
  hike?: { km: number; up?: number; down?: number; hours: number; difficulty?: string; start?: string; end?: string; winter?: boolean };
  /** Baden: Art des Gewässers (für Live-Wassertemperatur) */
  water?: { type: "see" | "fluss" | "freibad" | "hallenbad" | "therme"; body?: string; heated?: boolean; tempC?: number };
  source?: string;
  checked?: string;
}

/** «11,5 km · 520 Hm · 3½ h · T2» */
export function hikeText(h: NonNullable<Place["hike"]>) {
  const hrs = h.hours % 1 === 0.5 ? `${Math.floor(h.hours) || ""}½ h` : `${String(h.hours).replace(".", ",")} h`;
  return [`${String(h.km).replace(".", ",")} km`, h.up ? `${h.up} Hm hoch` : "", h.down ? `${h.down} Hm runter` : "", hrs, h.difficulty ?? "", h.winter ? "Winterweg" : ""].filter(Boolean).join(" · ");
}

/** Krasser Ort oder Geheimtipp? Liefert das Etikett, sonst undefined. */
export function specialLabel(p: Pick<Place, "tags">): "Geheimtipp" | "Krass" | undefined {
  if (p.tags.includes("geheimtipp")) return "Geheimtipp";
  if (p.tags.includes("besonders")) return "Krass";
  return undefined;
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
  /** eigene Dauer (sonst aus Ort bzw. Tour) */
  durationMin?: number;
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
  krass: "Krass & Geheimtipps",
  wandern: "Wandern",
  schwimmen: "Schwimmen",
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
  return { ...s, placeId: s.rain.placeId, tourSlug: undefined, title: s.rain.title, text: s.rain.text, durationMin: undefined, swapped: true };
}

export function fmtMin(m: number) {
  if (m < 60) return `${m} Min.`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${r} Min.` : `${h} h`;
}

export const hmToMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};
export const minToHm = (m: number) => {
  const x = Math.max(0, Math.min(m, 24 * 60 - 1));
  return `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
};

/** Übliche Dauer je Ortsart, falls der Ort keine eigene hat. */
function defaultDuration(kind: PlaceKind | undefined, start: number) {
  switch (kind) {
    case "restaurant": return start >= 17 * 60 ? 90 : 75;
    case "cafe": return 45;
    case "bar": return 60;
    case "aussicht": return 75;
    case "bad": return 120;
    case "hotel": return 30;
    case "aktivitaet":
    case "sehenswuerdigkeit": return 90;
    default: return 30;
  }
}

export interface Leg {
  mode: "fuss" | "oev";
  min: number;
  km: number;
}

/** Weg zwischen zwei Orten grob schätzen: unter 1.3 km zu Fuss, sonst ÖV (Wartezeit inklusive). */
export function estimateLeg(a?: { lat: number; lng: number } | null, b?: { lat: number; lng: number } | null): Leg | undefined {
  if (!a || !b) return undefined;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const km = 12742 * Math.asin(Math.sqrt(x));
  if (km < 0.08) return undefined; // gleicher Ort
  if (km < 1.3) return { mode: "fuss", km, min: Math.max(2, Math.round((km * 1.3 * 1000) / 75)) };
  return { mode: "oev", km, min: Math.ceil((8 + km * 2.2) / 5) * 5 };
}

export interface SlotLayout {
  slot: TripSlot & { swapped?: boolean };
  place?: Place;
  start: number;
  end: number;
  /** Weg zum nächsten Programmpunkt */
  leg?: Leg;
  /** Minuten, die bis zum nächsten Punkt fehlen (Dauer + Weg zu lang) */
  tight?: number;
}

/**
 * Tagesablauf rechnen: Beginn, Ende, Weg zum nächsten Punkt und ob es knapp wird.
 * Ändert die Uhrzeiten nicht – zeigt nur, was realistisch ist.
 */
export function layoutDay(day: TripDay, places: Record<string, Place>, rain: boolean, tourMinutes: (slug: string) => number | undefined = () => undefined): SlotLayout[] {
  const rows = day.slots.map((raw) => {
    const slot = effectiveSlot(raw, rain);
    const place = slot.placeId ? places[slot.placeId] : undefined;
    const start = hmToMin(slot.time);
    const dur = slot.durationMin ?? (slot.tourSlug ? tourMinutes(slot.tourSlug) : undefined) ?? place?.durationMin ?? defaultDuration(place?.kind, start);
    return { slot, place, start, end: start + Math.min(dur, 8 * 60) } as SlotLayout;
  });
  rows.forEach((r, i) => {
    const next = rows[i + 1];
    if (!next) return;
    r.leg = estimateLeg(r.place?.coords, next.place?.coords);
    const free = next.start - r.end - (r.leg?.min ?? 0);
    if (free < -10) r.tight = -free;
    // passt nicht: Ende auf den nächsten Beginn kürzen, damit die Zeitleiste lesbar bleibt
    if (r.end > next.start) r.end = Math.max(r.start + 30, next.start - (r.leg?.min ?? 0));
  });
  return rows;
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
  /** Einzelposten (pro Person) für den persönlichen Rechner */
  items: { name: string; kind: PlaceKind; unit: string; from: number; to: number }[];
  hotelPrice?: { from: number; to: number; perRoom: boolean };
}

export interface Party {
  adults: number;
  kids: number; // 6–15 Jahre
  halbtax: boolean;
}

const TRANSPORT = /billett|bahn|fahrt|schiff|retour|seilbahn/i;

/**
 * Kosten für eine konkrete Gruppe – bewusst als Schätzung:
 * Halbtax halbiert Bahnen/Schiffe für Erwachsene, Kinder zahlen dort und beim Eintritt die Hälfte,
 * beim Essen rechnen wir Kinderteller mit 60 %. Zimmer: Doppelzimmer pro zwei Erwachsene, Kinder im Zimmer der Eltern.
 */
export function partyCost(b: Budget, p: Party) {
  let low = 0, high = 0;
  for (const it of b.items) {
    const transport = TRANSPORT.test(it.unit) && it.kind !== "restaurant";
    const food = ["restaurant", "cafe", "bar"].includes(it.kind);
    const adult = transport && p.halbtax ? 0.5 : 1;
    const kid = it.kind === "bar" ? 0 : food ? 0.6 : 0.5;
    low += it.from * (p.adults * adult + p.kids * kid);
    high += it.to * (p.adults * adult + p.kids * kid);
  }
  if (b.hotelPrice && b.nights) {
    const rooms = b.hotelPrice.perRoom ? Math.max(1, Math.ceil(p.adults / 2)) : p.adults;
    low += b.hotelPrice.from * rooms * b.nights;
    high += b.hotelPrice.to * rooms * b.nights;
  }
  return { low: Math.floor(low / 10) * 10, high: Math.ceil(high / 10) * 10 };
}

/**
 * Grobe Kosten pro Person ohne Anreise: Eintritte/Billette, Essen (Hauptgang bzw. Menü),
 * Hotel im Doppelzimmer geteilt. Nur belegte Preise – was fehlt, steht in `missing`.
 */
export function tripBudget(days: TripDay[], places: Record<string, Place>, hotel?: Place, rain = false): Budget {
  let low = 0, high = 0;
  const missing: string[] = [];
  const items: Budget["items"] = [];
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
    items.push({ name: p.name, kind: p.kind, unit: pi.unit, from: pi.from, to: pi.to ?? pi.from });
  }
  const nights = Math.max(0, days.length - 1);
  if (nights && hotel?.priceInfo) {
    const share = /doppel/i.test(hotel.priceInfo.unit) ? 2 : 1;
    low += (hotel.priceInfo.from / share) * nights;
    high += ((hotel.priceInfo.to ?? hotel.priceInfo.from) / share) * nights;
  } else if (nights && hotel) missing.push(hotel.name);
  const hotelIncluded = Boolean(nights && hotel?.priceInfo);
  const hp = hotelIncluded ? hotel!.priceInfo! : undefined;
  return {
    low: Math.floor(low / 10) * 10,
    high: Math.ceil(high / 10) * 10,
    missing,
    nights,
    hotel: hotelIncluded ? hotel!.name : undefined,
    items,
    hotelPrice: hp ? { from: hp.from, to: hp.to ?? hp.from, perRoom: /doppel|zimmer/i.test(hp.unit) } : undefined,
  };
}
