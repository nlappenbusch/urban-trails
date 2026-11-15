/**
 * Live-Wassertemperaturen, nur serverseitig:
 * - Flüsse: BAFU Hydrodaten (Messstationen, alle 10 Min.)
 * - Seen: Eawag Alplakes (Modell Simstrat, 1 m Tiefe, CC BY 4.0)
 */
import { memo } from "@/lib/api-utils";
import { LAKES, lakeFor, norm, type WaterReading } from "@/lib/wasser-core";
import type { Place } from "@/lib/ausfluege-core";

const UA = { "User-Agent": "urban-trails.ch (Ausflugsplaner; kontakt via urban-trails.ch)" };

/** LV95 → WGS84 (Näherungsformel swisstopo, ±1 m) */
function lv95(e: number, n: number) {
  const y = (e - 2600000) / 1e6, x = (n - 1200000) / 1e6;
  const lng = 2.6779094 + 4.728982 * y + 0.791484 * y * x + 0.1306 * y * x * x - 0.0436 * y ** 3;
  const lat = 16.9023892 + 3.238272 * x - 0.270978 * y * y - 0.002528 * x * x - 0.0447 * y * y * x - 0.014 * x ** 3;
  return { lat: (lat * 100) / 36, lng: (lng * 100) / 36 };
}

const riverCache = memo<WaterReading[]>(20 * 60_000);

export function riverTemps(): Promise<WaterReading[]> {
  return riverCache("all", async () => {
    const res = await fetch("https://www.hydrodaten.admin.ch/web-hydro-maps/hydro_sensor_temperature.geojson", { headers: UA, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`BAFU ${res.status}`);
    const j = (await res.json()) as { features: { geometry: { coordinates: [number, number] }; properties: Record<string, string | null> }[] };
    return j.features
      .filter((f) => f.properties.last_value && !f.properties.failure_text)
      .map((f) => {
        const p = f.properties;
        const pos = lv95(f.geometry.coordinates[0], f.geometry.coordinates[1]);
        const body = p.hydro_body_name ?? p.label!.split(" - ")[0];
        return {
          temp: Math.round(Number(p.last_value) * 10) / 10,
          at: p.last_measured_at!,
          source: "BAFU" as const,
          label: p.label!,
          body,
          kind: /see$|lac |lago /i.test(body) ? ("see" as const) : ("fluss" as const),
          ...pos,
          min24: p.min_24h ? Number(p.min_24h) : undefined,
          max24: p.max_24h ? Number(p.max_24h) : undefined,
        };
      })
      .filter((r) => Number.isFinite(r.temp) && r.temp > -1 && r.temp < 35);
  });
}

// Seen ändern sich langsam: Zeitreihe für 2 Tage holen, 6 Stunden behalten, daraus den Wert für «jetzt» lesen
type Series = { time: string[]; T: (number | null)[] } | null;
const seriesCache = memo<Series>(6 * 3600_000);
const stamp = (d: Date) => d.toISOString().slice(0, 13).replace(/[-T]/g, "") + "00";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Alplakes drosselt pro Client: Abfragen nacheinander, mit kleiner Pause
let chain: Promise<unknown> = Promise.resolve();
function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(() => sleep(350), () => sleep(350));
  return run;
}

async function loadSeries(key: string): Promise<Series> {
  const now = Date.now();
  const url = `https://alplakes-api.eawag.ch/simulations/1d/point/simstrat/${key}/${stamp(new Date(now - 12 * 3600_000))}/${stamp(new Date(now + 36 * 3600_000))}/1?variables=T`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(10_000) });
    if (res.status === 404) return null;
    if (res.status === 429) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`Alplakes ${res.status}`);
    const j = (await res.json()) as { time: string[]; variables: { T: { data: (number | null)[] } } };
    return { time: j.time, T: j.variables.T.data };
  }
  throw new Error("Alplakes 429"); // nicht zwischenspeichern, später nochmals
}

export async function lakeTemp(key: string): Promise<WaterReading | null> {
  const lake = LAKES.find((l) => l.key === key);
  if (!lake) return null;
  const s = await seriesCache(key, () => throttled(() => loadSeries(key)));
  if (!s) return null;
  const now = Date.now();
  let best = -1;
  s.time.forEach((t, i) => {
    if (s.T[i] == null) return;
    if (best < 0 || Math.abs(Date.parse(t) - now) < Math.abs(Date.parse(s.time[best]) - now)) best = i;
  });
  if (best < 0) return null;
  return { temp: Math.round(s.T[best]! * 10) / 10, at: s.time[best], source: "Alplakes", label: lake.name, body: lake.name, kind: "see", lat: lake.lat, lng: lake.lng };
}

export async function allLakeTemps() {
  const out = await Promise.all(LAKES.map((l) => lakeTemp(l.key).catch((e) => (console.warn("[alplakes]", l.key, (e as Error).message), null))));
  return out.filter((x): x is WaterReading => Boolean(x));
}

const dist = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};

/** Passende Live-Temperatur für einen Badeort (See → Alplakes, Fluss → nächste BAFU-Station am gleichen Gewässer). */
export async function waterForPlace(p: Pick<Place, "coords" | "water">): Promise<WaterReading | null> {
  const w = p.water;
  if (!w || !p.coords || (w.type !== "see" && w.type !== "fluss")) return null;
  if (w.type === "see") {
    const lake = lakeFor(w.body);
    if (lake) return lakeTemp(lake.key);
  }
  const rivers = await riverTemps();
  const body = w.body ? norm(w.body) : "";
  const cand = rivers
    .map((r) => ({ r, d: dist(p.coords!, r) }))
    .filter((x) => (body && norm(x.r.body).includes(body) ? x.d < 40 : x.d < 8))
    .sort((a, b) => a.d - b.d)[0];
  return cand?.r ?? null;
}
