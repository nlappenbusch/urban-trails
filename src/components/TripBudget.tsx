import { Wallet } from "lucide-react";
import type { Budget } from "@/lib/ausfluege-core";

/** Grobe Kosten pro Person – nur aus belegten Preisen, Lücken werden genannt. */
export default function TripBudget({ budget }: { budget: Budget }) {
  if (budget.high === 0) return null;
  const range = budget.low === budget.high ? `ca. CHF ${budget.low}` : `ca. CHF ${budget.low}–${budget.high}`;
  return (
    <div className="flex gap-3">
      <Wallet size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden />
      <div>
        <p className="font-semibold text-cream">Kosten pro Person</p>
        <p className="font-display text-xl font-extrabold tracking-tight text-cream">{range}</p>
        <p className="mt-1 text-xs leading-relaxed text-cream-faint">
          Eintritte, Bahnen und Essen laut Preislisten{budget.nights > 0 && budget.hotel ? `, ${budget.nights === 1 ? "eine Nacht" : `${budget.nights} Nächte`} im Doppelzimmer geteilt` : ""}. Ohne Anreise, Getränke und Halbtax-Rabatt.
          {budget.missing.length > 0 && <> Noch ohne Preis: {budget.missing.join(", ")}.</>}
        </p>
      </div>
    </div>
  );
}
