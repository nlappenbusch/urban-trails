/** Ein Ziel in Listen (Startseite, Rubriken, Detailseite) – client-tauglich, ohne Datenbank. */
import { getRubrik, kantonByAk, subLabel, type RubrikItem } from "@/lib/rubriken-core";
import { zielHref } from "@/lib/ziel";

export interface Hit {
  id: string;
  r: string;
  rl: string;
  name: string;
  ort: string;
  kt: string;
  lat: number;
  lng: number;
  href: string;
  web?: string;
  d?: number;
  line?: string;
  img?: { src: string; w: number; h: number; by?: string; lic?: string; page: string };
  fee?: boolean;
  /** Link zum von uns geprüften Ort */
  ours?: string;
}


function kurz(s?: string, n = 130) {
  if (!s) return undefined;
  const t = s.replace(/\s+/g, " ").trim();
  // erster Satz, wenn er kurz genug ist (Punkt nach Zahl wie «18. Jh.» zählt nicht)
  const satz = t.match(/^.{30,}?[^\d\s.]{2}\.(?=\s+[A-ZÄÖÜ])/)?.[0];
  if (satz && satz.length <= n) return satz;
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 60))} …`;
}

export function toHit(i: RubrikItem, d?: number): Hit {
  const r = getRubrik(i.r);
  const line = i.desc ? i.desc.charAt(0).toUpperCase() + i.desc.slice(1) : kurz(i.text) ?? subLabel(i.sub);
  return {
    id: i.id,
    r: i.r,
    rl: r?.one ?? i.r,
    name: i.name,
    ort: i.ort ?? kantonByAk(i.kt)?.name ?? i.kt,
    kt: i.kt,
    lat: i.lat,
    lng: i.lng,
    href: zielHref(i),
    ...(i.web ? { web: i.web } : {}),
    ...(d !== undefined ? { d: Math.round(d * 10) / 10 } : {}),
    ...(line ? { line } : {}),
    ...(i.img ? { img: { src: i.img.src, w: i.img.w, h: i.img.h, by: i.img.by, lic: i.img.lic, page: i.img.page } } : {}),
    ...(i.fee === false ? { fee: false } : {}),
    ...(i.ours ? { ours: i.ours } : {}),
  };
}


/** Detailseiten mit Inhalt (Text, Website, Foto, Beschreibung) werden indexiert; nackte OSM-Punkte nicht. */
export const hatInhalt = (i: RubrikItem) => Boolean(i.text || i.web || i.img || i.desc);
