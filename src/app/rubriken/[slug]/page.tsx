import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RUBRIKEN, getRubrik, itemsOf } from "@/lib/rubriken";
import { socialMeta } from "@/lib/seo";
import RubrikView, { rubrikDesc, rubrikTitle } from "../view";

export const dynamicParams = false;
export const revalidate = 3600;
export const generateStaticParams = () => RUBRIKEN.map((r) => ({ slug: r.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getRubrik((await params).slug);
  if (!r) return {};
  const items = itemsOf(r.slug);
  const title = rubrikTitle(r, undefined, items.length);
  const description = rubrikDesc(r, undefined, items);
  const img = items.find((i) => i.img)?.img;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/rubriken/${r.slug}` },
    ...socialMeta({ title, description, path: `/rubriken/${r.slug}`, ...(img ? { image: { url: img.src, small: img.src, alt: r.label, width: img.w, height: img.h, credit: img.page } } : {}) }),
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const r = getRubrik((await params).slug);
  if (!r) notFound();
  return <RubrikView r={r} items={itemsOf(r.slug)} />;
}
