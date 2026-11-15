import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { allLakeTemps, riverTemps, waterForPlace } from "@/lib/wasser";
import { places } from "@/lib/ausfluege";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/wasser?ids=zh-s-letten,bern-s-marzili → Live-Temperatur je Badeort
 * GET /api/wasser?alle=1                          → alle Flussstationen (BAFU) und Seen (Alplakes)
 */
export async function GET(req: NextRequest) {
  if (limited(`wasser:${clientIp(req)}`, 30, 60_000)) return json({ error: "Zu viele Abfragen – kurz warten." }, 429);
  const sp = req.nextUrl.searchParams;
  const cache = { "Cache-Control": "public, max-age=900" };
  try {
    if (sp.get("alle") === "1") {
      const [rivers, lakes] = await Promise.all([riverTemps().catch(() => []), allLakeTemps()]);
      return json({ rivers, lakes }, 200, cache);
    }
    const ids = (sp.get("ids") ?? "").split(",").filter(Boolean).slice(0, 40);
    const out: Record<string, unknown> = {};
    await Promise.all(
      ids.map(async (id) => {
        const p = places.find((x) => x.id === id);
        if (!p) return;
        try {
          const r = await waterForPlace(p);
          if (r) out[id] = r;
        } catch {
          /* Quelle gerade weg – Ort ohne Wert */
        }
      }),
    );
    return json({ readings: out }, 200, cache);
  } catch (e) {
    console.warn("[wasser]", (e as Error).message);
    return json({ error: "Messdienst gerade nicht erreichbar." }, 502);
  }
}
