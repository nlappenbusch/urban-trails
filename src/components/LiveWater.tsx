"use client";

import { useEffect, useState } from "react";
import { Waves } from "lucide-react";
import { waterFeel, type WaterReading } from "@/lib/wasser-core";

// Alle Badeorte einer Seite in EINER Abfrage holen
const queue = new Set<string>();
const waiting = new Map<string, ((r: WaterReading | null) => void)[]>();
const known = new Map<string, WaterReading | null>();
let timer: ReturnType<typeof setTimeout> | undefined;

function load(id: string): Promise<WaterReading | null> {
  if (known.has(id)) return Promise.resolve(known.get(id)!);
  return new Promise((resolve) => {
    waiting.set(id, [...(waiting.get(id) ?? []), resolve]);
    queue.add(id);
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const ids = [...queue];
      queue.clear();
      let readings: Record<string, WaterReading> = {};
      try {
        const res = await fetch(`/api/wasser?ids=${ids.join(",")}`);
        if (res.ok) readings = (await res.json()).readings ?? {};
      } catch {
        /* offline */
      }
      for (const x of ids) {
        known.set(x, readings[x] ?? null);
        (waiting.get(x) ?? []).forEach((cb) => cb(readings[x] ?? null));
        waiting.delete(x);
      }
    }, 60);
  });
}

export const ago = (iso: string) => {
  const min = Math.round((Date.now() - Date.parse(iso)) / 60_000);
  if (min < 0) return "Modellwert jetzt";
  if (min < 60) return `vor ${Math.max(1, min)} Min.`;
  if (min < 48 * 60) return `vor ${Math.round(min / 60)} Std.`;
  return `vor ${Math.round(min / 1440)} Tagen`;
};

/** «Wasser jetzt 11,2 °C (kalt) · Aare, Bern-Schönau · BAFU vor 10 Min.» */
export default function LiveWater({ id, className = "" }: { id: string; className?: string }) {
  const [r, setR] = useState<WaterReading | null | undefined>(known.get(id));
  useEffect(() => {
    let alive = true;
    load(id).then((x) => alive && setR(x));
    return () => {
      alive = false;
    };
  }, [id]);
  if (!r) return null;
  return (
    <p className={`inline-flex flex-wrap items-center gap-x-1.5 text-sm ${className}`}>
      <Waves size={14} className="text-sky-600" aria-hidden />
      <span className="font-semibold text-cream">Wasser jetzt {r.temp.toLocaleString("de-CH")} °C</span>
      <span className="text-cream-dim">({waterFeel(r.temp)})</span>
      <span className="text-xs text-cream-faint">· {r.source === "BAFU" ? `Messung ${r.label}` : `${r.body}, Modell Eawag`} · {ago(r.at)}</span>
    </p>
  );
}
