/** Schweiz-Verzeichnis nach Rubriken – Typen und Texte (client-tauglich, ohne Daten). */

export interface RubrikItem {
  r: string;
  id: string;
  name: string;
  lat: number;
  lng: number;
  kt: string;
  ort?: string;
  web?: string;
  hours?: string;
  fee?: boolean;
  wheel?: boolean;
  height?: number;
  ele?: number;
  sub?: string;
  text?: string;
  desc?: string;
  wiki?: string;
  img?: { src: string; w: number; h: number; page: string; by?: string; lic?: string };
  q: number;
  /** Link zum geprüften Ort, wenn derselbe Ort auch in unserer Redaktion steht */
  ours?: string;
  /** in der Pflegeseite hervorgehoben */
  top?: boolean;
}

export interface Rubrik {
  slug: string;
  label: string; // «Tierparks & Zoos»
  one: string; // «Tierpark»
  many: string; // «Tierparks»
  claim: string;
  winter?: boolean;
  regenfest?: boolean;
}

export const RUBRIKEN: Rubrik[] = [
  { slug: "tierparks", label: "Tierparks & Zoos", one: "Tierpark", many: "Tierparks und Zoos", claim: "Vom Zoo Zürich bis zum Wildpark im Wald, Streichelzoos und Vogelwarten.", regenfest: false },
  { slug: "museen", label: "Museen", one: "Museum", many: "Museen", claim: "Grosse Häuser und kleine Ortsmuseen – mit Öffnungszeiten, wo bekannt.", regenfest: true },
  { slug: "burgen-schloesser", label: "Burgen & Schlösser", one: "Burg oder Schloss", many: "Burgen, Schlösser und Ruinen", claim: "Bewohnte Schlösser, Festungen und Burgruinen zum Hochsteigen." },
  { slug: "hoehlen", label: "Höhlen", one: "Höhle", many: "Höhlen", claim: "Schauhöhlen mit Führung und Höhlen, die man selbst betreten kann.", regenfest: true },
  { slug: "wasserfaelle", label: "Wasserfälle", one: "Wasserfall", many: "Wasserfälle", claim: "Vom Rheinfall bis zum Wasserfall hinter dem Dorf – mit Fallhöhe, wo bekannt." },
  { slug: "aussichtstuerme", label: "Aussichtstürme", one: "Aussichtsturm", many: "Aussichtstürme", claim: "Holz- und Stahltürme über dem Wald, meist gratis und ganzjährig offen." },
  { slug: "freizeitparks", label: "Freizeitparks", one: "Freizeitpark", many: "Freizeitparks", claim: "Achterbahnen, Rodelbahnen und Erlebnisparks für den ganzen Tag." },
  { slug: "erlebnisbaeder", label: "Erlebnisbäder", one: "Erlebnisbad", many: "Erlebnisbäder", claim: "Rutschen, Wellenbad und Thermen für Tage, an denen es draussen nicht geht.", regenfest: true },
  { slug: "seilparks", label: "Seilparks", one: "Seilpark", many: "Seilparks", claim: "Kletterparks im Wald mit Parcours für Kinder und Erwachsene." },
  { slug: "sternwarten", label: "Sternwarten", one: "Sternwarte", many: "Sternwarten und Planetarien", claim: "Öffentliche Sternwarten und Planetarien für klare Abende." },
  { slug: "minigolf", label: "Minigolf", one: "Minigolf", many: "Minigolfanlagen", claim: "Minigolf und Adventure-Golf, drinnen und draussen." },
];
export const getRubrik = (slug: string) => RUBRIKEN.find((r) => r.slug === slug);

export interface Kanton {
  ak: string;
  slug: string;
  name: string;
  im: string; // «im Kanton Zürich»
}
const K: [string, string, string][] = [
  ["ZH", "zuerich", "Zürich"], ["BE", "bern", "Bern"], ["LU", "luzern", "Luzern"], ["UR", "uri", "Uri"], ["SZ", "schwyz", "Schwyz"],
  ["OW", "obwalden", "Obwalden"], ["NW", "nidwalden", "Nidwalden"], ["GL", "glarus", "Glarus"], ["ZG", "zug", "Zug"], ["FR", "freiburg", "Freiburg"],
  ["SO", "solothurn", "Solothurn"], ["BS", "basel-stadt", "Basel-Stadt"], ["BL", "basel-landschaft", "Basel-Landschaft"], ["SH", "schaffhausen", "Schaffhausen"],
  ["AR", "appenzell-ausserrhoden", "Appenzell Ausserrhoden"], ["AI", "appenzell-innerrhoden", "Appenzell Innerrhoden"], ["SG", "st-gallen", "St. Gallen"],
  ["GR", "graubuenden", "Graubünden"], ["AG", "aargau", "Aargau"], ["TG", "thurgau", "Thurgau"], ["TI", "tessin", "Tessin"], ["VD", "waadt", "Waadt"],
  ["VS", "wallis", "Wallis"], ["NE", "neuenburg", "Neuenburg"], ["GE", "genf", "Genf"], ["JU", "jura", "Jura"],
];
export const KANTONE: Kanton[] = K.map(([ak, slug, name]) => ({ ak, slug, name, im: `im Kanton ${name}` }));
export const kantonByAk = (ak: string) => KANTONE.find((k) => k.ak === ak);
export const kantonBySlug = (slug: string) => KANTONE.find((k) => k.slug === slug);

const SUB: Record<string, string> = {
  wildlife_park: "Wildpark",
  petting_zoo: "Streichelzoo",
  falconry: "Falknerei",
  aviary: "Vogelpark",
  safari_park: "Safaripark",
  defensive: "Burg",
  stately: "Schloss",
  palace: "Palast",
  fortress: "Festung",
  castrum: "Kastell",
  history: "Geschichte",
  art: "Kunst",
  local: "Ortsmuseum",
  open_air: "Freilicht",
  transport: "Verkehr",
  technology: "Technik",
  railway: "Eisenbahn",
  military: "Militär",
  nature: "Natur",
  science: "Wissenschaft",
  children: "für Kinder",
  archaeological: "Archäologie",
  agriculture: "Landwirtschaft",
  mining: "Bergbau",
};
export const subLabel = (s?: string) => (s ? SUB[s] : undefined);

/** OSM-Öffnungszeiten lesbarer machen (ohne Anspruch auf Vollständigkeit). */
export function hoursText(h?: string) {
  if (!h) return undefined;
  if (h === "24/7") return "immer zugänglich";
  return h
    .replace(/\bMo\b/g, "Mo").replace(/\bTu\b/g, "Di").replace(/\bWe\b/g, "Mi").replace(/\bTh\b/g, "Do").replace(/\bFr\b/g, "Fr").replace(/\bSa\b/g, "Sa").replace(/\bSu\b/g, "So")
    .replace(/\bPH\b/g, "Feiertage").replace(/\boff\b/g, "zu").replace(/\bclosed\b/g, "zu")
    .replace(/\bJan\b/g, "Jan.").replace(/\bFeb\b/g, "Feb.").replace(/\bMar\b/g, "März").replace(/\bApr\b/g, "Apr.").replace(/\bMay\b/g, "Mai").replace(/\bJun\b/g, "Juni")
    .replace(/\bJul\b/g, "Juli").replace(/\bAug\b/g, "Aug.").replace(/\bSep\b/g, "Sept.").replace(/\bOct\b/g, "Okt.").replace(/\bNov\b/g, "Nov.").replace(/\bDec\b/g, "Dez.")
    .replace(/;\s*/g, " · ")
    .replace(/,/g, ", ");
}
