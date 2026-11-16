/** Detailseite pro Ziel: sprechende URL /ziel/<name>-<osm-id> bzw. /ziel/<recherche-id>. Client-tauglich. */

const OSM = /^[nwr]\d+$/;

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

export function zielSlug(i: { id: string; name: string }) {
  if (!OSM.test(i.id)) return i.id;
  const s = slugify(i.name);
  return s ? `${s}-${i.id}` : i.id;
}

export const zielHref = (i: { id: string; name: string }) => `/ziel/${zielSlug(i)}`;

/** Aus dem URL-Teil die ID holen. */
export function zielId(slug: string) {
  const m = slug.match(/(?:^|-)([nwr]\d+)$/);
  return m ? m[1] : slug;
}

/** «4,2 km» bzw. «37 km» */
export const kmText = (d: number) => (d < 10 ? d.toFixed(1).replace(".", ",") : String(Math.round(d)));
