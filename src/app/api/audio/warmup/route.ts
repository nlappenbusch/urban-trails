import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { tours } from "@/lib/tours";

/**
 * GET /api/audio/warmup        → generiert bis zu 8 fehlende Audios
 * GET /api/audio/warmup?limit=32 → mehr pro Durchlauf
 *
 * Einmal (oder mehrmals) aufrufen, bis "remaining: 0" – danach laden alle
 * Audioguides sofort aus dem Cache. Resumable: bereits generierte Stops
 * werden übersprungen. Dev-Server muss laufen.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.max(1, Math.min(64, Number(searchParams.get("limit")) || 8));
  const voice = (process.env.GEMINI_TTS_VOICE ?? "Sulafat").toLowerCase();
  const cacheDir = path.join(process.cwd(), ".audio-cache");

  const all = tours.flatMap((t) =>
    t.stops.map((s) => ({ city: t.citySlug, tour: t.slug, stop: s.id }))
  );

  // Fehlende ermitteln
  const missing: typeof all = [];
  for (const item of all) {
    const key = `${item.city}-${item.tour}-${item.stop}-${voice}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    const exists = await Promise.any(
      ["mp3", "wav"].map((ext) =>
        fs.access(path.join(cacheDir, `${key}.${ext}`)).then(() => true)
      )
    ).catch(() => false);
    if (!exists) missing.push(item);
  }

  const batch = missing.slice(0, limit);
  const generated: string[] = [];
  const failed: string[] = [];

  for (const item of batch) {
    try {
      const res = await fetch(
        `${req.nextUrl.origin}/api/audio?city=${item.city}&tour=${item.tour}&stop=${item.stop}`
      );
      if (res.ok) {
        await res.arrayBuffer(); // Stream konsumieren, damit gecacht wird
        generated.push(`${item.tour}/${item.stop}`);
      } else {
        failed.push(`${item.tour}/${item.stop} (HTTP ${res.status})`);
      }
    } catch {
      failed.push(`${item.tour}/${item.stop}`);
    }
  }

  return NextResponse.json({
    total: all.length,
    generated,
    failed,
    remaining: missing.length - generated.length,
    hint:
      missing.length - generated.length > 0
        ? "Nochmal aufrufen, bis remaining 0 ist."
        : "Alle Audios gecacht – jeder Play-Klick lädt jetzt sofort.",
  });
}
