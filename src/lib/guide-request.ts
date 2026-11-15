import { appendFile, mkdir } from "node:fs/promises";
import { lookup } from "node:dns/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { INTERESTS, LANGUAGES, TIMES } from "@/lib/guide-options";

/**
 * Anfragen für Führungen mit Guide.
 * Jede Anfrage landet als Zeile in data/fuehrungen.jsonl (Volume /app/data).
 * Ist SMTP eingerichtet (SMTP_HOST, SMTP_USER, SMTP_PASS, ANFRAGE_TO), geht zusätzlich
 * eine Mail raus – Reply-To ist die Adresse der anfragenden Person.
 */

export interface GuideRequest {
  id: string;
  at: string;
  city: string;
  tour: string;
  date: string;
  time: string;
  groupSize: number;
  language: string;
  interests: string[];
  occasion: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

const clip = (v: unknown, n: number) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, n);

export function parseRequest(
  body: Record<string, unknown>,
  valid: { cities: Map<string, string>; tours: Map<string, { name: string; city: string }> },
): { ok: true; req: GuideRequest } | { ok: false; error: string } {
  const city = clip(body.city, 60);
  if (!valid.cities.has(city)) return { ok: false, error: "Bitte wähle eine Stadt." };
  const tour = clip(body.tour, 80);
  if (tour && valid.tours.get(tour)?.city !== city) return { ok: false, error: "Die Tour passt nicht zur Stadt." };

  const date = clip(body.date, 10);
  if (date) {
    const d = new Date(`${date}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(+d) || d < today) return { ok: false, error: "Bitte ein Datum ab heute wählen." };
  }
  const time = clip(body.time, 20);
  if (!(TIMES as readonly string[]).includes(time)) return { ok: false, error: "Bitte eine Tageszeit wählen." };
  const groupSize = Math.round(Number(body.groupSize));
  if (!Number.isFinite(groupSize) || groupSize < 1 || groupSize > 200) return { ok: false, error: "Gruppengrösse: 1 bis 200 Personen." };
  const language = clip(body.language, 20);
  if (!(LANGUAGES as readonly string[]).includes(language)) return { ok: false, error: "Bitte eine Sprache wählen." };
  const interests = Array.isArray(body.interests)
    ? body.interests.map((i) => clip(i, 60)).filter((i) => (INTERESTS as readonly string[]).includes(i))
    : [];

  const name = clip(body.name, 80);
  if (name.length < 2) return { ok: false, error: "Bitte deinen Namen angeben." };
  const email = clip(body.email, 120).toLowerCase();
  if (!/^[^\s@<>()",;]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) return { ok: false, error: "Bitte eine gültige E-Mail-Adresse angeben." };
  const phone = clip(body.phone, 40);
  if (phone && !/^[+0-9 ()/.-]{6,40}$/.test(phone)) return { ok: false, error: "Die Telefonnummer sieht nicht richtig aus." };

  return {
    ok: true,
    req: {
      id: `F-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomBytes(3).toString("hex").toUpperCase()}`,
      at: new Date().toISOString(),
      city,
      tour,
      date,
      time,
      groupSize,
      language,
      interests,
      occasion: clip(body.occasion, 120),
      name,
      email,
      phone,
      message: String(body.message ?? "").trim().slice(0, 2000),
    },
  };
}

const DIR = () => process.env.UT_DATA_DIR || path.join(process.cwd(), "data");

export async function storeRequest(r: GuideRequest) {
  await mkdir(DIR(), { recursive: true });
  await appendFile(path.join(DIR(), "fuehrungen.jsonl"), JSON.stringify(r) + "\n", "utf8");
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Mail an das Team. Gibt false zurück, wenn kein SMTP eingerichtet ist oder der Versand scheitert. */
export async function notifyTeam(r: GuideRequest, labels: { city: string; tour?: string }): Promise<boolean> {
  const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS, to = process.env.ANFRAGE_TO;
  if (!host || !user || !pass || !to) return false;
  try {
    // Im Container zeigt /etc/hosts auf die interne Adresse; nodemailer selbst nutzt öffentliches DNS.
    const { address } = await lookup(host, { family: 4 });
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({ host: address, port, secure: port === 465, auth: { user, pass }, tls: { servername: host } });
    const rows: [string, string][] = [
      ["Stadt", labels.city],
      ["Tour als Grundlage", labels.tour ?? "Guide stellt zusammen"],
      ["Datum", r.date ? new Date(`${r.date}T12:00:00`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "offen"],
      ["Tageszeit", r.time],
      ["Personen", String(r.groupSize)],
      ["Sprache", r.language],
      ["Interessen", r.interests.join(", ") || "–"],
      ["Anlass", r.occasion || "–"],
      ["Name", r.name],
      ["E-Mail", r.email],
      ["Telefon", r.phone || "–"],
    ];
    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${r.message}\n\nAnfrage ${r.id}`;
    const html =
      `<table cellpadding="4" style="font-family:sans-serif;font-size:14px">${rows.map(([k, v]) => `<tr><td style="color:#666">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`).join("")}</table>` +
      (r.message ? `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(r.message)}</p>` : "") +
      `<p style="font-family:sans-serif;font-size:12px;color:#888">Anfrage ${r.id} über urban-trails.ch</p>`;
    await transport.sendMail({
      from: process.env.SMTP_FROM || user,
      to,
      replyTo: { name: r.name, address: r.email },
      subject: `Führungsanfrage ${labels.city}: ${r.groupSize} Pers., ${r.date || "Datum offen"} (${r.id})`,
      text,
      html,
    });
    return true;
  } catch (e) {
    console.error("[fuehrung] Mailversand fehlgeschlagen:", (e as Error).message);
    return false;
  }
}

// ── Schutz vor Massenversand ────────────────────────────────
const hits = new Map<string, number[]>();
export function tooMany(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}
