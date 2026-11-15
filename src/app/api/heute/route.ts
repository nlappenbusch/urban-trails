import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { connections, findStations } from "@/lib/oev";
import { forecast } from "@/lib/wetter";
import { rainyDay, weatherKind } from "@/lib/wetter-core";
import { AUDIENCE, MOODS, allRegions, places, shiftDay } from "@/lib/ausfluege";
import { composePlan } from "@/lib/compose";
import { planTours } from "@/lib/ausfluege-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const zurichNow = () => {
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
  const [date, time] = parts.split(" ");
  return { date, time };
};
const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371, dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};
const hm = (iso: string) => new Date(iso).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
const plusMin = (t: string, m: number) => {
  const [h, mm] = t.split(":").map(Number);
  const x = h * 60 + mm + m;
  return `${String(Math.floor(x / 60)).padStart(2, "0")}:${String(x % 60).padStart(2, "0")}`;
};

/**
 * GET /api/heute?start=Winterthur&datum=YYYY-MM-DD&mit=paar&stimmung=natur,genuss
 * → drei Ausflüge, die an diesem Tag wirklich gehen: Wetter, Zug, offene Orte.
 */
export async function GET(req: NextRequest) {
  if (limited(`heute:${clientIp(req)}`, 12, 60_000)) return json({ error: "Zu viele Abfragen – kurz warten." }, 429);
  const sp = req.nextUrl.searchParams;
  const startQ = (sp.get("start") ?? "").trim().slice(0, 80);
  if (!startQ) return json({ error: "Startort fehlt." }, 400);
  const now = zurichNow();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(sp.get("datum") ?? "") && sp.get("datum")! >= now.date ? sp.get("datum")! : now.date;
  const isToday = date === now.date;
  const audience = AUDIENCE[sp.get("mit") ?? ""] ? sp.get("mit")! : "paar";
  const moods = (sp.get("stimmung") ?? "").split(",").filter((m) => MOODS[m]);

  try {
    const start = (await findStations(startQ))[0];
    if (!start?.lat || !start.lng) return json({ error: "Diesen Ort kennt der Fahrplan nicht." }, 400);
    // Heute: frühestens in 20 Minuten los; sonst ab 8:30
    const depTime = isToday ? plusMin(now.time, 20) : "08:30";
    if (isToday && depTime > "13:30") return json({ error: "Für heute ist es schon spät – schau dir morgen an.", late: true }, 200);

    const regions = allRegions().filter((r) => places.filter((p) => p.region === r.slug).length >= 4);
    const scored = await Promise.all(
      regions.map(async (r) => {
        const dist = km({ lat: start.lat!, lng: start.lng! }, r.center);
        const est = 15 + dist * 0.9;
        let w;
        try {
          w = (await forecast(r.center.lat, r.center.lng)).find((d) => d.date === date);
        } catch {
          w = undefined;
        }
        const kind = w ? weatherKind(w.code) : "wolken";
        const weatherScore = { sonne: 3, wolken: 1.5, nebel: 0, regen: -1.5, schnee: -0.5, gewitter: -2 }[kind];
        // zu nah ist kein Ausflug, zu weit frisst den Tag
        const distScore = dist < 8 ? -3 : -Math.max(0, est - 45) / 35;
        return { r, dist, est, w, score: weatherScore + distScore + Math.random() * 0.6 };
      }),
    );
    const shortlist = scored.filter((x) => x.est <= 210 && x.dist >= 8).sort((a, b) => b.score - a.score).slice(0, 6);

    const tours = planTours();
    const results = (
      await Promise.all(
        shortlist.map(async ({ r, w, score }) => {
          let conn;
          try {
            conn = (await connections({ from: start.name, to: r.station, date, time: depTime, limit: 2 }))[0];
          } catch {
            return null;
          }
          if (!conn) return null;
          const arr = hm(conn.arr);
          if (arr > "14:00") return null;
          const rain = w ? rainyDay(w) : false;
          const plan = composePlan({ region: r.slug, days: 1, audience, moods, rain, budget: 3, date }, places, tours);
          const day = shiftDay(plan.days[0], plusMin(arr, 15));
          const ids = day.slots.map((s) => s.placeId).filter(Boolean) as string[];
          return {
            region: r.slug,
            name: r.name,
            station: r.station,
            score: score - conn.durationMin / 60,
            weather: w ? { code: w.code, tmax: w.tmax, tmin: w.tmin, rainProb: w.rainProb, rain } : null,
            connection: { dep: hm(conn.dep), arr, platform: conn.depPlatform, durationMin: conn.durationMin, transfers: conn.transfers, from: conn.from },
            slots: day.slots.map((s) => ({ time: s.time, title: s.title, placeId: s.placeId })),
            places: Object.fromEntries(ids.map((id) => {
              const p = places.find((x) => x.id === id)!;
              return [id, { name: p.name, kind: p.kind, img: p.img?.small, price: p.priceInfo }];
            })),
          };
        }),
      )
    )
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return json({ start: start.name, date, depTime, results });
  } catch (e) {
    console.warn("[heute]", (e as Error).message);
    return json({ error: "Fahrplan oder Wetter gerade nicht erreichbar." }, 502);
  }
}
