import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getTour } from "@/lib/tours";
import { Mp3Encoder } from "@breezystack/lamejs";

const DEFAULT_STYLE =
  "Lies als packender deutscher Audioguide vor – lebendig, warm, mit deutlicher Betonung und kleinen Spannungspausen:";

const CACHE_DIR = path.join(process.cwd(), ".audio-cache");

/** PCM (16-bit mono) → MP3. ~10× kleiner als WAV – entscheidend für
 *  mobiles Streaming: 90 s Story = ~400 KB statt ~4 MB. */
function pcmToMp3(pcm: Buffer, sampleRate: number): Buffer {
  const samples = new Int16Array(
    pcm.buffer,
    pcm.byteOffset,
    Math.floor(pcm.length / 2)
  );
  const enc = new Mp3Encoder(1, sampleRate, 48);
  const chunks: Buffer[] = [];
  const BLOCK = 1152;
  for (let i = 0; i < samples.length; i += BLOCK) {
    const out = enc.encodeBuffer(samples.subarray(i, i + BLOCK));
    if (out.length > 0) chunks.push(Buffer.from(out));
  }
  const tail = enc.flush();
  if (tail.length > 0) chunks.push(Buffer.from(tail));
  return Buffer.concat(chunks);
}

function pcmToWav(pcm: Buffer, sampleRate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function readCache(key: string): Promise<{ data: Buffer; type: string } | null> {
  for (const [ext, type] of [
    ["mp3", "audio/mpeg"],
    ["wav", "audio/wav"],
  ] as const) {
    try {
      const data = await fs.readFile(path.join(CACHE_DIR, `${key}.${ext}`));
      return { data, type };
    } catch {
      /* nicht im Cache */
    }
  }
  return null;
}

async function writeCache(key: string, ext: "mp3" | "wav", data: Buffer) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(path.join(CACHE_DIR, `${key}.${ext}`), data);
  } catch {
    /* Best-Effort */
  }
}

function audioResponse(
  data: Buffer,
  type: string,
  req?: NextRequest
): NextResponse {
  const headers: Record<string, string> = {
    "Content-Type": type,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };
  // Range-Requests → 206: Browser streamt und kann spulen, statt die
  // ganze Datei zu laden (iOS Safari spielt ohne das gar nicht erst ab).
  const range = req?.headers.get("range");
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m && (m[1] || m[2])) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2]
        ? Math.min(parseInt(m[2], 10), data.length - 1)
        : data.length - 1;
      if (start <= end && start < data.length) {
        headers["Content-Range"] = `bytes ${start}-${end}/${data.length}`;
        headers["Content-Length"] = String(end - start + 1);
        return new NextResponse(new Uint8Array(data.subarray(start, end + 1)), {
          status: 206,
          headers,
        });
      }
    }
  }
  headers["Content-Length"] = String(data.length);
  return new NextResponse(new Uint8Array(data), { headers });
}

async function elevenLabs(text: string, cacheKey: string): Promise<NextResponse | null> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId || apiKey.startsWith("your_")) return null;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.35,
          use_speaker_boost: true,
        },
      }),
    }
  );
  if (!res.ok) return null;

  const data = Buffer.from(await res.arrayBuffer());
  await writeCache(cacheKey, "mp3", data);
  return audioResponse(data, "audio/mpeg");
}

async function geminiTts(text: string, cacheKey: string): Promise<NextResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const voice = process.env.GEMINI_TTS_VOICE ?? "Sulafat";
  const style = process.env.GEMINI_TTS_STYLE ?? DEFAULT_STYLE;

  const res = await fetch(
    `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-tts:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${style}\n\n${text}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
          },
        },
      }),
    }
  );
  if (!res.ok) return null;

  const data = await res.json();
  interface InlinePart {
    inlineData?: { mimeType?: string; data?: string };
  }
  const part = (
    data?.candidates?.[0]?.content?.parts as InlinePart[] | undefined
  )?.find((p) => p.inlineData?.data);
  if (!part?.inlineData?.data) return null;

  const pcm = Buffer.from(part.inlineData.data, "base64");
  const rateMatch = /rate=(\d+)/.exec(part.inlineData.mimeType ?? "");
  const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;

  try {
    const mp3 = pcmToMp3(pcm, sampleRate);
    await writeCache(cacheKey, "mp3", mp3);
    return audioResponse(mp3, "audio/mpeg");
  } catch {
    /* MP3-Encoding fehlgeschlagen → unkomprimiertes WAV als Fallback */
  }
  const wav = pcmToWav(pcm, sampleRate);
  await writeCache(cacheKey, "wav", wav);
  return audioResponse(wav, "audio/wav");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? "";
  const tourSlug = searchParams.get("tour") ?? "";
  const stopId = searchParams.get("stop") ?? "";

  const tour = getTour(city, tourSlug);
  const stop = tour?.stops.find((s) => s.id === stopId);
  if (!tour || !stop) {
    return NextResponse.json({ error: "Stop nicht gefunden." }, { status: 404 });
  }

  const voice = process.env.GEMINI_TTS_VOICE ?? "Sulafat";
  const cacheKey = `${city}-${tourSlug}-${stopId}-${voice}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  const cached = await readCache(cacheKey);
  if (cached) {
    // Migration: noch als WAV gecachte Audios einmalig zu MP3 komprimieren
    if (cached.type === "audio/wav" && cached.data.length > 44) {
      try {
        const sampleRate = cached.data.readUInt32LE(24);
        const mp3 = pcmToMp3(cached.data.subarray(44), sampleRate);
        await writeCache(cacheKey, "mp3", mp3);
        return audioResponse(mp3, "audio/mpeg", req);
      } catch {
        /* WAV weiter ausliefern */
      }
    }
    return audioResponse(cached.data, cached.type, req);
  }

  const fromElevenLabs = await elevenLabs(stop.audioScript, cacheKey);
  if (fromElevenLabs) return fromElevenLabs;

  const fromGemini = await geminiTts(stop.audioScript, cacheKey);
  if (fromGemini) return fromGemini;

  return NextResponse.json(
    { error: "Kein TTS-Dienst konfiguriert – Browser-TTS-Fallback nutzen." },
    { status: 503 }
  );
}
