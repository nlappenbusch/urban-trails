/** Sonne auf der Piste: Sonnenstand, Besonnung je Hang, Tagesplan (auch im Browser nutzbar). */

export interface SunRun {
  n: string;
  d: string;
  km: number;
  top: number;
  /** Abschnitte: [Ausrichtung ° (Richtung, in die der Hang abfällt), Neigung °, km] */
  seg: [number, number, number][];
  g: [number, number][];
}

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Sonnenstand (Azimut ab Nord im Uhrzeigersinn, Höhe über Horizont) – Genauigkeit ~0,5°, reicht für Hänge */
export function sunPos(when: Date, lat: number, lng: number) {
  const d = when.getTime() / 86400000 - 10957.5; // Tage seit J2000
  const g = rad(357.529 + 0.98560028 * d);
  const q = 280.459 + 0.98564736 * d;
  const L = rad(q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
  const e = rad(23.439 - 0.00000036 * d);
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = (18.697374558 + 24.06570982441908 * d) % 24;
  const H = rad(gmst * 15 + lng) - ra;
  const phi = rad(lat);
  const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const az = (deg(Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi))) + 180 + 360) % 360;
  return { az, alt: deg(alt) };
}

/** Zürcher Ortszeit «HH:MM» an einem Tag → Date (UTC) */
export function zurich(iso: string, hm: string) {
  const guess = new Date(`${iso}T${hm}:00Z`);
  const local = new Date(guess.toLocaleString("en-US", { timeZone: "Europe/Zurich" }));
  const utc = new Date(guess.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(guess.getTime() - (local.getTime() - utc.getTime()));
}

/** Besonnung 0…1 (cos Einfallswinkel). Unter 4° Sonnenhöhe verdecken die Berge ringsum. */
export function sunOn(run: SunRun, sun: { az: number; alt: number }) {
  if (sun.alt < 4) return 0;
  const a = rad(sun.alt);
  let s = 0, w = 0;
  for (const [asp, slope, km] of run.seg) {
    const c = Math.cos(rad(slope)) * Math.sin(a) + Math.sin(rad(slope)) * Math.cos(a) * Math.cos(rad(sun.az - asp));
    s += Math.max(0, c) * km;
    w += km;
  }
  return w ? s / w : 0;
}

export const SUNNY = 0.4;
export const HALF = 0.15;
export const sunClass = (v: number) => (v >= SUNNY ? "sonnig" : v >= HALF ? "halb" : "schatten");

export const SECTORS = ["N", "NO", "O", "SO", "S", "SW", "W", "NW"];
export const SECTOR_LONG = ["Nord", "Nordost", "Ost", "Südost", "Süd", "Südwest", "West", "Nordwest"];
export const sector = (a: number) => Math.round(((a % 360) + 360) % 360 / 45) % 8;

/** km je Himmelsrichtung (für die Kompassrose) */
export function aspectShare(runs: SunRun[]) {
  const km = Array(8).fill(0) as number[];
  for (const r of runs) for (const [a, , k] of r.seg) km[sector(a)] += k;
  return km;
}

export const HOURS = ["08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

/** Für jede halbe Stunde: Sonnenstand und Pisten-km in der Sonne */
export function sunDay(runs: SunRun[], iso: string, c: { lat: number; lng: number }) {
  const total = runs.reduce((s, r) => s + r.km, 0);
  return HOURS.map((hm) => {
    const sun = sunPos(zurich(iso, hm), c.lat, c.lng);
    const vals = runs.map((r) => sunOn(r, sun));
    const sunny = runs.reduce((s, r, i) => s + (vals[i] >= SUNNY ? r.km : 0), 0);
    return { hm, sun, vals, sunny, share: total ? sunny / total : 0 };
  });
}

/** Benannte Pisten, die in einem Zeitfenster am längsten Sonne haben */
export function bestRuns(runs: SunRun[], day: ReturnType<typeof sunDay>, from: string, to: string, n = 4) {
  const slots = day.filter((h) => h.hm >= from && h.hm <= to);
  const by = new Map<string, { name: string; d: string; score: number; km: number }>();
  runs.forEach((r, i) => {
    if (!r.n) return;
    const score = slots.reduce((s, h) => s + h.vals[i], 0) / Math.max(1, slots.length);
    const k = r.n.toLowerCase();
    const cur = by.get(k) ?? { name: r.n, d: r.d, score: 0, km: 0 };
    cur.score = (cur.score * cur.km + score * r.km) / (cur.km + r.km);
    cur.km += r.km;
    by.set(k, cur);
  });
  return [...by.values()].filter((x) => x.score >= SUNNY && x.km >= 0.3).sort((a, b) => b.score * Math.sqrt(b.km) - a.score * Math.sqrt(a.km)).slice(0, n);
}

export const dirText = (az: number) => SECTOR_LONG[sector(az)].replace(/^./, (c) => c.toLowerCase());
