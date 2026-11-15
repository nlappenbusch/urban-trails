"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Sparkles, TrainFront, Wallet } from "lucide-react";
import { weatherKind, WEATHER_LABEL } from "@/lib/wetter-core";
import { loadStart, type StartStation } from "@/components/StationPicker";
import WeatherIcon from "@/components/WeatherIcon";
import type { StopImage } from "@/lib/types";
import { imgAttrs } from "@/lib/img";
import { AUDIENCE, MOODS, daysLabel, fmtMin } from "@/lib/ausfluege-core";

export interface TripLite {
  slug: string;
  title: string;
  teaser: string;
  region: string;
  center?: { lat: number; lng: number };
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
  const [inspo, setInspo] = useState(false);
  const [weather, setWeather] = useState<Record<string, Wx[]> | null>(null);
  const [start, setStart] = useState<StartStation | null>(null);
  useEffect(() => {
    if (!inspo || weather) return;
    setStart(loadStart());
    fetch("/api/wetter?alle=1").then((r) => r.json()).then((r) => setWeather(r.regions ?? {})).catch(() => setWeather({}));
  }, [inspo, weather]);

  const filtered = useMemo(
    () => trips.filter((t) => (inspo || !where || t.regionName === where) && (!days || t.days === days) && (!who || t.audience.includes(who)) && (!mood || t.moods.includes(mood))),
    [trips, where, days, who, mood, inspo],
  );
  // «Inspirier mich»: nach Wetter der nächsten Tage, Entfernung ab Startort und Saison sortieren
  const why = useMemo(() => {
    const out: Record<string, { score: number; wx?: Wx; dayLabel?: string; km?: number }> = {};
    if (!inspo) return out;
    const month = new Date().getMonth();
    for (const t of filtered) {
      const days3 = weather?.[t.region] ?? [];
      const di = days3.length ? pickDay(days3) : -1;
      const wx = di >= 0 ? days3[di] : undefined;
      const kind = wx ? weatherKind(wx.code) : "wolken";
      let score = { sonne: 3, wolken: 1.5, nebel: 0.5, regen: -1, schnee: 0, gewitter: -2 }[kind];
      if (kind === "regen" && t.moods.includes("kultur")) score += 1.5;
      const km = start?.lat && start.lng && t.center ? dist({ lat: start.lat, lng: start.lng }, t.center) : undefined;
      if (km !== undefined) score -= km < 8 ? 5 : Math.max(0, km - (t.days === 1 ? 50 : 120)) / (t.days === 1 ? 25 : 60);
      if (t.season && !inSeason(t.season, month)) score -= 4;
      out[t.slug] = { score, wx, dayLabel: di >= 0 ? DAY_LABEL[di] : undefined, km };
    }
    return out;
  }, [inspo, filtered, weather, start]);
  const list = useMemo(() => (inspo ? [...filtered].sort((a, b) => (why[b.slug]?.score ?? 0) - (why[a.slug]?.score ?? 0)) : filtered), [inspo, filtered, why]);
  const usedMoods = Object.entries(MOODS).filter(([k]) => k !== "familie" && trips.some((t) => t.moods.includes(k)));
  const regions = [...new Set(trips.map((t) => t.regionName))].sort((a, b) => a.localeCompare(b, "de"));

  return (
    <div>
      <div className="space-y-2.5">
        {regions.length > 3 && (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="group" aria-label="Wohin">
            <button type="button" aria-pressed={inspo} onClick={() => { setInspo(!inspo); setWhere(""); }} className={chip(inspo)}>
              <span className="inline-flex items-center gap-1.5"><Sparkles size={14} aria-hidden /> Inspirier mich</span>
            </button>
            <button type="button" aria-pressed={!where && !inspo} onClick={() => { setWhere(""); setInspo(false); }} className={chip(!where && !inspo)}>Überall</button>
            {regions.map((r) => (
              <button key={r} type="button" aria-pressed={where === r && !inspo} onClick={() => { setInspo(false); setWhere(where === r ? "" : r); }} className={chip(where === r && !inspo)}>{r}</button>
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

      <p className="mt-6 text-sm text-cream-faint" aria-live="polite">
        {inspo
          ? !weather
            ? "Wir schauen aufs Wetter der nächsten Tage …"
            : `Sortiert nach Wetter der nächsten Tage${start ? `, Anreise ab ${start.name}` : ""} und Saison – oben steht, was jetzt am besten passt.`
          : `${list.length} ${list.length === 1 ? "Programm" : "Programme"}`}
      </p>
      <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t, i) => (
          <Link key={t.slug} href={`/ausfluege/${t.slug}`} className="card group overflow-hidden transition hover:border-cream/30">
            <div className="relative h-44 w-full overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}>
              {t.hero && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={t.hero.url} {...imgAttrs(t.hero,"(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw")} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
              <span className="badge absolute left-3 top-3 bg-white/90 text-zinc-900">{t.regionName}</span>
              <span className="badge absolute right-3 top-3 bg-signal-500 text-white">{daysLabel(t.days)}</span>
              {inspo && weather && i < 3 && (
                <span className="badge absolute bottom-3 left-3 inline-flex items-center gap-1 bg-signal-500 text-white"><Sparkles size={12} aria-hidden /> Passt jetzt</span>
              )}
            </div>
            {inspo && why[t.slug]?.wx && (
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-cream/10 px-5 py-2.5 text-sm text-cream">
                <span className="inline-flex items-center gap-1.5">
                  <WeatherIcon code={why[t.slug].wx!.code} className="text-signal-600" /> {why[t.slug].dayLabel}: {WEATHER_LABEL[weatherKind(why[t.slug].wx!.code)]}, {Math.round(why[t.slug].wx!.tmax)}°
                </span>
                {why[t.slug].km !== undefined && <span className="text-cream-dim">{Math.round(why[t.slug].km!)} km ab {start?.name}</span>}
              </p>
            )}
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

interface Wx {
  date: string;
  code: number;
  tmax: number;
}

const DAY_LABEL = ["Heute", "Morgen", "Übermorgen"];

/** Samstag/Sonntag bevorzugen, sonst morgen (heute ist für einen Ausflug meist zu spät). */
function pickDay(d: Wx[]) {
  const we = d.findIndex((x, i) => i > 0 && [0, 6].includes(new Date(`${x.date}T12:00:00Z`).getUTCDay()));
  return we >= 0 ? we : Math.min(1, d.length - 1);
}

const dist = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};

const MONTHS = ["jan", "feb", "mär", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "dez"];
/** Grobe Saisonprüfung aus Texten wie «Mitte Juni bis Mitte Oktober» oder «ganzjährig». */
function inSeason(season: string, month: number) {
  const s = season.toLowerCase();
  if (/ganzj|jederzeit|immer/.test(s)) return true;
  const found = MONTHS.map((m, i) => (s.includes(m) ? i : -1)).filter((i) => i >= 0);
  if (found.length < 2) return true;
  const idx = (m: string) => s.indexOf(m);
  const ordered = [...found].sort((a, b) => idx(MONTHS[a]) - idx(MONTHS[b]));
  const from = ordered[0], to = ordered[ordered.length - 1];
  return from <= to ? month >= from && month <= to : month >= from || month <= to;
}