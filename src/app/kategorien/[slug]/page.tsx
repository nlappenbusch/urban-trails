import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategory, getToursByCategory } from "@/lib/categories";
import type { Category } from "@/lib/types";
import TourCard from "@/components/TourCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: `${cat.emoji} ${cat.name} – Touren nach Stimmung`,
    description: `${cat.claim} ${cat.description}`,
    alternates: { canonical: `/kategorien/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const catTours = getToursByCategory(cat.slug as Category);

  return (
    <div className="container-page py-16">
      <Link
        href="/kategorien"
        className="text-sm font-bold text-signal-600 hover:text-signal-500"
      >
        ← Alle Kategorien
      </Link>
      <p className="mt-6 text-5xl">{cat.emoji}</p>
      <h1 className="headline mt-3 text-5xl text-cream sm:text-6xl">
        {cat.name}
      </h1>
      <p className="mt-3 max-w-xl text-lg text-cream-dim">{cat.claim}</p>
      <p className="mt-2 max-w-xl text-sm text-cream-faint">
        {cat.description}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {catTours.map((t) => (
          <TourCard key={`${t.citySlug}-${t.slug}`} tour={t} />
        ))}
      </div>
      {catTours.length === 0 && (
        <p className="mt-10 text-cream-dim">
          Hier entsteht gerade die erste Tour – schau bald wieder vorbei.
        </p>
      )}
    </div>
  );
}
