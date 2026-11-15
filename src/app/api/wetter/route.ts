import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { forecast } from "@/lib/wetter";
import { allRegions, regionInfo } from "@/lib/ausfluege";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/wetter?region=basel       → 7-Tage-Vorhersage für die Region
 * GET /api/wetter?alle=1             → heute + morgen für alle Ausflugsregionen
 */
export async function GET(req: NextRequest) {
  if (limited(`wetter:${clientIp(req)}`, 30, 60_000)) return json({ error: "Zu viele Abfragen – kurz warten." }, 429);
  const sp = req.nextUrl.searchParams;
  const cache = { "Cache-Control": "public, max-age=900" };
  try {
    if (sp.get("alle") === "1") {
      const out: Record<string, unknown> = {};
      await Promise.all(
        allRegions().map(async (r) => {
          try {
            out[r.slug] = (await forecast(r.center.lat, r.center.lng)).slice(0, 3);
          } catch {
            /* Region ohne Wetter – kein Abbruch */
          }
        }),
      );
      return json({ regions: out }, 200, cache);
    }
    const r = regionInfo(sp.get("region") ?? "");
    if (!r) return json({ error: "Unbekannte Region." }, 400);
    return json({ region: r.slug, days: await forecast(r.center.lat, r.center.lng) }, 200, cache);
  } catch (e) {
    console.warn("[wetter]", (e as Error).message);
    return json({ error: "Wetterdienst gerade nicht erreichbar." }, 502);
  }
}
