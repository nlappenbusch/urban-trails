import { NextRequest, NextResponse } from "next/server";
import { getTour } from "@/lib/tours";

/**
 * POST /api/guide
 * Body: { city, tour, stopId?, question }
 *
 * "Frag deinen Guide": beantwortet Nutzerfragen während der Tour
 * mit Kontext über die aktuelle Route. Benötigt OPENAI_API_KEY.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("sk-your")) {
    return NextResponse.json(
      { error: "KI-Guide nicht konfiguriert (OPENAI_API_KEY fehlt)." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body?.question || !body?.city || !body?.tour) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const tour = getTour(body.city, body.tour);
  if (!tour) {
    return NextResponse.json({ error: "Tour nicht gefunden." }, { status: 404 });
  }

  const currentStop = body.stopId
    ? tour.stops.find((s) => s.id === body.stopId)
    : undefined;

  const context = [
    `Tour: ${tour.name} (${tour.claim})`,
    `Stops: ${tour.stops.map((s, i) => `${i + 1}. ${s.name}`).join(", ")}`,
    currentStop
      ? `Aktueller Standort des Nutzers: ${currentStop.name} (${currentStop.coords.lat}, ${currentStop.coords.lng}). Tipps hier: ${currentStop.insiderTip} ${currentStop.nearby?.map((n) => `${n.name}: ${n.note}`).join(" ") ?? ""}`
      : "",
  ].join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content: `Du bist ein lokaler Zürcher Stadtguide auf einer Walking-Tour: warm, direkt, kompakt. Antworte auf Deutsch in 2–4 Sätzen, mit konkreten Orts-Empfehlungen, wenn passend.\n\nKontext:\n${context}`,
        },
        { role: "user", content: String(body.question).slice(0, 500) },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "KI-Anfrage fehlgeschlagen." }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json({
    answer: data.choices?.[0]?.message?.content ?? "Keine Antwort erhalten.",
  });
}
