/**
 * KI-Planer: Wunsch in eigenen Worten → Programm nur aus geprüften Orten.
 * Schritt 1 versteht den Wunsch (Region, Datum, Begleitung, Budget …),
 * Schritt 2 stellt aus den Orten der Region einen Ablauf zusammen.
 * Alles, was die KI liefert, wird geprüft: unbekannte Orte fliegen raus, geschlossene auch;
 * reicht es nicht, baut der normale Planer das Programm.
 */
import { geminiJson } from "@/lib/gemini";
import { addDays, allRegions, getPlace, openState, places, regionInfo, specialLabel, tripBudget, type Place, type RegionInfo, type TripDay, type TripSlot } from "@/lib/ausfluege";
import { composePlan } from "@/lib/compose";
import { planTours, timelineData } from "@/lib/ausfluege-view";
import { forecast } from "@/lib/wetter";
import { rainyDay, type DayWeatherLite } from "@/lib/wetter-core";
import { zurichNow, km } from "@/lib/finder";
import { skiAreas } from "@/lib/ski";

export interface KiInput {
  /** bisherige Wünsche, ältester zuerst (Nachbesserungen hängen hinten an) */
  messages: string[];
  start?: { name: string; lat?: number; lng?: number };
}

export interface KiIntent {
  region: string;
  regionWhy: string;
  date: string;
  days: number;
  audience: "paar" | "freunde" | "familie" | "allein";
  adults: number;
  kids: number[];
  moods: string[];
  budget: number;
  maxPerPerson?: number;
  wishes: string;
  avoid: string;
}

export interface KiResult {
  intent: KiIntent;
  summary: string[];
  region: RegionInfo;
  intro: string;
  tips: string[];
  days: TripDay[];
  hotel?: Place;
  places: Record<string, Place>;
  tours: ReturnType<typeof timelineData>["tours"];
  weather: (DayWeatherLite | null)[];
  budget: ReturnType<typeof tripBudget>;
  fallback: boolean;
  model: string;
}

const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MOOD_KEYS = ["genuss", "kultur", "natur", "aktiv", "erholung", "romantik", "krass", "wandern", "schwimmen", "familie"];
const hhmm = (t: unknown) => (typeof t === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(t) ? t : undefined);
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

function regionCatalog(start?: KiInput["start"]) {
  return allRegions()
    .map((r) => {
      const ps = places.filter((p) => p.region === r.slug && p.kind !== "hotel");
      if (ps.length < 4) return null;
      const top = ps.filter((p) => specialLabel(p)).slice(0, 4).concat(ps.filter((p) => !specialLabel(p)).slice(0, 3)).map((p) => p.name);
      const travel = start?.lat && start.lng ? Math.round((15 + km({ lat: start.lat, lng: start.lng }, r.center) * 0.9) / 5) * 5 : undefined;
      const ski = skiAreas.filter((s) => s.region === r.slug).map((s) => s.name);
      const hotels = places.some((p) => p.region === r.slug && p.kind === "hotel");
      return `${r.slug}: ${r.name}${travel ? ` (ca. ${travel} Min. ÖV ab Start)` : ""}${hotels ? "" : " [keine Hotels → nur Tagesausflug]"} – z. B. ${top.join(", ")}${ski.length ? ` · Skigebiete: ${ski.join(", ")}` : ""}`;
    })
    .filter(Boolean)
    .join("\n");
}

