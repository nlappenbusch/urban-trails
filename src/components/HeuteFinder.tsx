"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrainFront } from "lucide-react";
import { AUDIENCE, MOODS, addDays, fmtMin, priceText, type PlaceKind, type PriceInfo } from "@/lib/ausfluege-core";
import { WEATHER_LABEL, weatherKind } from "@/lib/wetter-core";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import WeatherIcon from "@/components/WeatherIcon";

interface Result {
  region: string;
  name: string;
  station: string;
  weather: { code: number; tmax: number; tmin: number; rainProb: number; rain: boolean } | null;
  connection: { dep: string; arr: string; platform?: string; durationMin: number; transfers: number; from: string };
  slots: { time: string; title: string; placeId?: string }[];
  places: Record<string, { name: string; kind: PlaceKind; img?: string; price?: PriceInfo }>;
}

const chip = (on: boolean) =>
  `min-h-[40px] shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

function nextSaturday(today: string) {
  const d = new Date(`${today}T12:00:00Z`).getUTCDay();
  return addDays(today, (6 - d + 7) % 7 || 7);
}

/** Jetzt-Modus: Startort + Tag → drei Ausflüge, die wirklich gehen (Wetter, Zug, Öffnungszeiten). */
export default function HeuteFinder() {
  const today = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), []);
  const DAYS = [
    { label: "Heute", date: today },
    { label: "Morgen", date: addDays(today, 1) },
    { label: "Samstag", date: nextSaturday(today) },
  ];
  const [start, setStart] = useState<StartStation | null>(null);
  const [date, setDate] = useState(today);
  const [mit, setMit] = useState("paar");
  const [mood, setMood] = useState<string[]>([]);
  const [state, setState] = useState<{ loading: boolean; error?: string; results?: Result[]; depTime?: string }>({ loading: false });

  useEffect(() => setStart(loadStart()), []);

  useEffect(() => {
    if (!start) return;
    let stop = false;
    setState({ loading: true });
    const q = new URLSearchParams({ start: start.name, datum: date, mit, stimmung: mood.join(",") });
    fetch(`/api/heute?${q}`)
      .then((r) => r.json())
      .then((r) => !stop && setState({ loading: false, error: r.error, results: r.results, depTime: r.depTime }))
      .catch(() => !stop && setState({ loading: false, error: "Gerade keine Verbindung zum Server." }));
    return () => {
      stop = true;
    };
  }, [start, date, mit, mood]);

  const planLink = (r: Result) => {
    const q = new URLSearchParams({ region: r.region, tage: "1", mit, datum: date });
    if (mood.length) q.set("stimmung", mood.join(","));
    if (r.weather?.rain) q.set("wetter", "regen");
    if (start) q.set("start", start.name);
    return `/ausfluege/planen?${q}`;
  };

  return (
    <div>
      <div className="card grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]">
        <StationPicker value={start} onChange={setStart} label="Wo bist du?" />
        <div>
          <p className="text-sm font-bold text-cream">Wann?</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button key={d.label} type="button" aria-pressed={date === d.date} onClick={() => setDate(d.date)} className={chip(date === d.date)}>{d.label}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-cream">Mit wem?</p>
          <div className="-mx-1 mt-1.5 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
            {Object.entries(AUDIENCE).map(([k, l]) => (
              <button key={k} type="button" aria-pressed={mit === k} onClick={() => setMit(k)} className={chip(mit === k)}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-cream">Lust auf?</p>
          <div className="-mx-1 mt-1.5 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
            {Object.entries(MOODS).filter(([k]) => k !== "familie").map(([k, l]) => (
              <button key={k} type="button" aria-pressed={mood.includes(k)} onClick={() => setMood(mood.includes(k) ? mood.filter((x) => x !== k) : [...mood, k])} className={chip(mood.includes(k))}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8" aria-live="polite">
        {!start && <p className="text-cream-dim">Sag uns, wo du bist – den Rest rechnen wir: Wetter, Zug und was an dem Tag offen hat.</p>}
        {state.loading && <p className="text-cream-dim">Wir prüfen Wetter, Fahrplan und Öffnungszeiten …</p>}
        {state.error && <p className="text-cream-dim">{state.error}</p>}
        {state.results && state.results.length === 0 && !state.error && <p className="text-cream-dim">Heute klappt von hier aus nichts Gescheites mehr – probier «Morgen».</p>}
        {state.results && state.results.length > 0 && (
          <ol className="grid gap-6 lg:grid-cols-3">
            {state.results.map((r, i) => {
              const firstImg = r.slots.map((s) => (s.placeId ? r.places[s.placeId]?.img : undefined)).find(Boolean);
              return (
                <li key={r.region} className="card flex flex-col overflow-hidden">
                  <div className="relative h-36 bg-gradient-to-br from-signal-500 to-signal-700">
                    {firstImg && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={firstImg} alt="" width={480} height={320} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="badge absolute left-3 top-3 bg-white/90 text-zinc-900">Vorschlag {i + 1}</span>
                    <p className="absolute bottom-3 left-4 font-display text-2xl font-extrabold tracking-tight text-white">{r.name}</p>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream-dim">
                      {r.weather && (
                        <span className="inline-flex items-center gap-1.5">
                          <WeatherIcon code={r.weather.code} className="text-signal-600" /> {WEATHER_LABEL[weatherKind(r.weather.code)]}, {r.weather.tmax}°
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <TrainFront size={16} className="text-signal-600" aria-hidden /> {fmtMin(r.connection.durationMin)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-cream">
                      <strong className="font-display tabular-nums">{r.connection.dep}</strong> ab {r.connection.from}{r.connection.platform ? `, Gleis ${r.connection.platform}` : ""} → an{" "}
                      <strong className="font-display tabular-nums">{r.connection.arr}</strong> {r.station}
                      <span className="block text-xs text-cream-faint">{r.connection.transfers === 0 ? "direkt" : `${r.connection.transfers}× umsteigen`}{r.weather?.rain ? " · Regen angesagt: Programm mit Dach" : ""}</span>
                    </p>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {r.slots.slice(0, 5).map((s) => {
                        const p = s.placeId ? r.places[s.placeId] : undefined;
                        return (
                          <li key={s.time + s.title} className="flex gap-2">
                            <span className="w-11 shrink-0 font-display font-extrabold tabular-nums text-cream">{s.time}</span>
                            <span className="min-w-0 text-cream-dim">
                              {p?.name ?? s.title}
                              {p?.price && <span className="block text-xs text-cream-faint">{priceText(p.price)}</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-auto pt-5">
                      <Link href={planLink(r)} className="btn-primary text-sm">
                        Ganzes Programm <ArrowRight size={15} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        {state.results && state.results.length > 0 && (
          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-cream-faint">
            <Sparkles size={13} aria-hidden /> Live gerechnet: Wetter von Open-Meteo, Fahrplan von opentransportdata.swiss, nur Orte mit passenden Öffnungszeiten.
          </p>
        )}
      </div>
    </div>
  );
}
