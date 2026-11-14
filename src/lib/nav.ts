import type { GeoPoint } from "./types";
import { distanceMeters } from "./gps";

export type LngLat = [number, number];

export interface NavStep {
  instruction: string;
  type: string;
  modifier?: string;
  name: string;
  /** Distanz ab Routenstart bis zu diesem Manöver (m) */
  at: number;
  location: LngLat;
}

export interface NavRoute {
  coords: LngLat[];
  /** kumulierte Distanz je Routenpunkt (m) */
  cum: number[];
  steps: NavStep[];
  length: number;
  /** Startpunkt der Berechnung (für Neuberechnung bei Abweichung) */
  from: GeoPoint;
  toId: string;
}

const toPoint = ([lng, lat]: LngLat): GeoPoint => ({ lat, lng });

export function bearing(a: GeoPoint, b: GeoPoint): number {
  const r = Math.PI / 180;
  const y = Math.sin((b.lng - a.lng) * r) * Math.cos(b.lat * r);
  const x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lng - a.lng) * r);
  return ((Math.atan2(y, x) / r) + 360) % 360;
}

export function buildRoute(coords: LngLat[], rawSteps: { distance: number; name?: string; maneuver: { instruction?: string; type: string; modifier?: string; location: LngLat } }[], from: GeoPoint, toId: string): NavRoute {
  const cum = [0];
  for (let i = 1; i < coords.length; i++) cum.push(cum[i - 1] + distanceMeters(toPoint(coords[i - 1]), toPoint(coords[i])));
  let acc = 0;
  const steps = rawSteps.map((s) => {
    const step: NavStep = { instruction: s.maneuver.instruction ?? "", type: s.maneuver.type, modifier: s.maneuver.modifier, name: s.name ?? "", at: acc, location: s.maneuver.location };
    acc += s.distance;
    return step;
  });
  // Steps-Distanzen und Geometrie weichen leicht ab → auf Geometrielänge skalieren.
  const length = cum[cum.length - 1] || 0;
  if (acc > 0 && length > 0) steps.forEach((s) => (s.at = (s.at / acc) * length));
  return { coords, cum, steps, length, from, toId };
}

/** Lotpunkt der Position auf der Route: Abstand zur Linie und zurückgelegte Strecke. */
export function project(route: NavRoute, p: GeoPoint): { off: number; along: number } {
  const kx = 111320 * Math.cos((p.lat * Math.PI) / 180), ky = 110540;
  let best = { off: Infinity, along: 0 };
  for (let i = 1; i < route.coords.length; i++) {
    const [ax, ay] = [(route.coords[i - 1][0] - p.lng) * kx, (route.coords[i - 1][1] - p.lat) * ky];
    const [bx, by] = [(route.coords[i][0] - p.lng) * kx, (route.coords[i][1] - p.lat) * ky];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
    const off = Math.hypot(ax + t * dx, ay + t * dy);
    if (off < best.off) best = { off, along: route.cum[i - 1] + t * (route.cum[i] - route.cum[i - 1]) };
  }
  return best;
}

/** Punkt auf der Route in `meters` Abstand vom Start. */
export function pointAt(route: NavRoute, meters: number): GeoPoint {
  const m = Math.max(0, Math.min(route.length, meters));
  for (let i = 1; i < route.cum.length; i++) {
    if (route.cum[i] >= m) {
      const seg = route.cum[i] - route.cum[i - 1] || 1, t = (m - route.cum[i - 1]) / seg;
      const [a, b] = [route.coords[i - 1], route.coords[i]];
      return { lng: a[0] + (b[0] - a[0]) * t, lat: a[1] + (b[1] - a[1]) * t };
    }
  }
  return toPoint(route.coords[route.coords.length - 1]);
}

/** Nächstes Manöver vor der aktuellen Position. */
export function nextStep(route: NavRoute, along: number): { step: NavStep; distance: number } | null {
  for (let i = 1; i < route.steps.length; i++) {
    if (route.steps[i].at > along + 4) return { step: route.steps[i], distance: route.steps[i].at - along };
  }
  return null;
}

/** Pfeilwinkel für ein Manöver (0 = geradeaus). */
export function maneuverAngle(type: string, modifier?: string): number {
  if (type === "arrive") return 0;
  switch (modifier) {
    case "slight right": return 45;
    case "right": return 90;
    case "sharp right": return 135;
    case "uturn": return 180;
    case "sharp left": return -135;
    case "left": return -90;
    case "slight left": return -45;
    default: return 0;
  }
}

export function formatMeters(m: number): string {
  if (m < 15) return "jetzt";
  if (m < 1000) return `${Math.round(m / 10) * 10} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

/** Gehminuten bei ruhigem Stadttempo (ca. 4,5 km/h). */
export function walkMinutes(m: number): number {
  return Math.max(1, Math.round(m / 75));
}
