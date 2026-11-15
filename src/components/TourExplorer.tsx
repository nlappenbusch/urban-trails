"use client";

import { useMemo, useState } from "react";
import type { TourLite } from "@/lib/tour-lite";
import TourCardView from "@/components/TourCardView";
import CategoryIcon from "@/components/CategoryIcon";

export type { TourLite };

export interface CatChip {
  slug: string;
  name: string;
}

export default function TourExplorer({
  tours,
  cats,
}: {
  tours: TourLite[];
  cats: CatChip[];
}) {
  const [cat, setCat] = useState<string | null>(null);
  const [city, setCity] = useState<string>("alle");

  const cities = useMemo(() => {
    const seen = new Map<string, string>();
    tours.forEach((t) => seen.set(t.citySlug, t.cityName));
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1], "de"));
  }, [tours]);

  const filtered = tours.filter(
    (t) => (!cat || t.category === cat) && (city === "alle" || t.citySlug === city)
  );

  const hasFilter = cat !== null || city !== "alle";

  return (
    <div>
      {/* Stimmungs-Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
            cat === null
              ? "bg-cream text-white"
              : "border border-cream/15 bg-ink-900 text-cream-dim hover:border-cream/40"
          }`}
        >
          Alle Stimmungen
        </button>
        {cats.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(cat === c.slug ? null : c.slug)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
              cat === c.slug
                ? "bg-signal-500 text-white"
                : "border border-cream/15 bg-ink-900 text-cream-dim hover:border-signal-500/50 hover:text-cream"
            }`}
          >
            <CategoryIcon slug={c.slug} size={15} />
            {c.name}
          </button>
        ))}
      </div>

      {/* Stadt + Anzahl */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Stadt wählen"
          className="rounded-full border border-cream/15 bg-ink-900 px-4 py-1.5 text-sm font-bold text-cream outline-none transition hover:border-cream/40 focus:border-signal-500"
        >
          <option value="alle">Alle Städte</option>
          {cities.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>

        <p className="text-sm font-bold text-cream-faint">
          {filtered.length} {filtered.length === 1 ? "Tour" : "Touren"}
        </p>

        {hasFilter && (
          <button
            onClick={() => {
              setCat(null);
              setCity("alle");
            }}
            className="text-sm font-bold text-signal-600 hover:text-signal-500"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-cream/20 p-10 text-center">
          <p className="font-display text-xl font-extrabold text-cream">Nichts gefunden.</p>
          <p className="mt-2 text-sm text-cream-dim">
            Diese Kombination gibt es (noch) nicht – probier eine andere Stimmung oder Stadt.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TourCardView key={`${t.citySlug}-${t.slug}`} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
