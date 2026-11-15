import Link from "next/link";
import { daysLabel } from "@/lib/ausfluege-core";
import { imgAttrs } from "@/lib/img";
import type { TripLite } from "@/components/TripExplorer";

/** Kompakte Programm-Karten (Server-Komponente) für Regions- und Themenseiten. */
export default function TripCards({ trips, query = "" }: { trips: TripLite[]; query?: string }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((t) => (
        <li key={t.slug}>
          <Link href={`/ausfluege/${t.slug}${query}`} className="card group flex h-full flex-col overflow-hidden transition hover:border-cream/30">
            {t.hero ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={t.hero.small} {...imgAttrs(t.hero, "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw")} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="aspect-[16/9] w-full" style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }} />
            )}
            <span className="flex flex-1 flex-col p-4">
              <span className="kicker">{t.regionName} · {daysLabel(t.days)}</span>
              <span className="mt-1.5 font-display text-lg font-extrabold leading-tight tracking-tight text-cream decoration-2 underline-offset-4 group-hover:underline">{t.title}</span>
              <span className="mt-1 text-sm leading-relaxed text-cream-dim">{t.teaser}</span>
              {t.cost && <span className="mt-auto pt-3 text-sm font-semibold text-cream">ca. CHF {t.cost[0]}–{t.cost[1]} pro Person</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
