/**
 * Orte-Datenbank (SQLite, eingebaut in Node ≥ 22.13 – kein Zusatzpaket).
 *
 * Eine Tabelle «ort» für alles: Verzeichnis (OSM), geprüfte Orte, Weihnachtsmärkte,
 * Schlittelwege, Skigebiete, Nachtski. Jeder Datensatz weiss, woher er kommt (quelle, quelle_ref)
 * und von wann die Daten sind (stand). Redaktionelle Korrekturen liegen getrennt in «korrektur»
 * und überleben jeden Abgleich.
 *
 * Datei: $UT_DATA_DIR/orte.db (Produktion: Docker-Volume /app/data). Fehlt sie, wird sie aus den
 * JSON-Schnappschüssen in src/data befüllt; neuere Schnappschüsse überschreiben nur ältere Stände.
 */
import fs from "node:fs";
import path from "node:path";
import { seedRows, SEED_STAND } from "@/lib/db-seed";

type Sqlite = typeof import("node:sqlite");
type DB = InstanceType<Sqlite["DatabaseSync"]>;

export interface OrtRow {
  id: string;
  art: string;
  bestand: Bestand;
  name: string;
  lat: number;
  lng: number;
  kanton: string | null;
  ort: string | null;
  web: string | null;
  daten: string;
  status: "aktiv" | "versteckt" | "verschwunden";
  hervorgehoben: number;
  gleich_wie: string | null;
  quelle: string;
  quelle_ref: string | null;
  stand: string;
  erstellt: string;
  geaendert: string;
  fehlt_seit: string | null;
}
export type Bestand = "verzeichnis" | "kuratiert" | "maerkte" | "schlitteln" | "ski" | "nachtski" | "baden";

/** Felder, die in der Pflegeseite korrigiert werden können */
export const KORR_FELDER = ["name", "text", "web", "hours", "status", "hervorgehoben"] as const;
export type KorrFeld = (typeof KORR_FELDER)[number];

const SCHEMA = `
CREATE TABLE IF NOT EXISTS ort (
  id TEXT PRIMARY KEY,
  art TEXT NOT NULL,
  bestand TEXT NOT NULL,
  name TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  kanton TEXT,
  ort TEXT,
  web TEXT,
  daten TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'aktiv',
  hervorgehoben INTEGER NOT NULL DEFAULT 0,
  gleich_wie TEXT,
  quelle TEXT NOT NULL,
  quelle_ref TEXT,
  stand TEXT NOT NULL,
  erstellt TEXT NOT NULL,
  geaendert TEXT NOT NULL,
  fehlt_seit TEXT
);
CREATE INDEX IF NOT EXISTS ort_bestand ON ort(bestand, art);
CREATE INDEX IF NOT EXISTS ort_kanton ON ort(kanton);
CREATE INDEX IF NOT EXISTS ort_geo ON ort(lat, lng);
CREATE TABLE IF NOT EXISTS korrektur (
  ort_id TEXT NOT NULL,
  feld TEXT NOT NULL,
  wert TEXT,
  von TEXT,
  am TEXT NOT NULL,
  PRIMARY KEY (ort_id, feld)
);
CREATE TABLE IF NOT EXISTS protokoll (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  am TEXT NOT NULL,
  art TEXT NOT NULL,
  text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT);
`;

const now = () => new Date().toISOString();
let db: DB | undefined;

export function dbFile() {
  const dir = process.env.UT_DATA_DIR || path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, "orte.db");
}

/** Verbindung (einmal pro Prozess), Schema anlegen, bei Bedarf aus Schnappschuss befüllen. */
export function getDb(): DB {
  if (db) return db;
  // getBuiltinModule umgeht den Bundler (node:sqlite ist ein reines node:-Modul)
  const { DatabaseSync } = process.getBuiltinModule("node:sqlite") as Sqlite;
  const d = new DatabaseSync(dbFile());
  d.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=15000; PRAGMA synchronous=NORMAL;");
  d.exec(SCHEMA);
  db = d;
  seedIfNeeded(d);
  return d;
}

function metaGet(d: DB, k: string) {
  return (d.prepare("SELECT v FROM meta WHERE k = ?").get(k) as { v: string } | undefined)?.v;
}
function metaSet(d: DB, k: string, v: string) {
  d.prepare("INSERT INTO meta(k, v) VALUES(?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").run(k, v);
}
export function bump(d = getDb()) {
  metaSet(d, "version", String(Number(metaGet(d, "version") ?? 0) + 1));
}
export function log(art: string, text: string, d = getDb()) {
  d.prepare("INSERT INTO protokoll(am, art, text) VALUES(?, ?, ?)").run(now(), art, text);
}

export interface UpsertRow {
  id: string;
  art: string;
  bestand: Bestand;
  name: string;
  lat: number;
  lng: number;
  kanton?: string | null;
  ort?: string | null;
  web?: string | null;
  daten: unknown;
  quelle: string;
  quelle_ref?: string | null;
  stand: string;
}

