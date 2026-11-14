import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { emptyState, merge, sanitize, score, type Catalog, type GameState } from "./game";

/**
 * Kundenkonto ohne Fremddienst: Spielername + Passwort, gespeichert als
 * JSON-Datei auf dem Server (Volume /app/data). Keine E-Mail, kein Tracking.
 */
const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const DIR = () => process.env.UT_DATA_DIR || path.join(process.cwd(), "data");
const FILE = () => path.join(DIR(), "accounts.json");
const SECRET_FILE = () => path.join(DIR(), "session.secret");
export const COOKIE = "ut_session";
const MAX_AGE = 60 * 60 * 24 * 180;

interface Account {
  name: string;
  salt: string;
  hash: string;
  created: number;
  updated: number;
  state: GameState;
  /** Zwischengespeicherte Punkte für die Rangliste */
  points: number;
}
interface Db {
  accounts: Record<string, Account>;
}

let db: Db | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Db> {
  if (db) return db;
  try {
    db = JSON.parse(await fs.readFile(FILE(), "utf8")) as Db;
    if (!db.accounts) db = { accounts: {} };
  } catch {
    db = { accounts: {} };
  }
  return db;
}

async function save() {
  await fs.mkdir(DIR(), { recursive: true });
  const tmp = `${FILE()}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db));
  await fs.rename(tmp, FILE());
}

/** Alle Änderungen nacheinander ausführen (eine Datei, ein Prozess). */
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

let secret: Buffer | null = null;
async function getSecret() {
  if (secret) return secret;
  if (process.env.UT_SESSION_SECRET && process.env.UT_SESSION_SECRET.length >= 32) return (secret = Buffer.from(process.env.UT_SESSION_SECRET));
  try {
    secret = Buffer.from(await fs.readFile(SECRET_FILE(), "utf8"), "hex");
    if (secret.length < 32) throw Error("short");
  } catch {
    secret = randomBytes(48);
    await fs.mkdir(DIR(), { recursive: true });
    await fs.writeFile(SECRET_FILE(), secret.toString("hex"), { mode: 0o600 });
  }
  return secret;
}

export const keyOf = (name: string) => name.trim().toLowerCase();

export function validName(name: string) {
  return /^[A-Za-zÀ-ÿ0-9 _.-]{3,20}$/.test(name.trim());
}

async function sign(key: string) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const body = Buffer.from(JSON.stringify({ k: key, exp })).toString("base64url");
  const mac = createHmac("sha256", await getSecret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

export async function sessionCookie(key: string) {
  return `${COOKIE}=${await sign(key)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export const clearCookie = `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export async function sessionKey(req: Request): Promise<string | null> {
  const raw = (req.headers.get("cookie") ?? "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!raw) return null;
  const [body, mac] = raw.split(".");
  if (!body || !mac) return null;
  const expected = createHmac("sha256", await getSecret()).update(body).digest();
  const given = Buffer.from(mac, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const { k, exp } = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof k !== "string" || exp < Date.now() / 1000) return null;
    return (await load()).accounts[k] ? k : null;
  } catch {
    return null;
  }
}

// ── Schutz vor Durchprobieren ───────────────────────────────
const attempts = new Map<string, { n: number; until: number }>();
export function throttled(id: string) {
  const a = attempts.get(id);
  return Boolean(a && a.n >= 8 && a.until > Date.now());
}
export function noteFailure(id: string) {
  const a = attempts.get(id);
  if (!a || a.until < Date.now()) attempts.set(id, { n: 1, until: Date.now() + 15 * 60000 });
  else a.n++;
  if (attempts.size > 5000) attempts.clear();
}

export async function register(name: string, password: string, catalog: Catalog, deviceState: unknown) {
  return locked(async () => {
    const d = await load(), key = keyOf(name);
    if (d.accounts[key]) return { error: "Dieser Spielername ist schon vergeben." as const };
    if (Object.keys(d.accounts).length >= 50000) return { error: "Im Moment sind keine neuen Konten möglich." as const };
    const salt = randomBytes(16);
    const state = sanitize(deviceState, catalog);
    d.accounts[key] = {
      name: name.trim(),
      salt: salt.toString("hex"),
      hash: (await scrypt(password, salt, 64)).toString("hex"),
      created: Date.now(),
      updated: Date.now(),
      state,
      points: score(state, catalog).points,
    };
    await save();
    return { key, account: d.accounts[key] };
  });
}

export async function login(name: string, password: string) {
  const d = await load(), key = keyOf(name), acc = d.accounts[key];
  // Immer rechnen, damit die Antwortzeit nichts verrät.
  const salt = acc ? Buffer.from(acc.salt, "hex") : Buffer.alloc(16);
  const hash = await scrypt(password, salt, 64);
  if (!acc || !timingSafeEqual(hash, Buffer.from(acc.hash, "hex"))) return null;
  return { key, account: acc };
}

export async function getAccount(key: string) {
  return (await load()).accounts[key] ?? null;
}

/** Gerätestand ins Konto einmischen; liefert den zusammengeführten Stand. */
export async function syncState(key: string, deviceState: unknown, catalog: Catalog) {
  return locked(async () => {
    const d = await load(), acc = d.accounts[key];
    if (!acc) return null;
    const merged = merge(sanitize(acc.state, catalog), sanitize(deviceState, catalog));
    const before = JSON.stringify(acc.state);
    acc.state = merged;
    acc.points = score(merged, catalog).points;
    if (JSON.stringify(merged) !== before) {
      acc.updated = Date.now();
      await save();
    }
    return acc;
  });
}

export async function deleteAccount(key: string) {
  return locked(async () => {
    const d = await load();
    delete d.accounts[key];
    await save();
  });
}

export async function leaderboard(limit = 20) {
  const d = await load();
  return Object.values(d.accounts)
    .filter((a) => a.points > 0)
    .sort((a, b) => b.points - a.points || a.updated - b.updated)
    .slice(0, limit)
    .map((a) => ({ name: a.name, points: a.points }));
}

export { emptyState };
