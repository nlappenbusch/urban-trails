import Link from "next/link";
import type { Tour } from "@/lib/types";
import { formatDuration } from "@/lib/tours";
import { getTourHeroImage } from "@/data/images";
import { getDestination } from "@/data/destinations";
import { getCategory } from "@/lib/categories";

export default function TourCard({ tour }: { tour: Tour }) {
  const hiddenGems = tour.stops.filter((s) => s.isHiddenGem).length;
  const hero = getTourHeroImage(tour.slug);
  const dest = getDestination(tour.citySlug);
  const cat = tour.category ? getCategory(tour.category) : undefined;
  return (
    <Link
      href={`/${tour.citySlug}/${tour.slug}`}
      className="card group block overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:border-signal-500/40 hover:shadow-xl"
    >
      <div
        className="relative h-56 w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tour.gradient[0]}, ${tour.gradient[1]})`,
        }}
      >
        {hero && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hero.url}
            alt={hero.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/30" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-zinc-900">
          {dest?.name ?? tour.citySlug}
        </span>
        <div className="absolute right-3 top-3">
          {tour.isPremium ? (
            <span className="stamp-orange">
              CHF {tour.priceChf?.toFixed(2)}
            </span>
          ) : (
            <span className="rounded-full bg-zinc-900/80 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
              Gratis
            </span>
          )}
        </div>
        {cat && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur">
            {cat.emoji} {cat.name}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          ⏱ {formatDuration(tour.durationMinutes)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-extrabold tracking-tight text-cream transition group-hover:text-signal-500">
          {tour.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream-dim">
          {tour.teaser}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-cream/10 pt-3 text-xs text-cream-faint">
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <span>📍 {tour.stops.length} Stops</span>
            <span>👣 {tour.distanceKm} km</span>
            {hiddenGems > 0 && <span>💎 {hiddenGems}</span>}
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
  );
}
