import type { Metadata } from "next";
import Link from "next/link";
import { categories, getToursByCategory } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Kategorien – finde die Tour, die zu deinem Tag passt",
  description:
    "Urban Vibes, Natur & Escape, People & Social, Quick Adventures: Touren nach Stimmung statt nach Stadtplan – schweizweit.",
  alternates: { canonical: "/kategorien" },
};

export default function CategoriesPage() {
  return (
    <div className="container-page py-16">
      <p className="kicker">Nach Stimmung, nicht nach Stadtplan</p>
      <h1 className="headline mt-3 max-w-3xl text-5xl text-cream sm:text-6xl">
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
              className="card group relative flex flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-1.5 hover:border-signal-500/40 hover:shadow-xl"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-5 text-[7rem] opacity-[0.07] transition duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:opacity-[0.14]"
              >
                {c.emoji}
              </span>
              <span className="text-4xl">{c.emoji}</span>
              <h2 className="mt-3 font-display text-xl font-extrabold tracking-tight text-cream group-hover:text-signal-500">
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
