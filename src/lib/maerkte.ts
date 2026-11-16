import type { Markt } from "@/lib/maerkte-core";
import { crowKm } from "@/lib/ski-core";
import { readBestand } from "@/lib/db";

export * from "@/lib/maerkte-core";

/** Alle aktiven Märkte aus der Datenbank (mit Korrekturen). */
export const markets = (): Markt[] => readBestand<Markt>("maerkte");
export const getMarkt = (id: string) => markets().find((m) => m.id === id);
export const nearMarkets = (m: Markt, n = 4) =>
  markets().filter((x) => x.id !== m.id).map((x) => ({ x, d: crowKm(m.coords, x.coords) })).sort((a, b) => a.d - b.d).slice(0, n);

/** Heute in Zürich als ISO-Datum */
export const todayZurich = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
