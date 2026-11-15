import { NextRequest } from "next/server";
import QRCode from "qrcode";
import { SITE_URL } from "@/lib/seo";

export const runtime = "nodejs";

/** GET /api/qr?p=/ausfluege/… → QR-Code (SVG) für einen Link auf dieser Website. Nur eigene Pfade. */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p") ?? "";
  if (!p.startsWith("/") || p.startsWith("//") || p.length > 1200) return new Response("Ungültiger Pfad", { status: 400 });
  const svg = await QRCode.toString(`${SITE_URL}${p}`, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#111111", light: "#ffffff" } });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=31536000, immutable" } });
}
