import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, ExternalLink, MapPin } from "lucide-react";
import PointsMap from "@/components/PointsMap";
import MerkButton from "@/components/MerkButton";
import { ART_LABEL, FESTE, heuteCH, kommende, laeuft, sicher, terminText, type Fest, type Termin } from "@/lib/feste";
import { MONATE, monatSlug } from "@/lib/anlass";
import { kantonByAk } from "@/lib/rubriken-core";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";

export const revalidate = 3600;

const TITLE = "Feste und Bräuche in der Schweiz: Kalender mit Daten";
const DESC = `${FESTE.length} Bräuche, Volksfeste und Grossanlässe von der Fasnacht bis zur Escalade – mit den nächsten Daten, Ort auf der Karte und Termin für deinen Kalender.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/feste" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/feste" }),
};

export default function FestePage() {
  const heute = heuteCH();
  const alle = kommende(heute);
  const bald = alle.slice(0, 6);
  // Kalender: 12 Monate ab dem laufenden
  const start = new Date(`${heute.slice(0, 7)}-01T00:00:00Z`);
  const monate = Array.from({ length: 13 }, (_, i) => {
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 };
  });
  const imMonat = (y: number, m: number) => {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    return FESTE.flatMap((f) => f.termine.filter((t) => t.von.startsWith(key) && (t.bis ?? t.von) >= heute).map((t) => ({ f, t }))).sort((a, b) => a.t.von.localeCompare(b.t.von));
  };

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Feste & Bräuche", path: "/feste" }]),
    ...alle
      .filter(({ f, t }) => sicher(f, t))
      .slice(0, 30)
      .map(({ f, t }) => ({
        "@context": "https://schema.org",
        "@type": "Event",
        name: f.name,
        description: f.text,
        startDate: t.von,
        endDate: t.bis ?? t.von,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: f.ort, address: { "@type": "PostalAddress", addressLocality: f.ort, addressRegion: f.kt, addressCountry: "CH" }, geo: { "@type": "GeoCoordinates", latitude: f.lat, longitude: f.lng } },
        ...(f.web ? { url: f.web } : { url: `${SITE_URL}/feste#${f.id}` }),
      })),
  ];

  return (
    <div className="container-page pb-16 pt-6 sm:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="headline max-w-4xl text-[2.5rem] text-cream sm:text-6xl">Feste und Bräuche in der Schweiz</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Was jedes Jahr wiederkommt: Fasnacht und Sechseläuten, Alpabzüge und Chilbi, Zibelemärit und Escalade. {FESTE.length} Anlässe mit dem nächsten Datum – und mit einem Tipp, wann man am besten dort ist.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Als Nächstes</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bald.map(({ f, t }) => (
            <li key={f.id} className="card flex flex-col p-5">
              <p className={`text-sm font-extrabold ${laeuft(t, heute) ? "text-emerald-700" : "text-signal-600"}`}>{laeuft(t, heute) ? "läuft gerade · " : ""}{terminText(t)}</p>
              <a href={`#${f.id}`} className="mt-1 font-display text-xl font-extrabold leading-tight tracking-tight text-cream hover:underline">{f.name}</a>
              <p className="mt-1 text-sm text-cream-faint">{f.ort} ({f.kt}) · {ART_LABEL[f.art]}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12">
        <PointsMap points={FESTE.map((f) => ({ id: f.id, name: f.name, lat: f.lat, lng: f.lng, sub: f.ort, href: `/feste#${f.id}` }))} color="#be123c" height={420} />
      </div>

      {monate.map(({ y, m }) => {
        const xs = imMonat(y, m);
        if (!xs.length) return null;
        return (
          <section key={`${y}-${m}`} className="mt-14">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-cream">
              {MONATE[m - 1]} {y} <Link href={`/ausflug/${monatSlug(m)}`} className="ml-2 align-middle text-sm font-bold text-signal-600 hover:underline">was sonst im {MONATE[m - 1]} Saison hat</Link>
            </h2>
            <ul className="mt-4 space-y-4">
              {xs.map(({ f, t }) => <FestKarte key={`${f.id}-${t.von}`} f={f} t={t} heute={heute} first={alle.find((a) => a.f.id === f.id)?.t.von === t.von} />)}
            </ul>
          </section>
        );
      })}

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Daten aus den offiziellen Seiten der Veranstalter und Tourismusorganisationen, Stand November 2026. Wo noch kein Datum veröffentlicht ist, steht ein aus der Regel berechneter Termin («voraussichtlich») – vor der Reise auf der verlinkten Seite prüfen. Wetterabhängige Anlässe wie Alpabzüge können kurzfristig verschoben werden.
      </p>
    </div>
  );
}

function FestKarte({ f, t, heute, first }: { f: Fest; t: Termin; heute: string; first: boolean }) {
  return (
    <li id={first ? f.id : undefined} className="card scroll-mt-24 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 text-sm font-extrabold text-signal-600">
            <span className={laeuft(t, heute) ? "text-emerald-700" : ""}>{laeuft(t, heute) ? "läuft gerade · " : ""}{terminText(t)}</span>
            {!sicher(f, t) && <span className="rounded-full border border-cream/20 px-2 py-0.5 text-[11px] font-bold text-cream-faint">voraussichtlich</span>}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight tracking-tight text-cream">{f.name}</h3>
          <p className="mt-0.5 text-sm text-cream-faint">{f.ort}, {kantonByAk(f.kt)?.name ?? f.kt} · {ART_LABEL[f.art]}{f.familie ? " · mit Kindern gut" : ""} · {f.regel}</p>
        </div>
        <MerkButton item={{ id: f.id, r: "fest", name: f.name, ort: f.ort, kt: f.kt, lat: f.lat, lng: f.lng, web: f.web, href: `/feste#${f.id}` }} className="-mr-2" />
      </div>
      <p className="mt-3 max-w-3xl leading-relaxed text-cream-dim">{f.text}</p>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
        <a href={`/feste/kalender/${f.id}`} className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><CalendarPlus size={14} aria-hidden /> In den Kalender</a>
        <a href={`https://www.google.com/maps/search/?api=1&query=${f.lat},${f.lng}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><MapPin size={14} aria-hidden /> Karte</a>
        {f.web && <a href={f.web} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Website</a>}
      </p>
    </li>
  );
}
