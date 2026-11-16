/**
 * Seiten quer über alle Rubriken: nach Anlass (mit Kindern, bei Regen, mit Hund) und nach Monat.
 * Grundlage sind die Merkmale in RUBRIKEN (familie, regenfest, hund, monate) – keine Einzelbehauptungen pro Ort.
 */
import { RUBRIKEN, inSaison, type Rubrik } from "@/lib/rubriken-core";

export interface Anlass {
  slug: string;
  kind: "thema" | "monat";
  /** «mit Kindern», «im Dezember» */
  label: string;
  title: string;
  intro: string;
  hinweis?: string;
  rubriken: Rubrik[];
  /** Slug der regionalen Themenseite (/ausflugsziele/<region>/<slug>), falls es eine gibt */
  regional?: string;
  monat?: number;
}

export const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const MONAT_SLUG = ["januar", "februar", "maerz", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "dezember"];

const MONAT_TEXT = [
  "Der Januar gehört dem Schnee: Loipen sind gespurt, Winterwege gepfadet, und auf den Eisbahnen ist am Nachmittag am meisten los. Wenn es grau bleibt, wärmen Thermen und Museen.",
  "Sportferien: Skigebiete und Schlittelwege sind voll, die Tage werden spürbar länger. Wer Ruhe sucht, nimmt einen Schneeschuhtrail oder eine Loipe abseits der grossen Orte.",
  "Oben noch Winter, unten schon Frühling – am Vormittag Firn, am Nachmittag ein Spaziergang am See. Viele Eisbahnen schliessen, Thermen, Höhlen und Museen bleiben offen.",
  "Die Saison dreht: Schiffe fahren wieder öfter, in den Tierparks gibt es Nachwuchs, die ersten Sommerrodelbahnen öffnen. In den Bergen liegt oft noch Schnee.",
  "Wasserfälle führen jetzt am meisten Wasser, weil weiter oben der Schnee schmilzt. Themenwege und Aussichtstürme passen gut, bevor es heiss wird.",
  "Lange Abende: Die Klettersteige gehen auf, Seilparks und Rodelbahnen laufen bis in den Abend, und die ersten Seen sind warm genug zum Baden.",
  "Hochsommer: Seen und Flüsse sind am wärmsten, oben auf dem Berg ist es kühler. Bergbahnen und Schiffe fahren den dichtesten Fahrplan des Jahres.",
  "Warme Seen und volle Schiffe: Badestellen, Rundfahrten und Klettersteige haben Hochsaison. Bei Gewitterlage am Nachmittag besser früh los.",
  "Klare Fernsicht und weniger Leute – der beste Monat für Aussichtstürme, Bergbahnen und Klettersteige. Die meisten Sommerangebote laufen noch.",
  "Herbstfarben unten, oft Nebel im Tal: Wer hochfährt, steht nicht selten über dem Nebelmeer. Gegen Monatsende schliessen viele Sommerangebote, die ersten Eisbahnen öffnen.",
  "Nebelmonat: Museen, Höhlen, Thermen und Kletterhallen tragen den November. Gegen Ende des Monats öffnen die ersten Weihnachtsmärkte, auf den Eisbahnen läuft der Betrieb.",
  "Weihnachtsmärkte, die ersten offenen Pisten und Eisfelder unter freiem Himmel. Wenn genug Schnee liegt, öffnen die Schlittelwege – Lage vor der Fahrt prüfen.",
];

/** Saisonseiten, die wir schon haben – pro Monat verlinkt */
export const SAISON_LINKS: { href: string; label: string; text: string; monate: number[] }[] = [
  { href: "/weihnachtsmaerkte", label: "Weihnachtsmärkte", text: "Welcher Markt heute offen hat – mit Zug ab deinem Ort.", monate: [11, 12] },
  { href: "/schlitteln", label: "Schlittelwege", text: "Länge, Höhenmeter, Bahn hoch und Haltestelle unten.", monate: [12, 1, 2, 3] },
  { href: "/skigebiete", label: "Skigebiete", text: "Schneehöhe, offene Pisten und Anreise mit dem ÖV.", monate: [12, 1, 2, 3, 4] },
  { href: "/nachtskifahren", label: "Nachtskifahren", text: "Beleuchtete Pisten und Schlittelwege nach Feierabend.", monate: [12, 1, 2, 3] },
  { href: "/wassertemperaturen", label: "Wassertemperaturen", text: "Wie warm Seen und Flüsse heute sind – mit Badestellen.", monate: [5, 6, 7, 8, 9] },
];

