"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  citySlug: string;
  tourSlug: string;
  stopId: string;
  stopName: string;
  script: string;
  audioFile?: string;
}

type Mode = "idle" | "loading" | "audio" | "browser-tts" | "error";

/** Globales Event, damit (a) immer nur ein Audio läuft und (b) die
 *  Sticky-Bar anzeigen kann, was gerade gespielt wird. */
export interface UtAudioEventDetail {
  stopId: string;
  stopName: string;
  state: "play" | "pause" | "ended" | "time";
  t?: number;
  d?: number;
}
function emit(detail: UtAudioEventDetail) {
  window.dispatchEvent(new CustomEvent<UtAudioEventDetail>("ut-audio", { detail }));
}

function fmt(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  citySlug,
  tourSlug,
  stopId,
  stopName,
  script,
  audioFile,
}: AudioPlayerProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const lastEmitSec = useRef(-1);
  const playRef = useRef<() => void>(() => {});

  // Sticky-Bar kann diesen Player fernsteuern (Play/Pause-Toggle)
  useEffect(() => {
    playRef.current = play;
  });
  useEffect(() => {
    function onCtl(e: Event) {
      const det = (e as CustomEvent<{ stopId: string }>).detail;
      if (det.stopId === stopId) playRef.current();
    }
    window.addEventListener("ut-audio-ctl", onCtl);
    return () => window.removeEventListener("ut-audio-ctl", onCtl);
  }, [stopId]);

  // Anderes Audio gestartet? → dieses stoppen.
  useEffect(() => {
    function onOther(e: Event) {
      const det = (e as CustomEvent<UtAudioEventDetail>).detail;
      if (det.state === "play" && det.stopId !== stopId) stopPlayback(true);
    }
    window.addEventListener("ut-audio", onOther);
    return () => {
      window.removeEventListener("ut-audio", onOther);
      audioRef.current?.pause();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopId]);

  function wireAudio(audio: HTMLAudioElement) {
    audioRef.current = audio;
    audio.ontimeupdate = () => {
      setT(audio.currentTime);
      setD(audio.duration || 0);
      // Sticky-Bar nur 1×/Sekunde aktualisieren
      const sec = Math.floor(audio.currentTime);
      if (sec !== lastEmitSec.current) {
        lastEmitSec.current = sec;
        emit({ stopId, stopName, state: "time", t: audio.currentTime, d: audio.duration || 0 });
      }
    };
    audio.onloadedmetadata = () => setD(audio.duration || 0);
    audio.onended = () => {
      setPlaying(false);
      setT(0);
      emit({ stopId, stopName, state: "ended" });
    };
  }

  async function play() {
    if (playing) {
      pause();
      return;
    }
    // Resume?
    if (audioRef.current && t > 0) {
      await audioRef.current.play();
      setPlaying(true);
      emit({ stopId, stopName, state: "play", t, d });
      return;
    }
    setMode("loading");

    const preferTts = process.env.NEXT_PUBLIC_PREFER_TTS === "1";
    if (audioFile && !preferTts) {
      try {
        const audio = new Audio(audioFile);
        wireAudio(audio);
        await audio.play();
        setMode("audio");
        setPlaying(true);
        emit({ stopId, stopName, state: "play" });
        return;
      } catch {
        /* weiter */
      }
    }

    try {
      const res = await fetch(
        `/api/audio?city=${citySlug}&tour=${tourSlug}&stop=${stopId}`
      );
      if (res.ok && res.headers.get("content-type")?.includes("audio")) {
        const blob = await res.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        wireAudio(audio);
        await audio.play();
        setMode("audio");
        setPlaying(true);
        emit({ stopId, stopName, state: "play" });
        return;
      }
    } catch {
      /* weiter zum Fallback */
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(script);
      u.lang = "de-CH";
      u.rate = 0.95;
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const timer = setTimeout(
            () => resolve(window.speechSynthesis.getVoices()),
            1500
          );
          window.speechSynthesis.onvoiceschanged = () => {
            clearTimeout(timer);
            resolve(window.speechSynthesis.getVoices());
          };
        });
      }
      const de =
        voices.find((v) => v.lang === "de-CH") ??
        voices.find((v) => v.lang.startsWith("de"));
      if (de) u.voice = de;
      u.onend = () => {
        setPlaying(false);
        emit({ stopId, stopName, state: "ended" });
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      setMode("browser-tts");
      setPlaying(true);
      emit({ stopId, stopName, state: "play" });
      return;
    }

    setMode("error");
  }

  function pause() {
    audioRef.current?.pause();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setPlaying(false);
    emit({ stopId, stopName, state: "pause", t, d });
  }

  function stopPlayback(silent: boolean) {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setPlaying(false);
    setT(0);
    if (!silent) emit({ stopId, stopName, state: "ended" });
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar || !d) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * d;
    setT(audio.currentTime);
  }

  const pct = d > 0 ? (t / d) * 100 : 0;
  const hasBar = mode === "audio" && (d > 0 || playing);

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-3">
        <button
          onClick={play}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-signal-500 text-white shadow-sm transition hover:bg-signal-600 active:scale-95"
          aria-label={playing ? "Pause" : "Audioguide abspielen"}
        >
          {mode === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1" width="4" height="12" rx="1"/><rect x="9" y="1" width="4" height="12" rx="1"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11a1 1 0 0 0 1.5.87l9-5.5a1 1 0 0 0 0-1.74l-9-5.5A1 1 0 0 0 3 1.5z"/></svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-bold text-cream">
              Audio-Story{playing && mode === "browser-tts" ? " · Browser-Stimme" : ""}
            </p>
            {hasBar && (
              <p className="shrink-0 font-mono text-xs tabular-nums text-cream-faint">
                {fmt(t)} / {fmt(d)}
              </p>
            )}
          </div>
          {hasBar ? (
            <div
              ref={barRef}
              onClick={seek}
              className="mt-1.5 h-2 w-full cursor-pointer overflow-hidden rounded-full bg-ink-700"
              role="progressbar"
              aria-valuenow={Math.round(pct)}
            >
              <div
                className="h-full rounded-full bg-signal-500 transition-[width] duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
          ) : (
            <p className="mt-0.5 truncate text-xs text-cream-faint">
              {mode === "error"
                ? "Audio nicht verfügbar"
                : mode === "browser-tts" && playing
                  ? "spricht…"
                  : "Play drücken – Geschichte hören statt lesen"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
