import type { Tour } from "@/lib/types";
import { toTourLite } from "@/lib/tour-lite";
import TourCardView from "@/components/TourCardView";

export default function TourCard({ tour }: { tour: Tour }) {
  return <TourCardView t={toTourLite(tour)} />;
}
