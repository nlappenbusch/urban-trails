import { NextRequest, NextResponse } from "next/server";
import { getTour } from "@/lib/tours";
import { generateAudio, isAudioAdmin, readAudio } from "@/lib/audio-server";
export async function POST(req: NextRequest) {
    if (!isAudioAdmin(req))
        return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    const tour = getTour(req.nextUrl.searchParams.get("city") ?? "", req.nextUrl.searchParams.get("tour") ?? "");
    if (!tour)
        return NextResponse.json({ error: "Tour nicht gefunden." }, { status: 404 });
    const limit = Math.max(1, Math.min(3, Number(req.nextUrl.searchParams.get("limit")) || 1));
    const generated: string[] = [], failed: string[] = [];
    for (const stop of tour.stops) {
        if (generated.length + failed.length >= limit)
            break;
        if (await readAudio(tour, stop))
            continue;
        try {
            await generateAudio(tour, stop);
            generated.push(stop.id);
        }
        catch {
            failed.push(stop.id);
        }
    }
    return NextResponse.json({ generated, failed });
}
