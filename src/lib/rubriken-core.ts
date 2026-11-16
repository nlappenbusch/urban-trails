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
  /** drinnen oder überdacht – taugt bei Regen */
  regenfest?: boolean;
  /** für Kinder gemacht */
  familie?: boolean;
  /** draussen, Hund kann mit (Leine, in Bahn und Schiff mit Hundebillett) */
  hund?: boolean;
  /** Hauptsaison (Monate 1–12); fehlt = ganzjährig */
  monate?: number[];
  /** Gruppe auf der Übersicht */
  gruppe: "sommer" | "winter" | "ganzjahr";
}

const SOMMER = [4, 5, 6, 7, 8, 9, 10];
const WINTER = [12, 1, 2, 3];

export const RUBRIKEN: Rubrik[] = [
  { slug: "tierparks", label: "Tierparks & Zoos", one: "Tierpark", many: "Tierparks und Zoos", claim: "Vom Zoo Zürich bis zum Wildpark im Wald, Streichelzoos und Vogelwarten.", familie: true, gruppe: "ganzjahr" },
  { slug: "museen", label: "Museen", one: "Museum", many: "Museen", claim: "Grosse Häuser und kleine Ortsmuseen – mit Öffnungszeiten, wo bekannt.", regenfest: true, gruppe: "ganzjahr" },
  { slug: "burgen-schloesser", label: "Burgen & Schlösser", one: "Burg oder Schloss", many: "Burgen, Schlösser und Ruinen", claim: "Bewohnte Schlösser, Festungen und Burgruinen zum Hochsteigen.", hund: true, gruppe: "ganzjahr" },
  { slug: "hoehlen", label: "Höhlen", one: "Höhle", many: "Höhlen", claim: "Schauhöhlen mit Führung und Höhlen, die man selbst betreten kann.", regenfest: true, gruppe: "ganzjahr" },
  { slug: "wasserfaelle", label: "Wasserfälle", one: "Wasserfall", many: "Wasserfälle", claim: "Vom Rheinfall bis zum Wasserfall hinter dem Dorf – mit Fallhöhe, wo bekannt.", hund: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "aussichtstuerme", label: "Aussichtstürme", one: "Aussichtsturm", many: "Aussichtstürme", claim: "Holz- und Stahltürme über dem Wald, meist gratis und ganzjährig offen.", hund: true, gruppe: "ganzjahr" },
  { slug: "freizeitparks", label: "Freizeitparks", one: "Freizeitpark", many: "Freizeitparks", claim: "Achterbahnen, Rodelbahnen und Erlebnisparks für den ganzen Tag.", familie: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "erlebnisbaeder", label: "Erlebnisbäder", one: "Erlebnisbad", many: "Erlebnisbäder", claim: "Rutschen, Wellenbad und Spassbecken für Tage, an denen es draussen nicht geht.", regenfest: true, familie: true, gruppe: "ganzjahr" },
  { slug: "seilparks", label: "Seilparks", one: "Seilpark", many: "Seilparks", claim: "Kletterparks im Wald mit Parcours für Kinder und Erwachsene.", familie: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "sternwarten", label: "Sternwarten", one: "Sternwarte", many: "Sternwarten und Planetarien", claim: "Öffentliche Sternwarten und Planetarien für klare Abende.", gruppe: "ganzjahr" },
  { slug: "minigolf", label: "Minigolf", one: "Minigolf", many: "Minigolfanlagen", claim: "Minigolf und Adventure-Golf, drinnen und draussen.", familie: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "rodelbahnen", label: "Sommerrodelbahnen", one: "Rodelbahn", many: "Sommerrodelbahnen und Alpine Coaster", claim: "Auf Schienen talwärts – vom Gurten bis zum Stuckli Run, die Bremse in der eigenen Hand.", familie: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "klettersteige", label: "Klettersteige", one: "Klettersteig", many: "Klettersteige", claim: "Drahtseil, Leitern und Hängebrücken – mit Schwierigkeit von K1 bis K6, wo eingetragen.", monate: [6, 7, 8, 9, 10], gruppe: "sommer" },
  { slug: "themenwege", label: "Themenwege", one: "Themenweg", many: "Themen- und Erlebniswege", claim: "Planetenwege, Sagenwege, Barfusswege und Lehrpfade – Wandern mit Geschichte unterwegs.", familie: true, hund: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "velorouten", label: "Velo & Mountainbike", one: "Veloroute", many: "Velo- und Mountainbike-Routen", claim: "Die signalisierten Routen von SchweizMobil, Etappe für Etappe – mit Start, Ziel und Länge.", hund: false, monate: SOMMER, gruppe: "sommer" },
  { slug: "bikeparks", label: "Pumptracks & Bikeparks", one: "Pumptrack", many: "Pumptracks, Bikeparks und BMX-Bahnen", claim: "Wellen und Steilkurven für Velo, Trottinett und Laufrad – die meisten frei zugänglich.", familie: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "schifffahrten", label: "Schifffahrten", one: "Schifffahrt", many: "Schifffahrten auf Seen und Flüssen", claim: "Raddampfer, Kursschiffe und Rheinfähren – von uns ausgewählt, mit Abfahrtsort.", familie: true, hund: true, monate: SOMMER, gruppe: "sommer" },
  { slug: "eisbahnen", label: "Eisbahnen", one: "Eisbahn", many: "Eisbahnen und Eishallen", claim: "Kunsteisbahnen, Eishallen und Eisfelder unter freiem Himmel – Schlittschuhe meist zum Mieten.", familie: true, monate: [10, 11, 12, 1, 2, 3], gruppe: "winter" },
  { slug: "langlauf", label: "Langlaufloipen", one: "Loipe", many: "Langlaufloipen", claim: "Loipen für klassisch und Skating, vom Dorfrundkurs bis zur Marathonloipe.", monate: WINTER, gruppe: "winter" },
  { slug: "winterwandern", label: "Winterwandern & Schneeschuh", one: "Winterweg", many: "Winterwanderwege und Schneeschuhtrails", claim: "Gepfadete Winterwege und markierte Schneeschuhtrails – ohne Ski in den Schnee.", hund: true, monate: WINTER, gruppe: "winter" },
  { slug: "iglu", label: "Iglus", one: "Iglu", many: "Iglu-Dörfer und Iglubau-Kurse", claim: "Im Iglu übernachten, an der Schneebar sitzen oder selbst eins bauen – von uns ausgewählt, mit Saison und Anreise.", familie: true, monate: WINTER, gruppe: "winter" },
  { slug: "schlittenhunde", label: "Schlittenhunde", one: "Hundeschlitten-Angebot", many: "Schlittenhundefahrten und Husky-Trekkings", claim: "Im Schlitten mitfahren oder mit Huskys durch den Schnee laufen – von uns ausgewählt, mit Startort.", familie: true, monate: WINTER, gruppe: "winter" },
  { slug: "helikopter", label: "Helikopter-Rundflüge", one: "Rundflug-Basis", many: "Basen für Helikopter-Rundflüge", claim: "Heliports, ab denen auch Privatpersonen mitfliegen – zum Matterhorn, zu Eiger, Mönch und Jungfrau oder übers Engadin.", gruppe: "ganzjahr" },
  { slug: "erlebnisgastro", label: "Erlebnis-Gastronomie", one: "Erlebnis-Restaurant", many: "Drehrestaurants, Fondue-Gondeln und besondere Restaurants", claim: "Essen, während sich das Restaurant dreht, die Gondel schwebt oder das Tram durch Zürich fährt – von uns ausgewählt.", regenfest: true, gruppe: "ganzjahr" },
  { slug: "bergbahnen", label: "Bergbahnen", one: "Bergbahn", many: "Standseil-, Luftseil- und Gondelbahnen", claim: "Von der Marzilibahn bis zur Säntisbahn – Standseilbahnen, Luftseilbahnen und Gondeln.", hund: true, gruppe: "ganzjahr" },
  { slug: "kletterhallen", label: "Klettern & Bouldern", one: "Kletterhalle", many: "Kletter- und Boulderhallen", claim: "Kletterhallen, Boulderräume und einige Klettergärten – Schuhe und Gurt meist zum Mieten.", regenfest: true, familie: true, gruppe: "ganzjahr" },
  { slug: "thermen", label: "Thermen & Wellness", one: "Therme", many: "Thermal- und Wellnessbäder", claim: "Thermalquellen von Baden bis Leukerbad, Solebäder und Hammams – warm bei jedem Wetter.", regenfest: true, gruppe: "ganzjahr" },
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
  halle: "Halle",
  freiluft: "unter freiem Himmel",
  "klassisch-skating": "klassisch + Skating",
  klassisch: "klassisch",
  skating: "Skating",
  schneeschuh: "Schneeschuhtrail",
  winterwanderweg: "Winterwanderweg",
  funicular: "Standseilbahn",
  cable_car: "Luftseilbahn",
  gondola: "Gondelbahn",
  therme: "Therme",
  hammam: "Hammam",
  spa: "Spa",
  dampfschiff: "auch Dampfschiff",
  velo: "Veloroute",
  mtb: "Mountainbike",
  pumptrack: "Pumptrack",
  bmx: "BMX-Bahn",
  bikepark: "Bikepark",
  dorf: "Iglu-Dorf",
  bar: "Iglu-Bar",
  bauen: "Iglu selbst bauen",
  fahrt: "Schlittenfahrt",
  trekking: "Husky-Trekking",
  drehrestaurant: "Drehrestaurant",
  fondue: "Fondue unterwegs",
  gipfel: "Gipfelrestaurant",
  besonders: "besonderer Ort",
};
export const subLabel = (s?: string) => (s ? SUB[s] ?? (/^K[1-6]/.test(s) ? `Schwierigkeit ${s}` : undefined) : undefined);

/** Rubriken, die im Monat m (1–12) Saison haben */
export const inSaison = (r: Rubrik, m: number) => !r.monate || r.monate.includes(m);

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
