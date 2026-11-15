import Link from "next/link";
import type { TourLite } from "@/lib/tour-lite";

function fmtDur(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h}h ${m}min`;
}

/** Tourkarte – eine Darstellung für Startseite, Explorer, Stadt- und Kategorieseiten. */
export default function TourCardView({ t }: { t: TourLite }) {
  return (
    <Link
      href={`/${t.citySlug}/${t.slug}`}
      className="card group block overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:border-signal-500/40 hover:shadow-xl"
    >
      <div
        className="relative h-48 w-full overflow-hidden sm:h-56"
        style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}
      >
        {t.heroUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={t.heroUrl}
            alt={t.heroAlt ?? ""}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/30" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-zinc-900">
          {t.cityName}
        </span>
        {t.categoryName && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
            {t.categoryEmoji} {t.categoryName}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-white">
          ⏱ {fmtDur(t.durationMinutes)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-extrabold tracking-tight text-cream transition group-hover:text-signal-500">
          {t.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream-dim">{t.teaser}</p>
        <div className="mt-4 flex items-center justify-between border-t border-cream/10 pt-3 text-xs text-cream-faint">
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <span>📍 {t.stops} Stopps</span>
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
  );
}
