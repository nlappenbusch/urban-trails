import type { Metadata } from "next";
import Link from "next/link";
import { Sun, Snowflake } from "lucide-react";
import { sunRanking } from "@/lib/sonne";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";

export const revalidate = 86400;

const TITLE = "Die sonnigsten Skigebiete der Schweiz – Sonnenstunden auf der Piste";
const DESC = "Welches Skigebiet hat am meisten Sonne? Für jede Piste aus Ausrichtung, Neigung und Sonnenstand gerechnet: Sonnenstunden pro Tag, Anteil Südhänge, wo nachmittags noch Sonne ist – und wo der Pulver am längsten hält.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/sonnige-skigebiete" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/sonnige-skigebiete" }),
};

const h = (n: number) => String(n).replace(".", ",");

export default async function SunnyPage() {
  const iso = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
  const dateText = new Date().toLocaleDateString("de-CH", { day: "numeric", month: "long", timeZone: "Europe/Zurich" });
  const list = await sunRanking(iso);
  const top = list.slice(0, 3);
  const shady = [...list].sort((a, b) => b.north - a.north).slice(0, 5);
  const max = list[0]?.hours || 1;

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Skigebiete", path: "/skigebiete" }, { name: "Sonnigste Skigebiete", path: "/sonnige-skigebiete" }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Die sonnigsten Skigebiete der Schweiz",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: list.slice(0, 20).map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.name, url: `${SITE_URL}/skigebiete/${r.id}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { q: "Welches Skigebiet in der Schweiz hat am meisten Sonne?", a: `Gerechnet für den ${dateText}: ${top.map((r) => `${r.name} (${h(r.hours)} Sonnenstunden je Piste)`).join(", ")}. Entscheidend ist, wie viele Pisten nach Süden abfallen.` },
        { q: "Wo hält der Pulverschnee am längsten?", a: `Auf Nordhängen, weil die Sonne dort kaum hinkommt. Den grössten Anteil Nordhänge haben ${shady.slice(0, 3).map((r) => `${r.name} (${r.north} %)`).join(", ")}.` },
      ].map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="kicker">Sonne auf der Piste · gerechnet für den {dateText}</p>
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">Die sonnigsten Skigebiete der Schweiz</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream-dim">
        Am meisten Sonne auf der Piste haben heute {top.map((r, i) => <span key={r.id}>{i ? (i === top.length - 1 ? " und " : ", ") : ""}<Link href={`/skigebiete/${r.id}`} className="font-bold text-cream underline-offset-4 hover:underline">{r.name}</Link> ({h(r.hours)} h)</span>)}.
        Gerechnet für jede einzelne Piste aus Ausrichtung, Neigung und Sonnenstand – nicht aus Prospekten.
      </p>

      <ol className="mt-10 space-y-2">
        {list.map((r, i) => (
          <li key={r.id} className="card grid grid-cols-[2rem_1fr] items-center gap-x-3 gap-y-1 p-4 sm:grid-cols-[2.5rem_minmax(0,16rem)_1fr_auto]">
            <span className="font-display text-xl font-extrabold text-cream-faint">{i + 1}</span>
            <Link href={`/skigebiete/${r.id}#sonne`} className="font-bold text-cream hover:underline">{r.name} <span className="font-normal text-cream-faint">{r.canton}</span></Link>
            <span className="col-span-2 flex items-center gap-2 sm:col-span-1">
              <span className="h-3 flex-1 rounded-full bg-ink-800"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${(r.hours / max) * 100}%` }} /></span>
              <span className="w-14 text-right font-display font-extrabold text-cream">{h(r.hours)} h</span>
            </span>
            <span className="col-span-2 text-xs text-cream-dim sm:col-span-1 sm:w-56 sm:text-right">{r.south} % Südhänge · {r.km} km · Spitze {r.peak.hm} ({r.peak.share} %)</span>
          </li>
        ))}
      </ol>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-cream"><Sun size={18} className="text-amber-400" aria-hidden /> Nachmittags noch Sonne</h2>
          <ul className="mt-3 space-y-2 text-sm text-cream-dim">
            {list.slice(0, 6).filter((r) => r.pm.length).map((r) => (
              <li key={r.id}><Link href={`/skigebiete/${r.id}#sonne`} className="font-bold text-cream hover:underline">{r.name}</Link>: {r.pm.join(", ")}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-cream"><Snowflake size={18} className="text-sky-400" aria-hidden /> Pulver hält am längsten</h2>
          <p className="mt-2 text-sm text-cream-dim">Viele Nordhänge = wenig Sonne, dafür kalter, griffiger Schnee bis in den Frühling.</p>
          <ul className="mt-3 space-y-1.5 text-sm text-cream-dim">
            {shady.map((r) => (
              <li key={r.id}><Link href={`/skigebiete/${r.id}#sonne`} className="font-bold text-cream hover:underline">{r.name}</Link> – {r.north} % Nordhänge</li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Sonnenstunden = durchschnittliche Zeit zwischen 8.30 und 16.30 Uhr, in der ein Pistenmeter direkte Sonne hat (Einfallswinkel aus Hangneigung und -ausrichtung). Pisten aus OpenStreetMap im Umkreis von 7 km, Höhen aus Mapbox Terrain. Schatten von Nachbargipfeln, Wolken und Nebel sind nicht eingerechnet. Täglich neu gerechnet – im Januar steht die Sonne tiefer als im März.
      </p>
    </div>
  );
}
