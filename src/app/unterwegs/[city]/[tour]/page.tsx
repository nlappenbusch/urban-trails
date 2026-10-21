import { createHash } from "node:crypto";
import { notFound } from "next/navigation";
import { getTour } from "@/lib/tours";
import { audioUrl } from "@/lib/audio-server";
import OfflineTour from "@/components/OfflineTour";
import type { OfflinePack } from "@/lib/offline-types";
export const dynamic = "force-dynamic";
export const metadata = { title: "Unterwegs · Offline & GPS", robots: { index: false, follow: true } };
export default async function Page({ params }: { params: Promise<{ city: string; tour: string }> }) {
  const { city, tour: slug } = await params;
  const tour = getTour(city, slug); if (!tour) notFound();
  const stops = tour.stops.map(s => ({ id: s.id, name: s.name, text: `${s.audioScript}\n\nVor Ort: ${s.insiderTip}${s.photoSpot ? `\nFotospot: ${s.photoSpot}` : ""}`, directions: s.directions ?? "", coords: s.coords, audio: audioUrl(tour, s) }));
  const pack: OfflinePack = { id: `${city}-${slug}`, revision: createHash("sha256").update(JSON.stringify(stops)).digest("hex").slice(0,24), title: tour.name, city, path: `/unterwegs/${city}/${slug}`, stops };
  return <OfflineTour pack={pack} />;
}
