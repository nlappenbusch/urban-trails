/**
 * Sucht AusflÃ¼ge, die an einem Datum ab einem Bahnhof wirklich aufgehen:
 * Wetter am Ziel, echte Zugverbindung, offene Orte. Genutzt von /api/heute und /api/ueberraschung.
 */
import { connections, findStations, type Station } from "@/lib/oev";
import { forecast, type DayWeather } from "@/lib/wetter";
import { rainyDay, weatherKind } from "@/lib/wetter-core";
import { allRegions, places, shiftDay, tripBudget, type RegionInfo, type TripDay } from "@/lib/ausfluege";
import { composePlan } from "@/lib/compose";
import { planTours, timelineData } from "@/lib/ausfluege-view";

export const zurichNow = () => {
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  const [date, time] = parts.split(" ");
  return { date, time };
};
export const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};
export const hm = (iso: string) => new Date(iso).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
export const plusMin = (t: string, m: number) => {
  const [h, mm] = t.split(":").map(Number);
  const x = h * 60 + mm + m;
  return `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
};

export interface FinderInput {
  start: Station;
  date: string;
  depTime: string;
  audience: string;
  moods: string[];
  /** Zufallsanteil der Bewertung: 0.6 = Â«HeuteÂ», hÃ¶her = Ãœberraschung */
  randomness?: number;
  /** hÃ¶chstens so viele CHF pro Person (grobe SchÃ¤tzung ohne Bahn) */
  maxCost?: number;
  /** Regionen, die nicht in Frage kommen (z. B. schon ausgelost) */
  exclude?: string[];
  count?: number;
}

export interface FoundTrip {
  region: RegionInfo;
  score: number;
  weather: DayWeather | undefined;
  rain: boolean;
  connection: { dep: string; arr: string; platform?: string; durationMin: number; transfers: number; from: string };
  day: TripDay;
  cost: { low: number; high: number; missing: number };
}

export async function resolveStart(q: string) {
  const s = (await findStations(q))[0];
  return s?.lat && s.lng ? s : undefined;
}

export async function findTrips(o: FinderInput): Promise<FoundTrip[]> {
  const origin = { lat: o.start.lat!, lng: o.start.lng! };
  const regions = allRegions().filter((r) => !o.exclude?.includes(r.slug) && places.filter((p) => p.region === r.slug).length >= 4);
  const scored = await Promise.all(
    regions.map(async (r) => {
      const dist = km(origin, r.center);
      const est = 15 + dist * 0.9;
      let w: DayWeather | undefined;
      try {
        w = (await forecast(r.center.lat, r.center.lng)).find((d) => d.date === o.date);
      } catch {
        w = undefined;
      }
      const kind = w ? weatherKind(w.code) : "wolken";
      const weatherScore = { sonne: 3, wolken: 1.5, nebel: 0, regen: -1.5, schnee: -0.5, gewitter: -2 }[kind];
      // zu nah ist kein Ausflug, zu weit frisst den Tag
      const distScore = dist < 8 ? -3 : -Math.max(0, est - 45) / 35;
      return { r, dist, est, w, score: weatherScore + distScore + Math.random() * (o.randomness ?? 0.6) };
    }),
  );
  const shortlist = scored.filter((x) => x.est <= 210 && x.dist >= 8).sort((a, b) => b.score - a.score).slice(0, 6);

  const tours = planTours();
  const found = await Promise.all(
    shortlist.map(async ({ r, w, score }): Promise<FoundTrip | null> => {
      let conn;
      try {
        conn = (await connections({ from: o.start.name, to: r.station, date: o.date, time: o.depTime, limit: 2 }))[0];
      } catch {
        return null;
      }
      if (!conn) return null;
      const arr = hm(conn.arr);
      if (arr > "14:00") return null;
      const rain = w ? rainyDay(w) : false;
      const plan = composePlan({ region: r.slug, days: 1, audience: o.audience, moods: o.moods, rain, budget: 3, date: o.date }, places, tours);
      const day = shiftDay(plan.days[0], plusMin(arr, 15));
      const tl = timelineData([day]);
      const b = tripBudget([day], tl.places, undefined, rain);
      if (o.maxCost && b.missing.length <= 1 && b.low > o.maxCost) return null;
      return {
        region: r,
        score: score - conn.durationMin / 60,
        weather: w,
        rain,
        connection: { dep: hm(conn.dep), arr, platform: conn.depPlatform, durationMin: conn.durationMin, transfers: conn.transfers, from: conn.from },
        day,
        cost: { low: b.low, high: b.high, missing: b.missing.length },
      };
    }),
  );
  return found
    .filter((x): x is FoundTrip => Boolean(x))
    .sort((a, b) => b.score - a.score)
    .slice(0, o.count ?? 3);
}
