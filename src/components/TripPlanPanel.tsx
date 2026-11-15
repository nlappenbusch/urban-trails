"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, TrainFront } from "lucide-react";
import { addDays, fmtMin, type TripDay } from "@/lib/ausfluege-core";
import { WEATHER_LABEL, rainyDay, weatherKind, type DayWeatherLite } from "@/lib/wetter-core";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import WeatherIcon from "@/components/WeatherIcon";

interface Conn {
  from: string;
  to: string;
  dep: string;
  arr: string;
  depPlatform?: string;
  durationMin: number;
  transfers: number;
}

export interface TripDateEvent {
  date: string;
  rainByDay: boolean[];
}

const hm = (iso: string) => new Date(iso).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
const minus = (t: string, m: number) => {
  const [h, mm] = t.split(":").map(Number);
  const x = Math.max(0, h * 60 + mm - m);
  return `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
};
const plus = (t: string, m: number) => minus(t, -m);
const todayIso = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

/**
 * «Dein Ausflug»: Datum + Startort → Wetter je Tag (schaltet Plan B automatisch)
 * und echte Zugverbindungen hin und zurück.
 */
export default function TripPlanPanel({ region, station, days }: { region: string; station: string; days: TripDay[] }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState<StartStation | null>(null);
  const [weather, setWeather] = useState<DayWeatherLite[] | null>(null);
  const [there, setThere] = useState<{ list: Conn[]; sbb?: string; error?: string } | null>(null);
  const [back, setBack] = useState<{ list: Conn[]; sbb?: string; error?: string } | null>(null);
  const today = useMemo(todayIso, []);

  const firstTime = days[0]?.slots[0]?.time ?? "10:00";
  const lastDay = days[days.length - 1];
  const homeSlot = lastDay?.slots.find((s) => /heimreise/i.test(s.title));
  const backTime = homeSlot?.time ?? plus(lastDay?.slots[lastDay.slots.length - 1]?.time ?? "17:00", 90);

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const d = sp.get("datum");
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= todayIso()) setDate(d);
    const s = sp.get("start");
    setStart(s ? { name: s } : loadStart());
    fetch(`/api/wetter?region=${region}`)
      .then((r) => r.json())
      .then((r) => setWeather(r.days ?? null))
      .catch(() => setWeather(null));
  }, [region]);

  const tripWeather = useMemo(() => {
    if (!date || !weather) return [];
    return days.map((_, i) => weather.find((w) => w.date === addDays(date, i)));
  }, [date, weather, days]);

  // Wetter → Regen-Schalter im Programm, Datum → Kalender-Export
  useEffect(() => {
    if (!date) return;
    const detail: TripDateEvent = { date, rainByDay: tripWeather.map((w) => (w ? rainyDay(w) : false)) };
    window.dispatchEvent(new CustomEvent("ut-trip-date", { detail }));
  }, [date, tripWeather]);

  useEffect(() => {
    if (!date || !start) return;
    setThere(null);
    setBack(null);
    const q = (from: string, to: string, d: string, t: string, arrival: boolean) =>
      fetch(`/api/oev?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${d}&time=${t}${arrival ? "&ankunft=1" : ""}`)
        .then((r) => r.json())
        .then((r) => ({ list: (r.connections ?? []) as Conn[], sbb: r.sbb as string | undefined, error: r.error as string | undefined }))
        .catch(() => ({ list: [], error: "Fahrplan gerade nicht erreichbar." }));
    if (start.name === station) return;
    q(start.name, station, date, minus(firstTime, 10), true).then((r) => setThere({ ...r, list: r.list.slice(-2) }));
    q(station, start.name, addDays(date, days.length - 1), backTime, false).then((r) => setBack({ ...r, list: r.list.slice(0, 2) }));
  }, [date, start, station, firstTime, backTime, days.length]);

  const rainy = tripWeather.some((w) => w && rainyDay(w));

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="trip-date" className="text-sm font-bold text-cream">Wann?</label>
        <input id="trip-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 min-h-[44px] w-full rounded-full border border-cream/20 bg-ink-900 px-4 text-sm text-cream outline-none focus:border-signal-500" />
      </div>
      <StationPicker value={start} onChange={setStart} />

      {date && tripWeather.some(Boolean) && (
        <div>
          <p className="text-sm font-bold text-cream">Wetter</p>
          <ul className="mt-1.5 space-y-1 text-sm text-cream-dim">
            {tripWeather.map((w, i) =>
              w ? (
                <li key={i} className="flex items-center gap-2">
                  <WeatherIcon code={w.code} className="shrink-0 text-signal-600" />
                  <span>
                    {days.length > 1 && <strong className="text-cream">Tag {i + 1}: </strong>}
                    {WEATHER_LABEL[weatherKind(w.code)]}, {w.tmin}–{w.tmax}°, Regen {w.rainProb} %
                  </span>
                </li>
              ) : null,
            )}
          </ul>
          {rainy && <p className="mt-1.5 text-xs font-semibold text-signal-600">Regen angesagt – das Programm zeigt dir schon Plan B.</p>}
        </div>
      )}
      {date && weather && !tripWeather.some(Boolean) && <p className="text-xs text-cream-faint">Wetter gibt es ab 7 Tagen vorher.</p>}

      {date && start && start.name !== station && (
        <div className="space-y-3">
          <ConnBlock label="Hinfahrt" data={there} />
          <ConnBlock label="Rückfahrt" data={back} />
        </div>
      )}
    </div>
  );
}

function ConnBlock({ label, data }: { label: string; data: { list: Conn[]; sbb?: string; error?: string } | null }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-bold text-cream"><TrainFront size={15} className="text-signal-600" aria-hidden /> {label}</p>
      {!data ? (
        <p className="mt-1 text-xs text-cream-faint">Suche Verbindungen …</p>
      ) : data.list.length === 0 ? (
        <p className="mt-1 text-xs text-cream-faint">{data.error ?? "Keine Verbindung gefunden."}</p>
      ) : (
        <ul className="mt-1 space-y-1.5">
          {data.list.map((c) => (
            <li key={c.dep} className="text-sm text-cream-dim">
              <span className="font-display font-extrabold tabular-nums text-cream">{hm(c.dep)}</span>
              <ArrowRight size={13} className="mx-1 inline text-cream-faint" aria-hidden />
              <span className="font-display font-extrabold tabular-nums text-cream">{hm(c.arr)}</span>
              <span className="block text-xs text-cream-faint">
                {c.from}{c.depPlatform ? `, Gleis ${c.depPlatform}` : ""} → {c.to} · {fmtMin(c.durationMin)}, {c.transfers === 0 ? "direkt" : `${c.transfers}× umsteigen`}
              </span>
            </li>
          ))}
        </ul>
      )}
      {data?.sbb && (
        <a href={data.sbb} target="_blank" rel="noopener" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-signal-600 hover:text-signal-500">
          Billett bei der SBB <ExternalLink size={12} aria-hidden />
        </a>
      )}
    </div>
  );
}
