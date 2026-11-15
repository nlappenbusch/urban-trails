"use client";

import { useEffect, useRef, useState } from "react";
import type { AmbienceScene } from "@/lib/scene";
import {
  ambienceEnabled,
  finishAmbience,
  onAmbiencePref,
  setAmbienceEnabled,
  startAmbience,
  stopAmbience,
} from "@/lib/ambience";

interface AudioPlayerProps {
  citySlug: string;
  tourSlug: string;
  stopId: string;
  stopName: string;
  /** Text bleibt für Mitlese-Ansicht und Tests erhalten – vorgelesen wird nur echte Stimme. */
  script: string;
  audioFile?: string;
  /** Klangkulisse des Ortes (Wasser, Glocken, Vögel …) */
  scene?: AmbienceScene;
}

type Mode = "idle" | "loading" | "audio" | "error";

/** Globales Event, damit (a) immer nur ein Audio läuft und (b) die
 *  Sticky-Bar / das Navi anzeigen kann, was gerade gespielt wird. */
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
  audioFile,
  scene,
}: AudioPlayerProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);
  const [ambience, setAmbience] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const lastEmitSec = useRef(-1);
  const playRef = useRef<() => void>(() => {});
  const rootRef = useRef<HTMLDivElement | null>(null);
  const prefetched = useRef(false);
  const playingRef = useRef(false);
  playingRef.current = playing;

  useEffect(() => {
    setAmbience(ambienceEnabled());
    return onAmbiencePref((on) => {
      setAmbience(on);
      if (on && playingRef.current) startAmbience(scene, 1.5);
    });
  }, [scene]);

  // Sticky-Bar / Navi können diesen Player fernsteuern (Play/Pause-Toggle)
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

  const preferTts = process.env.NEXT_PUBLIC_PREFER_TTS === "1";
  const src = audioFile && !preferTts ? audioFile : `/api/audio?city=${citySlug}&tour=${tourSlug}&stop=${stopId}`;

  // Audio schon beim Scrollen vorladen → Play startet sofort.
  function prefetch() {
    if (prefetched.current || audioRef.current) return;
    prefetched.current = true;
    const audio = new Audio(src);
    audio.preload = "auto";
    wireAudio(audio);
  }

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          prefetch();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Anderes Audio gestartet? → dieses stoppen.
  useEffect(() => {
    function onOther(e: Event) {
      const det = (e as CustomEvent<UtAudioEventDetail>).detail;
      if (det.state === "play" && det.stopId !== stopId) stopPlayback();
    }
    window.addEventListener("ut-audio", onOther);
    return () => {
      window.removeEventListener("ut-audio", onOther);
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopId]);

  function wireAudio(audio: HTMLAudioElement) {
    audioRef.current = audio;
    audio.ontimeupdate = () => {
      setT(audio.currentTime);
      setD(audio.duration || 0);
      const sec = Math.floor(audio.currentTime);
      // Vorladen löst auch «timeupdate» aus – nur melden, was wirklich spielt.
      if (!audio.paused && sec !== lastEmitSec.current) {
        lastEmitSec.current = sec;
        emit({ stopId, stopName, state: "time", t: audio.currentTime, d: audio.duration || 0 });
      }
    };
    audio.onloadedmetadata = () => setD(audio.duration || 0);
    audio.onended = () => {
      setPlaying(false);
      setT(0);
      finishAmbience();
      emit({ stopId, stopName, state: "ended" });
    };
  }

  async function play() {
    if (playing) {
      pause();
      return;
    }
    // Andere Player stoppen und Kulisse starten – synchron im Klick (iOS).
    emit({ stopId, stopName, state: "play", t, d });
    startAmbience(scene);

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setMode("audio");
        setPlaying(true);
        return;
      } catch {
        // z.B. 503 beim Vorladen → frisch versuchen
        audioRef.current = null;
        setT(0);
      }
    }
    setMode("loading");
    try {
      // Streaming: Abspielen beginnt, sobald die ersten Sekunden da sind.
      // Beim allerersten Abruf eines Stopps wird die Aufnahme erzeugt (~20 s).
      const audio = new Audio(src);
      audio.preload = "auto";
      wireAudio(audio);
      await audio.play();
      setMode("audio");
      setPlaying(true);
    } catch {
      audioRef.current = null;
      prefetched.current = false;
      stopAmbience(0.8);
      setPlaying(false);
      setMode("error");
      emit({ stopId, stopName, state: "ended" });
    }
  }

  function pause() {
    audioRef.current?.pause();
    stopAmbience(1.2);
    setPlaying(false);
    emit({ stopId, stopName, state: "pause", t, d });
  }

  function stopPlayback() {
    if (!playingRef.current && !audioRef.current?.currentTime) return;
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setPlaying(false);
    setT(0);
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
    <div ref={rootRef} className="w-full max-w-md">
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
            <p className="inline-flex min-w-0 items-center gap-1.5 truncate text-sm font-bold text-cream">
              {playing && (
                <span className="eq shrink-0 text-signal-500" aria-hidden="true"><i /><i /><i /><i /></span>
              )}
              Audio-Story
            </p>
            {hasBar ? (
              <p className="shrink-0 font-mono text-xs tabular-nums text-cream-faint">
                {fmt(t)} / {fmt(d)}
              </p>
            ) : null}
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
              {mode === "loading" ? (
                <span className="inline-flex items-center gap-1.5 font-semibold text-signal-600">
                  <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
                  Story wird geladen…
                </span>
              ) : mode === "error" ? (
                "Audio gerade nicht erreichbar – nochmal tippen oder unten mitlesen"
              ) : (
                "Geschichte zum Ort hören"
              )}
            </p>
          )}
        </div>
        {scene && (
          <button
            onClick={() => setAmbienceEnabled(!ambience)}
            aria-pressed={ambience}
            aria-label="Klangkulisse"
            title={ambience ? "Klangkulisse ausschalten" : "Klangkulisse einschalten"}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition ${
              ambience ? "bg-signal-500/10 text-signal-600 ring-1 ring-signal-500/40" : "bg-ink-800 text-cream-faint ring-1 ring-cream/10"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
              <path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity=".5" />
              {!ambience && <path d="M4 4l16 16" />}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
