/** Nachtski – nur serverseitig (Daten, Lichtpisten aus OSM, Nachtwetter). */
import data from "@/data/nachtski.json";
import litData from "@/data/nachtski-lit.json";
import { memo } from "@/lib/api-utils";
import type { NightOffer } from "@/lib/nachtski-core";

export const offers = data as NightOffer[];

export interface LitPistes {
  km: number;
  type: "FeatureCollection";
  features: { type: "Feature"; properties: { name: string; diff: string }; geometry: { type: "LineString"; coordinates: [number, number][] } }[];
}
const lit = litData as unknown as Record<string, LitPistes>;

export const getOffer = (id: string) => offers.find((o) => o.id === id);
export const litFor = (id: string): LitPistes | null => lit[id] ?? null;

const rad = (d: number) => (d * Math.PI) / 180;
export function km(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
export const nearOffers = (o: NightOffer, n = 4) =>
  offers
    .filter((x) => x.id !== o.id)
    .map((x) => ({ o: x, d: km(o.coords, x.coords) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n);

export interface NightForecast {
  date: string;
  temp: number;
  snow: number;
  rain: number;
  cloud: number;
  wind: number;
  sunset: string;
}

const fcCache = memo<NightForecast[]>(60 * 60_000);

/** Wetter während der Betriebszeit für die nächsten 7 Tage (Mittel über die Abendstunden) */
export function nightForecast(o: NightOffer): Promise<NightForecast[]> {
  return fcCache(o.id, async () => {
    const q = new URLSearchParams({
      latitude: String(o.coords.lat),
      longitude: String(o.coords.lng),
      hourly: "temperature_2m,snowfall,rain,cloud_cover,wind_speed_10m",
      daily: "sunset",
      timezone: "Europe/Zurich",
      forecast_days: "7",
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Nachtwetter ${res.status}`);
    const d = (await res.json()) as { hourly: Record<string, (number | string)[]>; daily: { time: string[]; sunset: string[] } };
    const h0 = Number(o.from.slice(0, 2));
    const h1 = o.to ? Math.min(23, Number(o.to.slice(0, 2)) || 23) : h0 + 3;
    const span = h1 >= h0 ? h1 - h0 + 1 : 24 - h0;
    return d.daily.time.map((date, i) => {
      const idx = Array.from({ length: span }, (_, k) => i * 24 + h0 + k).filter((x) => x < d.hourly.time.length);
      const avg = (k: string) => idx.reduce((s, x) => s + Number(d.hourly[k][x] ?? 0), 0) / Math.max(1, idx.length);
      const sum = (k: string) => idx.reduce((s, x) => s + Number(d.hourly[k][x] ?? 0), 0);
      return {
        date,
        temp: Math.round(avg("temperature_2m")),
        snow: Math.round(sum("snowfall") * 10) / 10,
        rain: Math.round(sum("rain") * 10) / 10,
        cloud: Math.round(avg("cloud_cover")),
        wind: Math.round(avg("wind_speed_10m")),
        sunset: d.daily.sunset[i]?.slice(11, 16) ?? "",
      };
    });
  });
}

/** Ein Satz, ob sich der Abend lohnt */
export function verdict(f: NightForecast) {
  if (f.rain > 1) return { tone: "bad" as const, text: "Regen angesagt – eher nicht." };
  if (f.wind > 45) return { tone: "bad" as const, text: "Sehr windig, Betrieb unsicher." };
  if (f.snow >= 2) return { tone: "good" as const, text: "Es schneit – Pulver unter Flutlicht." };
  if (f.cloud < 30) return { tone: "good" as const, text: f.temp <= -8 ? "Sternenklar, aber bissig kalt." : "Sternenklar – perfekt." };
  if (f.temp > 3) return { tone: "mid" as const, text: "Mild, Piste wird weich." };
  return { tone: "mid" as const, text: "Bedeckt, aber fahrbar." };
}
