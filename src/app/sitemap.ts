import type { MetadataRoute } from "next";
import { tours } from "@/lib/tours";
import { destinations } from "@/data/destinations";
import { SITE_URL } from "@/lib/seo";
import { categories } from "@/lib/categories";

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

  return [...staticPages, ...cityPages, ...tourPages];
}
