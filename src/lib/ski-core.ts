/** Skigebiete – Typen (auch im Browser nutzbar). */

export interface SkiArea {
  id: string;
  name: string;
  canton: string;
  region: string | null;
  coords: { lat: number; lng: number };
  station: string;
  access?: string;
  url?: string;
  altitude?: { base?: number; top?: number };
  /** offizielle Pisten-km je Farbe (blau/rot/schwarz) */
  pistes?: { blue?: number; red?: number; black?: number; total?: number; count?: number };
  lifts?: number;
  season?: string;
  ticket?: { from: number; to?: number; unit: string; note?: string };
  family?: boolean;
  snowpark?: boolean;
  nightSkiing?: boolean;
  text?: string;
}

export interface Count {
  open: number;
  total: number;
  openKm?: number | null;
  totalKm?: number | null;
}

export interface SkiLive {
  status: "open" | "closed" | "no_report";
  lifts?: Count;
  slopes?: Count;
  /** blau / rot / schwarz */
  byColor?: { blue?: Count; red?: Count; black?: Count };
  at?: string;
}

export interface SkiSnow {
  /** Schneehöhe cm an der SLF-Station */
  cm: number;
  fresh?: number;
  station: string;
  elevation: number;
  date: string;
}

export type ItemStatus = "open" | "prep" | "closed" | "unknown";
export interface SkiItem { name: string; status: ItemStatus; type?: string; difficulty?: "blue" | "red" | "black" | "route" }
export interface SkiGroup { key: string; title: string; open: number; total: number; items: SkiItem[] }
/** Alles, was die Bergbahn einzeln meldet: Anlagen, Pisten, Hütten, Parkplätze … */
export interface SkiDetail { groups: SkiGroup[]; source: "infosnow" | "intermaps"; sourceUrl: string; at?: string }

export interface MountainDay { date: string; code: number; tmax: number; tmin: number; snowCm: number; windMax: number; sunH: number }
export interface MountainWeather { base: MountainDay[]; top: MountainDay[]; baseM: number; topM: number; freezing?: number[] }

export interface SkiRow extends SkiArea {
  live?: SkiLive;
  snow?: SkiSnow;
}

export const crowKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};
const r5 = (m: number) => Math.round(m / 5) * 5;
/** ÖV grob aus Luftlinie (Berge = Umwege, Umsteigen) – echte Verbindung wird nachgeladen */
export const oevEstimate = (crow: number) => r5(20 + crow * 1.15);
/** Auto grob: Strasse ≈ 1,35× Luftlinie, Autobahn-Anteil wächst mit Distanz, +10 Min. Bergstrasse/Parkplatz */
export function carEstimate(crow: number) {
  const road = crow * (crow < 30 ? 1.45 : 1.35);
  const speed = crow < 30 ? 50 : crow < 80 ? 65 : 78;
  return { min: r5((road / speed) * 60 + 10), km: Math.round(road) };
}
export const carLink = (from: { lat?: number; lng?: number; name: string }, to: { lat: number; lng: number }) =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from.lat && from.lng ? `${from.lat},${from.lng}` : from.name)}&destination=${to.lat},${to.lng}&travelmode=driving`;
export const sbbLink = (from: string, to: string, date?: string, time = "07:30") =>
  `https://www.sbb.ch/de?von=${encodeURIComponent(from)}&nach=${encodeURIComponent(to)}${date ? `&datum=${date}` : ""}&zeit=${time}`;

/** offene / totale Pisten-km (live, sonst Stammdaten) */
export function kmOpen(r: SkiRow): { open: number | null; total: number; approx: boolean } {
  const L = r.live;
  const staticTotal = r.pistes?.total ?? 0;
  if (!L) return { open: null, total: Math.round(staticTotal), approx: false };
  // offizielle km der Bergbahn haben Vorrang (LiftRadar zählt teils ganze Verbünde)
  const total = staticTotal || L.slopes?.totalKm || 0;
  if (L.status !== "open") return { open: 0, total: Math.round(total), approx: false };
  // Viele Bergbahnen melden nur «7 von 34 Pisten» – dann km je Farbe anteilig schätzen
  let open = 0, approx = false, any = false;
  for (const k of ["blue", "red", "black"] as const) {
    const c = L.byColor?.[k];
    if (!c) continue;
    any = true;
    if (c.openKm != null && (c.totalKm ?? 0) > 0) open += c.openKm;
    else if (c.total > 0 && c.open > 0) {
      open += ((r.pistes?.[k] ?? c.totalKm ?? 0) * c.open) / c.total;
      approx = true;
    }
  }
  if (!any && L.slopes) {
    if (L.slopes.openKm != null) open = L.slopes.openKm;
    else if (L.slopes.total > 0) {
      open = (total * L.slopes.open) / L.slopes.total;
      approx = L.slopes.open > 0;
    }
  }
  return { open: Math.round(total ? Math.min(open, total) : open), total: Math.round(total), approx };
}

export const statusLabel = (s?: SkiLive["status"]) => (s === "open" ? "offen" : s === "closed" ? "zu" : s === "no_report" ? "kein Bericht" : "ohne Live-Daten");

export const COLOR = {
  blue: { label: "blau", cls: "bg-sky-500" },
  red: { label: "rot", cls: "bg-red-500" },
  black: { label: "schwarz", cls: "bg-zinc-900" },
} as const;
