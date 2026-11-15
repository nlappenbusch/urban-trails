import type { Metadata } from "next";
import type { Destination, StopImage, Tour } from "@/lib/types";
import { getDestination } from "@/data/destinations";
import { getTourHeroImage } from "@/data/images";

export const SITE_NAME = "Urban Trails Switzerland";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const absUrl = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u}`);

export function tourUrl(tour: Tour): string {
  return `${SITE_URL}/${tour.citySlug}/${tour.slug}`;
}

/** Open-Graph- und Twitter-Angaben mit Vorschaubild (Next ersetzt openGraph je Seite komplett). */
export function socialMeta(opts: { title: string; description: string; path: string; image?: StopImage; type?: "website" | "article" }): Pick<Metadata, "openGraph" | "twitter"> {
  const images = opts.image
    ? [{ url: absUrl(opts.image.url), alt: opts.image.alt, width: opts.image.width, height: opts.image.height }]
    : undefined;
  return {
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: `${SITE_URL}${opts.path}`,
      siteName: SITE_NAME,
      locale: "de_CH",
      type: opts.type ?? "website",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: opts.title,
      description: opts.description,
      images: images?.map((i) => i.url),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function siteJsonLd(): object[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: "Urban Trails",
      url: SITE_URL,
      inLanguage: "de-CH",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/app-icon.svg`,
    },
  ];
}

export function cityJsonLd(dest: Destination, cityTours: Tour[]): object[] {
  return [
    breadcrumbJsonLd([
      { name: "Destinationen", path: "/destinationen" },
      { name: dest.name, path: `/${dest.slug}` },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Walking-Touren in ${dest.name}`,
      itemListElement: cityTours.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: tourUrl(t),
        name: t.name,
      })),
    },
  ];
}

export function tourJsonLd(tour: Tour): object[] {
  const city = getDestination(tour.citySlug);
  const hero = getTourHeroImage(tour.slug);
  const trip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.seo.metaDescription,
    url: tourUrl(tour),
    inLanguage: "de-CH",
    ...(hero ? { image: absUrl(hero.url) } : {}),
    touristType: tour.audience,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.stops.length,
      itemListElement: tour.stops.map((stop, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristAttraction",
          name: stop.name,
          description: stop.teaser,
          geo: {
            "@type": "GeoCoordinates",
            latitude: stop.coords.lat,
            longitude: stop.coords.lng,
          },
        },
      })),
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    // Alle Touren sind gratis (Entscheid 15.11.2026); isPremium/priceChf bleiben nur im Datenmodell.
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "CHF",
      availability: "https://schema.org/InStock",
    },
    ...(city
      ? {
          touristDestination: {
            "@type": "City",
            name: city.name,
          },
        }
      : {}),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tour.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const crumbs = breadcrumbJsonLd([
    { name: "Destinationen", path: "/destinationen" },
    { name: city?.name ?? tour.citySlug, path: `/${tour.citySlug}` },
    { name: tour.name, path: `/${tour.citySlug}/${tour.slug}` },
  ]);

  return [trip, faq, crumbs];
}
