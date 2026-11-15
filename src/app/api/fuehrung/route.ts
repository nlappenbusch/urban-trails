import { NextRequest, NextResponse } from "next/server";
import { destinations } from "@/data/destinations";
import { tours } from "@/lib/tours";
import { notifyTeam, parseRequest, storeRequest, tooMany } from "@/lib/guide-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: noStore });

const cities = new Map(destinations.filter((d) => !d.comingSoon).map((d) => [d.slug, d.name]));
const tourMap = new Map(tours.map((t) => [t.slug, { name: t.name, city: t.citySlug }]));

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Ungültige Herkunft." }, 403);
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ungültige Anfrage." }, 400);
  }
  // Falle für Bots: Feld ist für Menschen unsichtbar
  if (String(body.website ?? "").trim()) return json({ ok: true, id: "F-OK" });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (tooMany(ip)) return json({ error: "Zu viele Anfragen in kurzer Zeit. Bitte später nochmal." }, 429);

  const parsed = parseRequest(body, { cities, tours: tourMap });
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  const r = parsed.req;

  try {
    await storeRequest(r);
  } catch (e) {
    console.error("[fuehrung] Speichern fehlgeschlagen:", (e as Error).message);
    return json({ error: "Die Anfrage konnte gerade nicht gespeichert werden. Bitte versuch es gleich nochmal." }, 500);
  }
  const mailed = await notifyTeam(r, { city: cities.get(r.city)!, tour: r.tour ? tourMap.get(r.tour)?.name : undefined });
  console.log(`[fuehrung] Anfrage ${r.id} (${r.city}, ${r.groupSize} Pers.) gespeichert, Mail ${mailed ? "verschickt" : "nicht verschickt"}`);
  return json({ ok: true, id: r.id });
}
