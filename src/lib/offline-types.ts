import type { GeoPoint } from "./types";
export interface OfflinePack {
  id: string;
  revision: string;
  title: string;
  city: string;
  path: string;
  stops: { id: string; name: string; text: string; directions: string; coords: GeoPoint; audio: string }[];
}
