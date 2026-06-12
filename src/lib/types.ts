/**
 * Zentrales Datenmodell für Urban Trails Switzerland.
 * Multi-City von Anfang an: Destination → Tour → Stop.
 */

export type Mood =
  | "menschen"
  | "ruhe"
  | "aussicht"
  | "essen"
  | "kultur"
  | "fotografie"
  | "natur"
  | "ueberraschung";

export type Difficulty = "leicht" | "mittel" | "anspruchsvoll";

/** Erlebnis-Kategorien (Nils' Konzept) */
export type Category =
  | "urban-vibes"
  | "natur-escape"
  | "food-discovery"
  | "people-social"
  | "hidden-gems"
  | "sunset-walks"
  | "adhs-quick"
  | "story-mode";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface NearbyTip {
  name: string;
  type: "cafe" | "bar" | "restaurant" | "shop" | "kino" | "club";
  note: string;
  /** Konkrete Adresse, z.B. "Geroldstrasse 23, 8005 Zürich" */
  address?: string;
}

export interface Stop {
  id: string;
  name: string;
  teaser: string;
  coords: GeoPoint;
  walkMinutesFromPrevious: number;
  directions?: string;
  stayMinutes: number;
  why: string;
  story: string;
  funFact: string;
  insiderTip: string;
  photoSpot?: string;
  nearby?: NearbyTip[];
  /** Deutsches Audioguide-Skript, 60–120 Sekunden Sprechzeit */
  audioScript: string;
  /** Fertige Audio-Datei (z.B. /audio/winterthur/stop-01.mp3) – hat Vorrang vor TTS */
  audioFile?: string;
  isHiddenGem?: boolean;
  imageHint?: string;
  /** Social-Discovery: Wie gut eignet sich der Ort, um Leute kennenzulernen? */
  social?: SocialInfo;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StopImage {
  url: string;
  alt: string;
  /** Link zur Quell-/Lizenzseite (z.B. Wikimedia Commons) */
  credit: string;
}

/** Social-Discovery-Bewertung: Wie fühlt sich der Ort alleine an? */
export interface SocialInfo {
  alleinOk: string;
  gespraech: string;
  publikum: string;
  besteZeit: string;
}

export interface Tour {
  slug: string;
  citySlug: string;
  name: string;
  claim: string;
  teaser: string;
  description: string;
  moods: Mood[];
  /** Erlebnis-Kategorie für Filter & Kategorie-Seiten */
  category?: Category;
  audience: string;
  vibe: string;
  bestTimeOfDay: string;
  bestSeason: string;
  difficulty: Difficulty;
  durationMinutes: number;
  distanceKm: number;
  startPoint: string;
  endPoint: string;
  publicTransport: { start: string; end: string };
  stops: Stop[];
  isPremium: boolean;
  priceChf?: number;
  gradient: [string, string];
  heroImage?: string;
  imageHint?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  faq: FaqItem[];
}

export interface Destination {
  slug: string;
  name: string;
  canton: string;
  teaser: string;
  description: string;
  center: GeoPoint;
  comingSoon?: boolean;
}
