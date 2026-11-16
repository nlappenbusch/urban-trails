import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BadgeCheck, ChevronRight } from "lucide-react";
import { cached } from "@/lib/db";
import { MONATE } from "@/lib/anlass";
import { getRubrik, hoursText, kantonByAk, rubrikItems, subLabel, type RubrikItem } from "@/lib/rubriken";
import { hatInhalt, toHit } from "@/lib/hit";
import { crowKm } from "@/lib/ski-core";
import { zielHref, zielId, zielSlug } from "@/lib/ziel";
import { ART_LABEL, kommende, sicher, terminText } from "@/lib/feste";
import { Plakette, rubrikColor } from "@/lib/rubrik-style";
import { SITE_URL, breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import ZielRow from "@/components/ZielRow";
import { ZielAktionen, ZielKarte } from "@/components/ZielAktionen";

export const revalidate = 86400;
export const dynamicParams = true;
export const generateStaticParams = () => [];

const byId = () => cached("ziel:byId", () => new Map(rubrikItems().map((i) => [i.id, i])));
const finde = (slug: string) => byId().get(zielId(decodeURIComponent(slug)));

function beschreibung(i: RubrikItem) {
  const r = getRubrik(i.r);
  const wo = i.ort ? `${i.ort} (${i.kt})` : kantonByAk(i.kt)?.name ?? i.kt;
  const text = i.text ? i.text.replace(/\s+/g, " ").slice(0, 120).replace(/\s\S*$/, "") + " …" : r?.claim ?? "";
  return `${i.name}, ${r?.one ?? "Ausflugsziel"} in ${wo}. ${text} Mit Karte, Anreise mit ÖV und Zielen in der Nähe.`.slice(0, 300);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const i = finde((await params).slug);
  if (!i) return {};
  const r = getRubrik(i.r);
  const title = `${i.name}${i.ort && !i.name.includes(i.ort) ? ` in ${i.ort}` : ""} – ${r?.one ?? "Ausflugsziel"}`;
  const description = beschreibung(i);
  const path = zielHref(i);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: hatInhalt(i), follow: true },
    ...socialMeta({ title, description, path, ...(i.img ? { image: { url: i.img.src, small: i.img.src, alt: i.name, width: i.img.w, height: i.img.h, credit: i.img.page } } : {}) }),
  };
}

const saisonText = (m?: number[]) => {
  if (!m) return "ganzjährig";
  const s = [...m];
  return s.length > 2 && s.every((x, k) => k === 0 || x === s[k - 1] + 1 || (s[k - 1] === 12 && x === 1)) ? `${MONATE[s[0] - 1]} bis ${MONATE[s[s.length - 1] - 1]}` : s.map((x) => MONATE[x - 1]).join(", ");
};

