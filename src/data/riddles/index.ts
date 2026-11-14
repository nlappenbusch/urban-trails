import type { Riddle, TourRiddles } from "@/lib/riddle-types";
import { riddles as zuerichKlassiker } from "./zuerich-klassiker";
import { riddles as hiddenZuerich } from "./hidden-zuerich";
import { riddles as urbanSunsetWalk } from "./urban-sunset-walk";
import { riddles as chreisCheib } from "./chreis-cheib";
import { riddles as winterthur } from "./winterthur";
import { riddles as rapperswil } from "./rapperswil";
import { riddles as regensberg } from "./regensberg";
import { riddles as eglisau } from "./eglisau";
import { riddles as ichMussMalRaus } from "./ich-muss-mal-raus";
import { riddles as badenAltstadt } from "./baden-altstadt";
import { riddles as luzernKlassiker } from "./luzern-klassiker";
import { riddles as bernAltstadt } from "./bern-altstadt";
import { riddles as baselRhein } from "./basel-rhein";
import { riddles as stGallenStiftsbezirk } from "./st-gallen-stiftsbezirk";
import { riddles as thunSchlossAare } from "./thun-schloss-aare";
import { riddles as genfJetDeau } from "./genf-jet-deau";
import { riddles as lausanneHochTief } from "./lausanne-hoch-tief";
import { riddles as luganoDolceVita } from "./lugano-dolce-vita";
import { riddles as newPeopleRoute } from "./new-people-route";
import { riddles as zuerich60Minuten } from "./zuerich-60-minuten";
import { riddles as churAeltesteStadt } from "./chur-aelteste-stadt";
import { riddles as zuerichFoodies } from "./zuerich-foodies";
import { riddles as solothurnElf } from "./solothurn-elf";
import { riddles as solothurnVerenaschlucht } from "./solothurn-verenaschlucht";

/** Rätsel pro Tour – Schlüssel: `${citySlug}/${tourSlug}` */
export const riddlesByTour: Record<string, TourRiddles> = {
  "zuerich/zuerich-klassiker": zuerichKlassiker,
  "zuerich/hidden-zuerich": hiddenZuerich,
  "zuerich/urban-sunset-walk": urbanSunsetWalk,
  "zuerich/chreis-cheib": chreisCheib,
  "winterthur/winterthur": winterthur,
  "rapperswil/rapperswil": rapperswil,
  "regensberg/regensberg": regensberg,
  "eglisau/eglisau": eglisau,
  "zuerich/ich-muss-mal-raus": ichMussMalRaus,
  "baden/baden-altstadt": badenAltstadt,
  "luzern/luzern-klassiker": luzernKlassiker,
  "bern/bern-altstadt": bernAltstadt,
  "basel/basel-rhein": baselRhein,
  "st-gallen/st-gallen-stiftsbezirk": stGallenStiftsbezirk,
  "thun/thun-schloss-aare": thunSchlossAare,
  "genf/genf-jet-deau": genfJetDeau,
  "lausanne/lausanne-hoch-tief": lausanneHochTief,
  "lugano/lugano-dolce-vita": luganoDolceVita,
  "zuerich/new-people-route": newPeopleRoute,
  "zuerich/zuerich-60-minuten": zuerich60Minuten,
  "chur/chur-aelteste-stadt": churAeltesteStadt,
  "zuerich/zuerich-foodies": zuerichFoodies,
  "solothurn/solothurn-elf": solothurnElf,
  "solothurn/solothurn-verenaschlucht": solothurnVerenaschlucht,
};

/** Rätsel für einen Stopp – undefined, wenn (noch) keins existiert */
export function getRiddle(citySlug: string, tourSlug: string, stopId: string): Riddle | undefined {
  return riddlesByTour[`${citySlug}/${tourSlug}`]?.[stopId];
}
