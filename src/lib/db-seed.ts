/**
 * Schnappschuss → Datenbank: alle JSON-Bestände in src/data als Datensätze der Tabelle «ort».
 * SEED_STAND hochsetzen, wenn ein Build-Skript neue JSON-Dateien erzeugt hat – dann spielt der
 * nächste Start die neuen Stände ein (ältere Stände in der DB werden überschrieben, neuere nicht).
 */
import rubriken from "@/data/rubriken.json";
import maerkte from "@/data/weihnachtsmaerkte.json";
import schlitteln from "@/data/schlitteln.json";
import ski from "@/data/skigebiete.json";
import nachtski from "@/data/nachtski.json";
import baden from "@/data/badestellen.json";
import { places } from "@/lib/ausfluege";
import type { UpsertRow } from "@/lib/db";

export const SEED_STAND = "2026-11-16T12:01";

type Any = Record<string, unknown> & { id: string; name: string };
const num = (x: unknown) => (typeof x === "number" ? x : Number(x));

export function seedRows(): UpsertRow[] {
  const s = SEED_STAND;
  const rows: UpsertRow[] = [];
  for (const r of rubriken as (Any & { r: string; lat: number; lng: number; kt: string; ort?: string; web?: string })[])
    rows.push({ id: `osm:${r.id}`, art: r.r, bestand: "verzeichnis", name: r.name, lat: r.lat, lng: r.lng, kanton: r.kt, ort: r.ort, web: r.web, daten: r, quelle: "osm", quelle_ref: r.id, stand: s });
  for (const m of maerkte as (Any & { kind: string; place: string; canton: string; coords: { lat: number; lng: number }; url?: string; source?: string; checked?: string })[])
    rows.push({ id: `markt:${m.id}`, art: m.kind, bestand: "maerkte", name: m.name, lat: m.coords.lat, lng: m.coords.lng, kanton: m.canton, ort: m.place, web: m.url, daten: m, quelle: "recherche", quelle_ref: m.source, stand: s });
  for (const r of schlitteln as (Any & { kt: string; ort?: string; web?: string; top: { lat: number; lng: number } })[])
    rows.push({ id: `sled:${r.id}`, art: "schlittelweg", bestand: "schlitteln", name: r.name, lat: r.top.lat, lng: r.top.lng, kanton: r.kt, ort: r.ort, web: r.web, daten: r, quelle: "osm", stand: s });
  const areas = (Array.isArray(ski) ? ski : (ski as { areas: Any[] }).areas) as (Any & { canton?: string; coords: { lat: number; lng: number }; url?: string })[];
  for (const a of areas)
    rows.push({ id: `ski:${a.id}`, art: "skigebiet", bestand: "ski", name: a.name, lat: a.coords.lat, lng: a.coords.lng, kanton: a.canton, web: a.url, daten: a, quelle: "recherche", stand: s });
  for (const o of nachtski as (Any & { type: string; place: string; canton?: string; coords: { lat: number; lng: number }; url?: string; source?: string })[])
    rows.push({ id: `nacht:${o.id}`, art: `nacht-${o.type}`, bestand: "nachtski", name: o.name, lat: o.coords.lat, lng: o.coords.lng, kanton: o.canton, ort: o.place, web: o.url, daten: o, quelle: "recherche", quelle_ref: o.source, stand: s });
  for (const b of baden as (Any & { kind: string; lat: number; lng: number })[])
    rows.push({ id: `bad:${b.id}`, art: b.kind, bestand: "baden", name: b.name, lat: num(b.lat), lng: num(b.lng), daten: b, quelle: "osm", quelle_ref: b.id, stand: s });
  for (const p of places) {
    if (!p.coords) continue;
    const { img: _img, ...rest } = p as typeof p & { img?: unknown };
    rows.push({ id: `k:${p.id}`, art: p.kind, bestand: "kuratiert", name: p.name, lat: p.coords.lat, lng: p.coords.lng, ort: p.town, web: p.url, daten: rest, quelle: "kuratiert", quelle_ref: p.source, stand: s });
  }
  return rows;
}
