import type { Metadata } from "next";
import Link from "next/link";
import { markets, openOn, todayZurich, spanText, KIND_LABEL } from "@/lib/maerkte";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import MarktFinder from "@/components/MarktFinder";

export const revalidate = 3600;

const TITLE = "Weihnachtsmärkte Schweiz 2026: alle Daten, Öffnungszeiten, Karte";
const desc = () => `${markets().length} Weihnachtsmärkte, Adventsmärkte und Lichter-Events in der Schweiz 2026 – welcher heute offen hat, Daten und Zeiten aus offiziellen Quellen, mit Zug ab deinem Ort und Heimweg nach Marktschluss.`;

export function generateMetadata(): Metadata {
  const description = desc();
  return { title: { absolute: TITLE }, description, alternates: { canonical: "/weihnachtsmaerkte" }, ...socialMeta({ title: TITLE, description, path: "/weihnachtsmaerkte" }) };
}

const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} und ${a[a.length - 1]}` : a[0] ?? "");

export default function Page() {
  const today = todayZurich();
  const all = markets();
  const upcoming = all.filter((m) => m.to >= today);
  const openToday = upcoming.filter((m) => openOn(m, today));
  const big = upcoming.filter((m) => m.size === "gross");
  const first = [...upcoming].sort((a, b) => a.from.localeCompare(b.from)).find((m) => m.from > today);
  const longest = [...upcoming].filter((m) => !m.dates).sort((a, b) => b.to.localeCompare(a.to))[0];
  const ships = upcoming.filter((m) => m.kind === "schiff");
  const castle = upcoming.filter((m) => /schloss|burg|château|castello/i.test(m.name));

  const faq = [
    { q: "Wann beginnen die Weihnachtsmärkte 2026 in der Schweiz?", a: `Die ersten öffnen Mitte bis Ende November${first ? `, z. B. ${first.name} in ${first.place} ab ${new Date(first.from + "T12:00:00Z").toLocaleDateString("de-CH", { day: "numeric", month: "long", timeZone: "UTC" })}` : ""}. Die meisten grossen Märkte laufen bis zum 23. Dezember.` },
    { q: "Welches sind die grössten Weihnachtsmärkte der Schweiz?", a: `Zu den grössten zählen ${list(big.slice(0, 6).map((m) => `${m.name} (${m.place})`))}.` },
    longest && { q: "Welcher Weihnachtsmarkt hat am längsten offen?", a: `${longest.name} in ${longest.place} läuft bis ${new Date(longest.to + "T12:00:00Z").toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}.` },
    ships.length > 0 && { q: "Gibt es Weihnachtsschiffe in der Schweiz?", a: `Ja: ${list(ships.map((m) => `${m.name} (${spanText(m)})`))}.` },
    castle.length > 0 && { q: "Wo gibt es Weihnachtsmärkte in Schlössern und Burgen?", a: `Zum Beispiel ${list(castle.slice(0, 5).map((m) => `${m.name} in ${m.place}`))}.` },
  ].filter(Boolean) as { q: string; a: string }[];

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflugsziele nach Rubrik", path: "/rubriken" }, { name: "Weihnachtsmärkte", path: "/weihnachtsmaerkte" }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Weihnachtsmärkte Schweiz 2026",
      itemListElement: upcoming.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Event",
          name: m.name,
          description: m.text,
          url: `${SITE_URL}/weihnachtsmaerkte/${m.id}`,
          startDate: `${m.from}${m.open ? `T${m.open.from}` : ""}`,
          endDate: `${m.to}${m.open ? `T${m.open.to}` : ""}`,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: m.place, address: { "@type": "PostalAddress", streetAddress: m.address, addressLocality: m.place, addressRegion: m.canton, addressCountry: "CH" }, geo: { "@type": "GeoCoordinates", latitude: m.coords.lat, longitude: m.coords.lng } },
          ...(m.free ? { isAccessibleForFree: true } : {}),
        },
      })),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="headline max-w-4xl text-4xl text-cream sm:text-6xl">Weihnachtsmärkte in der Schweiz 2026</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {upcoming.length} Märkte, Lichter-Events und Weihnachtsschiffe mit Daten und Zeiten aus den offiziellen Quellen.
        {openToday.length ? ` Heute offen: ${openToday.length}.` : first ? ` Der nächste beginnt am ${new Date(first.from + "T12:00:00Z").toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })}: ${first.name}.` : ""}
        {" "}Wähl deinen Ort – wir zeigen die nächsten und den letzten Zug nach Hause.
      </p>
      <div className="mt-10">
        <MarktFinder markets={all} today={today} />
      </div>

      <section className="mt-16 max-w-3xl">
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
      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Daten und Öffnungszeiten von den Websites der Märkte, Städte und Tourismusorganisationen, geprüft am 16.11.2026; Quelle auf jeder Marktseite. Arten: {Object.values(KIND_LABEL).join(", ")}. Kurzfristige Änderungen (Wetter, Sturm) meldet nur der Veranstalter. Mehr für den Winter: <Link href="/schlitteln" className="underline">Schlittelwege</Link> · <Link href="/nachtskifahren" className="underline">Nachtskifahren</Link>.
      </p>
    </div>
  );
}
