import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { places, regionInfo, tripBudget } from "@/lib/ausfluege";
import { planTours, timelineData, toTripLite } from "@/lib/ausfluege-view";
import { composePlan } from "@/lib/compose";
import { THEMEN, getThema, themaPages, themaPlaces, themaTrips } from "@/lib/themen";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import PlaceGrid from "@/components/PlaceGrid";
import TripCards from "@/components/TripCards";
import TripTimeline from "@/components/TripTimeline";
import TripMap from "@/components/TripMap";
import TripBudget from "@/components/TripBudget";

interface Props {
  params: Promise<{ region: string; thema: string }>;
}

export function generateStaticParams() {
  return themaPages();
}

export const dynamicParams = false;

function load(region: string, thema: string) {
  const r = regionInfo(region);
  const t = getThema(thema);
  if (!r || !t || !themaPages().some((x) => x.region === region && x.thema === thema)) return undefined;
  return { r, t, ps: themaPlaces(region, t) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, thema } = await params;
  const d = load(region, thema);
  if (!d) return {};
  const title = `${d.t.title(d.r.name)}: ${d.ps.length} ${d.t.slug === "wochenende" ? "Hotels" : "Tipps"} & fertiges Programm`;
  const description = `${d.t.title(d.r.name)} – ${d.ps.slice(0, 3).map((p) => p.name).join(", ")} und mehr. Mit Preisen, Öffnungszeiten, Fotos und einem Tagesprogramm samt Zugverbindung.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/ausflugsziele/${region}/${thema}` },
    ...socialMeta({ title, description, path: `/ausflugsziele/${region}/${thema}`, image: d.ps.find((p) => p.img)?.img }),
  };
}

export default async function ThemaPage({ params }: Props) {
  const { region, thema } = await params;
  const d = load(region, thema);
  if (!d) notFound();
  const { r, t, ps } = d;

  const plan = composePlan({ region, ...t.plan }, places, planTours());
  const tl = timelineData(plan.days, [plan.hotel?.id]);
  const budget = tripBudget(plan.days, tl.places, plan.hotel, t.plan.rain);
  const trips = themaTrips(region, t).map(toTripLite);
  const faq = t.faq(r.name, ps.map((p) => p.name));
  const others = themaPages().filter((x) => x.region === region && x.thema !== thema).map((x) => THEMEN.find((y) => y.slug === x.thema)!);
  const sameElsewhere = themaPages().filter((x) => x.thema === thema && x.region !== region).map((x) => regionInfo(x.region)!).filter(Boolean);
  const plannerUrl = `/ausfluege/planen?region=${region}&tage=${t.plan.days}&mit=${t.plan.audience}&budget=${t.plan.budget}${t.plan.moods.length ? `&stimmung=${t.plan.moods.join(",")}` : ""}${t.plan.rain ? "&wetter=regen" : ""}`;

  return (
    <div className="container-page pb-16 pt-8 sm:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Start", path: "/" },
              { name: "Ausflugsziele", path: "/ausflugsziele" },
              { name: r.name, path: `/ausflugsziele/${region}` },
              { name: t.title(r.name), path: `/ausflugsziele/${region}/${thema}` },
            ]),
            { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } }] },
          ]),
        }}
      />
      <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-cream-faint" aria-label="Brotkrumen">
        <Link href="/ausflugsziele" className="hover:text-cream">Ausflugsziele</Link>
        <span aria-hidden>/</span>
        <Link href={`/ausflugsziele/${region}`} className="hover:text-cream">{r.name}</Link>
        <span aria-hidden>/</span>
        <span className="text-cream-dim">{t.label}</span>
      </nav>
      <h1 className="headline max-w-3xl text-4xl text-cream sm:text-6xl">{t.title(r.name)}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">{t.intro(r.name)}</p>

      <section className="mt-10" aria-labelledby="orte">
        <h2 id="orte" className="headline text-3xl text-cream">{ps.length} Orte {t.label}</h2>
        <div className="mt-5"><PlaceGrid places={ps} /></div>
      </section>

      {plan.days[0]?.slots.length > 2 && (
        <section className="mt-16" aria-labelledby="programm">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0">
              <h2 id="programm" className="headline text-3xl text-cream">So könnte dein Tag aussehen</h2>
              <p className="mt-2 max-w-xl text-sm text-cream-dim">
                Automatisch aus den Orten oben zusammengestellt. Datum, Startbahnhof und eigene Wünsche stellst du im <Link href={plannerUrl} className="font-semibold text-signal-600 hover:text-signal-500">Planer</Link> ein.
              </p>
              <div className="mt-6"><TripMap days={plan.days} places={tl.places} hotel={plan.hotel} /></div>
              <div className="mt-8"><TripTimeline title={t.title(r.name)} days={plan.days} places={tl.places} tours={tl.tours} hotel={plan.hotel} /></div>
            </div>
            {budget.high > 0 && (
              <aside className="card h-fit p-6 text-sm"><TripBudget budget={budget} /></aside>
            )}
          </div>
        </section>
      )}

      {trips.length > 0 && (
        <section className="mt-16" aria-labelledby="programme">
          <h2 id="programme" className="headline text-3xl text-cream">Fertige Programme in {r.name}</h2>
          <div className="mt-5"><TripCards trips={trips} query={t.plan.rain ? "?wetter=regen" : ""} /></div>
        </section>
      )}

      <section className="mt-16 max-w-3xl" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl font-extrabold tracking-tight text-cream">{faq.q}</h2>
        <p className="mt-2 leading-relaxed text-cream-dim">{faq.a}</p>
      </section>

      <nav className="mt-12 space-y-4 text-sm" aria-label="Weitere Themen">
        {others.length > 0 && (
          <p className="text-cream-dim">
            Mehr zu {r.name}:{" "}
            {others.map((o, i) => (
              <span key={o.slug}>{i > 0 && " · "}<Link href={`/ausflugsziele/${region}/${o.slug}`} className="font-semibold text-signal-600 hover:text-signal-500">{o.label}</Link></span>
            ))}
            {" · "}<Link href={`/ausflugsziele/${region}`} className="font-semibold text-signal-600 hover:text-signal-500">alle Ausflugsziele</Link>
          </p>
        )}
        {sameElsewhere.length > 0 && (
          <p className="text-cream-dim">
            {t.label[0].toUpperCase() + t.label.slice(1)} auch in:{" "}
            {sameElsewhere.map((o, i) => (
              <span key={o.slug}>{i > 0 && " · "}<Link href={`/ausflugsziele/${o.slug}/${thema}`} className="font-semibold text-signal-600 hover:text-signal-500">{o.name}</Link></span>
            ))}
          </p>
        )}
      </nav>
    </div>
  );
}