/** Schritt 1: Wunsch verstehen */
async function understand(input: KiInput) {
  const now = zurichNow();
  const today = new Date(`${now.date}T12:00:00Z`);
  const prompt = `Du bist der Ausflugsplaner von urban-trails.ch (Schweiz, Anreise mit ÖV).
Heute ist ${WD[today.getUTCDay()]} ${now.date}, ${now.time} Uhr. Startbahnhof: ${input.start?.name ?? "unbekannt (dann Zürich HB annehmen)"}.

Wünsche der Person (spätere Nachrichten ändern frühere):
${input.messages.map((m, i) => `${i + 1}. «${m}»`).join("\n")}

Regionen, die wir kennen (NUR diese Slugs sind erlaubt):
${regionCatalog(input.start)}

Antworte als JSON:
{
 "region": "<slug>",                     // genannte Region, sonst die am besten passende; Anreise > 2 h nur bei Wochenende/ausdrücklichem Wunsch
 "regionWhy": "1 kurzer Satz, warum diese Region (Du-Form)",
 "date": "YYYY-MM-DD",                   // «Samstag» = nächster Samstag; ohne Angabe: nächster Samstag
 "days": 1,                              // 1–3
 "audience": "paar|freunde|familie|allein",
 "adults": 2, "kids": [8, 11],           // Alter der Kinder, [] wenn keine
 "moods": [],                            // aus: ${MOOD_KEYS.join(", ")}
 "budget": 2,                            // 1 günstig – 4 Luxus (Essen/Hotel)
 "maxPerPerson": 150,                    // CHF pro Person ohne Bahn, nur wenn genannt, sonst null
 "wishes": "Stichworte, was unbedingt rein soll",
 "avoid": "Stichworte, was NICHT vorkommen soll (z. B. Museen, lange Wanderungen)"
}`;
  const { data, model } = await geminiJson<Partial<KiIntent>>(prompt, { temperature: 0.2 });
  const r = allRegions().find((x) => x.slug === data.region) ?? allRegions().find((x) => x.slug === "zuerich")!;
  const hotels = places.some((p) => p.region === r.slug && p.kind === "hotel");
  const date = /^\d{4}-\d{2}-\d{2}$/.test(data.date ?? "") && data.date! >= now.date ? data.date! : addDays(now.date, ((6 - today.getUTCDay() + 7) % 7) || 7);
  const intent: KiIntent = {
    region: r.slug,
    regionWhy: String(data.regionWhy ?? "").slice(0, 200),
    date,
    days: hotels ? Math.min(3, Math.max(1, Math.round(Number(data.days) || 1))) : 1,
    audience: (["paar", "freunde", "familie", "allein"] as const).find((a) => a === data.audience) ?? "paar",
    adults: Math.min(12, Math.max(1, Math.round(Number(data.adults) || 2))),
    kids: Array.isArray(data.kids) ? data.kids.map(Number).filter((k) => k >= 0 && k < 18).slice(0, 8) : [],
    moods: Array.isArray(data.moods) ? data.moods.filter((m) => MOOD_KEYS.includes(m)) : [],
    budget: Math.min(4, Math.max(1, Math.round(Number(data.budget) || 2))),
    maxPerPerson: Number(data.maxPerPerson) > 0 ? Math.round(Number(data.maxPerPerson)) : undefined,
    wishes: String(data.wishes ?? "").slice(0, 300),
    avoid: String(data.avoid ?? "").slice(0, 300),
  };
  return { intent, region: r, model };
}

function placeLine(p: Place, dates: string[]) {
  const closed = dates.map((d, i) => (openState(p, d) === "zu" ? `Tag ${i + 1} zu` : "")).filter(Boolean);
  const price = p.priceInfo ? (p.priceInfo.from === 0 ? "gratis" : `CHF ${p.priceInfo.from}${p.priceInfo.to ? `–${p.priceInfo.to}` : ""} ${p.priceInfo.unit}`) : p.price ? "$".repeat(p.price) : "";
  return [
    p.id,
    p.kind,
    p.name,
    p.town,
    p.tags.join("/"),
    p.weatherProof ? "mit Dach" : "draussen",
    p.durationMin ? `${p.durationMin} Min.` : "",
    price,
    p.hours ?? "",
    closed.join(", "),
    p.wow ?? "",
    p.text.slice(0, 140),
  ].filter(Boolean).join(" | ");
}

interface Draft {
  intro?: string;
  tips?: string[];
  hotelId?: string;
  days?: { title?: string; slots?: { time?: string; placeId?: string; tourSlug?: string; title?: string; text?: string; durationMin?: number }[] }[];
}

