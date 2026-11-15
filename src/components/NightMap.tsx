"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

type Lit = { type: "FeatureCollection"; features: { type: "Feature"; properties: { name: string; diff: string }; geometry: { type: "LineString"; coordinates: [number, number][] } }[] } | null;

/**
 * Nacht-Pistenplan: dunkle Karte mit Relief, alle Pisten blass,
 * die beleuchteten Abschnitte (OSM piste:lit/lit=yes) leuchten.
 */
export default function NightMap({ center, lit, label }: { center: { lat: number; lng: number }; lit: Lit; label: string }) {
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
          style: "mapbox://styles/mapbox/dark-v11",
          center: [center.lng, center.lat],
          zoom: 13.2,
          pitch: 55,
          bearing: -15,
          cooperativeGestures: true,
        });
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
        new mapboxgl.Marker({ color: "#f97316" }).setLngLat([center.lng, center.lat]).setPopup(new mapboxgl.Popup({ offset: 20 }).setText(label)).addTo(map);
        map.on("load", () => {
          if (!map) return;
          map.addSource("dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1", tileSize: 512 });
          map.setTerrain({ source: "dem", exaggeration: 1.3 });
          map.addLayer({ id: "relief", type: "hillshade", source: "dem", paint: { "hillshade-shadow-color": "#020617", "hillshade-highlight-color": "#334155", "hillshade-exaggeration": 0.6 } });
          map.setFog({ color: "#0b1020", "high-color": "#111827", "horizon-blend": 0.08, "space-color": "#020617", "star-intensity": 0.6 });
          map.addSource("ski", {
            type: "vector",
            tiles: ["https://tiles.openskimap.org/openskimap/{z}/{x}/{y}.pbf"],
            maxzoom: 15,
            attribution: '<a href="https://openskimap.org" target="_blank" rel="noopener">OpenSkiMap</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OSM</a>',
          });
          map.addLayer({ id: "runs", type: "line", source: "ski", "source-layer": "runs", filter: ["==", ["geometry-type"], "LineString"], paint: { "line-color": "#64748b", "line-width": 1.2, "line-opacity": 0.6 } });
          map.addLayer({ id: "lifts", type: "line", source: "ski", "source-layer": "lifts", paint: { "line-color": "#94a3b8", "line-width": 1, "line-dasharray": [2, 1] } });
          if (lit?.features.length) {
            map.addSource("lit", { type: "geojson", data: lit as GeoJSON.FeatureCollection });
            map.addLayer({ id: "lit-glow", type: "line", source: "lit", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#fbbf24", "line-width": ["interpolate", ["linear"], ["zoom"], 11, 10, 16, 34] as unknown as number, "line-blur": 14, "line-opacity": 0.45 } });
            map.addLayer({ id: "lit-core", type: "line", source: "lit", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#fef3c7", "line-width": ["interpolate", ["linear"], ["zoom"], 11, 2, 16, 5] as unknown as number } });
            map.addLayer({ id: "lit-names", type: "symbol", source: "lit", minzoom: 13, layout: { "symbol-placement": "line", "text-field": ["get", "name"], "text-size": 12 }, paint: { "text-color": "#fef3c7", "text-halo-color": "#020617", "text-halo-width": 2 } });
            const b = new mapboxgl.LngLatBounds();
            lit.features.forEach((f) => f.geometry.coordinates.forEach((c) => b.extend(c)));
            b.extend([center.lng, center.lat]);
            map.fitBounds(b, { padding: 70, pitch: 55, bearing: -15, maxZoom: 15, duration: 0 });
          }
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
  }, [visible, token, center.lat, center.lng, lit, label]);

  if (!token?.startsWith("pk.") || failed) return null;
  return (
    <figure>
      <div ref={ref} className="h-[440px] w-full overflow-hidden rounded-2xl bg-[#0b1020] sm:h-[540px]" aria-label="Nacht-Pistenplan" role="region" />
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
        {lit?.features.length ? <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-5 rounded bg-amber-200 shadow-[0_0_8px_2px_rgba(251,191,36,.7)]" /> beleuchtet laut OpenStreetMap</span> : <span>Für diese Piste ist in OpenStreetMap noch keine Beleuchtung erfasst – die Markierung zeigt die Talstation.</span>}
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-slate-500" /> übrige Pisten</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Talstation / Treffpunkt</span>
      </figcaption>
    </figure>
  );
}
