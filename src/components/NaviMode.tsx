"use client";
/**
 * Navi-Modus fürs Handy: Vollbild-Karte, Pfeil zum nächsten Stopp,
 * Abbiegehinweise, Ankunft mit Vibration und grossem «Story hören».
 * Display bleibt an (Wake Lock), Kompass wenn erlaubt.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeoPoint, Tour } from "@/lib/types";
import { distanceMeters } from "@/lib/gps";
import { bearing, buildRoute, formatMeters, maneuverAngle, nextStep, pointAt, project, walkMinutes, type LngLat, type NavRoute } from "@/lib/nav";
import { getStopImage } from "@/data/images";
import { ambienceEnabled, onAmbiencePref, setAmbienceEnabled } from "@/lib/ambience";

interface Fix extends GeoPoint {
  acc: number;
  heading: number | null;
  speed: number | null;
}

type OrientationEventCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

/** Kompass-Freigabe (iOS) – muss direkt im Tipp-Handler aufgerufen werden. */
export async function requestCompass(): Promise<boolean> {
  const D = (typeof window !== "undefined" ? window.DeviceOrientationEvent : undefined) as OrientationEventCtor | undefined;
  if (!D) return false;
  if (typeof D.requestPermission !== "function") return true;
  try {
    return (await D.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

function Arrow({ angle, size = 56 }: { angle: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ transform: `rotate(${angle}deg)`, transition: "transform 300ms ease-out" }} aria-hidden="true">
      <path d="M24 4 L38 40 L24 32 L10 40 Z" fill="currentColor" />
    </svg>
  );
}

function TurnIcon({ angle }: { angle: number }) {
  if (Math.abs(angle) === 180)
    return (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 20V9a5 5 0 0 1 10 0v3" /><path d="M5 16l4 4 4-4" />
      </svg>
    );
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: `rotate(${angle}deg)` }}>
      <path d="M12 21V5" /><path d="M6 11l6-6 6 6" />
    </svg>
  );
}

