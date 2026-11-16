import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Lightbulb, Mountain, Snowflake, Timer, TrainFront } from "lucide-react";
import { DIFF, getRun, kmText, nearRuns, rideMin, runs, snowFor } from "@/lib/schlitteln";
import { kantonByAk } from "@/lib/rubriken-core";
import { getSkiArea } from "@/lib/ski";
import { getOffer } from "@/lib/nachtski";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import PointsMap from "@/components/PointsMap";
import SledTrip from "@/components/SledTrip";
import Brotkrumen from "@/components/Brotkrumen";

export const revalidate = 10800;
export const dynamicParams = true;
export const generateStaticParams = () => runs().map((r) => ({ id: r.id }));

type Props = { params: Promise<{ id: string }> };
const dayLabel = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

function answer(r: NonNullable<ReturnType<typeof getRun>>) {
  const where = r.ort ? `bei ${r.ort}` : `im Kanton ${kantonByAk(r.kt)?.name}`;
  return `${r.name} ${where}: ${kmText(r.km)} lang, von ${r.top.ele} auf ${r.bottom.ele} m – ${r.drop} Höhenmeter, Fahrzeit rund ${rideMin(r)} Minuten.${r.top.st ? ` Hinauf bis ${r.top.st}` : ""}${r.bottom.st ? `${r.top.st ? ", unten" : " Unten"} Haltestelle ${r.bottom.st}.` : r.top.st ? "." : ""}${r.lit ? " Abends beleuchtet." : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getRun((await params).id);
  if (!r) return {};
  const title = `${r.name}: Schlittelweg ${kmText(r.km)}, ${r.drop} Hm – Schnee & Anreise`;
  const description = `${answer(r)} Mit Schneehöhe oben und unten und dem Zug ab deinem Ort.`.slice(0, 300);
  return { title: { absolute: title }, description, alternates: { canonical: `/schlitteln/${r.id}` }, ...socialMeta({ title, description, path: `/schlitteln/${r.id}` }) };
}

export default async function Page({ params }: Props) {
  const r = getRun((await params).id);
  if (!r) notFound();
  const snow = await snowFor(r);
  const area = r.ski ? getSkiArea(r.ski) : undefined;
  const night = r.night ? getOffer(r.night) : undefined;
  const near = nearRuns(r, 4);
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return { date: iso, label: i === 0 ? `heute, ${dayLabel(iso)}` : dayLabel(iso) };
  });
  const enough = snow ? (snow.bottomCm ?? 0) >= 15 ? "ja" : (snow.topCm ?? 0) >= 15 ? "oben" : "nein" : undefined;
  const lines = { type: "FeatureCollection" as const, features: r.lines.map((l) => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: l } })) };

  const faq = [
    { q: `Wie lang ist der Schlittelweg ${r.name}?`, a: `${kmText(r.km)} mit ${r.drop} Höhenmetern, von ${r.top.ele} m auf ${r.bottom.ele} m. Eine Abfahrt dauert rund ${rideMin(r)} Minuten.` },
    r.top.st && { q: `Wie kommt man zum Start des Schlittelwegs?`, a: `Mit dem ÖV bis ${r.top.st}${r.top.d ? ` (${r.top.d} m vom Start)` : ""}${r.bottom.st ? `; unten fährt ab ${r.bottom.st} der Bus oder Zug zurück` : ""}.` },
    snow && { q: `Hat es am ${r.name} genug Schnee?`, a: `Laut Wettermodell heute rund ${snow.topCm} cm oben und ${snow.bottomCm} cm unten${snow.snow7 ? `, in den nächsten 7 Tagen kommen etwa ${snow.snow7} cm dazu` : ""}. Ob der Weg offen ist, meldet die Bergbahn oder der Tourismus vor Ort.` },
  ].filter(Boolean) as { q: string; a: string }[];

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Schlittelwege", path: "/schlitteln" }, { name: r.name, path: `/schlitteln/${r.id}` }]),
    {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: r.name,
      description: answer(r),
      url: `${SITE_URL}/schlitteln/${r.id}`,
      geo: { "@type": "GeoCoordinates", latitude: r.top.lat, longitude: r.top.lng, elevation: r.top.ele },
      address: { "@type": "PostalAddress", ...(r.ort ? { addressLocality: r.ort } : {}), addressRegion: r.kt, addressCountry: "CH" },
      ...(r.web ? { sameAs: r.web } : {}),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  const facts: [typeof Mountain, string, string][] = [
    [Mountain, "Strecke", `${kmText(r.km)} · ${r.drop} Hm`],
    [Timer, "Fahrzeit", `rund ${rideMin(r)} Min.`],
    [TrainFront, "Oben", r.top.st ? `${r.top.st} (${r.top.ele} m)` : `${r.top.ele} m, keine Haltestelle in der Nähe`],
    [TrainFront, "Unten", r.bottom.st ? `${r.bottom.st} (${r.bottom.ele} m)` : `${r.bottom.ele} m`],
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Brotkrumen items={[{ label: "Schlittelwege", href: "/schlitteln" }, { label: r.name }]} />
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">{r.name}</h1>
      <p className="mt-2 font-semibold text-cream-dim">Schlittelweg in {r.ort ?? kantonByAk(r.kt)?.name} ({r.kt}){r.diff && DIFF[r.diff] ? ` · ${DIFF[r.diff]}` : ""}</p>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">{answer(r)}{r.via ? ` Der Weg folgt der ${r.via}.` : ""}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(([Icon, k, v]) => (
          <div key={k} className="rounded-xl bg-ink-800/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold text-cream-faint"><Icon size={14} aria-hidden /> {k}</p>
            <p className="mt-1 text-sm font-semibold text-cream">{v}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <PointsMap points={[{ id: "top", name: `Start ${r.top.ele} m`, lat: r.top.lat, lng: r.top.lng, sub: r.top.st }, { id: "bottom", name: `Ziel ${r.bottom.ele} m`, lat: r.bottom.lat, lng: r.bottom.lng, sub: r.bottom.st }]} lines={lines} color="#2563eb" height={460} />
      </section>

      {snow && (
        <section className="mt-14">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-cream"><Snowflake size={22} aria-hidden /> Hat es Schnee?</h2>
          <p className="mt-2 max-w-2xl text-cream-dim">
            {enough === "ja" ? "Ja – laut Modell liegt bis ganz unten Schnee." : enough === "oben" ? "Oben ja, unten wird es knapp – evtl. nur ein Teil fahrbar." : "Im Moment kaum – erst nach Neuschnee lohnt es sich."}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-ink-800/60 p-4"><p className="text-xs font-bold text-cream-faint">Oben, {r.top.ele} m</p><p className="mt-1 font-display text-3xl font-extrabold text-cream">{snow.topCm} cm</p></div>
            <div className="rounded-xl bg-ink-800/60 p-4"><p className="text-xs font-bold text-cream-faint">Unten, {r.bottom.ele} m</p><p className="mt-1 font-display text-3xl font-extrabold text-cream">{snow.bottomCm} cm</p></div>
            <div className="rounded-xl bg-ink-800/60 p-4"><p className="text-xs font-bold text-cream-faint">Neuschnee 7 Tage</p><p className="mt-1 font-display text-3xl font-extrabold text-cream">{snow.snow7} cm</p></div>
          </div>
          <ul className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {snow.days.map((d) => (
              <li key={d.date} className="rounded-lg bg-ink-800/40 p-2 text-center text-xs text-cream-dim">
                <p className="font-bold text-cream">{new Date(`${d.date}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "short", timeZone: "UTC" })}</p>
                <p className="mt-1">{d.snow ? `❄ ${d.snow} cm` : "–"}</p>
                <p>{d.tmin}° / {d.tmax}°</p>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-cream-faint">Schneehöhe und Prognose aus dem Wettermodell ICON (Open-Meteo) für die Höhe von Start und Ziel – keine Messung vor Ort.</p>
        </section>
      )}

      {r.top.st && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Mit dem Zug zum Schlitteln</h2>
          <div className="mt-5"><SledTrip up={r.top.st} down={r.bottom.st} days={days} /></div>
        </section>
      )}

      {(area || night || r.web) && (
        <section className="mt-14 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
          {area && <Link href={`/skigebiete/${area.id}`} className="text-signal-600 hover:text-signal-500">Skigebiet {area.name}: Bahnen, Wetter, Tickets</Link>}
          {night && <Link href={`/nachtskifahren/${night.id}`} className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><Lightbulb size={15} aria-hidden /> {night.name}: Nachtschlitteln</Link>}
          {r.web && <a href={r.web} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Website</a>}
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Schlittelwege in der Nähe</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {near.map(({ x, d }) => (
            <li key={x.id} className="card p-4">
              <p className="text-xs font-semibold text-cream-faint">{x.ort ?? x.kt} · {Math.round(d)} km entfernt</p>
              <Link href={`/schlitteln/${x.id}`} className="mt-0.5 block font-display font-extrabold leading-tight text-cream hover:underline">{x.name}</Link>
              <p className="mt-1 text-xs text-cream-dim">{kmText(x.km)} · {x.drop} Hm</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Häufige Fragen</h2>
        <dl className="mt-4 space-y-5">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="font-bold text-cream">{f.q}</dt>
              <dd className="mt-1 text-cream-dim">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">Verlauf aus OpenStreetMap (© OSM-Mitwirkende, ODbL), Höhen aus dem Mapbox-Geländemodell, Haltestellen von transport.opendata.ch. Ob der Weg präpariert und offen ist, meldet nur der Betreiber.</p>
    </div>
  );
}
