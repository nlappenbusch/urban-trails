import { Building2, Gem, Headphones, Sunset, Trees, Users, UtensilsCrossed, Zap, type LucideProps } from "lucide-react";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  "urban-vibes": Building2,
  "natur-escape": Trees,
  "food-discovery": UtensilsCrossed,
  "people-social": Users,
  "hidden-gems": Gem,
  "sunset-walks": Sunset,
  "adhs-quick": Zap,
  "story-mode": Headphones,
};

/** Kategorie-Symbol (statt Emoji – sieht auf jedem Gerät gleich aus). */
export default function CategoryIcon({ slug, ...props }: { slug?: string } & LucideProps) {
  const Icon = (slug && ICONS[slug]) || Gem;
  return <Icon aria-hidden="true" strokeWidth={2} {...props} />;
}