export default async function ZielPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = decodeURIComponent((await params).slug);
  const i = finde(slug);
  if (!i) notFound();
  if (slug !== zielSlug(i)) permanentRedirect(zielHref(i));

  const r = getRubrik(i.r);
  const k = kantonByAk(i.kt);
  const color = rubrikColor(i.r);
  const sub = subLabel(i.sub);
  const nah = rubrikItems()
    .filter((x) => x.id !== i.id && (x.text || x.web || x.img || x.q > 2))
    .map((x) => ({ x, d: crowKm(i, x) }))
    .filter((y) => y.d < 25)
    .sort((a, b) => a.d - b.d)
    .slice(0, 8);
  const feste = kommende()
    .filter(({ f }) => crowKm(i, f) < 30)
    .slice(0, 3);
  const hrefs = Object.fromEntries([i, ...nah.map((y) => y.x)].map((x) => [x.id, zielHref(x)]));
  const fakten = [
    sub && ["Art", sub],
    i.hours && ["Öffnungszeiten", `${hoursText(i.hours)} (laut OpenStreetMap)`],
    i.fee === false && ["Eintritt", "gratis (laut OpenStreetMap)"],
    i.wheel && ["Zugang", "rollstuhlgängig (laut OpenStreetMap)"],
    i.height && ["Höhe", `${Math.round(i.height)} m`],
    i.ele && ["Lage", `${Math.round(i.ele)} m ü. M.`],
    r && ["Saison", saisonText(r.monate)],
    r?.regenfest && ["Bei Regen", "geht auch – drinnen oder überdacht"],
  ].filter(Boolean) as [string, string][];
  const desc = i.desc ? i.desc.charAt(0).toUpperCase() + i.desc.slice(1) + "." : undefined;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Ausflugsziele", path: "/rubriken" },
      ...(r ? [{ name: r.label, path: `/rubriken/${r.slug}` }] : []),
      { name: i.name, path: zielHref(i) },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      name: i.name,
      url: `${SITE_URL}${zielHref(i)}`,
      ...(i.text ? { description: i.text } : desc ? { description: desc } : {}),
      ...(i.web ? { sameAs: i.web } : {}),
      ...(i.img ? { image: i.img.src } : {}),
      geo: { "@type": "GeoCoordinates", latitude: i.lat, longitude: i.lng },
      address: { "@type": "PostalAddress", ...(i.ort ? { addressLocality: i.ort } : {}), addressRegion: i.kt, addressCountry: "CH" },
      ...(i.fee === false ? { isAccessibleForFree: true } : {}),
    },
  ];

  return (
    <div className="container-page pb-16 pt-4 sm:pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Brotkrumen" className="text-sm text-cream-faint">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/rubriken" className="font-semibold hover:text-cream">Ausflugsziele</Link></li>
          {r && (
            <>
              <li aria-hidden><ChevronRight size={14} /></li>
              <li><Link href={`/rubriken/${r.slug}`} className="font-semibold hover:text-cream">{r.label}</Link></li>
            </>
          )}
        </ol>
      </nav>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div>
          <div className="flex items-start gap-4">
            <Plakette r={i.r} size={56} className="mt-1" />
            <div className="min-w-0">
              <h1 className="headline text-[2rem] text-cream sm:text-5xl">{i.name}</h1>
              <p className="mt-1.5 text-[17px] text-cream-dim">
                {r?.one}
                {i.ort ? ` in ${i.ort}` : ""}
                {k ? `, Kanton ${k.name}` : ""}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ZielAktionen item={{ id: i.id, r: i.r, name: i.name, ort: i.ort, kt: i.kt, lat: i.lat, lng: i.lng, web: i.web, href: zielHref(i) }} web={i.web} />
          </div>

          {i.ours && (
            <Link href={i.ours} className="mt-6 flex items-center gap-3 rounded-[22px] bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-700/15 transition hover:ring-emerald-700/40">
              <BadgeCheck size={22} className="shrink-0" aria-hidden />
              <span className="text-sm"><strong className="font-bold">Von uns geprüft:</strong> Preis, Öffnungszeiten und unser Tipp stehen auf der Regionsseite.</span>
              <ChevronRight size={18} className="ml-auto shrink-0" aria-hidden />
            </Link>
          )}

          {i.img && (
            <figure className="mt-6 overflow-hidden rounded-[22px] bg-ink-800 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.img.src} alt={i.name} width={i.img.w} height={i.img.h} className="aspect-[16/10] w-full object-cover" />
              <figcaption className="bg-ink-900 px-4 py-2 text-xs text-cream-faint">
                <a href={i.img.page} target="_blank" rel="noopener" className="hover:text-cream">Foto: {i.img.by ?? "Wikimedia Commons"}{i.img.lic ? `, ${i.img.lic}` : ""}</a>
              </figcaption>
            </figure>
          )}

          {(i.text || desc) && (
            <div className="mt-6 max-w-[68ch]">
              {i.text ? <p className="text-[17px] leading-relaxed text-cream">{i.text}</p> : <p className="text-[17px] leading-relaxed text-cream">{desc}</p>}
              {i.wiki && (
                <p className="mt-2 text-sm text-cream-faint">
                  Text: <a href={i.wiki} target="_blank" rel="noopener" className="font-semibold text-signal-600 hover:text-signal-700">Wikipedia</a>, CC BY-SA 4.0
                </p>
              )}
            </div>
          )}

          {fakten.length > 0 && (
            <dl className="mt-6 divide-y divide-cream/[0.07] rounded-[22px] bg-ink-900 px-5 shadow-soft ring-1 ring-cream/[0.06]">
              {fakten.map(([t, v]) => (
                <div key={t} className="grid gap-1 py-3.5 sm:grid-cols-[160px_1fr] sm:gap-4">
                  <dt className="text-sm font-bold text-cream-faint">{t}</dt>
                  <dd className="text-cream">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mt-3 text-xs leading-relaxed text-cream-faint">
            {/^[nwr]\d+$/.test(i.id)
              ? "Angaben aus OpenStreetMap (© OSM-Mitwirkende, ODbL). Preise und Zeiten ändern sich – vor dem Besuch auf der Website des Anbieters nachsehen. Fehlt etwas? In OpenStreetMap korrigieren, wir übernehmen es beim nächsten Abgleich."
              : "Von uns zusammengestellt, Stand November 2026, mit der geprüften Website des Anbieters. Saison, Fahrplan und Preise ändern sich – vor dem Besuch beim Anbieter nachsehen."}
          </p>
        </div>

        <aside className="space-y-8 lg:sticky lg:top-20">
          <div className="overflow-hidden rounded-[22px] shadow-soft ring-1 ring-cream/[0.06]">
            <ZielKarte
              points={[i, ...nah.map((y) => y.x)].map((x) => ({ id: x.id, name: x.name, lat: x.lat, lng: x.lng, sub: x.id === i.id ? "dieses Ziel" : getRubrik(x.r)?.one }))}
              color={color}
              hrefs={hrefs}
            />
          </div>
          {feste.length > 0 && (
            <section aria-labelledby="feste-nah">
              <h2 id="feste-nah" className="text-xl font-extrabold tracking-[-0.02em] text-cream">Demnächst in der Nähe</h2>
              <ul className="mt-3 space-y-2">
                {feste.map(({ f, t }) => (
                  <li key={f.id}>
                    <Link href={`/feste#${f.id}`} className="block rounded-2xl bg-ink-900 p-3.5 shadow-soft ring-1 ring-cream/[0.06] hover:shadow-lift">
                      <span className="block font-bold text-cream">{f.name}</span>
                      <span className="mt-0.5 block text-sm text-cream-dim">
                        {terminText(t)}{!sicher(f, t) ? " (voraussichtlich)" : ""} · {f.ort} · {ART_LABEL[f.art]}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {nah.length > 0 && (
        <section className="mt-14" aria-labelledby="nah-titel">
          <h2 id="nah-titel" className="text-2xl font-extrabold tracking-[-0.02em] text-cream">In der Nähe</h2>
          <p className="mt-1 text-cream-dim">Luftlinie ab {i.name}.</p>
          <ul className="mt-4 grid gap-3 lg:grid-cols-2">
            {nah.map(({ x, d }) => (
              <ZielRow key={x.id} h={toHit(x, d)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
