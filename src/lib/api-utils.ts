import { NextRequest, NextResponse } from "next/server";

export const noStore = { "Cache-Control": "no-store" };
export const json = (body: unknown, status = 200, headers: Record<string, string> = noStore) => NextResponse.json(body, { status, headers });

export function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export const clientIp = (req: NextRequest) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";

const hits = new Map<string, number[]>();
/** Einfache Drossel im Speicher: max. `max` Aufrufe pro `windowMs` je Schlüssel. */
export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return list.length > max;
}

/** Kleiner Zwischenspeicher für Antworten fremder Dienste. */
export function memo<T>(ttlMs: number) {
  const store = new Map<string, { at: number; value: T }>();
  return async (key: string, load: () => Promise<T>): Promise<T> => {
    const hit = store.get(key);
    if (hit && Date.now() - hit.at < ttlMs) return hit.value;
    const value = await load();
    store.set(key, { at: Date.now(), value });
    if (store.size > 2000) store.delete(store.keys().next().value!);
    return value;
  };
}
