import { Suspense } from "react";
import type { Metadata } from "next";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import MysteryTrip from "@/components/MysteryTrip";
import Brotkrumen from "@/components/Brotkrumen";

const TITLE = "Überraschungs-Ausflug – Ziel auslosen, erst am Bahnhof erfahren";
const DESC =
  "Startort, Tag und Budget wählen – wir losen ein Ausflugsziel aus, das an dem Tag Wetter und Zug passt. Ihr erfahrt nur Abfahrt, Gleis und Packliste. Auch zum Verschenken.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/ausfluege/ueberraschung" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/ausfluege/ueberraschung" }),
};

export default function UeberraschungPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflüge", path: "/ausfluege" }, { name: "Überraschung", path: "/ausfluege/ueberraschung" }])) }}
      />
      <Brotkrumen items={[{ label: "Ausflüge", href: "/ausfluege" }, { label: "Überraschung" }]} />
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">
        Wohin? <em>Sagen wir nicht.</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Ihr wählt Startort, Tag und Budget. Wir losen ein Ziel aus, bei dem an diesem Tag Wetter und Zugverbindung passen –
        und verraten euch nur, wann ihr an welchem Gleis stehen müsst und was in den Rucksack gehört.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-cream-dim">Lädt …</p>}>
          <MysteryTrip />
        </Suspense>
      </div>
    </div>
  );
}
