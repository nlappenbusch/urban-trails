import { ADMIN_COOKIE, adminToken, checkPassword } from "@/lib/admin";

export const dynamic = "force-dynamic";

// Relative Weiterleitung: hinter dem Proxy kennt der Container die öffentliche Adresse nicht
const back = (to: string, cookie?: string) => new Response(null, { status: 303, headers: { Location: to, ...(cookie ? { "Set-Cookie": cookie } : {}) } });

export async function POST(req: Request) {
  const form = await req.formData();
  const secure = (req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "")) === "https" ? "; Secure" : "";
  if (form.get("logout")) return back("/admin", `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${secure}`);
  if (!checkPassword(String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 1500)); // Raten bremsen
    return back("/admin?fehler=1");
  }
  return back("/admin", `${ADMIN_COOKIE}=${adminToken()}; Path=/; Max-Age=${60 * 60 * 24 * 30}; HttpOnly; SameSite=Strict${secure}`);
}
