"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoPoint, Stop, Tour } from "@/lib/types";
import AudioPlayer from "@/components/AudioPlayer";
import { getStopImage } from "@/data/images";
import TourMap from "@/components/TourMap";

/** Luftlinien-Distanz in Metern (Haversine) */
function distanceMeters(a: GeoPoint, b: GeoPoint): number {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
}

function mapsLink(stop: Stop): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${stop.coords.lat},${stop.coords.lng}&travelmode=walking`;
}

function StopCard({
  stop,
  index,
  tour,
  done,
  onToggle,
}: {
  stop: Stop;
  index: number;
  tour: Tour;
  done: boolean;
  onToggle: () => void;
}) {
  const image = getStopImage(stop.id);
  return (
    <li className="relative scroll-mt-24 pl-12 sm:pl-20" id={stop.id}>
      <div
        className={`absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full font-display text-sm font-extrabold text-white shadow-md ring-4 ring-ink-950 transition sm:h-12 sm:w-12 sm:text-lg ${
          done ? "bg-emerald-500" : "bg-signal-500"
        }`}
      >
        {done ? "✓" : index + 1}
      </div>

      {stop.walkMinutesFromPrevious > 0 && (
        <p className="mb-4 text-sm leading-relaxed text-cream-faint">
          <span className="mr-2 inline-block rounded-full bg-ink-800 px-2.5 py-0.5 font-display text-xs font-extrabold uppercase tracking-wide text-signal-600">
            ↓ {stop.walkMinutesFromPrevious} Min. zu Fuss
          </span>
          {stop.directions ?? ""}
        </p>
      )}

      <div
        className={`card overflow-hidden p-4 transition sm:p-8 ${done ? "opacity-75" : ""}`}
      >
        {image && (
          <div className="relative -mx-4 -mt-4 mb-5 sm:-mx-8 sm:-mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="h-44 w-full object-cover sm:h-72"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
            <a
              href={image.credit}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/60 backdrop-blur transition hover:text-white"
            >
              © Wikimedia Commons
            </a>
          </div>
        )}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-cream">
              {stop.name}
              {stop.isHiddenGem && (
                <span className="ml-2 align-middle text-sm" title="Geheimtipp">
                  💎
                </span>
              )}
            </h3>
            <p className="mt-1 text-sm text-cream-dim">{stop.teaser}</p>
          </div>
          <span className="chip shrink-0">~{stop.stayMinutes} Min. Aufenthalt</span>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-cream-dim">
          <p>
            <span className="font-semibold text-cream">Warum hierhin? </span>
            {stop.why}
          </p>
          <p>{stop.story}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border-l-4 border-cream/20 bg-ink-800 p-4 text-sm">
            <span className="stamp">Fun Fact</span>
            <p className="mt-3 leading-relaxed text-cream-dim">{stop.funFact}</p>
          </div>
          <div className="rounded-lg border-l-4 border-signal-500 bg-ink-800 p-4 text-sm">
            <span className="stamp-orange">Insider</span>
            <p className="mt-3 leading-relaxed text-cream-dim">
              {stop.insiderTip}
            </p>
          </div>
          {stop.photoSpot && (
            <div className="rounded-lg border-l-4 border-cream/20 bg-ink-800 p-4 text-sm sm:col-span-2">
              <p className="kicker">Fotospot</p>
              <p className="mt-2 leading-relaxed text-cream-dim">
                {stop.photoSpot}
              </p>
            </div>
          )}
        </div>

        {stop.social && (
          <div className="mt-4 rounded-lg bg-ink-800 p-4 text-sm ring-1 ring-cream/10">
            <span className="stamp">Social-Check</span>
            <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <p className="text-cream-dim">
                <span className="font-bold text-signal-600">Alleine ok? </span>
                {stop.social.alleinOk}
              </p>
              <p className="text-cream-dim">
                <span className="font-bold text-signal-600">Gespräch? </span>
                {stop.social.gespraech}
              </p>
              <p className="text-cream-dim">
                <span className="font-bold text-signal-600">Publikum: </span>
                {stop.social.publikum}
              </p>
              <p className="text-cream-dim">
                <span className="font-bold text-signal-600">Beste Zeit: </span>
                {stop.social.besteZeit}
              </p>
            </div>
          </div>
        )}

        {stop.nearby && stop.nearby.length > 0 && (
          <div className="mt-4 rounded-lg bg-ink-800 p-4 ring-1 ring-cream/10">
            <span className="stamp-orange">In der Nähe</span>
            <div className="mt-3 space-y-3">
              {stop.nearby.map((n) => (
                <div key={n.name} className="text-sm">
                  <p className="font-bold text-cream">
                    {n.name}
                    <span className="ml-2 font-normal uppercase tracking-widest text-cream-faint">
                      {n.type === "cafe" && "Café"}
                      {n.type === "bar" && "Bar"}
                      {n.type === "restaurant" && "Restaurant"}
                      {n.type === "shop" && "Laden"}
                      {n.type === "kino" && "Kino"}
                      {n.type === "club" && "Club"}
                    </span>
                  </p>
                  <p className="mt-0.5 leading-relaxed text-cream-dim">
                    {n.note}
                  </p>
                  {n.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-block text-xs font-bold text-signal-400 hover:text-signal-500"
                    >
                      📍 {n.address}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-cream/10 pt-5">
          <AudioPlayer
            citySlug={tour.citySlug}
            tourSlug={tour.slug}
            stopId={stop.id}
            stopName={stop.name}
            script={stop.audioScript}
            audioFile={stop.audioFile}
          />
          <a
            href={mapsLink(stop)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-ink-900 px-4 py-2 text-sm font-semibold text-cream transition hover:bg-white/10"
          >
            🧭 Navigation
          </a>
          <button
            onClick={onToggle}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.97] ${
              done
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "border border-white/15 bg-white/5 text-cream hover:bg-white/10"
            }`}
          >
            {done ? "✓ Erledigt" : "Stop abhaken"}
          </button>
        </div>

        <details className="mt-3 text-sm text-cream-dim">
          <summary className="cursor-pointer font-medium text-cream-dim hover:text-cream">
            Audioguide-Skript lesen (auch perfekt für ElevenLabs)
          </summary>
          <p className="mt-3 whitespace-pre-line rounded-2xl bg-black/30 p-4 leading-relaxed">
            {stop.audioScript}
          </p>
        </details>
      </div>
    </li>
  );
}

