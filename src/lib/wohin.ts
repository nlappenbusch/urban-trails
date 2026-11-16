import { RUBRIKEN, inSaison, rubrikItems, type RubrikItem } from "@/lib/rubriken";
import { toHit, type Hit } from "@/lib/hit";

export type { Hit };
import { crowKm } from "@/lib/ski-core";

/** Rubriken, die eine Gruppe (Klasse, Verein, Firma) einen Tag lang tragen – wie die Schulreise-Seite. */
const GRUPPE = new Set(["hoehlen", "burgen-schloesser", "tierparks", "seilparks", "themenwege", "schifffahrten", "bergbahnen", "museen", "wasserfaelle", "freizeitparks", "rodelbahnen", "bikeparks", "aussichtstuerme", "kletterhallen"]);

export type Wetter = "egal" | "schoen" | "regen";
export type Mit = "kinder" | "hund" | "gruppe";

export const monatCH = (d = new Date()) => Number(new Intl.DateTimeFormat("en", { timeZone: "Europe/Zurich", month: "numeric" }).format(d));

/** Gewicht eines Eintrags: Bekanntheit plus etwas für Text, Website, Foto – nackte OSM-Punkte rutschen nach hinten. */
const gewicht = (i: RubrikItem) => i.q + (i.text ? 3 : 0) + (i.web ? 2 : 0) + (i.img ? 2 : 0);

/** Tageswechsel ohne Zufall: gleiche Reihenfolge den ganzen Tag, morgen eine andere. */
function tagesWert(id: string, tag: string) {
  let h = 2166136261;
  for (const c of id + tag) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

/**
 * «Wohin heute?»: Ziele, die zu Saison, Wetter und Begleitung passen.
 * Mit Startpunkt streng nach Entfernung (Bekanntheit nur bei Gleichstand), ohne nach Bekanntheit mit Tageswechsel.
 * Pro Rubrik höchstens drei unter den ersten Treffern, damit die Liste eine Auswahl ist und keine Minigolf-Wand.
 */
export function wohin({ lat, lng, wetter = "egal", mit = [], limit = 30, monat = monatCH() }: { lat?: number; lng?: number; wetter?: Wetter; mit?: Mit[]; limit?: number; monat?: number }) {
  const ok = new Set(
    RUBRIKEN.filter(
      (r) =>
        inSaison(r, monat) &&
        (wetter !== "regen" || r.regenfest) &&
        (wetter !== "schoen" || !r.regenfest || r.slug === "hoehlen") &&
        (!mit.includes("kinder") || r.familie) &&
        (!mit.includes("hund") || r.hund) &&
        (!mit.includes("gruppe") || GRUPPE.has(r.slug)),
    ).map((r) => r.slug),
  );
  const from = lat !== undefined && lng !== undefined ? { lat, lng } : undefined;
  const pool = rubrikItems().filter((i) => ok.has(i.r) && gewicht(i) > 0);
  const tag = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" }).format(new Date());
  const scored = pool
    .map((i) => {
      const d = from ? crowKm(from, i) : undefined;
      // ohne Startort: bekannte Ziele mit Foto zuerst, unter Gleichen täglich andere
      const score = d !== undefined ? d - gewicht(i) / 1000 : -(gewicht(i) + (i.img ? 4 : 0) + tagesWert(i.id, tag) * 6);
      return { i, d, score };
    })
    .filter((x) => x.d === undefined || x.d < 120)
    .sort((a, b) => a.score - b.score);

  const out: typeof scored = [];
  const rest: typeof scored = [];
  const n = new Map<string, number>();
  const cap = from ? 3 : 2;
  for (const x of scored) {
    if (out.length >= limit) break;
    const c = n.get(x.i.r) ?? 0;
    if (c < cap) {
      out.push(x);
      n.set(x.i.r, c + 1);
    } else if (rest.length < limit) rest.push(x);
  }
  if (out.length < limit) out.push(...rest.slice(0, limit - out.length));
  out.sort((a, b) => a.score - b.score);
  return { total: pool.length, rubriken: ok.size, hits: out.map((x) => toHit(x.i, x.d)) };
}
