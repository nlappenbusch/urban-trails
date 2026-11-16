/**
 * Zugang zur Pflegeseite: ein Passwort aus der Umgebung (UT_ADMIN_PASSWORD).
 * Browser: Cookie mit HMAC des Passworts. Cron/Skripte: Header «x-admin-key».
 * Ohne gesetztes Passwort ist die Pflege komplett aus.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ut-admin";
const pw = () => process.env.UT_ADMIN_PASSWORD ?? "";
export const adminEnabled = () => pw().length >= 12;

export const adminToken = () => createHmac("sha256", pw()).update("ut-admin-v1").digest("base64url");

function same(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export const checkPassword = (given: string) => adminEnabled() && same(given, pw());
export const checkKey = (req: Request) => adminEnabled() && same(req.headers.get("x-admin-key") ?? "", pw());

export async function isAdmin() {
  if (!adminEnabled()) return false;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  return same(c, adminToken());
}
