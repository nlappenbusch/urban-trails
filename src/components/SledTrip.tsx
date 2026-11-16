"use client";

import { useEffect, useState } from "react";
import { ArrowDown, TrainFront } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { sbbLink } from "@/lib/ski-core";
import { fmtMin } from "@/lib/ausfluege-core";

interface Conn { min: number; dep: string; arr: string; transfers: number }
const hm = (s: string) => new Date(s).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });

async function conns(from: string, to: string, date: string, time: string, arrival = false): Promise<Conn[]> {
  const q = new URLSearchParams({ from, to, date, time, ...(arrival ? { ankunft: "1" } : {}) });
  const r = await fetch(`/api/oev?${q}`);
  if (!r.ok) return [];
  const j = (await r.json()) as { connections?: { durationMin: number; dep: string; arr: string; transfers: number }[] };
  return (j.connections ?? []).map((c) => ({ min: c.durationMin, dep: hm(c.dep), arr: hm(c.arr), transfers: c.transfers }));
}

/** Schlitteltag: mit dem ÖV hinauf zur Bergstation, unten an der Talstation wieder heim. */
export default function SledTrip({ up, down, days }: { up: string; down?: string; days: { date: string; label: string }[] }) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [date, setDate] = useState(days[0]?.date ?? "");
  const [there, setThere] = useState<Conn[] | null>(null);
  const [back, setBack] = useState<Conn[] | null>(null);
  const [busy, setBusy] = useState(false);
  const home = down ?? up;

  useEffect(() => setStart(loadStart()), []);
  useEffect(() => {
    if (!start?.name || !date) return;
    let alive = true;
    setBusy(true);
    Promise.all([conns(start.name, up, date, "10:30", true), conns(home, start.name, date, "15:30")])
      .then(([a, b]) => alive && (setThere(a.slice(-2)), setBack(b.slice(0, 3))))
      .catch(() => alive && (setThere([]), setBack([])))
      .finally(() => alive && setBusy(false));
    return () => {
      alive = false;
    };
  }, [start?.name, up, home, date]);

  const box = (title: React.ReactNode, list: Conn[] | null, link: string) => (
    <div className="rounded-xl bg-ink-800/60 p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-cream">{title}</p>
      {busy ? (
        <p className="mt-2 text-sm text-cream-dim">Fahrplan wird geladen …</p>
      ) : list?.length ? (
        <ul className="mt-2 space-y-1 text-sm text-cream-dim">
          {list.map((c, i) => (
            <li key={i}><strong className="text-cream">ab {c.dep} → an {c.arr}</strong> · {fmtMin(c.min)}{c.transfers ? `, ${c.transfers}× umst.` : ", direkt"}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-cream-dim">Keine Verbindung gefunden – Bergbahn fährt evtl. nur in der Saison.</p>
      )}
      <a href={link} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">SBB-Fahrplan</a>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <StationPicker value={start} onChange={setStart} label="Wo wohnst du?" />
        <label className="text-sm font-bold text-cream">
          Welcher Tag?
          <select value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 block min-h-[44px] rounded-xl border border-cream/20 bg-ink-900 px-3 text-sm font-normal text-cream">
            {days.map((d) => <option key={d.date} value={d.date}>{d.label}</option>)}
          </select>
        </label>
      </div>
      {!start?.name ? (
        <p className="text-sm text-cream-dim">Gib deinen Wohnort ein – wir zeigen, wie du bis 10.30 Uhr oben bist und ab der Talstation wieder heimkommst.</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {box(<><TrainFront size={16} aria-hidden /> Hinauf bis {up}</>, there, sbbLink(start.name, up, date, "10:30"))}
          {box(<><ArrowDown size={16} aria-hidden /> Heim ab {home}, ab 15.30 Uhr</>, back, sbbLink(home, start.name, date, "15:30"))}
        </div>
      )}
    </div>
  );
}