/** Schritt 2: Programm zusammenstellen */
async function compose(intent: KiIntent, region: RegionInfo, input: KiInput, weather: (DayWeatherLite | null)[]) {
  const dates = Array.from({ length: intent.days }, (_, i) => addDays(intent.date, i));
  const pool = places.filter((p) => p.region === intent.region && (intent.days > 1 || p.kind !== "hotel"));
  const tours = planTours().filter((t) => t.citySlug === intent.region);
  const wx = weather.map((w, i) => (w ? `Tag ${i + 1} (${dates[i]}): ${w.tmin}–${w.tmax} °C, Regen ${w.rainProb} %${rainyDay(w) ? " → REGENTAG, nur Orte mit Dach draussen vermeiden" : ""}${w.sunset ? `, Sonnenuntergang ${w.sunset}` : ""}` : `Tag ${i + 1} (${dates[i]}): noch keine Vorhersage`)).join("\n");
  const prompt = `Stelle ein Ausflugsprogramm in ${region.name} zusammen. Ankunft am Bahnhof ${region.station} ab ca. 09:30.
Person: ${intent.adults} Erwachsene${intent.kids.length ? `, Kinder (${intent.kids.join(", ")} Jahre)` : ""}; Begleitung ${intent.audience}; Stimmung ${intent.moods.join(", ") || "offen"}; Budget-Stufe ${intent.budget}/4${intent.maxPerPerson ? `; höchstens CHF ${intent.maxPerPerson} pro Person ohne Bahn` : ""}.
Unbedingt: ${intent.wishes || "–"}. Vermeiden: ${intent.avoid || "–"}.
Originalwünsche: ${input.messages.map((m) => `«${m}»`).join(" / ")}
Wetter:
${wx}

Erlaubte Orte (id | Art | Name | Ort | Tags | Dach | Dauer | Preis | Zeiten | geschlossen | Besonderheit | Beschreibung):
${pool.map((p) => placeLine(p, dates)).join("\n")}
${tours.length ? `\nAudio-Touren (tourSlug | Name | Dauer): \n${tours.map((t) => `${t.slug} | ${t.name} | ${t.durationMinutes} Min.`).join("\n")}` : ""}

Regeln:
- NUR ids aus der Liste (exakt kopieren), jeden Ort höchstens einmal, keine Orte, die an dem Tag zu sind.
- Pro Tag 4–6 Punkte inkl. Mittagessen (restaurant/cafe ca. 12:00–13:30); bei mehreren Tagen Abendessen und am letzten Tag Heimreise ab ca. 17:00 ohne placeId.
- Realistische Zeiten (HH:MM), Wege und Dauer einrechnen; Kinder: kürzere Blöcke, Pausen.
- Mindestens ein Ort mit «besonders»/«geheimtipp», wenn er passt.
- ${intent.days > 1 ? "hotelId: ein Hotel aus der Liste passend zum Budget." : "kein Hotel."}
- title: kurz (z. B. «Hölloch-Führung»). text: 1–2 Sätze in Du-Form, konkret, WARUM es für genau diese Leute passt (Bezug auf Wünsche, Kinderalter, Wetter). Kein Werbesprech, keine erfundenen Fakten.
- intro: 2 Sätze, worauf sich die Leute freuen können. tips: 2–4 kurze praktische Tipps (Reservation, Halbtax, Kleidung).

JSON:
{"intro":"…","tips":["…"],"hotelId":null,"days":[{"title":"Samstag, 21.11.","slots":[{"time":"10:00","placeId":"…","title":"…","text":"…","durationMin":90}]}]}`;
  return geminiJson<Draft>(prompt, { temperature: 0.7, timeoutMs: 60_000 });
}

