import type { Metadata } from "next";
import Link from "next/link";
import { categories, getToursByCategory } from "@/lib/categories";
import CategoryIcon from "@/components/CategoryIcon";

export const metadata: Metadata = {
  title: "Kategorien – finde die Tour, die zu deinem Tag passt",
  description:
    "Urban Vibes, Natur & Escape, People & Social, Quick Adventures: Touren nach Stimmung statt nach Stadtplan – schweizweit.",
  alternates: { canonical: "/kategorien" },
};

export default function CategoriesPage() {
  return (
    <div className="container-page py-16">
      <h1 className="headline max-w-3xl text-5xl text-cream sm:text-6xl">
        Was für ein Tag ist <em>heute?</em>
      </h1>
      <p className="mt-4 max-w-xl text-cream-dim">
        Acht Erlebnis-Kategorien, schweizweit: Wähl, wonach dir ist – die
        passenden Touren liegen dahinter.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const count = getToursByCategory(c.slug).length;
          return (
            <Link
              key={c.slug}
              href={`/kategorien/${c.slug}`}
              className="card group flex flex-col p-6 transition-colors hover:border-cream/30"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-signal-500/10 text-signal-600">
                <CategoryIcon slug={c.slug} size={22} />
              </span>
              <h2 className="mt-4 font-display text-xl font-extrabold tracking-tight text-cream group-hover:text-signal-600">
                {c.name}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-dim">
                {c.claim}
              </p>
              <p className="mt-4 text-xs font-bold text-signal-600">
                {count} {count === 1 ? "Tour" : "Touren"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
