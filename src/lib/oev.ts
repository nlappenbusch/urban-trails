/**
 * ÖV-Verbindungen über transport.opendata.ch (offene Fahrplandaten der Schweiz, ohne Schlüssel).
 * Läuft nur auf dem Server – der Browser fragt unsere eigene API, nicht den fremden Dienst.
 */
import { memo } from "@/lib/api-utils";

const BASE = "https://transport.opendata.ch/v1";
const UA = { "User-Agent": "urban-trails.ch Ausflugsplaner" };

export interface Station {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
}

interface RawStation {
  id: string | null;
  name: string | null;
  coordinate?: { x: number | null; y: number | null } | null;
}
const toStation = (s: RawStation): Station => ({
  id: s.id!,
  name: s.name!,
  ...(s.coordinate?.x && s.coordinate?.y ? { lat: s.coordinate.x, lng: s.coordinate.y } : {}),
});

export interface Connection {
  from: string;
  to: string;
  dep: string; // ISO
  arr: string; // ISO
  depPlatform?: string;
  durationMin: number;
  transfers: number;
  products: string[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: UA, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Fahrplan HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

const stationCache = memo<Station[]>(24 * 3600_000);
export function findStations(q: string) {
  return stationCache(q.toLowerCase(), async () => {
    const r = await get<{ stations: RawStation[] }>(`/locations?type=station&query=${encodeURIComponent(q)}`);
    return r.stations.filter((s) => s.id && s.name).slice(0, 6).map(toStation);
  });
}

const nearCache = memo<Station | null>(24 * 3600_000);
/** Nächste Haltestelle zu Koordinaten (auf ~100 m gerundet zwischengespeichert). */
export function nearestStation(lat: number, lng: number) {
  return nearCache(`${lat.toFixed(3)},${lng.toFixed(3)}`, async () => {
    const r = await get<{ stations: RawStation[] }>(`/locations?x=${lat}&y=${lng}&type=station`);
    const s = r.stations.find((x) => x.id && x.name);
    return s ? toStation(s) : null;
  });
}

const connCache = memo<Connection[]>(5 * 60_000);
interface RawConn {
  from: { departure: string; platform?: string | null; station: { name: string } };
  to: { arrival: string; station: { name: string } };
  duration: string;
  transfers: number;
  products: string[];
}

const durMin = (d: string) => {
  const m = d.match(/(\d+)d(\d+):(\d+)/);
  return m ? Number(m[1]) * 1440 + Number(m[2]) * 60 + Number(m[3]) : 0;
};

export function connections(o: { from: string; to: string; date?: string; time?: string; arrival?: boolean; limit?: number }) {
  const q = new URLSearchParams({ from: o.from, to: o.to, limit: String(o.limit ?? 3) });
  if (o.date) q.set("date", o.date);
  if (o.time) q.set("time", o.time);
  if (o.arrival) q.set("isArrivalTime", "1");
  return connCache(q.toString(), async () => {
    const r = await get<{ connections: RawConn[] }>(`/connections?${q}`);
    return r.connections.map((c) => ({
      from: c.from.station.name,
      to: c.to.station.name,
      dep: c.from.departure,
      arr: c.to.arrival,
      depPlatform: c.from.platform ?? undefined,
      durationMin: durMin(c.duration),
      transfers: c.transfers,
      products: [...new Set(c.products)],
    }));
  });
}

/** Link auf die SBB-Verbindungssuche mit vorausgefüllten Feldern. */
export function sbbLink(from: string, to: string, date?: string, time?: string) {
  const q = new URLSearchParams({ von: from, nach: to });
  if (date) q.set("datum", date);
  if (time) q.set("zeit", time);
  return `https://www.sbb.ch/de?${q}`;
}
