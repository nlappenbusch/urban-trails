"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Place, TripDay } from "@/lib/ausfluege-core";

/** Farbe je Tag – Tag 1 in Signalorange, dann zwei gut unterscheidbare Töne. */
const DAY_COLORS = ["#ff4d00", "#2563eb", "#059669"];

interface Point {
  n: number;
  day: number;
  time: string;
  name: string;
  lng: number;
  lat: number;
}

/**
 * Übersichtskarte eines Programms: Stationen pro Tag nummeriert und verbunden,
 * Hotel mit Bett-Symbol. Lädt Mapbox erst, wenn die Karte ins Bild scrollt.
 */
export default function TripMap({ days, places, hotel }: { days: TripDay[]; places: Record<string, Place>; hotel?: Place }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const points = useMemo(() => {
    const out: Point[] = [];
    days.forEach((d, di) => {
      let n = 0, prev: string | undefined;
      for (const s of d.slots) {
        const p = s.placeId ? places[s.placeId] : undefined;
        if (!p?.coords || p.kind === "hotel" || s.placeId === prev) continue;
        prev = s.placeId;
        out.push({ n: ++n, day: di, time: s.time, name: p.name, lng: p.coords.lng, lat: p.coords.lat });
      }
    });
    return out;
  }, [days, places]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !token?.startsWith("pk.") || !ref.current || points.length < 2) return;
    let map: import("mapbox-gl").Map | undefined;
    let cancelled = false;
    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (cancelled || !ref.current) return;
        mapboxgl.accessToken = token;
        const bounds = new mapboxgl.LngLatBounds();
        points.forEach((p) => bounds.extend([p.lng, p.lat]));
        if (hotel?.coords) bounds.extend([hotel.coords.lng, hotel.coords.lat]);
        map = new mapboxgl.Map({
          container: ref.current,
          style: "mapbox://styles/mapbox/outdoors-v12",
          bounds,
          fitBoundsOptions: { padding: 48, maxZoom: 15 },
          cooperativeGestures: true,
        });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
        map.on("load", () => {
          if (!map) return;
          days.forEach((_, di) => {
            const coords = points.filter((p) => p.day === di).map((p) => [p.lng, p.lat]);
            if (coords.length < 2) return;
            map!.addSource(`day-${di}`, { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } } });
            map!.addLayer({ id: `day-${di}`, type: "line", source: `day-${di}`, paint: { "line-color": DAY_COLORS[di % 3], "line-width": 2.5, "line-dasharray": [1.5, 1.5], "line-opacity": 0.8 } });
          });
          for (const p of points) {
            const el = document.createElement("div");
            el.style.cssText = `width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:800 12px system-ui,sans-serif;color:#fff;background:${DAY_COLORS[p.day % 3]};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);cursor:pointer`;
            el.textContent = String(p.n);
            el.setAttribute("aria-label", `${p.time} ${p.name}`);
            const label = document.createElement("div");
            label.style.cssText = "font:600 13px system-ui,sans-serif;color:#100f0d";
            label.textContent = `${days.length > 1 ? `Tag ${p.day + 1}, ` : ""}${p.time} – ${p.name}`;
            new mapboxgl.Marker(el).setLngLat([p.lng, p.lat]).setPopup(new mapboxgl.Popup({ offset: 16, closeButton: false }).setDOMContent(label)).addTo(map!);
          }
          if (hotel?.coords) {
            const el = document.createElement("div");
            el.style.cssText = "width:28px;height:28px;border-radius:7px;display:grid;place-items:center;font:800 14px system-ui,sans-serif;color:#fff;background:#100f0d;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);cursor:pointer";
            el.textContent = "H";
            el.setAttribute("aria-label", `Hotel ${hotel.name}`);
            const label = document.createElement("div");
            label.style.cssText = "font:600 13px system-ui,sans-serif;color:#100f0d";
            label.textContent = `Übernachten: ${hotel.name}`;
            new mapboxgl.Marker(el).setLngLat([hotel.coords.lng, hotel.coords.lat]).setPopup(new mapboxgl.Popup({ offset: 18, closeButton: false }).setDOMContent(label)).addTo(map!);
          }
        });
      } catch {
        setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [visible, token, points, hotel, days]);

  if (!token?.startsWith("pk.") || points.length < 2 || failed) return null;

  return (
    <figure>
      <div ref={ref} className="h-72 w-full overflow-hidden rounded-xl border border-cream/10 bg-ink-800 sm:h-96" role="region" aria-label="Karte mit allen Stationen" />
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
        {days.length > 1 &&
          days.map((d, di) => (
            <span key={d.title} className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: DAY_COLORS[di % 3] }} /> Tag {di + 1}
            </span>
          ))}
        <span>Nummern = Reihenfolge im Programm{hotel?.coords ? ", H = Hotel" : ""}. Punkt antippen für Details.</span>
      </figcaption>
    </figure>
  );
}
