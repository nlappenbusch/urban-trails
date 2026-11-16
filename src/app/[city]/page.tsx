import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { destinations, getDestination } from "@/data/destinations";
import { getToursByCity } from "@/lib/tours";
import { getTourHeroImage } from "@/data/images";
import { cityJsonLd, socialMeta } from "@/lib/seo";
import TourCard from "@/components/TourCard";
import GuideTeaser from "@/components/GuideTeaser";
import Brotkrumen from "@/components/Brotkrumen";

interface Props {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return destinations
    .filter((d) => !d.comingSoon)
    .map((d) => ({ city: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const dest = getDestination(city);
  if (!dest) return {};
  const cityTours = getToursByCity(dest.slug);
  const sights = cityTours.flatMap((t) => t.stops.map((s) => s.name)).slice(0, 4).join(", ");
  const title = `${dest.name} zu Fuss: kostenloser Stadtrundgang mit Audioguide`;
  const description = `Selbstgeführte Walking-Touren durch ${dest.name}, gratis und ohne App: ${sights} und mehr – mit Audio-Story, Karte, Navi und Rätsel an jedem Stopp.`;
  const first = cityTours[0];
  return {
    title,
    description,
    alternates: { canonical: `/${dest.slug}` },
    ...socialMeta({ title, description, path: `/${dest.slug}`, image: first ? getTourHeroImage(first.slug) : undefined }),
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const dest = getDestination(city);
  if (!dest || dest.comingSoon) notFound();

  const cityTours = getToursByCity(dest.slug);
  const totalStops = cityTours.reduce((n, t) => n + t.stops.length, 0);

  return (
    <div className="container-page py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd(dest, cityTours)) }}
      />
      <Brotkrumen items={[{ label: "Audio-Touren", href: "/touren" }, { label: `${dest.name} (${dest.canton})` }]} />
      <h1 className="headline mt-3 text-5xl text-cream sm:text-6xl">
        {dest.name} <em>zu Fuss</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {dest.description}
      </p>
      <h2 className="mt-12 font-display text-2xl font-extrabold tracking-tight text-cream">
        {cityTours.length} {cityTours.length === 1 ? "Tour" : "Touren"} in {dest.name}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cityTours.map((t) => (
          <TourCard key={t.slug} tour={t} />
        ))}
      </div>

      <div className="mt-10">
        <GuideTeaser href={`/fuehrung?stadt=${dest.slug}#anfrage`} place={dest.name} />
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">
          Sehenswürdigkeiten in {dest.name} auf unseren Touren
        </h2>
        <p className="mt-3 text-cream-dim">
          {totalStops} Stopps, jeder mit eigener Audio-Story, Rätsel und Wegbeschreibung.
          Die Touren sind kostenlos und laufen im Browser – ohne App, ohne Anmeldung.
        </p>
        <div className="mt-6 space-y-6">
          {cityTours.map((t) => (
            <div key={t.slug}>
              <h3 className="font-bold text-cream">
                <Link href={`/${t.citySlug}/${t.slug}`} className="hover:text-signal-600">
                  {t.name}
                </Link>
              </h3>
              <ol className="mt-2 space-y-1.5 text-sm text-cream-dim">
                {t.stops.map((s, i) => (
                  <li key={s.id}>
                    <Link href={`/${t.citySlug}/${t.slug}#${s.id}`} className="hover:text-cream">
                      <span className="tabular-nums text-cream-faint">{i + 1}.</span> {s.name}
                    </Link>
                    <span className="text-cream-faint"> – {s.teaser}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
