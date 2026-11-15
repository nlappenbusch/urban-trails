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
import { getPlaceImage } from "@/data/images";
import type { Place, Trip } from "@/lib/ausfluege-core";

export * from "@/lib/ausfluege-core";

interface Bundle {
  places: Place[];
  trips: Trip[];
}

const bundles = [soloRap, luzThun, lugBern, zhWinBaden, churUnterland, genfLausanne, baselStGallen] as unknown as Bundle[];

export const places: Place[] = bundles.flatMap((b) => b.places).map((p) => ({ ...p, img: getPlaceImage(p.id, p.image) }));
export const trips: Trip[] = bundles.flatMap((b) => b.trips);

const placeIndex = new Map(places.map((p) => [p.id, p]));
export const getPlace = (id?: string) => (id ? placeIndex.get(id) : undefined);
export const getTrip = (slug: string) => trips.find((t) => t.slug === slug);

export const regions = [...new Set(places.map((p) => p.region))];
