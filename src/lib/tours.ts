import type { Mood, Tour } from "@/lib/types";
import { zuerichKlassiker } from "@/data/tours/zuerich-klassiker";
import { hiddenZuerich } from "@/data/tours/hidden-zuerich";
import { urbanSunsetWalk } from "@/data/tours/urban-sunset-walk";
import { chreisCheib } from "@/data/tours/chreis-cheib";
import { winterthur } from "@/data/tours/winterthur";
import { rapperswil } from "@/data/tours/rapperswil";
import { regensberg } from "@/data/tours/regensberg";
import { eglisau } from "@/data/tours/eglisau";
import { ichMussMalRaus } from "@/data/tours/ich-muss-mal-raus";
import { badenAltstadt } from "@/data/tours/baden-altstadt";
import { luzernKlassiker } from "@/data/tours/luzern-klassiker";
import { bernAltstadt } from "@/data/tours/bern-altstadt";
import { baselRhein } from "@/data/tours/basel-rhein";
import { stGallenStiftsbezirk } from "@/data/tours/st-gallen-stiftsbezirk";
import { thunSchlossAare } from "@/data/tours/thun-schloss-aare";
import { genfJetDeau } from "@/data/tours/genf-jet-deau";
import { lausanneHochTief } from "@/data/tours/lausanne-hoch-tief";
import { luganoDolceVita } from "@/data/tours/lugano-dolce-vita";
import { newPeopleRoute } from "@/data/tours/new-people-route";
import { zuerich60Minuten } from "@/data/tours/zuerich-60-minuten";
import { churAeltesteStadt } from "@/data/tours/chur-aelteste-stadt";
import { zuerichFoodies } from "@/data/tours/zuerich-foodies";

export const tours: Tour[] = [
  zuerichKlassiker,
  hiddenZuerich,
  urbanSunsetWalk,
  chreisCheib,
  winterthur,
  rapperswil,
  regensberg,
  eglisau,
  ichMussMalRaus,
  badenAltstadt,
  luzernKlassiker,
  bernAltstadt,
  baselRhein,
  stGallenStiftsbezirk,
  thunSchlossAare,
  genfJetDeau,
  lausanneHochTief,
  luganoDolceVita,
  newPeopleRoute,
  zuerich60Minuten,
  churAeltesteStadt,
  zuerichFoodies,
];

export function getTour(citySlug: string, tourSlug: string): Tour | undefined {
  return tours.find((t) => t.citySlug === citySlug && t.slug === tourSlug);
}

export function getToursByCity(citySlug: string): Tour[] {
  return tours.filter((t) => t.citySlug === citySlug);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} Min.`;
  if (m === 0) return `${h} Std.`;
  return `${h}h ${m}min`;
}

export function totalWalkMinutes(tour: Tour): number {
  return tour.stops.reduce((sum, s) => sum + s.walkMinutesFromPrevious, 0);
}

export const moodLabels: Record<Mood, string> = {
  menschen: "Menschen",
  ruhe: "Ruhe",
  aussicht: "Aussicht",
  essen: "Essen",
  kultur: "Kultur",
  fotografie: "Fotografie",
  natur: "Natur",
  ueberraschung: "Überraschung",
};

export function recommendTour(
  availableMinutes: number,
  moods: Mood[]
): { tour: Tour; note: string } {
  const scored = tours.map((tour) => {
    let score = 0;
    for (const m of moods) if (tour.moods.includes(m)) score += 2;
    if (tour.durationMinutes <= availableMinutes) score += 3;
    else if (tour.durationMinutes <= availableMinutes * 1.3) score += 1;
    return { tour, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].tour;
  const note =
    best.durationMinutes <= availableMinutes
      ? `Passt in dein Zeitfenster – inklusive Pausen.`
      : `Etwas länger als dein Zeitfenster: Lauf die ersten ${Math.max(
          4,
          Math.round((availableMinutes / best.durationMinutes) * best.stops.length)
        )} Stops – die Route ist überall ÖV-nah abbrechbar.`;
  return { tour: best, note };
}
