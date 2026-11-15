"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { HOURS, SECTORS, SECTOR_LONG, aspectShare, bestRuns, dirText, sunDay, SUNNY, type SunRun } from "@/lib/sonne-core";

const DIFF: Record<string, string> = { novice: "blau", easy: "blau", intermediate: "rot", advanced: "schwarz", expert: "schwarz", freeride: "Route" };
const kmFmt = (n: number) => (n >= 10 ? String(Math.round(n)) : n.toFixed(1).replace(".", ","));
const todayIso = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
const nowSlot = () => {
  const t = new Date().toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
  const i = HOURS.findIndex((h) => h > t);
  return i <= 0 ? (t < HOURS[0] ? 0 : 3) : i - 1;
};

function Rose({ km }: { km: number[] }) {
  const max = Math.max(...km, 0.01);
  const total = km.reduce((s, x) => s + x, 0) || 1;
  return (
    <svg viewBox="-60 -60 120 120" className="h-44 w-44" role="img" aria-label={`Ausrichtung der Pisten: ${km.map((k, i) => `${SECTOR_LONG[i]} ${Math.round((k / total) * 100)} %`).join(", ")}`}>
      {[20, 40].map((r) => <circle key={r} r={r} fill="none" stroke="currentColor" strokeOpacity={0.12} />)}
      {km.map((k, i) => {
        const r = 8 + (k / max) * 36;
        const a0 = ((i * 45 - 20 - 90) * Math.PI) / 180, a1 = ((i * 45 + 20 - 90) * Math.PI) / 180;
        const south = i >= 2 && i <= 6;
        return <path key={i} d={`M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={i === 4 || i === 3 || i === 5 ? "#f59e0b" : south ? "#fcd34d" : "#60a5fa"} fillOpacity={0.85} />;
      })}
      {SECTORS.map((s, i) => {
        const a = ((i * 45 - 90) * Math.PI) / 180;
        return <text key={s} x={54 * Math.cos(a)} y={54 * Math.sin(a) + 3} textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fillOpacity={0.6}>{s}</text>;
      })}
    </svg>
  );
}

/**
 * Sonne auf der Piste: welche Pisten wann in der Sonne liegen –
 * Karte mit Stundenregler, Tageskurve, Sonnen-Fahrplan und Ausrichtung.
 */
export default function SunPlanner({ runs, center, name }: { runs: SunRun[]; center: { lat: number; lng: number }; name: string }) {
  const [date, setDate] = useState(todayIso());
  const [slot, setSlot] = useState(4);
  const day = useMemo(() => sunDay(runs, date, center), [runs, date, center]);
  const h = day[slot];
  const total = runs.reduce((s, r) => s + r.km, 0);
  const rose = useMemo(() => aspectShare(runs), [runs]);
  const plan = useMemo(
    () => [
      { label: "Morgens", span: "9–11 Uhr", list: bestRuns(runs, day, "09:00", "11:00") },
      { label: "Mittags", span: "11–13.30 Uhr", list: bestRuns(runs, day, "11:00", "13:30") },
      { label: "Nachmittags", span: "13.30–16 Uhr", list: bestRuns(runs, day, "13:30", "16:00") },
    ],
    [runs, day],
  );
  const lastSun = [...day].reverse().find((x) => x.sunny > 0.05 * total);
  const north = rose[0] + rose[1] + rose[7];
  const roseTotal = rose.reduce((s, x) => s + x, 0) || 1;

  useEffect(() => setSlot(nowSlot()), []);

  // Karte
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("mapbox-gl").Map | null>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const geo = useMemo(
    () => ({ type: "FeatureCollection" as const, features: runs.map((r, i) => ({ type: "Feature" as const, properties: { v: h.vals[i], n: r.n }, geometry: { type: "LineString" as const, coordinates: r.g } })) }),
    [runs, h],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !token?.startsWith("pk.") || !ref.current) return;
    let cancelled = false;
    let map: import("mapbox-gl").Map | undefined;
    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (cancelled || !ref.current) return;
        mapboxgl.accessToken = token;
        map = new mapboxgl.Map({ container: ref.current, style: "mapbox://styles/mapbox/outdoors-v12", center: [center.lng, center.lat], zoom: 12, pitch: 50, cooperativeGestures: true });
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
        map.on("load", () => {
          if (!map) return;
          map.addSource("dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1", tileSize: 512 });
          map.setTerrain({ source: "dem", exaggeration: 1.2 });
          map.addLayer({ id: "sun-shade", type: "hillshade", source: "dem", paint: { "hillshade-illumination-anchor": "map", "hillshade-shadow-color": "rgba(30,58,138,0.55)", "hillshade-highlight-color": "rgba(254,243,199,0.35)", "hillshade-exaggeration": 0.5 } });
          map.addSource("runs", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "runs",
            type: "line",
            source: "runs",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": ["interpolate", ["linear"], ["get", "v"], 0, "#2563eb", 0.15, "#64748b", SUNNY, "#facc15", 0.8, "#f97316"] as unknown as string,
              "line-width": ["interpolate", ["linear"], ["zoom"], 10, 3, 15, 8] as unknown as number,
            },
          });
          map.addLayer({ id: "run-names", type: "symbol", source: "runs", minzoom: 13, layout: { "symbol-placement": "line", "text-field": ["get", "n"], "text-size": 11 }, paint: { "text-color": "#0f172a", "text-halo-color": "#fff", "text-halo-width": 1.5 } });
          const b = new mapboxgl.LngLatBounds();
          runs.forEach((r) => r.g.forEach((c) => b.extend(c)));
          if (!b.isEmpty()) map.fitBounds(b, { padding: 40, pitch: 50, duration: 0, maxZoom: 14 });
          mapRef.current = map;
          setReady(true);
        });
        map.on("error", () => setFailed(true));
      } catch {
        setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current = null;
      setReady(false);
      map?.remove();
    };
  }, [visible, token, center.lat, center.lng, runs]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource("runs") as import("mapbox-gl").GeoJSONSource | undefined)?.setData(geo);
    map.setPaintProperty("sun-shade", "hillshade-illumination-direction", Math.round(h.sun.az));
    map.setPaintProperty("sun-shade", "hillshade-exaggeration", h.sun.alt < 10 ? 0.65 : h.sun.alt < 20 ? 0.5 : 0.35);
  }, [ready, geo, h]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm font-bold text-cream">
          Tag
          <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="mt-2 block min-h-[44px] rounded-xl border border-cream/20 bg-ink-900 px-3 text-sm font-normal text-cream" />
        </label>
        <label className="min-w-[240px] flex-1 text-sm font-bold text-cream">
          Uhrzeit: <span className="font-display text-lg">{h.hm}</span>
          <input type="range" min={0} max={HOURS.length - 1} value={slot} onChange={(e) => setSlot(Number(e.target.value))} className="mt-2 block w-full accent-signal-500" aria-valuetext={h.hm} />
        </label>
      </div>

      <p className="mt-5 flex flex-wrap items-baseline gap-x-3">
        <span className="font-display text-5xl font-extrabold leading-none tracking-tight text-amber-500">{kmFmt(h.sunny)} km</span>
        <span className="text-cream-dim">von {kmFmt(total)} km Piste um {h.hm} in der Sonne · Sonne im {dirText(h.sun.az)}, {Math.max(0, Math.round(h.sun.alt))}° hoch</span>
      </p>

      <div className="mt-4 flex h-16 items-end gap-1" role="group" aria-label="Pisten in der Sonne über den Tag">
        {day.map((x, i) => (
          <button key={x.hm} type="button" onClick={() => setSlot(i)} aria-pressed={i === slot} title={`${x.hm}: ${kmFmt(x.sunny)} km sonnig`} className="group flex h-full flex-1 flex-col justify-end">
            <span className={`block w-full rounded-t ${i === slot ? "bg-signal-500" : "bg-amber-400/80 group-hover:bg-amber-400"}`} style={{ height: `${Math.max(4, x.share * 100)}%` }} />
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-cream-faint"><span>08:30</span><span>12:30</span><span>16:30</span></div>

      {!failed && token?.startsWith("pk.") && (
        <figure className="mt-6">
          <div ref={ref} className="h-[440px] w-full overflow-hidden rounded-2xl bg-ink-800 sm:h-[520px]" role="region" aria-label={`Sonnenkarte ${name}`} />
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
            <span className="inline-flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-orange-500" /> volle Sonne</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-yellow-400" /> Sonne</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-slate-500" /> flach einfallend</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-blue-600" /> Schatten</span>
            <span>Relief beleuchtet aus der aktuellen Sonnenrichtung.</span>
          </figcaption>
        </figure>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto]">
        <div>
          <h3 className="font-display text-xl font-extrabold text-cream">Sonnen-Fahrplan</h3>
          <ol className="mt-3 grid gap-3 sm:grid-cols-3">
            {plan.map((p) => (
              <li key={p.label} className="rounded-xl bg-ink-800/60 p-4">
                <p className="text-sm font-bold text-cream">{p.label} <span className="font-normal text-cream-faint">{p.span}</span></p>
                {p.list.length ? (
                  <ul className="mt-2 space-y-1 text-sm text-cream-dim">
                    {p.list.map((r) => (
                      <li key={r.name}><strong className="text-cream">{r.name}</strong>{DIFF[r.d] ? ` · ${DIFF[r.d]}` : ""}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-cream-dim">Kaum benannte Pisten voll in der Sonne.</p>
                )}
              </li>
            ))}
          </ol>
          <ul className="mt-4 space-y-1.5 text-sm text-cream-dim">
            {lastSun && <li>Letzte Sonne auf einem nennenswerten Teil der Pisten: <strong className="text-cream">bis {lastSun.hm} Uhr</strong>.</li>}
            {north / roseTotal > 0.2 && <li>{Math.round((north / roseTotal) * 100)} % der Pisten schauen nach Norden – dort bleibt der Pulver am längsten, dafür ist es kälter.</li>}
            <li>Im Frühling: Sonnenhänge am Morgen sind hart, ab Mittag sulzig – Südhänge darum zwischen 11 und 14 Uhr fahren.</li>
          </ul>
        </div>
        <div className="flex flex-col items-center text-cream">
          <Rose km={rose} />
          <p className="mt-1 text-xs text-cream-faint">Wohin die Pisten abfallen</p>
        </div>
      </div>
      <p className="mt-6 text-xs text-cream-faint">Berechnet aus Sonnenstand, Hangneigung und -ausrichtung (Pisten aus OpenStreetMap, Höhen Copernicus-DEM). Schatten von Nachbargipfeln, Wolken und Nebel sind nicht eingerechnet – fürs Wetter siehe Bergwetter.</p>
    </div>
  );
}
