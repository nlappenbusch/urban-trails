"use client";

import { Sunset } from "lucide-react";
import { minToHm, type SlotLayout } from "@/lib/ausfluege-core";
import type { DayWeatherLite } from "@/lib/wetter-core";
import WeatherIcon from "@/components/WeatherIcon";

/** Farbe je Art des Programmpunkts – gleich wie die Punkte in der Liste darunter. */
export function slotTone(r: SlotLayout): { bg: string; label: string } {
  if (r.slot.tourSlug) return { bg: "bg-signal-500", label: "Audio-Tour" };
  switch (r.place?.kind) {
    case "restaurant": return { bg: "bg-amber-400", label: "Essen" };
    case "cafe": return { bg: "bg-amber-300", label: "Pause" };
    case "bar": return { bg: "bg-violet-500", label: "Bar" };
    case "hotel": return { bg: "bg-zinc-400", label: "Hotel" };
    case "aussicht": return { bg: "bg-sky-500", label: "Aussicht" };
    case "bad": return { bg: "bg-cyan-500", label: "Baden" };
    case undefined: return { bg: "bg-zinc-300", label: "Unterwegs" };
    default: return { bg: "bg-signal-400", label: "Erlebnis" };
  }
}

const OUTDOOR = new Set(["aktivitaet", "aussicht", "bad", "sehenswuerdigkeit"]);

/**
 * Der Tag als Band: Programmblöcke nach Uhrzeit, Wege dazwischen schraffiert,
 * darüber Wetter je Stunde, Regenstunden blau unterlegt, Sonnenuntergang und «jetzt».
 */
export default function DayBand({ rows, weather, isToday, anchorPrefix }: {
  rows: SlotLayout[];
  weather?: DayWeatherLite | null;
  isToday?: boolean;
  anchorPrefix: string;
}) {
  if (rows.length < 2) return null;
  const from = Math.floor(Math.min(...rows.map((r) => r.start)) / 60) * 60;
  const to = Math.max(from + 6 * 60, Math.ceil(Math.max(...rows.map((r) => r.end)) / 60) * 60);
  const span = to - from;
  const pos = (m: number) => `${((m - from) / span) * 100}%`;
  const hours = Array.from({ length: span / 60 + 1 }, (_, i) => from / 60 + i);
  const step = hours.length > 10 ? 2 : 1;
  const sunset = weather?.sunset ? Number(weather.sunset.slice(0, 2)) * 60 + Number(weather.sunset.slice(3)) : undefined;
  const now = isToday ? new Date().getHours() * 60 + new Date().getMinutes() : undefined;

  return (
    <div className="card overflow-hidden p-4 sm:p-5" aria-hidden>
      {/* Wetter je Stunde */}
      {weather?.hourlyCode && (
        <div className="relative mb-1 h-9">
          {hours.slice(0, -1).filter((_, i) => i % step === 0).map((h) => (
            <div key={h} className="absolute flex -translate-x-1/2 flex-col items-center text-[11px] leading-none text-cream-dim" style={{ left: pos(h * 60 + 30 * step) }}>
              <WeatherIcon code={weather.hourlyCode![h] ?? weather.code} size={15} className={(weather.hourly?.[h] ?? 0) >= 50 ? "text-sky-600" : "text-signal-600"} />
              <span className="mt-1 tabular-nums">{weather.hourlyTemp?.[h]}°</span>
            </div>
          ))}
        </div>
      )}

      <div className="relative h-14 rounded-xl bg-ink-800">
        {/* Regenstunden */}
        {weather?.hourly && hours.slice(0, -1).map((h) =>
          (weather.hourly![h] ?? 0) >= 50 ? (
            <div key={`r${h}`} className="absolute inset-y-0 bg-sky-200/70" style={{ left: pos(h * 60), width: `${(60 / span) * 100}%` }} />
          ) : null,
        )}
        {/* Wege */}
        {rows.map((r, i) =>
          r.leg && rows[i + 1] ? (
            <div
              key={`w${i}`}
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
              style={{ left: pos(r.end), width: `${(Math.max(r.leg.min, 4) / span) * 100}%`, backgroundImage: "repeating-linear-gradient(90deg, #71717a 0 4px, transparent 4px 7px)" }}
            />
          ) : null,
        )}
        {/* Programmblöcke */}
        {rows.map((r, i) => {
          const tone = slotTone(r);
          const wet = r.place && OUTDOOR.has(r.place.kind) && !r.place.weatherProof && weather?.hourly && (weather.hourly[Math.floor(r.start / 60)] ?? 0) >= 50;
          return (
            <a
              key={i}
              href={`#${anchorPrefix}-${i}`}
              tabIndex={-1}
              title={`${minToHm(r.start)}–${minToHm(r.end)} ${r.place?.name ?? r.slot.title}`}
              className={`absolute inset-y-1.5 rounded-lg ${tone.bg} ${wet ? "ring-2 ring-sky-600 ring-offset-1" : ""} ${r.tight ? "outline outline-2 outline-offset-1 outline-red-500" : ""} transition hover:brightness-110`}
              style={{ left: pos(r.start), width: `calc(${((r.end - r.start) / span) * 100}% - 2px)` }}
            >
              <span className="absolute inset-0 grid place-items-center text-[11px] font-bold text-white/95 [text-shadow:0_1px_2px_rgba(0,0,0,.35)]">
                {(r.end - r.start) / span > 0.08 ? i + 1 : ""}
              </span>
            </a>
          );
        })}
        {sunset !== undefined && sunset > from && sunset < to && (
          <div className="absolute -top-1 bottom-0 border-l-2 border-dashed border-signal-600" style={{ left: pos(sunset) }} />
        )}
        {now !== undefined && now > from && now < to && (
          <div className="absolute -inset-y-1 w-0.5 bg-cream" style={{ left: pos(now) }}>
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase text-cream">jetzt</span>
          </div>
        )}
      </div>

      {/* Stunden */}
      <div className="relative mt-1.5 h-4 text-[11px] tabular-nums text-cream-faint">
        {hours.filter((_, i) => i % step === 0).map((h) => (
          <span key={h} className="absolute -translate-x-1/2" style={{ left: pos(h * 60) }}>{h}</span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-dim">
        {[...new Map(rows.map((r) => [slotTone(r).label, slotTone(r)])).values()].map((t) => (
          <span key={t.label} className="inline-flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-sm ${t.bg}`} /> {t.label}</span>
        ))}
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full" style={{ backgroundImage: "repeating-linear-gradient(90deg, #71717a 0 4px, transparent 4px 7px)" }} /> Weg</span>
        {weather?.hourly?.some((x) => x >= 50) && <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-sky-200" /> Regen wahrscheinlich</span>}
        {sunset !== undefined && <span className="inline-flex items-center gap-1.5"><Sunset size={13} className="text-signal-600" /> Sonnenuntergang {weather!.sunset}</span>}
      </div>
    </div>
  );
}
