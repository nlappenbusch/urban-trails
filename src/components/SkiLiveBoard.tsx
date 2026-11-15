"use client";

import { useState } from "react";
import { COLOR, type SkiGroup, type SkiItem } from "@/lib/ski-core";

const DOT: Record<SkiItem["status"], string> = {
  open: "bg-emerald-500",
  prep: "bg-amber-400",
  closed: "bg-zinc-300",
  unknown: "border border-cream/30 bg-transparent",
};
const WORD: Record<SkiItem["status"], string> = { open: "offen", prep: "in Vorbereitung", closed: "zu", unknown: "ohne Meldung" };

/** Alles, was die Bergbahn einzeln meldet – als Tabs mit Ampel. */
export default function SkiLiveBoard({ groups, at, stale }: { groups: SkiGroup[]; at?: string; stale?: boolean }) {
  const [tab, setTab] = useState(groups[0]?.key ?? "");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const g = groups.find((x) => x.key === tab) ?? groups[0];
  if (!g) return null;
  const items = onlyOpen ? g.items.filter((i) => i.status === "open") : g.items;
  const known = g.items.some((i) => i.status !== "unknown");
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Bereiche">
        {groups.map((x) => (
          <button
            key={x.key}
            type="button"
            role="tab"
            aria-selected={x.key === g.key}
            onClick={() => setTab(x.key)}
            className={`min-h-[40px] rounded-full border px-3.5 text-sm font-semibold transition ${x.key === g.key ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`}
          >
            {x.title}{" "}
            <span className={x.key === g.key ? "text-white/80" : "text-cream-faint"}>{x.items.some((i) => i.status !== "unknown") ? `${x.open}/${x.total}` : x.total}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cream-dim">
          {known ? <><strong className="text-cream">{g.open} von {g.total}</strong> offen</> : <>{g.total} Einträge – die Bergbahn meldet hier keinen Status</>}
          {at && <span className="text-cream-faint"> · Meldung {at}</span>}
        </p>
        {known && (
          <label className="flex items-center gap-2 text-sm font-semibold text-cream-dim">
            <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} className="h-4 w-4 accent-signal-500" /> nur offene
          </label>
        )}
      </div>
      {stale && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Die letzte Meldung der Bergbahn ist älter als drei Tage – vermutlich ist das Gebiet noch nicht in der Saison.</p>}

      <ul className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {items.map((i, n) => (
          <li key={`${i.name}-${n}`} className="flex items-center gap-2.5 border-b border-cream/5 py-1.5 text-sm">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT[i.status]}`} title={WORD[i.status]} aria-hidden />
            {i.difficulty && i.difficulty !== "route" && <span className={`h-2.5 w-2.5 shrink-0 rotate-45 ${COLOR[i.difficulty].cls}`} title={`Piste ${COLOR[i.difficulty].label}`} aria-hidden />}
            {i.difficulty === "route" && <span className="h-2.5 w-2.5 shrink-0 rotate-45 bg-amber-400" title="Skiroute (nicht präpariert)" aria-hidden />}
            <span className={`min-w-0 flex-1 truncate ${i.status === "open" ? "font-semibold text-cream" : "text-cream-dim"}`}>{i.name}</span>
            <span className="sr-only">{WORD[i.status]}</span>
            {i.type && !/^(Piste|Restaurant|Parkplatz)$/.test(i.type) && <span className="hidden shrink-0 text-xs text-cream-faint sm:inline">{i.type}</span>}
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="mt-4 text-sm text-cream-dim">Gerade ist hier nichts offen.</p>}
      <p className="mt-4 flex flex-wrap gap-4 text-xs text-cream-faint">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> offen</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> in Vorbereitung</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-zinc-300" /> zu</span>
      </p>
    </div>
  );
}
