import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { tours } from "@/lib/tours";
import { destinations } from "@/data/destinations";
import { toTourLite } from "@/lib/tour-lite";
import HomeTours, { type CityChip } from "@/components/HomeTours";
import AudioPlayer from "@/components/AudioPlayer";
import GuideTeaser from "@/components/GuideTeaser";
import WohinFinder from "@/components/WohinFinder";
import { trips, daysLabel } from "@/lib/ausfluege";
import { toTripLite } from "@/lib/ausfluege-view";
import { sceneFor } from "@/lib/scene";
import { getStopImage, getTourHeroImage } from "@/data/images";
import { imgAttrs } from "@/lib/img";
import { siteJsonLd, socialMeta } from "@/lib/seo";
import { RUBRIKEN, inSaison, itemsOf, rubrikItems } from "@/lib/rubriken";
import { monatCH, wohin } from "@/lib/wohin";
import { ART_LABEL, kommende, laeuft, sicher } from "@/lib/feste";
import { Plakette } from "@/lib/rubrik-style";
import type { Metadata } from "next";

export const revalidate = 3600;

const HOME_TITLE = "Urban Trails – Ausflugsziele in der Schweiz, sortiert ab deiner Haltestelle";
const HOME_DESC =
  "Wohin heute? Rund 4600 Ausflugsziele in der ganzen Schweiz – Tierparks, Burgen, Höhlen, Bergbahnen, Thermen – passend zu Wetter und Begleitung und nach Entfernung ab deiner Haltestelle. Dazu Audio-Rundgänge durch 16 Städte. Gratis, ohne Konto.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESC,
  alternates: { canonical: "/" },
  ...socialMeta({ title: HOME_TITLE, description: HOME_DESC, path: "/", image: getTourHeroImage("zuerich-klassiker") }),
};

