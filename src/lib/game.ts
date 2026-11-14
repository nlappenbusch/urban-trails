/**
 * Spiel-Logik (Punkte, Level, Abzeichen) – rein rechnerisch, läuft identisch
 * im Browser und auf dem Server. Der Server rechnet Punkte immer selbst nach.
 */

export interface RiddleResult {
  /** richtig gelöst? */
  ok: boolean;
  /** Anzahl Versuche bis zum Ende (1 = auf Anhieb) */
  tries: number;
  hint: boolean;
  at: number;
}

export interface GameState {
  v: 1;
  /** "city/tour" → besuchte Stop-IDs */
  stops: Record<string, string[]>;
  /** "city/tour/stop" → Rätsel-Ergebnis (erstes Ergebnis zählt) */
  riddles: Record<string, RiddleResult>;
}

export interface CatalogTour {
  key: string;
  city: string;
  cityName: string;
  name: string;
  stops: { id: string; gem: boolean; pts: number }[];
}
export type Catalog = CatalogTour[];

export const POINTS = { stop: 5, tour: 50, perfect: 25 } as const;

export const LEVELS = [
  { min: 0, name: "Spaziergänger" },
  { min: 100, name: "Entdecker" },
  { min: 300, name: "Stadtfuchs" },
  { min: 700, name: "Pfadfinder" },
  { min: 1500, name: "Trail-Legende" },
] as const;

export function emptyState(): GameState {
  return { v: 1, stops: {}, riddles: {} };
}

/** Punkte für ein einzelnes Rätsel: Hinweis und zweiter Versuch halbieren. */
export function riddlePoints(base: number, r: RiddleResult | undefined): number {
  if (!r || !r.ok) return 0;
  let p = base;
  if (r.hint) p /= 2;
  if (r.tries > 1) p /= 2;
  return Math.max(1, Math.round(p));
}

export interface Badge {
  id: string;
  name: string;
  text: string;
  earned: boolean;
}

export interface Score {
  points: number;
  level: number;
  levelName: string;
  nextLevelAt: number | null;
  stopsVisited: number;
  riddlesSolved: number;
  toursDone: number;
  cities: number;
  tours: { key: string; name: string; cityName: string; visited: number; total: number; solved: number; points: number; done: boolean; perfect: boolean }[];
  badges: Badge[];
}

export function score(state: GameState, catalog: Catalog): Score {
  let points = 0, stopsVisited = 0, riddlesSolved = 0, toursDone = 0, gems = 0, firstTry = 0, perfectTours = 0;
  const cities = new Set<string>();
  const tours: Score["tours"] = [];
  for (const t of catalog) {
    const visitedIds = new Set((state.stops[t.key] ?? []).filter((id) => t.stops.some((s) => s.id === id)));
    let tp = 0, solved = 0;
    for (const s of t.stops) {
      if (visitedIds.has(s.id)) {
        tp += POINTS.stop;
        if (s.gem) gems++;
      }
      const r = state.riddles[`${t.key}/${s.id}`];
      const rp = riddlePoints(s.pts, r);
      if (rp > 0) {
        tp += rp;
        solved++;
        if (r!.tries === 1 && !r!.hint) firstTry++;
      }
    }
    const done = t.stops.length > 0 && visitedIds.size === t.stops.length;
    const withRiddles = t.stops.filter((s) => s.pts > 0).length;
    const perfect = done && withRiddles > 0 && solved === withRiddles;
    if (done) {
      tp += POINTS.tour;
      toursDone++;
      cities.add(t.city);
    }
    if (perfect) {
      tp += POINTS.perfect;
      perfectTours++;
    }
    points += tp;
    stopsVisited += visitedIds.size;
    riddlesSolved += solved;
    if (visitedIds.size || solved) tours.push({ key: t.key, name: t.name, cityName: t.cityName, visited: visitedIds.size, total: t.stops.length, solved, points: tp, done, perfect });
  }
  let level = 0;
  LEVELS.forEach((l, i) => {
    if (points >= l.min) level = i;
  });
  const badges: Badge[] = [
    { id: "start", name: "Losgelaufen", text: "Ersten Stopp besucht", earned: stopsVisited >= 1 },
    { id: "riddle1", name: "Köpfchen", text: "Erstes Rätsel gelöst", earned: riddlesSolved >= 1 },
    { id: "tour1", name: "Durchgezogen", text: "Erste Tour komplett", earned: toursDone >= 1 },
    { id: "perfect", name: "Makellos", text: "Tour komplett und alle Rätsel richtig", earned: perfectTours >= 1 },
    { id: "sharp", name: "Auf Anhieb", text: "10 Rätsel ohne Hinweis im ersten Versuch", earned: firstTry >= 10 },
    { id: "gems", name: "Geheimtipp-Jäger", text: "5 Geheimtipp-Stopps besucht", earned: gems >= 5 },
    { id: "cities3", name: "Städtesammler", text: "Touren in 3 Städten abgeschlossen", earned: cities.size >= 3 },
    { id: "stops50", name: "Dauerläufer", text: "50 Stopps besucht", earned: stopsVisited >= 50 },
    { id: "tours5", name: "Trail-Profi", text: "5 Touren komplett", earned: toursDone >= 5 },
  ];
  return {
    points,
    level,
    levelName: LEVELS[level].name,
    nextLevelAt: LEVELS[level + 1]?.min ?? null,
    stopsVisited,
    riddlesSolved,
    toursDone,
    cities: cities.size,
    tours,
    badges,
  };
}

/** Zwei Stände zusammenführen (Gerät + Konto): Stopps vereinen, erstes Rätsel-Ergebnis bleibt. */
export function merge(a: GameState, b: GameState): GameState {
  const out = emptyState();
  for (const src of [a, b]) {
    for (const [k, ids] of Object.entries(src.stops ?? {})) out.stops[k] = [...new Set([...(out.stops[k] ?? []), ...ids])];
    for (const [k, r] of Object.entries(src.riddles ?? {})) {
      const cur = out.riddles[k];
      if (!cur || r.at < cur.at) out.riddles[k] = r;
    }
  }
  return out;
}

/** Fremde Eingaben auf gültige, bekannte Einträge reduzieren. */
export function sanitize(input: unknown, catalog: Catalog): GameState {
  const out = emptyState();
  if (!input || typeof input !== "object") return out;
  const raw = input as Partial<GameState>;
  for (const t of catalog) {
    const ids = raw.stops?.[t.key];
    if (Array.isArray(ids)) {
      const valid = t.stops.map((s) => s.id).filter((id) => ids.includes(id));
      if (valid.length) out.stops[t.key] = valid;
    }
    for (const s of t.stops) {
      const r = raw.riddles?.[`${t.key}/${s.id}`];
      if (r && typeof r === "object" && typeof r.ok === "boolean")
        out.riddles[`${t.key}/${s.id}`] = {
          ok: r.ok,
          tries: Math.max(1, Math.min(9, Math.round(Number(r.tries) || 1))),
          hint: Boolean(r.hint),
          at: Number.isFinite(Number(r.at)) ? Number(r.at) : 0,
        };
    }
  }
  return out;
}
