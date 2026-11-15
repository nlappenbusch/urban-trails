/** Skigebiete – Typen (auch im Browser nutzbar). */

export interface SkiArea {
  id: string;
  name: string;
  canton: string;
  region: string | null;
  coords: { lat: number; lng: number };
  station: string;
  access?: string;
  url?: string;
  altitude?: { base?: number; top?: number };
  /** offizielle Pisten-km je Farbe (blau/rot/schwarz) */
  pistes?: { blue?: number; red?: number; black?: number; total?: number; count?: number };
  lifts?: number;
  season?: string;
  ticket?: { from: number; to?: number; unit: string; note?: string };
  family?: boolean;
  snowpark?: boolean;
  nightSkiing?: boolean;
  text?: string;
}

export interface Count {
  open: number;
  total: number;
  openKm?: number | null;
  totalKm?: number | null;
}

export interface SkiLive {
  status: "open" | "closed" | "no_report";
  lifts?: Count;
  slopes?: Count;
  /** blau / rot / schwarz */
  byColor?: { blue?: Count; red?: Count; black?: Count };
  at?: string;
}

export interface SkiSnow {
  /** Schneehöhe cm an der SLF-Station */
  cm: number;
  fresh?: number;
  station: string;
  elevation: number;
  date: string;
}

export interface SkiRow extends SkiArea {
  live?: SkiLive;
  snow?: SkiSnow;
}

export const COLOR = {
  blue: { label: "blau", cls: "bg-sky-500" },
  red: { label: "rot", cls: "bg-red-500" },
  black: { label: "schwarz", cls: "bg-zinc-900" },
} as const;