/**
 * Datensätze einspielen: neue anlegen, bestehende nur aktualisieren, wenn der eingehende Stand neuer ist.
 * Status, Hervorhebung und Korrekturen bleiben unangetastet.
 */
export function upsert(rows: UpsertRow[], d = getDb()) {
  const ins = d.prepare(`INSERT INTO ort (id, art, bestand, name, lat, lng, kanton, ort, web, daten, quelle, quelle_ref, stand, erstellt, geaendert)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET art = excluded.art, name = excluded.name, lat = excluded.lat, lng = excluded.lng, kanton = excluded.kanton,
      ort = excluded.ort, web = excluded.web, daten = excluded.daten, quelle = excluded.quelle, quelle_ref = excluded.quelle_ref,
      stand = excluded.stand, geaendert = excluded.geaendert, fehlt_seit = NULL,
      status = CASE WHEN ort.status = 'verschwunden' THEN 'aktiv' ELSE ort.status END
    WHERE excluded.stand > ort.stand`);
  const t = now();
  let n = 0;
  for (const r of rows) {
    const res = ins.run(r.id, r.art, r.bestand, r.name, r.lat, r.lng, r.kanton ?? null, r.ort ?? null, r.web ?? null, JSON.stringify(r.daten), r.quelle, r.quelle_ref ?? null, r.stand, t, t);
    n += Number(res.changes);
  }
  return n;
}

