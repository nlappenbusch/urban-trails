/**
 * Themen-Seiten für Google: «Ausflug Basel bei Regen», «… mit Kindern» usw.
 * Erzeugt aus der Ortsdatenbank – eine Seite nur, wenn genug passende Orte da sind.
 */
import { places, trips, allRegions, type Place, type Trip } from "@/lib/ausfluege";

export interface Thema {
  slug: string;
  label: string; // «bei Regen»
  title: (region: string) => string;
  intro: (region: string) => string;
  match: (p: Place) => boolean;
  tripMatch: (t: Trip) => boolean;
  plan: { days: number; audience: string; moods: string[]; rain: boolean; budget: number };
  faq: (region: string, names: string[]) => { q: string; a: string };
}

const ACTIVE: Place["kind"][] = ["aktivitaet", "sehenswuerdigkeit", "aussicht", "bad"];
const cheap = (p: Place) => p.priceInfo !== undefined && p.priceInfo.from <= 20;
const list = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} und ${names[names.length - 1]}` : names[0] ?? "");

export const THEMEN: Thema[] = [
  {
    slug: "regen",
    label: "bei Regen",
    title: (r) => `Ausflug ${r} bei Regen`,
    intro: (r) => `Regen in ${r}? Kein Grund, zu Hause zu bleiben. Hier sind Orte mit Dach, die wir geprüft haben – mit Preisen, Öffnungszeiten und einem fertigen Programm für einen nassen Tag.`,
    match: (p) => ACTIVE.includes(p.kind) && Boolean(p.weatherProof),
    tripMatch: () => true,
    plan: { days: 1, audience: "paar", moods: ["kultur"], rain: true, budget: 3 },
    faq: (r, n) => ({ q: `Was kann man in ${r} bei Regen machen?`, a: `Bei Regen lohnen sich in ${r} zum Beispiel ${list(n.slice(0, 4))}. Alle haben ein Dach und sind auf Urban Trails mit Preisen und Öffnungszeiten beschrieben.` }),
  },
  {
    slug: "mit-kindern",
    label: "mit Kindern",
    title: (r) => `Ausflug ${r} mit Kindern`,
    intro: (r) => `Familientag in ${r}: Orte, an denen Kinder nicht nur mitlaufen, sondern selbst etwas erleben – mit Eintrittspreisen und einem Programm, das auf kurze Beine Rücksicht nimmt.`,
    match: (p) => p.tags.includes("familie") && p.kind !== "bar" && p.kind !== "hotel",
    tripMatch: (t) => t.audience.includes("familie"),
    plan: { days: 1, audience: "familie", moods: ["familie"], rain: false, budget: 2 },
    faq: (r, n) => ({ q: `Was kann man mit Kindern in ${r} unternehmen?`, a: `Mit Kindern in ${r} gut: ${list(n.slice(0, 4))}. Preise und Altersangaben stehen bei jedem Ort.` }),
  },
  {
    slug: "zu-zweit",
    label: "zu zweit",
    title: (r) => `Ausflug ${r} zu zweit`,
    intro: (r) => `Ein Tag oder ein Wochenende zu zweit in ${r}: Aussicht, gutes Essen und Orte mit Stimmung – ohne Kitsch, dafür mit Uhrzeit und Reservationstipp.`,
    match: (p) => (p.tags.includes("romantisch") || p.tags.includes("aussicht") || p.tags.includes("genuss")) && p.kind !== "hotel",
    tripMatch: (t) => t.audience.includes("paar"),
    plan: { days: 1, audience: "paar", moods: ["romantik", "genuss"], rain: false, budget: 3 },
    faq: (r, n) => ({ q: `Was kann man in ${r} zu zweit machen?`, a: `Zu zweit in ${r} empfehlen wir ${list(n.slice(0, 4))}.` }),
  },
  {
    slug: "guenstig",
    label: "günstig",
    title: (r) => `Günstiger Ausflug ${r}`,
    intro: (r) => `${r} muss nicht teuer sein: Diese Orte kosten nichts oder höchstens 20 Franken pro Person – Preise laut offiziellen Listen, keine Lockvogel-Angebote.`,
    match: (p) => cheap(p) && p.kind !== "hotel",
    tripMatch: () => false,
    plan: { days: 1, audience: "freunde", moods: [], rain: false, budget: 1 },
    faq: (r, n) => ({ q: `Was kann man in ${r} gratis oder günstig machen?`, a: `Gratis oder günstig in ${r}: ${list(n.slice(0, 5))}.` }),
  },
  {
    slug: "wochenende",
    label: "fürs Wochenende",
    title: (r) => `Wochenende in ${r}`,
    intro: (r) => `Zwei Tage ${r} mit Hotel, Abendessen und einem Programm, das nicht hetzt. Dazu die Hotels, die wir geprüft haben, mit Preis ab Doppelzimmer.`,
    match: (p) => p.kind === "hotel",
    tripMatch: (t) => t.days >= 2,
    plan: { days: 2, audience: "paar", moods: ["genuss", "kultur"], rain: false, budget: 3 },
    faq: (r, n) => ({ q: `Wo übernachten in ${r}?`, a: `Für ein Wochenende in ${r} haben wir ${list(n.slice(0, 3))} geprüft – vom günstigen bis zum besonderen Haus.` }),
  },
];

export const getThema = (slug: string) => THEMEN.find((t) => t.slug === slug);

export function themaPlaces(region: string, t: Thema) {
  return places.filter((p) => p.region === region && t.match(p));
}

export function themaTrips(region: string, t: Thema) {
  return trips.filter((x) => x.region === region && t.tripMatch(x));
}

/** Alle Kombinationen, die genug Inhalt haben (für Seiten + Sitemap). */
export function themaPages() {
  const out: { region: string; thema: string }[] = [];
  for (const r of allRegions()) {
    for (const t of THEMEN) {
      const n = themaPlaces(r.slug, t).length;
      if (t.slug === "wochenende" ? n >= 2 : n >= 4) out.push({ region: r.slug, thema: t.slug });
    }
  }
  return out;
}

export const regionPlaces = (region: string) => places.filter((p) => p.region === region);
