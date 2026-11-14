import { NextRequest, NextResponse } from "next/server";
import { buildCatalog } from "@/lib/catalog";
import { score } from "@/lib/game";
import {
  clearCookie,
  deleteAccount,
  getAccount,
  keyOf,
  leaderboard,
  login,
  noteFailure,
  register,
  sessionCookie,
  sessionKey,
  syncState,
  throttled,
  validName,
} from "@/lib/account-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };
const json = (body: unknown, init: { status?: number; cookie?: string } = {}) =>
  NextResponse.json(body, { status: init.status ?? 200, headers: init.cookie ? { ...noStore, "Set-Cookie": init.cookie } : noStore });

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

/** Aktuelles Konto (falls angemeldet) plus Rangliste. */
export async function GET(req: NextRequest) {
  const key = await sessionKey(req);
  const acc = key ? await getAccount(key) : null;
  return json({ user: acc ? { name: acc.name, state: acc.state, points: acc.points } : null, leaderboard: await leaderboard() });
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return json({ error: "Ungültige Herkunft." }, { status: 403 });
  let body: { action?: string; name?: string; password?: string; state?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  const catalog = buildCatalog();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const name = String(body.name ?? ""), password = String(body.password ?? "");

  if (body.action === "register" || body.action === "login") {
    if (throttled(ip) || throttled(`n:${keyOf(name)}`)) return json({ error: "Zu viele Versuche. Bitte in einer Viertelstunde nochmal." }, { status: 429 });
    if (body.action === "register") {
      if (!validName(name)) return json({ error: "Spielername: 3–20 Zeichen, Buchstaben, Zahlen, Leerzeichen, . _ -" }, { status: 400 });
      if (password.length < 8 || password.length > 200) return json({ error: "Das Passwort braucht mindestens 8 Zeichen." }, { status: 400 });
      const res = await register(name, password, catalog, body.state);
      if ("error" in res) {
        noteFailure(ip);
        return json({ error: res.error }, { status: 409 });
      }
      return json({ user: { name: res.account.name, state: res.account.state, points: res.account.points }, leaderboard: await leaderboard() }, { cookie: await sessionCookie(res.key) });
    }
    const res = await login(name, password);
    if (!res) {
      noteFailure(ip);
      noteFailure(`n:${keyOf(name)}`);
      return json({ error: "Spielername oder Passwort stimmt nicht." }, { status: 401 });
    }
    const acc = (await syncState(res.key, body.state, catalog))!;
    return json({ user: { name: acc.name, state: acc.state, points: acc.points }, leaderboard: await leaderboard() }, { cookie: await sessionCookie(res.key) });
  }

  if (body.action === "logout") return json({ user: null }, { cookie: clearCookie });

  const key = await sessionKey(req);
  if (!key) return json({ error: "Nicht angemeldet." }, { status: 401 });

  if (body.action === "sync") {
    const acc = await syncState(key, body.state, catalog);
    if (!acc) return json({ error: "Konto nicht gefunden." }, { status: 404 });
    return json({ user: { name: acc.name, state: acc.state, points: score(acc.state, catalog).points } });
  }
  if (body.action === "delete") {
    await deleteAccount(key);
    return json({ user: null }, { cookie: clearCookie });
  }
  return json({ error: "Unbekannte Aktion." }, { status: 400 });
}
