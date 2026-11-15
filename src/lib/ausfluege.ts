/**
 * Ausflüge: Ortsdatenbank (Hotels, Gastro, Aktivitäten) + fertig getaktete Programme.
 * Daten liegen als JSON in src/data/ausfluege/<regionen>.json – recherchiert und mit
 * Quelle + Prüfdatum versehen. Programme verweisen per placeId bzw. tourSlug darauf.
 * Nur serverseitig importieren; Client-Komponenten nehmen @/lib/ausfluege-core.
 */
import soloRap from "@/data/ausfluege/solothurn-rapperswil.json";
import luzThun from "@/data/ausfluege/luzern-thun.json";
import lugBern from "@/data/ausfluege/lugano-bern.json";
import zhWinBaden from "@/data/ausfluege/zuerich-winterthur-baden.json";
import churUnterland from "@/data/ausfluege/chur-eglisau-regensberg.json";
import genfLausanne from "@/data/ausfluege/genf-lausanne.json";
import baselStGallen from "@/data/ausfluege/basel-stgallen.json";
import locarnoBz from "@/data/ausfluege/locarno-bellinzona.json";
import { getPlaceImage } from "@/data/images";
import { getDestination } from "@/data/destinations";
import type { Place, Trip } from "@/lib/ausfluege-core";

export * from "@/lib/ausfluege-core";

export interface RegionInfo {
  slug: string;
  name: string;
  /** SBB-Haltestelle des Hauptorts (Ziel für Verbindungen) */
  station: string;
  center: { lat: number; lng: number };
}

interface Bundle {
  regions?: RegionInfo[];
  places: Place[];
  trips: Trip[];
}

const bundles = [soloRap, luzThun, lugBern, zhWinBaden, churUnterland, genfLausanne, baselStGallen, locarnoBz] as unknown as Bundle[];

export const places: Place[] = bundles.flatMap((b) => b.places).map((p) => ({ ...p, img: getPlaceImage(p.id, p.image) }));
export const trips: Trip[] = bundles.flatMap((b) => b.trips);

const placeIndex = new Map(places.map((p) => [p.id, p]));
export const getPlace = (id?: string) => (id ? placeIndex.get(id) : undefined);
export const getTrip = (slug: string) => trips.find((t) => t.slug === slug);

export const regions = [...new Set(places.map((p) => p.region))];

/** Bahnhöfe der Tour-Städte; neue Regionen bringen ihren Bahnhof im Daten-Bundle mit. */
const STATION: Record<string, string> = {
  solothurn: "Solothurn",
  rapperswil: "Rapperswil SG",
  luzern: "Luzern",
  thun: "Thun",
  lugano: "Lugano",
  bern: "Bern",
  zuerich: "Zürich HB",
  winterthur: "Winterthur",
  baden: "Baden",
  basel: "Basel SBB",
  "st-gallen": "St. Gallen",
  genf: "Genève",
  lausanne: "Lausanne",
  chur: "Chur",
  eglisau: "Eglisau",
  regensberg: "Regensberg, Dorf",
};

const extraRegions = new Map(bundles.flatMap((b) => b.regions ?? []).map((r) => [r.slug, r]));

export function regionInfo(slug: string): RegionInfo | undefined {
  const extra = extraRegions.get(slug);
  if (extra) return extra;
  const d = getDestination(slug);
  if (d && STATION[slug]) return { slug, name: d.name, station: STATION[slug], center: d.center };
  const ps = places.filter((p) => p.region === slug && p.coords);
  if (!ps.length) return undefined;
  const lat = ps.reduce((s, p) => s + p.coords!.lat, 0) / ps.length;
  const lng = ps.reduce((s, p) => s + p.coords!.lng, 0) / ps.length;
  return { slug, name: d?.name ?? slug, station: STATION[slug] ?? ps[0].town, center: { lat, lng } };
}

export const allRegions = () => regions.map(regionInfo).filter((r): r is RegionInfo => Boolean(r));
