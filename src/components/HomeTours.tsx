"use client";

import { useState } from "react";
import Link from "next/link";
import type { TourLite } from "@/lib/tour-lite";
import TourCardView from "@/components/TourCardView";

export interface CityChip {
  slug: string;
  name: string;
  count: number;
}

/** Startseite: Stadt wählen → Touren der Stadt. Ohne Auswahl eine Tour je Stadt. */
export default function HomeTours({
  tours,
  cities,
  featured,
}: {
  tours: TourLite[];
  cities: CityChip[];
  featured: TourLite[];
}) {
  const [city, setCity] = useState<string | null>(null);
  const shown = city ? tours.filter((t) => t.citySlug === city) : featured;
  const cityName = cities.find((c) => c.slug === city)?.name;

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
      active
        ? "bg-cream text-white"
        : "border border-cream/15 bg-ink-900 text-cream-dim hover:border-cream/40 hover:text-cream"
    }`;

  return (
    <div>
      <div className="flex items-center gap-3">
        <div
          className="-ml-5 flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 pl-5 [scrollbar-width:none] sm:ml-0 sm:flex-wrap sm:overflow-visible sm:pl-0 [&::-webkit-scrollbar]:hidden"
          role="group"
          aria-label="Stadt wählen"
        >
          <button onClick={() => setCity(null)} aria-pressed={city === null} className={chip(city === null)}>
            Alle Städte
          </button>
          {cities.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCity(city === c.slug ? null : c.slug)}
              aria-pressed={city === c.slug}
              className={chip(city === c.slug)}
            >
              {c.name}
              {c.count > 1 && <span className="ml-1.5 font-normal opacity-60">{c.count}</span>}
            </button>
          ))}
        </div>
        <Link
          href="/ueberrasche-mich"
          className="inline-flex shrink-0 self-start rounded-full bg-signal-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-signal-600"
        >
          Überrasch mich
        </Link>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <TourCardView key={`${t.citySlug}-${t.slug}`} t={t} />
        ))}
      </div>

      <p className="mt-6 text-sm font-bold">
        {city ? (
          <Link href={`/${city}`} className="text-signal-600 hover:text-signal-500">
            Mehr über {cityName} →
          </Link>
        ) : (
          <Link href="/touren" className="text-signal-600 hover:text-signal-500">
            Alle {tours.length} Touren mit Filter →
          </Link>
        )}
      </p>
    </div>
  );
}
