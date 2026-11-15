import type { Metadata } from "next";
import Link from "next/link";
import { Moon } from "lucide-react";
import { LIVE_ON, skiRows } from "@/lib/ski";
import { kmOpen } from "@/lib/ski-core";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import SkiFinder from "@/components/SkiFinder";

// Live-Status bei jedem Aufruf frisch (die Quellen sind intern 15–60 Min. gecacht)
export const dynamic = "force-dynamic";

const TITLE = "Skigebiete Schweiz: Welche sind offen? Offene Pisten-km live";
const DESC = "Welche Skigebiete sind heute offen? Offene Pisten-km je Farbe, Anlagen, Schneehöhe (SLF), Tageskarte und Anreise mit Zug oder Auto ab deinem Ort – filterbar, dazu freie Hotels.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/skigebiete" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/skigebiete" }),
};

export default async function SkiPage() {
  const rows = await skiRows();
  const open = rows.filter((r) => r.live?.status === "open");
  const km = open.reduce((s, r) => s + (kmOpen(r).open ?? 0), 0);
  const deepest = [...rows].filter((r) => r.snow).sort((a, b) => b.snow!.cm - a.snow!.cm)[0];
  const today = new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Zurich" });
  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Skigebiete", path: "/skigebiete" }])) }} />
      <p className="kicker">{LIVE_ON ? `Live · ${today}` : "Skigebiete Schweiz"}</p>
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">Wo kann ich skifahren?</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {LIVE_ON
          ? open.length
            ? `Heute sind ${open.length} von ${rows.length} Skigebieten offen – mit zusammen rund ${Math.round(km)} km Piste.`
            : `Heute ist noch keines der ${rows.length} Skigebiete offen – die Saison startet bald.`
          : `${rows.length} Skigebiete mit Pisten je Farbe, Tageskarte und Anreise.`}
        {deepest && ` Am meisten Schnee: ${deepest.name} mit ${deepest.snow!.cm} cm.`}
        {" "}Wähl deinen Startort, Zug oder Auto – wir rechnen die Anreise.
      </p>
      <p className="mt-4">
        <Link href="/nachtskifahren" className="inline-flex items-center gap-1.5 text-sm font-bold text-signal-600 hover:text-signal-500"><Moon size={15} aria-hidden /> Nachtskifahren: wann und wo abends Pisten beleuchtet sind</Link>
      </p>
      <div className="mt-10">
        <SkiFinder rows={rows} live={LIVE_ON} />
      </div>
      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Schneehöhen: WSL-Institut für Schnee- und Lawinenforschung SLF, Messnetz IMIS (CC BY 4.0), nächstgelegene Station.
        {LIVE_ON && " Pisten- und Anlagenstatus: LiftRadar (liftradar.eu), aus den Berichten der Bergbahnen."}
        {" "}Pisten-km und Preise laut Bergbahnen, ohne Gewähr – vor der Abfahrt den offiziellen Pistenbericht prüfen. Zug: transport.opendata.ch; Autozeit grob geschätzt, Route über Google Maps.
      </p>
    </div>
  );
}
