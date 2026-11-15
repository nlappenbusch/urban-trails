import type { MetadataRoute } from "next";
import { tours } from "@/lib/tours";
import { destinations } from "@/data/destinations";
import { SITE_URL } from "@/lib/seo";
import { categories } from "@/lib/categories";
import { allRegions, trips } from "@/lib/ausfluege";
import { regionPlaces, themaPages } from "@/lib/themen";

export default function sitemap(): MetadataRoute.Sitemap {
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
    { url: `${SITE_URL}/ausfluege/ki`, changeFrequency: "monthly", priority: 0.8 },
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
  return [...staticPages, ...cityPages, ...tourPages].map((p) => ({ ...p, lastModified }));
}
