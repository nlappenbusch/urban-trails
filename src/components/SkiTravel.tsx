"use client";

import { useEffect, useState } from "react";
import { Car, CloudSun, ExternalLink, Home, Ticket, TrainFront, Utensils, Wrench } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { carEstimate, carLink, crowKm, oevEstimate, sbbLink, type MountainDay } from "@/lib/ski-core";
import { addDays, fmtMin } from "@/lib/ausfluege-core";
import HotelCheck from "@/components/HotelCheck";

interface Conn { min: number; dep: string; arr: string; transfers: number }
export interface RentShop { name: string; km: number; website: string; hours: string; rental: boolean; chain?: string; book?: string; lat: number; lng: number }

const nextSaturday = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return d.toLocaleDateString("sv-SE");
};
const hm = (s: string) => new Date(s).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });

async function conns(from: string, to: string, date: string, time: string, arrival = false): Promise<Conn[]> {
  const q = new URLSearchParams({ from, to, date, time, ...(arrival ? { ankunft: "1" } : {}) });
  const r = await fetch(`/api/oev?${q}`);
  if (!r.ok) return [];
  const j = (await r.json()) as { connections?: { durationMin: number; dep: string; arr: string; transfers: number }[] };
  return (j.connections ?? []).map((c) => ({ min: c.durationMin, dep: hm(c.dep), arr: hm(c.arr), transfers: c.transfers }));
}

function Step({ icon: Icon, title, children }: { icon: typeof Car; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pb-5 pl-11 last:pb-0">
      <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-signal-500 text-white"><Icon size={15} aria-hidden /></span>
      <span className="absolute bottom-0 left-[15px] top-9 w-px bg-cream/15" aria-hidden />
      <p className="text-sm font-bold text-cream">{title}</p>
      <div className="mt-1 text-sm text-cream-dim">{children}</div>
    </li>
  );
}

const linkCls = "inline-flex items-center gap-1 font-bold text-signal-600 hover:text-signal-500";

/**
 * Skitag-Planer: Startort und Tag wählen → Zug hin, Miete abholen, Skipass, Wetter,
 * Mittag auf offener Hütte, Zug heim. Auto als Alternative, Hotel bei mehreren Tagen.
 */
