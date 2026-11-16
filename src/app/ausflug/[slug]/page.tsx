import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ANLAESSE, MONATE, SAISON_LINKS, getAnlass, monatsAnlaesse, themenAnlaesse, type Anlass } from "@/lib/anlass";
import { itemsOf, top, kantonByAk, subLabel, type RubrikItem } from "@/lib/rubriken";
import { themaPages } from "@/lib/themen";
import { festeImMonat, sicher, terminText } from "@/lib/feste";
import { regionInfo } from "@/lib/ausfluege";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";

export const dynamicParams = false;
export const revalidate = 3600;
export const generateStaticParams = () => ANLAESSE.map((a) => ({ slug: a.slug }));

const count = (a: Anlass) => a.rubriken.reduce((n, r) => n + itemsOf(r.slug).length, 0);
const list = (names: string[]) => (names.length > 1 ? `${names.slice(0, -1).join(", ")} und ${names[names.length - 1]}` : names[0] ?? "");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getAnlass((await params).slug);
  if (!a) return {};
  const n = count(a);
  const description = `${n.toLocaleString("de-CH")} Ausflugsziele ${a.label}: ${list(a.rubriken.slice(0, 5).map((r) => r.label))} – jede Rubrik mit Karte und Entfernung ab deiner Haltestelle, gratis.`;
  const path = `/ausflug/${a.slug}`;
  return { title: { absolute: a.title }, description, alternates: { canonical: path }, ...socialMeta({ title: a.title, description, path }) };
}

function Pick({ i, slug }: { i: RubrikItem; slug: string }) {
  const sub = subLabel(i.sub);
  return (
    <li>
      <Link href={`/rubriken/${slug}#${i.id}`} className="group flex gap-3 rounded-xl p-2 hover:bg-ink-800">
        {i.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={i.img.src} alt="" width={i.img.w} height={i.img.h} loading="lazy" decoding="async" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="h-14 w-20 shrink-0 rounded-lg bg-ink-800" aria-hidden />
        )}
        <span className="min-w-0">
          <span className="block truncate font-bold text-cream group-hover:text-signal-600">{i.name}</span>
          <span className="block truncate text-xs text-cream-faint">{i.ort ?? kantonByAk(i.kt)?.name}{sub ? ` · ${sub}` : ""}</span>
        </span>
      </Link>
    </li>
  );
}

