import Link from "next/link";
import RubrikFinder from "@/components/RubrikFinder";
import { KANTONE, MIN_KANTON, RUBRIKEN, itemsIn, top, type Kanton, type Rubrik, type RubrikItem } from "@/lib/rubriken";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import { Plakette, rubrikColor } from "@/lib/rubrik-style";
import { ChevronRight } from "lucide-react";

const list = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} und ${names[names.length - 1]}` : names[0] ?? "");

export function rubrikTitle(r: Rubrik, k: Kanton | undefined, n: number) {
  return k ? `${r.label} ${k.im}: alle ${n} mit Karte` : `${r.label} Schweiz: alle ${n} auf einer Karte`;
}
export function rubrikDesc(r: Rubrik, k: Kanton | undefined, items: RubrikItem[]) {
  const names = top(items, 4).map((i) => i.name);
  return `${items.length} ${r.many} ${k ? k.im : "in der Schweiz"}, u. a. ${list(names)}. Mit Karte, Öffnungszeiten, Website und Entfernung ab deiner Haltestelle.`;
}

export default function RubrikView({ r, k, items }: { r: Rubrik; k?: Kanton; items: RubrikItem[] }) {
  const where = k ? k.im : "in der Schweiz";
  const best = top(items, 5);
  const free = items.filter((i) => i.fee === false);
  const withHours = items.filter((i) => i.hours).length;
  const byKt = KANTONE.map((c) => ({ c, n: itemsIn(r.slug, c.ak).length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
  const towns = k ? Object.entries(items.reduce<Record<string, number>>((m, i) => (i.ort ? ((m[i.ort] = (m[i.ort] ?? 0) + 1), m) : m), {})).sort((a, b) => b[1] - a[1]).slice(0, 3) : [];
  const path = k ? `/rubriken/${r.slug}/${k.slug}` : `/rubriken/${r.slug}`;
  // OSM-Einträge haben IDs wie n123/w45/r6, recherchierte sprechende IDs
  const kuratiert = items.length > 0 && items.every((i) => !/^[nwr]\d+$/.test(i.id));

  const faq = [
    { q: `Welche ${r.many} gibt es ${where}?`, a: `${where.charAt(0).toUpperCase() + where.slice(1)} kennen wir ${items.length} ${r.many}. Bekannt sind ${list(best.map((i) => i.name))}.` },
    !k && byKt[0] && { q: `In welchem Kanton gibt es die meisten ${r.many}?`, a: `Am meisten im Kanton ${byKt[0].c.name} (${byKt[0].n}), danach ${byKt[1]?.c.name} (${byKt[1]?.n}) und ${byKt[2]?.c.name} (${byKt[2]?.n}).` },
    k && towns.length > 1 && { q: `Wo ${k.im} gibt es die meisten ${r.many}?`, a: `In ${list(towns.map(([t, n]) => `${t} (${n})`))}.` },
    free.length > 0 && { q: `Welche ${r.many} ${where} sind gratis?`, a: `Ohne Eintritt laut OpenStreetMap: ${list(free.slice(0, 5).map((i) => i.name))}${free.length > 5 ? ` und ${free.length - 5} weitere` : ""}.` },
  ].filter(Boolean) as { q: string; a: string }[];

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflugsziele nach Rubrik", path: "/rubriken" }, { name: r.label, path: `/rubriken/${r.slug}` }, ...(k ? [{ name: k.name, path }] : [])]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${r.label} ${where}`,
      numberOfItems: items.length,
      itemListElement: top(items, 30).map((i, n) => ({
        "@type": "ListItem",
        position: n + 1,
        item: {
          "@type": "TouristAttraction",
          name: i.name,
          ...(i.text ? { description: i.text } : {}),
          ...(i.web ? { url: i.web } : {}),
          ...(i.img ? { image: i.img.src } : {}),
          geo: { "@type": "GeoCoordinates", latitude: i.lat, longitude: i.lng },
          address: { "@type": "PostalAddress", ...(i.ort ? { addressLocality: i.ort } : {}), addressRegion: i.kt, addressCountry: "CH" },
          ...(i.fee === false ? { isAccessibleForFree: true } : {}),
        },
      })),
      url: `${SITE_URL}${path}`,
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <div className="container-page pb-16 pt-4 sm:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Brotkrumen" className="text-sm text-cream-faint">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/rubriken" className="font-semibold hover:text-cream">Ausflugsziele</Link></li>
          <li aria-hidden><ChevronRight size={14} /></li>
          {k ? (
            <>
              <li><Link href={`/rubriken/${r.slug}`} className="font-semibold hover:text-cream">{r.label}</Link></li>
              <li aria-hidden><ChevronRight size={14} /></li>
              <li aria-current="page">{k.name}</li>
            </>
          ) : (
            <li aria-current="page">{r.label}</li>
          )}
        </ol>
      </nav>
      <div className="mt-3 flex items-start gap-4">
        <Plakette r={r.slug} size={56} className="mt-1 hidden sm:grid" />
        <div className="min-w-0">
          <h1 className="headline text-[2rem] text-cream sm:text-5xl">{r.label} {k ? k.im : "in der Schweiz"}</h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-cream-dim sm:text-[17px]">
            <span className="tabnums">{items.length.toLocaleString("de-CH")}</span> {r.many} {where}. {r.claim}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <RubrikFinder items={items} one={r.one} showCanton={!k} color={rubrikColor(r.slug)} />
      </div>

      {!k && byKt.length > 1 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-cream">{r.label} nach Kanton</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {byKt.map(({ c, n }) => (
              <li key={c.ak}>
                {n >= MIN_KANTON ? (
                  <Link href={`/rubriken/${r.slug}/${c.slug}`} className="chip">
                    {c.name} <span className="text-cream-faint">{n}</span>
                  </Link>
                ) : (
                  <span className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3.5 text-sm text-cream-faint ring-1 ring-cream/10">{c.name} <span className="tabnums">{n}</span></span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {k && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-cream">Mehr {k.im}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {RUBRIKEN.filter((x) => x.slug !== r.slug && itemsIn(x.slug, k.ak).length >= MIN_KANTON).map((x) => (
              <li key={x.slug}>
                <Link href={`/rubriken/${x.slug}/${k.slug}`} className="chip">
                  {x.label} <span className="text-cream-faint">{itemsIn(x.slug, k.ak).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16 max-w-3xl">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-cream">Häufige Fragen</h2>
        <dl className="mt-4 space-y-5">
          {faq.map((f) => (
            <div key={f.q}>
              <dt className="font-bold text-cream">{f.q}</dt>
              <dd className="mt-1 text-cream-dim">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {kuratiert ? (
      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Von uns zusammengestellt, Stand November 2026: jedes Angebot mit der Website des Anbieters, die wir geprüft haben. Saison, Fahrplan und Preise ändern sich – vor dem Besuch beim Anbieter nachsehen.
      </p>
      ) : (
      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Verzeichnis aus OpenStreetMap (© OSM-Mitwirkende, ODbL), Kantone nach swisstopo. Kurztexte aus der deutschsprachigen Wikipedia (CC BY-SA 4.0, Link beim Eintrag), Fotos von Wikimedia Commons mit Urheber und Lizenz am Bild.
        {withHours > 0 && ` Öffnungszeiten bei ${withHours} Einträgen aus OSM – vor dem Besuch auf der Website prüfen.`} Fehlt etwas oder ist es geschlossen? In OpenStreetMap korrigieren – wir übernehmen es beim nächsten Abgleich.
      </p>
      )}
    </div>
  );
}
