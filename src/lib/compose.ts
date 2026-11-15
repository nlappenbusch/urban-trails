import { addDays, openState, type Place, type TripDay, type TripSlot } from "@/lib/ausfluege-core";

/** Eingaben des Planers. */
export interface PlanInput {
  region: string;
  days: number;
  audience: string;
  moods: string[];
  rain: boolean;
  budget: number; // 1–4, Obergrenze für Hotels und Gastro
  /** Startdatum YYYY-MM-DD: dann nur Orte, die zur geplanten Zeit offen haben */
  date?: string;
  /** Regen nur an einzelnen Tagen (Index → Regen ja/nein), überschreibt `rain` */
  rainByDay?: boolean[];
  /** Orte, die nicht vorkommen sollen («schon dort gewesen», getauscht) */
  exclude?: string[];
  /** Orte, die bevorzugt eingeplant werden (Tausch-Wahl) */
  prefer?: string[];
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
  krass: ["besonders", "geheimtipp"],
  wandern: ["wandern"],
  schwimmen: ["baden"],
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
  const skip = new Set(input.exclude ?? []);
  const prefer = new Set(input.prefer ?? []);
  const pool = all.filter((p) => p.region === input.region && !skip.has(p.id));
  const wanted = new Set([...input.moods.flatMap((m) => MOOD_TAGS[m] ?? []), ...(AUDIENCE_TAGS[input.audience] ?? [])]);
  const used = new Set<string>();
  const notes: string[] = [];

  // Wird beim Tagesaufbau gesetzt: Datum, Uhrzeit und Wetter des Programmpunkts
  let at: { date?: string; time?: string; rain: boolean } = { rain: input.rain };
  const endOf = (time: string, p: Place) => {
    const [h, m] = time.split(":").map(Number);
    const e = Math.min(h * 60 + m + Math.min(p.durationMin ?? 90, 180), 23 * 60 + 59);
    return `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
  };

  const score = (p: Place) => {
    let s = p.tags.filter((t) => wanted.has(t)).length * 3 + (prefer.has(p.id) ? 100 : 0);
    // Krasse Orte und Geheimtipps sollen auch ohne Wunsch öfter vorkommen – das unterscheidet uns vom Prospekt
    if (p.tags.includes("besonders") || p.tags.includes("geheimtipp")) s += wanted.has("besonders") ? 3 : 2;
    if (at.rain) s += p.weatherProof ? 4 : OUTDOOR.includes(p.kind) ? -50 : 0;
    if (input.audience === "familie" && p.kind === "bar") s -= 50;
    if (p.price && p.price > input.budget) s -= 8;
    if (p.price && p.price === input.budget) s += 1;
    if (at.date && p.kind !== "hotel") {
      const st = openState(p, at.date, at.time, at.time ? endOf(at.time, p) : undefined);
      if (st === "zu") s -= 300;
      else if (st === "offen") s += 1;
    }
    return s;
  };

  const pick = (kinds: Place["kind"][], extra?: (p: Place) => boolean) => {
    const best = pool
      .filter((p) => kinds.includes(p.kind) && !used.has(p.id) && (!extra || extra(p)) && !(at.rain && OUTDOOR.includes(p.kind) && !p.weatherProof))
      .map((p) => ({ p, s: score(p) }))
      .filter((x) => x.s > -40)
      .sort((a, b) => b.s - a.s)[0]?.p;
    if (best) used.add(best.id);
    return best;
  };
  /** pick zu einer bestimmten Uhrzeit (prüft Öffnungszeiten, wenn ein Datum gesetzt ist) */
  const pickAt = (time: string, kinds: Place["kind"][], extra?: (p: Place) => boolean) => {
    at = { ...at, time };
    return pick(kinds, extra);
  };

  const slot = (time: string, p: Place | undefined, title: string): TripSlot | null =>
    p ? { time, placeId: p.id, title: `${title}: ${p.name}`, text: p.tip ? `${p.text} ${p.tip}` : p.text } : null;

  const regionTours = tours.filter((t) => t.citySlug === input.region);
  const days: TripDay[] = [];

  for (let d = 0; d < input.days; d++) {
    const last = d === input.days - 1;
    const slots: (TripSlot | null)[] = [];
    const tour = regionTours[d];
    const rainToday = input.rainByDay?.[d] ?? input.rain;
    at = { date: input.date ? addDays(input.date, d) : undefined, rain: rainToday };
    if (d === 0) {
      if (tour) {
        // Bis zum Mittag bleibt Zeit für rund zweieinhalb Stunden; den Rest gibt's später – der Fortschritt bleibt gespeichert
        const long = tour.durationMinutes > 150;
        slots.push({
          time: "10:30",
          tourSlug: tour.slug,
          durationMin: Math.min(tour.durationMinutes, 150),
          title: `Audio-Tour: ${tour.name}${long ? " (erster Teil)" : ""}`,
          text: long
            ? `Ankommen und die Stadt zu Fuss kennenlernen. Die ganze Tour dauert rund ${Math.round(tour.durationMinutes / 30) / 2} Stunden – bis zum Mittag schaffst du gut die Hälfte, den Rest später oder beim nächsten Mal. Dein Fortschritt bleibt auf dem Handy gespeichert.${rainToday ? " Bei Regen: Schirm mit, die meisten Stopps haben ein Dach in der Nähe." : ""}`
            : `Ankommen und die Stadt zu Fuss kennenlernen – rund ${Math.round(tour.durationMinutes / 30) / 2} Stunden mit Audio-Story an jedem Stopp.${rainToday ? " Bei Regen: Schirm mit, die meisten Stopps haben ein Dach in der Nähe." : ""}`,
        });
      }
      else slots.push(slot("10:30", pickAt("10:30", ACTIVITY), "Zum Ankommen"));
      slots.push(slot("13:00", pickAt("13:00", ["restaurant", "cafe"]), "Mittagessen"));
      slots.push(slot("14:30", pickAt("14:30", ACTIVITY), "Am Nachmittag"));
      slots.push(slot("16:30", pickAt("16:30", ["cafe", "aussicht"]), "Pause"));
    } else {
      const big = pickAt("09:30", ACTIVITY, (p) => (p.durationMin ?? 0) >= 120) ?? pickAt("09:30", ACTIVITY);
      slots.push(slot("09:30", big, "Am Morgen"));
      slots.push(slot("12:30", pickAt("12:30", ["restaurant", "cafe"]), "Mittagessen"));
      if (tour) slots.push({ time: "14:30", tourSlug: tour.slug, title: `Audio-Tour: ${tour.name}`, text: "Zweite Runde zu Fuss, diesmal mit anderem Blick auf die Gegend." });
      else slots.push(slot("14:30", pickAt("14:30", ACTIVITY), "Am Nachmittag"));
    }
    if (!last || input.days === 1) {
      const dinner = input.days === 1 ? "18:00" : "19:00";
      if (input.days > 1 || d === 0) slots.push(slot(dinner, pickAt(dinner, ["restaurant"]), input.days === 1 ? "Früher Znacht vor der Heimreise" : "Abendessen"));
      if (!last && input.audience !== "familie") slots.push(slot("21:30", pickAt("21:30", ["bar"]), "Absacker"));
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
