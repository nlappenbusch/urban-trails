"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

/**
 * Pistenplan auf der Karte: Pisten und Lifte aus OpenStreetMap (OpenSkiMap),
 * Lifte und Pisten eingefärbt nach Live-Meldung der Bergbahn, soweit der Name passt.
 */
export default function PisteMap({ center, open, closed }: { center: { lat: number; lng: number }; open: string[]; closed: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !token?.startsWith("pk.") || !ref.current) return;
    let map: import("mapbox-gl").Map | undefined;
    let cancelled = false;
    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (cancelled || !ref.current) return;
        mapboxgl.accessToken = token;
        map = new mapboxgl.Map({
          container: ref.current,
          style: "mapbox://styles/mapbox/outdoors-v12",
          center: [center.lng, center.lat],
          zoom: 12.3,
          pitch: 45,
          cooperativeGestures: true,
        });
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
        map.on("load", () => {
          if (!map) return;
          map.addSource("dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1", tileSize: 512 });
          map.setTerrain({ source: "dem", exaggeration: 1.2 });
          map.addSource("ski", {
            type: "vector",
            tiles: ["https://tiles.openskimap.org/openskimap/{z}/{x}/{y}.pbf"],
            maxzoom: 15,
            attribution: '<a href="https://openskimap.org" target="_blank" rel="noopener">OpenSkiMap</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OSM</a>',
          });
          const name = ["downcase", ["coalesce", ["get", "name"], ""]] as unknown as string;
          const live = (onExpr: unknown, offExpr: unknown, other: unknown) =>
            ["case", ["in", name, ["literal", open]], onExpr, ["in", name, ["literal", closed]], offExpr, other] as unknown as string;
          const diff = ["coalesce", ["get", "difficulty"], ""];
          map.addLayer({
            id: "runs",
            type: "line",
            source: "ski",
            "source-layer": "runs",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": ["match", diff, ["novice", "easy"], "#0ea5e9", "intermediate", "#ef4444", ["advanced", "expert", "extreme"], "#18181b", "freeride", "#f59e0b", "#64748b"] as unknown as string,
              "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.5, 15, 4] as unknown as number,
              "line-opacity": live(1, 0.3, 0.85) as unknown as number,
              "line-dasharray": ["match", diff, "freeride", ["literal", [2, 2]], ["literal", [1, 0]]] as unknown as number[],
            },
          });
          map.addLayer({
            id: "lifts",
            type: "line",
            source: "ski",
            "source-layer": "lifts",
            paint: {
              "line-color": live("#059669", "#a1a1aa", "#334155") as unknown as string,
              "line-width": ["interpolate", ["linear"], ["zoom"], 11, 1.5, 15, 3.5] as unknown as number,
            },
          });
          map.addLayer({
            id: "lift-names",
            type: "symbol",
            source: "ski",
            "source-layer": "lifts",
            minzoom: 12.5,
            layout: { "symbol-placement": "line", "text-field": ["get", "name"], "text-size": 11 },
            paint: { "text-color": "#0f172a", "text-halo-color": "#ffffff", "text-halo-width": 1.5 },
          });
          map.addLayer({
            id: "run-names",
            type: "symbol",
            source: "ski",
            "source-layer": "runs",
            minzoom: 13.5,
            layout: { "symbol-placement": "line", "text-field": ["coalesce", ["get", "name"], ""], "text-size": 10 },
            paint: { "text-color": "#334155", "text-halo-color": "#ffffff", "text-halo-width": 1.5 },
          });
        });
        map.on("error", () => setFailed(true));
      } catch {
        setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [visible, token, center.lat, center.lng, open, closed]);

  if (!token?.startsWith("pk.") || failed) return null;
  return (
    <figure>
      <div ref={ref} className="h-[440px] w-full overflow-hidden rounded-2xl bg-ink-800 sm:h-[520px]" aria-label="Pistenplan auf der Karte" role="region" />
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-4 rounded bg-sky-500" /> blau</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-4 rounded bg-red-500" /> rot</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-4 rounded bg-zinc-900" /> schwarz</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-4 rounded bg-amber-500" /> Skiroute</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-4 rounded bg-emerald-600" /> Lift offen</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-4 rounded bg-zinc-400" /> Lift zu</span>
        <span>Blasse Pisten: laut Bergbahn zu. Linien aus OpenStreetMap; Status nur, wo der Name eindeutig passt.</span>
      </figcaption>
    </figure>
  );
}
