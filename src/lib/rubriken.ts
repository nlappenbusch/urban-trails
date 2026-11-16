import { KANTONE, RUBRIKEN, type RubrikItem } from "@/lib/rubriken-core";
import { cached, readBestand } from "@/lib/db";
import { getPlace } from "@/lib/ausfluege";

export * from "@/lib/rubriken-core";

// Forschungs- und Radioteleskope sind keine Ausflugsziele
const NOT_PUBLIC = /radio|zimmerwald|bleien|universit|meteo|sphinx|isdc|forschung|research|eth\b|epfl|cern/i;

/** Alle aktiven Verzeichnis-Einträge aus der Datenbank (mit Korrekturen, Dubletten → Link zum geprüften Ort). */
export function rubrikItems(): RubrikItem[] {
  return cached("rubriken:items", () =>
    readBestand<RubrikItem>("verzeichnis")
      .filter((i) => !(i.r === "sternwarten" && NOT_PUBLIC.test(i.name)))
      .map(({ _gleich, _top, ...i }) => {
        const p = _gleich ? getPlace(_gleich.replace(/^k:/, "")) : undefined;
        return { ...i, ...(p ? { ours: `/ausflugsziele/${p.region}#${p.id}` } : {}), ...(_top ? { top: true, q: i.q + 20 } : {}) };
      }),
  );
}

function byRubrik() {
  return cached("rubriken:by", () => {
    const m = new Map<string, RubrikItem[]>();
    for (const i of rubrikItems()) {
      if (!m.has(i.r)) m.set(i.r, []);
      m.get(i.r)!.push(i);
    }
    return m;
  });
}
export const itemsOf = (r: string) => byRubrik().get(r) ?? [];
export const itemsIn = (r: string, ak: string) => itemsOf(r).filter((i) => i.kt === ak);

/** Kantonsseiten nur, wo genug drin ist (sonst dünne Seiten). */
export const MIN_KANTON = 3;
export function rubrikKantonPages() {
  return RUBRIKEN.flatMap((r) => KANTONE.filter((k) => itemsIn(r.slug, k.ak).length >= MIN_KANTON).map((k) => ({ slug: r.slug, kanton: k.slug })));
}

/** Für Listen-JSON-LD und FAQ: die bekanntesten Einträge. */
export const top = (list: RubrikItem[], n: number) => [...list].sort((a, b) => b.q - a.q).slice(0, n);