/** Alles prüfen, was die KI geliefert hat. */
function validate(d: Draft, intent: KiIntent): { days: TripDay[]; hotel?: Place; ok: boolean } {
  const dates = Array.from({ length: intent.days }, (_, i) => addDays(intent.date, i));
  const tourSlugs = new Set(planTours().filter((t) => t.citySlug === intent.region).map((t) => t.slug));
  const used = new Set<string>();
  const days: TripDay[] = [];
  for (let i = 0; i < intent.days; i++) {
    const raw = d.days?.[i]?.slots ?? [];
    const slots: TripSlot[] = [];
    let last = 0;
    for (const s of raw) {
      const time = hhmm(s.time);
      if (!time || toMin(time) < last || toMin(time) < 6 * 60) continue;
      const p = s.placeId ? getPlace(s.placeId) : undefined;
      if (s.placeId && (!p || p.region !== intent.region || used.has(p.id) || p.kind === "hotel")) continue;
      if (p && openState(p, dates[i], time) === "zu") continue;
      if (s.tourSlug && !tourSlugs.has(s.tourSlug)) continue;
      if (!p && !s.tourSlug && !/heim|rück|zug/i.test(s.title ?? "")) continue;
      if (p) used.add(p.id);
      last = toMin(time);
      slots.push({
        time,
        ...(p ? { placeId: p.id } : {}),
        ...(s.tourSlug ? { tourSlug: s.tourSlug } : {}),
        title: String(s.title ?? p?.name ?? "Programm").slice(0, 80),
        text: String(s.text ?? p?.text ?? "").slice(0, 400),
        ...(Number(s.durationMin) >= 15 && Number(s.durationMin) <= 300 ? { durationMin: Math.round(Number(s.durationMin)) } : {}),
      });
    }
    days.push({ title: String(d.days?.[i]?.title ?? (intent.days === 1 ? "Euer Tag" : `Tag ${i + 1}`)).slice(0, 60), slots });
  }
  const hotel = intent.days > 1 ? getPlace(d.hotelId ?? undefined) : undefined;
  const ok = days.every((x) => x.slots.filter((s) => s.placeId).length >= 2);
  return { days, hotel: hotel?.kind === "hotel" && hotel.region === intent.region ? hotel : undefined, ok };
}

export async function kiPlan(input: KiInput): Promise<KiResult> {
  const { intent, region } = await understand(input);
  const weather = await forecast(region.center.lat, region.center.lng)
    .then((ws) => Array.from({ length: intent.days }, (_, i) => ws.find((w) => w.date === addDays(intent.date, i)) ?? null))
    .catch(() => Array.from({ length: intent.days }, () => null));
  const rainByDay = weather.map((w) => (w ? rainyDay(w) : false));

  let days: TripDay[] = [];
  let hotel: Place | undefined;
  let intro = "";
  let tips: string[] = [];
  let fallback = false;
  let model = "";
  try {
    const r = await compose(intent, region, input, weather);
    model = r.model;
    const v = validate(r.data, intent);
    if (v.ok) {
      days = v.days;
      hotel = v.hotel;
      intro = String(r.data.intro ?? "").slice(0, 400);
      tips = (r.data.tips ?? []).map((t) => String(t).slice(0, 160)).slice(0, 4);
    }
  } catch (e) {
    console.warn("[ki-plan]", (e as Error).message);
  }
  if (!days.length) {
    fallback = true;
    const plan = composePlan(
      { region: intent.region, days: intent.days, audience: intent.audience, moods: intent.moods, rain: rainByDay.some(Boolean), rainByDay, budget: intent.budget, date: intent.date },
      places,
      planTours(),
    );
    days = plan.days;
    hotel = plan.hotel;
  }
  if (intent.days > 1 && !hotel) hotel = composePlan({ region: intent.region, days: 2, audience: intent.audience, moods: [], rain: false, budget: intent.budget }, places, planTours()).hotel;

  const tl = timelineData(days, [hotel?.id]);
  const budget = tripBudget(days, tl.places, hotel, rainByDay.some(Boolean));
  const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric", timeZone: "UTC" });
  const summary = [
    `${fmt(intent.date)}${intent.days > 1 ? ` – ${fmt(addDays(intent.date, intent.days - 1))}` : ""}`,
    `${intent.adults} ${intent.adults === 1 ? "Erwachsene:r" : "Erwachsene"}${intent.kids.length ? ` + ${intent.kids.length} ${intent.kids.length === 1 ? "Kind" : "Kinder"} (${intent.kids.join(", ")} J.)` : ""}`,
    region.name,
    ...(intent.maxPerPerson ? [`bis CHF ${intent.maxPerPerson} p. P.`] : []),
    ...(intent.avoid ? [`ohne: ${intent.avoid}`] : []),
  ];
  return { intent, summary, region, intro: intro || intent.regionWhy, tips, days, hotel, places: tl.places, tours: tl.tours, weather, budget, fallback, model };
}
