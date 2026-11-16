import type { Metadata } from "next";
import { Suspense } from "react";
import { places } from "@/lib/ausfluege";
import { planTours, plannerRegions } from "@/lib/ausfluege-view";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import Planner from "@/components/Planner";
import Brotkrumen from "@/components/Brotkrumen";

const TITLE = "Ausflugsplaner Schweiz – Tagesausflug oder Wochenende selbst zusammenstellen";
const DESC =
  "Ziel, Dauer, Begleitung und Stimmung wählen – der Planer baut dein Programm aus geprüften Restaurants, Hotels und Erlebnissen, inklusive Audio-Stadtrundgang und Regenprogramm.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/ausfluege/planen" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/ausfluege/planen" }),
};

export default function PlanenPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflüge", path: "/ausfluege" }, { name: "Planen", path: "/ausfluege/planen" }])) }}
      />
      <Brotkrumen items={[{ label: "Ausflüge", href: "/ausfluege" }, { label: "Selbst planen" }]} />
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">
        Dein Ausflug, <em>in zehn Sekunden.</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Ein paar Klicks, und du hast ein Programm mit Uhrzeiten – nur mit Orten, die wir geprüft haben. Jede Änderung
        baut es sofort neu, der Link merkt sich alles.
      </p>
      <div className="mt-10">
        <Suspense>
          <Planner regions={plannerRegions()} places={places} tours={planTours()} />
        </Suspense>
      </div>
    </div>
  );
}
