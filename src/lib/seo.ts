import type { Tour } from "@/lib/types";
import { getDestination } from "@/data/destinations";

export const SITE_NAME = "Urban Trails Switzerland";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function tourUrl(tour: Tour): string {
  return `${SITE_URL}/${tour.citySlug}/${tour.slug}`;
}

export function tourJsonLd(tour: Tour): object[] {
  const city = getDestination(tour.citySlug);
  const trip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.name,
    description: tour.seo.metaDescription,
    url: tourUrl(tour),
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
    ...(tour.isPremium && tour.priceChf
      ? {
          offers: {
            "@type": "Offer",
            price: tour.priceChf,
            priceCurrency: "CHF",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
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

  return [trip, faq];
}
