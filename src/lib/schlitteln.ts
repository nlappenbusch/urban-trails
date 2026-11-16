import type { SledRun } from "@/lib/schlitteln-core";
import { crowKm } from "@/lib/ski-core";
import { readBestand } from "@/lib/db";

export * from "@/lib/schlitteln-core";
/** Alle aktiven Schlittelwege aus der Datenbank, längste zuerst. */
export const runs = (): SledRun[] => [...readBestand<SledRun>("schlitteln")].sort((a, b) => b.km - a.km);
export const getRun = (id: string) => runs().find((r) => r.id === id);
export const nearRuns = (r: SledRun, n = 4) => runs().filter((x) => x.id !== r.id).map((x) => ({ x, d: crowKm(r.top, x.top) })).sort((a, b) => a.d - b.d).slice(0, n);

export interface SnowNow { topCm?: number; bottomCm?: number; snow7?: number; tempTop?: number; days: { date: string; snow: number; tmax: number; tmin: number }[] }

/** Schneehöhe (Modell) oben/unten und Neuschnee der nächsten Tage – Open-Meteo, 3 h Cache. */
export async function snowFor(r: SledRun): Promise<SnowNow | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${r.top.lat},${r.bottom.lat}&longitude=${r.top.lng},${r.bottom.lng}&elevation=${r.top.ele},${r.bottom.ele}&current=snow_depth,temperature_2m&daily=snowfall_sum,temperature_2m_max,temperature_2m_min&timezone=Europe%2FZurich&forecast_days=7&models=icon_seamless`;
    const res = await fetch(url, { next: { revalidate: 10800 } });
    if (!res.ok) return null;
    const [t, b] = (await res.json()) as { current: { snow_depth: number; temperature_2m: number }; daily: { time: string[]; snowfall_sum: number[]; temperature_2m_max: number[]; temperature_2m_min: number[] } }[];
    return {
      topCm: Math.round((t.current.snow_depth ?? 0) * 100),
      bottomCm: Math.round((b.current.snow_depth ?? 0) * 100),
      tempTop: Math.round(t.current.temperature_2m),
      snow7: Math.round(t.daily.snowfall_sum.reduce((s, x) => s + (x ?? 0), 0)),
      days: t.daily.time.map((date, i) => ({ date, snow: Math.round(t.daily.snowfall_sum[i] ?? 0), tmax: Math.round(t.daily.temperature_2m_max[i]), tmin: Math.round(t.daily.temperature_2m_min[i]) })),
    };
  } catch {
    return null;
  }
}
