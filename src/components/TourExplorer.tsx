"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export interface TourLite {
  slug: string;
  citySlug: string;
  cityName: string;
  name: string;
  teaser: string;
  gradient: [string, string];
  durationMinutes: number;
  distanceKm: number;
  stops: number;
  gems: number;
  isPremium: boolean;
  priceChf?: number;
  category?: string;
  categoryName?: string;
  categoryEmoji?: string;
  heroUrl?: string;
}

export interface CatChip {
  slug: string;
  name: string;
  emoji: string;
}

function fmtDur(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h}h ${m}min`;
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
  const [price, setPrice] = useState<"alle" | "gratis" | "premium">("alle");

  const cities = useMemo(() => {
    const seen = new Map<string, string>();
    tours.forEach((t) => seen.set(t.citySlug, t.cityName));
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1], "de"));
  }, [tours]);

  const filtered = tours.filter(
    (t) =>
      (!cat || t.category === cat) &&
      (city === "alle" || t.citySlug === city) &&
      (price === "alle" || (price === "gratis" ? !t.isPremium : t.isPremium))
  );

  const hasFilter = cat !== null || city !== "alle" || price !== "alle";

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
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
              cat === c.slug
                ? "bg-signal-500 text-white"
                : "border border-cream/15 bg-ink-900 text-cream-dim hover:border-signal-500/50 hover:text-cream"
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Stadt + Preis + Count */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Stadt wählen"
          className="rounded-full border border-cream/15 bg-ink-900 px-4 py-1.5 text-sm font-bold text-cream outline-none transition hover:border-cream/40 focus:border-signal-500"
        >
          <option value="alle">📍 Alle Städte</option>
          {cities.map(([slug, name]) => (
            <option key={slug} value={slug}>
              {name}
            </option>
          ))}
        </select>

        <div className="flex overflow-hidden rounded-full border border-cream/15 bg-ink-900 text-sm font-bold">
          {(
            [
              ["alle", "Alle"],
              ["gratis", "Gratis"],
              ["premium", "Premium"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setPrice(val)}
              className={`px-3.5 py-1.5 transition ${
                price === val
                  ? "bg-cream text-white"
                  : "text-cream-dim hover:text-cream"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-sm font-bold text-cream-faint">
          {filtered.length} {filtered.length === 1 ? "Tour" : "Touren"}
        </p>

        {hasFilter && (
          <button
            onClick={() => {
              setCat(null);
              setCity("alle");
              setPrice("alle");
            }}
            className="text-sm font-bold text-signal-600 hover:text-signal-500"
          >
            ✕ Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Ergebnis */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-cream/20 p-10 text-center">
          <p className="font-display text-xl font-extrabold text-cream">
            Nichts gefunden.
          </p>
          <p className="mt-2 text-sm text-cream-dim">
            Diese Kombination gibt es (noch) nicht – probier eine andere
            Stimmung oder Stadt.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link
              key={`${t.citySlug}-${t.slug}`}
              href={`/${t.citySlug}/${t.slug}`}
              className="card group block overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:border-signal-500/40 hover:shadow-xl"
            >
              <div
                className="relative h-56 w-full overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})`,
                }}
              >
                {t.heroUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={t.heroUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/30" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-zinc-900">
                  {t.cityName}
                </span>
                <div className="absolute right-3 top-3">
                  {t.isPremium ? (
                    <span className="stamp-orange">
                      CHF {t.priceChf?.toFixed(2)}
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-900/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
                      Gratis
                    </span>
                  )}
                </div>
                {t.categoryName && (
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
                    {t.categoryEmoji} {t.categoryName}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                  ⏱ {fmtDur(t.durationMinutes)}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-extrabold tracking-tight text-cream transition group-hover:text-signal-500">
                  {t.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream-dim">
                  {t.teaser}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-cream/10 pt-3 text-xs text-cream-faint">
                  <span className="flex flex-wrap gap-x-3 gap-y-1">
                    <span>📍 {t.stops} Stops</span>
                    <span>👣 {t.distanceKm} km</span>
                    {t.gems > 0 && <span>💎 {t.gems}</span>}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cream/15 text-sm text-cream-dim transition group-hover:border-signal-500 group-hover:bg-signal-500 group-hover:text-white"
                  >
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
