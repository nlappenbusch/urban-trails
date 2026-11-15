import type { Metadata } from "next";
import Link from "next/link";
import { Wand2 } from "lucide-react";
import { trips } from "@/lib/ausfluege";
import { toTripLite } from "@/lib/ausfluege-view";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import { getTourHeroImage } from "@/data/images";
import TripExplorer from "@/components/TripExplorer";
import AusflugTools from "@/components/AusflugTools";

const TITLE = "Ausflüge in der Schweiz – fertig geplante Tagesausflüge und Wochenenden";
const DESC =
  "Tagesausflug oder Wochenende in Luzern, Solothurn, Thun, Lugano, Bern oder Rapperswil: Programme mit Uhrzeit, echten Restaurants und Hotels, Audio-Stadtrundgang und Plan B für Regen.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/ausfluege" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/ausfluege", image: getTourHeroImage("luzern-klassiker") }),
};

export default function AusfluegePage() {
  const lite = trips.map(toTripLite);
  return (
    <div className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflüge", path: "/ausfluege" }]),
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: trips.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/ausfluege/${t.slug}`, name: t.title })),
            },
          ]),
        }}
      />
      <p className="kicker">Ausflüge & Wochenenden</p>
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">
        Ausflüge, <em>fertig geplant.</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Kein Katalog mit tausend Ausflugszielen, sondern Programme, die aufgehen: mit Uhrzeit, Tisch und Bett,
        einer Audio-Tour durch die Stadt – und einem Plan B, falls es regnet. Ein Klick, und alles steht in deinem Kalender.
      </p>

      <div className="mt-8">
        <AusflugTools />
      </div>

      <div className="mt-12">
        <TripExplorer trips={lite} />
      </div>

      <section className="card mt-14 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-800 text-signal-600"><Wand2 size={20} aria-hidden /></span>
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Lieber selbst zusammenstellen?</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-cream-dim">
              Sag, wie lange, mit wem und worauf ihr Lust habt – der Planer baut dein Programm aus unseren geprüften Orten. Auch für Regen.
            </p>
          </div>
        </div>
        <Link href="/ausfluege/planen" className="btn-primary shrink-0 justify-center">Programm planen</Link>
      </section>
    </div>
  );
}
