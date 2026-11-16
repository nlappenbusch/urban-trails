"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, Ban, Shuffle, Bed, CalendarPlus, CheckCircle2, CloudRain, Coffee, ExternalLink, Footprints, Headphones, Landmark, MapPin, Mountain, Sparkles, Sun, TrainFront, Umbrella, UtensilsCrossed, Waves, Wine, XCircle,
} from "lucide-react";
import { addDays, effectiveSlot, fmtMin, hikeText, KIND_LABEL, layoutDay, minToHm, openState, priceLabel, priceText, type Place, type PlaceKind, type SlotLayout, type TripDay } from "@/lib/ausfluege-core";
import { WEATHER_LABEL, weatherKind, type DayWeatherLite } from "@/lib/wetter-core";
import { imgAttrs } from "@/lib/img";
import SpecialBadge, { WowLine } from "@/components/SpecialBadge";
import LiveWater from "@/components/LiveWater";
import DayBand, { slotTone } from "@/components/DayBand";
import WeatherIcon from "@/components/WeatherIcon";

export interface TimelineTour { name: string; citySlug: string; durationMinutes?: number }

const OUTDOOR = new Set<PlaceKind>(["aktivitaet", "aussicht", "bad", "sehenswuerdigkeit"]);
const dayLabel = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const legLink = (a: Place, b: Place, mode: "fuss" | "oev") =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent([a.name, a.address ?? a.town].join(", "))}&destination=${encodeURIComponent([b.name, b.address ?? b.town].join(", "))}&travelmode=${mode === "fuss" ? "walking" : "transit"}`;

const KIND_ICON: Record<PlaceKind, typeof MapPin> = {
  hotel: Bed,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  bar: Wine,
  aktivitaet: Sparkles,
  sehenswuerdigkeit: Landmark,
  aussicht: Mountain,
  bad: Waves,
};

const mapsLink = (p: Place) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.name, p.address ?? p.town].join(", "))}`;

