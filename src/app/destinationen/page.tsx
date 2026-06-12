import type { Metadata } from "next";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { getToursByCity } from "@/lib/tours";

export const metadata: Metadata = {
  title: "Alle Destinationen – Walking-Touren durch die Schweiz",
  description:
    "Von Zürich bis Lugano: Alle Städte und Städtchen mit selbstgeführten Urban-Trails-Touren – Audio-Stories, Karten und Geheimtipps inklusive.",
  alternates: { canonical: "/destinationen" },
};

export default function DestinationsPage() {
  const live = destinations.filter((d) => !d.comingSoon);
  const soon = destinations.filter((d) => d.comingSoon);
  return (
    <div className="container-page py-16">
      <p className="kicker">Stadt für Stadt</p>
      <h1 className="headline mt-3 text-5xl text-cream sm:text-6xl">
        Alle <em>Destinationen</em>
      </h1>
      <p className="mt-4 max-w-xl text-cream-dim">
        {live.length} Städte und Städtchen live – jede mit mindestens einer
        komplett ausgearbeiteten Tour: Route, Audio-Stories, Karte,
        Geheimtipps.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {live.map((d) => {
          const cityTours = getToursByCity(d.slug);
          const gratis = cityTours.filter((t) => !t.isPremium).length;
          return (
            <Link
              key={d.slug}
              href={`/${d.slug}`}
              className="card group p-6 transition hover:-translate-y-1 hover:border-cream/25"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream group-hover:text-signal-500">
                  {d.name}
                </h2>
                <span className="chip shrink-0">{d.canton}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                {d.teaser}
              </p>
              <p className="mt-4 text-xs font-bold text-signal-600">
                {cityTours.length} {cityTours.length === 1 ? "Tour" : "Touren"}
                {gratis > 0 && ` · ${gratis} gratis`}
              </p>
            </Link>
          );
        })}
      </div>

      {soon.length > 0 && (
        <>
          <h2 className="headline mt-16 text-3xl text-cream">
            Bald <em>unterwegs</em>
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {soon.map((d) => (
              <span key={d.slug} className="chip py-2 opacity-60" title={d.teaser}>
                {d.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
