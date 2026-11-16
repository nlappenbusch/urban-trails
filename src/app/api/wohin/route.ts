import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { forecast, isRainy } from "@/lib/wetter";
import { weatherKind, WEATHER_LABEL } from "@/lib/wetter-core";
import { wohin, type Mit, type Wetter } from "@/lib/wohin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/wohin?lat=46.95&lng=7.44&wetter=auto|egal|schoen|regen&mit=kinder,hund,gruppe&n=30
 * → passende Ziele, bei «auto» mit Wetter von heute am Startort.
 */
export async function GET(req: NextRequest) {
  if (limited(`wohin:${clientIp(req)}`, 60, 60_000)) return json({ error: "Zu viele Abfragen – kurz warten." }, 429);
  const sp = req.nextUrl.searchParams;
  const lat = Number.parseFloat(sp.get("lat") ?? "");
  const lng = Number.parseFloat(sp.get("lng") ?? "");
  const hasPos = Number.isFinite(lat) && Number.isFinite(lng) && lat > 45.5 && lat < 48 && lng > 5.8 && lng < 10.6;
  const mit = (sp.get("mit") ?? "").split(",").filter((m): m is Mit => m === "kinder" || m === "hund" || m === "gruppe");
  const want = sp.get("wetter") ?? "auto";
  const limit = Math.min(Math.max(Number.parseInt(sp.get("n") ?? "30", 10) || 30, 10), 90);

  let wetter: Wetter = want === "schoen" || want === "regen" || want === "egal" ? want : "egal";
  let heute: { kind: string; label: string; tmax: number; tmin: number; rainProb: number } | undefined;
  if (want === "auto" && hasPos) {
    try {
      const d = (await forecast(lat, lng))[0];
      if (d) {
        const kind = weatherKind(d.code);
        heute = { kind, label: WEATHER_LABEL[kind], tmax: d.tmax, tmin: d.tmin, rainProb: d.rainProb };
        wetter = isRainy(d) || kind === "regen" || kind === "gewitter" ? "regen" : kind === "sonne" ? "schoen" : "egal";
      }
    } catch {
      /* ohne Wetter weiter */
    }
  }
  const r = wohin({ ...(hasPos ? { lat, lng } : {}), wetter, mit, limit });
  return json({ wetter, heute, ...r }, 200, { "Cache-Control": "public, max-age=600" });
}
