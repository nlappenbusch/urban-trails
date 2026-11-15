import { Suspense } from "react";
import type { Metadata } from "next";
import { trips } from "@/lib/ausfluege";
import { toTripLite } from "@/lib/ausfluege-view";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import GiftCard, { type GiftTrip } from "@/components/GiftCard";

const TITLE = "Ausflug verschenken – Gutschein zum Ausdrucken, gratis";
const DESC =
  "Einen fertig geplanten Ausflug oder einen Überraschungs-Ausflug verschenken: Karte mit persönlichem Text und QR-Code zum Programm – ausdrucken oder als Link schicken. Kostenlos.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/geschenk" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/geschenk" }),
};

export default function GeschenkPage() {
  const list: GiftTrip[] = trips
    .map(toTripLite)
    .map((t) => ({ slug: t.slug, title: t.title, teaser: t.teaser, regionName: t.regionName, days: t.days, img: t.hero?.small }))
    .sort((a, b) => a.regionName.localeCompare(b.regionName, "de"));
  return (
    <div className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflug verschenken", path: "/geschenk" }])) }}
      />
      <div className="print:hidden">
        <p className="kicker">Geschenkidee</p>
        <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">
          Einen Tag <em>verschenken.</em>
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
          Statt Gutschein mit Betrag: ein Ausflug, der schon geplant ist. Auf der Karte steht euer Text, der QR-Code führt zum Programm –
          mit Zug ab Haustür und Wetter am Tag.
        </p>
      </div>
      <div className="mt-10">
        <Suspense fallback={<p className="text-cream-dim">Lädt …</p>}>
          <GiftCard trips={list} />
        </Suspense>
      </div>
    </div>
  );
}
