import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CableCar, ExternalLink, Moon, Mountain, Snowflake, Sparkles, Ticket, Users } from "lucide-react";
import { LIVE_ON, getSkiArea, mountainWeather, skiAreas, skiDetail, skiNear, skiRow } from "@/lib/ski";
import { crowKm, kmOpen, type SkiGroup } from "@/lib/ski-core";
import SkiLiveBoard from "@/components/SkiLiveBoard";
import MountainWeatherTable from "@/components/MountainWeatherTable";
import PisteMap from "@/components/PisteMap";
import nightData from "@/data/nachtski.json";
import { WD_LONG, timeText, type NightOffer } from "@/lib/nachtski-core";
import { places, regionInfo } from "@/lib/ausfluege";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import { ColorBar } from "@/components/SkiFinder";
import SkiTravel, { type RentShop } from "@/components/SkiTravel";
import rentData from "@/data/skirent.json";
import PlaceGrid from "@/components/PlaceGrid";

export const dynamic = "force-dynamic";
export const dynamicParams = false;
export const generateStaticParams = () => skiAreas.map((a) => ({ id: a.id }));

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getSkiArea((await params).id);
  if (!a) return {};
  const title = `${a.name}: Pisten offen? Pistenbericht, Schnee & Anreise heute`;
  const desc = `Ist ${a.name} heute offen? Offene Pisten-km je Farbe, Anlagen, Schneehöhe, Tageskarte${a.ticket ? ` ab CHF ${a.ticket.from}` : ""} und Anreise mit Zug oder Auto – live und auf einen Blick.`;
  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: `/skigebiete/${a.id}` },
    ...socialMeta({ title, description: desc, path: `/skigebiete/${a.id}` }),
  };
}

