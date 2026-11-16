import type { Metadata } from "next";
import Link from "next/link";
import { runs as allRuns, kmText } from "@/lib/schlitteln";
import { kantonByAk } from "@/lib/rubriken-core";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import SledFinder from "@/components/SledFinder";

const TITLE = "Schlittelwege Schweiz: die längsten Schlittelbahnen mit Karte";
const desc = (runs: ReturnType<typeof allRuns>, longest = runs[0]) => `${runs.length} Schlittelwege in der Schweiz mit Länge, Höhenmetern, Bahn hinauf und Haltestelle unten – der längste: ${longest.name} mit ${kmText(longest.km)}. Dazu Schnee oben und unten und der Zug ab deinem Ort.`;

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const description = desc(allRuns());
  return { title: { absolute: TITLE }, description, alternates: { canonical: "/schlitteln" }, ...socialMeta({ title: TITLE, description, path: "/schlitteln" }) };
}

const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} und ${a[a.length - 1]}` : a[0] ?? "");

export default function Page() {
  const runs = allRuns();
  const longest = runs[0];
  const lit = runs.filter((r) => r.lit);
  const top5 = runs.slice(0, 5);
  const ov = runs.filter((r) => r.top.st && r.bottom.st);
  const byKt = Object.entries(runs.reduce<Record<string, number>>((m, r) => ((m[r.kt] = (m[r.kt] ?? 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
  const near = (re: RegExp) => runs.filter((r) => re.test(`${r.ort} ${r.name}`)).slice(0, 3);
  const zh = runs.filter((r) => ["ZH", "SZ", "ZG"].includes(r.kt)).slice(0, 4);
  const faq = [
    { q: "Welches ist der längste Schlittelweg der Schweiz?", a: `In unserer Liste: ${list(top5.slice(0, 3).map((r) => `${r.name} (${kmText(r.km)}, ${r.drop} Höhenmeter)`))}.` },
    { q: "Wo kann man in der Schweiz schlitteln?", a: `An ${runs.length} Schlittelwegen in ${byKt.length} Kantonen, die meisten in ${list(byKt.slice(0, 3).map(([k, n]) => `${kantonByAk(k)?.name} (${n})`))}.` },
    zh.length > 0 && { q: "Wo kann man in der Nähe von Zürich schlitteln?", a: `Nah bei Zürich: ${list(zh.map((r) => `${r.name} (${kmText(r.km)})`))}.` },
    lit.length > 0 && { q: "Wo kann man nachts schlitteln?", a: `Beleuchtet sind u. a. ${list(lit.slice(0, 4).map((r) => r.name))}. Alle Nachtschlittel-Abende mit Datum stehen im Nachtski-Kalender.` },
    near(/grindelwald/i).length > 0 && { q: "Welche Schlittelwege gibt es in Grindelwald?", a: list(near(/grindelwald/i).map((r) => `${r.name} (${kmText(r.km)})`)) + "." },
  ].filter(Boolean) as { q: string; a: string }[];

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflugsziele nach Rubrik", path: "/rubriken" }, { name: "Schlittelwege", path: "/schlitteln" }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Schlittelwege Schweiz",
      itemListElement: runs.slice(0, 50).map((r, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/schlitteln/${r.id}`, name: `${r.name} (${kmText(r.km)})` })),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];
  const slim = runs.map(({ lines: _l, ...r }) => r);

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="kicker">Winter · ganze Schweiz</p>
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">Schlittelwege in der Schweiz</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {runs.length} Schlittelwege mit Länge und Höhenmetern, {ov.length} davon mit Haltestelle oben und unten. Der längste: {longest.name} mit {kmText(longest.km)} und {longest.drop} Höhenmetern. Auf jeder Seite: Schnee oben und unten und der Zug ab deinem Ort.
      </p>
      <div className="mt-10">
        <SledFinder runs={slim} />
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
        Schlittelwege aus OpenStreetMap (© OSM-Mitwirkende, ODbL, piste:type=sled), Höhen aus dem Mapbox-Geländemodell, Haltestellen von transport.opendata.ch. Ob ein Weg offen ist, entscheiden Schnee und Bergbahn – vor der Fahrt den Bericht vor Ort prüfen. Nachts schlitteln: <Link href="/nachtskifahren" className="underline">Nachtski- und Nachtschlittel-Kalender</Link>.
      </p>
    </div>
  );
}
