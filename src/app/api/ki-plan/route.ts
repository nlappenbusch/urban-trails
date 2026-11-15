import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { kiPlan } from "@/lib/ki-plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Kostenbremse: höchstens so viele KI-Programme pro Tag für alle zusammen
const DAILY_CAP = Number(process.env.KI_DAILY_CAP) || 400;
let day = "";
let used = 0;

/**
 * POST /api/ki-plan  { messages: string[], start?: { name, lat?, lng? } }
 * Antwort: Programm aus geprüften Orten (siehe lib/ki-plan.ts). Texte werden nicht gespeichert.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (limited(`ki:${ip}`, 8, 10 * 60_000)) return json({ error: "Langsam – höchstens 8 Programme in 10 Minuten." }, 429);
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    used = 0;
  }
  if (used >= DAILY_CAP) return json({ error: "Der KI-Planer hat für heute Feierabend. Der normale Planer funktioniert weiter." }, 503);

  let body: { messages?: unknown; start?: { name?: unknown; lat?: unknown; lng?: unknown } };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ungültige Anfrage." }, 400);
  }
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .map((m) => String(m).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 600))
    .filter(Boolean)
    .slice(-5);
  if (!messages.length || messages.join("").length < 8) return json({ error: "Erzähl mir ein bisschen mehr – wer, wann, worauf ihr Lust habt." }, 400);
  const s = body.start;
  const start =
    s && typeof s.name === "string" && s.name.length < 80
      ? { name: s.name, lat: Number.isFinite(Number(s.lat)) ? Number(s.lat) : undefined, lng: Number.isFinite(Number(s.lng)) ? Number(s.lng) : undefined }
      : undefined;

  used++;
  try {
    return json(await kiPlan({ messages, start }));
  } catch (e) {
    console.warn("[ki-plan]", (e as Error).message);
    return json({ error: "Die KI ist gerade nicht erreichbar. Versuch es gleich nochmals oder nimm den normalen Planer." }, 502);
  }
}