const THEMEN_ANLASS: Anlass[] = [
  {
    slug: "mit-kindern",
    kind: "thema",
    label: "mit Kindern",
    title: "Ausflugsziele mit Kindern in der Schweiz",
    intro: "Orte, an denen Kinder selbst etwas tun: rutschen, klettern, rodeln, Tiere anschauen, Schlittschuh laufen. Eine Rubrik pro Art, jede mit Karte und Entfernung ab deiner Haltestelle.",
    hinweis: "Altersgrenzen und Preise legt jeder Anbieter selbst fest – sie stehen auf der verlinkten Website. Klettersteige fehlen hier mit Absicht.",
    rubriken: RUBRIKEN.filter((r) => r.familie),
    regional: "mit-kindern",
  },
  {
    slug: "bei-regen",
    kind: "thema",
    label: "bei Regen",
    title: "Ausflugsziele bei Regen in der Schweiz",
    intro: "Alles mit Dach: Museen, Schauhöhlen, Erlebnisbäder, Thermen und Kletterhallen. Wenn es draussen nicht geht, ist das die Liste – nach Nähe sortierbar auf jeder Rubrikseite.",
    hinweis: "Höhlen sind innen trocken, aber kühl – eine Jacke gehört auch im Sommer mit.",
    rubriken: RUBRIKEN.filter((r) => r.regenfest),
    regional: "regen",
  },
  {
    slug: "mit-hund",
    kind: "thema",
    label: "mit Hund",
    title: "Ausflüge mit Hund in der Schweiz",
    intro: "Ziele draussen, zu denen der Hund mitkommt: Burgruinen, Wasserfälle, Aussichtstürme, Themenwege, Winterwanderwege – und Bergbahnen und Schiffe, in denen Hunde mitfahren dürfen.",
    hinweis: "In Bahn, Bus und Schiff braucht ein Hund über 30 cm Schulterhöhe ein eigenes Billett. Auf Weiden mit Mutterkühen und in Naturschutzgebieten gilt Leinenpflicht. Museen, Thermen und Hallen lassen Hunde meist nicht hinein – sie fehlen deshalb hier. Bei einzelnen Aussichtstürmen mit Gitterrost-Treppen tragen viele ihren Hund.",
    rubriken: RUBRIKEN.filter((r) => r.hund),
  },
  {
    slug: "schulreise",
    kind: "thema",
    label: "für Schulreisen",
    title: "Schulreise und Gruppenausflug: Ziele in der ganzen Schweiz",
    intro: "Ziele, die eine Klasse, einen Verein oder eine Firmengruppe einen Tag lang tragen: Höhlen mit Führung, Burgen zum Hochsteigen, Tierparks, Seilparks, Schiff und Bergbahn. Auf jeder Rubrikseite nach Entfernung ab eurer Haltestelle sortierbar.",
    hinweis: "Im öffentlichen Verkehr fahren Gruppen ab 10 Personen mit Gruppenbillett günstiger; Schulklassen melden die Reise am besten früh an, damit Plätze reserviert werden. Führungen in Höhlen und Museen und Gruppentarife bei Bahnen, Schiffen und Seilparks stehen auf der Website des Anbieters – oft nur mit Voranmeldung.",
    rubriken: ["hoehlen", "burgen-schloesser", "tierparks", "seilparks", "themenwege", "schifffahrten", "bergbahnen", "museen", "wasserfaelle", "freizeitparks", "rodelbahnen", "bikeparks", "aussichtstuerme", "kletterhallen"].map((s) => RUBRIKEN.find((r) => r.slug === s)!).filter(Boolean),
  },
];

const MONAT_ANLASS: Anlass[] = MONATE.map((m, i) => ({
  slug: `im-${MONAT_SLUG[i]}`,
  kind: "monat" as const,
  label: `im ${m}`,
  title: `Ausflug im ${m}: was jetzt in der Schweiz Saison hat`,
  intro: MONAT_TEXT[i],
  rubriken: RUBRIKEN.filter((r) => inSaison(r, i + 1)).sort((a, b) => Number(Boolean(b.monate)) - Number(Boolean(a.monate))),
  monat: i + 1,
}));

export const ANLAESSE: Anlass[] = [...THEMEN_ANLASS, ...MONAT_ANLASS];
export const getAnlass = (slug: string) => ANLAESSE.find((a) => a.slug === slug);
export const themenAnlaesse = () => THEMEN_ANLASS;
export const monatsAnlaesse = () => MONAT_ANLASS;

/** aktueller Monat in der Schweiz (1–12) */
export function monatJetzt(d = new Date()) {
  return Number(new Intl.DateTimeFormat("de-CH", { timeZone: "Europe/Zurich", month: "numeric" }).format(d));
}
export const monatSlug = (m: number) => `im-${MONAT_SLUG[m - 1]}`;
