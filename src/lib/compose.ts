import type { Place, TripDay, TripSlot } from "@/lib/ausfluege";

/** Eingaben des Planers. */
export interface PlanInput {
  region: string;
  days: number;
  audience: string;
  moods: string[];
  rain: boolean;
  budget: number; // 1–4, Obergrenze für Hotels und Gastro
}

export interface PlanTour {
  slug: string;
  name: string;
  citySlug: string;
  durationMinutes: number;
}

export interface Plan {
  days: TripDay[];
  hotel?: Place;
  notes: string[];
}

const MOOD_TAGS: Record<string, string[]> = {
  genuss: ["genuss"],
  kultur: ["kultur"],
  natur: ["see", "berg", "aussicht"],
  aktiv: ["aktiv", "berg"],
  erholung: ["wellness", "see"],
  romantik: ["romantisch", "aussicht"],
  familie: ["familie"],
};
const AUDIENCE_TAGS: Record<string, string[]> = {
  paar: ["romantisch"],
  freunde: ["freunde"],
  familie: ["familie"],
  allein: [],
};

const OUTDOOR: Place["kind"][] = ["aktivitaet", "aussicht", "bad", "sehenswuerdigkeit"];
const ACTIVITY: Place["kind"][] = ["aktivitaet", "sehenswuerdigkeit", "aussicht", "bad"];

/**
 * Stellt aus der Ortsdatenbank ein Programm zusammen – nur mit geprüften Orten,
 * nichts wird erfunden. Bewertung: passende Stimmung/Begleitung, Wetter, Budget.
 */
export function composePlan(input: PlanInput, all: Place[], tours: PlanTour[]): Plan {
  const pool = all.filter((p) => p.region === input.region);
  const wanted = new Set([...input.moods.flatMap((m) => MOOD_TAGS[m] ?? []), ...(AUDIENCE_TAGS[input.audience] ?? [])]);
  const used = new Set<string>();
  const notes: string[] = [];

  const score = (p: Place) => {
    let s = p.tags.filter((t) => wanted.has(t)).length * 3;
    if (input.rain) s += p.weatherProof ? 4 : OUTDOOR.includes(p.kind) ? -50 : 0;
    if (input.audience === "familie" && p.kind === "bar") s -= 50;
    if (p.price && p.price > input.budget) s -= 8;
    if (p.price && p.price === input.budget) s += 1;
    return s;
  };

  const pick = (kinds: Place["kind"][], extra?: (p: Place) => boolean) => {
    const best = pool
      .filter((p) => kinds.includes(p.kind) && !used.has(p.id) && (!extra || extra(p)))
      .map((p) => ({ p, s: score(p) }))
      .filter((x) => x.s > -40)
      .sort((a, b) => b.s - a.s)[0]?.p;
    if (best) used.add(best.id);
    return best;
  };

  const slot = (time: string, p: Place | undefined, title: string): TripSlot | null =>
    p ? { time, placeId: p.id, title: `${title}: ${p.name}`, text: p.tip ? `${p.text} ${p.tip}` : p.text } : null;

  const regionTours = tours.filter((t) => t.citySlug === input.region);
  const days: TripDay[] = [];

  for (let d = 0; d < input.days; d++) {
    const last = d === input.days - 1;
    const slots: (TripSlot | null)[] = [];
    const tour = regionTours[d];
    if (d === 0) {
      if (tour) slots.push({ time: "10:30", tourSlug: tour.slug, title: `Audio-Tour: ${tour.name}`, text: `Ankommen und die Stadt zu Fuss kennenlernen – rund ${Math.round(tour.durationMinutes / 30) / 2} Stunden mit Audio-Story an jedem Stopp.${input.rain ? " Bei Regen: Schirm mit, die meisten Stopps haben ein Dach in der Nähe." : ""}` });
      slots.push(slot("13:00", pick(["restaurant", "cafe"]), "Mittagessen"));
      slots.push(slot("14:30", pick(ACTIVITY), "Am Nachmittag"));
      slots.push(slot("16:30", pick(["cafe", "aussicht"]), "Pause"));
    } else {
      const big = pick(ACTIVITY, (p) => (p.durationMin ?? 0) >= 120) ?? pick(ACTIVITY);
      slots.push(slot("09:30", big, "Am Morgen"));
      slots.push(slot("12:30", pick(["restaurant", "cafe"]), "Mittagessen"));
      if (tour) slots.push({ time: "14:30", tourSlug: tour.slug, title: `Audio-Tour: ${tour.name}`, text: "Zweite Runde zu Fuss, diesmal mit anderem Blick auf die Gegend." });
      else slots.push(slot("14:30", pick(ACTIVITY), "Am Nachmittag"));
    }
    if (!last || input.days === 1) {
      if (input.days > 1 || d === 0) slots.push(slot(input.days === 1 ? "18:00" : "19:00", pick(["restaurant"]), input.days === 1 ? "Früher Znacht vor der Heimreise" : "Abendessen"));
      if (!last && input.audience !== "familie") slots.push(slot("21:30", pick(["bar"]), "Absacker"));
    } else {
      slots.push({ time: "17:00", title: "Heimreise", text: "Mit dem Zug zurück – die Anreisezeiten stehen oben." });
    }
    days.push({ title: input.days === 1 ? "Euer Tag" : `Tag ${d + 1}`, slots: slots.filter((s): s is TripSlot => Boolean(s)) });
  }

  let hotel: Place | undefined;
  if (input.days > 1) {
    hotel = pick(["hotel"], (p) => !p.price || p.price <= input.budget) ?? pick(["hotel"]);
    if (!hotel) notes.push("Für diese Region haben wir noch kein geprüftes Hotel.");
    else if (hotel.price && hotel.price > input.budget) notes.push("Kein Hotel in deinem Budget gefunden – das hier ist das günstigste, das wir kennen.");
  }
  if (input.rain) notes.push("Regenprogramm: Draussen-Erlebnisse sind durch Dach-Varianten ersetzt, soweit vorhanden.");
  return { days, hotel, notes };
}
