import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tours, getTour, formatDuration, totalWalkMinutes, moodLabels } from "@/lib/tours";
import { tourJsonLd } from "@/lib/seo";
import TourMap from "@/components/TourMap";
import StopTimeline from "@/components/StopTimeline";
import GuideChat from "@/components/GuideChat";
import { getTourHeroImage } from "@/data/images";
import { getDestination } from "@/data/destinations";
import { getCategory } from "@/lib/categories";
import Link from "next/link";

interface Props {
  params: Promise<{ city: string; tour: string }>;
}

export function generateStaticParams() {
  return tours.map((t) => ({ city: t.citySlug, tour: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, tour: tourSlug } = await params;
  const tour = getTour(city, tourSlug);
  if (!tour) return {};
  return {
    title: tour.seo.metaTitle,
    description: tour.seo.metaDescription,
    keywords: tour.seo.keywords,
    alternates: { canonical: `/${tour.citySlug}/${tour.slug}` },
    openGraph: {
      title: tour.seo.metaTitle,
      description: tour.seo.metaDescription,
      type: "article",
    },
  };
}

export default async function TourPage({ params }: Props) {
  const { city, tour: tourSlug } = await params;
  const tour = getTour(city, tourSlug);
  if (!tour) notFound();

  const hiddenGems = tour.stops.filter((s) => s.isHiddenGem).length;
  const jsonLd = tourJsonLd(tour);
  const hero = getTourHeroImage(tour.slug);
  const dest = getDestination(tour.citySlug);
  const cat = tour.category ? getCategory(tour.category) : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${tour.gradient[0]}, ${tour.gradient[1]} 130%)`,
        }}
      >
        {hero && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hero.url}
            alt={hero.alt}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="container-page relative py-20">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70">
            <Link href="/destinationen" className="hover:text-white">
              Destinationen
            </Link>
            <span aria-hidden="true">›</span>
            <Link href={`/${tour.citySlug}`} className="hover:text-white">
              {dest?.name ?? tour.citySlug}
            </Link>
            {cat && (
              <>
                <span aria-hidden="true">·</span>
                <Link
                  href={`/kategorien/${cat.slug}`}
                  className="hover:text-white"
                >
                  {cat.emoji} {cat.name}
                </Link>
              </>
            )}
          </nav>
          <div className="flex flex-wrap gap-2">
            {tour.isPremium ? (
              <span className="stamp-orange">
                Premium · CHF {tour.priceChf?.toFixed(2)}
              </span>
            ) : (
              <span className="stamp">Gratis-Tour</span>
            )}
            {tour.moods.map((m) => (
              <span key={m} className="chip border-white/40 bg-black/40 text-white backdrop-blur">
                {moodLabels[m]}
              </span>
            ))}
          </div>
          <h1 className="headline mt-5 max-w-3xl text-4xl text-white sm:text-6xl">
            {tour.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg italic text-white/80">
            «{tour.claim}»
          </p>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Dauer", value: formatDuration(tour.durationMinutes) },
              { label: "Distanz", value: `${tour.distanceKm} km` },
              { label: "Stops", value: String(tour.stops.length) },
              {
                label: "Gehzeit",
                value: formatDuration(totalWalkMinutes(tour)),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-black/30 p-4 backdrop-blur"
              >
                <dt className="kicker text-white/60">{s.label}</dt>
                <dd className="mt-1 font-display text-xl text-white">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-page pb-24 pt-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-lg leading-relaxed text-cream-dim">
              {tour.description}
            </p>
            {hiddenGems > 0 && (
              <p className="mt-4 text-sm font-bold text-signal-400">
                💎 {hiddenGems} Geheimtipp-Stops, die in keinem
                Standard-Reiseführer stehen.
              </p>
            )}
          </div>
          <aside className="card h-fit space-y-4 p-6 text-sm">
            <div>
              <p className="font-semibold text-cream">🚏 Start</p>
              <p className="text-cream-dim">{tour.startPoint}</p>
              <p className="mt-1 text-xs text-cream-faint">
                {tour.publicTransport.start}
              </p>
            </div>
            <div>
              <p className="font-semibold text-cream">🏁 Ende</p>
              <p className="text-cream-dim">{tour.endPoint}</p>
              <p className="mt-1 text-xs text-cream-faint">
                {tour.publicTransport.end}
              </p>
            </div>
            <div>
              <p className="font-semibold text-cream">🕐 Beste Zeit</p>
              <p className="text-cream-dim">{tour.bestTimeOfDay}</p>
            </div>
            <div>
              <p className="font-semibold text-cream">🍂 Saison</p>
              <p className="text-cream-dim">{tour.bestSeason}</p>
            </div>
            <div>
              <p className="font-semibold text-cream">⛰ Schwierigkeit</p>
              <p className="capitalize text-cream-dim">{tour.difficulty}</p>
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="headline text-3xl text-cream sm:text-4xl">Die <em>Route</em></h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {tour.stops.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group inline-flex items-center gap-1.5 rounded-full border border-cream/15 bg-ink-900 py-1 pl-1 pr-3 text-sm font-semibold text-cream-dim transition hover:border-signal-500 hover:text-cream"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-signal-500 font-display text-[11px] font-extrabold text-white">
                  {i + 1}
                </span>
                {s.name}
              </a>
            ))}
          </div>
          <div className="mt-6">
            <TourMap stops={tour.stops} gradient={tour.gradient} />
          </div>
        </section>

        <section className="mt-14">
          <GuideChat citySlug={tour.citySlug} tourSlug={tour.slug} />
        </section>

        <section className="mt-16">
          <h2 className="headline text-3xl text-cream sm:text-4xl">
            Stop für <em>Stop</em>
          </h2>
          <p className="mt-2 max-w-xl text-sm text-cream-dim">
            Mit Gehzeiten, Wegbeschreibung, Stories und Audioguide – lies vor
            Ort oder hör einfach zu.
          </p>
          <div className="mt-10">
            <StopTimeline tour={tour} />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="headline text-3xl text-cream sm:text-4xl">Häufige <em>Fragen</em></h2>
          <div className="mt-6 space-y-3">
            {tour.faq.map((f) => (
              <details key={f.question} className="card group p-5">
                <summary className="cursor-pointer font-semibold text-cream marker:text-signal-400">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
