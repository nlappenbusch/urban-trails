import { NextRequest, NextResponse } from "next/server";
import { getTour } from "@/lib/tours";
import { audioIdentity, generateAudio, isAudioAdmin, readAudio } from "@/lib/audio-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function lookup(req: NextRequest) { const q = req.nextUrl.searchParams; const tour = getTour(q.get("city") ?? "", q.get("tour") ?? ""); return { tour, stop: tour?.stops.find(s => s.id === q.get("stop")) }; }
export async function GET(req: NextRequest) {
    const { tour, stop } = lookup(req);
    if (!tour || !stop)
        return NextResponse.json({ error: "Stop nicht gefunden." }, { status: 404 });
    const version = audioIdentity(tour, stop).version;
    if (req.nextUrl.searchParams.has("v") && req.nextUrl.searchParams.get("v") !== version)
        return NextResponse.json({ error: "Audio aktualisiert. Tour erneut laden." }, { status: 410 });
    const bytes = await readAudio(tour, stop);
    if (!bytes)
        return NextResponse.json({ error: "Audio noch nicht verfügbar. Du kannst den Text mitlesen." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    const headers = { "Content-Type": "audio/mpeg", "Accept-Ranges": "bytes", "Cache-Control": req.nextUrl.searchParams.has("v") ? "public, max-age=31536000, immutable" : "no-store" };
    const range = req.headers.get("range");
    if (range) {
        const m = /^bytes=(\d*)-(\d*)$/.exec(range);
        const invalid = () => new NextResponse(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${bytes.length}` } });
        if (!m || (!m[1] && !m[2]))
            return invalid();
        const start = m[1] ? Number(m[1]) : Math.max(0, bytes.length - Number(m[2]));
        const end = m[1] && m[2] ? Math.min(Number(m[2]), bytes.length - 1) : bytes.length - 1;
        if (start > end || start >= bytes.length)
            return invalid();
        return new NextResponse(new Uint8Array(bytes.subarray(start, end + 1)), { status: 206, headers: { ...headers, "Content-Length": String(end - start + 1), "Content-Range": `bytes ${start}-${end}/${bytes.length}` } });
    }
    return new NextResponse(new Uint8Array(bytes), { headers: { ...headers, "Content-Length": String(bytes.length) } });
}
export async function POST(req: NextRequest) {
    if (!isAudioAdmin(req))
        return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    const { tour, stop } = lookup(req);
    if (!tour || !stop)
        return NextResponse.json({ error: "Stop nicht gefunden." }, { status: 404 });
    try {
        await generateAudio(tour, stop);
        return NextResponse.json({ ready: true, version: audioIdentity(tour, stop).version });
    }
    catch {
        return NextResponse.json({ error: "Audio konnte nicht erstellt werden. Konfiguration und Kontingent prüfen." }, { status: 502 });
    }
}
