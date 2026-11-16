/** Kalender wiederkehrender Bräuche, Feste und Grossanlässe (kuratiert, src/data/feste.json). */
import data from "@/data/feste.json";

export interface Termin {
  von: string;
  bis?: string;
  /** Datum vom Veranstalter bestätigt (sonst aus der Regel berechnet) */
  gesichert?: boolean;
}
export interface Fest {
  id: string;
  name: string;
  art: "brauch" | "fest" | "musik" | "markt" | "sport";
  ort: string;
  kt: string;
  lat: number;
  lng: number;
  web?: string;
  regel: string;
  termine: Termin[];
  gesichert: boolean;
  familie?: boolean;
  text: string;
  q: number;
}

export const FESTE = data as Fest[];

export const ART_LABEL: Record<Fest["art"], string> = { brauch: "Brauch", fest: "Fest", musik: "Musik", markt: "Markt", sport: "Sport" };

/** heutiges Datum in der Schweiz als YYYY-MM-DD */
export function heuteCH(d = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" }).format(d);
}

/** nächster Termin ab heute (laufende inklusive) */
export function naechsterTermin(f: Fest, heute = heuteCH()): Termin | undefined {
  return f.termine.filter((t) => (t.bis ?? t.von) >= heute).sort((a, b) => a.von.localeCompare(b.von))[0];
}

/** Termin bestätigt? (Termin-Angabe vor der des Anlasses) */
export const sicher = (f: Fest, t: Termin) => t.gesichert ?? f.gesichert;

export const laeuft = (t: Termin, heute = heuteCH()) => t.von <= heute && (t.bis ?? t.von) >= heute;

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("de-CH", { timeZone: "UTC", ...opts }).format(new Date(`${iso}T00:00:00Z`));

/** «Mo 15. Feb. 2027» oder «15.–17. Feb. 2027» */
export function terminText(t: Termin) {
  if (!t.bis || t.bis === t.von) return fmt(t.von, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const sameMonth = t.von.slice(0, 7) === t.bis.slice(0, 7);
  return sameMonth
    ? `${fmt(t.von, { day: "numeric" })}–${fmt(t.bis, { day: "numeric", month: "short", year: "numeric" })}`
    : `${fmt(t.von, { day: "numeric", month: "short" })} – ${fmt(t.bis, { day: "numeric", month: "short", year: "numeric" })}`;
}

/** Anlässe mit nächstem Termin, chronologisch */
export function kommende(heute = heuteCH()) {
  return FESTE.map((f) => ({ f, t: naechsterTermin(f, heute) }))
    .filter((x): x is { f: Fest; t: Termin } => !!x.t)
    .sort((a, b) => a.t.von.localeCompare(b.t.von) || b.f.q - a.f.q);
}

/** Anlässe mit einem Termin im Monat m (1–12), nächstes Vorkommen ab heute */
export function festeImMonat(m: number, heute = heuteCH()) {
  const mm = String(m).padStart(2, "0");
  return FESTE.map((f) => ({ f, t: f.termine.filter((t) => (t.bis ?? t.von) >= heute && (t.von.slice(5, 7) === mm || (t.bis ?? t.von).slice(5, 7) === mm)).sort((a, b) => a.von.localeCompare(b.von))[0] }))
    .filter((x): x is { f: Fest; t: Termin } => !!x.t)
    .sort((a, b) => a.t.von.localeCompare(b.t.von));
}
