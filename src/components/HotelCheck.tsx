"use client";

import { useState } from "react";
import { BedDouble, ExternalLink } from "lucide-react";
import { bookingLink } from "@/lib/booking";

const RANGES: [number, number][] = [[0, 150], [100, 250], [200, 400], [350, 9999]];
const label = ([a, b]: [number, number]) => (b >= 9999 ? `ab CHF ${a}` : a === 0 ? `bis CHF ${b}` : `CHF ${a}–${b}`);

/** Freie Zimmer im Zeitraum und in der Preisspanne – öffnet Booking.com fertig gefiltert. */
export default function HotelCheck({ place, checkin, checkout, adults = 2 }: { place: string; checkin?: string; checkout?: string; adults?: number }) {
  const [range, setRange] = useState<[number, number]>(RANGES[1]);
  const nights = checkin && checkout ? Math.round((Date.parse(checkout) - Date.parse(checkin)) / 86_400_000) : 0;
  const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric" });
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-bold text-cream"><BedDouble size={16} aria-hidden /> Noch was frei?</p>
      <p className="mt-1 text-sm text-cream-dim">
        {checkin && checkout ? <>{fmt(checkin)} bis {fmt(checkout)} ({nights} {nights === 1 ? "Nacht" : "Nächte"}), {adults} Personen, Preis pro Nacht:</> : <>Datum oben wählen, dann Preis pro Nacht:</>}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button key={r[0]} type="button" aria-pressed={range === r} onClick={() => setRange(r)} className={`min-h-[36px] rounded-full border px-3 text-sm font-semibold ${range === r ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 text-cream-dim hover:border-cream/40"}`}>{label(r)}</button>
        ))}
      </div>
      <a href={bookingLink({ ss: place, checkin, checkout, adults, min: range[0], max: range[1] >= 9999 ? undefined : range[1] })} target="_blank" rel="noopener sponsored" className="btn-secondary mt-3 min-h-[40px] py-1.5 text-sm">
        <ExternalLink size={14} aria-hidden /> Freie Hotels in {place} zeigen
      </a>
      <p className="mt-1.5 text-xs text-cream-faint">Öffnet Booking.com mit Datum und Preisfilter – dort siehst du sofort, was noch frei ist.</p>
    </div>
  );
}
