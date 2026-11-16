import { NextResponse } from "next/server";
import { checkKey, isAdmin } from "@/lib/admin";
import { runSync } from "@/lib/db-sync";

export const dynamic = "force-dynamic";

/** Abgleich mit OpenStreetMap – nachts per Cron (Header x-admin-key) oder aus der Pflegeseite. */
export async function POST(req: Request) {
  if (!checkKey(req) && !(await isAdmin())) return NextResponse.json({ error: "nicht erlaubt" }, { status: 401 });
  const msg = await runSync();
  if (req.headers.get("accept")?.includes("text/html")) return new Response(null, { status: 303, headers: { Location: "/admin" } });
  return NextResponse.json({ ok: !msg.startsWith("Abgleich fehlgeschlagen"), msg });
}
