import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, TrainFront, Users } from "lucide-react";
import { AUDIENCE, MOODS, daysLabel, fmtMin, getPlace, getTrip, priceText, regionInfo, tripBudget, trips } from "@/lib/ausfluege";
import { mainTour, regionName, timelineData } from "@/lib/ausfluege-view";
import { getTourHeroImage } from "@/data/images";
import { imgAttrs } from "@/lib/img";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import TripTimeline from "@/components/TripTimeline";
import TripMap from "@/components/TripMap";
import TripPlanPanel from "@/components/TripPlanPanel";
import TripBudget from "@/components/TripBudget";
import GuideTeaser from "@/components/GuideTeaser";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const trip = getTrip((await params).slug);
  if (!trip) return {};
  const title = `${trip.title} – ${daysLabel(trip.days)} Programm mit Hotel, Restaurants & Plan B`;
  const description = `${trip.teaser} Fertig geplanter ${trip.days === 1 ? "Tagesausflug" : `${trip.days}-Tage-Trip`} nach ${regionName(trip.region)} mit Uhrzeiten, echten Adressen, Audio-Stadtrundgang und Regenvariante.`;
  const t = mainTour(trip);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/ausfluege/${trip.slug}` },
    ...socialMeta({ title, description, path: `/ausfluege/${trip.slug}`, image: t ? getTourHeroImage(t.slug) : undefined, type: "article" }),
  };
}

export default async function TripPage({ params }: Props) {
  const trip = getTrip((await params).slug);
  if (!trip) notFound();
  const tour = mainTour(trip);
  const hotels = (trip.hotelIds ?? []).map((id) => getPlace(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const { places, tours } = timelineData(trip.dayPlans, trip.hotelIds);
  const region = regionName(trip.region);
  const budget = tripBudget(trip.dayPlans, places, hotels[0]);
  // Fotos der Stationen in Programm-Reihenfolge, ohne Doppelte
  const gallery = [...new Set(trip.dayPlans.flatMap((d) => d.slots).map((s) => s.placeId).filter(Boolean) as string[])]
    .map((id) => places[id])
    .filter((p) => p?.img && p.kind !== "hotel")
    .slice(0, 8);
  const hero = (tour ? getTourHeroImage(tour.slug) : undefined) ?? gallery[0]?.img;

  const facts = [
    { icon: Clock, label: "Dauer", value: daysLabel(trip.days) },
    { icon: CalendarDays, label: "Beste Zeit", value: trip.season },
    { icon: Users, label: "Passt für", value: trip.audience.map((a) => AUDIENCE[a] ?? a).join(", ") },
  ].filter((f) => f.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflüge", path: "/ausfluege" }, { name: trip.title, path: `/ausfluege/${trip.slug}` }]),
            {
              "@context": "https://schema.org",
              "@type": "TouristTrip",
              name: trip.title,
              description: trip.teaser,
              url: `${SITE_URL}/ausfluege/${trip.slug}`,
              touristType: trip.audience.map((a) => AUDIENCE[a] ?? a),
              itinerary: {
                "@type": "ItemList",
                itemListElement: trip.dayPlans.flatMap((d) => d.slots).filter((s) => s.placeId && places[s.placeId]).map((s, i) => {
                  const p = places[s.placeId!];
                  return { "@type": "ListItem", position: i + 1, item: { "@type": "Place", name: p.name, address: p.address, url: p.url } };
                }),
              },
            },
          ]),
        }}
      />
      <section className="relative overflow-hidden" style={{ background: tour ? `linear-gradient(135deg, ${tour.gradient[0]}, ${tour.gradient[1]})` : undefined }}>
        {hero && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={hero.url} {...imgAttrs(hero, "100vw")} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/20" />
        <div className="container-page relative py-8 sm:py-14">
          <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70" aria-label="Brotkrumen">
            <Link href="/ausfluege" className="hover:text-white">Ausflüge</Link>
            <span aria-hidden>/</span>
            <span className="text-white">{region}</span>
          </nav>
          <h1 className="headline max-w-3xl text-4xl text-white sm:text-6xl">{trip.title}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/90">{trip.teaser}</p>
          <p className="mt-3 text-sm font-semibold text-white/80">{trip.moods.map((m) => MOODS[m] ?? m).join(" · ")}</p>
        </div>
      </section>

      {gallery.length >= 3 && (
        <div className="container-page pt-6" aria-label="Fotos der Stationen">
          <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {gallery.map((p) => (
              <li key={p.id} className="w-44 shrink-0 snap-start sm:w-52">
                <a href={p.img!.credit} target="_blank" rel="noopener noreferrer" title="Foto: Wikimedia Commons – Urheber & Lizenz" className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img!.small} {...imgAttrs(p.img!, "208px")} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl object-cover" />
                </a>
                <p className="mt-1.5 truncate text-sm font-semibold text-cream">{p.name}</p>
                {p.priceInfo && <p className="truncate text-xs text-cream-faint">{priceText(p.priceInfo)}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="container-page pb-16 pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <h2 className="headline text-3xl text-cream sm:text-4xl">Das Programm</h2>
            <p className="mt-2 max-w-xl text-sm text-cream-dim">
              Uhrzeiten sind ein Vorschlag – schieb, was du willst. Bei Regen tauscht der Schalter die Draussen-Punkte gegen Plan B.
            </p>
            <div className="mt-6">
              <TripMap days={trip.dayPlans} places={places} hotel={hotels[0]} />
            </div>
            <div className="mt-8">
              <TripTimeline title={trip.title} days={trip.dayPlans} places={places} tours={tours} hotel={hotels[0]} />
            </div>
            {hotels.length > 1 && (
              <div className="mt-6 space-y-3">
                <p className="kicker">Weitere Hotels</p>
                {hotels.slice(1).map((h) => (
                  <div key={h.id} className="card p-4">
                    <p className="font-bold text-cream">{h.name}</p>
                    <p className="mt-1 text-sm text-cream-dim">{h.text}</p>
                    {h.priceInfo && <p className="mt-1 text-sm font-semibold text-cream">{priceText(h.priceInfo)}</p>}
                    <p className="mt-1 text-xs text-cream-faint">
                      {h.address}{h.url && <> · <a href={h.url} target="_blank" rel="noopener" className="font-semibold text-cream-dim hover:text-cream">Website</a></>}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit space-y-6">
            <div className="card p-6">
              <p className="kicker mb-4">Dein Ausflug</p>
              <TripPlanPanel region={trip.region} station={regionInfo(trip.region)?.station ?? region} days={trip.dayPlans} />
            </div>
            <div className="card space-y-4 p-6 text-sm">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <Icon size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden />
                  <div>
                    <p className="font-semibold text-cream">{label}</p>
                    <p className="text-cream-dim">{value}</p>
                  </div>
                </div>
              ))}
              {trip.arrival && trip.arrival.length > 0 && (
                <div className="flex gap-3">
                  <TrainFront size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden />
                  <div>
                    <p className="font-semibold text-cream">Anreise mit dem Zug</p>
                    <ul className="text-cream-dim">
                      {trip.arrival.map((a) => <li key={a.from}>ab {a.from}: ca. {fmtMin(a.minutes)}</li>)}
                    </ul>
                    <a href="https://www.sbb.ch/" target="_blank" rel="noopener" className="mt-1 inline-block text-xs font-semibold text-signal-600 hover:text-signal-500">Fahrplan bei der SBB</a>
                  </div>
                </div>
              )}
              <TripBudget budget={budget} />
            </div>
            <p className="text-xs leading-relaxed text-cream-faint">
              Alle Orte haben wir geprüft (Stand {lastChecked(places)}). Öffnungszeiten und Saison können sich ändern – bei Restaurants lohnt sich reservieren.
            </p>
          </aside>
        </div>

        <section className="mt-16">
          <GuideTeaser href={`/fuehrung?stadt=${trip.region}#anfrage`} place={region} />
        </section>
        <p className="mt-8 text-sm text-cream-dim">
          Anders gewünscht? <Link href={`/ausfluege/planen?region=${trip.region}&tage=${trip.days}`} className="font-semibold text-signal-600 hover:text-signal-500">Programm für {region} selbst zusammenstellen</Link>
          {" · "}<Link href={`/ausflugsziele/${trip.region}`} className="font-semibold text-signal-600 hover:text-signal-500">alle Ausflugsziele in {region}</Link>
          {" · "}<Link href={`/geschenk?trip=${trip.slug}`} className="font-semibold text-signal-600 hover:text-signal-500">diesen Ausflug verschenken</Link>
        </p>
      </div>
    </>
  );
}

function lastChecked(places: Record<string, { checked?: string }>) {
  const d = Object.values(places).map((p) => p.checked).filter(Boolean).sort().pop();
  return d ? new Date(`${d}T12:00:00`).toLocaleDateString("de-CH", { month: "long", year: "numeric" }) : "2026";
}