export default function NaviMode({
  tour,
  done,
  onDone,
  onClose,
}: {
  tour: Tour;
  done: Set<string>;
  onDone: (id: string) => void;
  onClose: () => void;
}) {
  const stops = tour.stops;
  const firstOpen = Math.max(0, stops.findIndex((s) => !done.has(s.id)));
  const [idx, setIdx] = useState(firstOpen);
  const target = stops[Math.min(idx, stops.length - 1)];
  const allDone = stops.every((s) => done.has(s.id));

  const [fix, setFix] = useState<Fix | null>(null);
  const [geo, setGeo] = useState<"searching" | "ok" | "denied" | "unsupported">("searching");
  const [heading, setHeading] = useState<number | null>(null);
  const [route, setRoute] = useState<NavRoute | null>(null);
  const [arrivedId, setArrivedId] = useState<string | null>(null);
  const [follow, setFollow] = useState(true);
  const [ambience, setAmbience] = useState(true);
  const [audio, setAudio] = useState<{ stopId: string; playing: boolean; t: number; d: number } | null>(null);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const glRef = useRef<typeof import("mapbox-gl").default | null>(null);
  const markers = useRef<{ el: HTMLDivElement; id: string }[]>([]);
  const userMarker = useRef<{ marker: import("mapbox-gl").Marker; el: HTMLDivElement } | null>(null);
  const lastFetch = useRef(0);
  const fetching = useRef(false);
  const routeFromUser = useRef(false);
  const [mapReady, setMapReady] = useState(0);
  const followRef = useRef(follow);
  followRef.current = follow;

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const hasMap = Boolean(token && token.startsWith("pk."));
  const arrived = arrivedId === target.id;

  // ── Scroll sperren, Wake Lock, Ambience-Präferenz ───────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as unknown as { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
    const acquire = () => {
      if (document.visibilityState === "visible" && nav.wakeLock)
        nav.wakeLock.request("screen").then((l) => (lock = l)).catch(() => {});
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    setAmbience(ambienceEnabled());
    const off = onAmbiencePref(setAmbience);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("visibilitychange", acquire);
      void lock?.release().catch(() => {});
      off();
    };
  }, []);

  // ── Audio-Status spiegeln ──────────────────────────────────
  useEffect(() => {
    function onAudio(e: Event) {
      const det = (e as CustomEvent<{ stopId: string; state: string; t?: number; d?: number }>).detail;
      if (det.state === "ended") setAudio((p) => (p?.stopId === det.stopId ? null : p));
      else
        setAudio((p) => ({
          stopId: det.stopId,
          playing: det.state !== "pause",
          t: det.t ?? (p?.stopId === det.stopId ? p.t : 0),
          d: det.d ?? (p?.stopId === det.stopId ? p.d : 0),
        }));
    }
    window.addEventListener("ut-audio", onAudio);
    return () => window.removeEventListener("ut-audio", onAudio);
  }, []);

  // ── Standort ───────────────────────────────────────────────
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeo("unsupported");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setGeo("ok");
        setFix({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          acc: p.coords.accuracy,
          heading: p.coords.heading != null && Number.isFinite(p.coords.heading) ? p.coords.heading : null,
          speed: p.coords.speed,
        });
      },
      (err) => setGeo(err.code === err.PERMISSION_DENIED ? "denied" : "searching"),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // ── Kompass ────────────────────────────────────────────────
  useEffect(() => {
    let smooth: number | null = null;
    function onOrient(e: DeviceOrientationEvent & { webkitCompassHeading?: number }) {
      let h: number | null = null;
      if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
      else if (e.absolute && e.alpha != null) h = (360 - e.alpha) % 360;
      if (h == null) return;
      if (smooth == null) smooth = h;
      else {
        const diff = ((h - smooth + 540) % 360) - 180;
        smooth = (smooth + diff * 0.25 + 360) % 360;
      }
      setHeading(Math.round(smooth));
    }
    const evt = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(evt, onOrient as EventListener);
    return () => window.removeEventListener(evt, onOrient as EventListener);
  }, []);

  // ── Route berechnen (Mapbox Fussweg) ───────────────────────
  const fetchRoute = useCallback(
    async (from: GeoPoint, fromUser: boolean) => {
      if (fetching.current) return;
      fetching.current = true;
      lastFetch.current = Date.now();
      routeFromUser.current = fromUser;
      const to = target.coords;
      try {
        if (!hasMap) throw Error("no token");
        const res = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${from.lng},${from.lat};${to.lng},${to.lat}?geometries=geojson&overview=full&steps=true&language=de&access_token=${token}`
        );
        const data = await res.json();
        const r = data?.routes?.[0];
        if (!res.ok || !r?.geometry?.coordinates?.length) throw Error("no route");
        setRoute(buildRoute(r.geometry.coordinates as LngLat[], r.legs?.[0]?.steps ?? [], from, target.id));
      } catch {
        // Ohne Netz/Token: Luftlinie
        setRoute(buildRoute([[from.lng, from.lat], [to.lng, to.lat]], [], from, target.id));
      } finally {
        fetching.current = false;
      }
    },
    [hasMap, target, token]
  );

  // Neues Ziel → neu berechnen (ab Standort, sonst ab vorherigem Stopp)
  useEffect(() => {
    setRoute(null);
    const prev = stops[idx - 1];
    if (fix) void fetchRoute(fix, true);
    else if (prev) void fetchRoute(prev.coords, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const progress = useMemo(() => (route && fix ? project(route, fix) : null), [route, fix]);
  const directDist = fix ? distanceMeters(fix, target.coords) : null;

  // Abweichung / erster Fix → Route ab Standort neu
  useEffect(() => {
    if (!fix || arrived) return;
    const stale = Date.now() - lastFetch.current > 12000;
    const off = progress?.off ?? 0;
    // Erster echter Fix (Route kam vom letzten Stopp) oder >40 m vom Weg abgekommen
    if (!route || (!routeFromUser.current && Date.now() - lastFetch.current > 1500) || (off > 40 && stale)) void fetchRoute(fix, true);
  }, [fix, route, progress, arrived, fetchRoute, target.id]);

  // Ankunft
  useEffect(() => {
    if (!fix || directDist == null || arrived) return;
    if (directDist <= Math.max(30, Math.min(fix.acc, 50))) {
      setArrivedId(target.id);
      navigator.vibrate?.([180, 90, 180]);
    }
  }, [fix, directDist, arrived, target.id]);

  // ── Karte ──────────────────────────────────────────────────
  useEffect(() => {
    if (!hasMap || !mapEl.current) return;
    let cancelled = false;
    (async () => {
      const gl = (await import("mapbox-gl")).default;
      if (cancelled || !mapEl.current) return;
      glRef.current = gl;
      gl.accessToken = token!;
      const bounds = new gl.LngLatBounds();
      stops.forEach((s) => bounds.extend([s.coords.lng, s.coords.lat]));
      const map = new gl.Map({
        container: mapEl.current,
        style: "mapbox://styles/mapbox/streets-v12",
        bounds,
        fitBoundsOptions: { padding: { top: 140, bottom: 300, left: 40, right: 40 } },
        attributionControl: false,
      });
      map.addControl(new gl.AttributionControl({ compact: true }), "bottom-left");
      mapRef.current = map;
      map.on("dragstart", () => setFollow(false));
      map.on("load", () => {
        map.addSource("tour", {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: stops.map((s) => [s.coords.lng, s.coords.lat]) } },
        });
        map.addLayer({ id: "tour-line", type: "line", source: "tour", paint: { "line-color": "#18181b", "line-opacity": 0.35, "line-width": 2, "line-dasharray": [1, 2] } });
        map.addSource("leg", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } } });
        map.addLayer({ id: "leg-casing", type: "line", source: "leg", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffffff", "line-width": 10 } });
        map.addLayer({ id: "leg-line", type: "line", source: "leg", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ff4d00", "line-width": 5 } });
        markers.current = stops.map((s, i) => {
          const el = document.createElement("div");
          el.textContent = String(i + 1);
          el.onclick = (ev) => {
            ev.stopPropagation();
            setIdx(i);
          };
          new gl.Marker(el).setLngLat([s.coords.lng, s.coords.lat]).addTo(map);
          return { el, id: s.id };
        });
        setMapReady((n) => n + 1);
      });
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      userMarker.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMap, token]);

  // Pins einfärben
  useEffect(() => {
    markers.current.forEach(({ el, id }, i) => {
      const isDone = done.has(id), isTarget = i === idx;
      const size = isTarget ? 38 : 26;
      el.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;display:grid;place-items:center;font:800 ${isTarget ? 15 : 11}px system-ui,sans-serif;cursor:pointer;color:#fff;background:${isDone ? "#10b981" : isTarget ? "#ff4d00" : "#3b3833"};border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,.55);z-index:${isTarget ? 2 : 1}`;
      el.textContent = isDone ? "✓" : String(i + 1);
    });
  }, [done, idx, mapReady]);

  // Routenlinie
  useEffect(() => {
    const map = mapRef.current;
    const src = map?.getSource("leg") as import("mapbox-gl").GeoJSONSource | undefined;
    src?.setData({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: route?.coords ?? [] } });
    if (map && route && !fix) {
      const gl = glRef.current;
      if (gl) {
        const b = new gl.LngLatBounds();
        route.coords.forEach((c) => b.extend(c));
        map.fitBounds(b, { padding: { top: 160, bottom: 320, left: 50, right: 50 }, maxZoom: 17, duration: 700 });
      }
    }
  }, [route, mapReady, fix]);

  // Eigener Standort + Kamera folgen
  useEffect(() => {
    const map = mapRef.current, gl = glRef.current;
    if (!map || !gl || !fix) return;
    if (!userMarker.current) {
      const el = document.createElement("div");
      el.innerHTML = `<div style="position:relative;width:22px;height:22px"><div data-cone style="position:absolute;left:50%;top:50%;width:0;height:0;border-left:14px solid transparent;border-right:14px solid transparent;border-bottom:34px solid rgba(56,165,255,.35);transform-origin:50% 100%;margin:-34px 0 0 -14px;display:none"></div><div style="position:absolute;inset:0;border-radius:50%;background:#38a5ff;border:3px solid #fff;box-shadow:0 0 0 6px rgba(56,165,255,.25)"></div></div>`;
      userMarker.current = { marker: new gl.Marker({ element: el }).setLngLat([fix.lng, fix.lat]).addTo(map), el };
    } else userMarker.current.marker.setLngLat([fix.lng, fix.lat]);
    const cone = userMarker.current.el.querySelector<HTMLDivElement>("[data-cone]");
    const h = heading ?? (fix.speed && fix.speed > 0.7 ? fix.heading : null);
    if (cone) {
      cone.style.display = h == null ? "none" : "block";
      if (h != null) cone.style.transform = `rotate(${h}deg)`;
    }
    if (followRef.current) map.easeTo({ center: [fix.lng, fix.lat], zoom: Math.max(map.getZoom(), 16.2), padding: { top: 120, bottom: 300, left: 0, right: 0 }, duration: 800 });
  }, [fix, heading, mapReady]);

  // ── Ableitungen für die Anzeige ───────────────────────────
  const remaining = route && progress ? Math.max(0, route.length - progress.along) + (directDist != null && route.length < 1 ? directDist : 0) : directDist ?? (route?.length ?? null);
  const step = route && progress ? nextStep(route, progress.along) : null;
  const effHeading = heading ?? (fix?.speed && fix.speed > 0.7 ? fix.heading : null);
  const aimPoint = route && progress && fix ? pointAt(route, progress.along + 25) : target.coords;
  const aim = fix ? bearing(fix, aimPoint) : null;
  const arrowAngle = aim == null ? 0 : effHeading == null ? aim : aim - effHeading;
  const image = getStopImage(target.id);
  const audioHere = audio?.stopId === target.id ? audio : null;
  const audioPct = audioHere && audioHere.d > 0 ? (audioHere.t / audioHere.d) * 100 : 0;
  const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);
  const externalNav = isIOS
    ? `https://maps.apple.com/?daddr=${target.coords.lat},${target.coords.lng}&dirflg=w`
    : `https://www.google.com/maps/dir/?api=1&destination=${target.coords.lat},${target.coords.lng}&travelmode=walking`;

  function story() {
    window.dispatchEvent(new CustomEvent("ut-audio-ctl", { detail: { stopId: target.id } }));
  }

  function finishStop() {
    onDone(target.id);
    const next = stops.findIndex((s, i) => i > idx && !done.has(s.id));
    if (next >= 0) setIdx(next);
    setFollow(true);
  }

  async function compass() {
    if (await requestCompass()) setHeading((h) => h);
  }

  const geoText =
    geo === "denied"
      ? "Standort nicht freigegeben – Navi zeigt nur die Route. In den Browser-Einstellungen erlauben."
      : geo === "unsupported"
        ? "Dieses Gerät liefert keinen Standort."
        : !fix
          ? "Suche deinen Standort …"
          : fix.acc > 60
            ? `GPS ungenau (±${Math.round(fix.acc)} m) – kurz unter freien Himmel`
            : null;

  return (
    <div className="fixed inset-0 z-[60] bg-ink-950 text-cream" role="dialog" aria-modal="true" aria-label={`Navi: ${tour.name}`}>
      {hasMap ? (
        <div className="absolute inset-0"><div ref={mapEl} className="h-full w-full" /></div>
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${tour.gradient[0]}, ${tour.gradient[1]})` }} />
      )}

      {/* ── Kopfzeile ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-3 pt-[calc(0.6rem+env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center gap-2">
          <button onClick={onClose} aria-label="Navi schliessen" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-900/90 text-lg font-bold shadow-lg ring-1 ring-cream/15 backdrop-blur">
            ✕
          </button>
          <div className="min-w-0 flex-1 rounded-full bg-ink-900/90 px-4 py-2.5 shadow-lg ring-1 ring-cream/15 backdrop-blur">
            <p className="truncate text-sm font-bold">
              {allDone ? "Tour geschafft" : `Stopp ${idx + 1} von ${stops.length}`}
              <span className="font-normal text-cream-faint"> · {done.size} erledigt</span>
            </p>
          </div>
          <button
            onClick={() => setAmbienceEnabled(!ambience)}
            aria-pressed={ambience}
            title="Klangkulisse"
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full shadow-lg ring-1 backdrop-blur ${ambience ? "bg-signal-500/90 text-white ring-signal-400" : "bg-ink-900/90 text-cream-faint ring-cream/15"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
              {!ambience && <path d="M4 4l16 16" />}
            </svg>
          </button>
        </div>

        {/* Abbiegehinweis */}
        {!arrived && !allDone && step && fix && (
          <div className="pointer-events-auto mt-2 flex items-center gap-3 rounded-2xl bg-signal-500 px-4 py-3 text-white shadow-xl">
            <TurnIcon angle={maneuverAngle(step.step.type, step.step.modifier)} />
            <div className="min-w-0">
              <p className="font-display text-2xl font-extrabold leading-none tabular-nums">{formatMeters(step.distance)}</p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white/95">{step.step.instruction}</p>
            </div>
          </div>
        )}
      </div>

      {/* Zentrieren */}
      {fix && !follow && (
        <button
          onClick={() => setFollow(true)}
          className="absolute right-3 z-10 rounded-full bg-ink-900/95 px-4 py-2.5 text-sm font-bold shadow-lg ring-1 ring-cream/15"
          style={{ bottom: "calc(17rem + env(safe-area-inset-bottom))" }}
        >
          ◎ Zentrieren
        </button>
      )}

      {/* ── Karte unten ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl bg-ink-900/95 shadow-2xl ring-1 ring-cream/15 backdrop-blur">
          {allDone ? (
            <div className="p-5 text-center">
              <p className="font-display text-2xl font-extrabold">Alle {stops.length} Stopps geschafft</p>
              <p className="mt-1 text-sm text-cream-dim">Ende: {tour.endPoint}</p>
              <p className="mt-1 text-xs text-cream-faint">{tour.publicTransport.end}</p>
              <button onClick={onClose} className="btn-primary mt-4 w-full justify-center">Zurück zur Tour</button>
            </div>
          ) : arrived ? (
            <div className="p-4">
              <div className="flex items-center gap-3">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image.url} alt={image.alt} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Du bist da</p>
                  <p className="truncate font-display text-xl font-extrabold">{target.name}</p>
                  <p className="line-clamp-2 text-xs text-cream-dim">{target.teaser}</p>
                </div>
              </div>
              <button onClick={story} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-signal-500 py-4 text-lg font-extrabold text-white shadow-lg active:scale-[0.98]">
                {audioHere?.playing ? "⏸ Pause" : audioHere ? "▶ Weiterhören" : "▶ Story hören"}
              </button>
              {audioHere && audioHere.d > 0 && (
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <div className="h-full rounded-full bg-signal-500 transition-[width] duration-300" style={{ width: `${audioPct}%` }} />
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <a href={`#${target.id}`} onClick={onClose} className="flex-1 rounded-2xl border border-cream/15 py-3 text-center text-sm font-bold text-cream">
                  Text lesen
                </a>
                <button onClick={finishStop} className="flex-[1.4] rounded-2xl bg-emerald-500 py-3 text-sm font-extrabold text-white active:scale-[0.98]">
                  {stops.some((s, i) => i > idx && !done.has(s.id)) ? "Erledigt · nächster Stopp →" : "Erledigt · Tour beenden"}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-ink-800 text-signal-500 ring-1 ring-cream/10">
                  {fix ? <Arrow angle={arrowAngle} /> : <span className="h-6 w-6 animate-spin rounded-full border-2 border-cream/20 border-t-signal-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-cream-faint">Nächster Stopp</p>
                  <p className="line-clamp-2 font-display text-xl font-extrabold leading-tight">{target.name}</p>
                  <p className="mt-0.5 font-display text-lg font-bold tabular-nums text-signal-400">
                    {remaining != null ? `${formatMeters(remaining)} · ca. ${walkMinutes(remaining)} Min` : `ca. ${target.walkMinutesFromPrevious || 1} Min ab letztem Stopp`}
                  </p>
                </div>
              </div>
              {fix && heading == null && effHeading == null && (
                <button onClick={compass} className="mt-2 text-xs font-semibold text-cream-faint underline underline-offset-2">
                  Pfeil zeigt nach Norden ausgerichtet – Kompass aktivieren
                </button>
              )}
              {target.directions && <p className="mt-3 line-clamp-2 text-sm leading-snug text-cream-dim">{target.directions}</p>}
              {geoText && <p className="mt-2 text-xs font-semibold text-amber-300">{geoText}</p>}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => idx > 0 && setIdx(idx - 1)}
                  disabled={idx === 0}
                  aria-label="Vorheriger Stopp"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cream/15 text-lg font-bold disabled:opacity-30"
                >
                  ‹
                </button>
                <button onClick={() => setArrivedId(target.id)} className="flex-1 rounded-2xl bg-signal-500 text-sm font-extrabold text-white active:scale-[0.98]">
                  Bin da
                </button>
                <a href={externalNav} target="_blank" rel="noopener noreferrer" className="grid flex-1 place-items-center rounded-2xl border border-cream/15 text-sm font-bold">
                  {isIOS ? "Karten" : "Maps"} ↗
                </a>
                <button
                  onClick={() => idx < stops.length - 1 && setIdx(idx + 1)}
                  disabled={idx >= stops.length - 1}
                  aria-label="Nächster Stopp"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-cream/15 text-lg font-bold disabled:opacity-30"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
