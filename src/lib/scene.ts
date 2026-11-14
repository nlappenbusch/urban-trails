import type { Stop } from "./types";

/** Anteile der Klangschichten für die Kulisse eines Stopps (0–1). */
export interface AmbienceScene {
  city: number;
  water: number;
  bells: number;
  birds: number;
  cafe: number;
}

const WATER = /\b(see|seebad|seeufer|rhein\w*|aare\w*|limmat\w*|sihl|reuss|fluss|ufer|quai|hafen|br[üu]cke|lac|lago|l[ée]man|jet d|wasser|schiff\w*|insel|bad|b[äa]der\w*|brunnen|kanal|rhone|rh[ôo]ne|thermal\w*)\b/;
const BELLS = /(kirche|m[üu]nster|kathedrale|cath[ée]drale|kloster|stift|kapelle|chiesa|basilika|\bdom\b|abtei|glocke)/;
const BIRDS = /\b(park|garten|g[äa]rten|wald|h[üu]gel|lindenhof|platzspitz|arboretum|wiese|reb\w*|weinberg|natur|allee|promenade|friedhof|schlosshof|burg\w*|ruine|aussicht\w*)\b/;
const CAFE = /\b(caf[ée]|kaffee|bar|markt\w*|restaurant|beiz|essen|food|b[äa]ckerei|confiserie|bistro|grotto|halle|apéro|ap[ée]ro|street ?food|brauerei|kneipe)\b/;
const CITY = /\b(bahnhof|gasse|platz|strasse|quartier|tram|altstadt|zentrum|kreis|rathaus|piazza|place|rue|via)\b/;

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Leitet aus Name und Beschreibung ab, wie der Ort klingen soll. */
export function sceneFor(stop: Pick<Stop, "name" | "teaser"> & Partial<Pick<Stop, "why" | "imageHint" | "story">>): AmbienceScene {
  const head = `${stop.name} ${stop.teaser} ${stop.imageHint ?? ""}`.toLowerCase();
  const body = `${stop.why ?? ""} ${stop.story ?? ""}`.toLowerCase();
  const hit = (re: RegExp) => (re.test(head) ? 1 : re.test(body) ? 0.45 : 0);
  const water = hit(WATER), bells = hit(BELLS), birds = hit(BIRDS), cafe = hit(CAFE), city = hit(CITY);
  return {
    // Etwas Stadt ist fast immer da – ausser im Grünen oder direkt am Wasser.
    city: clamp(0.35 + city * 0.4 - birds * 0.25 - water * 0.15),
    water: clamp(water * 0.9),
    bells: clamp(bells),
    birds: clamp(birds * 0.85 + (water && !city ? 0.2 : 0)),
    cafe: clamp(cafe * 0.8),
  };
}