export default function SkiTravel({
  to, station, hotelPlace, ticket, ticketUrl, shops = [], food = [], weather = [],
}: {
  to: { lat: number; lng: number };
  station: string;
  name: string;
  hotelPlace?: string;
  ticket?: { from: number; unit: string; note?: string };
  ticketUrl?: string;
  shops?: RentShop[];
  food?: string[];
  weather?: MountainDay[];
}) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [date, setDate] = useState(nextSaturday());
  const [nights, setNights] = useState(1);
  const [there, setThere] = useState<Conn[] | null>(null);
  const [back, setBack] = useState<Conn[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [rentOn, setRentOn] = useState(true);

  useEffect(() => setStart(loadStart()), []);

  useEffect(() => {
    if (!start?.name) return;
    let alive = true;
    setBusy(true);
    Promise.all([conns(start.name, station, date, "09:00", true), conns(station, start.name, date, "16:30")])
      .then(([a, b]) => {
        if (!alive) return;
        setThere(a.slice(-2));
        setBack(b.slice(0, 2));
      })
      .catch(() => alive && (setThere([]), setBack([])))
      .finally(() => alive && setBusy(false));
    return () => {
      alive = false;
    };
  }, [start?.name, station, date]);

  const d = start?.lat && start.lng ? crowKm({ lat: start.lat, lng: start.lng }, to) : undefined;
  const car = d !== undefined ? carEstimate(d) : undefined;
  // nächster Verleih; eine Kette mit Online-Reservierung nur, wenn kaum weiter weg
  const near = [...shops].sort((a, b) => Number(b.rental) - Number(a.rental) || a.km - b.km)[0];
  const chain = shops.filter((s) => s.book).sort((a, b) => a.km - b.km)[0];
  const shop = chain && near && chain.km <= near.km + 0.3 ? chain : near;
  const day = weather.find((w) => w.date === date);
  const today = new Date().toLocaleDateString("sv-SE");

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <StationPicker value={start} onChange={setStart} label="Ab wo fährst du los?" />
        <label className="text-sm font-bold text-cream">
          Welcher Tag?
          <input type="date" value={date} min={today} onChange={(e) => e.target.value && setDate(e.target.value)} className="mt-2 block min-h-[44px] rounded-xl border border-cream/20 bg-ink-900 px-3 text-sm font-normal text-cream" />
        </label>
      </div>
      {shops.length > 0 && (
        <label className="flex items-center gap-2 text-sm text-cream-dim">
          <input type="checkbox" checked={rentOn} onChange={(e) => setRentOn(e.target.checked)} className="h-4 w-4 accent-signal-500" /> Ich brauche Mietski
        </label>
      )}

      {!start?.name ? (
        <p className="text-sm text-cream-dim">Wähl deinen Startort – dann steht dein Skitag: Zug, Miete, Skipass, Mittag und Heimfahrt.</p>
      ) : (
        <ol>
          <Step icon={TrainFront} title={`Hin: an ${station} bis 9 Uhr`}>
            {busy && !there ? (
              "Fahrplan wird geladen …"
            ) : there?.length ? (
              <ul className="space-y-0.5">
                {there.map((c, i) => (
                  <li key={i}><strong className="text-cream">ab {c.dep} → an {c.arr}</strong> · {fmtMin(c.min)}{c.transfers ? `, ${c.transfers}× umst.` : ", direkt"}</li>
                ))}
              </ul>
            ) : (
              <>ca. <strong className="text-cream">{fmtMin(oevEstimate(d ?? 60))}</strong> (Schätzung)</>
            )}
            <p className="mt-1 flex flex-wrap gap-x-3">
              <a href={sbbLink(start.name, station, date, "09:00")} target="_blank" rel="noopener" className={linkCls}>SBB-Fahrplan</a>
              {car && <a href={carLink(start, to)} target="_blank" rel="noopener" className={linkCls}><Car size={13} aria-hidden /> Auto ca. {fmtMin(car.min)}</a>}
            </p>
          </Step>

          {rentOn && shop && (
            <Step icon={Wrench} title={`Miete abholen: ${shop.name}`}>
              <p>{shop.km < 0.3 ? "Direkt bei der Talstation" : `${String(shop.km).replace(".", ",")} km von der Talstation`}{shop.hours && shop.hours.length < 60 ? ` · ${shop.hours.replace(/"/g, "")}` : ""}</p>
              <p className="mt-1 flex flex-wrap gap-x-3">
                {shop.book && <a href={shop.book} target="_blank" rel="noopener sponsored" className={linkCls}>Online reservieren ({shop.chain}) <ExternalLink size={12} aria-hidden /></a>}
                {shop.website && <a href={shop.website} target="_blank" rel="noopener" className={linkCls}>Website</a>}
                <a href={`https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}`} target="_blank" rel="noopener" className={linkCls}>Karte</a>
              </p>
              {shops.length > 1 && <p className="mt-1 text-xs text-cream-faint">{shops.length - 1} weitere Shops weiter unten auf der Seite.</p>}
            </Step>
          )}

          {ticket && (
            <Step icon={Ticket} title={`Skipass: ab CHF ${ticket.from}`}>
              <p>{ticket.unit}{ticket.note ? ` · ${ticket.note}` : ""}</p>
              {ticketUrl && <a href={ticketUrl} target="_blank" rel="noopener" className={`mt-1 ${linkCls}`}>Ticket online kaufen <ExternalLink size={12} aria-hidden /></a>}
            </Step>
          )}

          {day && (
            <Step icon={CloudSun} title="Wetter oben">
              {day.tmin}° bis {day.tmax}°, {day.sunH} h Sonne{day.snowCm ? `, ${day.snowCm} cm Neuschnee` : ""}{day.windMax >= 50 ? `, Böen bis ${day.windMax} km/h – Lifte evtl. zu` : ""}
            </Step>
          )}

          <Step icon={Utensils} title="Mittag">
            {food.length ? <>Laut Bergbahn offen: {food.slice(0, 4).join(", ")}{food.length > 4 ? ` und ${food.length - 4} weitere` : ""}</> : "Welche Hütten offen sind, steht im Live-Bericht unten."}
          </Step>

          <Step icon={Home} title="Heim nach Liftschluss">
            {busy && !back ? (
              "Fahrplan wird geladen …"
            ) : back?.length ? (
              <ul className="space-y-0.5">
                {back.map((c, i) => (
                  <li key={i}><strong className="text-cream">ab {c.dep} → an {c.arr}</strong> · {fmtMin(c.min)}</li>
                ))}
              </ul>
            ) : (
              "Keine Verbindung gefunden."
            )}
            <a href={sbbLink(station, start.name, date, "16:30")} target="_blank" rel="noopener" className={`mt-1 ${linkCls}`}>SBB-Fahrplan</a>
          </Step>
        </ol>
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
