import Link from "next/link";
import { ArrowUpRight, Clock, Footprints, Gem, MapPin } from "lucide-react";
import type { TourLite } from "@/lib/tour-lite";
import CategoryIcon from "@/components/CategoryIcon";

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
      className="card group block overflow-hidden transition-colors hover:border-cream/30"
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
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <span className="badge absolute left-3 top-3 bg-white/90 text-zinc-900">{t.cityName}</span>
        {t.categoryName && (
          <span className="badge absolute bottom-3 left-3 bg-black/55 text-white">
            <CategoryIcon slug={t.category} size={13} />
            {t.categoryName}
          </span>
        )}
        <span className="badge absolute bottom-3 right-3 bg-black/55 text-white">
          <Clock size={13} aria-hidden="true" />
          {fmtDur(t.durationMinutes)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-extrabold tracking-tight text-cream group-hover:underline group-hover:decoration-signal-500 group-hover:decoration-2 group-hover:underline-offset-4">
          {t.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream-dim">{t.teaser}</p>
        <div className="mt-4 flex items-center justify-between border-t border-cream/10 pt-3 text-xs text-cream-faint">
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1"><MapPin size={13} aria-hidden="true" />{t.stops} Stopps</span>
            <span className="inline-flex items-center gap-1"><Footprints size={13} aria-hidden="true" />{t.distanceKm} km</span>
            {t.gems > 0 && (
              <span className="inline-flex items-center gap-1" title="Geheimtipps"><Gem size={13} aria-hidden="true" />{t.gems} Geheimtipps</span>
            )}
          </span>
          <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 text-cream-faint transition-colors group-hover:text-signal-500" />
        </div>
      </div>
    </Link>
  );
}