const fmtAt = (s?: string) =>
  s ? new Date(s).toLocaleString("de-CH", { weekday: "short", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" }) : undefined;

const TITLES: Record<string, string> = { lifts: "Anlagen", slopes: "Pisten", food: "Restaurants & Hütten", parking: "Parkplätze", sled: "Schlitteln", parks: "Snowparks", walk: "Winterwandern", xc: "Langlauf" };
const ORDER = ["lifts", "slopes", "food", "parking", "sled", "parks", "walk", "xc"];

/** gleiche Bereiche zusammenlegen, schöne Titel, sinnvolle Reihenfolge */
function mergeGroups(groups: SkiGroup[]): SkiGroup[] {
  const map = new Map<string, SkiGroup>();
  for (const g of groups) {
    const key = g.key === "other" ? `other-${g.title}` : g.key;
    const cur = map.get(key);
    if (cur) cur.items.push(...g.items), (cur.open += g.open), (cur.total += g.total);
    else map.set(key, { ...g, key, title: TITLES[g.key] ?? g.title, items: [...g.items] });
  }
  const rank = (k: string) => (ORDER.includes(k) ? ORDER.indexOf(k) : 50 + (/diverses/i.test(k) ? 10 : 0));
  return [...map.values()].sort((a, b) => rank(a.key) - rank(b.key));
}

/** «A · Plattjen (2.0 km)» → «plattjen» – für den Abgleich mit OSM-Namen */
const bare = (s: string) => s.replace(/^[^·]{1,6} · /, "").replace(/\s*\([^)]*\)\s*$/, "").trim().toLowerCase();

/** «15.11.2026 23:46 Uhr» älter als 3 Tage? */
function isStale(at?: string) {
  const m = at && /(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(at);
  if (!m) return false;
  return Date.now() - Date.UTC(+m[3], +m[2] - 1, +m[1]) > 3 * 86400_000;
}

export default async function SkiAreaPage({ params }: Props) {
  const r = await skiRow((await params).id);
  if (!r) notFound();
  const [detail, weather] = await Promise.all([skiDetail(r).catch(() => null), mountainWeather(r).catch(() => null)]);
  const groups = detail ? mergeGroups(detail.groups) : [];
  const liveItems = groups.filter((g) => g.key === "lifts" || g.key === "slopes").flatMap((g) => g.items);
  const openNames = [...new Set(liveItems.filter((i) => i.status === "open").map((i) => bare(i.name)))];
  const closedNames = [...new Set(liveItems.filter((i) => i.status === "closed").map((i) => bare(i.name)))];
  const nights = (nightData as NightOffer[]).filter((o) => o.skiAreaId === r.id);
  const food = groups.find((g) => g.key === "food");
  const parking = groups.find((g) => g.key === "parking");
  const k = kmOpen(r);
  const st = r.live?.status;
  const isOpen = st === "open";
  const region = r.region ? regionInfo(r.region) : undefined;
  const near = skiNear(r, 4);
  const nearby = places
    .filter((p) => p.coords && p.kind !== "hotel" && crowKm(r.coords, p.coords) < 12)
    .sort((a, b) => crowKm(r.coords, a.coords!) - crowKm(r.coords, b.coords!))
    .slice(0, 6);
  const at = fmtAt(r.live?.at);
  const today = new Date().toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Zurich" });
  const pisteTotal = r.pistes?.total ? Math.round(r.pistes.total) : k.total || undefined;

  // GEO: die Antwort auf «Ist X offen?» als ein klarer Satz
  const statusSentence = !LIVE_ON || !r.live
    ? `Für ${r.name} haben wir gerade keinen Live-Bericht – bitte den offiziellen Pistenbericht prüfen.`
    : isOpen
      ? `${r.name} ist heute (${today}) offen: ${k.approx ? "rund " : ""}${k.open ?? 0} von ${k.total} km Piste${r.live.lifts ? ` und ${r.live.lifts.open} von ${r.live.lifts.total} Anlagen` : ""} sind in Betrieb.`
      : `${r.name} ist heute (${today}) geschlossen${r.season ? ` – Saison: ${r.season}` : ""}.`;

  const faq = [
    { q: `Ist ${r.name} heute offen?`, a: statusSentence },
    pisteTotal && { q: `Wie viele Pistenkilometer hat ${r.name}?`, a: `${r.name} hat rund ${pisteTotal} km Pisten${r.pistes?.blue || r.pistes?.red || r.pistes?.black ? ` – ${[r.pistes?.blue && `${Math.round(r.pistes.blue)} km blau`, r.pistes?.red && `${Math.round(r.pistes.red)} km rot`, r.pistes?.black && `${Math.round(r.pistes.black)} km schwarz`].filter(Boolean).join(", ")}` : ""}${r.lifts ? ` und ${r.lifts} Anlagen` : ""}.` },
    r.ticket && { q: `Was kostet die Tageskarte in ${r.name}?`, a: `Die ${r.ticket.unit} kostet ab CHF ${r.ticket.from}${r.ticket.to && r.ticket.to !== r.ticket.from ? ` bis CHF ${r.ticket.to}` : ""}${r.ticket.note ? ` (${r.ticket.note})` : ""}. Viele Bergbahnen haben dynamische Preise – früh online kaufen ist meist günstiger.` },
    { q: `Wie komme ich mit dem Zug nach ${r.name}?`, a: `Mit dem ÖV bis ${r.station}.${r.access ? ` ${r.access.replace(/\.?\s*$/, ".")}` : ""} Die genaue Verbindung ab deinem Ort zeigt der Rechner auf dieser Seite.` },
    r.snow && { q: `Wie viel Schnee liegt in ${r.name}?`, a: `An der SLF-Messstation ${r.snow.station} (${r.snow.elevation} m ü. M.) lagen am ${new Date(r.snow.date).toLocaleDateString("de-CH")} ${r.snow.cm} cm Schnee${r.snow.fresh ? `, davon ${r.snow.fresh} cm Neuschnee in 24 Stunden` : ""}.` },
    food && food.total > 0 && { q: `Welche Restaurants und Hütten sind in ${r.name} offen?`, a: food.open ? `Laut Bergbahn haben ${food.open} von ${food.total} offen: ${food.items.filter((i) => i.status === "open").slice(0, 8).map((i) => bare(i.name).replace(/^./, (c) => c.toUpperCase())).join(", ")}.` : `Gerade meldet die Bergbahn keine der ${food.total} Gastronomiebetriebe als offen.` },
    parking && parking.items.some((i) => i.status !== "unknown") && { q: `Wo kann ich in ${r.name} parkieren?`, a: `Parkplätze laut Bergbahn: ${parking.items.map((i) => `${i.name} (${i.status === "open" ? "offen" : i.status === "closed" ? "zu" : "ohne Meldung"})`).join(", ")}.` },
  ].filter(Boolean) as { q: string; a: string }[];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SkiResort",
      name: r.name,
      url: `${SITE_URL}/skigebiete/${r.id}`,
      ...(r.text ? { description: r.text } : {}),
      ...(r.url ? { sameAs: r.url } : {}),
      geo: { "@type": "GeoCoordinates", latitude: r.coords.lat, longitude: r.coords.lng, ...(r.altitude?.top ? { elevation: r.altitude.top } : {}) },
      address: { "@type": "PostalAddress", addressRegion: r.canton, addressCountry: "CH" },
      ...(r.ticket ? { priceRange: `CHF ${r.ticket.from}${r.ticket.to ? `–${r.ticket.to}` : ""}` } : {}),
      amenityFeature: [
        r.family && { "@type": "LocationFeatureSpecification", name: "Kinderland", value: true },
        r.snowpark && { "@type": "LocationFeatureSpecification", name: "Snowpark", value: true },
        r.nightSkiing && { "@type": "LocationFeatureSpecification", name: "Nachtskifahren", value: true },
      ].filter(Boolean),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Skigebiete", path: "/skigebiete" }, { name: r.name, path: `/skigebiete/${r.id}` }]),
  ];

  const shops = ((rentData as Record<string, RentShop[]>)[r.id] ?? []);
  const foodOpen = (food?.items ?? []).filter((i) => i.status === "open").map((i) => bare(i.name).replace(/^./, (c) => c.toUpperCase()));
  const share = k.open != null && k.total ? k.open / k.total : 0;
  const hotelPlace = r.station.split(/[ ,(]/)[0];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/skigebiete" className="inline-flex items-center gap-1 text-sm font-semibold text-cream-dim hover:text-cream"><ArrowLeft size={15} aria-hidden /> Alle Skigebiete</Link>

      <p className="kicker mt-6 flex flex-wrap items-center gap-2">
        {LIVE_ON && r.live && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${isOpen ? "bg-emerald-600 text-white" : "bg-zinc-300 text-zinc-800"}`}>
            {isOpen && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />} {isOpen ? "heute offen" : "geschlossen"}
          </span>
        )}
        <span>Skigebiet · {r.canton}{region ? ` · ${region.name}` : ""}</span>
      </p>
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">{r.name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream">{statusSentence}</p>
      {r.text && <p className="mt-3 max-w-2xl leading-relaxed text-cream-dim">{r.text}</p>}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="card p-5 sm:p-6" aria-labelledby="pisten">
          <h2 id="pisten" className="kicker">Pistenbericht{at ? ` · Stand ${at}` : ""}</h2>
          {LIVE_ON && r.live && k.total > 0 ? (
            <>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
                <span className={`font-display text-6xl font-extrabold leading-none tracking-tight ${isOpen ? "text-emerald-600" : "text-cream-faint"}`}>{k.approx ? "ca. " : ""}{k.open ?? 0}</span>
                <span className="text-lg text-cream-dim">von {k.total} km offen{r.live.slopes ? ` · ${r.live.slopes.open} von ${r.live.slopes.total} Pisten` : ""}</span>
              </p>
              <span className="mt-3 block h-3 rounded-full bg-ink-800">
                <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(share * 100, share > 0 ? 2 : 0)}%` }} />
              </span>
            </>
          ) : pisteTotal ? (
            <p className="mt-3 flex items-baseline gap-3">
              <span className="font-display text-6xl font-extrabold leading-none tracking-tight text-cream">{pisteTotal}</span>
              <span className="text-lg text-cream-dim">km Pisten</span>
            </p>
          ) : null}
          <div className="mt-5 space-y-2">
            {(["blue", "red", "black"] as const).map((c) => (
              <ColorBar key={c} k={c} live={LIVE_ON ? r.live?.byColor?.[c] : undefined} totalKm={r.pistes?.[c]} />
            ))}
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <Fact icon={<CableCar size={16} aria-hidden />} label="Anlagen" value={LIVE_ON && r.live?.lifts ? `${r.live.lifts.open} von ${r.live.lifts.total} offen` : r.lifts ? `${r.lifts}` : "–"} />
            <Fact icon={<Snowflake size={16} aria-hidden />} label={r.snow ? `Schnee (${r.snow.elevation} m)` : "Schnee"} value={r.snow ? `${r.snow.cm} cm${r.snow.fresh ? `, +${r.snow.fresh} neu` : ""}` : "keine Messung"} />
            <Fact icon={<Mountain size={16} aria-hidden />} label="Höhe" value={r.altitude?.top ? `${r.altitude.base ? `${r.altitude.base}–` : "bis "}${r.altitude.top} m` : "–"} />
            <Fact icon={<Ticket size={16} aria-hidden />} label={r.ticket?.unit ?? "Tageskarte"} value={r.ticket ? `ab CHF ${r.ticket.from}` : "–"} />
            {r.season && <Fact label="Saison" value={r.season} />}
            {r.pistes?.count ? <Fact label="Abfahrten" value={`${r.pistes.count}`} /> : null}
          </dl>
          <p className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-cream-dim">
            {r.family && <span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2.5 py-1"><Users size={12} aria-hidden /> Kinderland</span>}
            {r.snowpark && <span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2.5 py-1"><Sparkles size={12} aria-hidden /> Snowpark</span>}
            {r.nightSkiing && <Link href="/nachtskifahren" className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2.5 py-1 hover:text-cream"><Moon size={12} aria-hidden /> Nachtskifahren – Termine</Link>}
          </p>
          {r.url && (
            <a href={r.url} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-signal-600 hover:text-signal-500"><ExternalLink size={14} aria-hidden /> Offizielle Website & Pistenbericht</a>
          )}
        </section>

        <div className="space-y-6">
          <section className="card p-5 sm:p-6" aria-labelledby="anreise">
            <h2 id="anreise" className="kicker mb-4">Dein Skitag in 30 Sekunden</h2>
            <SkiTravel to={r.coords} station={r.station} name={r.name} hotelPlace={hotelPlace} ticket={r.ticket} ticketUrl={r.url} shops={shops} food={foodOpen} weather={weather?.top} />
            {r.access && <p className="mt-4 text-xs text-cream-faint">{r.access}</p>}
          </section>
        </div>
      </div>

      {nights.length > 0 && (
        <section className="card mt-6 p-5 sm:p-6" aria-labelledby="nacht">
          <h2 id="nacht" className="kicker mb-3 flex items-center gap-2"><Moon size={14} aria-hidden /> Nachtskifahren & Nachtschlitteln</h2>
          <ul className="space-y-3">
            {nights.map((o) => (
              <li key={o.id} className="text-sm">
                <p className="font-bold text-cream"><Link href={`/nachtskifahren/${o.id}`} className="hover:underline">{o.weekdays.length ? o.weekdays.map((w) => WD_LONG[w]).join(", ") : "an Einzeldaten"} · {timeText(o)}{o.ticket ? ` · CHF ${o.ticket.price}` : ""}</Link></p>
                <p className="text-cream-dim">{o.name} – {o.piste}. {o.season.text}</p>
              </li>
            ))}
          </ul>
          <Link href="/nachtskifahren" className="mt-3 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">Nachtski-Kalender der ganzen Schweiz</Link>
        </section>
      )}

      {weather && (
        <section className="card mt-6 p-5 sm:p-6" aria-labelledby="wetter">
          <h2 id="wetter" className="kicker mb-3">Bergwetter {r.name}</h2>
          <MountainWeatherTable w={weather} />
        </section>
      )}

      {groups.length > 0 && (
        <section className="card mt-6 p-5 sm:p-6" aria-labelledby="live">
          <h2 id="live" className="kicker mb-4">Live von der Bergbahn: Anlagen, Pisten, Hütten{parking ? ", Parkplätze" : ""}</h2>
          <SkiLiveBoard groups={groups} at={detail?.at} stale={isStale(detail?.at)} />
        </section>
      )}

      {shops.length > 0 && (
        <section className="card mt-6 p-5 sm:p-6" aria-labelledby="miete">
          <h2 id="miete" className="kicker mb-1">Ski mieten & abholen in {r.station.split(/[,(]/)[0].trim()}</h2>
          <p className="mb-4 text-sm text-cream-dim">Sportgeschäfte im Umkreis von 3,5 km um die Talstation. Online reserviert ist die Ausrüstung meist günstiger und liegt beim Abholen bereit.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {shops.map((s) => (
              <li key={s.name + s.lat} className="rounded-xl bg-ink-800/60 p-4 text-sm">
                <p className="font-bold text-cream">{s.name}</p>
                <p className="mt-0.5 text-xs text-cream-faint">{s.rental ? "Vermietung" : "Sportgeschäft"} · {s.km < 0.3 ? "bei der Talstation" : `${String(s.km).replace(".", ",")} km`}</p>
                {s.hours && s.hours.length < 70 && <p className="mt-1 text-xs text-cream-dim">{s.hours.replace(/"/g, "")}</p>}
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-semibold">
                  {s.book && <a href={s.book} target="_blank" rel="noopener sponsored" className="text-signal-600 hover:text-signal-500">Online reservieren</a>}
                  {s.website && <a href={s.website} target="_blank" rel="noopener" className="text-signal-600 hover:text-signal-500">Website</a>}
                  <a href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`} target="_blank" rel="noopener" className="text-cream-dim hover:text-cream">Karte</a>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Shops aus OpenStreetMap – Öffnungszeiten können in der Saison abweichen.</p>
        </section>
      )}

      <section className="mt-6" aria-labelledby="plan">
        <h2 id="plan" className="kicker mb-3">Pistenplan{openNames.length + closedNames.length ? " mit Live-Status" : ""}</h2>
        <PisteMap center={r.coords} open={openNames} closed={closedNames} />
      </section>

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

      {nearby.length > 0 && (
        <section className="mt-14" aria-labelledby="umgebung">
          <h2 id="umgebung" className="font-display text-2xl font-extrabold tracking-tight text-cream">Nach dem Skifahren – in der Nähe</h2>
          <div className="mt-4"><PlaceGrid places={nearby} /></div>
          {region && <Link href={`/ausflugsziele/${region.slug}`} className="mt-4 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">Alle Ausflugsziele {region.name}</Link>}
        </section>
      )}

      <section className="mt-14" aria-labelledby="andere">
        <h2 id="andere" className="font-display text-2xl font-extrabold tracking-tight text-cream">Skigebiete in der Nähe</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {near.map(({ x, d }) => (
            <li key={x.id}>
              <Link href={`/skigebiete/${x.id}`} className="card block h-full p-4 transition hover:border-cream/30">
                <span className="block font-display font-extrabold text-cream">{x.name}</span>
                <span className="mt-1 block text-sm text-cream-dim">{Math.round(d)} km entfernt{x.pistes?.total ? ` · ${Math.round(x.pistes.total)} km Pisten` : ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Schnee: SLF-Messnetz IMIS (CC BY 4.0).{LIVE_ON && " Pisten- und Anlagenstatus: LiftRadar (liftradar.eu), aus den Berichten der Bergbahnen."} Pisten-km und Preise laut Bergbahn, ohne Gewähr – vor der Abfahrt den offiziellen Pistenbericht prüfen. Autozeit grob geschätzt.
      </p>
    </div>
  );
}

function Fact({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold text-cream-faint">{icon} {label}</dt>
      <dd className="mt-0.5 font-bold text-cream">{value}</dd>
    </div>
  );
}
