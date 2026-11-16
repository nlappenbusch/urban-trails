import type { Metadata } from "next";
import Link from "next/link";
import { KANTONE, MIN_KANTON, RUBRIKEN, itemsIn, itemsOf, rubrikItems, top, type Rubrik } from "@/lib/rubriken";
import { MONATE, monatJetzt, themenAnlaesse } from "@/lib/anlass";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import { runs } from "@/lib/schlitteln";
import { markets } from "@/lib/maerkte";

const TITLE = "Ausflugsziele Schweiz nach Rubrik: Tierparks, Museen, Eisbahnen, Bergbahnen …";
const desc = () => `${rubrikItems().length.toLocaleString("de-CH")} Ausflugsziele in allen 26 Kantonen: Tierparks, Museen, Burgen, Höhlen, Wasserfälle, Eisbahnen, Loipen, Winterwanderwege, Bergbahnen, Schifffahrten, Thermen, Klettersteige, Schlittelwege und Weihnachtsmärkte – mit Karte und Entfernung ab deiner Haltestelle.`;

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const description = desc();
  return { title: { absolute: TITLE }, description, alternates: { canonical: "/rubriken" }, ...socialMeta({ title: TITLE, description, path: "/rubriken" }) };
}

export default function RubrikenPage() {
  const schlitteln = runs();
  const maerkte = markets();
  const total = rubrikItems().length + schlitteln.length + maerkte.length;
  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflugsziele nach Rubrik", path: "/rubriken" }])) }} />
      <p className="kicker">Verzeichnis · ganze Schweiz</p>
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">Ausflugsziele nach Rubrik</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {total.toLocaleString("de-CH")} Ziele in allen 26 Kantonen, jedes auf der Karte und nach Entfernung ab deiner Haltestelle sortierbar. Dazu {schlitteln.length} Schlittelwege mit Höhenmetern und Haltestelle oben und unten und {maerkte.length} Weihnachtsmärkte 2026 mit Daten aus offiziellen Quellen.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Nach Anlass</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          <li><Link href="/ausflug" className="inline-flex min-h-[44px] items-center rounded-full bg-signal-500 px-4 text-sm font-bold text-white hover:bg-signal-600">Was im {MONATE[monatJetzt() - 1]} Saison hat</Link></li>
          {themenAnlaesse().map((t) => (
            <li key={t.slug}><Link href={`/ausflug/${t.slug}`} className="inline-flex min-h-[44px] items-center rounded-full border border-cream/20 bg-ink-900 px-4 text-sm font-bold text-cream-dim hover:border-cream/40 hover:text-cream">Ausflug {t.label}</Link></li>
          ))}
        </ul>
      </section>

      <h2 className="mt-14 font-display text-2xl font-extrabold tracking-tight text-cream">Winter</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/schlitteln" className="card group flex flex-col p-6 hover:border-cream/30">
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-cream group-hover:text-signal-600">Schlittelwege</h3>
          <p className="mt-2 flex-1 text-sm text-cream-dim">Länge, Höhenmeter, Bahn hoch und Haltestelle unten – die längsten zuerst.</p>
          <p className="mt-4 text-xs font-bold text-signal-600">{schlitteln.length} Schlittelwege</p>
        </Link>
        <Link href="/weihnachtsmaerkte" className="card group flex flex-col p-6 hover:border-cream/30">
          <span className="text-xs font-bold uppercase tracking-wide text-signal-600">Saison 2026</span>
          <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-cream group-hover:text-signal-600">Weihnachtsmärkte</h3>
          <p className="mt-2 flex-1 text-sm text-cream-dim">Welcher Markt heute offen hat, von Bellevue Noël bis Montreux – mit Zug ab deinem Ort.</p>
          <p className="mt-4 text-xs font-bold text-signal-600">{maerkte.length} Märkte</p>
        </Link>
        {RUBRIKEN.filter((r) => r.gruppe === "winter").map((r) => <Card key={r.slug} r={r} />)}
      </div>

      <h2 className="mt-14 font-display text-2xl font-extrabold tracking-tight text-cream">Sommer</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RUBRIKEN.filter((r) => r.gruppe === "sommer").map((r) => <Card key={r.slug} r={r} />)}
      </div>

      <h2 className="mt-14 font-display text-2xl font-extrabold tracking-tight text-cream">Das ganze Jahr</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RUBRIKEN.filter((r) => r.gruppe === "ganzjahr").map((r) => <Card key={r.slug} r={r} />)}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Nach Kanton</h2>
        <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {KANTONE.map((k) => {
            const rs = RUBRIKEN.filter((r) => itemsIn(r.slug, k.ak).length >= MIN_KANTON);
            if (!rs.length) return null;
            return (
              <div key={k.ak}>
                <h3 className="font-bold text-cream">{k.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-cream-dim">
                  {rs.map((r, i) => (
                    <span key={r.slug}>
                      {i > 0 && " · "}
                      <Link href={`/rubriken/${r.slug}/${k.slug}`} className="underline decoration-cream/20 underline-offset-2 hover:text-cream">{r.label}</Link>
                    </span>
                  ))}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Card({ r }: { r: Rubrik }) {
  const items = itemsOf(r.slug);
  const ex = top(items, 3).map((i) => i.name).join(", ");
  return (
    <Link href={`/rubriken/${r.slug}`} className="card group flex flex-col p-6 hover:border-cream/30">
      <h3 className="font-display text-2xl font-extrabold tracking-tight text-cream group-hover:text-signal-600">{r.label}</h3>
      <p className="mt-2 flex-1 text-sm text-cream-dim">{r.claim}</p>
      <p className="mt-3 line-clamp-1 text-xs text-cream-faint">z. B. {ex}</p>
      <p className="mt-3 text-xs font-bold text-signal-600">{items.length} Einträge</p>
    </Link>
  );
}
