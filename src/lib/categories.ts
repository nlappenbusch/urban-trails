import type { Category, Tour } from "@/lib/types";
import { tours } from "@/lib/tours";

export interface CategoryInfo {
  slug: Category;
  name: string;
  emoji: string;
  claim: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  {
    slug: "urban-vibes",
    name: "Urban Vibes",
    emoji: "🌆",
    claim: "Industrie, Streetart, Rooftops – die raue, kreative Seite der Städte.",
    description:
      "Container-Türme statt Kirchtürme: Touren durch Quartiere im Wandel, mit Streetart, Zwischennutzungen und der besten Aussicht von ganz oben.",
  },
  {
    slug: "natur-escape",
    name: "Natur & Escape",
    emoji: "🌿",
    claim: "Wald, Wasser, Weitblick – der Reset-Knopf für Bildschirm-Tage.",
    description:
      "Wenn der Kopf voll ist: Routen, die dich in unter einer Stunde aus dem Lärm holen – Grate, Flussufer, Aussichtspunkte, Sonnenuntergänge.",
  },
  {
    slug: "food-discovery",
    name: "Food Discovery",
    emoji: "🍜",
    claim: "Essen ist die beste Stadtführung.",
    description:
      "Markthallen, Quartierbeizen, Kaffeeröster: Touren, bei denen die besten Stops die sind, an denen du sitzen bleibst.",
  },
  {
    slug: "people-social",
    name: "People & Social",
    emoji: "👥",
    claim: "Touren, die nicht an Gebäuden enden – sondern bei Menschen.",
    description:
      "Mit Social-Check bei jedem Spot und Mikro-Aufgaben, die Gespräche starten: für Solo-Traveller, Neu-Zuzüger und alle, die Anschluss suchen.",
  },
  {
    slug: "hidden-gems",
    name: "Hidden Gems",
    emoji: "💎",
    claim: "Orte, die kein Reiseführer kennt.",
    description:
      "Erosionskessel, Friedhofs-Alleen, vergessene Bergstädtchen: Routen für alle, die das Standard-Programm längst durch haben.",
  },
  {
    slug: "sunset-walks",
    name: "Sunset Walks",
    emoji: "🌅",
    claim: "Getaktet auf die goldene Stunde.",
    description:
      "Touren, deren Finale mit dem Sonnenuntergang zusammenfällt – Startzeit-Empfehlung inklusive.",
  },
  {
    slug: "adhs-quick",
    name: "Quick Adventures",
    emoji: "⚡",
    claim: "Alle 10 Minuten ein neuer Reiz – maximale Dichte, null Längen.",
    description:
      "Kompakt-Routen unter 90 Minuten: ständig neue Eindrücke, ÖV-nah abbrechbar, perfekt für spontane Lücken im Tag.",
  },
  {
    slug: "story-mode",
    name: "Story Mode",
    emoji: "🎧",
    claim: "Geschichte als Kopfkino – Audio an, Stadt neu sehen.",
    description:
      "Die erzählstärksten Touren: Reformation, Relativitätstheorie, Generalstreik – Weltgeschichte an Originalschauplätzen.",
  },
];

export function getCategory(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getToursByCategory(slug: Category): Tour[] {
  return tours.filter((t) => t.category === slug);
}
