import { createHash, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Stop, Tour } from "./types";
export function audioIdentity(tour: Tour, stop: Stop) {
    const voice = process.env.ELEVENLABS_VOICE_ID ?? "unconfigured";
    const model = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
    const version = createHash("sha256").update(JSON.stringify({ text: stop.audioScript, voice, model, format: "mp3_44100_128", settings: { stability: .55, similarity_boost: .75, style: .35, use_speaker_boost: true } })).digest("hex").slice(0, 24);
    return { version, voice, model, file: path.join(process.cwd(), ".audio-cache", `${tour.citySlug}-${tour.slug}-${stop.id}-${version}.mp3`) };
}
export function audioUrl(tour: Tour, stop: Stop) {
    return `/api/audio?${new URLSearchParams({ city: tour.citySlug, tour: tour.slug, stop: stop.id, v: audioIdentity(tour, stop).version })}`;
}
export function isAudioAdmin(req: Request) {
    const expected = process.env.AUDIO_ADMIN_TOKEN, supplied = req.headers.get("authorization")?.replace(/^Bearer /, "");
    if (!expected || expected.length < 32 || !supplied)
        return false;
    const a = Buffer.from(expected), b = Buffer.from(supplied);
    return a.length === b.length && timingSafeEqual(a, b);
}
export async function readAudio(tour: Tour, stop: Stop) { try {
    return await fs.readFile(audioIdentity(tour, stop).file);
}
catch {
    return null;
} }
const pending = new Map<string, Promise<void>>();
export async function generateAudio(tour: Tour, stop: Stop) {
    const id = audioIdentity(tour, stop);
    if (await readAudio(tour, stop))
        return;
    const existing = pending.get(id.file);
    if (existing)
        return existing;
    const task = (async () => {
        const key = process.env.ELEVENLABS_API_KEY;
        if (!key || key.startsWith("your_") || id.voice === "unconfigured" || id.voice.startsWith("your_"))
            throw Error("ElevenLabs nicht eingerichtet.");
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id.voice)}?output_format=mp3_44100_128`, { method: "POST", signal: AbortSignal.timeout(90000), headers: { "xi-api-key": key, "Content-Type": "application/json" }, body: JSON.stringify({ text: stop.audioScript, model_id: id.model, voice_settings: { stability: .55, similarity_boost: .75, style: .35, use_speaker_boost: true } }) });
        if (!response.ok || !response.headers.get("content-type")?.startsWith("audio/"))
            throw Error("Spracherstellung fehlgeschlagen.");
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.length)
            throw Error("Leere Audiodatei.");
        await fs.mkdir(path.dirname(id.file), { recursive: true });
        const tmp = `${id.file}.${createHash("sha256").update(String(Math.random())).digest("hex").slice(0, 8)}.tmp`;
        try {
            await fs.writeFile(tmp, bytes);
            await fs.rename(tmp, id.file);
        }
        finally {
            await fs.unlink(tmp).catch(() => { });
        }
    })();
    pending.set(id.file, task);
    try {
        await task;
    }
    finally {
        pending.delete(id.file);
    }
}
