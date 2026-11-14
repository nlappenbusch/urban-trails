"use client";
/** Spielstand im Browser: funktioniert ohne Konto; mit Konto wird er synchronisiert. */
import { emptyState, merge, type GameState, type RiddleResult } from "./game";

const KEY = "ut-game-v1";
const USER_KEY = "ut-user";
const EVENT = "ut-game";
const PROGRESS_PREFIX = "ut-progress-";

function read(): GameState {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (raw && raw.v === 1) return { v: 1, stops: raw.stops ?? {}, riddles: raw.riddles ?? {} };
  } catch {
    /* leer starten */
  }
  return emptyState();
}

/** Aktueller Stand inkl. der Stopp-Häkchen aus der Tour-Ansicht. */
export function getState(): GameState {
  const s = read();
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k?.startsWith(PROGRESS_PREFIX)) continue;
      const tourKey = progressToTourKey(k.slice(PROGRESS_PREFIX.length));
      const ids = JSON.parse(localStorage.getItem(k) ?? "[]");
      if (tourKey && Array.isArray(ids)) s.stops[tourKey] = [...new Set([...(s.stops[tourKey] ?? []), ...ids])];
    }
  } catch {
    /* nur Spielstand */
  }
  return s;
}

/** Bekannte Tour-Schlüssel ("city/tour"), damit "city-tour" eindeutig zurückübersetzt wird. */
let tourKeys: string[] = [];
export function registerTourKeys(keys: string[]) {
  tourKeys = keys;
}
function progressToTourKey(flat: string): string | null {
  return tourKeys.find((k) => k.replace("/", "-") === flat) ?? null;
}

function write(s: GameState, silent = false) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* Speicher voll/gesperrt */
  }
  if (!silent) window.dispatchEvent(new Event(EVENT));
}

export function onGameChange(fn: () => void) {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

export function getRiddleResult(tourKey: string, stopId: string): RiddleResult | undefined {
  return read().riddles[`${tourKey}/${stopId}`];
}

export function saveRiddleResult(tourKey: string, stopId: string, r: RiddleResult) {
  const s = read();
  if (s.riddles[`${tourKey}/${stopId}`]) return; // erstes Ergebnis zählt
  s.riddles[`${tourKey}/${stopId}`] = r;
  write(s);
  scheduleSync();
}

/** Von der Tour-Ansicht aufgerufen, wenn Stopps abgehakt werden. */
export function stopsChanged(tourKey: string, ids: string[]) {
  const s = read();
  s.stops[tourKey] = ids;
  write(s);
  scheduleSync();
}

// ── Konto ───────────────────────────────────────────────────
export function currentUser(): string | null {
  try {
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

function adopt(user: { name: string; state: GameState } | null) {
  try {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, user.name);
      const merged = merge(getState(), user.state);
      // Häkchen aus dem Konto auch in der Tour-Ansicht zeigen
      for (const [tourKey, ids] of Object.entries(merged.stops)) localStorage.setItem(PROGRESS_PREFIX + tourKey.replace("/", "-"), JSON.stringify(ids));
      write(merged, true);
    }
  } catch {
    /* ohne Speicher kein Konto-Abgleich */
  }
  window.dispatchEvent(new Event(EVENT));
}

export interface AccountResponse {
  user?: { name: string; state: GameState; points: number } | null;
  leaderboard?: { name: string; points: number }[];
  error?: string;
}

export async function accountCall(action: "register" | "login" | "logout" | "sync" | "delete", data: { name?: string; password?: string } = {}): Promise<AccountResponse> {
  try {
    const res = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...data, state: action === "logout" || action === "delete" ? undefined : getState() }),
    });
    const body = (await res.json()) as AccountResponse;
    if (res.ok && "user" in body) adopt(body.user ?? null);
    else if (res.status === 401 && action === "sync") adopt(null);
    return body;
  } catch {
    return { error: "Keine Verbindung. Dein Spielstand bleibt auf diesem Gerät gespeichert." };
  }
}

export async function fetchAccount(): Promise<AccountResponse> {
  try {
    const res = await fetch("/api/account", { cache: "no-store" });
    const body = (await res.json()) as AccountResponse;
    if (body.user) adopt(body.user);
    else if (currentUser()) adopt(null);
    return body;
  } catch {
    return { error: "offline" };
  }
}

let timer: ReturnType<typeof setTimeout> | null = null;
function scheduleSync() {
  if (!currentUser()) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void accountCall("sync"), 2500);
}
