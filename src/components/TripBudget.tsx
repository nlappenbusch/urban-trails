"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Wallet } from "lucide-react";
import { partyCost, type Budget, type Party } from "@/lib/ausfluege-core";

const KEY = "ut-party";

/** Grobe Kosten – pro Person oder für die eigene Gruppe (Erwachsene, Kinder, Halbtax). */
export default function TripBudget({ budget }: { budget: Budget }) {
  const [party, setParty] = useState<Party>({ adults: 1, kids: 0, halbtax: false });
  const [own, setOwn] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (p && typeof p.adults === "number") {
        setParty(p);
        setOwn(true);
      }
    } catch {
      /* egal */
    }
  }, []);

  function update(p: Party) {
    setParty(p);
    setOwn(true);
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* egal */
    }
  }

  if (budget.high === 0) return null;
  const sum = own ? partyCost(budget, party) : { low: budget.low, high: budget.high };
  const range = sum.low === sum.high ? `ca. CHF ${sum.low}` : `ca. CHF ${sum.low}–${sum.high}`;
  const who = !own ? "pro Person" : `für ${party.adults} Erw.${party.kids ? ` + ${party.kids} ${party.kids === 1 ? "Kind" : "Kinder"}` : ""}${party.halbtax ? ", Halbtax" : ""}`;

  return (
    <div className="flex gap-3">
      <Wallet size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-cream">Kosten {who}</p>
        <p className="font-display text-xl font-extrabold tracking-tight text-cream" aria-live="polite">{range}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-cream-dim">
          <Stepper label="Erwachsene" value={party.adults} min={1} onChange={(v) => update({ ...party, adults: v })} />
          <Stepper label="Kinder 6–15" value={party.kids} min={0} onChange={(v) => update({ ...party, kids: v })} />
          <label className="inline-flex min-h-[32px] items-center gap-1.5">
            <input type="checkbox" checked={party.halbtax} onChange={(e) => update({ ...party, halbtax: e.target.checked })} className="h-4 w-4 accent-[#ff4d00]" /> Halbtax
          </label>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-cream-faint">
          Eintritte, Bahnen und Essen laut Preislisten{budget.nights > 0 && budget.hotel ? `, ${budget.nights === 1 ? "eine Nacht" : `${budget.nights} Nächte`} im Doppelzimmer` : ""}. Ohne Anreise und Getränke. Kinderpreise geschätzt (Bahn/Eintritt halb, Essen 60 %).
          {budget.missing.length > 0 && <> Noch ohne Preis: {budget.missing.join(", ")}.</>}
        </p>
      </div>
    </div>
  );
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label}
      <button type="button" aria-label={`${label} weniger`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-cream/20 text-cream disabled:opacity-40"><Minus size={13} aria-hidden /></button>
      <span className="w-4 text-center font-bold tabular-nums text-cream">{value}</span>
      <button type="button" aria-label={`${label} mehr`} disabled={value >= 12} onClick={() => onChange(value + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-cream/20 text-cream disabled:opacity-40"><Plus size={13} aria-hidden /></button>
    </span>
  );
}
