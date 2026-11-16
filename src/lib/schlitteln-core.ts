/** Schlittelwege – Typen (client-tauglich). */
export interface SledEnd { lat: number; lng: number; ele: number; st?: string; d?: number }
export interface SledRun {
  id: string;
  name: string;
  kt: string;
  ort?: string;
  km: number;
  drop: number;
  top: SledEnd;
  bottom: SledEnd;
  via?: string;
  lit?: boolean;
  diff?: string;
  web?: string;
  ski?: string;
  night?: string;
  lines: [number, number][][];
}
export const DIFF: Record<string, string> = { novice: "sehr leicht", easy: "leicht", intermediate: "mittel", advanced: "schwer", expert: "sehr schwer", freeride: "sehr schwer" };
export const kmText = (n: number) => `${String(n).replace(".", ",")} km`;
/** grobe Fahrzeit: 15–25 km/h je nach Gefälle */
export const rideMin = (r: Pick<SledRun, "km" | "drop">) => Math.max(3, Math.round((r.km / (r.drop / (r.km * 1000) > 0.1 ? 25 : 15)) * 60));