/** Was im Bestand ist, aber in der Quelle fehlt: markieren, nach 14 Tagen ausblenden (nie löschen). */
export function markMissing(bestand: Bestand, seen: Set<string>, quelle: string, d = getDb()) {
  const rows = d.prepare("SELECT id, fehlt_seit FROM ort WHERE bestand = ? AND quelle = ? AND status != 'versteckt'").all(bestand, quelle) as { id: string; fehlt_seit: string | null }[];
  const t = now();
  const limit = new Date(Date.now() - 14 * 864e5).toISOString();
  let marked = 0, gone = 0;
  for (const r of rows) {
    if (seen.has(r.id)) continue;
    if (!r.fehlt_seit) {
      d.prepare("UPDATE ort SET fehlt_seit = ? WHERE id = ?").run(t, r.id);
      marked++;
    } else if (r.fehlt_seit < limit) {
      d.prepare("UPDATE ort SET status = 'verschwunden' WHERE id = ? AND status = 'aktiv'").run(r.id);
      gone++;
    }
  }
  return { marked, gone };
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set(["der", "die", "das", "de", "la", "le", "du", "des", "und", "et", "im", "am", "zum", "zur", "von", "museum", "schloss", "burg", "zoo", "tierpark"]);
const words = (s: string) => new Set(norm(s).split(" ").filter((w) => w.length > 1));
const tokens = (s: string) => new Set([...words(s)].filter((w) => w.length > 2 && !STOP.has(w)));
/** Gleicher Ort? Ganze Wörter des kürzeren Namens stecken im längeren, oder ≥ 60 % der Kernwörter decken sich. */
export function sameName(a: string, b: string) {
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  const [wa, wb] = [words(a), words(b)];
  const [short, long] = wa.size <= wb.size ? [wa, wb] : [wb, wa];
  if (short.size && [...short].every((w) => long.has(w))) return true;
  const ta = tokens(a), tb = tokens(b);
  if (!ta.size || !tb.size) return false;
  let hit = 0;
  for (const w of ta) if (tb.has(w)) hit++;
  return hit / Math.max(ta.size, tb.size) >= 0.6;
}
const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const r = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/** Dubletten: Verzeichnis-Eintrag, der einem geprüften Ort entspricht (< 400 m, ähnlicher Name) → gleich_wie. */
export function linkDuplicates(d = getDb()) {
  // nur Sehenswürdigkeiten/Aktivitäten/Bäder – keine Hotels, Restaurants, Bars, Wanderungen (andere Dinge am selben Ort)
  const ours = d.prepare("SELECT id, name, lat, lng FROM ort WHERE bestand = 'kuratiert' AND art NOT IN ('hotel', 'restaurant', 'bar', 'cafe') AND json_extract(daten, '$.hike') IS NULL").all() as { id: string; name: string; lat: number; lng: number }[];
  const dir = d.prepare("SELECT id, name, lat, lng, gleich_wie FROM ort WHERE bestand IN ('verzeichnis', 'baden')").all() as { id: string; name: string; lat: number; lng: number; gleich_wie: string | null }[];
  const set = d.prepare("UPDATE ort SET gleich_wie = ? WHERE id = ?");
  let n = 0;
  for (const x of dir) {
    const m = ours.find((o) => Math.abs(o.lat - x.lat) < 0.01 && Math.abs(o.lng - x.lng) < 0.015 && km(o, x) < 0.4 && sameName(o.name, x.name));
    const v = m?.id ?? null;
    if (v !== x.gleich_wie) {
      set.run(v, x.id);
      n++;
    }
  }
  return n;
}

function seedIfNeeded(d: DB) {
  if (metaGet(d, "seed") === SEED_STAND) return;
  d.exec("BEGIN IMMEDIATE");
  try {
    if (metaGet(d, "seed") !== SEED_STAND) {
      const rows = seedRows();
      const changed = upsert(rows, d);
      const dupes = linkDuplicates(d);
      metaSet(d, "seed", SEED_STAND);
      log("schnappschuss", `Schnappschuss ${SEED_STAND}: ${rows.length} Datensätze, ${changed} neu/aktualisiert, ${dupes} Dubletten-Verknüpfungen geändert`, d);
      bump(d);
    }
    d.exec("COMMIT");
  } catch (e) {
    d.exec("ROLLBACK");
    throw e;
  }
}

// ---------- Lesen (mit Prozess-Cache, invalidiert über meta.version) ----------
const cache = new Map<string, { v: string; data: unknown }>();
export function cached<T>(key: string, load: (d: DB) => T): T {
  const d = getDb();
  const v = metaGet(d, "version") ?? "0";
  const hit = cache.get(key);
  if (hit && hit.v === v) return hit.data as T;
  const data = load(d);
  cache.set(key, { v, data });
  return data;
}

/** Korrekturen auf einen Datensatz anwenden (Name/Text/Web/Zeiten). */
function applyKorr<T extends Record<string, unknown>>(daten: T, korr: Map<string, string | null> | undefined): T {
  if (!korr) return daten;
  const out: Record<string, unknown> = { ...daten };
  for (const [f, w] of korr) if (w !== null && ["name", "text", "web", "hours"].includes(f)) out[f] = w;
  return out as T;
}

/**
 * Aktive Datensätze eines Bestands im Format der Seiten (daten-JSON), mit Korrekturen.
 * Zusatz: _gleich (ID des geprüften Orts bei Dubletten) und _top (hervorgehoben).
 */
export function readBestand<T extends object>(bestand: Bestand): (T & { _gleich?: string; _top?: boolean })[] {
  return cached(`bestand:${bestand}`, (d) => {
    const rows = d.prepare("SELECT id, daten, gleich_wie, hervorgehoben FROM ort WHERE bestand = ? AND status = 'aktiv' ORDER BY rowid").all(bestand) as Pick<OrtRow, "id" | "daten" | "gleich_wie" | "hervorgehoben">[];
    const korr = korrMap(d);
    return rows.map((r) => {
      const x = applyKorr(JSON.parse(r.daten) as Record<string, unknown>, korr.get(r.id)) as T;
      return { ...x, ...(r.gleich_wie ? { _gleich: r.gleich_wie } : {}), ...(r.hervorgehoben ? { _top: true } : {}) };
    });
  });
}

export function korrMap(d = getDb()) {
  const m = new Map<string, Map<string, string | null>>();
  for (const k of d.prepare("SELECT ort_id, feld, wert FROM korrektur").all() as { ort_id: string; feld: string; wert: string | null }[]) {
    if (!m.has(k.ort_id)) m.set(k.ort_id, new Map());
    m.get(k.ort_id)!.set(k.feld, k.wert);
  }
  return m;
}

/** Korrektur setzen (wert null = Korrektur entfernen). status/hervorgehoben wirken direkt auf die Spalten. */
export function setKorrektur(id: string, feld: KorrFeld, wert: string | null, von: string) {
  const d = getDb();
  if (!d.prepare("SELECT 1 FROM ort WHERE id = ?").get(id)) throw new Error("unbekannter Ort");
  if (feld === "status") {
    if (wert !== "aktiv" && wert !== "versteckt") throw new Error("Status nur aktiv/versteckt");
    d.prepare("UPDATE ort SET status = ?, geaendert = ? WHERE id = ?").run(wert, now(), id);
  } else if (feld === "hervorgehoben") {
    d.prepare("UPDATE ort SET hervorgehoben = ?, geaendert = ? WHERE id = ?").run(wert === "1" ? 1 : 0, now(), id);
  }
  if (wert === null || wert === "") d.prepare("DELETE FROM korrektur WHERE ort_id = ? AND feld = ?").run(id, feld);
  else d.prepare("INSERT INTO korrektur(ort_id, feld, wert, von, am) VALUES(?, ?, ?, ?, ?) ON CONFLICT(ort_id, feld) DO UPDATE SET wert = excluded.wert, von = excluded.von, am = excluded.am").run(id, feld, wert, von, now());
  log("korrektur", `${id}: ${feld} = ${wert ?? "(entfernt)"} (${von})`, d);
  bump(d);
}
