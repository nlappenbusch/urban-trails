import { createHash, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Mp3Encoder } from "@breezystack/lamejs";
import type { Stop, Tour } from "./types";

/**
 * Audioguides: echte Sprecherstimme statt Browser-Roboter.
 *
 * Standard ist Gemini-TTS (Stimme «Sulafat», per GEMINI_TTS_VOICE wählbar).
 * Ist ElevenLabs vollständig konfiguriert, hat es Vorrang.
 * Jede Datei trägt einen Hash aus Text, Stimme, Regie und Modell im Namen:
 * ändert sich der Text, entsteht automatisch eine neue Aufnahme.
 */

export const DEFAULT_STYLE =
  "Lies als packender deutscher Audioguide vor – lebendig, warm, mit deutlicher Betonung und kleinen Spannungspausen:";
const CACHE_DIR = () => path.join(process.cwd(), ".audio-cache");

type Provider = "elevenlabs" | "gemini";

function provider(): Provider {
  const key = process.env.ELEVENLABS_API_KEY, voice = process.env.ELEVENLABS_VOICE_ID;
  return key && voice && !key.startsWith("your_") && !voice.startsWith("your_") ? "elevenlabs" : "gemini";
}

export function audioBaseName(tour: Pick<Tour, "citySlug" | "slug">, stop: Pick<Stop, "id">) {
  return `${tour.citySlug}-${tour.slug}-${stop.id}`.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function audioIdentity(tour: Pick<Tour, "citySlug" | "slug">, stop: Pick<Stop, "id" | "audioScript">) {
  const p = provider();
  const voice = (p === "elevenlabs" ? process.env.ELEVENLABS_VOICE_ID! : process.env.GEMINI_TTS_VOICE || "Sulafat").trim();
  const model = (p === "elevenlabs" ? process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2" : process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-tts").trim();
  const style = p === "gemini" ? (process.env.GEMINI_TTS_STYLE || DEFAULT_STYLE).trim() : "";
  const version = createHash("sha256")
    .update(JSON.stringify({ text: stop.audioScript, provider: p, voice: voice.toLowerCase(), model, style }))
    .digest("hex")
    .slice(0, 16);
  const voiceSlug = voice.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 24) || "voice";
  return { version, voice, model, provider: p, file: path.join(CACHE_DIR(), `${audioBaseName(tour, stop)}-${voiceSlug}-${version}.mp3`) };
}

export function audioUrl(tour: Tour, stop: Stop) {
  return `/api/audio?${new URLSearchParams({ city: tour.citySlug, tour: tour.slug, stop: stop.id, v: audioIdentity(tour, stop).version })}`;
}

export function isAudioAdmin(req: Request) {
  const expected = process.env.AUDIO_ADMIN_TOKEN, supplied = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!expected || expected.length < 32 || !supplied) return false;
  const a = Buffer.from(expected), b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Aufnahmen vom Juni 2026 (Dateiname ohne Hash). Gültig, solange der Text
 *  seither unverändert ist – geändert wurde nur dieser eine Stopp. */
const LEGACY_STALE = new Set(["zuerich-zuerich-klassiker-landesmuseum"]);

export async function readAudio(tour: Tour, stop: Stop) {
  const id = audioIdentity(tour, stop);
  try {
    return await fs.readFile(id.file);
  } catch {
    /* weiter: alte Aufnahme? */
  }
  const base = audioBaseName(tour, stop);
  if (id.provider !== "gemini" || LEGACY_STALE.has(base)) return null;
  try {
    return await fs.readFile(path.join(CACHE_DIR(), `${base}-${id.voice.toLowerCase().replace(/[^a-z0-9-]/g, "")}.mp3`));
  } catch {
    return null;
  }
}

/** PCM (16-bit mono) → MP3, ~10× kleiner als WAV – wichtig fürs Streamen unterwegs. */
function pcmToMp3(pcm: Buffer, sampleRate: number): Buffer {
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2));
  const enc = new Mp3Encoder(1, sampleRate, 64);
  const chunks: Buffer[] = [];
  for (let i = 0; i < samples.length; i += 1152) {
    const out = enc.encodeBuffer(samples.subarray(i, i + 1152));
    if (out.length) chunks.push(Buffer.from(out));
  }
  const tail = enc.flush();
  if (tail.length) chunks.push(Buffer.from(tail));
  return Buffer.concat(chunks);
}

async function viaGemini(text: string, voice: string, model: string): Promise<Buffer> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw Error("Gemini nicht eingerichtet.");
  const style = (process.env.GEMINI_TTS_STYLE || DEFAULT_STYLE).trim();
  const res = await fetch(
    `https://aiplatform.googleapis.com/v1/publishers/google/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      signal: AbortSignal.timeout(120000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${style}\n\n${text}` }] }],
        generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
      }),
    }
  );
  if (!res.ok) throw Error(`Gemini-TTS ${res.status}`);
  const data = await res.json();
  const part = (data?.candidates?.[0]?.content?.parts as { inlineData?: { mimeType?: string; data?: string } }[] | undefined)?.find((p) => p.inlineData?.data);
  if (!part?.inlineData?.data) throw Error("Gemini lieferte kein Audio.");
  const rate = /rate=(\d+)/.exec(part.inlineData.mimeType ?? "");
  return pcmToMp3(Buffer.from(part.inlineData.data, "base64"), rate ? Number(rate[1]) : 24000);
}

async function viaElevenLabs(text: string, voice: string, model: string): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`, {
    method: "POST",
    signal: AbortSignal.timeout(90000),
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: model, voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true } }),
  });
  if (!res.ok || !res.headers.get("content-type")?.startsWith("audio/")) throw Error("Spracherstellung fehlgeschlagen.");
  return Buffer.from(await res.arrayBuffer());
}

const pending = new Map<string, Promise<void>>();

/** Erzeugt die Aufnahme genau einmal (parallele Anfragen teilen sich den Auftrag). */
export async function generateAudio(tour: Tour, stop: Stop) {
  const id = audioIdentity(tour, stop);
  if (await readAudio(tour, stop)) return;
  const existing = pending.get(id.file);
  if (existing) return existing;
  const task = (async () => {
    const bytes = id.provider === "elevenlabs" ? await viaElevenLabs(stop.audioScript, id.voice, id.model) : await viaGemini(stop.audioScript, id.voice, id.model);
    if (bytes.length < 1024) throw Error("Leere Audiodatei.");
    await fs.mkdir(path.dirname(id.file), { recursive: true });
    const tmp = `${id.file}.${createHash("sha256").update(String(Math.random())).digest("hex").slice(0, 8)}.tmp`;
    try {
      await fs.writeFile(tmp, bytes);
      await fs.rename(tmp, id.file);
    } finally {
      await fs.unlink(tmp).catch(() => {});
    }
  })();
  pending.set(id.file, task);
  try {
    await task;
  } finally {
    pending.delete(id.file);
  }
}
