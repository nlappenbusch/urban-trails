import { Cloud, CloudFog, CloudLightning, CloudRain, Snowflake, Sun, Wind } from "lucide-react";
import { WEATHER_LABEL, weatherKind } from "@/lib/wetter-core";
import type { MountainDay, MountainWeather } from "@/lib/ski-core";

const ICON = { sonne: Sun, wolken: Cloud, nebel: CloudFog, regen: CloudRain, schnee: Snowflake, gewitter: CloudLightning };
const day = (d: string, i: number) => (i === 0 ? "Heute" : i === 1 ? "Morgen" : new Date(`${d}T12:00:00`).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric" }));

/** Bergwetter: Gipfel und Tal nebeneinander, dazu Neuschnee, Wind, Sonne und Nullgradgrenze. */
export default function MountainWeatherTable({ w }: { w: MountainWeather }) {
  const best = w.top.slice(0, 5).reduce((b, d, i) => (score(d) > score(w.top[b]) ? i : b), 0);
  return (
    <div>
      <p className="text-sm text-cream-dim">
        Bester Skitag der nächsten Tage: <strong className="text-cream">{day(w.top[best].date, best)}</strong>
        {" "}– {w.top[best].sunH} h Sonne oben{w.top[best].snowCm ? `, ${w.top[best].snowCm} cm Neuschnee` : ""}.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-xs text-cream-faint">
              <th className="py-2 pr-3 font-semibold" scope="col"><span className="sr-only">Höhe</span></th>
              {w.top.map((d, i) => (
                <th key={d.date} scope="col" className={`px-2 py-2 font-semibold ${i === best ? "text-signal-600" : ""}`}>{day(d.date, i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label={`Gipfel ${w.topM.toLocaleString("de-CH")} m`} days={w.top} best={best} />
            <Row label={`Tal ${w.baseM.toLocaleString("de-CH")} m`} days={w.base} best={best} />
            {w.freezing && (
              <tr className="border-t border-cream/10 text-cream-dim">
                <th scope="row" className="py-2 pr-3 text-left text-xs font-semibold text-cream-faint">Nullgradgrenze</th>
                {w.freezing.map((f, i) => <td key={i} className="px-2 py-2 tabular-nums">{f.toLocaleString("de-CH")} m</td>)}
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-cream-faint">Wetter: Open-Meteo (Modelle u. a. von MeteoSchweiz), auf Tal- und Gipfelhöhe gerechnet.</p>
    </div>
  );
}

const score = (d: MountainDay) => d.sunH * 2 + Math.min(d.snowCm, 20) * 0.5 - Math.max(0, d.windMax - 40) * 0.3 - (weatherKind(d.code) === "regen" ? 6 : 0);

function Row({ label, days, best }: { label: string; days: MountainDay[]; best: number }) {
  return (
    <tr className="border-t border-cream/10 align-top">
      <th scope="row" className="py-3 pr-3 text-left text-xs font-semibold text-cream-faint">{label}</th>
      {days.map((d, i) => {
        const k = weatherKind(d.code);
        const Icon = ICON[k];
        return (
          <td key={d.date} className={`px-2 py-3 ${i === best ? "bg-signal-500/5" : ""}`}>
            <Icon size={20} className={k === "sonne" ? "text-amber-500" : k === "schnee" ? "text-sky-500" : "text-cream-dim"} aria-label={WEATHER_LABEL[k]} />
            <p className="mt-1 font-bold tabular-nums text-cream">{d.tmax}° <span className="font-normal text-cream-faint">{d.tmin}°</span></p>
            {d.snowCm > 0 && <p className="text-xs font-semibold text-sky-600">+{d.snowCm} cm</p>}
            {d.windMax >= 30 && <p className="inline-flex items-center gap-0.5 text-xs text-cream-dim"><Wind size={11} aria-hidden /> {d.windMax}</p>}
          </td>
        );
      })}
    </tr>
  );
}
