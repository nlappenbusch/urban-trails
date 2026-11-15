import Link from "next/link";
import { tours } from "@/lib/tours";
import { destinations } from "@/data/destinations";
import { toTourLite } from "@/lib/tour-lite";
import HomeTours, { type CityChip } from "@/components/HomeTours";
import AudioPlayer from "@/components/AudioPlayer";
import { sceneFor } from "@/lib/scene";
import { getStopImage, getTourHeroImage } from "@/data/images";
import { siteJsonLd, socialMeta } from "@/lib/seo";
import type { Metadata } from "next";

const HOME_TITLE = "Urban Trails – kostenlose Stadtrundgänge mit Audioguide in der Schweiz";
const HOME_DESC =
  "Selbstgeführte Walking-Touren durch Zürich, Solothurn, Bern, Luzern, Basel und weitere Schweizer Städte: gratis, ohne App, mit Audio-Story, Navi und Rätsel an jedem Stopp.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESC,
  alternates: { canonical: "/" },
  ...socialMeta({ title: HOME_TITLE, description: HOME_DESC, path: "/", image: getTourHeroImage("zuerich-klassiker") }),
};

export default function HomePage() {
  const lite = tours.map(toTourLite);

  const cities: CityChip[] = destinations
    .filter((d) => !d.comingSoon)
    .map((d) => ({ slug: d.slug, name: d.name, count: lite.filter((t) => t.citySlug === d.slug).length }))
    .filter((c) => c.count > 0);

  // Ohne Stadtwahl: je Stadt die erste Tour, sechs Städte
  const featured = cities
    .slice(0, 6)
    .map((c) => lite.find((t) => t.citySlug === c.slug)!)
    .filter(Boolean);

  const sampleTour = tours.find((t) => t.slug === "hidden-zuerich");
  const sample = sampleTour?.stops.find((s) => s.id === "freitag-tower");
  const sampleImg = sample ? getStopImage(sample.id) : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <section className="container-page pb-6 pt-8 sm:pb-10 sm:pt-14">
        <h1 className="headline text-4xl text-cream sm:text-6xl">
          Die Stadt ist kein <em>Museum.</em>
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-cream-dim sm:mt-4 sm:text-lg">
          Selbstgeführte Spaziergänge durch {cities.length} Schweizer Städte – mit
          Audio-Story, Navi und Rätsel an jedem Stopp. Kostenlos, ohne App.
        </p>
      </section>

      <section className="container-page pb-16" aria-label="Touren">
        <HomeTours tours={lite} cities={cities} featured={featured} />
      </section>

      {sampleTour && sample && (
        <section className="border-t border-cream/10 bg-ink-900/60">
          <div className="container-page grid gap-8 py-14 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
                So klingt ein Stopp
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-cream-dim">
                Tour wählen, Kopfhörer rein, loslaufen. Das Navi führt dich von
                Stopp zu Stopp, dort erzählt dir eine Stimme in zwei Minuten, was
                hier passiert ist. Kein Download, kein Konto nötig – dein
                Fortschritt bleibt auf deinem Handy.
              </p>
            </div>
            <div className="card overflow-hidden">
              {sampleImg && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={sampleImg.url} alt={sampleImg.alt} loading="lazy" className="h-40 w-full object-cover sm:h-48" />
              )}
              <div className="p-5">
                <p className="font-display text-xl font-extrabold tracking-tight text-cream">{sample.name}</p>
                <p className="mt-1 text-sm text-cream-dim">
                  {sample.teaser}{" "}
                  <Link href={`/${sampleTour.citySlug}/${sampleTour.slug}`} className="font-semibold text-signal-600 hover:text-signal-500">
                    Tour «{sampleTour.name}»
                  </Link>
                </p>
                <div className="mt-4">
                  <AudioPlayer
                    citySlug={sampleTour.citySlug}
                    tourSlug={sampleTour.slug}
                    stopId={sample.id}
                    stopName={sample.name}
                    script={sample.audioScript}
                    audioFile={sample.audioFile}
                    scene={sceneFor(sample)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
