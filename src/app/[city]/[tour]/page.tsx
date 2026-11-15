import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tours, getTour, formatDuration, totalWalkMinutes, moodLabels } from "@/lib/tours";
import { tourJsonLd } from "@/lib/seo";
import TourMap from "@/components/TourMap";
import StopTimeline from "@/components/StopTimeline";
import GuideChat from "@/components/GuideChat";
import TourFacts from "@/components/TourFacts";
import { getTourHeroImage } from "@/data/images";
import { getDestination } from "@/data/destinations";
import { getCategory } from "@/lib/categories";
import Link from "next/link";
import { riddlesByTour } from "@/data/riddles";

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

  const guideEnabled = Boolean(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith("sk-your"));
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
        <div className="container-page relative py-8 sm:py-14">
          {/* Breadcrumb */}
          <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70">
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
                  {cat.name}
                </Link>
              </>
            )}
          </nav>
          <h1 className="headline max-w-3xl text-4xl text-white sm:text-6xl">
            {tour.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base italic text-white/80 sm:text-lg">
            «{tour.claim}»
          </p>

          <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white">
            {[
              { label: "Dauer", value: formatDuration(tour.durationMinutes) },
              { label: "Distanz", value: `${tour.distanceKm} km` },
              { label: "Stopps", value: String(tour.stops.length) },
              { label: "Gehzeit", value: formatDuration(totalWalkMinutes(tour)) },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <dt className="text-white/60">{s.label}</dt>
                <dd className="font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
          {tour.moods.length > 0 && (
            <p className="mt-2 text-sm text-white/70">
              {tour.moods.map((m) => moodLabels[m]).join(" · ")}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#navi" className="btn-primary">Navi starten</a>
            <a href="#tourstart" className="text-sm font-bold text-white underline-offset-4 hover:underline">Stopps ansehen</a>
            <Link href={`/unterwegs/${tour.citySlug}/${tour.slug}`} className="text-sm font-bold text-white underline-offset-4 hover:underline">Offline & GPS</Link>
          </div>
        </div>
      </section>

      <div className="container-page pb-16 pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-lg leading-relaxed text-cream-dim">
              {tour.description}
            </p>
            {hiddenGems > 0 && (
              <p className="mt-4 text-sm font-bold text-signal-600">
                {hiddenGems} {hiddenGems === 1 ? "Stopp ist ein Geheimtipp" : "Stopps sind Geheimtipps"}, die
                in keinem Standard-Reiseführer stehen.
              </p>
            )}
          </div>
          <TourFacts tour={tour} />
        </div>

        <section className="mt-14">
          <h2 className="headline text-3xl text-cream sm:text-4xl">Die Route</h2>
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

        {guideEnabled && <section className="mt-14">
          <GuideChat citySlug={tour.citySlug} tourSlug={tour.slug} />
        </section>}

        <section id="tourstart" className="mt-16">
          <h2 className="headline text-3xl text-cream sm:text-4xl">
            Stopp für Stopp
          </h2>
          <p className="mt-2 max-w-xl text-sm text-cream-dim">
            Hör dir die Story an, lös das Rätsel, hak den Stopp ab. Alles
            Weitere zum Ort steht unter «Mehr zum Ort».
          </p>
          <div className="mt-8">
            <StopTimeline tour={tour} riddles={riddlesByTour[`${tour.citySlug}/${tour.slug}`] ?? {}} />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="headline text-3xl text-cream sm:text-4xl">Häufige Fragen</h2>
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
