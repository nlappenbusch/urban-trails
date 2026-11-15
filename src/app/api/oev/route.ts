import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { connections, findStations, nearestStation, sbbLink } from "@/lib/oev";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/oev?q=Winter            → Haltestellen-Vorschläge
 * GET /api/oev?lat=..&lng=..       → nächste Haltestelle
 * GET /api/oev?from=..&to=..&date=YYYY-MM-DD&time=HH:MM[&ankunft=1] → Verbindungen
 */
export async function GET(req: NextRequest) {
  if (limited(`oev:${clientIp(req)}`, 60, 60_000)) return json({ error: "Zu viele Abfragen – kurz warten." }, 429);
  const sp = req.nextUrl.searchParams;
  const clean = (v: string | null, max = 80) => (v ?? "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, max);
  try {
    const q = clean(sp.get("q"));
    if (q) return json({ stations: q.length < 2 ? [] : await findStations(q) }, 200, { "Cache-Control": "public, max-age=3600" });

    const lat = Number(sp.get("lat")), lng = Number(sp.get("lng"));
    if (sp.has("lat") && Number.isFinite(lat) && Number.isFinite(lng)) {
      if (lat < 45.7 || lat > 47.9 || lng < 5.9 || lng > 10.6) return json({ station: null });
      return json({ station: await nearestStation(lat, lng) });
    }

    const from = clean(sp.get("from")), to = clean(sp.get("to"));
    if (!from || !to) return json({ error: "from und to fehlen." }, 400);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(sp.get("date") ?? "") ? sp.get("date")! : undefined;
    const time = /^\d{2}:\d{2}$/.test(sp.get("time") ?? "") ? sp.get("time")! : undefined;
    const list = await connections({ from, to, date, time, arrival: sp.get("ankunft") === "1", limit: 4 });
    return json({ connections: list, sbb: sbbLink(from, to, date, time) }, 200, { "Cache-Control": "public, max-age=120" });
  } catch (e) {
    console.warn("[oev]", (e as Error).message);
    return json({ error: "Fahrplan gerade nicht erreichbar." }, 502);
  }
}
