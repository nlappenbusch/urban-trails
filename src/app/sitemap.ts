import type { MetadataRoute } from "next";
import { tours } from "@/lib/tours";
import { destinations } from "@/data/destinations";
import { SITE_URL } from "@/lib/seo";
import { categories } from "@/lib/categories";
import { allRegions, trips } from "@/lib/ausfluege";
import { regionPlaces, themaPages } from "@/lib/themen";
import { skiAreas } from "@/lib/ski";
import { offers as nightOffers } from "@/lib/nachtski";
import { riverTemps } from "@/lib/wasser";
import { LAKES, lakeSlug } from "@/lib/wasser-core";
import { RUBRIKEN, rubrikItems, rubrikKantonPages } from "@/lib/rubriken";
import { hatInhalt } from "@/lib/hit";
import { zielHref } from "@/lib/ziel";
import { ANLAESSE } from "@/lib/anlass";
import { markets } from "@/lib/maerkte";
import { runs as sledRuns } from "@/lib/schlitteln";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rivers = await riverTemps().catch(() => []);
  const waterPages: MetadataRoute.Sitemap = [
    ...LAKES.map((l) => ({ url: `${SITE_URL}/wassertemperaturen/${lakeSlug(l)}`, changeFrequency: "hourly" as const, priority: 0.7 })),
    ...rivers.filter((r) => r.slug).map((r) => ({ url: `${SITE_URL}/wassertemperaturen/${r.slug}`, changeFrequency: "hourly" as const, priority: 0.6 })),
  ];
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/touren`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/destinationen`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/kategorien`, changeFrequency: "weekly", priority: 0.8 },
    ...categories.map((c) => ({
      url: `${SITE_URL}/kategorien/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/fuehrung`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ausfluege`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/ausfluege/planen`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/ausfluege/heute`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/ausfluege/ueberraschung`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/geschenk`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/wassertemperaturen`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/skigebiete`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/nachtskifahren`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/sonnige-skigebiete`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/ausfluege/ki`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/rubriken`, changeFrequency: "weekly", priority: 0.8 },
    ...ANLAESSE.map((a) => ({ url: `${SITE_URL}/ausflug/${a.slug}`, changeFrequency: "weekly" as const, priority: a.kind === "thema" ? 0.8 : 0.7 })),
    { url: `${SITE_URL}/feste`, changeFrequency: "weekly", priority: 0.8 },
    ...RUBRIKEN.map((r) => ({ url: `${SITE_URL}/rubriken/${r.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...rubrikKantonPages().map((p) => ({ url: `${SITE_URL}/rubriken/${p.slug}/${p.kanton}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...rubrikItems().filter(hatInhalt).map((i) => ({ url: `${SITE_URL}${zielHref(i)}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: `${SITE_URL}/weihnachtsmaerkte`, changeFrequency: "daily", priority: 0.9 },
    ...markets().map((m) => ({ url: `${SITE_URL}/weihnachtsmaerkte/${m.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/schlitteln`, changeFrequency: "weekly", priority: 0.8 },
    ...sledRuns().map((r) => ({ url: `${SITE_URL}/schlitteln/${r.id}`, changeFrequency: "daily" as const, priority: 0.6 })),
    ...skiAreas.map((a) => ({ url: `${SITE_URL}/skigebiete/${a.id}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...nightOffers.map((o) => ({ url: `${SITE_URL}/nachtskifahren/${o.id}`, changeFrequency: "daily" as const, priority: 0.7 })),
    ...trips.map((t) => ({ url: `${SITE_URL}/ausfluege/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/ausflugsziele`, changeFrequency: "weekly", priority: 0.9 },
    ...allRegions()
      .filter((r) => regionPlaces(r.slug).length >= 4)
      .map((r) => ({ url: `${SITE_URL}/ausflugsziele/${r.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...themaPages().map((x) => ({ url: `${SITE_URL}/ausflugsziele/${x.region}/${x.thema}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    {
      url: `${SITE_URL}/ueberrasche-mich`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const cityPages: MetadataRoute.Sitemap = destinations
    .filter((d) => !d.comingSoon)
    .map((d) => ({
      url: `${SITE_URL}/${d.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const tourPages: MetadataRoute.Sitemap = tours.map((t) => ({
    url: `${SITE_URL}/${t.citySlug}/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const lastModified = new Date(); // Stand des Builds = Stand der Inhalte
  return [...staticPages, ...waterPages, ...cityPages, ...tourPages].map((p) => ({ ...p, lastModified }));
}
