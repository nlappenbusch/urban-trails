/** Weihnachtsmärkte: Typen und Kalender-Logik (client-tauglich). */

export interface Markt {
  id: string;
  name: string;
  kind: "weihnachtsmarkt" | "adventsmarkt" | "lichter" | "schiff" | "krippe";
  place: string;
  canton: string;
  address?: string;
  coords: { lat: number; lng: number };
  oev?: string;
  from: string;
  to: string;
  days?: number[];
  dates?: string[];
  hours?: string;
  open?: { from: string; to: string };
  stands?: number;
  indoor?: boolean;
  free?: boolean;
  price?: string;
  size: "gross" | "mittel" | "klein";
  wow?: string;
  text: string;
  tip?: string;
  url?: string;
  source?: string;
  checked: string;
}

export const KIND_LABEL: Record<Markt["kind"], string> = {
  weihnachtsmarkt: "Weihnachtsmarkt",
  adventsmarkt: "Adventsmarkt",
  lichter: "Lichter-Event",
  schiff: "Weihnachtsschiff",
  krippe: "Krippe",
};

const dow = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();
export const addDay = (iso: string, n = 1) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** Hat der Markt an diesem Tag offen? */
export function openOn(m: Pick<Markt, "from" | "to" | "days" | "dates">, iso: string) {
  if (m.dates?.length) return m.dates.includes(iso);
  if (iso < m.from || iso > m.to) return false;
  return !m.days?.length || m.days.includes(dow(iso));
}

/** Alle offenen Tage (für Kalender und Event-Schema). */
export function openDays(m: Markt) {
  if (m.dates?.length) return [...m.dates].sort();
  const out: string[] = [];
  for (let d = m.from; d <= m.to && out.length < 80; d = addDay(d)) if (openOn(m, d)) out.push(d);
  return out;
}

export function nextOpen(m: Markt, iso: string) {
  return openDays(m).find((d) => d >= iso);
}

export const dateShort = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
export const dateLong = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** «26. Nov. – 23. Dez.» bzw. Einzeltage */
export function spanText(m: Markt) {
  const d = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", { day: "numeric", month: "short", timeZone: "UTC" });
  if (m.dates?.length && m.dates.length <= 4) return m.dates.map(d).join(", ");
  return m.from === m.to ? d(m.from) : `${d(m.from)} – ${d(m.to)}`;
}

const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
export function daysText(m: Markt) {
  if (m.dates?.length) return m.dates.length > 4 ? `an ${m.dates.length} Tagen` : "";
  if (!m.days?.length || m.days.length === 7) return m.from === m.to ? "" : "täglich";
  return [...m.days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7)).map((w) => WD[w]).join(", ");
}
