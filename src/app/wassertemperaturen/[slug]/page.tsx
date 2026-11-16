import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Thermometer } from "lucide-react";
import { places } from "@/lib/ausfluege";
import { bathingSpots, lakeSeries, lakeTemp, riverSeries, riverTemps } from "@/lib/wasser";
import { LAKES, lakeFor, lakeSlug, waterFeel, type BathSpot, type WaterReading } from "@/lib/wasser-core";
import { crowKm } from "@/lib/ski-core";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import TempChart from "@/components/TempChart";
import PlaceGrid from "@/components/PlaceGrid";
import Brotkrumen from "@/components/Brotkrumen";

export const revalidate = 1800;
export const generateStaticParams = () => [];

type Props = { params: Promise<{ slug: string }> };

/** See (Alplakes) oder Flussstation (BAFU) zum URL-Teil */
async function resolve(slug: string) {
  const lake = LAKES.find((l) => lakeSlug(l) === slug);
  if (lake) return { kind: "see" as const, name: lake.name, lake, coords: { lat: lake.lat, lng: lake.lng } };
  const rivers = await riverTemps().catch(() => [] as WaterReading[]);
  const st = rivers.find((r) => r.slug === slug);
  if (st) return { kind: "fluss" as const, name: st.label.replace(" - ", " in "), station: st, coords: { lat: st.lat, lng: st.lng } };
  return undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = await resolve((await params).slug);
  if (!w) return {};
  const short = w.kind === "see" ? w.name : w.station.body;
  const where = w.kind === "fluss" ? ` in ${w.station.label.split(" - ")[1] ?? ""}` : "";
  const title = `Wassertemperatur ${short}${where} heute – live`;
  const desc = w.kind === "see"
    ? `Wie warm ist der ${w.name} heute? Aktuelle Wassertemperatur, Verlauf der letzten 7 Tage, Prognose und Badestellen am ${w.name}.`
    : `Wie warm ist die ${w.station.body}${where} heute? Live-Messung des BAFU alle 10 Minuten, Verlauf der letzten 7 Tage und Badestellen in der Nähe.`;
  const path = `/wassertemperaturen/${(await params).slug}`;
  return { title: { absolute: title }, description: desc, alternates: { canonical: path }, ...socialMeta({ title, description: desc, path }) };
}