const tag = (iso: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("de-CH", { timeZone: "UTC", ...o }).format(new Date(`${iso}T00:00:00Z`));

export default function HomePage() {
  const lite = tours.map(toTourLite);
  const tripsLite = trips.map(toTripLite);
  const total = rubrikItems().length;
  const initial = { wetter: "egal" as const, ...wohin({ limit: 30 }) };
  const monat = monatCH();
  const saison = RUBRIKEN.filter((r) => inSaison(r, monat))
    .map((r) => ({ r, n: itemsOf(r.slug).length }))
    .sort((a, b) => Number(Boolean(b.r.monate)) - Number(Boolean(a.r.monate)) || b.n - a.n);
  const feste = kommende().slice(0, 4);

  const cities: CityChip[] = destinations
    .filter((d) => !d.comingSoon)
    .map((d) => ({ slug: d.slug, name: d.name, count: lite.filter((t) => t.citySlug === d.slug).length }))
    .filter((c) => c.count > 0);
  const featured = cities
    .slice(0, 6)
    .map((c) => lite.find((t) => t.citySlug === c.slug)!)
    .filter(Boolean);

  const sampleTour = tours.find((t) => t.slug === "hidden-zuerich");
  const sample = sampleTour?.stops.find((s) => s.id === "freitag-tower");
  const sampleImg = sample ? getStopImage(sample.id) : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />

      <section className="container-page pb-14 pt-4 sm:pt-10">
        <h1 className="headline text-[2.75rem] text-cream sm:text-6xl">Wohin heute?</h1>
        <p className="mt-1.5 max-w-xl text-base leading-relaxed text-cream-dim sm:mt-2 sm:text-[17px]">
          <span className="tabnums">{total.toLocaleString("de-CH")}</span> Ausflugsziele in der ganzen Schweiz, sortiert ab deiner Haltestelle. Gratis, ohne Konto.
        </p>
        <div className="mt-4 sm:mt-6">
          <WohinFinder initial={initial} />
        </div>
      </section>

      <section className="container-page pb-16" aria-labelledby="stoebern-titel">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="stoebern-titel" className="text-2xl font-extrabold tracking-[-0.02em] text-cream sm:text-3xl">Nach Art stöbern</h2>
          <Link href="/rubriken" className="inline-flex items-center gap-1 text-sm font-bold text-signal-600 hover:text-signal-700">
            Alle {RUBRIKEN.length} Rubriken <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
        <p className="mt-1 text-cream-dim">Was im {["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"][monat - 1]} offen hat.</p>
        <ul className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {saison.map(({ r, n }) => (
            <li key={r.slug} className="shrink-0">
              <Link href={`/rubriken/${r.slug}`} className="flex h-full w-40 flex-col gap-3 rounded-[22px] bg-ink-900 p-4 shadow-soft ring-1 ring-cream/[0.06] transition duration-200 ease-out hover:shadow-lift active:scale-[0.98] sm:w-auto sm:flex-row sm:items-center">
                <Plakette r={r.slug} size={44} />
                <span className="min-w-0">
                  <span className="block font-bold leading-tight text-cream">{r.label}</span>
                  <span className="tabnums mt-0.5 block text-sm text-cream-faint">{n.toLocaleString("de-CH")} Ziele</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {feste.length > 0 && (
        <section className="container-page pb-16" aria-labelledby="kalender-titel">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="kalender-titel" className="text-2xl font-extrabold tracking-[-0.02em] text-cream sm:text-3xl">Demnächst im Kalender</h2>
            <Link href="/feste" className="inline-flex items-center gap-1 text-sm font-bold text-signal-600 hover:text-signal-700">
              Ganzer Kalender <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {feste.map(({ f, t }) => (
              <li key={f.id}>
                <Link href={`/feste#${f.id}`} className="flex items-center gap-4 rounded-[22px] bg-ink-900 p-3.5 shadow-soft ring-1 ring-cream/[0.06] transition duration-200 ease-out hover:shadow-lift">
                  <span className="grid w-14 shrink-0 overflow-hidden rounded-2xl text-center ring-1 ring-cream/10">
                    <span className="bg-signal-500 py-0.5 text-[11px] font-bold text-white">{tag(t.von, { month: "short" }).replace(".", "")}</span>
                    <span className="tabnums py-1 text-2xl font-extrabold leading-none text-cream">{tag(t.von, { day: "numeric" }).replace(".", "")}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold leading-snug text-cream">{f.name}</span>
                    <span className="mt-0.5 block text-sm text-cream-dim">
                      {f.ort} · {ART_LABEL[f.art]}
                      {laeuft(t) ? " · läuft gerade" : !sicher(f, t) ? " · voraussichtlich" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bg-ink-900 py-16" aria-labelledby="touren-titel">
        <div className="container-page">
          <h2 id="touren-titel" className="text-2xl font-extrabold tracking-[-0.02em] text-cream sm:text-3xl">Audio-Rundgänge durch {cities.length} Städte</h2>
          <p className="mt-1 max-w-xl text-cream-dim">Selbstgeführt mit Audio-Story, Navi und Rätsel an jedem Stopp. Kopfhörer rein, loslaufen.</p>
          <div className="mt-6">
            <HomeTours tours={lite} cities={cities} featured={featured} />
          </div>
        </div>
      </section>

      {tripsLite.length > 0 && (
        <section className="container-page py-16" aria-labelledby="ausfluege-titel">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="ausfluege-titel" className="text-2xl font-extrabold tracking-[-0.02em] text-cream sm:text-3xl">Ausflüge, fertig geplant</h2>
            <Link href="/ausfluege" className="inline-flex items-center gap-1 text-sm font-bold text-signal-600 hover:text-signal-700">
              Alle Ausflüge <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
          <p className="mt-1 max-w-xl text-cream-dim">Tagesausflug oder Wochenende – mit Uhrzeit, Restaurant, Hotel und Plan B für Regen.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tripsLite.slice(0, 6).map((t) => (
              <li key={t.slug}>
                <Link href={`/ausfluege/${t.slug}`} className="group flex h-full flex-col rounded-[22px] bg-ink-900 p-5 shadow-soft ring-1 ring-cream/[0.06] transition duration-200 ease-out hover:shadow-lift">
                  <span className="text-sm font-semibold text-cream-faint">{t.regionName} · {daysLabel(t.days)}</span>
                  <span className="mt-1.5 text-lg font-bold leading-snug tracking-[-0.01em] text-cream">{t.title}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-cream-dim">{t.teaser}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-bold text-signal-600">
                    Plan ansehen <ArrowRight size={15} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <GuideTeaser href="/fuehrung" />
          </div>
        </section>
      )}

      {sampleTour && sample && (
        <section className="bg-ink-800/60">
          <div className="container-page grid gap-8 py-14 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-cream sm:text-3xl">So klingt ein Stopp</h2>
              <p className="mt-3 max-w-md leading-relaxed text-cream-dim">
                Tour wählen, Kopfhörer rein, loslaufen. Das Navi führt dich von Stopp zu Stopp, dort erzählt dir eine Stimme in zwei Minuten, was hier passiert ist. Kein Download, kein Konto nötig – dein Fortschritt bleibt auf deinem Handy.
              </p>
            </div>
            <div className="card overflow-hidden">
              {sampleImg && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={sampleImg.url} {...imgAttrs(sampleImg, "(min-width: 768px) 50vw, 100vw")} loading="lazy" decoding="async" className="h-40 w-full object-cover sm:h-48" />
              )}
              <div className="p-5">
                <p className="text-xl font-bold tracking-[-0.01em] text-cream">{sample.name}</p>
                <p className="mt-1 text-sm text-cream-dim">
                  {sample.teaser}{" "}
                  <Link href={`/${sampleTour.citySlug}/${sampleTour.slug}`} className="font-semibold text-signal-600 hover:text-signal-700">
                    Tour «{sampleTour.name}»
                  </Link>
                </p>
                <div className="mt-4">
                  <AudioPlayer
                    citySlug={sampleTour.citySlug}
                    tourSlug={sampleTour.slug}
                    stopId={sample.id}
                    stopName={sample.name}
                    script={sample.audioScript}
                    audioFile={sample.audioFile}
                    scene={sceneFor(sample)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
