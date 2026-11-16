import type { Metadata } from "next";
import Link from "next/link";
import { allRegions, places } from "@/lib/ausfluege";
import { THEMEN, regionPlaces, themaPages } from "@/lib/themen";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import { imgAttrs } from "@/lib/img";
import AusflugTools from "@/components/AusflugTools";

const TITLE = "Ausflugsziele Schweiz – geprüft, mit Preisen und fertigem Programm";
const DESC =
  "Ausflugsziele in der ganzen Schweiz, jedes einzeln geprüft: mit Eintrittspreis, Öffnungszeiten, Foto und einem fertigen Tagesprogramm – auch bei Regen, mit Kindern, zu zweit oder günstig.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/ausflugsziele" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/ausflugsziele" }),
};

export default function AusflugszielePage() {
  const regions = allRegions()
    .map((r) => ({ ...r, ps: regionPlaces(r.slug) }))
    .filter((r) => r.ps.length >= 4)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
  const pages = themaPages();
  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflugsziele", path: "/ausflugsziele" }])) }} />
      <h1 className="headline max-w-3xl text-4xl text-cream sm:text-6xl">
        {places.length} Orte. <em>Alle geprüft.</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Keine Liste mit tausend Einträgen aus dem Jahr 2014, sondern Orte, bei denen wir Preis, Öffnungszeiten und Adresse
        nachgeschaut haben – und die du mit einem Klick zu einem Programm mit Zugverbindung machst.
      </p>

      <div className="mt-8"><AusflugTools /></div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((r) => {
          const img = r.ps.find((p) => p.img && p.kind !== "hotel" && p.kind !== "restaurant")?.img;
          const themen = pages.filter((x) => x.region === r.slug).map((x) => THEMEN.find((t) => t.slug === x.thema)!);
          return (
            <li key={r.slug} className="card flex flex-col overflow-hidden">
              <Link href={`/ausflugsziele/${r.slug}`} className="group block">
                {img ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={img.small} {...imgAttrs(img, "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw")} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
                ) : (
                  <div className="aspect-[16/9] w-full bg-ink-800" />
                )}
                <span className="block px-4 pt-4 font-display text-xl font-extrabold tracking-tight text-cream decoration-2 underline-offset-4 group-hover:underline">{r.name}</span>
                <span className="block px-4 text-sm text-cream-dim">{r.ps.length} geprüfte Orte</span>
              </Link>
              {themen.length > 0 && (
                <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 p-4 pt-3 text-sm">
                  {themen.map((t) => (
                    <Link key={t.slug} href={`/ausflugsziele/${r.slug}/${t.slug}`} className="font-semibold text-signal-600 hover:text-signal-500">{t.label}</Link>
                  ))}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
