/**
 * Überraschungs-Ausflug: alles, was die Karte zeigt, steckt im Link (kein Server-Speicher).
 * Das Ziel ist nur leicht verschleiert – genug, damit es niemand aus Versehen sieht.
 */
export interface Mystery {
  /** Region (Slug) und Name */
  r: string;
  n: string;
  /** Datum YYYY-MM-DD */
  d: string;
  /** Startbahnhof, Abfahrt, Gleis, Ankunft, Fahrzeit (Min.), Umstiege */
  s: string;
  t: string;
  g?: string;
  a: string;
  m: number;
  u: number;
  /** mit wem (paar, familie …) */
  w: string;
  /** Packliste (Schlüssel aus PACK) */
  p: string[];
  /** Kosten pro Person ohne Bahn: [von, bis] */
  c?: [number, number];
  /** Wetter: Icon-Code, Max-Temperatur */
  wc?: number;
  wt?: number;
}

export const PACK: Record<string, string> = {
  schirm: "Regenschirm oder Regenjacke",
  warm: "Warme Jacke, Mütze – es geht nach oben",
  schuhe: "Bequeme Schuhe, ihr lauft einiges",
  bad: "Badesachen und Tuch",
  sonne: "Sonnenbrille und Sonnencreme",
  hunger: "Hunger – Mittagessen ist eingeplant",
  karte: "Halbtax oder GA, falls vorhanden",
};

const b64 = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/"))));

export function encodeMystery(m: Mystery) {
  return b64(JSON.stringify(m)).split("").reverse().join("");
}

export function decodeMystery(token: string): Mystery | undefined {
  try {
    const m = JSON.parse(unb64(token.split("").reverse().join(""))) as Mystery;
    if (typeof m.r !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(m.d) || !/^\d{2}:\d{2}$/.test(m.t)) return undefined;
    return m;
  } catch {
    return undefined;
  }
}

export const fmtDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
