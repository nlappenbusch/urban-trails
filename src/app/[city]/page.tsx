import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { destinations, getDestination } from "@/data/destinations";
import { getToursByCity } from "@/lib/tours";
import TourCard from "@/components/TourCard";

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
  return {
    title: `${dest.name} zu Fuss entdecken – Walking-Touren & Geheimtipps`,
    description: `Selbstgeführte Walking-Touren durch ${dest.name}: Audioguides, interaktive Karten, Gehzeiten und Geheimtipps abseits der Touristenpfade.`,
    alternates: { canonical: `/${dest.slug}` },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const dest = getDestination(city);
  if (!dest || dest.comingSoon) notFound();

  const cityTours = getToursByCity(dest.slug);

  return (
    <div className="container-page py-16">
      <span className="chip">📍 {dest.name} · Kanton {dest.canton}</span>
      <h1 className="headline mt-4 text-5xl text-cream sm:text-6xl">
        {dest.name} <em>zu Fuss</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">
        {dest.description}
      </p>
      <h2 className="mt-14 text-2xl font-bold text-white">
        {cityTours.length} Touren in {dest.name}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cityTours.map((t) => (
          <TourCard key={t.slug} tour={t} />
        ))}
      </div>
    </div>
  );
}
