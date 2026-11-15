/** Wassertemperaturen – Typen und Seenliste (auch im Browser nutzbar). */

export interface WaterReading {
  /** °C, eine Nachkommastelle */
  temp: number;
  /** ISO-Zeit der Messung bzw. des Modellwerts */
  at: string;
  /** «BAFU» (Messung) oder «Alplakes» (Modell der Eawag) */
  source: "BAFU" | "Alplakes";
  /** Messstation oder See */
  label: string;
  /** Gewässer (Aare, Zürichsee …) */
  body: string;
  kind: "fluss" | "see";
  lat: number;
  lng: number;
  /** nur Flüsse: Tagesbereich */
  min24?: number;
  max24?: number;
  /** BAFU-Stationsnummer bzw. Alplakes-Schlüssel */
  key?: string;
  /** URL-Teil der eigenen Seite */
  slug?: string;
}

/** Badestelle (OpenStreetMap oder eigene Datenbank) mit passender Live-Temperatur */
export interface BathSpot {
  id: string;
  name: string;
  kind: "offen" | "freibad" | "hallenbad" | "therme";
  lat: number;
  lng: number;
  town?: string;
  url?: string;
  hours?: string;
  fee?: boolean;
  wheelchair?: boolean;
  supervised?: boolean;
  /** von uns geprüft: Link auf unsere Seite */
  ours?: string;
  water?: { temp: number; label: string; slug?: string; source: WaterReading["source"] };
}

/** «Aare - Bern, Schönau» → «aare-bern-schoenau» */
export const waterSlug = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const lakeSlug = (l: { name: string }) => waterSlug(l.name);

/** Schweizer Seen mit Alplakes-Modell (1 m Tiefe). Schlüssel = Alplakes-Name. */
export const LAKES: { key: string; name: string; alias: string[]; lat: number; lng: number }[] = [
  { key: "lowerzurich", name: "Zürichsee", alias: ["zurichsee", "zuerichsee", "lake zurich"], lat: 47.27, lng: 8.62 },
  { key: "upperzurich", name: "Obersee (Zürichsee)", alias: ["obersee"], lat: 47.2, lng: 8.92 },
  { key: "geneva", name: "Genfersee", alias: ["genfersee", "leman", "lac leman", "lake geneva"], lat: 46.45, lng: 6.55 },
  { key: "upperconstance", name: "Bodensee", alias: ["bodensee", "obersee bodensee"], lat: 47.6, lng: 9.45 },
  { key: "lowerconstance", name: "Untersee (Bodensee)", alias: ["untersee"], lat: 47.68, lng: 9.03 },
  { key: "thun", name: "Thunersee", alias: ["thunersee"], lat: 46.69, lng: 7.71 },
  { key: "brienz", name: "Brienzersee", alias: ["brienzersee"], lat: 46.73, lng: 7.96 },
  { key: "biel", name: "Bielersee", alias: ["bielersee", "lac de bienne"], lat: 47.08, lng: 7.17 },
  { key: "neuchatel", name: "Neuenburgersee", alias: ["neuenburgersee", "lac de neuchatel"], lat: 46.9, lng: 6.84 },
  { key: "murten", name: "Murtensee", alias: ["murtensee", "lac de morat"], lat: 46.93, lng: 7.08 },
  { key: "lucernekreuztrichterandvitznauerbecken", name: "Vierwaldstättersee", alias: ["vierwaldstattersee", "vierwaldstaettersee", "luzern"], lat: 47.0, lng: 8.38 },
  { key: "lucerneurnersee", name: "Urnersee", alias: ["urnersee"], lat: 46.93, lng: 8.6 },
  { key: "lucernealpnachersee", name: "Alpnachersee", alias: ["alpnachersee"], lat: 46.96, lng: 8.3 },
  { key: "zug", name: "Zugersee", alias: ["zugersee"], lat: 47.13, lng: 8.48 },
  { key: "aegeri", name: "Ägerisee", alias: ["agerisee", "aegerisee"], lat: 47.12, lng: 8.63 },
  { key: "sempach", name: "Sempachersee", alias: ["sempachersee"], lat: 47.14, lng: 8.15 },
  { key: "hallwil", name: "Hallwilersee", alias: ["hallwilersee"], lat: 47.29, lng: 8.22 },
  { key: "baldegg", name: "Baldeggersee", alias: ["baldeggersee"], lat: 47.2, lng: 8.26 },
  { key: "greifensee", name: "Greifensee", alias: ["greifensee"], lat: 47.35, lng: 8.68 },
  { key: "pfaffikon", name: "Pfäffikersee", alias: ["pfaffikersee", "pfaeffikersee"], lat: 47.35, lng: 8.78 },
  { key: "walensee", name: "Walensee", alias: ["walensee"], lat: 47.12, lng: 9.2 },
  { key: "sihlsee", name: "Sihlsee", alias: ["sihlsee"], lat: 47.13, lng: 8.78 },
  { key: "lauerz", name: "Lauerzersee", alias: ["lauerzersee"], lat: 47.03, lng: 8.6 },
  { key: "rotsee", name: "Rotsee", alias: ["rotsee"], lat: 47.07, lng: 8.31 },
  { key: "sarnen", name: "Sarnersee", alias: ["sarnersee"], lat: 46.87, lng: 8.21 },
  { key: "lungern", name: "Lungerersee", alias: ["lungerersee"], lat: 46.8, lng: 8.16 },
  { key: "maggiore", name: "Lago Maggiore", alias: ["lago maggiore", "langensee"], lat: 46.1, lng: 8.75 },
  { key: "upperlugano", name: "Luganersee", alias: ["luganersee", "lago di lugano", "ceresio"], lat: 46.0, lng: 9.0 },
  { key: "sils", name: "Silsersee", alias: ["silsersee", "lej da segl"], lat: 46.42, lng: 9.73 },
  { key: "silvaplana", name: "Silvaplanersee", alias: ["silvaplanersee"], lat: 46.45, lng: 9.79 },
  { key: "stmoritz", name: "St. Moritzersee", alias: ["st. moritzersee", "st moritzersee", "lej da san murezzan"], lat: 46.49, lng: 9.85 },
  { key: "oeschinensee", name: "Oeschinensee", alias: ["oeschinensee"], lat: 46.5, lng: 7.73 },
  { key: "joux", name: "Lac de Joux", alias: ["lac de joux"], lat: 46.63, lng: 6.28 },
  { key: "gruyere", name: "Lac de la Gruyère", alias: ["lac de la gruyere", "greyerzersee"], lat: 46.67, lng: 7.08 },
  { key: "klontalersee", name: "Klöntalersee", alias: ["klontalersee", "kloentalersee"], lat: 47.03, lng: 8.98 },
  { key: "bret", name: "Lac de Bret", alias: ["lac de bret"], lat: 46.52, lng: 6.77 },
];

export const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

export function lakeFor(body: string | undefined) {
  if (!body) return undefined;
  const b = norm(body);
  return LAKES.find((l) => norm(l.name) === b || l.alias.some((a) => b === a || b.includes(a)));
}

/** Badetemperatur grob einordnen */
export function waterFeel(t: number) {
  if (t >= 24) return "badewannenwarm";
  if (t >= 20) return "angenehm";
  if (t >= 17) return "frisch";
  if (t >= 12) return "kalt";
  return "eisig";
}
