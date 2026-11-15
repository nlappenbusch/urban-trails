import { getTourHeroImage } from "@/data/images";
import { tours } from "@/lib/tours";
import { getPlace, places, regionInfo, tripBudget, type Place, type Trip, type TripDay } from "@/lib/ausfluege";
import type { TripLite } from "@/components/TripExplorer";
import type { TimelineTour } from "@/components/TripTimeline";
import type { PlanTour } from "@/lib/compose";

export const regionName = (slug: string) => regionInfo(slug)?.name ?? slug;

/** Erste Urban-Trails-Tour im Programm, sonst die erste Tour der Region. */
export function mainTour(trip: Trip) {
  const slug = trip.dayPlans.flatMap((d) => d.slots).find((s) => s.tourSlug)?.tourSlug;
  return tours.find((t) => t.slug === slug) ?? tours.find((t) => t.citySlug === trip.region);
}

export function toTripLite(trip: Trip): TripLite {
  const t = mainTour(trip);
  const zh = trip.arrival?.find((a) => /zürich/i.test(a.from)) ?? trip.arrival?.[0];
  const { places: pm } = timelineData(trip.dayPlans, trip.hotelIds);
  const b = tripBudget(trip.dayPlans, pm, getPlace(trip.hotelIds?.[0]));
  const firstImg = trip.dayPlans.flatMap((d) => d.slots).map((s) => pm[s.placeId ?? ""]).find((p) => p?.img && p.kind !== "hotel")?.img;
  return {
    slug: trip.slug,
    title: trip.title,
    teaser: trip.teaser,
    region: trip.region,
    center: regionInfo(trip.region)?.center,
    regionName: regionName(trip.region),
    days: trip.days,
    moods: trip.moods,
    audience: trip.audience,
    season: trip.season,
    arrival: zh,
    hero: (t ? getTourHeroImage(t.slug) : undefined) ?? firstImg,
    gradient: t?.gradient ?? ["#ff4d00", "#d63f00"],
    cost: b.high > 0 && b.missing.length <= 1 ? [b.low, b.high] : undefined,
  };
}

/** Nur die Orte und Touren, die ein Programm braucht – hält die Seite klein. */
export function timelineData(days: TripDay[], extra: (string | undefined)[] = []) {
  const ids = new Set<string>(extra.filter(Boolean) as string[]);
  const tourSlugs = new Set<string>();
  for (const s of days.flatMap((d) => d.slots)) {
    if (s.placeId) ids.add(s.placeId);
    if (s.rain?.placeId) ids.add(s.rain.placeId);
    if (s.tourSlug) tourSlugs.add(s.tourSlug);
  }
  const placeMap: Record<string, Place> = {};
  for (const id of ids) {
    const p = getPlace(id);
    if (p) placeMap[id] = p;
  }
  const tourMap: Record<string, TimelineTour> = {};
  for (const slug of tourSlugs) {
    const t = tours.find((x) => x.slug === slug);
    if (t) tourMap[slug] = { name: t.name, citySlug: t.citySlug, durationMinutes: t.durationMinutes };
  }
  return { places: placeMap, tours: tourMap };
}

export const planTours = (): PlanTour[] => tours.map((t) => ({ slug: t.slug, name: t.name, citySlug: t.citySlug, durationMinutes: t.durationMinutes }));

export const plannerRegions = () =>
  [...new Set(places.map((p) => p.region))]
    .map((slug) => ({ slug, name: regionName(slug), station: regionInfo(slug)?.station ?? regionName(slug), center: regionInfo(slug)?.center, hotels: places.some((p) => p.region === slug && p.kind === "hotel") }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
