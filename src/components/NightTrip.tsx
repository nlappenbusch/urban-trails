"use client";

import { useEffect, useState } from "react";
import { Car, Moon, TrainFront } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { carEstimate, carLink, crowKm, sbbLink } from "@/lib/ski-core";
import { fmtMin } from "@/lib/ausfluege-core";

interface Conn { min: number; dep: string; arr: string; depDay: string; arrDay: string; transfers: number }

const hm = (s: string) => new Date(s).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
const day = (s: string) => new Date(s).toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
const shift = (t: string, min: number) => {
  const m = (Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5)) + min + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};
const nextDay = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("sv-SE");
};

async function conns(from: string, to: string, date: string, time: string, arrival = false): Promise<Conn[]> {
  const q = new URLSearchParams({ from, to, date, time, ...(arrival ? { ankunft: "1" } : {}) });
  const r = await fetch(`/api/oev?${q}`);
  if (!r.ok) return [];
  const j = (await r.json()) as { connections?: { durationMin: number; dep: string; arr: string; transfers: number }[] };
  return (j.connections ?? []).map((c) => ({ min: c.durationMin, dep: hm(c.dep), arr: hm(c.arr), depDay: day(c.dep), arrDay: day(c.arr), transfers: c.transfers }));
}

/**
 * Hin und – das Entscheidende beim Nachtskifahren – zurück:
 * Ankunft rechtzeitig vor Pistenstart, und der erste Zug nach Pistenschluss.
 */
export default function NightTrip({ station, to, from, end, nights }: { station: string; to: { lat: number; lng: number }; from: string; end: string; nights: { date: string; label: string }[] }) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [date, setDate] = useState(nights[0]?.date ?? "");
  const [there, setThere] = useState<Conn[] | null>(null);
  const [back, setBack] = useState<Conn[] | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setStart(loadStart()), []);

  const backTime = end ? shift(end, 15) : shift(from, 180);
  const backDate = end && end < from ? nextDay(date) : date; // Piste bis nach Mitternacht

  useEffect(() => {
    if (!start?.name || !date) return;
    let alive = true;
    setBusy(true);
    setThere(null);
    setBack(null);
    Promise.all([conns(start.name, station, date, shift(from, -20), true), conns(station, start.name, backDate, backTime)])
      .then(([a, b]) => {
        if (!alive) return;
        setThere(a.slice(-2));
        setBack(b.slice(0, 3));
      })
      .catch(() => alive && (setThere([]), setBack([])))
      .finally(() => alive && setBusy(false));
    return () => {
      alive = false;
    };
  }, [start?.name, station, date, from, backDate, backTime]);

  const d = start?.lat && start.lng ? crowKm({ lat: start.lat, lng: start.lng }, to) : undefined;
  const car = d !== undefined ? carEstimate(d) : undefined;
  const firstBack = back?.[0];
  const lateHome = firstBack && firstBack.arrDay > date;
  const stranded = back !== null && back.length === 0 && !busy;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <StationPicker value={start} onChange={setStart} label="Wo wohnst du?" />
        {nights.length > 0 && (
          <label className="text-sm font-bold text-cream">
            Welcher Abend?
            <select value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 block min-h-[44px] rounded-xl border border-cream/20 bg-ink-900 px-3 text-sm font-normal text-cream">
              {nights.map((n) => (
                <option key={n.date} value={n.date}>{n.label}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {!start?.name ? (
        <p className="text-sm text-cream-dim">Gib deinen Wohnort ein – wir zeigen, welcher Zug dich rechtzeitig hinbringt und wie du nach Pistenschluss heimkommst.</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="rounded-xl bg-ink-800/60 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-cream"><TrainFront size={16} aria-hidden /> Hin, an bis {shift(from, -20)}</p>
            {busy ? (
              <p className="mt-2 text-sm text-cream-dim">Fahrplan wird geladen …</p>
            ) : there?.length ? (
              <ul className="mt-2 space-y-1 text-sm text-cream-dim">
                {there.map((c, i) => (
                  <li key={i}><strong className="text-cream">ab {c.dep} → an {c.arr}</strong> · {fmtMin(c.min)}{c.transfers ? `, ${c.transfers}× umst.` : ", direkt"}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-cream-dim">Keine Verbindung gefunden.</p>
            )}
            <a href={sbbLink(start.name, station, date, shift(from, -20))} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">SBB-Fahrplan</a>
          </div>

          <div className={`rounded-xl p-4 ${stranded || lateHome ? "bg-signal-500/15 ring-1 ring-signal-500/50" : "bg-ink-800/60"}`}>
            <p className="flex items-center gap-2 text-sm font-bold text-cream"><Moon size={16} aria-hidden /> Zurück nach Pistenschluss</p>
            {busy ? (
              <p className="mt-2 text-sm text-cream-dim">Fahrplan wird geladen …</p>
            ) : back?.length ? (
              <>
                <ul className="mt-2 space-y-1 text-sm text-cream-dim">
                  {back.map((c, i) => (
                    <li key={i}>
                      <strong className="text-cream">ab {c.dep} → an {c.arr}</strong>{c.arrDay > date ? " (nach Mitternacht)" : ""} · {fmtMin(c.min)}{c.transfers ? `, ${c.transfers}× umst.` : ""}
                    </li>
                  ))}
                </ul>
                {lateHome && <p className="mt-2 text-sm font-semibold text-cream">Heimkommen erst nach Mitternacht – Nachtzug prüfen oder Auto nehmen.</p>}
              </>
            ) : (
              <p className="mt-2 text-sm font-semibold text-cream">Nach {backTime} fährt heute nichts mehr heim. Früher aufhören oder Auto nehmen.</p>
            )}
            <a href={sbbLink(station, start.name, backDate, backTime)} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">SBB-Fahrplan</a>
          </div>

          <div className="rounded-xl bg-ink-800/60 p-4">
            <p className="flex items-center gap-2 text-sm font-bold text-cream"><Car size={16} aria-hidden /> Mit dem Auto</p>
            {car && <p className="mt-2 text-sm text-cream-dim">ca. <strong className="text-cream">{fmtMin(car.min)}</strong> pro Weg · rund {car.km} km. Nachts glatt – Winterreifen, Ketten dabei.</p>}
            <a href={carLink(start, to)} target="_blank" rel="noopener" className="mt-3 inline-flex text-sm font-bold text-signal-600 hover:text-signal-500">Route in Google Maps</a>
          </div>
        </div>
      )}
    </div>
  );
}
