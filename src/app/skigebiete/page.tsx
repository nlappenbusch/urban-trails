import type { Metadata } from "next";
import { LIVE_ON, skiRows } from "@/lib/ski";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import SkiFinder from "@/components/SkiFinder";

// Pistenberichte kommen zweimal am Tag, Schnee täglich – alle 15 Minuten neu bauen reicht
export const revalidate = 900;

const TITLE = "Skigebiete Schweiz: offene Pisten, Schnee und Anreise mit dem Zug";
const DESC = "Welche Skigebiete sind offen? Pisten je Farbe, Anlagen, Schneehöhe (SLF), Tageskarte und Anreisezeit ab deinem Bahnhof – filterbar, dazu freie Hotels in deiner Preisspanne.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/skigebiete" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/skigebiete" }),
};

export default async function SkiPage() {
  const rows = await skiRows();
  const open = rows.filter((r) => r.live?.status === "open").length;
  const deepest = [...rows].filter((r) => r.snow).sort((a, b) => b.snow!.cm - a.snow!.cm)[0];
  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Skigebiete", path: "/skigebiete" }])) }} />
      <p className="kicker">{LIVE_ON ? "Live · Pistenbericht" : "Skigebiete Schweiz"}</p>
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">Wo kann ich skifahren?</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {rows.length} Skigebiete mit Pisten je Farbe, Tageskarte und Anreise ab deinem Bahnhof.
        {LIVE_ON && ` ${open} davon sind gerade offen.`}
        {deepest && ` Am meisten Schnee: ${deepest.name} mit ${deepest.snow!.cm} cm.`}
      </p>
      <div className="mt-10">
        <SkiFinder rows={rows} live={LIVE_ON} />
      </div>
      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Schneehöhen: WSL-Institut für Schnee- und Lawinenforschung SLF, Messnetz IMIS (CC BY 4.0), nächstgelegene Station.
        {LIVE_ON && " Pisten- und Anlagenstatus: LiftRadar (liftradar.eu), aus den Berichten der Bergbahnen."}
        {" "}Pisten-km und Preise laut Bergbahnen, ohne Gewähr – vor der Abfahrt den offiziellen Pistenbericht prüfen. Anreise: Fahrplan transport.opendata.ch.
      </p>
    </div>
  );
}
