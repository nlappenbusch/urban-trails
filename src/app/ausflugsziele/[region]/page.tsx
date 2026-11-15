import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { allRegions, regionInfo, trips, type Place, type PlaceKind } from "@/lib/ausfluege";
import { toTripLite } from "@/lib/ausfluege-view";
import { THEMEN, regionPlaces, themaPages } from "@/lib/themen";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import PlaceGrid from "@/components/PlaceGrid";
import TripCards from "@/components/TripCards";
import AusflugTools from "@/components/AusflugTools";

interface Props {
  params: Promise<{ region: string }>;
}

const GROUPS: { title: string; kinds: PlaceKind[] }[] = [
  { title: "Erleben & anschauen", kinds: ["aktivitaet", "sehenswuerdigkeit", "aussicht", "bad"] },
  { title: "Essen & trinken", kinds: ["restaurant", "cafe", "bar"] },
  { title: "Übernachten", kinds: ["hotel"] },
];

export function generateStaticParams() {
  return allRegions().filter((r) => regionPlaces(r.slug).length >= 4).map((r) => ({ region: r.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = regionInfo((await params).region);
  if (!r) return {};
  const n = regionPlaces(r.slug).length;
  const title = `Ausflugsziele ${r.name}: ${n} geprüfte Tipps mit Preisen`;
  const description = `Was tun in ${r.name}? ${n} Ausflugsziele, Restaurants und Hotels mit Eintrittspreisen, Öffnungszeiten, Foto und fertigen Programmen – auch für Regen und mit Kindern.`;
  const img = regionPlaces(r.slug).find((p) => p.img && p.kind !== "hotel")?.img;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/ausflugsziele/${r.slug}` },
    ...socialMeta({ title, description, path: `/ausflugsziele/${r.slug}`, image: img }),
  };
}

export default async function RegionPage({ params }: Props) {
  const r = regionInfo((await params).region);
  if (!r) notFound();
  const ps = regionPlaces(r.slug);
  if (ps.length < 4) notFound();
  const regionTrips = trips.filter((t) => t.region === r.slug).map(toTripLite);
  const themen = themaPages().filter((x) => x.region === r.slug).map((x) => THEMEN.find((t) => t.slug === x.thema)!);
  const hero = ps.find((p) => p.img && p.kind !== "hotel" && p.kind !== "restaurant")?.img;
  const groups = GROUPS.map((g) => ({ ...g, places: ps.filter((p) => g.kinds.includes(p.kind)).sort(byKind(g.kinds)) })).filter((g) => g.places.length);
  const regenfest = ps.filter((p) => p.weatherProof && p.kind !== "hotel").length;
  const gratis = ps.filter((p) => p.priceInfo?.from === 0).length;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflugsziele", path: "/ausflugsziele" }, { name: r.name, path: `/ausflugsziele/${r.slug}` }]),
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `Ausflugsziele ${r.name}`,
              itemListElement: ps.filter((p) => p.kind !== "hotel").map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: { "@type": p.kind === "restaurant" || p.kind === "cafe" || p.kind === "bar" ? "Restaurant" : "TouristAttraction", name: p.name, address: p.address, url: `${SITE_URL}/ausflugsziele/${r.slug}#${p.id}` },
              })),
            },
          ]),
        }}
      />
      <section className="relative overflow-hidden bg-ink-950">
        {hero && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={hero.url} alt="" width={hero.width} height={hero.height} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-ink-950/20" />
        <div className="container-page relative py-10 sm:py-16">
          <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70" aria-label="Brotkrumen">
            <Link href="/ausflugsziele" className="hover:text-white">Ausflugsziele</Link>
            <span aria-hidden>/</span>
            <span className="text-white">{r.name}</span>
          </nav>
          <h1 className="headline max-w-3xl text-4xl text-white sm:text-6xl">Ausflugsziele {r.name}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/90">
            {ps.length} Orte, die wir einzeln geprüft haben – mit Preis, Öffnungszeiten und Foto.
            {regenfest > 0 && ` ${regenfest} davon funktionieren auch bei Regen`}
            {gratis > 0 && `, ${gratis} kosten nichts`}.
          </p>
        </div>
      </section>

      <div className="container-page pb-16 pt-8">
        {themen.length > 0 && (
          <nav aria-label="Themen" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {themen.map((t) => (
              <Link key={t.slug} href={`/ausflugsziele/${r.slug}/${t.slug}`} className="min-h-[40px] shrink-0 whitespace-nowrap rounded-full border border-cream/20 bg-ink-900 px-4 py-2 text-sm font-semibold text-cream-dim transition hover:border-signal-500 hover:text-cream">
                {r.name} {t.label}
              </Link>
            ))}
            <Link href={`/ausfluege/planen?region=${r.slug}`} className="min-h-[40px] shrink-0 whitespace-nowrap rounded-full border border-signal-500 bg-signal-500 px-4 py-2 text-sm font-semibold text-white">Programm planen</Link>
          </nav>
        )}

        {regionTrips.length > 0 && (
          <section className="mt-10" aria-labelledby="programme">
            <h2 id="programme" className="headline text-3xl text-cream">Fertige Programme</h2>
            <p className="mt-1 text-sm text-cream-dim">Mit Uhrzeit, Restaurant, Plan B und echten Zugverbindungen ab deinem Bahnhof.</p>
            <div className="mt-5"><TripCards trips={regionTrips} /></div>
          </section>
        )}

        {groups.map((g) => (
          <section key={g.title} className="mt-14" aria-label={g.title}>
            <h2 className="headline text-3xl text-cream">{g.title}</h2>
            <div className="mt-5"><PlaceGrid places={g.places} /></div>
          </section>
        ))}

        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Noch nicht sicher?</h2>
          <div className="mt-4"><AusflugTools /></div>
        </section>
      </div>
    </>
  );
}

function byKind(kinds: PlaceKind[]) {
  return (a: Place, b: Place) => kinds.indexOf(a.kind) - kinds.indexOf(b.kind) || Number(Boolean(b.img)) - Number(Boolean(a.img));
}