const fmt = (t: number) => t.toLocaleString("de-CH", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const time = (iso: string) => new Date(iso).toLocaleString("de-CH", { timeZone: "Europe/Zurich", weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function WaterPage({ params }: Props) {
  const slug = (await params).slug;
  const w = await resolve(slug);
  if (!w) notFound();

  const now: WaterReading | null = w.kind === "see" ? await lakeTemp(w.lake.key).catch(() => null) : w.station;
  const series = await (w.kind === "see" ? lakeSeries(w.lake.key) : riverSeries(w.station.key ?? "")).catch(() => []);
  const past = series.filter((p) => Date.parse(p.t) <= Date.now());
  const weekAgo = past[0];
  const change = now && weekAgo ? Math.round((now.temp - weekAgo.v) * 10) / 10 : undefined;
  const future = series.filter((p) => Date.parse(p.t) > Date.now());
  const tomorrow = future.find((p) => Date.parse(p.t) >= Date.now() + 22 * 3600_000);
  const pastVals = past.map((p) => p.v);
  const weekMin = pastVals.length ? Math.min(...pastVals) : undefined;
  const weekMax = pastVals.length ? Math.max(...pastVals) : undefined;

  // Badestellen: unsere geprüften mit Foto, dazu alle aus OSM an diesem See / dieser Station
  const spots = places
    .filter((p) => p.coords && p.water)
    .filter((p) => (w.kind === "see" ? lakeFor(p.water!.body)?.key === w.lake.key || crowKm(w.coords, p.coords!) < 6 : crowKm(w.coords, p.coords!) < 15))
    .slice(0, 6);
  const allSpots = (await bathingSpots().catch(() => [] as BathSpot[]))
    .filter((b) => b.kind === "offen" && !b.ours && (b.water?.slug === slug || (w.kind === "fluss" && crowKm(w.coords, b) < 5)))
    .sort((a, b) => crowKm(w.coords, a) - crowKm(w.coords, b));

  const rivers = await riverTemps().catch(() => [] as WaterReading[]);
  const siblings = w.kind === "fluss"
    ? rivers.filter((r) => r.body === w.station.body && r.slug !== slug).sort((a, b) => crowKm(w.coords, a) - crowKm(w.coords, b)).slice(0, 8)
    : [];
  const nearLakes = LAKES.filter((l) => l.key !== (w.kind === "see" ? w.lake.key : "")).sort((a, b) => crowKm(w.coords, a) - crowKm(w.coords, b)).slice(0, 4);

  const short = w.kind === "see" ? w.name : w.station.body;
  const masc = w.kind === "see" || /^(rhein|hinterrhein|vorderrhein|alpenrhein|inn|doubs|ticino|rotten|poschiavino|moesa)\b/i.test(short);
  const art = masc ? "der" : "die";
  const imIn = masc ? `im ${short}` : `in der ${short}`;
  const answer = now
    ? `${art[0].toUpperCase()}${art.slice(1)} ${w.name} hat gerade ${fmt(now.temp)} °C (${waterFeel(now.temp)})${w.kind === "see" ? " – Modellwert 1 m unter der Oberfläche" : " – gemessen vom BAFU"}, Stand ${time(now.at)}.${change !== undefined ? ` Gegenüber vor 7 Tagen ${change > 0 ? `${fmt(change)} Grad wärmer` : change < 0 ? `${fmt(-change)} Grad kälter` : "gleich warm"}.` : ""}`
    : `Für ${w.name} liegt gerade kein aktueller Wert vor.`;

  const faq = [
    { q: `Wie warm ist ${art} ${short} heute?`, a: answer },
    tomorrow && { q: `Wie warm wird ${art} ${short} morgen?`, a: `Das Seemodell der Eawag rechnet für morgen mit rund ${fmt(tomorrow.v)} °C an der Oberfläche.` },
    now && { q: `Kann man ${imIn} baden?`, a: now.temp >= 20 ? `Ja, mit ${fmt(now.temp)} °C ist das Wasser angenehm. Auf Strömung, Schiffsverkehr und Hinweise vor Ort achten.` : now.temp >= 16 ? `Für Geübte ja – ${fmt(now.temp)} °C ist frisch. Nicht allein schwimmen und nicht lange im Wasser bleiben.` : `Mit ${fmt(now.temp)} °C ist das Wasser kalt – nur für Eisbader mit Erfahrung, kurz und nie allein.` },
    { q: "Woher stammen die Werte?", a: w.kind === "see" ? "Aus dem Seemodell Simstrat der Eawag (Alplakes, CC BY 4.0). Es rechnet die Temperatur 1 m unter der Oberfläche aus Wetter- und Zuflussdaten – keine Messung vor Ort." : "Von der Messstation des Bundesamts für Umwelt BAFU (hydrodaten.admin.ch), alle 10 Minuten aktualisiert." },
  ].filter(Boolean) as { q: string; a: string }[];

  const path = `/wassertemperaturen/${slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": w.kind === "see" ? "LakeBodyOfWater" : "RiverBodyOfWater",
      name: w.kind === "see" ? w.name : w.station.body,
      url: `${SITE_URL}${path}`,
      geo: { "@type": "GeoCoordinates", latitude: w.coords.lat, longitude: w.coords.lng },
      ...(now ? { additionalProperty: { "@type": "PropertyValue", name: "Wassertemperatur", value: now.temp, unitCode: "CEL", unitText: "°C" } } : {}),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Wassertemperaturen", path: "/wassertemperaturen" }, { name: w.name, path }]),
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Brotkrumen items={[{ label: "Wassertemperaturen", href: "/wassertemperaturen" }, { label: w.name }]} />
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">Wie warm ist {art} {w.name}?</h1>
      <p className="mt-2 font-semibold text-cream-dim">{w.kind === "see" ? "See" : `Fluss, Messstation ${w.station.label.split(" - ")[1] ?? ""}`}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <section className="card p-6" aria-label="Aktueller Wert">
          {now ? (
            <>
              <p className="flex items-center gap-2 text-sm font-semibold text-cream-dim"><Thermometer size={16} aria-hidden /> {w.kind === "see" ? "jetzt, 1 m Tiefe" : "jetzt gemessen"}</p>
              <p className="mt-2 font-display text-7xl font-extrabold leading-none tracking-tight text-cream tabular-nums">{fmt(now.temp)}°</p>
              <p className="mt-2 text-lg font-semibold text-cream">{waterFeel(now.temp)}</p>
              <p className="mt-1 text-xs text-cream-faint">Stand {time(now.at)}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {now.min24 !== undefined && <Fact label="letzte 24 h" value={`${fmt(now.min24)}–${fmt(now.max24 ?? now.temp)}°`} />}
                {weekMin !== undefined && <Fact label="letzte 7 Tage" value={`${fmt(weekMin)}–${fmt(weekMax!)}°`} />}
                {change !== undefined && <Fact label="seit letzter Woche" value={`${change > 0 ? "+" : ""}${fmt(change)}°`} />}
                {tomorrow && <Fact label="morgen (Prognose)" value={`${fmt(tomorrow.v)}°`} />}
              </dl>
            </>
          ) : (
            <p className="text-cream-dim">Gerade kein aktueller Wert – die Quelle antwortet nicht. Später nochmals schauen.</p>
          )}
        </section>
        <section className="card p-5" aria-label="Verlauf">
          <TempChart points={series} label={w.kind === "see" ? `Wassertemperatur ${w.name}, 1 m Tiefe – 7 Tage zurück, 4 Tage Prognose (°C)` : `Wassertemperatur ${w.name} – letzte 7 Tage (°C)`} />
        </section>
      </div>

      <p className="mt-8 max-w-3xl text-lg leading-relaxed text-cream">{answer}</p>

      {spots.length > 0 && (
        <section className="mt-14" aria-labelledby="baden">
          <h2 id="baden" className="font-display text-2xl font-extrabold tracking-tight text-cream">Hier kannst du baden</h2>
          <div className="mt-4"><PlaceGrid places={spots} /></div>
        </section>
      )}
      {allSpots.length > 0 && (
        <section className="mt-10" aria-labelledby="alle-baden">
          <h2 id="alle-baden" className="font-display text-xl font-extrabold tracking-tight text-cream">{spots.length ? "Weitere Badestellen" : "Badestellen"} {w.kind === "see" ? `am ${w.name}` : "in der Nähe"} ({allSpots.length})</h2>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {allSpots.map((b) => (
              <li key={b.id} className="flex items-baseline justify-between gap-3 border-b border-cream/5 py-1.5">
                <a href={b.url ?? `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`} target="_blank" rel="noopener" className="min-w-0 truncate text-cream-dim hover:text-cream">{b.name}{b.town ? `, ${b.town}` : ""}</a>
                {b.fee === false && <span className="shrink-0 text-xs font-semibold text-emerald-700">gratis</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl font-extrabold tracking-tight text-cream">Kurz beantwortet</h2>
        <dl className="mt-4 max-w-3xl divide-y divide-cream/10">
          {faq.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-bold text-cream">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-cream-dim">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14 grid gap-10 md:grid-cols-2">
        {siblings.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-cream">Weitere Stationen {masc ? "am" : "an der"} {w.kind === "fluss" ? w.station.body : ""}</h2>
            <ul className="mt-3 space-y-1.5 text-sm">
              {siblings.map((r) => (
                <li key={r.slug}><Link href={`/wassertemperaturen/${r.slug}`} className="flex justify-between gap-3 text-cream-dim hover:text-cream"><span>{r.label.replace(/^[^-]+ - /, "")}</span><strong className="tabular-nums text-cream">{fmt(r.temp)}°</strong></Link></li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h2 className="font-display text-xl font-extrabold tracking-tight text-cream">Seen in der Nähe</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {nearLakes.map((l) => (
              <li key={l.key}><Link href={`/wassertemperaturen/${lakeSlug(l)}`} className="text-cream-dim hover:text-cream">Wassertemperatur {l.name}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        {w.kind === "see" ? "Quelle: Alplakes, Eawag (CC BY 4.0) – Modellwerte, keine Messung vor Ort." : "Quelle: Bundesamt für Umwelt BAFU, hydrodaten.admin.ch."} Angaben ohne Gewähr; an Badestellen gelten die Hinweise vor Ort.
      </p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-cream-faint">{label}</dt>
      <dd className="mt-0.5 font-bold tabular-nums text-cream">{value}</dd>
    </div>
  );
}
