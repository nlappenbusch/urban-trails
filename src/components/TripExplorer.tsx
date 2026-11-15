"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, TrainFront, Wallet } from "lucide-react";
import type { StopImage } from "@/lib/types";
import { imgAttrs } from "@/lib/img";
import { AUDIENCE, MOODS, daysLabel, fmtMin } from "@/lib/ausfluege-core";

export interface TripLite {
  slug: string;
  title: string;
  teaser: string;
  regionName: string;
  days: number;
  moods: string[];
  audience: string[];
  season?: string;
  arrival?: { from: string; minutes: number };
  hero?: StopImage;
  gradient: [string, string];
  /** grobe Kosten pro Person (nur wenn fast alle Preise belegt sind) */
  cost?: [number, number];
}

const chip = (on: boolean) =>
  `min-h-[40px] shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

export default function TripExplorer({ trips }: { trips: TripLite[] }) {
  const [days, setDays] = useState(0);
  const [who, setWho] = useState("");
  const [mood, setMood] = useState("");
  const [where, setWhere] = useState("");
  const list = useMemo(
    () => trips.filter((t) => (!where || t.regionName === where) && (!days || t.days === days) && (!who || t.audience.includes(who)) && (!mood || t.moods.includes(mood))),
    [trips, where, days, who, mood],
  );
  const usedMoods = Object.entries(MOODS).filter(([k]) => k !== "familie" && trips.some((t) => t.moods.includes(k)));
  const regions = [...new Set(trips.map((t) => t.regionName))].sort((a, b) => a.localeCompare(b, "de"));

  return (
    <div>
      <div className="space-y-2.5">
        {regions.length > 3 && (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Wohin">
            <button type="button" aria-pressed={!where} onClick={() => setWhere("")} className={chip(!where)}>Überall</button>
            {regions.map((r) => (
              <button key={r} type="button" aria-pressed={where === r} onClick={() => setWhere(where === r ? "" : r)} className={chip(where === r)}>{r}</button>
            ))}
          </div>
        )}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Dauer">
          {[0, 1, 2, 3].map((d) => (
            <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)} className={chip(days === d)}>
              {d === 0 ? "Jede Dauer" : daysLabel(d)}
            </button>
          ))}
        </div>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Mit wem">
          {Object.entries(AUDIENCE).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={who === k} onClick={() => setWho(who === k ? "" : k)} className={chip(who === k)}>{l}</button>
          ))}
        </div>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Stimmung">
          {usedMoods.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={mood === k} onClick={() => setMood(mood === k ? "" : k)} className={chip(mood === k)}>{l}</button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-cream-faint" aria-live="polite">{list.length} {list.length === 1 ? "Programm" : "Programme"}</p>
      <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <Link key={t.slug} href={`/ausfluege/${t.slug}`} className="card group overflow-hidden transition hover:border-cream/30">
            <div className="relative h-44 w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}>
              {t.hero && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={t.hero.url} {...imgAttrs(t.hero,"(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw")} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
              <span className="badge absolute left-3 top-3 bg-white/90 text-zinc-900">{t.regionName}</span>
              <span className="badge absolute right-3 top-3 bg-signal-500 text-white">{daysLabel(t.days)}</span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight text-cream decoration-2 underline-offset-4 group-hover:underline">
                {t.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{t.teaser}</p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-cream-faint">
                {t.arrival && <span className="inline-flex items-center gap-1"><TrainFront size={14} aria-hidden /> ab {t.arrival.from} ca. {fmtMin(t.arrival.minutes)}</span>}
                {t.season && <span className="inline-flex items-center gap-1"><CalendarDays size={14} aria-hidden /> {t.season}</span>}
                {t.cost && <span className="inline-flex items-center gap-1"><Wallet size={14} aria-hidden /> ca. CHF {t.cost[0]}{t.cost[1] > t.cost[0] ? `–${t.cost[1]}` : ""} p. P.</span>}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-signal-600">Programm ansehen <ArrowUpRight size={15} aria-hidden /></span>
            </div>
          </Link>
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-6 text-cream-dim">
          Dafür haben wir noch kein fertiges Programm. <Link href="/ausfluege/planen" className="font-semibold text-signal-600">Stell dir eins zusammen</Link> oder setz einen Filter zurück.
        </p>
      )}
    </div>
  );
}
