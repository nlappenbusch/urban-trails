"use client";

import { useEffect, useMemo, useState } from "react";
import { BedDouble, CableCar, ExternalLink, Moon, Mountain, Snowflake, Sparkles, TrainFront, Users } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { COLOR, type Count, type SkiRow } from "@/lib/ski-core";
import { bookingLink } from "@/lib/booking";
import { fmtMin } from "@/lib/ausfluege-core";

const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180, dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(x));
};
/** grobe ÖV-Zeit aus Luftlinie (Berge machen Umwege) – echte Verbindung wird für die ersten Treffer nachgeladen */
const estimate = (d: number) => Math.round((20 + d * 1.15) / 5) * 5;

const chip = (on: boolean) =>
  `min-h-[38px] rounded-full border px-3.5 py-1 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

type Sort = "anreise" | "pisten" | "schnee" | "preis";
type Focus = "" | "blue" | "red" | "black";

const iso = (d: Date) => d.toISOString().slice(0, 10);
function nextSaturday() {
  const d = new Date();
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
  return iso(d);
}
const plus = (date: string, n: number) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return iso(d);
};

export default function SkiFinder({ rows, live }: { rows: SkiRow[]; live: boolean }) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [onlyOpen, setOnlyOpen] = useState(live);
  const [maxTravel, setMaxTravel] = useState(0);
  const [minKm, setMinKm] = useState(0);
  const [focus, setFocus] = useState<Focus>("");
  const [family, setFamily] = useState(false);
  const [park, setPark] = useState(false);
  const [night, setNight] = useState(false);
  const [maxTicket, setMaxTicket] = useState(0);
  const [sort, setSort] = useState<Sort>("anreise");
  const [checkin, setCheckin] = useState(nextSaturday());
  const [nights, setNights] = useState(1);
  const [hotelMax, setHotelMax] = useState(250);
  const [real, setReal] = useState<Record<string, { min: number; dep: string; transfers: number } | null>>({});

  useEffect(() => setStart(loadStart()), []);

  const list = useMemo(() => {
    const withDist = rows.map((r) => {
      const d = start?.lat && start.lng ? km({ lat: start.lat, lng: start.lng }, r.coords) : undefined;
      const travel = real[r.id]?.min ?? (d !== undefined ? estimate(d) : undefined);
      return { r, d, travel };
    });
    return withDist
      .filter(({ r, travel }) => {
        if (onlyOpen && live && r.live?.status !== "open") return false;
        if (maxTravel && travel !== undefined && travel > maxTravel) return false;
        const k = live && r.live?.slopes?.openKm != null ? r.live.slopes.openKm : r.pistes?.total ?? 0;
        if (minKm && k < minKm) return false;
        if (family && !r.family) return false;
        if (park && !r.snowpark) return false;
        if (night && !r.nightSkiing) return false;
        if (maxTicket && (!r.ticket || r.ticket.from > maxTicket)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === "anreise") return (a.travel ?? 999) - (b.travel ?? 999);
        if (sort === "schnee") return (b.r.snow?.cm ?? -1) - (a.r.snow?.cm ?? -1);
        if (sort === "preis") return (a.r.ticket?.from ?? 999) - (b.r.ticket?.from ?? 999);
        const share = (r: SkiRow) => (focus ? (r.pistes?.[focus] ?? 0) : 0);
        const open = (r: SkiRow) => (live ? r.live?.slopes?.openKm ?? 0 : 0);
        return share(b.r) - share(a.r) || open(b.r) - open(a.r) || (b.r.pistes?.total ?? 0) - (a.r.pistes?.total ?? 0);
      });
  }, [rows, start, onlyOpen, live, maxTravel, minKm, family, park, night, maxTicket, sort, focus, real]);

  // Echte Verbindung für die ersten sechs Treffer nachladen (Abfahrt Samstag 07:30)
  const top = list.slice(0, 6).map((x) => x.r.id).join(",");
  useEffect(() => {
    if (!start?.name) return;
    const todo = list.slice(0, 6).filter((x) => !(x.r.id in real));
    if (!todo.length) return;
    let alive = true;
    (async () => {
      const got: typeof real = {};
      await Promise.all(
        todo.map(async ({ r }) => {
          try {
            const q = new URLSearchParams({ from: start.name, to: r.station, date: checkin, time: "07:30" });
            const res = await fetch(`/api/oev?${q}`);
            const c = res.ok ? (await res.json()).connections?.[0] : undefined;
            got[r.id] = c ? { min: c.durationMin, dep: new Date(c.dep).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" }), transfers: c.transfers } : null;
          } catch {
            got[r.id] = null;
          }
        }),
      );
      if (alive) setReal((x) => ({ ...x, ...got }));
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top, start?.name, checkin]);

  useEffect(() => setReal({}), [start?.name, checkin]);

  const openCount = rows.filter((r) => r.live?.status === "open").length;
  const checkout = plus(checkin, nights);

  return (
    <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
        <StationPicker value={start} onChange={setStart} label="Ab wo fährst du?" />
        <F label="Wann?">
          <input type="date" value={checkin} min={iso(new Date())} onChange={(e) => e.target.value && setCheckin(e.target.value)} className="min-h-[40px] rounded-xl border border-cream/20 bg-ink-900 px-3 text-sm text-cream" />
          {[0, 1, 2].map((n) => (
            <button key={n} type="button" aria-pressed={nights === n} onClick={() => setNights(n)} className={chip(nights === n)}>{n === 0 ? "Tagesausflug" : n === 1 ? "1 Nacht" : "2 Nächte"}</button>
          ))}
        </F>
        {live && (
          <F label="Status">
            <button type="button" aria-pressed={onlyOpen} onClick={() => setOnlyOpen(!onlyOpen)} className={chip(onlyOpen)}>Nur offene ({openCount})</button>
          </F>
        )}
        <F label="Anreise höchstens">
          {[0, 90, 120, 180].map((m) => (
            <button key={m} type="button" aria-pressed={maxTravel === m} onClick={() => setMaxTravel(m)} className={chip(maxTravel === m)}>{m ? fmtMin(m) : "egal"}</button>
          ))}
        </F>
        <F label={live ? "Offene Pisten mindestens" : "Pisten mindestens"}>
          {[0, 20, 50, 100].map((k) => (
            <button key={k} type="button" aria-pressed={minKm === k} onClick={() => setMinKm(k)} className={chip(minKm === k)}>{k ? `${k} km` : "egal"}</button>
          ))}
        </F>
        <F label="Am liebsten">
          {(["", "blue", "red", "black"] as Focus[]).map((f) => (
            <button key={f} type="button" aria-pressed={focus === f} onClick={() => { setFocus(f); if (f) setSort("pisten"); }} className={chip(focus === f)}>
              {f ? <span className="inline-flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-full ${COLOR[f].cls}`} /> viel {COLOR[f].label}</span> : "alles"}
            </button>
          ))}
        </F>
        <F label="Muss haben">
          <button type="button" aria-pressed={family} onClick={() => setFamily(!family)} className={chip(family)}>Kinderland</button>
          <button type="button" aria-pressed={park} onClick={() => setPark(!park)} className={chip(park)}>Snowpark</button>
          <button type="button" aria-pressed={night} onClick={() => setNight(!night)} className={chip(night)}>Nachtskifahren</button>
        </F>
        <F label="Tageskarte bis">
          {[0, 50, 70, 90].map((p) => (
            <button key={p} type="button" aria-pressed={maxTicket === p} onClick={() => setMaxTicket(p)} className={chip(maxTicket === p)}>{p ? `CHF ${p}` : "egal"}</button>
          ))}
        </F>
        {nights > 0 && (
          <F label="Hotel pro Nacht bis">
            {[150, 250, 400].map((p) => (
              <button key={p} type="button" aria-pressed={hotelMax === p} onClick={() => setHotelMax(p)} className={chip(hotelMax === p)}>CHF {p}</button>
            ))}
          </F>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-cream-dim">
            <strong className="text-cream">{list.length}</strong> von {rows.length} Skigebieten
            {start?.name ? <> · Anreise ab <strong className="text-cream">{start.name}</strong></> : " · Startbahnhof wählen für Anreisezeiten"}
          </p>
          <label className="flex items-center gap-2 text-sm text-cream-dim">
            Sortieren
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[38px] rounded-xl border border-cream/20 bg-ink-900 px-2 text-sm font-semibold text-cream">
              <option value="anreise">kürzeste Anreise</option>
              <option value="pisten">{live ? "meiste offene Pisten" : "meiste Pisten"}</option>
              <option value="schnee">meister Schnee</option>
              <option value="preis">günstigste Tageskarte</option>
            </select>
          </label>
        </div>

        <ul className="mt-5 space-y-4">
          {list.map(({ r, d, travel }) => (
            <SkiCard key={r.id} r={r} live={live} dist={d} travel={travel} conn={real[r.id]} from={start?.name} checkin={checkin} checkout={checkout} nights={nights} hotelMax={hotelMax} />
          ))}
        </ul>
        {list.length === 0 && <p className="mt-8 text-cream-dim">Mit diesen Filtern passt kein Gebiet – lockere einen davon.</p>}
      </div>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm font-bold text-cream">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SkiCard({ r, live, dist, travel, conn, from, checkin, checkout, nights, hotelMax }: {
  r: SkiRow;
  live: boolean;
  dist?: number;
  travel?: number;
  conn?: { min: number; dep: string; transfers: number } | null;
  from?: string;
  checkin: string;
  checkout: string;
  nights: number;
  hotelMax: number;
}) {
  const st = r.live?.status;
  const sbb = from ? `https://www.sbb.ch/de?von=${encodeURIComponent(from)}&nach=${encodeURIComponent(r.station)}&datum=${checkin}&zeit=07:30` : undefined;
  return (
    <li className="card overflow-hidden">
      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cream-faint">
            {live && st && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${st === "open" ? "bg-emerald-600 text-white" : st === "closed" ? "bg-zinc-300 text-zinc-800" : "bg-amber-100 text-amber-800"}`}>
                {st === "open" ? "offen" : st === "closed" ? "zu" : "kein Bericht"}
              </span>
            )}
            <span>{r.canton}</span>
            {r.altitude?.top && <span className="inline-flex items-center gap-1"><Mountain size={12} aria-hidden /> bis {r.altitude.top} m ü. M.</span>}
            {r.season && <span>{r.season}</span>}
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold leading-tight tracking-tight text-cream">{r.name}</h2>
          {r.text && <p className="mt-1 text-sm leading-relaxed text-cream-dim">{r.text}</p>}

          <div className="mt-3 space-y-1.5">
            {(["blue", "red", "black"] as const).map((k) => (
              <ColorBar key={k} k={k} live={live ? r.live?.byColor?.[k] : undefined} totalKm={r.pistes?.[k]} />
            ))}
          </div>

          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream-dim">
            {live && r.live?.slopes ? (
              <span><strong className="text-cream">{r.live.slopes.open}/{r.live.slopes.total}</strong> Pisten offen{r.live.slopes.openKm != null && r.live.slopes.totalKm ? <> · {Math.round(r.live.slopes.openKm)} von {r.live.slopes.totalKm} km</> : null}</span>
            ) : r.pistes?.total ? (
              <span><strong className="text-cream">{r.pistes.total} km</strong> Pisten{r.pistes.count ? ` · ${r.pistes.count} Abfahrten` : ""}</span>
            ) : null}
            {live && r.live?.lifts ? (
              <span className="inline-flex items-center gap-1"><CableCar size={14} aria-hidden /> <strong className="text-cream">{r.live.lifts.open}/{r.live.lifts.total}</strong> Anlagen</span>
            ) : r.lifts ? (
              <span className="inline-flex items-center gap-1"><CableCar size={14} aria-hidden /> {r.lifts} Anlagen</span>
            ) : null}
            {r.snow && (
              <span className="inline-flex items-center gap-1" title={`SLF-Station ${r.snow.station}, ${r.snow.elevation} m, ${r.snow.date}`}>
                <Snowflake size={14} className="text-sky-600" aria-hidden /> <strong className="text-cream">{r.snow.cm} cm</strong> Schnee ({r.snow.elevation} m){r.snow.fresh ? `, +${r.snow.fresh} cm neu` : ""}
              </span>
            )}
          </p>
          <p className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-cream-dim">
            {r.family && <span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2.5 py-1"><Users size={12} aria-hidden /> Kinderland</span>}
            {r.snowpark && <span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2.5 py-1"><Sparkles size={12} aria-hidden /> Snowpark</span>}
            {r.nightSkiing && <span className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-2.5 py-1"><Moon size={12} aria-hidden /> Nachtskifahren</span>}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm sm:w-56">
          {r.ticket && (
            <p>
              <span className="block text-xs font-semibold text-cream-faint">{r.ticket.unit}</span>
              <span className="font-display text-2xl font-extrabold text-cream">CHF {r.ticket.from}{r.ticket.to && r.ticket.to !== r.ticket.from ? `–${r.ticket.to}` : ""}</span>
              {r.ticket.note && <span className="block text-xs text-cream-faint">{r.ticket.note}</span>}
            </p>
          )}
          {travel !== undefined && (
            <p className="flex items-start gap-1.5">
              <TrainFront size={15} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                {conn ? <><strong className="text-cream">{fmtMin(conn.min)}</strong> bis {r.station} · ab {conn.dep}{conn.transfers ? `, ${conn.transfers}× umsteigen` : ", direkt"}</> : <>ca. <strong className="text-cream">{fmtMin(travel)}</strong> bis {r.station}</>}
                {dist !== undefined && <span className="block text-xs text-cream-faint">{Math.round(dist)} km Luftlinie{r.access ? ` · ${r.access}` : ""}</span>}
              </span>
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 font-semibold">
            {sbb && <a href={sbb} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><TrainFront size={14} aria-hidden /> Fahrplan</a>}
            {nights > 0 && (
              <a href={bookingLink({ ss: r.name.split(/[ (/–-]/)[0], checkin, checkout, min: 0, max: hotelMax })} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500">
                <BedDouble size={14} aria-hidden /> Freie Hotels bis CHF {hotelMax}
              </a>
            )}
            {r.url && <a href={r.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Website</a>}
          </div>
        </div>
      </div>
    </li>
  );
}

/** Balken je Farbe: gesamt (hell) und offen (kräftig) */
function ColorBar({ k, live, totalKm }: { k: "blue" | "red" | "black"; live?: Count; totalKm?: number }) {
  const total = live?.totalKm ?? totalKm;
  if (!total && !live?.total) return null;
  const share = live ? (live.totalKm ? (live.openKm ?? 0) / live.totalKm : live.total ? live.open / live.total : 0) : 1;
  return (
    <div className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 font-semibold text-cream-dim"><span className={`h-2.5 w-2.5 rounded-full ${COLOR[k].cls}`} /> {COLOR[k].label}</span>
      <span className="relative h-2 rounded-full bg-ink-800">
        <span className={`absolute inset-y-0 left-0 rounded-full ${COLOR[k].cls} ${live ? "" : "opacity-40"}`} style={{ width: `${Math.max(share * 100, live && live.open ? 4 : 0)}%` }} />
      </span>
      <span className="tabular-nums text-cream-dim">
        {live ? <>{live.open}/{live.total}{live.totalKm ? ` · ${Math.round(live.openKm ?? 0)}/${live.totalKm} km` : ""}</> : <>{Math.round(total!)} km</>}
      </span>
    </div>
  );
}
