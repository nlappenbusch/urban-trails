import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { AUDIENCE, MOODS, places } from "@/lib/ausfluege";
import { findTrips, plusMin, resolveStart, zurichNow } from "@/lib/finder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const start = await resolveStart(startQ);
    if (!start) return json({ error: "Diesen Ort kennt der Fahrplan nicht." }, 400);
    // Heute: frühestens in 20 Minuten los; sonst ab 8:30
    const depTime = isToday ? plusMin(now.time, 20) : "08:30";
    if (isToday && depTime > "13:30") return json({ error: "Für heute ist es schon spät – schau dir morgen an.", late: true }, 200);

    const found = await findTrips({ start, date, depTime, audience, moods });
    const results = found.map((f) => {
      const ids = f.day.slots.map((s) => s.placeId).filter(Boolean) as string[];
      return {
        region: f.region.slug,
        name: f.region.name,
        station: f.region.station,
        score: f.score,
        weather: f.weather ? { code: f.weather.code, tmax: f.weather.tmax, tmin: f.weather.tmin, rainProb: f.weather.rainProb, rain: f.rain } : null,
        connection: f.connection,
        slots: f.day.slots.map((s) => ({ time: s.time, title: s.title, placeId: s.placeId })),
        places: Object.fromEntries(ids.map((id) => {
          const p = places.find((x) => x.id === id)!;
          return [id, { name: p.name, kind: p.kind, img: p.img?.small, price: p.priceInfo }];
        })),
      };
    });
    return json({ start: start.name, date, depTime, results });
  } catch (e) {
    console.warn("[heute]", (e as Error).message);
    return json({ error: "Fahrplan oder Wetter gerade nicht erreichbar." }, 502);
  }
}
