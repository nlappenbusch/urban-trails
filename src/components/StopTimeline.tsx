"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Navigation, X } from "lucide-react";
import type { GeoPoint, Stop, Tour } from "@/lib/types";
import AudioPlayer from "@/components/AudioPlayer";
import { getStopImage } from "@/data/images";
import { imgAttrs } from "@/lib/img";
import TourMap from "@/components/TourMap";
import NaviMode, { requestCompass } from "@/components/NaviMode";
import { sceneFor } from "@/lib/scene";
import RiddleCard from "@/components/RiddleCard";
import type { Riddle, TourRiddles } from "@/lib/riddle-types";
import { stopsChanged } from "@/lib/game-client";

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

const NEARBY_LABEL: Record<string, string> = {
  cafe: "Café",
  bar: "Bar",
  restaurant: "Restaurant",
  shop: "Laden",
  kino: "Kino",
  club: "Club",
};

function StopCard({
  stop,
  index,
  tour,
  done,
  onToggle,
  riddle,
}: {
  stop: Stop;
  index: number;
  tour: Tour;
  done: boolean;
  onToggle: () => void;
  riddle?: Riddle;
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
          <span className="mr-2 inline-block rounded-full bg-ink-800 px-2.5 py-0.5 font-display text-xs font-extrabold text-signal-600">
            ↓ {stop.walkMinutesFromPrevious} Min. zu Fuss
          </span>
          {stop.directions ?? ""}
        </p>
      )}

      <div className={`card overflow-hidden p-4 transition sm:p-8 ${done ? "opacity-75" : ""}`}>
        {image && (
          <div className="relative -mx-4 -mt-4 mb-4 sm:-mx-8 sm:-mt-8 sm:mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} {...imgAttrs(image)} loading="lazy" decoding="async" className="h-40 w-full object-cover sm:h-72" />
            <a
              href={image.credit}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/70 transition hover:text-white"
            >
              © Wikimedia Commons
            </a>
          </div>
        )}

        <h3 className="font-display text-xl font-extrabold tracking-tight text-cream sm:text-2xl">
          {stop.name}
          {stop.isHiddenGem && (
            <span className="ml-2 align-middle text-xs font-bold text-signal-600">Geheimtipp</span>
          )}
        </h3>
        <p className="mt-1 text-sm text-cream-dim">
          {stop.teaser} <span className="whitespace-nowrap text-cream-faint">· ca. {stop.stayMinutes} Min.</span>
        </p>

        <div className="mt-4">
          <AudioPlayer
            citySlug={tour.citySlug}
            tourSlug={tour.slug}
            stopId={stop.id}
            stopName={stop.name}
            script={stop.audioScript}
            audioFile={stop.audioFile}
            scene={sceneFor(stop)}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a
            href={mapsLink(stop)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-ink-900 px-4 py-2 text-sm font-semibold text-cream transition hover:bg-ink-800"
          >
            Navigation
          </a>
          <button
            onClick={onToggle}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.97] ${
              done
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "border border-cream/20 bg-ink-900 text-cream hover:bg-ink-800"
            }`}
          >
            {done ? "✓ Erledigt" : "Abhaken"}
          </button>
        </div>

        {riddle && (
          <div className="mt-5">
            <RiddleCard tourKey={`${tour.citySlug}/${tour.slug}`} stopId={stop.id} riddle={riddle} />
          </div>
        )}

        <details className="group mt-5 border-t border-cream/10 pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-cream hover:text-signal-600 [&::-webkit-details-marker]:hidden">
            Mehr zum Ort
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="transition group-open:rotate-180" aria-hidden="true">
              <path d="M3 5l4 4 4-4" />
            </svg>
          </summary>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-cream-dim">
            <p>
              <strong className="text-cream">Warum hierhin? </strong>
              {stop.why}
            </p>
            <p>{stop.story}</p>
            <p>
              <strong className="text-cream">Fun Fact: </strong>
              {stop.funFact}
            </p>
            <p>
              <strong className="text-cream">Insider: </strong>
              {stop.insiderTip}
            </p>
            {stop.photoSpot && (
              <p>
                <strong className="text-cream">Fotospot: </strong>
                {stop.photoSpot}
              </p>
            )}

            {stop.nearby && stop.nearby.length > 0 && (
              <div>
                <p className="font-bold text-cream">In der Nähe</p>
                <ul className="mt-2 space-y-3">
                  {stop.nearby.map((n) => (
                    <li key={n.name}>
                      <p>
                        <span className="font-semibold text-cream">{n.name}</span>
                        {NEARBY_LABEL[n.type] && <span className="text-cream-faint"> · {NEARBY_LABEL[n.type]}</span>}
                      </p>
                      <p className="mt-0.5">{n.note}</p>
                      {n.address && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-block text-xs font-bold text-signal-600 hover:text-signal-500"
                        >
                          {n.address}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stop.social && (
              <div>
                <p className="font-bold text-cream">Allein unterwegs?</p>
                <dl className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  <div><dt className="inline font-semibold text-cream">Alleine ok? </dt><dd className="inline">{stop.social.alleinOk}</dd></div>
                  <div><dt className="inline font-semibold text-cream">Gespräch? </dt><dd className="inline">{stop.social.gespraech}</dd></div>
                  <div><dt className="inline font-semibold text-cream">Publikum: </dt><dd className="inline">{stop.social.publikum}</dd></div>
                  <div><dt className="inline font-semibold text-cream">Beste Zeit: </dt><dd className="inline">{stop.social.besteZeit}</dd></div>
                </dl>
              </div>
            )}

            <details>
              <summary className="cursor-pointer font-semibold text-cream-dim hover:text-cream">Audiotext mitlesen</summary>
              <p className="mt-3 whitespace-pre-line rounded-xl bg-ink-800 p-4">{stop.audioScript}</p>
            </details>
          </div>
        </details>
      </div>
    </li>
  );
}

export default function StopTimeline({ tour, riddles = {} }: { tour: Tour; riddles?: TourRiddles }) {
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
  const [naviOpen, setNaviOpen] = useState(false);
  const listRef = useRef<HTMLOListElement | null>(null);
  const [inStops, setInStops] = useState(false);

  // Leiste nur zeigen, solange die Stopp-Liste unter ihr liegt – nicht über Kopf, FAQ, Footer.
  useEffect(() => {
    function measure() {
      const el = listRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      setInStops(r.top < h - 120 && r.bottom > h - 40); // React ignoriert gleiche Werte
    }
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.body.dataset.tourbar = "1";
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      delete document.body.dataset.tourbar;
    };
  }, []);

  // Direkt-Link «#navi» (z.B. Button oben in der Tour) öffnet das Navi
  useEffect(() => {
    function check() {
      if (window.location.hash === "#navi") {
        setNaviOpen(true);
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  function openNavi() {
    void requestCompass(); // iOS fragt nur innerhalb eines Tipps
    setNaviOpen(true);
  }

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
      } else if (det.state === "time") {
        // Zeit-Updates nur für das, was wirklich läuft – Vorladen löst auch «timeupdate» aus.
        setNowPlaying((p) =>
          p && p.stopId === det.stopId ? { ...p, t: det.t ?? p.t, d: det.d ?? p.d } : p
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
      stopsChanged(`${tour.citySlug}/${tour.slug}`, [...done]);
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
    ? "Tour geschafft!"
    : atStop
      ? `Du bist hier: ${atStop.index + 1}. ${atStop.stop.name}`
      : `${completed}/${total} Stopps`;
  const statusSub = allDone
    ? "Alle Stopps besucht – Zeit für ein Abschluss-Getränk."
    : atStop
      ? `${completed}/${total} abgehakt${nextStop && nextStop.id !== atStop.stop.id ? ` · dann: ${nextStop.name}` : ""}`
      : nextStop
        ? `Nächster: ${nextStop.name}${distanceToNext !== null ? ` · ${formatDistance(distanceToNext)}` : ""}`
        : "";

  const audioPct =
    nowPlaying && nowPlaying.d > 0 ? (nowPlaying.t / nowPlaying.d) * 100 : 0;
  const barVisible = inStops || Boolean(nowPlaying && !nowPlaying.paused);

  return (
    <>
      <ol ref={listRef} className="relative space-y-10 pb-6 before:absolute before:bottom-10 before:left-[17px] before:top-4 sm:before:left-6 before:w-0 before:border-l-2 before:border-dashed before:border-signal-500/40">
        {tour.stops.map((stop, i) => (
          <StopCard
            key={stop.id}
            stop={stop}
            index={i}
            tour={tour}
            done={done.has(stop.id)}
            onToggle={() => toggle(stop.id)}
            riddle={riddles[stop.id]}
          />
        ))}
      </ol>

      {/* ───── Tour-Leiste: nur sichtbar, solange die Stopps unter ihr liegen (oder Audio läuft) ───── */}
      <div
        aria-hidden={!barVisible}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-ink-900 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
          barVisible ? "translate-y-0" : "pointer-events-none translate-y-[110%]"
        }`}
      >
        <div className="h-1 bg-ink-700">
          <div
            className="h-full bg-signal-500 transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
        <div className="container-page flex h-16 items-center gap-2">
          {nowPlaying ? (
            <>
              <button
                onClick={toggleAudio}
                tabIndex={barVisible ? 0 : -1}
                aria-label={nowPlaying.paused ? "Weiter abspielen" : "Pause"}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-signal-500 text-white transition hover:bg-signal-600 active:scale-95"
              >
                {nowPlaying.paused ? (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11a1 1 0 0 0 1.5.87l9-5.5a1 1 0 0 0 0-1.74l-9-5.5A1 1 0 0 0 3 1.5z"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor"><rect x="1" y="1" width="4" height="12" rx="1"/><rect x="9" y="1" width="4" height="12" rx="1"/></svg>
                )}
              </button>
              <a href={`#${nowPlaying.stopId}`} tabIndex={barVisible ? 0 : -1} className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-cream">{nowPlaying.stopName}</span>
                <span className="block truncate font-mono text-[11px] tabular-nums text-cream-faint">
                  {nowPlaying.paused ? "pausiert · " : ""}
                  {nowPlaying.d > 0 ? `${fmtTime(nowPlaying.t)} / ${fmtTime(nowPlaying.d)}` : "lädt …"}
                </span>
              </a>
            </>
          ) : (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-cream">{statusMain}</p>
              <p className="truncate text-xs text-cream-dim">{statusSub}</p>
            </div>
          )}
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={toggleGeo}
              tabIndex={barVisible ? 0 : -1}
              aria-label="Standort verfolgen"
              aria-pressed={geoState === "on"}
              title="Standort verfolgen (Distanz + «du bist hier»)"
              className={`grid h-10 w-10 place-items-center rounded-full transition ${
                geoState === "on"
                  ? "bg-signal-500 text-white"
                  : "border border-cream/20 bg-ink-900 text-cream-dim hover:bg-ink-800"
              }`}
            >
              {geoState === "loading" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
              )}
            </button>
            <button
              aria-label="Karte öffnen"
              tabIndex={barVisible ? 0 : -1}
              onClick={() => setMapOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 bg-ink-900 text-cream transition hover:bg-ink-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></svg>
            </button>
            {allDone ? (
              <button
                onClick={() => setDone(new Set())}
                tabIndex={barVisible ? 0 : -1}
                className="h-10 rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-semibold text-cream transition hover:bg-ink-800"
              >
                Reset
              </button>
            ) : (
              <button
                onClick={openNavi}
                tabIndex={barVisible ? 0 : -1}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-signal-500 px-4 text-sm font-extrabold text-white transition hover:bg-signal-600 active:scale-95"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 L20 21 L12 16.5 L4 21 Z" /></svg>
                Navi
              </button>
            )}
          </div>
        </div>
      </div>

      {naviOpen && (
        <NaviMode
          tour={tour}
          riddles={riddles}
          done={done}
          onDone={(id) => setDone((prev) => new Set(prev).add(id))}
          onClose={() => setNaviOpen(false)}
        />
      )}

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
            <X size={16} aria-hidden="true" />
            Karte schliessen
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
                      {nowPlaying.stopName}
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
                  Du bist hier: {atStop.index + 1}. {atStop.stop.name}
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
                    <Navigation size={14} aria-hidden="true" />
                    Navigation starten
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
                    Zum Text
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
