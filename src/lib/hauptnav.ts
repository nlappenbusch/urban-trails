/** Vier Hauptpunkte (Kopf auf dem Desktop, Daumenleiste auf dem Handy) und alles Weitere unter «Mehr». */

export type TabKey = "ziele" | "touren" | "kalender" | "merkliste";

export const TABS: { key: TabKey; href: string; label: string; short: string }[] = [
  { key: "ziele", href: "/rubriken", label: "Ausflugsziele", short: "Ziele" },
  { key: "touren", href: "/touren", label: "Audio-Touren", short: "Touren" },
  { key: "kalender", href: "/feste", label: "Kalender", short: "Kalender" },
  { key: "merkliste", href: "/merkliste", label: "Merkliste", short: "Merkliste" },
];

export const MEHR: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Ausflüge planen",
    links: [
      { href: "/ausfluege/heute", label: "Heute los – mit Zug und Wetter" },
      { href: "/ausfluege", label: "Fertig geplante Ausflüge" },
      { href: "/ausflug", label: "Nach Anlass und Monat" },
      { href: "/ueberrasche-mich", label: "Überrasch mich" },
    ],
  },
  {
    title: "Saison",
    links: [
      { href: "/weihnachtsmaerkte", label: "Weihnachtsmärkte" },
      { href: "/schlitteln", label: "Schlittelwege" },
      { href: "/skigebiete", label: "Skigebiete" },
      { href: "/wassertemperaturen", label: "Wassertemperaturen" },
    ],
  },
  {
    title: "Städte",
    links: [
      { href: "/destinationen", label: "Destinationen" },
      { href: "/kategorien", label: "Touren nach Thema" },
      { href: "/fuehrung", label: "Mit Guide" },
      { href: "/konto", label: "Spielstand & Konto" },
    ],
  },
];

export function activeTab(p: string): TabKey | undefined {
  if (p === "/" || p.startsWith("/rubriken") || p.startsWith("/ziel/") || p.startsWith("/ausflugsziele") || p.startsWith("/ausflug/") || p === "/ausflug") return "ziele";
  if (p.startsWith("/touren") || p.startsWith("/destinationen") || p.startsWith("/kategorien")) return "touren";
  if (p.startsWith("/feste")) return "kalender";
  if (p.startsWith("/merkliste")) return "merkliste";
  return undefined;
}
