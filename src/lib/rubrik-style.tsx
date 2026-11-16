import {
  Bike, CableCar, Castle, Droplets, FerrisWheel, Flag, Flashlight, Footprints, Landmark, Mountain, MountainSnow,
  PawPrint, PlaneTakeoff, Route, Ship, Snowflake, Telescope, Tent, TowerControl, TrainTrack, Trees, UtensilsCrossed,
  Waves, Dog, Bath, Gauge, MapPin, type LucideIcon,
} from "lucide-react";

/** Farbe und Icon je Rubrik – die «Linien-Plakette» an jedem Eintrag. */
export const RUBRIK_COLORS: Record<string, string> = {
  tierparks: "#15803d", museen: "#7c3aed", "burgen-schloesser": "#a16207", hoehlen: "#475569", wasserfaelle: "#0369a1",
  aussichtstuerme: "#c2410c", freizeitparks: "#be185d", erlebnisbaeder: "#0e7490", seilparks: "#4d7c0f", sternwarten: "#1e3a8a", minigolf: "#a16207",
  rodelbahnen: "#be123c", klettersteige: "#78350f", themenwege: "#166534", schifffahrten: "#1d4ed8", eisbahnen: "#0369a1", langlauf: "#075985",
  winterwandern: "#475569", bergbahnen: "#9a3412", kletterhallen: "#854d0e", thermen: "#0f766e",
  velorouten: "#4d7c0f", bikeparks: "#c2410c", iglu: "#0369a1", schlittenhunde: "#475569", helikopter: "#b91c1c", erlebnisgastro: "#9a3412",
};

const ICONS: Record<string, LucideIcon> = {
  tierparks: PawPrint, museen: Landmark, "burgen-schloesser": Castle, hoehlen: Flashlight, wasserfaelle: Droplets,
  aussichtstuerme: TowerControl, freizeitparks: FerrisWheel, erlebnisbaeder: Waves, seilparks: Trees, sternwarten: Telescope,
  minigolf: Flag, rodelbahnen: TrainTrack, klettersteige: Mountain, themenwege: Footprints, schifffahrten: Ship,
  eisbahnen: Snowflake, langlauf: Route, winterwandern: MountainSnow, bergbahnen: CableCar, kletterhallen: Gauge,
  thermen: Bath, velorouten: Bike, bikeparks: Bike, iglu: Tent, schlittenhunde: Dog, helikopter: PlaneTakeoff, erlebnisgastro: UtensilsCrossed,
};

export const rubrikColor = (slug: string) => RUBRIK_COLORS[slug] ?? "#73645a";

/** Farbige Kachel mit Rubrik-Icon. size = Kantenlänge in px. */
export function Plakette({ r, size = 48, className = "" }: { r: string; size?: number; className?: string }) {
  const Icon = ICONS[r] ?? MapPin;
  return (
    <span aria-hidden className={`plakette ${className}`} style={{ width: size, height: size, ["--rc" as string]: rubrikColor(r) }}>
      <Icon size={Math.round(size * 0.46)} strokeWidth={2} />
    </span>
  );
}
