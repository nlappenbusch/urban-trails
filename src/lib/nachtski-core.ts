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
  /** Haltestellenname für den Fahrplan, falls `station` dort nicht eindeutig ist */
  oev?: string;
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
  image?: { source: string; alt: string; credit: string };
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

/** Alle Abende ab `fromIso` bis Saisonende (höchstens `max`) mit Status und Spezialabend */
export function seasonNights(o: NightOffer, fromIso: string, max = 120) {
  const out: { date: string; status: "fix" | "voraussichtlich"; event?: string }[] = [];
  const d = new Date(`${fromIso}T12:00:00`);
  for (let i = 0; i < 200 && out.length < max; i++) {
    const iso = isoDay(d);
    const s = nightStatus(o, iso);
    if (s) out.push({ date: iso, status: s, event: eventOn(o, iso) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** Mondphase (0 = Neumond, 0.5 = Vollmond) und beleuchteter Anteil – reicht für «Vollmond-Abend» */
export function moon(iso: string) {
  const SYN = 29.530588853;
  const t = (new Date(`${iso}T21:00:00Z`).getTime() - Date.UTC(2000, 0, 6, 18, 14)) / 86400000;
  const phase = (((t % SYN) + SYN) % SYN) / SYN;
  const illum = (1 - Math.cos(2 * Math.PI * phase)) / 2;
  const name =
    illum > 0.97 ? "Vollmond" : illum < 0.03 ? "Neumond" : phase < 0.5 ? (illum > 0.5 ? "zunehmend, fast voll" : "zunehmend") : illum > 0.5 ? "abnehmend, noch hell" : "abnehmend";
  return { phase, illum, name };
}

/** Vollmond-Daten zwischen zwei Tagen */
export function fullMoons(fromIso: string, toIso: string) {
  const out: string[] = [];
  const d = new Date(`${fromIso}T12:00:00`);
  while (isoDay(d) <= toIso) {
    const iso = isoDay(d);
    const a = moon(iso).illum;
    const prev = new Date(d); prev.setDate(d.getDate() - 1);
    const next = new Date(d); next.setDate(d.getDate() + 1);
    if (a >= moon(isoDay(prev)).illum && a > moon(isoDay(next)).illum && a > 0.9) out.push(iso);
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export const dateLong = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long" });

export const timeText = (o: NightOffer) => (o.to ? `${o.from}–${o.to}` : `ab ${o.from}`);
export const eventOn = (o: NightOffer, iso: string) => o.events.find((e) => e.date === iso)?.title;
