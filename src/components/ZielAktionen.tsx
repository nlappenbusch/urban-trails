"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Heart, TrainFront } from "lucide-react";
import PointsMap from "@/components/PointsMap";
import { loadStart, type StartStation } from "@/components/StationPicker";
import { merkKey, toggleMerk, useMerkliste, type Merk } from "@/lib/merkliste";
import { crowKm } from "@/lib/ski-core";
import { kmText } from "@/lib/ziel";

/** Kopf-Aktionen der Detailseite: Merken, Anreise ab der eigenen Haltestelle, Website. */
export function ZielAktionen({ item, web }: { item: Omit<Merk, "t">; web?: string }) {
  const [start, setStart] = useState<StartStation | null>(null);
  const list = useMerkliste();
  const on = list.some((x) => merkKey(x.r, x.id) === merkKey(item.r, item.id));
  useEffect(() => setStart(loadStart()), []);
  const d = start?.lat && start.lng ? crowKm({ lat: start.lat, lng: start.lng }, item) : undefined;
  const ziel = `${item.lat},${item.lng}`;
  const anreise = `https://www.google.com/maps/dir/?api=1&destination=${ziel}&travelmode=transit${start?.name ? `&origin=${encodeURIComponent(start.name)}` : ""}`;

  return (
    <div>
      {d !== undefined && (
        <p className="tabnums text-cream-dim">
          <span className="text-2xl font-extrabold tracking-[-0.02em] text-cream">{kmText(d)}</span> km Luftlinie ab {start?.name}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => toggleMerk(item)} aria-pressed={on} className={on ? "btn-secondary min-h-[48px] !text-rose-700" : "btn-primary min-h-[48px]"}>
          <Heart size={18} fill={on ? "currentColor" : "none"} aria-hidden /> {on ? "Gemerkt" : "Merken"}
        </button>
        <a href={anreise} target="_blank" rel="noopener" className="btn-secondary min-h-[48px]">
          <TrainFront size={18} aria-hidden /> Anreise mit ÖV
        </a>
        {web && (
          <a href={web} target="_blank" rel="noopener" className="btn-secondary min-h-[48px]">
            <ExternalLink size={18} aria-hidden /> Website
          </a>
        )}
      </div>
    </div>
  );
}

/** Karte mit diesem Ziel und den Zielen ringsum; Antippen öffnet deren Seite. */
export function ZielKarte({ points, color, hrefs }: { points: { id: string; name: string; lat: number; lng: number; sub?: string }[]; color: string; hrefs: Record<string, string> }) {
  const router = useRouter();
  return <PointsMap points={points} color={color} height={340} onPick={(id) => hrefs[id] && router.push(hrefs[id])} />;
}
