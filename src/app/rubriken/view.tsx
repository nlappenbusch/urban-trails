import Link from "next/link";
import RubrikFinder from "@/components/RubrikFinder";
import { KANTONE, MIN_KANTON, RUBRIKEN, itemsIn, top, type Kanton, type Rubrik, type RubrikItem } from "@/lib/rubriken";
import { SITE_URL, breadcrumbJsonLd } from "@/lib/seo";

const list = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} und ${names[names.length - 1]}` : names[0] ?? "");
const COLORS: Record<string, string> = {
  tierparks: "#16a34a", museen: "#7c3aed", "burgen-schloesser": "#b45309", hoehlen: "#475569", wasserfaelle: "#0284c7",
  aussichtstuerme: "#ea580c", freizeitparks: "#db2777", erlebnisbaeder: "#0891b2", seilparks: "#65a30d", sternwarten: "#1e3a8a", minigolf: "#ca8a04",
  rodelbahnen: "#e11d48", klettersteige: "#78350f", themenwege: "#15803d", schifffahrten: "#1d4ed8", eisbahnen: "#0ea5e9", langlauf: "#0369a1",
  winterwandern: "#64748b", bergbahnen: "#9a3412", kletterhallen: "#a16207", thermen: "#0f766e",
};

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
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="kicker">
        <Link href="/rubriken" className="hover:underline">Ausflugsziele nach Rubrik</Link> · {k ? <Link href={`/rubriken/${r.slug}`} className="hover:underline">{r.label} Schweiz</Link> : "ganze Schweiz"}
      </p>
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">{r.label} {k ? k.im : "in der Schweiz"}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {items.length} {r.many} {where} auf einer Karte – {/^(Vom|Von|Auf|Grosse|Bewohnte|Öffentliche|Gepfadete) /.test(r.claim) ? r.claim.charAt(0).toLowerCase() + r.claim.slice(1) : r.claim}
        {best.length > 2 && ` Bekannt: ${list(best.slice(0, 3).map((i) => i.name))}.`}
        {" "}Wähl deine Haltestelle, dann steht das Nächste oben.
      </p>

      <div className="mt-10">
        <RubrikFinder items={items} one={r.one} showCanton={!k} color={COLORS[r.slug]} />
      </div>

      {!k && byKt.length > 1 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">{r.label} nach Kanton</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {byKt.map(({ c, n }) => (
              <li key={c.ak}>
                {n >= MIN_KANTON ? (
                  <Link href={`/rubriken/${r.slug}/${c.slug}`} className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-semibold text-cream-dim hover:border-cream/40 hover:text-cream">
                    {c.name} <span className="text-cream-faint">{n}</span>
                  </Link>
                ) : (
                  <span className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-cream/10 px-3.5 text-sm text-cream-faint">{c.name} {n}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {k && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Mehr {k.im}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {RUBRIKEN.filter((x) => x.slug !== r.slug && itemsIn(x.slug, k.ak).length >= MIN_KANTON).map((x) => (
              <li key={x.slug}>
                <Link href={`/rubriken/${x.slug}/${k.slug}`} className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-semibold text-cream-dim hover:border-cream/40 hover:text-cream">
                  {x.label} <span className="text-cream-faint">{itemsIn(x.slug, k.ak).length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
        Verzeichnis aus OpenStreetMap (© OSM-Mitwirkende, ODbL), Kantone nach swisstopo. Kurztexte aus der deutschsprachigen Wikipedia (CC BY-SA 4.0, Link beim Eintrag), Fotos von Wikimedia Commons mit Urheber und Lizenz am Bild.
        {withHours > 0 && ` Öffnungszeiten bei ${withHours} Einträgen aus OSM – vor dem Besuch auf der Website prüfen.`} Fehlt etwas oder ist es geschlossen? In OpenStreetMap korrigieren – wir übernehmen es beim nächsten Abgleich.
      </p>
    </div>
  );
}