export default function StopTimeline({ tour }: { tour: Tour }) {
  const storageKey = `ut-progress-${tour.citySlug}-${tour.slug}`;
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [geoState, setGeoState] = useState<"off" | "loading" | "on" | "denied">("off");
  const watchIdRef = useRef<number | null>(null);
  const [nowPlaying, setNowPlaying] = useState<{
    stopId: string;
    stopName: string;
    t: number;
    d: number;
    paused: boolean;
  } | null>(null);
  const [mapOpen, setMapOpen] = useState(false);

  // Lauscht auf den globalen Audio-Status (siehe AudioPlayer)
  useEffect(() => {
    function onAudio(e: Event) {
      const det = (e as CustomEvent<{
        stopId: string; stopName: string; state: string; t?: number; d?: number;
      }>).detail;
      if (det.state === "ended") {
        setNowPlaying((p) => (p && p.stopId === det.stopId ? null : p));
      } else if (det.state === "pause") {
        setNowPlaying((p) =>
          p && p.stopId === det.stopId
            ? { ...p, t: det.t ?? p.t, d: det.d ?? p.d, paused: true }
            : p
        );
      } else {
        setNowPlaying({
          stopId: det.stopId,
          stopName: det.stopName,
          t: det.t ?? 0,
          d: det.d ?? 0,
          paused: false,
        });
      }
    }
    window.addEventListener("ut-audio", onAudio);
    return () => window.removeEventListener("ut-audio", onAudio);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDone(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify([...done]));
    } catch {
      /* ignore */
    }
  }, [done, loaded, storageKey]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation?.clearWatch(watchIdRef.current);
    };
  }, []);

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleGeo() {
    if (geoState === "on" || geoState === "loading") {
      if (watchIdRef.current !== null)
        navigator.geolocation?.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setPosition(null);
      setGeoState("off");
      return;
    }
    if (!("geolocation" in navigator)) {
      setGeoState("denied");
      return;
    }
    setGeoState("loading");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoState("on");
      },
      () => setGeoState("denied"),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  }

  const nextStop = useMemo(
    () => tour.stops.find((s) => !done.has(s.id)),
    [tour.stops, done]
  );
  const completed = done.size;
  const total = tour.stops.length;
  const allDone = completed === total;
  const distanceToNext =
    position && nextStop ? distanceMeters(position, nextStop.coords) : null;

  // Wo bin ich gerade? Nächstgelegener Stop per GPS (<120 m = "du bist hier")
  const nearest = useMemo(() => {
    if (!position) return null;
    let bestIdx = -1;
    let bestDist = Infinity;
    tour.stops.forEach((stop, index) => {
      const dist = distanceMeters(position, stop.coords);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = index;
      }
    });
    if (bestIdx < 0) return null;
    return { stop: tour.stops[bestIdx], index: bestIdx, dist: bestDist };
  }, [position, tour.stops]);
  const atStop = nearest && nearest.dist < 120 ? nearest : null;

  // Vollbild-Karte: Hintergrund nicht mitscrollen
  useEffect(() => {
    document.body.style.overflow = mapOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mapOpen]);

  function fmtTime(sec: number): string {
    if (!isFinite(sec) || sec < 0) return "0:00";
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
  }

  function toggleAudio() {
    if (!nowPlaying) return;
    window.dispatchEvent(
      new CustomEvent("ut-audio-ctl", { detail: { stopId: nowPlaying.stopId } })
    );
  }

  const statusMain = allDone
    ? "🎉 Tour geschafft!"
    : atStop
      ? `📍 Du bist hier: ${atStop.index + 1}. ${atStop.stop.name}`
      : `${completed}/${total} Stops`;
  const statusSub = allDone
    ? "Alle Stops besucht – Zeit für ein Abschluss-Getränk."
    : atStop
      ? `${completed}/${total} abgehakt${nextStop && nextStop.id !== atStop.stop.id ? ` · dann: ${nextStop.name}` : ""}`
      : nextStop
        ? `Nächster: ${nextStop.name}${distanceToNext !== null ? ` · 📍 ${formatDistance(distanceToNext)}` : ""}`
        : "";

  const audioPct =
    nowPlaying && nowPlaying.d > 0 ? (nowPlaying.t / nowPlaying.d) * 100 : 0;

  return (
    <>
      <ol className="relative space-y-10 pb-40 before:absolute before:bottom-44 before:left-[17px] before:top-4 sm:before:left-6 before:w-0 before:border-l-2 before:border-dashed before:border-signal-500/40">
        {tour.stops.map((stop, i) => (
          <StopCard
            key={stop.id}
            stop={stop}
            index={i}
            tour={tour}
            done={done.has(stop.id)}
            onToggle={() => toggle(stop.id)}
          />
        ))}
      </ol>

      {/* ───── Tour-Modus-Leiste (unten, mobile-first) ───── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.08)] backdrop-blur-md">
        <div
          className="h-1 bg-gradient-to-r from-signal-400 to-signal-600 transition-all duration-500"
          style={{ width: `${(completed / total) * 100}%` }}
        />
        <div className="container-page py-2.5">
          {/* Mini-Player: was läuft + wo in der Spur */}
          {nowPlaying && (
            <div className="mb-2 flex items-center gap-2.5 border-b border-cream/10 pb-2">
              <button
                onClick={toggleAudio}
                aria-label={nowPlaying.paused ? "Weiter abspielen" : "Pause"}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal-500 text-white transition hover:bg-signal-600 active:scale-95"
              >
                {nowPlaying.paused ? (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11a1 1 0 0 0 1.5.87l9-5.5a1 1 0 0 0 0-1.74l-9-5.5A1 1 0 0 0 3 1.5z"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1" width="4" height="12" rx="1"/><rect x="9" y="1" width="4" height="12" rx="1"/></svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <a
                  href={`#${nowPlaying.stopId}`}
                  className="block truncate text-xs font-bold text-cream hover:text-signal-600"
                >
                  ♪ {nowPlaying.stopName}
                  {nowPlaying.paused && (
                    <span className="ml-1.5 font-normal text-cream-faint">pausiert</span>
                  )}
                </a>
                {nowPlaying.d > 0 && (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                    <div
                      className="h-full rounded-full bg-signal-500 transition-[width] duration-300"
                      style={{ width: `${audioPct}%` }}
                    />
                  </div>
                )}
              </div>
              {nowPlaying.d > 0 && (
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-cream-faint">
                  {fmtTime(nowPlaying.t)} / {fmtTime(nowPlaying.d)}
                </span>
              )}
            </div>
          )}

          {/* Status + Aktionen */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-cream">{statusMain}</p>
              <p className="truncate text-xs text-cream-dim">{statusSub}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={toggleGeo}
                title="Standort verfolgen (Distanz + «du bist hier»)"
                className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition ${
                  geoState === "on"
                    ? "bg-signal-500 text-white"
                    : "border border-cream/20 bg-ink-900 text-cream-dim hover:bg-ink-800"
                }`}
              >
                {geoState === "loading" ? "⏳" : "📍"}
              </button>
              <button
                onClick={() => setMapOpen(true)}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-bold text-cream transition hover:bg-ink-800"
              >
                🗺 <span className="hidden sm:inline">Karte</span>
              </button>
              {allDone ? (
                <button
                  onClick={() => setDone(new Set())}
                  className="h-10 rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-semibold text-cream transition hover:bg-ink-800"
                >
                  Reset
                </button>
              ) : (
                nextStop && (
                  <a
                    href={`#${nextStop.id}`}
                    className="inline-flex h-10 items-center rounded-full bg-signal-500 px-3.5 text-sm font-bold text-white transition hover:bg-signal-600"
                  >
                    Weiter ↓
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───── Vollbild-Live-Karte ───── */}
      {mapOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950">
          <TourMap
            stops={tour.stops}
            gradient={tour.gradient}
            heightClass="h-full"
            live
            doneIds={[...done]}
            onJumpToStop={() => setMapOpen(false)}
          />
          <button
            onClick={() => setMapOpen(false)}
            aria-label="Karte schliessen"
            className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-ink-900/95 px-5 py-2.5 text-sm font-bold text-cream shadow-lg ring-1 ring-cream/15 backdrop-blur transition hover:bg-ink-900"
          >
            ✕ Karte schliessen
          </button>
          {(atStop || nextStop || nowPlaying) && (
            <div className="absolute inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-10 mx-auto max-w-md rounded-2xl bg-ink-900/95 p-4 shadow-xl ring-1 ring-cream/15 backdrop-blur">
              {nowPlaying && (
                <div className="mb-3 flex items-center gap-2.5 border-b border-cream/10 pb-3">
                  <button
                    onClick={toggleAudio}
                    aria-label={nowPlaying.paused ? "Weiter abspielen" : "Pause"}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal-500 text-white transition hover:bg-signal-600 active:scale-95"
                  >
                    {nowPlaying.paused ? (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11a1 1 0 0 0 1.5.87l9-5.5a1 1 0 0 0 0-1.74l-9-5.5A1 1 0 0 0 3 1.5z"/></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1" width="4" height="12" rx="1"/><rect x="9" y="1" width="4" height="12" rx="1"/></svg>
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-cream">
                      ♪ {nowPlaying.stopName}
                      {nowPlaying.paused && (
                        <span className="ml-1.5 font-normal text-cream-faint">pausiert</span>
                      )}
                    </p>
                    {nowPlaying.d > 0 && (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                        <div
                          className="h-full rounded-full bg-signal-500 transition-[width] duration-300"
                          style={{ width: `${audioPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {nowPlaying.d > 0 && (
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-cream-faint">
                      {fmtTime(nowPlaying.t)} / {fmtTime(nowPlaying.d)}
                    </span>
                  )}
                </div>
              )}
              {atStop ? (
                <p className="text-sm font-bold text-cream">
                  📍 Du bist hier: {atStop.index + 1}. {atStop.stop.name}
                </p>
              ) : (
                nextStop && (
                  <p className="text-sm font-bold text-cream">
                    Als Nächstes: {nextStop.name}
                    {distanceToNext !== null && (
                      <span className="font-normal text-cream-dim">
                        {" "}· {formatDistance(distanceToNext)}
                      </span>
                    )}
                  </p>
                )
              )}
              <div className="mt-2.5 flex gap-2">
                {nextStop && (
                  <a
                    href={mapsLink(nextStop)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-signal-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-signal-600"
                  >
                    🧭 Navigation starten
                  </a>
                )}
                {(atStop || nextStop) && (
                  <button
                    onClick={() => {
                      const id = (atStop ? atStop.stop : nextStop!).id;
                      setMapOpen(false);
                      setTimeout(() => {
                        window.location.hash = `#${id}`;
                      }, 80);
                    }}
                    className="inline-flex items-center rounded-full border border-cream/20 px-4 py-2 text-xs font-bold text-cream transition hover:bg-ink-800"
                  >
                    Zum Stop-Text ↓
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
