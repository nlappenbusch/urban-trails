/**
 * Skigebiete, nur serverseitig.
 * Stammdaten: eigene Recherche (src/data/skigebiete.json).
 * Schnee: SLF-Messnetz (CC BY 4.0), immer.
 * Pisten/Lifte live: LiftRadar – nur wenn SKI_LIVE=liftradar gesetzt ist (Nutzung mit dem Betreiber klären).
 */
import { memo } from "@/lib/api-utils";
import type { Count, SkiArea, SkiLive, SkiRow, SkiSnow } from "@/lib/ski-core";
import data from "@/data/skigebiete.json";

export const skiAreas = data as unknown as SkiArea[];
export const LIVE_ON = process.env.SKI_LIVE === "liftradar";

const UA = { "User-Agent": "urban-trails.ch (Ausflugsplaner)" };
const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

// ---------- SLF Schnee ----------
interface SlfStation { code: string; label: string; lat: number; lon: number; elevation: number; type: string }
const slfCache = memo<{ stations: SlfStation[]; snow: Map<string, { HS: number | null; HN_1D: number | null; measure_date: string }> }>(3 * 3600_000);

function slf() {
  return slfCache("all", async () => {
    const [st, ds] = await Promise.all([
      fetch("https://measurement-api.slf.ch/public/api/imis/stations", { headers: UA, signal: AbortSignal.timeout(10_000) }).then((r) => r.json() as Promise<SlfStation[]>),
      fetch("https://measurement-api.slf.ch/public/api/imis/daily-snow", { headers: UA, signal: AbortSignal.timeout(10_000) }).then((r) => r.json() as Promise<{ station_code: string; HS: number | null; HN_1D: number | null; measure_date: string }[]>),
    ]);
    return { stations: st.filter((s) => s.type === "SNOW_FLAT"), snow: new Map(ds.map((d) => [d.station_code, d])) };
  });
}

function snowFor(a: SkiArea, s: Awaited<ReturnType<typeof slf>>): SkiSnow | undefined {
  const top = a.altitude?.top ?? 3000;
  const best = s.stations
    .map((st) => ({ st, d: km(a.coords, { lat: st.lat, lng: st.lon }), v: s.snow.get(st.code) }))
    .filter((x) => x.d < 15 && x.v?.HS != null && x.st.elevation <= top + 300)
    .sort((x, y) => x.d - y.d)[0];
  if (!best) return undefined;
  return { cm: Math.round(best.v!.HS!), fresh: best.v!.HN_1D ? Math.round(best.v!.HN_1D) : undefined, station: best.st.label, elevation: Math.round(best.st.elevation), date: best.v!.measure_date.slice(0, 10) };
}

// ---------- LiftRadar live ----------
interface LrIndex { resorts: { id: string; country: string; name: string; location: { lat: number; lon: number } }[] }
interface LrCount { open: number; total: number; open_km?: number | null; total_km?: number | null }
interface LrResort {
  status: SkiLive["status"];
  fetched_at?: string;
  lifts?: LrCount;
  slopes?: LrCount;
  slopes_by_difficulty?: { easy?: LrCount; intermediate?: LrCount; difficult?: LrCount };
}
const lrIndexCache = memo<LrIndex["resorts"]>(6 * 3600_000);
const lrCache = memo<LrResort | null>(60 * 60_000);

const c = (x?: LrCount): Count | undefined => (x ? { open: x.open, total: x.total, openKm: x.open_km, totalKm: x.total_km } : undefined);

async function liveFor(a: SkiArea): Promise<SkiLive | undefined> {
  const idx = await lrIndexCache("ch", async () => {
    const r = await fetch("https://liftradar.eu/json/index.json", { headers: UA, signal: AbortSignal.timeout(10_000) });
    return ((await r.json()) as LrIndex).resorts.filter((x) => x.country === "ch");
  });
  const n = norm(a.name);
  const hit = idx
    .map((r) => ({ r, d: km(a.coords, { lat: r.location.lat, lng: r.location.lon }), same: norm(r.name).includes(n.split(" ")[0]) || n.includes(norm(r.name).split(" ")[0]) }))
    .filter((x) => x.d < (x.same ? 15 : 4))
    .sort((x, y) => Number(y.same) - Number(x.same) || x.d - y.d)[0];
  if (!hit) return undefined;
  const r = await lrCache(hit.r.id, async () => {
    const res = await fetch(`https://liftradar.eu/json/ch/${hit.r.id}.json`, { headers: UA, signal: AbortSignal.timeout(10_000) });
    return res.ok ? ((await res.json()) as LrResort) : null;
  });
  if (!r) return undefined;
  const d = r.slopes_by_difficulty;
  return { status: r.status, lifts: c(r.lifts), slopes: c(r.slopes), byColor: d ? { blue: c(d.easy), red: c(d.intermediate), black: c(d.difficult) } : undefined, at: r.fetched_at };
}

/** Alle Skigebiete mit Schnee (immer) und Live-Status (falls eingeschaltet). */
export async function skiRows(): Promise<SkiRow[]> {
  const s = await slf().catch(() => undefined);
  const rows: SkiRow[] = [];
  // nacheinander in kleinen Gruppen – die Quellen sind kleine Dienste
  for (let i = 0; i < skiAreas.length; i += 6) {
    const part = await Promise.all(
      skiAreas.slice(i, i + 6).map(async (a) => ({
        ...a,
        snow: s ? snowFor(a, s) : undefined,
        live: LIVE_ON ? await liveFor(a).catch(() => undefined) : undefined,
      })),
    );
    rows.push(...part);
  }
  return rows;
}
