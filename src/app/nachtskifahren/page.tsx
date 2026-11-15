import type { Metadata } from "next";
import Link from "next/link";
import data from "@/data/nachtski.json";
import { WD_LONG, isoDay, nightStatus, type NightOffer } from "@/lib/nachtski-core";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import NightCalendar from "@/components/NightCalendar";

export const revalidate = 3600;

const offers = data as NightOffer[];
const TITLE = "Nachtskifahren Schweiz 2026/27: Wann und wo – der Kalender";
const DESC = `Alle ${offers.length} Nachtski- und Nachtschlittel-Angebote der Schweiz auf einen Blick: welcher Wochentag, welche Zeit, Preis der Abendkarte, Spezialabende mit Vollmond und Fondue – mit Anreise ab deinem Ort.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/nachtskifahren" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/nachtskifahren" }),
};

const BYDAY = ["https://schema.org/Sunday", "https://schema.org/Monday", "https://schema.org/Tuesday", "https://schema.org/Wednesday", "https://schema.org/Thursday", "https://schema.org/Friday", "https://schema.org/Saturday"];

export default function NachtskiPage() {
  const today = isoDay(new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Zurich" })));
  const ski = offers.filter((o) => o.type === "ski");
  const longest = [...ski].filter((o) => o.km).sort((a, b) => b.km! - a.km!)[0];
  const cheapest = [...ski].filter((o) => o.ticket?.price).sort((a, b) => a.ticket!.price - b.ticket!.price)[0];
  const byWd = [5, 4, 3, 6, 2].map((w) => ({ w, n: offers.filter((o) => o.weekdays.includes(w)).length })).sort((a, b) => b.n - a.n)[0];
  const tonight = offers.filter((o) => nightStatus(o, today)).length;

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Skigebiete", path: "/skigebiete" }, { name: "Nachtskifahren", path: "/nachtskifahren" }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Nachtskifahren in der Schweiz",
      itemListElement: offers.map((o, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Event",
          name: o.name,
          description: o.text,
          url: `${SITE_URL}/nachtskifahren#${o.id}`,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          ...(o.season.from ? { startDate: `${o.season.from}T${o.from}` } : o.events[0] ? { startDate: `${o.events[0].date}T${o.from}` } : {}),
          ...(o.season.to ? { endDate: `${o.season.to}T${o.to || "22:00"}` } : {}),
          ...(o.weekdays.length
            ? { eventSchedule: { "@type": "Schedule", byDay: o.weekdays.map((w) => BYDAY[w]), startTime: o.from, ...(o.to ? { endTime: o.to } : {}), repeatFrequency: "P1W", scheduleTimezone: "Europe/Zurich", ...(o.season.from ? { startDate: o.season.from } : {}), ...(o.season.to ? { endDate: o.season.to } : {}) } }
            : {}),
          location: { "@type": "Place", name: o.place, address: { "@type": "PostalAddress", addressLocality: o.place, addressRegion: o.canton, addressCountry: "CH" }, geo: { "@type": "GeoCoordinates", latitude: o.coords.lat, longitude: o.coords.lng } },
          ...(o.ticket ? { offers: { "@type": "Offer", price: o.ticket.price, priceCurrency: "CHF", url: o.url } } : {}),
          organizer: { "@type": "Organization", name: o.place, url: o.url },
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { q: "Wo kann man in der Schweiz nachts Ski fahren?", a: `An ${ski.length} Orten, u. a. ${ski.slice(0, 6).map((o) => o.place).join(", ")}. Die meisten Pisten sind am ${WD_LONG[byWd.w]} beleuchtet.` },
        longest && { q: "Wo ist die längste beleuchtete Nachtpiste der Schweiz?", a: `${longest.name}: ${longest.piste}, ${longest.weekdays.map((w) => WD_LONG[w]).join(" und ")} ${longest.from}–${longest.to || "?"} Uhr.` },
        cheapest && { q: "Was kostet Nachtskifahren?", a: `Abendkarten kosten meist CHF 15–35. Am günstigsten: ${cheapest.name} mit CHF ${cheapest.ticket!.price} (${cheapest.ticket!.unit}).` },
      ]
        .filter(Boolean)
        .map((f) => ({ "@type": "Question", name: f!.q, acceptedAnswer: { "@type": "Answer", text: f!.a } })),
    },
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="kicker">Kalender · Saison 2026/27</p>
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">Nachtskifahren in der Schweiz</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {ski.length} beleuchtete Pisten und {offers.length - ski.length} Nachtschlittelwege – welcher Abend, welche Zeit, was es kostet.
        {tonight ? ` Heute Abend läuft an ${tonight} Orten etwas.` : ""}
        {longest && ` Die längste: ${longest.place} mit ${String(longest.km).replace(".", ",")} km bis ${longest.to} Uhr.`}
      </p>
      <div className="mt-10">
        <NightCalendar offers={offers} today={today} />
      </div>
      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Zeiten und Preise laut Bergbahnen, geprüft am {new Date(offers[0].checked).toLocaleDateString("de-CH")}. Nachtskifahren findet nur bei genügend Schnee und gutem Wetter statt – vor der Fahrt die Website der Bergbahn prüfen.
        Mehr zu Pisten, Schnee und Wetter: <Link href="/skigebiete" className="underline">alle Skigebiete live</Link>.
      </p>
    </div>
  );
}
