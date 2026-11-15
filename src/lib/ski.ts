/**
 * Skigebiete, nur serverseitig.
 * Stammdaten: eigene Recherche (src/data/skigebiete.json).
 * Schnee: SLF-Messnetz (CC BY 4.0), immer.
 * Pisten/Lifte live: LiftRadar – nur wenn SKI_LIVE=liftradar gesetzt ist (Nutzung mit dem Betreiber klären).
 */
import { memo } from "@/lib/api-utils";
import type { Count, ItemStatus, MountainDay, MountainWeather, SkiArea, SkiDetail, SkiGroup, SkiItem, SkiLive, SkiRow, SkiSnow } from "@/lib/ski-core";
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
  sources?: string[];
}
const lrIndexCache = memo<LrIndex["resorts"]>(6 * 3600_000);
const lrCache = memo<LrResort | null>(60 * 60_000);

const c = (x?: LrCount): Count | undefined => (x ? { open: x.open, total: x.total, openKm: x.open_km, totalKm: x.total_km } : undefined);

async function lrResortFor(a: SkiArea): Promise<LrResort | null> {
  const idx = await lrIndexCache("ch", async () => {
    const r = await fetch("https://liftradar.eu/json/index.json", { headers: UA, signal: AbortSignal.timeout(10_000) });
    return ((await r.json()) as LrIndex).resorts.filter((x) => x.country === "ch");
  });
  const n = norm(a.name);
  const hit = idx
    .map((r) => ({ r, d: km(a.coords, { lat: r.location.lat, lng: r.location.lon }), same: norm(r.name).includes(n.split(" ")[0]) || n.includes(norm(r.name).split(" ")[0]) }))
    .filter((x) => x.d < (x.same ? 15 : 4))
    .sort((x, y) => Number(y.same) - Number(x.same) || x.d - y.d)[0];
  if (!hit) return null;
  return lrCache(hit.r.id, async () => {
    const res = await fetch(`https://liftradar.eu/json/ch/${hit.r.id}.json`, { headers: UA, signal: AbortSignal.timeout(10_000) });
    return res.ok ? ((await res.json()) as LrResort) : null;
  });
}

async function liveFor(a: SkiArea): Promise<SkiLive | undefined> {
  const r = await lrResortFor(a);
  if (!r) return undefined;
  const d = r.slopes_by_difficulty;
  return { status: r.status, lifts: c(r.lifts), slopes: c(r.slopes), byColor: d ? { blue: c(d.easy), red: c(d.intermediate), black: c(d.difficult) } : undefined, at: r.fetched_at };
}

export const getSkiArea = (id: string) => skiAreas.find((a) => a.id === id);

