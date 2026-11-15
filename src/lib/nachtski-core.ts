/** Nachtskifahren & Nachtschlitteln – Typen und Kalenderlogik (auch im Browser nutzbar). */

export interface NightOffer {
  id: string;
  type: "ski" | "schlitteln";
  name: string;
  place: string;
  canton: string;
  skiAreaId: string | null;
  coords: { lat: number; lng: number };
  station: string;
  piste: string;
  km: number | null;
  /** 0 = So … 6 = Sa */
  weekdays: number[];
  from: string;
  to: string;
  season: { from: string; to: string; text: string };
  dates: string[];
  events: { date: string; title: string }[];
  ticket: { price: number; unit: string; note?: string } | null;
  extras: string[];
  url: string;
  source: string;
  checked: string;
  confidence: "hoch" | "mittel";
  text: string;
}

export const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
export const WD_LONG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

/** Ohne publizierte Saison rechnen wir mit dem üblichen Fenster – als «voraussichtlich» markiert */
const TYPICAL = { from: "-12-20", to: "-03-15" };

export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const dow = (iso: string) => new Date(`${iso}T12:00:00`).getDay();

function inTypical(iso: string) {
  const y = Number(iso.slice(0, 4));
  const m = Number(iso.slice(5, 7));
  const start = m >= 7 ? `${y}${TYPICAL.from}` : `${y - 1}${TYPICAL.from}`;
  const end = m >= 7 ? `${y + 1}${TYPICAL.to}` : `${y}${TYPICAL.to}`;
  return iso >= start && iso <= end;
}

/**
 * Läuft das Angebot an diesem Abend?
 * «fix» = Datum oder Wochentag innerhalb publizierter Saison,
 * «voraussichtlich» = Wochentag passt, Saisondaten aber noch nicht publiziert.
 */
export function nightStatus(o: NightOffer, iso: string): "fix" | "voraussichtlich" | null {
  if (o.dates.includes(iso) || o.events.some((e) => e.date === iso)) return "fix";
  if (!o.weekdays.includes(dow(iso))) return null;
  const { from, to } = o.season;
  if (from && iso < from) return null;
  if (to && iso > to) return null;
  if (from && to) return "fix";
  if (from && !to) return iso <= `${Number(from.slice(0, 4)) + (Number(from.slice(5, 7)) >= 7 ? 1 : 0)}-04-15` ? "fix" : null;
  return inTypical(iso) ? "voraussichtlich" : null;
}

export const timeText = (o: NightOffer) => (o.to ? `${o.from}–${o.to}` : `ab ${o.from}`);
export const eventOn = (o: NightOffer, iso: string) => o.events.find((e) => e.date === iso)?.title;
