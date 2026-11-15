/**
 * Live-Wassertemperaturen, nur serverseitig:
 * - Flüsse: BAFU Hydrodaten (Messstationen, alle 10 Min.)
 * - Seen: Eawag Alplakes (Modell Simstrat, 1 m Tiefe, CC BY 4.0)
 */
import { memo } from "@/lib/api-utils";
import { LAKES, lakeFor, lakeSlug, norm, waterSlug, type BathSpot, type WaterReading } from "@/lib/wasser-core";
import bathData from "@/data/badestellen.json";
import { places } from "@/lib/ausfluege";
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
          key: p.key ?? undefined,
          slug: waterSlug(p.label!),
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
  return { temp: Math.round(s.T[best]! * 10) / 10, at: s.time[best], source: "Alplakes", label: lake.name, body: lake.name, kind: "see", lat: lake.lat, lng: lake.lng, key, slug: lakeSlug(lake) };
}

export interface TempPoint { t: string; v: number }

/** stündlich ausdünnen */
function hourly(pts: TempPoint[]) {
  const out: TempPoint[] = [];
  let last = "";
  for (const p of pts) {
    const h = p.t.slice(0, 13);
    if (h !== last) out.push(p), (last = h);
  }
  return out;
}

const riverSeriesCache = memo<TempPoint[]>(30 * 60_000);
/** BAFU: letzte 7 Tage einer Station */
export function riverSeries(key: string) {
  return riverSeriesCache(key, async () => {
    const res = await fetch(`https://www.hydrodaten.admin.ch/plots/temperature_7days/${encodeURIComponent(key)}_temperature_7days_de.json`, { headers: UA, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];
    const j = (await res.json()) as { plot?: { data?: { name?: string; x: string[]; y: (number | null)[] }[] } };
    const d = j.plot?.data?.find((x) => /temperatur/i.test(x.name ?? "")) ?? j.plot?.data?.[0];
    if (!d) return [];
    return hourly(d.x.map((t, i) => ({ t, v: d.y[i] as number })).filter((p) => typeof p.v === "number"));
  });
}

const lakeLongCache = memo<TempPoint[]>(6 * 3600_000);
/** Alplakes: 7 Tage zurück und 4 Tage Prognose */
export function lakeSeries(key: string) {
  return lakeLongCache(key, () =>
    throttled(async () => {
      const now = Date.now();
      const url = `https://alplakes-api.eawag.ch/simulations/1d/point/simstrat/${key}/${stamp(new Date(now - 7 * 86400_000))}/${stamp(new Date(now + 4 * 86400_000))}/1?variables=T`;
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15_000) });
        if (res.status === 429) {
          await sleep(1500 * (attempt + 1));
          continue;
        }
        if (!res.ok) return [];
        const j = (await res.json()) as { time: string[]; variables: { T: { data: (number | null)[] } } };
        return hourly(j.time.map((t, i) => ({ t, v: j.variables.T.data[i] as number })).filter((p) => typeof p.v === "number"));
      }
      throw new Error("Alplakes 429");
    }),
  );
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

// grobe Ausdehnung der Seen um ihren Mittelpunkt (km) – für die Zuordnung von Badestellen
const LAKE_R: Record<string, number> = { geneva: 38, upperconstance: 30, maggiore: 28, neuchatel: 22, lowerzurich: 15, lucernekreuztrichterandvitznauerbecken: 13, upperlugano: 12, thun: 10, biel: 9, walensee: 8, brienz: 7, zug: 7, lowerconstance: 9, upperzurich: 6, lucerneurnersee: 6, sempach: 4, hallwil: 4, murten: 4, sarnen: 4, sihlsee: 4, gruyere: 6, joux: 5 };

/** Badestelle am offenen Wasser → nächste Flussstation (≤ 3 km) oder der See, in dessen Bereich sie liegt */
export function waterNear(p: { lat: number; lng: number; name?: string }, rivers: WaterReading[], lakes: WaterReading[]): WaterReading | undefined {
  const n = norm(p.name ?? "");
  // 1. Name verrät das Gewässer: «Rheinbad», «Aarebad», «Strandbad Zürichsee»
  const byLake = lakes.find((l) => { const def = LAKES.find((x) => x.key === l.key); return def && [def.name, ...def.alias].some((a) => a.length > 4 && n.includes(norm(a).replace(/\s*\(.*\)/, ""))); });
  if (byLake && dist(p, byLake) < (LAKE_R[byLake.key ?? ""] ?? 4) * 1.5) return byLake;
  const named = rivers
    .filter((r) => r.kind === "fluss" && r.body.length > 2 && n.includes(norm(r.body)))
    .map((r) => ({ r, d: dist(p, r) }))
    .filter((x) => x.d < 15)
    .sort((a, b) => a.d - b.d)[0];
  if (named) return named.r;
  const lake = lakes
    .map((l) => ({ l, q: dist(p, l) / (LAKE_R[l.key ?? ""] ?? 3) }))
    .filter((x) => x.q < 1)
    .sort((a, b) => a.q - b.q)[0];
  // «Seebad», «Strandbad», «Lido» liegen am See – auch wenn eine Flussstation näher ist
  if (lake && /seebad|strandbad|seeuferbad|seeanlage|badestrand|lido|plage|seebadi/.test(n)) return lake.l;
  // 2. Station direkt daneben
  const st = rivers.map((r) => ({ r, d: dist(p, r) })).sort((a, b) => a.d - b.d)[0];
  if (st && st.d < 1.2) return st.r;
  // 3. im Bereich eines Sees
  if (lake) return lake.l;
  return st && st.d < 3 ? st.r : undefined;
}

/** Alle Badestellen: OpenStreetMap + unsere geprüften, mit Live-Temperatur am offenen Wasser */
export async function bathingSpots(): Promise<BathSpot[]> {
  const [rivers, lakes] = await Promise.all([riverTemps().catch(() => [] as WaterReading[]), allLakeTemps().catch(() => [] as WaterReading[])]);
  const ours: BathSpot[] = places
    .filter((p) => p.kind !== "hotel")
    .filter((p) => p.coords && (p.water || p.kind === "bad"))
    .map((p) => ({
      id: p.id,
      name: p.name,
      kind: p.water?.type === "see" || p.water?.type === "fluss" ? "offen" : p.water?.type === "hallenbad" ? "hallenbad" : p.water?.type === "therme" ? "therme" : "freibad",
      lat: p.coords!.lat,
      lng: p.coords!.lng,
      town: p.town,
      url: p.url,
      ours: `/ausflugsziele/${p.region}#${p.id}`,
    }));
  const same = (a: string, b: string) => { const x = norm(a).replace(/[^a-z0-9]/g, ""), y = norm(b).replace(/[^a-z0-9]/g, ""); return x.includes(y) || y.includes(x); };
  const osm = (bathData as BathSpot[]).filter((b) => !ours.some((o) => dist(o, b) < 0.15 || (dist(o, b) < 2 && same(o.name, b.name))));
  // unsere Flussbäder/Strandbäder sind offenes Wasser, auch wenn der Ort als «freibad» geführt ist
  for (const o of ours) if (o.kind === "freibad" && /flussbad|strandbad|seebad|rheinbad|aarebad|badi am|lido|plage/i.test(o.name)) o.kind = "offen";
  return [...ours, ...osm].map((b) => {
    if (b.kind !== "offen") return b;
    const w = waterNear(b, rivers, lakes);
    return w ? { ...b, water: { temp: w.temp, label: w.source === "BAFU" ? w.label : w.body, slug: w.slug, source: w.source } } : b;
  });
}

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