/** Programm Tag für Tag, mit Regen-Schalter und Kalender-Export (.ics). */
export default function TripTimeline({
  title,
  days,
  places,
  tours,
  hotel,
  allowRainToggle = true,
  initialRain = false,
  swap,
}: {
  title: string;
  days: TripDay[];
  places: Record<string, Place>;
  tours: Record<string, TimelineTour>;
  hotel?: Place;
  allowRainToggle?: boolean;
  initialRain?: boolean;
  /** Planer: Programmpunkt tauschen (Alternativen anbieten, Ort ausblenden) */
  swap?: SwapApi;
}) {
  const [rain, setRain] = useState(initialRain);
  const hasRain = useMemo(() => days.some((d) => d.slots.some((s) => s.rain)), [days]);
  const [start, setStart] = useState("");
  const [weather, setWeather] = useState<(DayWeatherLite | null)[]>([]);
  const today = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), []);
  const layouts = useMemo(
    () => days.map((d) => layoutDay(d, places, rain, (slug) => tours[slug]?.durationMinutes)),
    [days, places, rain, tours],
  );

  // Datum/Wetter aus dem Planungs-Panel übernehmen; ?wetter=regen (z. B. aus der Erinnerungs-Mail) schaltet Plan B
  useEffect(() => {
    if (allowRainToggle && new URLSearchParams(location.search).get("wetter") === "regen") setRain(true);
    function onDate(e: Event) {
      const d = (e as CustomEvent<{ date: string; rainByDay: boolean[]; weather?: (DayWeatherLite | null)[] }>).detail;
      setStart(d.date);
      setWeather(d.weather ?? []);
      if (allowRainToggle && d.rainByDay.length) setRain(d.rainByDay.some(Boolean));
    }
    window.addEventListener("ut-trip-date", onDate);
    return () => window.removeEventListener("ut-trip-date", onDate);
  }, [allowRainToggle]);

  function exportIcs() {
    if (!start) return;
    const pad = (n: number) => String(n).padStart(2, "0");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Urban Trails//Ausflug//DE", "CALSCALE:GREGORIAN"];
    days.forEach((day, di) => {
      const date = new Date(`${start}T12:00:00`);
      date.setDate(date.getDate() + di);
      const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
      day.slots.forEach((raw, si) => {
        const s = effectiveSlot(raw, rain);
        const p = places[s.placeId ?? ""];
        const [h, m] = s.time.split(":").map(Number);
        const end = Math.max(h * 60 + m + 30, layouts[di]?.[si]?.end ?? h * 60 + m + 90);
        const desc = [s.text, p?.url, s.tourSlug ? `${location.origin}/${tours[s.tourSlug]?.citySlug}/${s.tourSlug}` : ""].filter(Boolean).join("\n");
        lines.push(
          "BEGIN:VEVENT",
          `UID:${ymd}-${di}-${si}-${Math.random().toString(36).slice(2)}@urban-trails.ch`,
          `DTSTAMP:${stamp}`,
          `DTSTART;TZID=Europe/Zurich:${ymd}T${pad(h)}${pad(m)}00`,
          `DTEND;TZID=Europe/Zurich:${ymd}T${pad(Math.floor(end / 60) % 24)}${pad(end % 60)}00`,
          `SUMMARY:${esc(s.title)}`,
          `DESCRIPTION:${esc(desc)}`,
          ...(p?.address ? [`LOCATION:${esc(`${p.name}, ${p.address}`)}`] : []),
          "END:VEVENT",
        );
      });
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {allowRainToggle && hasRain && (
          <div role="group" aria-label="Wetter" className="inline-flex rounded-full border border-cream/15 bg-ink-900 p-1">
            <button type="button" aria-pressed={!rain} onClick={() => setRain(false)} className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition ${!rain ? "bg-signal-500 text-white" : "text-cream-dim hover:text-cream"}`}>
              <Sun size={16} aria-hidden /> Schönwetter
            </button>
            <button type="button" aria-pressed={rain} onClick={() => setRain(true)} className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition ${rain ? "bg-signal-500 text-white" : "text-cream-dim hover:text-cream"}`}>
              <CloudRain size={16} aria-hidden /> Regen
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="ics-start" className="sr-only">Startdatum</label>
          <input id="ics-start" type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} className="min-h-[44px] rounded-full border border-cream/20 bg-ink-900 px-4 text-sm text-cream outline-none focus:border-signal-500" />
          <button type="button" onClick={exportIcs} disabled={!start} className="btn-secondary min-h-[44px] py-2 text-sm disabled:opacity-50" title={start ? "" : "Erst ein Startdatum wählen"}>
            <CalendarPlus size={16} aria-hidden /> In den Kalender
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-14">
        {days.map((day, di) => {
          const rows = layouts[di];
          const date = start ? addDays(start, di) : undefined;
          const wx = weather[di] ?? null;
          const walkKm = rows.reduce((a, r) => a + (r.leg?.mode === "fuss" ? r.leg.km : 0), 0);
          const anchor = `tag${di + 1}`;
          return (
            <section key={day.title}>
              <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-cream">
                  {day.title}
                  {date && <span className="ml-2 text-base font-semibold capitalize text-cream-dim">{dayLabel(date)}</span>}
                </h3>
                <p className="flex flex-wrap items-center gap-x-3 text-sm text-cream-dim">
                  {wx && (
                    <span className="inline-flex items-center gap-1.5">
                      <WeatherIcon code={wx.code} className="text-signal-600" /> {WEATHER_LABEL[weatherKind(wx.code)]}, {wx.tmin}–{wx.tmax}°
                    </span>
                  )}
                  <span>{rows.length} Punkte{walkKm >= 0.5 ? ` · ${walkKm.toFixed(1)} km zu Fuss zwischen den Orten` : ""}</span>
                </p>
              </div>
              <div className="mt-4">
                <DayBand rows={rows} weather={wx} isToday={date === today} anchorPrefix={anchor} />
              </div>
              <ol className="mt-6">
                {rows.map((r, i) => (
                  <SlotRow
                    key={i}
                    id={`${anchor}-${i}`}
                    n={i + 1}
                    r={r}
                    next={rows[i + 1]}
                    raw={day.slots[i]}
                    tours={tours}
                    date={date}
                    wx={wx}
                    swap={swap}
                  />
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      {hotel && (
        <section className="mt-12">
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-cream">Übernachten</h3>
          <div className="card mt-4 flex gap-4 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-800 text-signal-600"><Bed size={18} aria-hidden /></span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-cream">{hotel.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-cream-dim">{hotel.text}</p>
              {hotel.tip && <p className="mt-1 text-sm text-cream-dim"><strong className="text-cream">Tipp:</strong> {hotel.tip}</p>}
              <PlaceLine p={hotel} />
            </div>
            {hotel.img && <Thumb p={hotel} />}
          </div>
        </section>
      )}
    </div>
  );
}

/** Ein Programmpunkt: Zeitfenster, Foto, Fakten des Tages (offen? Regen?) und der Weg zum nächsten Punkt. */
function SlotRow({ id, n, r, next, raw, tours, date, wx, swap }: {
  id: string;
  n: number;
  r: SlotLayout;
  next?: SlotLayout;
  raw: TripDay["slots"][number];
  tours: Record<string, TimelineTour>;
  date?: string;
  wx: DayWeatherLite | null;
  swap?: SwapApi;
}) {
  const [swapOpen, setSwapOpen] = useState(false);
  const s = r.slot;
  const p = r.place;
  const tour = s.tourSlug ? tours[s.tourSlug] : undefined;
  const Icon = tour ? Headphones : p ? KIND_ICON[p.kind] : Footprints;
  const tone = slotTone(r);
  const dur = r.end - r.start;
  const open = p && date && p.kind !== "hotel" ? openState(p, date, minToHm(r.start), minToHm(r.end)) : undefined;
  const rainPct = p && OUTDOOR.has(p.kind) && !p.weatherProof && wx?.hourly ? Math.max(...wx.hourly.slice(Math.floor(r.start / 60), Math.ceil(r.end / 60))) : undefined;

  return (
    <li id={id} className="relative grid scroll-mt-28 grid-cols-[3.5rem_1fr] gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-5">
      {next && <span aria-hidden className="absolute bottom-0 left-[1.75rem] top-12 w-px bg-cream/15 sm:left-[2.25rem]" />}
      <div className="flex flex-col items-center">
        <span className="font-display text-base font-extrabold tabular-nums leading-none text-cream">{minToHm(r.start)}</span>
        <span className="mt-1 text-[11px] tabular-nums text-cream-faint">bis {minToHm(r.end)}</span>
        <span className={`relative mt-2 grid h-10 w-10 place-items-center rounded-full text-white ${s.swapped ? "bg-cream" : tone.bg}`}>
          <Icon size={18} aria-hidden />
          <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-ink-900 text-[10px] font-bold text-cream ring-1 ring-cream/15">{n}</span>
        </span>
      </div>

      <div className="min-w-0 pb-2">
        <div className="card overflow-hidden">
          <div className="flex gap-0">
            <div className="min-w-0 flex-1 p-4 sm:p-5">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-cream-faint">
                <span className="text-signal-600">{tour ? "Audio-Tour" : p ? KIND_LABEL[p.kind] : "Programm"}</span>
                <span>{fmtMin(dur)}</span>
                {s.swapped && <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-ink-900">Regenvariante</span>}
                {p && <SpecialBadge p={p} />}
                {raw.travel && <span>· {raw.travel}</span>}
              </p>
              <p className="mt-1 font-display text-lg font-extrabold leading-snug tracking-tight text-cream">{s.title}</p>
              {p && <WowLine p={p} className="mt-1 text-signal-600" />}
              <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">{s.text}</p>

              {(open || rainPct !== undefined) && (
                <p className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  {open === "offen" && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700"><CheckCircle2 size={13} aria-hidden /> an dem Tag offen</span>}
                  {open === "zu" && <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-red-700"><XCircle size={13} aria-hidden /> an dem Tag zu – Alternative wählen</span>}
                  {rainPct !== undefined && rainPct >= 50 && <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-700"><Umbrella size={13} aria-hidden /> {rainPct} % Regen in dieser Zeit</span>}
                  {rainPct !== undefined && rainPct < 20 && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700"><Sun size={13} aria-hidden /> trocken angesagt</span>}
                </p>
              )}

              {tour && (
                <Link href={`/${tour.citySlug}/${s.tourSlug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-signal-600 hover:text-signal-500">
                  Tour öffnen: {tour.name}
                </Link>
              )}
              {p && <PlaceLine p={p} />}
              {swap && p && p.kind !== "hotel" && (
                <button type="button" aria-expanded={swapOpen} onClick={() => setSwapOpen(!swapOpen)} className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-cream/20 px-3.5 text-sm font-semibold text-cream-dim transition hover:border-signal-500 hover:text-cream">
                  <Shuffle size={14} aria-hidden /> Tauschen
                </button>
              )}
            </div>
            {p?.img && <Thumb p={p} />}
          </div>
          {swap && p && swapOpen && <SwapPanel p={p} swap={swap} onDone={() => setSwapOpen(false)} />}
        </div>

        {next && (r.leg || r.tight) && (
          <div className="my-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-1 text-sm text-cream-dim">
            {r.leg && p && next.place && (
              <a href={legLink(p, next.place, r.leg.mode)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 font-semibold hover:text-cream">
                {r.leg.mode === "fuss" ? <Footprints size={15} aria-hidden /> : <TrainFront size={15} aria-hidden />}
                {r.leg.mode === "fuss" ? `${r.leg.min} Min. zu Fuss` : `ca. ${r.leg.min} Min. mit Bus/Bahn`}
                <span className="font-normal text-cream-faint">({r.leg.km < 1 ? `${Math.round(r.leg.km * 1000)} m` : `${r.leg.km.toFixed(1)} km`})</span>
              </a>
            )}
            {r.tight && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
                <AlertTriangle size={15} aria-hidden /> Knapp: rund {r.tight} Min. zu wenig – etwas kürzen oder später weiter
              </span>
            )}
          </div>
        )}
        {!next && <div className="h-2" />}
        {next && !r.leg && !r.tight && <div className="h-4" />}
      </div>
    </li>
  );
}

export interface SwapApi {
  /** passende Alternativen zum Ort (gleiche Art, nicht schon im Programm) */
  alternatives: (p: Place) => Place[];
  /** Ort ersetzen: `to` = gewählte Alternative, ohne = irgendwas anderes */
  replace: (from: Place, to?: Place) => void;
}

function SwapPanel({ p, swap, onDone }: { p: Place; swap: SwapApi; onDone: () => void }) {
  const alts = swap.alternatives(p).slice(0, 3);
  return (
    <div className="border-t border-cream/10 bg-ink-800/60 p-4 sm:p-5">
      <p className="text-sm font-bold text-cream">Stattdessen?</p>
      {alts.length > 0 ? (
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {alts.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => { swap.replace(p, a); onDone(); }} className="card group flex h-full w-full flex-col overflow-hidden text-left transition hover:border-signal-500">
                {a.img ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={a.img.small} {...imgAttrs(a.img, "200px")} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <span className="grid aspect-[16/9] w-full place-items-center bg-ink-800 text-cream-faint">{(() => { const I = KIND_ICON[a.kind]; return <I size={22} aria-hidden />; })()}</span>
                )}
                <span className="block p-3">
                  <span className="block text-xs font-semibold text-signal-600">{KIND_LABEL[a.kind]}{a.weatherProof ? " · mit Dach" : ""}</span>
                  <span className="mt-0.5 block font-bold leading-snug text-cream group-hover:underline">{a.name}</span>
                  {a.wow && <span className="mt-0.5 block text-xs font-semibold text-signal-600">{a.wow}</span>}
                  {a.priceInfo && <span className="mt-0.5 block text-xs text-cream-faint">{priceText(a.priceInfo)}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-cream-dim">Für diese Zeit haben wir in der Region gerade nichts Passendes mehr.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => { swap.replace(p); onDone(); }} className="btn-secondary min-h-[40px] py-1.5 text-sm">
          <Ban size={14} aria-hidden /> Schon dort gewesen – weglassen
        </button>
      </div>
    </div>
  );
}

/** Foto des Orts; Klick führt zur Commons-Seite mit Urheber und Lizenz. */
function Thumb({ p }: { p: Place }) {
  const img = p.img!;
  return (
    <a href={img.credit} target="_blank" rel="noopener noreferrer" title="Foto: Wikimedia Commons – Urheber & Lizenz" className="relative w-24 shrink-0 self-stretch sm:w-44">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.small} {...imgAttrs(img, "176px")} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    </a>
  );
}

function PlaceLine({ p }: { p: Place }) {
  const price = priceText(p.priceInfo);
  const facts = [KIND_LABEL[p.kind], p.priceInfo ? "" : priceLabel(p.price), p.season && p.season !== "ganzjährig" ? p.season : "", p.hours].filter(Boolean);
  return (
    <div className="mt-2 text-xs leading-relaxed text-cream-faint">
      {price && (
        <p className="mb-1 text-sm font-semibold text-cream">
          {price}
          {p.priceInfo?.note && <span className="font-normal text-cream-faint"> – {p.priceInfo.note}</span>}
        </p>
      )}
      {p.hike && (
        <p className="mb-1 text-sm font-semibold text-cream">
          {hikeText(p.hike)}
          {p.hike.start && <span className="font-normal text-cream-faint"> – {p.hike.start}{p.hike.end && p.hike.end !== p.hike.start ? ` → ${p.hike.end}` : " (Rundweg)"}</span>}
        </p>
      )}
      {p.water && (p.water.type === "see" || p.water.type === "fluss") && <LiveWater id={p.id} className="mb-1" />}
      <p>{facts.join(" · ")}</p>
      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        <a href={mapsLink(p)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-cream-dim hover:text-cream">
          <MapPin size={13} aria-hidden /> {p.address ?? p.town}
        </a>
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-cream-dim hover:text-cream">
            <ExternalLink size={13} aria-hidden /> Website
          </a>
        )}
      </p>
    </div>
  );
}