// ---------- Einzelmeldungen der Bergbahn (infosnow / Intermaps) ----------
const ENT: Record<string, string> = { auml: "ä", ouml: "ö", uuml: "ü", Auml: "Ä", Ouml: "Ö", Uuml: "Ü", eacute: "é", egrave: "è", agrave: "à", ecirc: "ê", ccedil: "ç", bull: "·", amp: "&", quot: '"', nbsp: " ", szlig: "ss", rsquo: "’", ndash: "–" };
const decode = (s: string) => s.replace(/&(#\d+|\w+);/g, (m, e: string) => (e[0] === "#" ? String.fromCharCode(Number(e.slice(1))) : ENT[e] ?? m)).replace(/\\'/g, "'");
const strip = (s: string) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const GROUP_KEY: [RegExp, string][] = [
  [/schlittel|rodel|sled/i, "sled"],
  [/skitour/i, "other"],
  [/funpark|snowpark/i, "parks"],
  [/park(ing|plätze|platz)/i, "parking"],
  [/anlage|lift/i, "lifts"],
  [/piste|slope/i, "slopes"],
  [/gastro|restaurant|hütte/i, "food"],
  [/wander|schneeschuh|themenweg|vita/i, "walk"],
  [/langlauf|loipe/i, "xc"],
];
const groupKey = (title: string) => GROUP_KEY.find(([re]) => re.test(title))?.[1] ?? "other";

function fromInfosnow(html: string): SkiGroup[] {
  const c = html.replace(/';sb\[sb\.length\]='/g, "");
  const parts = c.split('class="isH1"').slice(1);
  return parts.map((p) => {
    const head = strip(p.slice(p.indexOf(">") + 1, p.indexOf("</div>")));
    const title = head.replace(/\s*\(.*$/, "");
    const items: SkiItem[] = [];
    const re = /state\/\d+\/(\d+)\.svg"[^>]*>\s*<img[^>]*alt="([^"]*)"[^>]*\/?>\s*<div class="isTxt">([\s\S]*?)<\/div>/g;
    for (let m; (m = re.exec(p)); ) {
      const type = decode(m[2]);
      const st = m[1] === "1" ? "open" : m[1] === "2" ? "prep" : "closed";
      const col = /blau/.test(type) ? "blue" : /rot/.test(type) ? "red" : /schwarz/.test(type) ? "black" : /gelb/.test(type) ? "route" : undefined;
      // «4.1 · 4.1 Spalegna» → «4.1 · Spalegna», «xx · Snowpark» → «Snowpark»
      const name = strip(m[3]).replace(/^(\S+) · \1 /, "$1 · ").replace(/^x+ · /i, "");
      items.push({ name, status: st as ItemStatus, type: type.replace(/^Skipiste - \w+$/, "Piste"), ...(col ? { difficulty: col as SkiItem["difficulty"] } : {}) });
    }
    return { key: groupKey(title), title, open: items.filter((i) => i.status === "open").length, total: items.length, items };
  }).filter((g) => g.total > 0 && !/dummy|test/i.test(g.title));
}

interface ImItem { status?: string; subtitle?: string; popup?: { title?: string; difficulty?: string; "additional-info"?: { length?: number } } }
function fromIntermaps(j: { lifts?: ImItem[]; slopes?: ImItem[]; routes?: ImItem[]; pois?: Record<string, ImItem[]> }): SkiGroup[] {
  const st = (s?: string): ItemStatus => (s === "open" ? "open" : s === "closed" ? "closed" : s === "preparation" || s === "in_preparation" ? "prep" : "unknown");
  const diff = (d?: string) => (d === "easy" ? "blue" : d === "medium" ? "red" : d === "difficult" || d === "hard" ? "black" : d === "freeride" || d === "skiroute" ? "route" : undefined);
  const mk = (key: string, title: string, list: ImItem[], withDiff = false): SkiGroup => {
    const items = list.map((x) => ({
      name: `${x.popup?.title ?? "?"}${x.popup?.["additional-info"]?.length ? ` (${(x.popup["additional-info"].length / 1000).toLocaleString("de-CH", { maximumFractionDigits: 1 })} km)` : ""}`,
      status: st(x.status),
      type: x.subtitle,
      ...(withDiff && diff(x.popup?.difficulty) ? { difficulty: diff(x.popup?.difficulty) as SkiItem["difficulty"] } : {}),
    }));
    return { key, title, open: items.filter((i) => i.status === "open").length, total: items.length, items };
  };
  const pois = Object.values(j.pois ?? {}).flat();
  const by = (re: RegExp) => pois.filter((p) => re.test(p.subtitle ?? ""));
  return [
    mk("lifts", "Anlagen", j.lifts ?? []),
    mk("slopes", "Pisten", [...(j.slopes ?? []), ...(j.routes ?? [])], true),
    mk("food", "Restaurants & Hütten", by(/gastronom|restaurant|hut|hütte/i)),
    mk("parking", "Parkplätze", by(/parking|parkplatz/i)),
    mk("sled", "Schlittelwege", by(/sled|tobog|schlittel|rodel/i)),
  ].filter((g) => g.total > 0);
}

const detailCache = memo<SkiDetail | null>(15 * 60_000);

/** Einzelne Anlagen, Pisten, Hütten, Parkplätze – so wie die Bergbahn sie meldet */
export async function skiDetail(a: SkiArea): Promise<SkiDetail | null> {
  if (!LIVE_ON) return null;
  return detailCache(a.id, async () => {
    const r = await lrResortFor(a).catch(() => null);
    const src = r?.sources ?? [];
    const info = src.find((u) => u.includes("infosnow.ch"));
    const im = src.find((u) => u.includes("intermaps.com"));
    let groups: SkiGroup[] = [];
    let out: SkiDetail | null = null;
    if (info) {
      const url = info.replace(/lang=\w+/, "lang=de");
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(10_000) }).catch(() => null);
      if (res?.ok) {
        const html = await res.text();
        groups = fromInfosnow(html);
        const at = /Status \(([^)]+)\)/.exec(html)?.[1];
        if (groups.length) out = { groups, source: "infosnow", sourceUrl: url, at };
      }
    }
    if (im) {
      const url = im.replace(/lang=\w+/, "lang=de");
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(10_000) }).catch(() => null);
      if (res?.ok) {
        const g = fromIntermaps(await res.json());
        if (!out) out = g.length ? { groups: g, source: "intermaps", sourceUrl: url } : null;
        else {
          // infosnow hat keine Parkplätze – aus Intermaps ergänzen
          for (const x of g) if (!out.groups.some((y) => y.key === x.key)) out.groups.push(x);
        }
      }
    }
    return out;
  });
}

