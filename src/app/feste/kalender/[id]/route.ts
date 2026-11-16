import { FESTE, heuteCH, sicher } from "@/lib/feste";
import { SITE_URL } from "@/lib/seo";

/** Termine eines Anlasses als .ics (ganztägig) – für Handy- und Outlook-Kalender. */
export const revalidate = 3600;

export function generateStaticParams() {
  return FESTE.map((f) => ({ id: f.id }));
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const ymd = (iso: string) => iso.replace(/-/g, "");
const plus1 = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
};
/** Zeilen über 75 Zeichen falten (RFC 5545) */
const fold = (line: string) => line.match(/.{1,73}/g)!.join("\r\n ");

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const f = FESTE.find((x) => x.id === id);
  if (!f) return new Response("Nicht gefunden", { status: 404 });
  const heute = heuteCH();
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const events = f.termine
    .filter((t) => (t.bis ?? t.von) >= heute)
    .map((t) =>
      [
        "BEGIN:VEVENT",
        `UID:${f.id}-${t.von}@urban-trails.ch`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${ymd(t.von)}`,
        `DTEND;VALUE=DATE:${ymd(plus1(t.bis ?? t.von))}`,
        `SUMMARY:${esc(f.name)}`,
        `LOCATION:${esc(`${f.ort}, Schweiz`)}`,
        `GEO:${f.lat};${f.lng}`,
        `DESCRIPTION:${esc(`${f.text}${sicher(f, t) ? "" : " (Datum voraussichtlich – bitte beim Veranstalter prüfen.)"}\n${f.web ?? `${SITE_URL}/feste#${f.id}`}`)}`,
        `URL:${f.web ?? `${SITE_URL}/feste#${f.id}`}`,
        "END:VEVENT",
      ]
        .map(fold)
        .join("\r\n"),
    );
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Urban Trails//Feste//DE", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR", ""].join("\r\n");
  return new Response(body, { headers: { "content-type": "text/calendar; charset=utf-8", "content-disposition": `attachment; filename="${f.id}.ics"` } });
}
