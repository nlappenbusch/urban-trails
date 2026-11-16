import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, ExternalLink, MapPin, Store, TrainFront } from "lucide-react";
import { KIND_LABEL, dateLong, daysText, getMarkt, markets, nearMarkets, nextOpen, openDays, openOn, spanText, todayZurich, type Markt } from "@/lib/maerkte";
import { RUBRIKEN, rubrikItems } from "@/lib/rubriken";
import { crowKm } from "@/lib/ski-core";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import NightTrip from "@/components/NightTrip";
import PointsMap from "@/components/PointsMap";

export const revalidate = 3600;
export const dynamicParams = true;
export const generateStaticParams = () => markets().map((m) => ({ id: m.id }));

type Props = { params: Promise<{ id: string }> };
const BYDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => `https://schema.org/${d}`);
const dm = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-CH", { day: "numeric", month: "long", timeZone: "UTC" });

function answer(m: Markt) {
  const span = m.from === m.to ? `am ${dm(m.from)}` : m.dates?.length && m.dates.length <= 4 ? `am ${m.dates.map(dm).join(", ")}` : `vom ${dm(m.from)} bis ${dm(m.to)} 2026`;
  const days = daysText(m);
  return `${m.name} in ${m.place}: ${span}${days && days !== "täglich" ? ` (${days})` : days === "täglich" ? ", täglich" : ""}${m.hours ? `, ${m.hours.replace(/\.$/, "")}` : ""}.${m.stands ? ` Rund ${m.stands} Stände.` : ""}${m.free ? " Eintritt frei." : m.price ? ` Eintritt ${m.price}.` : ""}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = getMarkt((await params).id);
  if (!m) return {};
  const title = `${m.name} ${m.place} 2026: Daten, Öffnungszeiten, Anreise`;
  const description = `${answer(m)} Mit Anreise per Zug und letztem Zug nach Hause.`.slice(0, 300);
  return { title: { absolute: title }, description, alternates: { canonical: `/weihnachtsmaerkte/${m.id}` }, ...socialMeta({ title, description, path: `/weihnachtsmaerkte/${m.id}` }) };
}

export default async function Page({ params }: Props) {
  const m = getMarkt((await params).id);
  if (!m) notFound();
  const today = todayZurich();
  const days = openDays(m);
  const upcoming = days.filter((d) => d >= today);
  const next = nextOpen(m, today);
  const isToday = openOn(m, today);
  const near = nearMarkets(m, 4);
  const around = rubrikItems().filter((i) => ["burgen-schloesser", "museen", "aussichtstuerme", "wasserfaelle", "tierparks"].includes(i.r) && i.q >= 6).map((i) => ({ i, d: crowKm(m.coords, i) })).filter((x) => x.d < 12).sort((a, b) => a.d - b.d).slice(0, 4);
  const arrive = m.open ? (m.open.from >= "16:00" ? m.open.from : m.open.to >= "19:00" ? "17:00" : m.open.from) : "16:00";
  const byMonth = upcoming.reduce<Record<string, string[]>>((acc, d) => ((acc[d.slice(0, 7)] ??= []).push(d), acc), {});

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Weihnachtsmärkte", path: "/weihnachtsmaerkte" }, { name: m.name, path: `/weihnachtsmaerkte/${m.id}` }]),
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: m.name,
      description: `${m.text}${m.wow ? ` ${m.wow}` : ""}`,
      url: `${SITE_URL}/weihnachtsmaerkte/${m.id}`,
      startDate: `${m.from}${m.open ? `T${m.open.from}` : ""}`,
      endDate: `${m.to}${m.open ? `T${m.open.to}` : ""}`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      ...(m.days?.length && !m.dates ? { eventSchedule: { "@type": "Schedule", byDay: m.days.map((w) => BYDAY[w]), startDate: m.from, endDate: m.to, repeatFrequency: "P1W", scheduleTimezone: "Europe/Zurich", ...(m.open ? { startTime: m.open.from, endTime: m.open.to } : {}) } } : {}),
      location: { "@type": "Place", name: m.address ?? m.place, address: { "@type": "PostalAddress", streetAddress: m.address, addressLocality: m.place, addressRegion: m.canton, addressCountry: "CH" }, geo: { "@type": "GeoCoordinates", latitude: m.coords.lat, longitude: m.coords.lng } },
      ...(m.free ? { isAccessibleForFree: true } : {}),
      ...(m.url ? { organizer: { "@type": "Organization", name: m.name, url: m.url } } : {}),
    },
  ];

  const facts: [typeof CalendarDays, string, string][] = [
    [CalendarDays, "Wann", `${spanText(m)}${daysText(m) ? ` · ${daysText(m)}` : ""}`],
    [Clock, "Zeiten", m.hours ?? "laut Veranstalter"],
    [Store, "Grösse", m.stands ? `ca. ${m.stands} Stände${m.indoor ? ", drinnen" : ""}` : m.size === "gross" ? "gross" : m.size === "mittel" ? "mittelgross" : "klein, familiär"],
    [TrainFront, "Haltestelle", m.oev ?? m.place],
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/weihnachtsmaerkte" className="inline-flex items-center gap-1 text-sm font-semibold text-cream-dim hover:text-cream"><ArrowLeft size={15} aria-hidden /> Alle Weihnachtsmärkte</Link>
      <p className="kicker mt-6">{KIND_LABEL[m.kind]} · {m.place} ({m.canton})</p>
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">{m.name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">{answer(m)}</p>
      <p className="mt-3 text-base font-bold">
        {isToday ? <span className="text-emerald-700">Heute offen{m.open ? `, ${m.open.from}–${m.open.to} Uhr` : ""}</span> : next ? <span className="text-cream">Nächster Tag: {dateLong(next)}</span> : <span className="text-cream-faint">Für 2026 vorbei</span>}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map(([Icon, k, v]) => (
          <div key={k} className="rounded-xl bg-ink-800/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-cream-faint"><Icon size={14} aria-hidden /> {k}</p>
            <p className="mt-1 text-sm font-semibold text-cream">{v}</p>
          </div>
        ))}
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Was dich erwartet</h2>
          {m.wow && <p className="mt-3 text-lg font-semibold leading-relaxed text-cream">{m.wow}</p>}
          <p className="mt-3 leading-relaxed text-cream-dim">{m.text}</p>
          {m.tip && <p className="mt-4 rounded-xl border border-signal-500/30 bg-signal-500/10 p-4 text-sm text-cream"><strong>Tipp:</strong> {m.tip}</p>}
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
            {m.url && <a href={m.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><ExternalLink size={14} aria-hidden /> Offizielle Seite</a>}
            <a href={`https://www.google.com/maps/search/?api=1&query=${m.coords.lat},${m.coords.lng}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><MapPin size={14} aria-hidden /> {m.address ?? "Karte"}</a>
          </p>
        </div>
        <PointsMap points={[{ id: m.id, name: m.name, lat: m.coords.lat, lng: m.coords.lng, sub: m.address }, ...near.map(({ x }) => ({ id: x.id, name: x.name, lat: x.coords.lat, lng: x.coords.lng, sub: `${x.place} · ${spanText(x)}`, href: `/weihnachtsmaerkte/${x.id}` }))]} color="#dc2626" height={340} />
      </section>

      {upcoming.length > 1 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Alle offenen Tage</h2>
          {Object.entries(byMonth).map(([mon, ds]) => (
            <div key={mon} className="mt-4">
              <p className="text-sm font-bold text-cream-faint">{new Date(`${mon}-15T12:00:00Z`).toLocaleDateString("de-CH", { month: "long", year: "numeric", timeZone: "UTC" })}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {ds.map((d) => (
                  <li key={d} className={`rounded-lg px-2.5 py-1.5 text-sm tabular-nums ${d === today ? "bg-emerald-600 text-white" : new Date(`${d}T12:00:00Z`).getUTCDay() % 6 === 0 ? "bg-signal-500/15 font-semibold text-cream" : "bg-ink-800/60 text-cream-dim"}`}>
                    {new Date(`${d}T12:00:00Z`).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", timeZone: "UTC" })}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {upcoming.length > 0 && m.oev && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Hin & heim mit dem Zug</h2>
          <p className="mt-2 max-w-2xl text-cream-dim">Ankunft gegen {arrive} Uhr, wenn die Lichter brennen – und welcher Zug dich nach Marktschluss{m.open ? ` (${m.open.to} Uhr)` : ""} noch heimbringt.</p>
          <div className="mt-5">
            <NightTrip
              station={m.oev}
              to={m.coords}
              from={arrive}
              end={m.open?.to ?? "20:00"}
              backAfter={0}
              arriveBefore={0}
              nights={upcoming.slice(0, 40).map((d) => ({ date: d, label: dateLong(d) }))}
              endLabel="Marktschluss"
              dayLabel="Welcher Tag?"
              intro="Gib deinen Wohnort ein – wir zeigen die Züge hin und den Heimweg nach Marktschluss."
              carNote="In Altstädten sind Parkplätze im Advent knapp – Parkhaus am Rand nehmen."
            />
          </div>
        </section>
      )}

      {near.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Weitere Märkte in der Nähe</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {near.map(({ x, d }) => (
              <li key={x.id} className="card p-4">
                <p className="text-xs font-semibold text-cream-faint">{x.place} · {Math.round(d)} km</p>
                <Link href={`/weihnachtsmaerkte/${x.id}`} className="mt-0.5 block font-display font-extrabold leading-tight text-cream hover:underline">{x.name}</Link>
                <p className="mt-1 text-xs text-cream-dim">{spanText(x)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {around.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Davor oder danach</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {around.map(({ i, d }) => (
              <li key={i.id} className="card p-4">
                <p className="text-xs font-semibold text-cream-faint">{RUBRIKEN.find((r) => r.slug === i.r)?.one} · {d < 10 ? d.toFixed(1).replace(".", ",") : Math.round(d)} km</p>
                <Link href={`/rubriken/${i.r}#${i.id}`} className="mt-0.5 block font-display font-extrabold leading-tight text-cream hover:underline">{i.name}</Link>
                {i.text && <p className="mt-1 line-clamp-2 text-xs text-cream-dim">{i.text}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Daten laut {m.source ? <a href={m.source} target="_blank" rel="noopener" className="underline">offizieller Quelle</a> : "Veranstalter"}, geprüft am {new Date(m.checked).toLocaleDateString("de-CH")}. Bei Sturm oder Schnee kann der Markt kurzfristig schliessen – am Tag selbst die Seite des Veranstalters prüfen.
      </p>
    </div>
  );
}
