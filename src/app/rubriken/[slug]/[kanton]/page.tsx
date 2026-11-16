import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRubrik, itemsIn, kantonBySlug, rubrikKantonPages, MIN_KANTON } from "@/lib/rubriken";
import { socialMeta } from "@/lib/seo";
import RubrikView, { rubrikDesc, rubrikTitle } from "../../view";

export const dynamicParams = false;
export const revalidate = 3600;
export const generateStaticParams = () => rubrikKantonPages();

type P = { params: Promise<{ slug: string; kanton: string }> };
async function load(params: P["params"]) {
  const { slug, kanton } = await params;
  const r = getRubrik(slug), k = kantonBySlug(kanton);
  if (!r || !k) return null;
  const items = itemsIn(r.slug, k.ak);
  return items.length >= MIN_KANTON ? { r, k, items } : null;
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = await load(params);
  if (!d) return {};
  const title = rubrikTitle(d.r, d.k, d.items.length);
  const description = rubrikDesc(d.r, d.k, d.items);
  const path = `/rubriken/${d.r.slug}/${d.k.slug}`;
  const img = d.items.find((i) => i.img)?.img;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    ...socialMeta({ title, description, path, ...(img ? { image: { url: img.src, small: img.src, alt: d.r.label, width: img.w, height: img.h, credit: img.page } } : {}) }),
  };
}

export default async function Page({ params }: P) {
  const d = await load(params);
  if (!d) notFound();
  return <RubrikView r={d.r} k={d.k} items={d.items} />;
}
