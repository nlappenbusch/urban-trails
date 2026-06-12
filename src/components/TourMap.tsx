"use client";
// Pin-Tap öffnet ein Vollbild-Detail-Sheet: Foto, alle Infos, Audio & Navigation

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Stop } from "@/lib/types";
import { getStopImage } from "@/data/images";

interface TourMapProps {
  stops: Stop[];
  gradient: [string, string];
  /** Tailwind-Höhenklassen; Vollbild-Overlay übergibt "h-full" */
  heightClass?: string;
  /** Live-Modus: GPS-Tracking sofort starten (Vollbild-Karte) */
  live?: boolean;
  /** IDs bereits abgehakter Stops → grüne Pins */
  doneIds?: string[];
  /** Wird vor dem Anker-Sprung aufgerufen (z.B. Vollbild-Overlay schliessen) */
  onJumpToStop?: (stopId: string) => void;
}

export default function TourMap({
  stops,
  gradient,
  heightClass = "h-80 sm:h-96 rounded-xl border border-cream/10",
  live = false,
  doneIds = [],
  onJumpToStop,
}: TourMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef(onJumpToStop);
  useEffect(() => {
    jumpRef.current = onJumpToStop;
  });
  const [error, setError] = useState<string | null>(null);
  /** Pin angeklickt → Vollbild-Detail-Sheet für diesen Stop */
  const [selected, setSelected] = useState<Stop | null>(null);
  /** Globaler Audio-Status (vom AudioPlayer via "ut-audio"-Events) */
  const [audio, setAudio] = useState<{
    stopId: string;
    playing: boolean;
    t: number;
    d: number;
  } | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const hasToken = Boolean(token && token.startsWith("pk."));
  const doneKey = doneIds.join(",");

  // Audio-Status spiegeln (Play/Pause-Button im Sheet)
  useEffect(() => {
    function onAudio(e: Event) {
      const det = (
        e as CustomEvent<{ stopId: string; state: string; t?: number; d?: number }>
      ).detail;
      if (det.state === "ended") {
        setAudio(null);
      } else if (det.state === "pause") {
        setAudio((p) => ({
          stopId: det.stopId,
          playing: false,
          t: det.t ?? p?.t ?? 0,
          d: det.d ?? p?.d ?? 0,
        }));
      } else {
        setAudio((p) => ({
          stopId: det.stopId,
          playing: true,
          t: det.t ?? p?.t ?? 0,
          d: det.d ?? p?.d ?? 0,
        }));
      }
    }
    window.addEventListener("ut-audio", onAudio);
    return () => window.removeEventListener("ut-audio", onAudio);
  }, []);

  // Sheet offen → Hintergrund nicht scrollen; Esc schliesst
  useEffect(() => {
    if (!selected) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  useEffect(() => {
    if (!hasToken || !containerRef.current) return;
    let map: import("mapbox-gl").Map | undefined;
    const done = new Set(doneKey ? doneKey.split(",") : []);

    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        mapboxgl.accessToken = token!;

        const bounds = new mapboxgl.LngLatBounds();
        stops.forEach((s) => bounds.extend([s.coords.lng, s.coords.lat]));

        map = new mapboxgl.Map({
          container: containerRef.current!,
          style: "mapbox://styles/mapbox/dark-v11",
          bounds,
          fitBoundsOptions: { padding: live ? 80 : 60 },
        });
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        // Live-Standort: blauer Punkt + Blickrichtung, folgt dir beim Laufen
        const geo = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
        });
        map.addControl(geo, "top-right");

        map.on("load", async () => {
          if (!map) return;
          if (live) geo.trigger();
          // Echte Fusswege via Mapbox Directions API – Fallback: Luftlinie
          let routeCoords: [number, number][] = stops.map((s) => [
            s.coords.lng,
            s.coords.lat,
          ]);
          try {
            const wp = stops
              .map((s) => `${s.coords.lng},${s.coords.lat}`)
              .join(";");
            const res = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/walking/${wp}?geometries=geojson&overview=full&access_token=${token}`
            );
            if (res.ok) {
              const data = await res.json();
              const geom = data?.routes?.[0]?.geometry?.coordinates;
              if (Array.isArray(geom) && geom.length > 1) routeCoords = geom;
            }
          } catch {
            /* Luftlinie als Fallback */
          }
          if (!map) return;
          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: routeCoords,
              },
            },
          });
          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#ff4d00",
              "line-width": 3,
              "line-dasharray": [1, 1.5],
            },
          });
          stops.forEach((s, i) => {
            const isDone = done.has(s.id);
            const el = document.createElement("div");
            el.style.cssText = `width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font:700 12px sans-serif;color:${isDone ? "#fff" : "#100f0d"};background:${isDone ? "#10b981" : "#ff4d00"};border:2px solid #f0e9db;box-shadow:0 2px 8px rgba(0,0,0,.5);cursor:pointer`;
            el.textContent = isDone ? "✓" : String(i + 1);
            // Pin-Tap → Vollbild-Detail statt Mini-Popup
            el.onclick = (ev) => {
              ev.stopPropagation();
              setSelected(s);
            };
            new mapboxgl.Marker(el)
              .setLngLat([s.coords.lng, s.coords.lat])
              .addTo(map!);
          });
        });
      } catch {
        setError("Karte konnte nicht geladen werden.");
      }
    })();

    return () => {
      map?.remove();
    };
  }, [hasToken, token, stops, live, doneKey]);

  function toggleAudio(stopId: string) {
    window.dispatchEvent(
      new CustomEvent("ut-audio-ctl", { detail: { stopId } })
    );
  }

  function jumpToText(stopId: string) {
    setSelected(null);
    if (jumpRef.current) {
      jumpRef.current(stopId);
      // erst Overlays zu (scroll-lock weg), dann springen
      setTimeout(() => {
        window.location.hash = `#${stopId}`;
      }, 80);
    } else {
      setTimeout(() => {
        window.location.hash = `#${stopId}`;
      }, 50);
    }
  }

  if (!hasToken || error) {
    return (
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden ${heightClass}`}
        style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      >
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,#fff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative z-10 max-w-sm rounded-xl bg-black/40 p-6 text-center backdrop-blur">
          <p className="font-semibold text-white">🗺️ Interaktive Karte</p>
          <p className="mt-2 text-sm text-white/70">
            {error ??
              "Trage deinen Mapbox-Token in .env.local ein (NEXT_PUBLIC_MAPBOX_TOKEN), um die Live-Karte mit Route und allen Stops zu sehen."}
          </p>
          <p className="mt-3 text-xs text-white/50">
            {stops.length} Stops · Route als GeoJSON bereits hinterlegt
          </p>
        </div>
      </div>
    );
  }

  const selIndex = selected
    ? stops.findIndex((s) => s.id === selected.id)
    : -1;
  const selImage = selected ? getStopImage(selected.id) : undefined;
  const selDone = selected ? doneIds.includes(selected.id) : false;
  const selAudio = selected && audio?.stopId === selected.id ? audio : null;
  const audioPct = selAudio && selAudio.d > 0 ? (selAudio.t / selAudio.d) * 100 : 0;

  return (
    <>
      <div
        ref={containerRef}
        className={`w-full overflow-hidden ${heightClass}`}
      />

      {/* ───── Vollbild-Stop-Detail (Pin-Tap) ───── */}
      {selected && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-black/60 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="flex h-full w-full flex-col overflow-hidden bg-ink-950 sm:h-auto sm:max-h-[92vh] sm:max-w-lg sm:rounded-3xl sm:shadow-2xl sm:ring-1 sm:ring-cream/15"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Foto-Header */}
            <div
              className="relative h-[36dvh] min-h-52 shrink-0 sm:h-64"
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
              }}
            >
              {selImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selImage.url}
                  alt={selImage.alt}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                aria-label="Schliessen"
                className="absolute right-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-10 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-lg text-white backdrop-blur transition hover:bg-black/80"
              >
                ✕
              </button>
              {selImage && (
                <a
                  href={selImage.credit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/60 backdrop-blur transition hover:text-white"
                >
                  © Wikimedia Commons
                </a>
              )}
              <div className="absolute inset-x-4 bottom-3 flex items-center gap-3 pr-28">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold shadow-md ring-2 ring-cream/70 ${
                    selDone ? "bg-emerald-500 text-white" : "bg-signal-500 text-white"
                  }`}
                >
                  {selDone ? "✓" : selIndex + 1}
                </span>
                <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-cream [text-shadow:0_1px_6px_rgba(0,0,0,.6)]">
                  {selected.name}
                  {selected.isHiddenGem && (
                    <span className="ml-2 align-middle text-sm" title="Geheimtipp">
                      💎
                    </span>
                  )}
                </h3>
              </div>
            </div>

            {/* Infos – scrollbar */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <p className="text-sm font-medium text-cream-dim">{selected.teaser}</p>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-cream-dim">
                <p>
                  <span className="font-semibold text-cream">Warum hierhin? </span>
                  {selected.why}
                </p>
                <p>{selected.story}</p>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-lg border-l-4 border-cream/20 bg-ink-800 p-4 text-sm">
                  <span className="stamp">Fun Fact</span>
                  <p className="mt-3 leading-relaxed text-cream-dim">
                    {selected.funFact}
                  </p>
                </div>
                <div className="rounded-lg border-l-4 border-signal-500 bg-ink-800 p-4 text-sm">
                  <span className="stamp-orange">Insider</span>
                  <p className="mt-3 leading-relaxed text-cream-dim">
                    {selected.insiderTip}
                  </p>
                </div>
                {selected.photoSpot && (
                  <div className="rounded-lg border-l-4 border-cream/20 bg-ink-800 p-4 text-sm">
                    <p className="kicker">Fotospot</p>
                    <p className="mt-2 leading-relaxed text-cream-dim">
                      {selected.photoSpot}
                    </p>
                  </div>
                )}
              </div>

              {selected.nearby && selected.nearby.length > 0 && (
                <div className="mt-3 rounded-lg bg-ink-800 p-4 ring-1 ring-cream/10">
                  <span className="stamp-orange">In der Nähe</span>
                  <div className="mt-3 space-y-2.5">
                    {selected.nearby.map((n) => (
                      <p key={n.name} className="text-sm text-cream-dim">
                        <span className="font-bold text-cream">{n.name}</span>
                        {" – "}
                        {n.note}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Aktionen – fix unten */}
            <div className="shrink-0 border-t border-cream/10 bg-ink-900/95 px-4 pb-[calc(0.85rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:px-6">
              {selAudio && selAudio.d > 0 && (
                <div className="mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full bg-signal-500 transition-[width] duration-300"
                    style={{ width: `${audioPct}%` }}
                  />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleAudio(selected.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-signal-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-signal-600 active:scale-[0.97]"
                >
                  {selAudio?.playing ? "⏸ Pause" : "▶ Audio-Story"}
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.coords.lat},${selected.coords.lng}&travelmode=walking`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-cream/20 bg-ink-900 px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink-800"
                >
                  🧭 Navigation
                </a>
                <button
                  onClick={() => jumpToText(selected.id)}
                  className="inline-flex items-center rounded-full border border-cream/20 bg-ink-900 px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink-800"
                >
                  ↓ Stop-Text
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
