import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, ExternalLink, MapPin, Moon, Route, Snowflake, Ticket } from "lucide-react";
import { getOffer, litFor, nearOffers, nightForecast, offers, verdict, type NightForecast } from "@/lib/nachtski";
import { WD, WD_LONG, dateLong, fullMoons, isoDay, moon, seasonNights, timeText } from "@/lib/nachtski-core";
import { getSkiArea } from "@/lib/ski";
import { getNightImage } from "@/data/images";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import NightMap from "@/components/NightMap";
import NightTrip from "@/components/NightTrip";
import Brotkrumen from "@/components/Brotkrumen";

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => offers.map((o) => ({ id: o.id }));

type Props = { params: Promise<{ id: string }> };

const BYDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => `https://schema.org/${d}`);
const kmText = (n: number) => `${String(n).replace(".", ",")} km`;
const days = (wd: number[]) => (wd.length ? wd.map((w) => WD_LONG[w]).join(wd.length === 2 ? " und " : ", ") : "");
const hour = (t: string) => (t.endsWith(":00") ? `${Number(t.slice(0, 2))} Uhr` : `${t} Uhr`);

function answer(o: NonNullable<ReturnType<typeof getOffer>>, next?: string) {
  const what = o.type === "ski" ? "Nachtskifahren" : "Nachtschlitteln";
  const when = o.weekdays.length ? `jeden ${days(o.weekdays)}` : o.events.length ? `an ${o.events.length} Spezialabenden` : "an ausgewählten Abenden";
  const time = o.to ? `von ${hour(o.from)} bis ${hour(o.to)}` : `ab ${hour(o.from)}`;
  const price = o.ticket?.price ? ` Die ${o.ticket.unit} kostet CHF ${o.ticket.price}.` : o.ticket?.price === 0 ? " Gratis." : "";
  return `${what} in ${o.place}: ${when} ${time} – ${o.piste.replace(/\.$/, "")}.${price}${next ? ` Nächster Abend: ${dateLong(next)}.` : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = getOffer((await params).id);
  if (!o) return {};
  const what = o.type === "ski" ? "Nachtskifahren" : "Nachtschlitteln";
  const title = `${what} ${o.place} 2026/27: alle Termine, Preis, Pistenplan`;
  const desc = `${answer(o)} Mit Nacht-Pistenplan, Wetter für die nächsten Abende, Vollmond und dem letzten Zug nach Hause.`.slice(0, 300);
  const img = getNightImage(o.id, o.image);
  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: `/nachtskifahren/${o.id}` },
    ...socialMeta({ title, description: desc, path: `/nachtskifahren/${o.id}`, image: img }),
  };
}

function Fact({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-ink-800/60 p-4">
      <p className="flex items-center gap-2 text-xs font-bold text-cream-faint"><Icon size={14} aria-hidden /> {label}</p>
      <p className="mt-1.5 text-base font-bold leading-snug text-cream">{children}</p>
    </div>
  );
}

const TONE = { good: "text-emerald-400", mid: "text-cream", bad: "text-signal-400" };

export default async function NightOfferPage({ params }: Props) {
  const o = getOffer((await params).id);
  if (!o) notFound();

  const today = isoDay(new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Zurich" })));
  const nights = seasonNights(o, today);
  const next = nights[0];
  const lastNight = nights.at(-1)?.date ?? today;
  const moons = new Set(fullMoons(today, lastNight));
  const lit = litFor(o.id);
  const area = o.skiAreaId ? getSkiArea(o.skiAreaId) : undefined;
  const img = getNightImage(o.id, o.image);
  const near = nearOffers(o);
  let fc: NightForecast[] = [];
  try {
    fc = await nightForecast(o);
  } catch {
    fc = [];
  }
  const nightSet = new Map(nights.map((n) => [n.date, n]));
  const soon = fc.filter((f) => nightSet.has(f.date));
  const moonNights = nights.filter((n) => moons.has(n.date) || [-1, 1].some((k) => { const d = new Date(`${n.date}T12:00:00`); d.setDate(d.getDate() + k); return moons.has(isoDay(d)); }));

  const months = new Map<string, typeof nights>();
  for (const n of nights) {
    const k = n.date.slice(0, 7);
    months.set(k, [...(months.get(k) ?? []), n]);
  }

  const what = o.type === "ski" ? "Nachtskifahren" : "Nachtschlitteln";
  const lenKm = o.km ?? (lit && lit.km >= 0.5 ? lit.km : null);
  const faq = [
    { q: `Wann ist ${what} in ${o.place}?`, a: `${o.weekdays.length ? `Jeden ${days(o.weekdays)}` : "An ausgewählten Abenden"}, ${timeText(o)} Uhr. ${o.season.text.replace(/[^.!?]$/, "$&.")}${next ? ` Der nächste Abend ist ${dateLong(next.date)}${next.status === "voraussichtlich" ? " (voraussichtlich)" : ""}.` : ""}` },
    { q: `Was kostet ${what} in ${o.place}?`, a: o.ticket ? (o.ticket.price ? `CHF ${o.ticket.price} (${o.ticket.unit}).${o.ticket.note ? ` ${o.ticket.note}.` : ""}` : `Gratis. ${o.ticket.note ?? ""}`.trim()) : "Den Preis publiziert die Bergbahn auf ihrer Website; meist kosten Abendkarten CHF 15–35." },
    lenKm ? { q: `Wie lang ist die beleuchtete Piste?`, a: `${o.km ? "Rund" : "Laut OpenStreetMap rund"} ${kmText(lenKm)}: ${o.piste}` } : { q: "Welche Piste ist beleuchtet?", a: o.piste },
    { q: `Wie komme ich nach dem ${what} mit dem Zug zurück?`, a: `Treffpunkt ist ${o.station}. Gib oben deinen Wohnort ein: Wir zeigen die erste Verbindung nach Pistenschluss${o.to ? ` (${hour(o.to)})` : ""} und warnen, wenn du erst nach Mitternacht heimkommst.` },
    { q: "Findet es bei schlechtem Wetter statt?", a: "Nur bei genügend Schnee und fahrbarem Wetter. Bei Sturm, Regen oder Schneemangel sagt die Bergbahn kurzfristig ab – am Abend selbst ihre Website prüfen." },
  ];

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Nachtskifahren", path: "/nachtskifahren" }, { name: o.name, path: `/nachtskifahren/${o.id}` }]),
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `${o.name} – ${what} ${o.place}`,
      description: o.text,
      url: `${SITE_URL}/nachtskifahren/${o.id}`,
      ...(img ? { image: `${SITE_URL}${img.url}` } : {}),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      startDate: `${next?.date ?? o.season.from ?? today}T${o.from}`,
      ...(o.season.to ? { endDate: `${o.season.to}T${o.to || "22:00"}` } : {}),
      ...(o.weekdays.length
        ? { eventSchedule: { "@type": "Schedule", byDay: o.weekdays.map((w) => BYDAY[w]), startTime: o.from, ...(o.to ? { endTime: o.to } : {}), repeatFrequency: "P1W", scheduleTimezone: "Europe/Zurich", ...(o.season.from ? { startDate: o.season.from } : {}), ...(o.season.to ? { endDate: o.season.to } : {}) } }
        : {}),
      location: {
        "@type": "SportsActivityLocation",
        name: o.station,
        address: { "@type": "PostalAddress", addressLocality: o.place, addressRegion: o.canton, addressCountry: "CH" },
        geo: { "@type": "GeoCoordinates", latitude: o.coords.lat, longitude: o.coords.lng },
      },
      ...(o.ticket ? { offers: { "@type": "Offer", price: o.ticket.price, priceCurrency: "CHF", url: o.url, availability: "https://schema.org/InStock" }, isAccessibleForFree: o.ticket.price === 0 } : {}),
      organizer: { "@type": "Organization", name: o.place, url: o.url },
      ...(o.events.length ? { subEvent: o.events.map((e) => ({ "@type": "Event", name: e.title, startDate: `${e.date}T${o.from}`, location: { "@type": "Place", name: o.station } })) } : {}),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="container-page py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Brotkrumen items={[{ label: "Nachtskifahren", href: "/nachtskifahren" }, { label: o.name }]} />
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">{o.name}</h1>
      <p className="mt-2 font-semibold text-cream-dim">{what} in {o.place} ({o.canton})</p>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream-dim">{answer(o, next?.date)}</p>

      {img && (
        <figure className="mt-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.url} srcSet={`${img.small} 480w, ${img.url} 1200w`} sizes="(min-width: 1024px) 1100px, 100vw" width={img.width} height={img.height} alt={img.alt} className="aspect-[21/9] w-full rounded-2xl object-cover" fetchPriority="high" />
          <figcaption className="mt-1.5 text-right text-xs text-cream-faint"><a href={img.credit} target="_blank" rel="noopener" className="hover:underline">Foto: Wikimedia Commons</a></figcaption>
        </figure>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Fact icon={CalendarDays} label="Wann">{o.weekdays.length ? o.weekdays.map((w) => WD[w]).join(", ") : o.events.length ? `${o.events.length} Spezialabende` : "ausgewählte Abende"}</Fact>
        <Fact icon={Clock} label="Zeit">{timeText(o)} Uhr</Fact>
        <Fact icon={Route} label="Beleuchtet">{lenKm ? `${o.km ? "" : "ca. "}${kmText(lenKm)}` : o.type === "ski" ? "Piste" : "Schlittelweg"}</Fact>
        <Fact icon={Ticket} label="Abendkarte">{o.ticket ? (o.ticket.price ? `CHF ${o.ticket.price}` : "gratis") : "siehe Bergbahn"}</Fact>
        <Fact icon={MapPin} label="Treffpunkt">{o.station}</Fact>
      </div>

      {soon.length > 0 && (
        <section className="mt-14" aria-labelledby="h-soon">
          <h2 id="h-soon" className="headline text-2xl text-cream sm:text-3xl">Lohnt sich der nächste Abend?</h2>
          <p className="mt-2 text-sm text-cream-dim">Wetter am Treffpunkt während der Betriebszeit, Mond am Himmel und Sonnenuntergang.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {soon.map((f) => {
              const v = verdict(f);
              const m = moon(f.date);
              const n = nightSet.get(f.date)!;
              return (
                <li key={f.date} className="card p-5">
                  <p className="text-sm font-bold text-cream-dim">{f.date === today ? "Heute Abend" : dateLong(f.date)}{n.status === "voraussichtlich" ? " · voraussichtlich" : ""}</p>
                  {n.event && <p className="mt-1 text-sm font-bold text-signal-400">{n.event}</p>}
                  <p className={`mt-2 font-display text-xl font-extrabold leading-tight ${TONE[v.tone]}`}>{v.text}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-cream-dim">
                    <dt>Temperatur</dt><dd className="text-cream">{f.temp} °C</dd>
                    <dt>Wolken</dt><dd className="text-cream">{f.cloud} %</dd>
                    {f.snow > 0 && (<><dt>Neuschnee</dt><dd className="text-cream">{String(f.snow).replace(".", ",")} cm</dd></>)}
                    <dt>Wind</dt><dd className="text-cream">{f.wind} km/h</dd>
                    <dt>Mond</dt><dd className="text-cream">{m.name} ({Math.round(m.illum * 100)} %)</dd>
                    <dt>Sonnenuntergang</dt><dd className="text-cream">{f.sunset}</dd>
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-14" aria-labelledby="h-plan">
        <h2 id="h-plan" className="headline text-2xl text-cream sm:text-3xl">Nacht-Pistenplan</h2>
        <p className="mt-2 max-w-2xl text-sm text-cream-dim">{o.piste}</p>
        <div className="mt-5">
          <NightMap center={o.coords} lit={lit} label={o.station} />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="h-trip">
        <h2 id="h-trip" className="headline text-2xl text-cream sm:text-3xl">Hin – und vor allem wieder heim</h2>
        <p className="mt-2 max-w-2xl text-sm text-cream-dim">Beim Nachtskifahren entscheidet der Rückweg. Wir suchen die erste Verbindung nach Pistenschluss.</p>
        <div className="mt-5">
          <NightTrip station={o.oev ?? o.station} to={o.coords} from={o.from} end={o.to} nights={nights.slice(0, 16).map((n) => ({ date: n.date, label: `${dateLong(n.date)}${n.status === "voraussichtlich" ? " (vorauss.)" : ""}` }))} />
        </div>
      </section>

      <section className="mt-14" aria-labelledby="h-season">
        <h2 id="h-season" className="headline text-2xl text-cream sm:text-3xl">Alle Abende dieser Saison</h2>
        <p className="mt-2 max-w-2xl text-sm text-cream-dim">{o.season.text}</p>
        {nights.length ? (
          <>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...months].map(([m, list]) => (
                <div key={m}>
                  <h3 className="text-sm font-bold text-cream">{new Date(`${m}-15T12:00:00`).toLocaleDateString("de-CH", { month: "long", year: "numeric" })}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {list.map((n) => {
                      const full = moons.has(n.date);
                      return (
                        <li key={n.date} title={[dateLong(n.date), n.event, full && "Vollmond", n.status === "voraussichtlich" && "voraussichtlich"].filter(Boolean).join(" · ")} className={`inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2.5 text-sm font-semibold ${n.event ? "bg-signal-500 text-white" : n.status === "fix" ? "bg-ink-700 text-cream" : "border border-dashed border-cream/25 text-cream-dim"}`}>
                          {WD[new Date(`${n.date}T12:00:00`).getDay()]} {Number(n.date.slice(8))}.
                          {full && <Moon size={13} aria-label="Vollmond" className="text-amber-300" />}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded bg-ink-700" /> bestätigt</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded border border-dashed border-cream/40" /> voraussichtlich (Saisondaten noch nicht publiziert)</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-4 rounded bg-signal-500" /> Spezialabend</span>
              <span className="inline-flex items-center gap-1.5"><Moon size={12} className="text-amber-300" aria-hidden /> Vollmond</span>
            </p>
            {moonNights.length > 0 && (
              <p className="mt-4 max-w-2xl text-sm text-cream-dim">
                <strong className="text-cream">Vollmond-Tipp:</strong> {moonNights.slice(0, 4).map((n) => dateLong(n.date)).join(", ")} – dann siehst du neben der Piste auch die Berge.
              </p>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm text-cream-dim">Für diese Saison sind keine weiteren Abende bekannt.</p>
        )}
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2" aria-label="Gut zu wissen">
        <div className="card p-6">
          <h2 className="font-display text-xl font-extrabold text-cream">Gut zu wissen</h2>
          <p className="mt-3 text-cream-dim">{o.text}</p>
          {o.ticket?.note && <p className="mt-3 text-sm text-cream-dim"><strong className="text-cream">Ticket:</strong> {o.ticket.note}</p>}
          {o.extras.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-cream-dim">
              {o.extras.map((x) => (
                <li key={x} className="flex gap-2"><Snowflake size={14} className="mt-0.5 shrink-0 text-signal-400" aria-hidden /> {x}</li>
              ))}
            </ul>
          )}
          <a href={o.url} target="_blank" rel="noopener" className="btn-primary mt-5 inline-flex items-center gap-2">Zur Bergbahn <ExternalLink size={15} aria-hidden /></a>
        </div>
        {area && (
          <div className="card p-6">
            <h2 className="font-display text-xl font-extrabold text-cream">Tagsüber: {area.name}</h2>
            <p className="mt-3 text-cream-dim">Pisten- und Liftstatus live, Bergwetter, Hütten und Parkplätze fürs ganze Skigebiet.</p>
            <Link href={`/skigebiete/${area.id}`} className="mt-5 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">Skigebiet {area.name} live →</Link>
          </div>
        )}
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="h-faq">
        <h2 id="h-faq" className="headline text-2xl text-cream sm:text-3xl">Häufige Fragen</h2>
        <dl className="mt-5 divide-y divide-cream/10">
          {faq.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-bold text-cream">{f.q}</dt>
              <dd className="mt-1.5 text-cream-dim">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14" aria-labelledby="h-near">
        <h2 id="h-near" className="headline text-2xl text-cream sm:text-3xl">Nachtski in der Nähe</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {near.map(({ o: x, d }) => (
            <li key={x.id}>
              <Link href={`/nachtskifahren/${x.id}`} className="card group block h-full p-4 hover:border-cream/30">
                <span className="block font-display font-extrabold text-cream group-hover:underline">{x.name}</span>
                <span className="mt-1 block text-sm text-cream-dim">{x.weekdays.map((w) => WD[w]).join(", ") || "Spezialabende"} · {timeText(x)} · {Math.round(d)} km</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Angaben laut <a href={o.source} target="_blank" rel="noopener" className="underline">Bergbahn</a>, geprüft am {new Date(o.checked).toLocaleDateString("de-CH")}{o.confidence === "mittel" ? " – Daten der Vorsaison, für 2026/27 noch nicht bestätigt" : ""}. Beleuchtete Pisten auf der Karte aus OpenStreetMap, Wetter von Open-Meteo, Fahrplan von opentransportdata.swiss.
      </p>
    </div>
  );
}
