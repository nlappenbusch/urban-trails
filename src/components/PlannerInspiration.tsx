"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Shuffle, TrainFront, Umbrella } from "lucide-react";
import { MOODS, type Place } from "@/lib/ausfluege-core";
import { loadStart, type StartStation } from "@/components/StationPicker";
import { imgAttrs } from "@/lib/img";

export interface InspoRegion {
  slug: string;
  name: string;
  hotels: boolean;
  center?: { lat: number; lng: number };
}

const MOOD_TAGS: Record<string, string[]> = {
  genuss: ["genuss"],
  kultur: ["kultur"],
  natur: ["see", "berg", "aussicht"],
  aktiv: ["aktiv", "berg"],
  erholung: ["wellness", "see"],
  romantik: ["romantisch", "aussicht"],
  krass: ["besonders", "geheimtipp"],
  wandern: ["wandern"],
  schwimmen: ["baden"],
};
const AUDIENCE_TAG: Record<string, string> = { paar: "romantisch", freunde: "freunde", familie: "familie" };
const AUDIENCE_LABEL: Record<string, string> = { paar: "zu zweit", freunde: "mit Freunden", familie: "für Familien" };

const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};

/**
 * «Inspirier mich»: Ohne Zielwahl zeigt der Planer die Regionen, die zu Begleitung,
 * Lust, Wetter und Dauer am besten passen – mit Begründung aus den geprüften Orten.
 */
export default function PlannerInspiration({ regions, places, input, onPick }: {
  regions: InspoRegion[];
  places: Place[];
  input: { days: number; audience: string; moods: string[]; rain: boolean };
  onPick: (slug: string) => void;
}) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [seed, setSeed] = useState(0);
  useEffect(() => setStart(loadStart()), []);

  const picks = useMemo(() => {
    const wanted = new Set([...input.moods.flatMap((m) => MOOD_TAGS[m] ?? []), AUDIENCE_TAG[input.audience]].filter(Boolean));
    const rnd = (s: string) => {
      // stabiler Zufall je Region und Klick auf «Andere Vorschläge»
      let h = seed * 7919;
      for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
      return ((h >>> 0) % 1000) / 1000;
    };
    return regions
      .filter((r) => input.days === 1 || r.hotels)
      .map((r) => {
        const ps = places.filter((p) => p.region === r.slug && p.kind !== "hotel");
        const matching = ps.filter((p) => p.tags.some((t) => wanted.has(t)));
        const dry = ps.filter((p) => p.weatherProof && p.kind !== "restaurant" && p.kind !== "cafe" && p.kind !== "bar");
        const dist = start?.lat && start.lng && r.center ? km({ lat: start.lat, lng: start.lng }, r.center) : undefined;
        let score = matching.length * 1.2 + ps.length * 0.15 + rnd(r.slug) * 4;
        if (input.rain) score += dry.length * 1.5;
        if (input.audience === "familie") score += ps.filter((p) => p.tags.includes("familie")).length;
        if (dist !== undefined) {
          if (dist < 8) score -= 20; // das ist kein Ausflug, das ist zu Hause
          else if (input.days === 1) score -= Math.max(0, dist - 50) / 5;
          else score -= Math.max(0, dist - 150) / 30;
        }
        const reasons = [
          matching.length > 0 && (input.moods.length || input.audience !== "allein")
            ? `${matching.length} Orte ${input.moods.length ? `für ${input.moods.map((m) => MOODS[m]).join(" & ")}` : AUDIENCE_LABEL[input.audience] ?? ""}`
            : `${ps.length} geprüfte Orte`,
          input.rain ? `${dry.length} mit Dach` : "",
        ].filter(Boolean);
        const img = ps.find((p) => p.img && p.kind !== "restaurant" && p.kind !== "cafe")?.img ?? ps.find((p) => p.img)?.img;
        return { r, score, reasons, img, dist };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [regions, places, input.days, input.audience, input.moods, input.rain, start, seed]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="kicker inline-flex items-center gap-1.5"><Sparkles size={14} aria-hidden /> Inspiration</p>
          <h2 className="headline mt-1 text-3xl text-cream sm:text-4xl">Das passt zu euch</h2>
          <p className="mt-1 max-w-xl text-sm text-cream-dim">
            Gerechnet aus euren Angaben links{start ? ` und der Anreise ab ${start.name}` : ""}. Klick auf ein Ziel, und das Programm steht.
          </p>
        </div>
        <button type="button" onClick={() => setSeed((s) => s + 1)} className="btn-secondary min-h-[44px] py-2 text-sm">
          <Shuffle size={16} aria-hidden /> Andere Vorschläge
        </button>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {picks.map(({ r, reasons, img, dist }) => (
          <li key={r.slug}>
            <button type="button" onClick={() => onPick(r.slug)} className="card group flex h-full w-full flex-col overflow-hidden text-left transition hover:border-cream/30">
              <span className="relative block aspect-[16/9] w-full bg-ink-800">
                {img && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={img.small} {...imgAttrs(img, "(min-width: 640px) 33vw, 100vw")} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <span className="absolute bottom-3 left-4 font-display text-2xl font-extrabold tracking-tight text-white">{r.name}</span>
              </span>
              <span className="flex flex-wrap gap-x-3 gap-y-1 p-4 text-sm text-cream-dim">
                {reasons.map((x) => (
                  <span key={x} className="inline-flex items-center gap-1">{x.includes("Dach") && <Umbrella size={13} aria-hidden />}{x}</span>
                ))}
                {dist !== undefined && <span className="inline-flex items-center gap-1"><TrainFront size={13} aria-hidden /> {Math.round(dist)} km entfernt</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
