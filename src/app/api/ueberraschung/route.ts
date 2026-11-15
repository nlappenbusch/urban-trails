import { NextRequest } from "next/server";
import { clientIp, json, limited } from "@/lib/api-utils";
import { AUDIENCE, getPlace } from "@/lib/ausfluege";
import { findTrips, plusMin, resolveStart, zurichNow } from "@/lib/finder";
import { encodeMystery, type Mystery } from "@/lib/mystery";
import { weatherKind } from "@/lib/wetter-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Nächster Samstag (oder heute, wenn Samstag) – Vorgabe für die Überraschung. */
function nextSaturday(today: string) {
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + ((6 - d.getUTCDay() + 7) % 7));
  return d.toISOString().slice(0, 10);
}

/**
 * GET /api/ueberraschung?start=Olten&datum=YYYY-MM-DD&mit=paar&budget=80&nicht=basel,bern
 * → ein ausgelostes Ziel als Link-Token; der Browser zeigt erst nur Abfahrt, Gleis und Packliste.
 */
export async function GET(req: NextRequest) {
  if (limited(`mystery:${clientIp(req)}`, 10, 60_000)) return json({ error: "Zu viele Abfragen – kurz warten." }, 429);
  const sp = req.nextUrl.searchParams;
  const startQ = (sp.get("start") ?? "").trim().slice(0, 80);
  if (!startQ) return json({ error: "Startort fehlt." }, 400);
  const now = zurichNow();
  const wanted = sp.get("datum") ?? "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(wanted) && wanted >= now.date ? wanted : nextSaturday(now.date);
  if (date === now.date && now.time > "11:00") return json({ error: "Für heute ist es zu spät für eine Überraschung – nimm ein anderes Datum." }, 200);
  const audience = AUDIENCE[sp.get("mit") ?? ""] ? sp.get("mit")! : "paar";
  const maxCost = Math.min(500, Math.max(0, Number(sp.get("budget")) || 0)) || undefined;
  const exclude = (sp.get("nicht") ?? "").split(",").filter(Boolean).slice(0, 20);

  try {
    const start = await resolveStart(startQ);
    if (!start) return json({ error: "Diesen Ort kennt der Fahrplan nicht." }, 400);
    const soon = plusMin(now.time, 20);
    const depTime = date === now.date && soon > "08:30" ? soon : "08:30";
    const found = await findTrips({ start, date, depTime, audience, moods: [], randomness: 3, maxCost, exclude, count: 3 });
    if (!found.length) return json({ error: maxCost ? "Mit diesem Budget finden wir an dem Tag nichts – etwas mehr erlauben?" : "An diesem Tag finden wir keine passende Verbindung." }, 200);
    const f = found[Math.floor(Math.random() * found.length)];

    const ps = f.day.slots.map((s) => getPlace(s.placeId)).filter((p): p is NonNullable<typeof p> => Boolean(p));
    const kind = f.weather ? weatherKind(f.weather.code) : "wolken";
    const tmax = f.weather?.tmax;
    const pack = [
      f.rain || kind === "regen" || kind === "gewitter" ? "schirm" : "",
      ps.some((p) => p.kind === "aussicht" || p.tags.includes("berg")) && (tmax === undefined || tmax < 16) ? "warm" : "",
      ps.some((p) => p.kind === "bad") ? "bad" : "",
      kind === "sonne" && (tmax ?? 0) >= 16 ? "sonne" : "",
      ps.filter((p) => p.kind === "aktivitaet" || p.kind === "sehenswuerdigkeit" || p.kind === "aussicht").length >= 2 ? "schuhe" : "",
      ps.some((p) => p.kind === "restaurant") ? "hunger" : "",
      "karte",
    ].filter(Boolean);

    const m: Mystery = {
      r: f.region.slug,
      n: f.region.name,
      d: date,
      s: f.connection.from,
      t: f.connection.dep,
      g: f.connection.platform,
      a: f.connection.arr,
      m: f.connection.durationMin,
      u: f.connection.transfers,
      w: audience,
      p: pack,
      ...(f.cost.missing <= 1 && f.cost.high > 0 ? { c: [f.cost.low, f.cost.high] as [number, number] } : {}),
      ...(f.weather ? { wc: f.weather.code, wt: Math.round(f.weather.tmax) } : {}),
    };
    return json({ token: encodeMystery(m) });
  } catch (e) {
    console.warn("[ueberraschung]", (e as Error).message);
    return json({ error: "Fahrplan oder Wetter gerade nicht erreichbar." }, 502);
  }
}