// ---------- Bergwetter (Open-Meteo, Tal und Gipfel) ----------
const mwCache = memo<MountainWeather>(60 * 60_000);
export function mountainWeather(a: SkiArea): Promise<MountainWeather> {
  const baseM = a.altitude?.base ?? 1200, topM = a.altitude?.top ?? baseM + 800;
  return mwCache(a.id, async () => {
    const q = new URLSearchParams({
      latitude: `${a.coords.lat},${a.coords.lat}`,
      longitude: `${a.coords.lng},${a.coords.lng}`,
      elevation: `${baseM},${topM}`,
      daily: "weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum,wind_speed_10m_max,sunshine_duration",
      hourly: "freezing_level_height",
      timezone: "Europe/Zurich",
      forecast_days: "6",
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`Bergwetter ${res.status}`);
    const [b, t] = (await res.json()) as { daily: Record<string, (number | string)[]>; hourly?: { freezing_level_height?: number[] } }[];
    const days = (d: typeof b): MountainDay[] =>
      (d.daily.time as string[]).map((date, i) => ({
        date,
        code: Number(d.daily.weather_code[i]),
        tmax: Math.round(Number(d.daily.temperature_2m_max[i])),
        tmin: Math.round(Number(d.daily.temperature_2m_min[i])),
        snowCm: Math.round(Number(d.daily.snowfall_sum[i] ?? 0)),
        windMax: Math.round(Number(d.daily.wind_speed_10m_max[i] ?? 0)),
        sunH: Math.round(Number(d.daily.sunshine_duration[i] ?? 0) / 360) / 10,
      }));
    // Nullgradgrenze je Tag um 12 Uhr
    const fz = b.hourly?.freezing_level_height;
    return { base: days(b), top: days(t), baseM, topM, freezing: fz ? (b.daily.time as string[]).map((_, i) => Math.round((fz[i * 24 + 12] ?? 0) / 50) * 50) : undefined };
  });
}

/** Ein Gebiet mit Schnee und Live-Status. */
export async function skiRow(id: string): Promise<SkiRow | undefined> {
  const a = getSkiArea(id);
  if (!a) return undefined;
  const s = await slf().catch(() => undefined);
  return { ...a, snow: s ? snowFor(a, s) : undefined, live: LIVE_ON ? await liveFor(a).catch(() => undefined) : undefined };
}

/** Gebiete in der Nähe (Luftlinie) */
export const skiNear = (a: SkiArea, n = 4) =>
  skiAreas
    .filter((x) => x.id !== a.id)
    .map((x) => ({ x, d: km(a.coords, x.coords) }))
    .sort((p, q) => p.d - q.d)
    .slice(0, n);

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
