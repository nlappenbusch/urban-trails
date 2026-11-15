"use client";

import { useEffect, useState } from "react";
import { Car, TrainFront } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { carEstimate, carLink, crowKm, oevEstimate, sbbLink } from "@/lib/ski-core";
import { addDays, fmtMin } from "@/lib/ausfluege-core";
import HotelCheck from "@/components/HotelCheck";

interface Conn { min: number; dep: string; arr: string; transfers: number }

const nextSaturday = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return d.toISOString().slice(0, 10);
};
const hm = (s: string) => new Date(s).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });

/** Anreise zu einem Skigebiet: Zug (echte Verbindung) und Auto (Schätzung + Route). */
export default function SkiTravel({ to, station, name, hotelPlace }: { to: { lat: number; lng: number }; station: string; name: string; hotelPlace?: string }) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [date, setDate] = useState(nextSaturday());
  const [nights, setNights] = useState(1);
  const [conns, setConns] = useState<Conn[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setStart(loadStart()), []);

  useEffect(() => {
    if (!start?.name) return;
    let alive = true;
    setBusy(true);
    const q = new URLSearchParams({ from: start.name, to: station, date, time: "07:00" });
    fetch(`/api/oev?${q}`)
      .then((r) => (r.ok ? r.json() : { connections: [] }))
      .then((j: { connections?: { durationMin: number; dep: string; arr: string; transfers: number }[] }) => {
        if (alive) setConns((j.connections ?? []).slice(0, 3).map((c) => ({ min: c.durationMin, dep: hm(c.dep), arr: hm(c.arr), transfers: c.transfers })));
      })
      .catch(() => alive && setConns([]))
      .finally(() => alive && setBusy(false));
    return () => {
      alive = false;
    };
  }, [start?.name, station, date]);

  const d = start?.lat && start.lng ? crowKm({ lat: start.lat, lng: start.lng }, to) : undefined;
  const car = d !== undefined ? carEstimate(d) : undefined;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <StationPicker value={start} onChange={setStart} label="Ab wo fährst du los?" />
        <label className="text-sm font-bold text-cream">
          Wann?
          <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="mt-2 block min-h-[44px] rounded-xl border border-cream/20 bg-ink-900 px-3 text-sm font-normal text-cream" />
        </label>
      </div>
      {!start?.name ? (
        <p className="text-sm text-cream-dim">Wähl deinen Startort – dann siehst du Zug und Auto im Vergleich.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-ink-800/60 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-cream"><TrainFront size={16} aria-hidden /> Zug & Bus bis {station}</p>
            {busy && !conns ? (
              <p className="mt-2 text-sm text-cream-dim">Fahrplan wird geladen …</p>
            ) : conns && conns.length ? (
              <ul className="mt-2 space-y-1 text-sm text-cream-dim">
                {conns.map((c, i) => (
                  <li key={i}><strong className="text-cream">{c.dep} → {c.arr}</strong> · {fmtMin(c.min)}{c.transfers ? `, ${c.transfers}× umsteigen` : ", direkt"}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-cream-dim">ca. <strong className="text-cream">{fmtMin(oevEstimate(d ?? 60))}</strong> (Schätzung)</p>
            )}
            <a href={sbbLink(start.name, station, date, "07:00")} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">Im SBB-Fahrplan öffnen</a>
          </div>
          <div className="rounded-xl bg-ink-800/60 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-cream"><Car size={16} aria-hidden /> Auto bis {name}</p>
            {car && <p className="mt-2 text-sm text-cream-dim">ca. <strong className="text-cream">{fmtMin(car.min)}</strong> · rund {car.km} km (ohne Stau, Schneeketten mitnehmen)</p>}
            <a href={carLink(start, to)} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">Route in Google Maps</a>
          </div>
        </div>
      )}
      {hotelPlace && (
        <div className="border-t border-cream/10 pt-5">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-bold text-cream">Bleiben?</span>
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" aria-pressed={nights === n} onClick={() => setNights(n)} className={`min-h-[36px] rounded-full border px-3 font-semibold ${nights === n ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 text-cream-dim hover:border-cream/40"}`}>
                {n} {n === 1 ? "Nacht" : "Nächte"}
              </button>
            ))}
          </div>
          <HotelCheck place={hotelPlace} checkin={date} checkout={addDays(date, nights)} />
        </div>
      )}
    </div>
  );
}
