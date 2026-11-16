"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  sub?: string;
  href?: string;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Viele Punkte auf einer Karte, gebündelt (Cluster); Klick zeigt Name und springt zur Karte im Verzeichnis. */
export default function PointsMap({ points, color = "#f97316", height = 420, lines, onPick }: { points: MapPoint[]; color?: string; height?: number; lines?: { type: "FeatureCollection"; features: unknown[] }; onPick?: (id: string) => void }) {
  const pick = useRef(onPick);
  pick.current = onPick;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !token?.startsWith("pk.") || !ref.current || !points.length) return;
    let map: import("mapbox-gl").Map | undefined;
    let cancelled = false;
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !ref.current) return;
      mapboxgl.accessToken = token;
      const lats = points.map((p) => p.lat), lngs = points.map((p) => p.lng);
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        bounds: [[Math.min(...lngs) - 0.05, Math.min(...lats) - 0.04], [Math.max(...lngs) + 0.05, Math.max(...lats) + 0.04]],
        fitBoundsOptions: { padding: 40, maxZoom: 13 },
        cooperativeGestures: true,
      });
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      map.on("load", () => {
        if (!map) return;
        // Behälter kann nach dem Anlegen noch Grösse geändert haben: neu messen und auf die Punkte einpassen
        map.resize();
        map.fitBounds([[Math.min(...lngs) - 0.05, Math.min(...lats) - 0.04], [Math.max(...lngs) + 0.05, Math.max(...lats) + 0.04]], { padding: 40, maxZoom: 13, duration: 0 });
        if (lines) {
          map.addSource("lines", { type: "geojson", data: lines as GeoJSON.FeatureCollection });
          map.addLayer({ id: "lines", type: "line", source: "lines", paint: { "line-color": color, "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 13, 4], "line-opacity": 0.85 } });
        }
        map.addSource("pts", {
          type: "geojson",
          cluster: points.length > 40,
          clusterRadius: 42,
          clusterMaxZoom: 11,
          data: {
            type: "FeatureCollection",
            features: points.map((p) => ({ type: "Feature", properties: { id: p.id, name: p.name, sub: p.sub ?? "", href: p.href ?? "" }, geometry: { type: "Point", coordinates: [p.lng, p.lat] } })),
          },
        });
        map.addLayer({ id: "clusters", type: "circle", source: "pts", filter: ["has", "point_count"], paint: { "circle-color": color, "circle-opacity": 0.85, "circle-stroke-color": "#fff", "circle-stroke-width": 2, "circle-radius": ["step", ["get", "point_count"], 14, 10, 18, 40, 24] } });
        map.addLayer({ id: "count", type: "symbol", source: "pts", filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12, "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"] }, paint: { "text-color": "#fff" } });
        map.addLayer({ id: "pt", type: "circle", source: "pts", filter: ["!", ["has", "point_count"]], paint: { "circle-color": color, "circle-radius": 6, "circle-stroke-color": "#fff", "circle-stroke-width": 2 } });
        map.on("click", "clusters", async (e) => {
          const f = e.features?.[0];
          if (!f || !map) return;
          const src = map.getSource("pts") as import("mapbox-gl").GeoJSONSource;
          src.getClusterExpansionZoom(f.properties!.cluster_id, (err, z) => {
            if (!err && map) map.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom: z ?? 12 });
          });
        });
        map.on("click", "pt", (e) => {
          const f = e.features?.[0];
          if (!f || !map) return;
          const p = f.properties as { id: string; name: string; sub: string; href: string };
          pick.current?.(p.id);
          const link = p.href ? `<a href="${esc(p.href)}" style="font-weight:700;color:#ea580c">Details</a>` : "";
          new mapboxgl.Popup({ offset: 12 })
            .setLngLat((f.geometry as GeoJSON.Point).coordinates as [number, number])
            .setHTML(`<div style="font:14px system-ui;color:#111"><strong>${esc(p.name)}</strong>${p.sub ? `<br><span style="color:#555">${esc(p.sub)}</span>` : ""}<br>${link}</div>`)
            .addTo(map);
        });
        for (const l of ["clusters", "pt"]) {
          map.on("mouseenter", l, () => map && (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", l, () => map && (map.getCanvas().style.cursor = ""));
        }
      });
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [visible, token, points, color, lines, height]);

  if (!token?.startsWith("pk.")) return null;
  return <div ref={ref} className="w-full overflow-hidden rounded-2xl border border-cream/10 bg-ink-900" style={{ height }} role="region" aria-label="Karte" />;
}