export default async function AnlassPage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getAnlass((await params).slug);
  if (!a) notFound();
  const path = `/ausflug/${a.slug}`;
  const n = count(a);
  const saison = a.monat ? SAISON_LINKS.filter((s) => s.monate.includes(a.monat!)) : [];
  const feste = a.monat ? festeImMonat(a.monat) : [];
  const regional = a.regional ? themaPages().filter((p) => p.thema === a.regional).map((p) => ({ ...p, name: regionInfo(p.region)?.name ?? p.region })) : [];
  const andere = a.kind === "monat" ? monatsAnlaesse().filter((m) => m.slug !== a.slug) : themenAnlaesse().filter((t) => t.slug !== a.slug);

  const jsonLd = [
    breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflugsziele nach Rubrik", path: "/rubriken" }, { name: `Ausflug ${a.label}`, path }]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: a.title,
      url: `${SITE_URL}${path}`,
      itemListElement: a.rubriken.map((r, k) => ({ "@type": "ListItem", position: k + 1, name: r.label, url: `${SITE_URL}/rubriken/${r.slug}` })),
    },
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="kicker">
        <Link href="/rubriken" className="hover:underline">Ausflugsziele nach Rubrik</Link> · {a.kind === "monat" ? "Saison" : "Anlass"}
      </p>
      <h1 className="headline mt-3 max-w-4xl text-4xl text-cream sm:text-6xl">Ausflug {a.label}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">{a.intro}</p>
      <p className="mt-3 text-sm font-bold text-signal-600">{n.toLocaleString("de-CH")} Ziele in {a.rubriken.length} Rubriken</p>
      {a.hinweis && <p className="mt-5 max-w-2xl rounded-xl border border-cream/15 bg-ink-900 p-4 text-sm leading-relaxed text-cream-dim">{a.hinweis}</p>}

      {saison.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Jetzt mit Live-Daten</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saison.map((s) => (
              <Link key={s.href} href={s.href} className="card group flex flex-col p-5 hover:border-cream/30">
                <span className="font-display text-xl font-extrabold tracking-tight text-cream group-hover:text-signal-600">{s.label}</span>
                <span className="mt-1 text-sm text-cream-dim">{s.text}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {feste.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Feste und Bräuche im {MONATE[a.monat! - 1]}</h2>
          <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {feste.slice(0, 9).map(({ f, t }) => (
              <li key={f.id}>
                <Link href={`/feste#${f.id}`} className="group block rounded-xl p-2 hover:bg-ink-800">
                  <span className="block text-xs font-extrabold text-signal-600">{terminText(t)}{sicher(f, t) ? "" : " (voraussichtlich)"}</span>
                  <span className="block font-bold text-cream group-hover:text-signal-600">{f.name}</span>
                  <span className="block text-xs text-cream-faint">{f.ort} ({f.kt})</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/feste" className="mt-3 inline-block text-sm font-bold text-signal-600 hover:underline">Ganzer Festkalender</Link>
        </section>
      )}

      <div className="mt-12 space-y-12">
        {a.rubriken.map((r) => {
          const items = itemsOf(r.slug);
          if (!items.length) return null;
          return (
            <section key={r.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">
                  <Link href={`/rubriken/${r.slug}`} className="hover:text-signal-600">{r.label}</Link>
                </h2>
                <Link href={`/rubriken/${r.slug}`} className="text-sm font-bold text-signal-600 hover:text-signal-500">alle {items.length} mit Karte →</Link>
              </div>
              <p className="mt-1 max-w-2xl text-sm text-cream-dim">{r.claim}</p>
              <ul className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {top(items, 6).map((i) => <Pick key={i.id} i={i} slug={r.slug} />)}
              </ul>
            </section>
          );
        })}
      </div>

      {regional.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Von uns geprüft, nach Region</h2>
          <p className="mt-1 max-w-2xl text-sm text-cream-dim">Mit Preisen, Öffnungszeiten und fertigem Tagesprogramm samt Zugverbindung.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {regional.map((p) => (
              <li key={p.region}>
                <Link href={`/ausflugsziele/${p.region}/${p.thema}`} className="inline-flex min-h-[38px] items-center rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-semibold text-cream-dim hover:border-cream/40 hover:text-cream">{p.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">{a.kind === "monat" ? "Andere Monate" : "Andere Anlässe"}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {andere.map((x) => (
            <li key={x.slug}>
              <Link href={`/ausflug/${x.slug}`} className="inline-flex min-h-[38px] items-center rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-semibold text-cream-dim hover:border-cream/40 hover:text-cream">
                {x.kind === "monat" ? MONATE[x.monat! - 1] : `Ausflug ${x.label}`}
              </Link>
            </li>
          ))}
          {a.kind === "thema" && (
            <li>
              <Link href="/ausflug" className="inline-flex min-h-[38px] items-center rounded-full border border-cream/20 bg-ink-900 px-3.5 text-sm font-semibold text-cream-dim hover:border-cream/40 hover:text-cream">Was diesen Monat Saison hat</Link>
            </li>
          )}
        </ul>
      </section>

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Die Zuordnung gilt für die Rubrik als Ganzes, nicht für jeden einzelnen Ort – Öffnungszeiten und Regeln stehen auf der Website des Anbieters. Verzeichnis aus OpenStreetMap (© OSM-Mitwirkende, ODbL), Schifffahrten von uns zusammengestellt.
      </p>
    </div>
  );
}
