/**
 * Wetter über Open-Meteo (frei, ohne Schlüssel; Modelle u. a. von MeteoSchweiz).
 * Nur serverseitig – Antworten werden 30 Minuten zwischengespeichert.
 */
import { memo } from "@/lib/api-utils";

export interface DayWeather {
  date: string; // YYYY-MM-DD
  code: number; // WMO-Wettercode
  tmax: number;
  tmin: number;
  rainProb: number; // max. Niederschlagswahrscheinlichkeit in %
  rainMm: number;
  /** stündlich 0–23: Regenwahrscheinlichkeit in % */
  hourly: number[];
  /** stündlich 0–23: Temperatur (°C, gerundet) und Wettercode */
  hourlyTemp: number[];
  hourlyCode: number[];
  /** Sonnenuntergang HH:MM */
  sunset?: string;
}

const cache = memo<DayWeather[]>(30 * 60_000);

export function forecast(lat: number, lng: number) {
  const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  return cache(key, async () => {
    const q = new URLSearchParams({
      latitude: lat.toFixed(3),
      longitude: lng.toFixed(3),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunset",
      hourly: "precipitation_probability,temperature_2m,weather_code",
      timezone: "Europe/Zurich",
      forecast_days: "7",
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Wetter HTTP ${res.status}`);
    const d = await res.json();
    return (d.daily.time as string[]).map((date, i) => ({
      date,
      code: d.daily.weather_code[i],
      tmax: Math.round(d.daily.temperature_2m_max[i]),
      tmin: Math.round(d.daily.temperature_2m_min[i]),
      rainProb: d.daily.precipitation_probability_max[i] ?? 0,
      rainMm: d.daily.precipitation_sum[i] ?? 0,
      hourly: (d.hourly.precipitation_probability as number[]).slice(i * 24, i * 24 + 24).map((x) => x ?? 0),
      hourlyTemp: (d.hourly.temperature_2m as number[]).slice(i * 24, i * 24 + 24).map((x) => Math.round(x ?? 0)),
      hourlyCode: (d.hourly.weather_code as number[]).slice(i * 24, i * 24 + 24).map((x) => x ?? 0),
      sunset: typeof d.daily.sunset?.[i] === "string" ? (d.daily.sunset[i] as string).slice(11, 16) : undefined,
    }));
  });
}

export { rainyDay as isRainy } from "@/lib/wetter-core";
