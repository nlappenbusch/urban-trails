"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BedDouble, CableCar, Car, ExternalLink, Moon, Mountain, Snowflake, Sparkles, TrainFront, Users } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { COLOR, carEstimate, carLink, crowKm, kmOpen, oevEstimate, sbbLink, type Count, type SkiRow } from "@/lib/ski-core";
import { bookingLink } from "@/lib/booking";
import { fmtMin } from "@/lib/ausfluege-core";

const chip = (on: boolean) =>
  `min-h-[38px] rounded-full border px-3.5 py-1 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

type Sort = "anreise" | "offen" | "pisten" | "schnee" | "preis";
type Focus = "" | "blue" | "red" | "black";
type Status = "alle" | "offen" | "zu";
type Mode = "oev" | "auto";

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

interface Conn { min: number; dep: string; transfers: number }

export default function SkiFinder({ rows, live }: { rows: SkiRow[]; live: boolean }) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [status, setStatus] = useState<Status>("alle");
  const [mode, setMode] = useState<Mode>("oev");
  const [maxTravel, setMaxTravel] = useState(0);
  const [minKm, setMinKm] = useState(0);
  const [focus, setFocus] = useState<Focus>("");
  const [family, setFamily] = useState(false);
  const [park, setPark] = useState(false);
  const [night, setNight] = useState(false);
  const [maxTicket, setMaxTicket] = useState(0);
  const [sort, setSort] = useState<Sort>("anreise");
  const [checkin, setCheckin] = useState(nextSaturday());
  const [nights, setNights] = useState(0);
  const [hotelMax, setHotelMax] = useState(250);
  const [real, setReal] = useState<Record<string, Conn | null>>({});

  useEffect(() => {
    setStart(loadStart());
    try {
      const m = localStorage.getItem("ut-ski-mode");
      if (m === "auto" || m === "oev") setMode(m);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("ut-ski-mode", mode); } catch {}
  }, [mode]);

  const openRows = rows.filter((r) => r.live?.status === "open");
  const stats = useMemo(() => {
    const withLive = rows.filter((r) => r.live);
    const km = openRows.reduce((s, r) => s + (kmOpen(r).open ?? 0), 0);
    const kmTotal = withLive.reduce((s, r) => s + kmOpen(r).total, 0);
    const lifts = openRows.reduce((s, r) => s + (r.live?.lifts?.open ?? 0), 0);
    const liftsTotal = withLive.reduce((s, r) => s + (r.live?.lifts?.total ?? 0), 0);
    const snow = rows.filter((r) => r.snow).sort((a, b) => b.snow!.cm - a.snow!.cm)[0];
    return { withLive: withLive.length, km, kmTotal, lifts, liftsTotal, snow };
  }, [rows, openRows]);

  const list = useMemo(() => {
    const out = rows.map((r) => {
      const d = start?.lat && start.lng ? crowKm({ lat: start.lat, lng: start.lng }, r.coords) : undefined;
      const oev = real[r.id]?.min ?? (d !== undefined ? oevEstimate(d) : undefined);
      const car = d !== undefined ? carEstimate(d) : undefined;
      const travel = mode === "auto" ? car?.min : oev;
      return { r, d, oev, car, travel, k: kmOpen(r) };
    });
    return out
      .filter(({ r, travel, k }) => {
        if (status === "offen" && r.live?.status !== "open") return false;
        if (status === "zu" && r.live?.status === "open") return false;
        if (maxTravel && travel !== undefined && travel > maxTravel) return false;
        const kk = live && r.live ? k.open ?? 0 : k.total;
        if (minKm && kk < minKm) return false;
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
        if (sort === "offen") return (b.k.open ?? -1) - (a.k.open ?? -1) || b.k.total - a.k.total;
        const share = (r: SkiRow) => (focus ? (r.pistes?.[focus] ?? 0) : 0);
        return share(b.r) - share(a.r) || b.k.total - a.k.total;
      });
  }, [rows, start, status, mode, live, maxTravel, minKm, family, park, night, maxTicket, sort, focus, real]);

  // Echte Zugverbindung für die ersten sechs Treffer nachladen
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

  const checkout = plus(checkin, Math.max(nights, 1));
  const closedCount = rows.length - openRows.length;

  return (
    <div>
      {live && stats.withLive > 0 && (
        <section aria-label="Lage in der Schweiz" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat big={`${openRows.length}`} small={`von ${rows.length}`} label="Skigebiete offen" onClick={() => setStatus(status === "offen" ? "alle" : "offen")} active={status === "offen"} />
          <Stat big={`${Math.round(stats.km).toLocaleString("de-CH")} km`} small={`von ${Math.round(stats.kmTotal).toLocaleString("de-CH")} km`} label="Pisten offen" bar={stats.kmTotal ? stats.km / stats.kmTotal : 0} />
          <Stat big={`${stats.lifts}`} small={`von ${stats.liftsTotal}`} label="Anlagen in Betrieb" bar={stats.liftsTotal ? stats.lifts / stats.liftsTotal : 0} />
          {stats.snow ? <Stat big={`${stats.snow.snow!.cm} cm`} small={stats.snow.name} label="Am meisten Schnee (SLF)" /> : <Stat big="–" label="Schnee" />}
        </section>
      )}

      <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
        <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <StationPicker value={start} onChange={setStart} label="Ab wo fährst du los?" />
          <F label="Wie?">
            <div className="inline-flex rounded-full border border-cream/20 bg-ink-900 p-1">
              {(["oev", "auto"] as Mode[]).map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-full px-3.5 text-sm font-bold transition ${mode === m ? "bg-signal-500 text-white" : "text-cream-dim hover:text-cream"}`}>
                  {m === "oev" ? <TrainFront size={15} aria-hidden /> : <Car size={15} aria-hidden />} {m === "oev" ? "Zug & Bus" : "Auto"}
                </button>
              ))}
            </div>
          </F>
          {live && (
            <F label="Status">
              {([["alle", `Alle (${rows.length})`], ["offen", `Offen (${openRows.length})`], ["zu", `Zu (${closedCount})`]] as [Status, string][]).map(([s, l]) => (
                <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)} className={chip(status === s)}>{l}</button>
              ))}
            </F>
          )}
          <F label="Wann?">
            <input type="date" value={checkin} min={iso(new Date())} onChange={(e) => e.target.value && setCheckin(e.target.value)} className="min-h-[40px] rounded-xl border border-cream/20 bg-ink-900 px-3 text-sm text-cream" />
            {[0, 1, 2].map((n) => (
              <button key={n} type="button" aria-pressed={nights === n} onClick={() => setNights(n)} className={chip(nights === n)}>{n === 0 ? "Tagesausflug" : n === 1 ? "1 Nacht" : "2 Nächte"}</button>
            ))}
          </F>
          <F label="Anreise höchstens">
            {[0, 60, 90, 120, 180].map((m) => (
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
              {start?.name ? <> · {mode === "auto" ? "mit dem Auto" : "mit Zug und Bus"} ab <strong className="text-cream">{start.name}</strong></> : " · Startort wählen für Anreisezeiten"}
            </p>
            <label className="flex items-center gap-2 text-sm text-cream-dim">
              Sortieren
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[38px] rounded-xl border border-cream/20 bg-ink-900 px-2 text-sm font-semibold text-cream">
                <option value="anreise">kürzeste Anreise</option>
                {live && <option value="offen">meiste offene km</option>}
                <option value="pisten">grösstes Gebiet</option>
                <option value="schnee">meister Schnee</option>
                <option value="preis">günstigste Tageskarte</option>
              </select>
            </label>
          </div>

          <ul className="mt-5 space-y-4">
            {list.map((x) => (
              <SkiCard key={x.r.id} {...x} live={live} mode={mode} conn={real[x.r.id]} start={start} checkin={checkin} checkout={checkout} nights={nights} hotelMax={hotelMax} />
            ))}
          </ul>
          {list.length === 0 && (
            <p className="mt-8 text-cream-dim">
              Mit diesen Filtern passt kein Gebiet{status === "offen" ? " – vielleicht hat die Saison noch nicht begonnen" : ""}. Lockere einen Filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ big, small, label, bar, onClick, active }: { big: string; small?: string; label: string; bar?: number; onClick?: () => void; active?: boolean }) {
  const inner = (
    <>
      <span className="block text-xs font-bold text-cream-faint">{label}</span>
      <span className="mt-1 block font-display text-3xl font-extrabold leading-none tracking-tight text-cream">
        {big} {small && <span className="text-base font-semibold text-cream-dim">{small}</span>}
      </span>
      {bar !== undefined && (
        <span className="mt-3 block h-1.5 rounded-full bg-ink-800">
          <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(bar * 100, bar > 0 ? 2 : 0))}%` }} />
        </span>
      )}
    </>
  );
  const cls = `card block w-full p-4 text-left ${active ? "border-signal-500 ring-2 ring-signal-500/30" : ""}`;
  return onClick ? <button type="button" onClick={onClick} aria-pressed={active} className={`${cls} transition hover:border-cream/30`}>{inner}</button> : <div className={cls}>{inner}</div>;
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm font-bold text-cream">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SkiCard({ r, d, oev, car, k, live, mode, conn, start, checkin, checkout, nights, hotelMax }: {
  r: SkiRow;
  d?: number;
  oev?: number;
  car?: { min: number; km: number };
  k: ReturnType<typeof kmOpen>;
  live: boolean;
  mode: Mode;
  conn?: Conn | null;
  start: StartStation | null;
  checkin: string;
  checkout: string;
  nights: number;
  hotelMax: number;
}) {
  const st = r.live?.status;
  const isOpen = st === "open";
  const share = k.open != null && k.total ? k.open / k.total : 0;
  const href = `/skigebiete/${r.id}`;
  return (
    <li className={`card overflow-hidden ${live && r.live && !isOpen ? "opacity-80" : ""}`}>
      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_15rem] sm:p-5">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cream-faint">
            {live && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${isOpen ? "bg-emerald-600 text-white" : st === "closed" ? "bg-ink-800 text-cream-dim" : "bg-amber-100 text-amber-800"}`}>
                {isOpen && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
                {isOpen ? "Offen" : st === "closed" ? "Geschlossen" : st === "no_report" ? "Kein Bericht" : "Ohne Live-Daten"}
              </span>
            )}
            <span>{r.canton}</span>
            {r.altitude?.top && <span className="inline-flex items-center gap-1"><Mountain size={12} aria-hidden /> {r.altitude.base ? `${r.altitude.base}–` : "bis "}{r.altitude.top} m ü. M.</span>}
            {r.season && <span>{r.season}</span>}
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold leading-tight tracking-tight text-cream">
            <Link href={href} className="decoration-2 underline-offset-4 hover:underline">{r.name}</Link>
          </h2>

          {/* Die eine Zahl, die zählt: wie viel ist offen */}
          {live && r.live && k.total > 0 ? (
            <div className="mt-3">
              <p className="flex items-baseline gap-2">
                <span className={`font-display text-3xl font-extrabold leading-none tracking-tight ${isOpen ? "text-emerald-600" : "text-cream-faint"}`} title={k.approx ? "geschätzt aus der Zahl offener Pisten je Farbe" : undefined}>{k.approx ? "ca. " : ""}{k.open ?? 0} km</span>
                <span className="text-sm text-cream-dim">von {k.total} km offen{r.live.slopes ? ` · ${r.live.slopes.open}/${r.live.slopes.total} Pisten` : ""}</span>
              </p>
              <span className="mt-2 block h-2 rounded-full bg-ink-800">
                <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(share * 100, share > 0 ? 2 : 0)}%` }} />
              </span>
            </div>
          ) : r.pistes?.total ? (
            <p className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold leading-none tracking-tight text-cream">{Math.round(r.pistes.total)} km</span>
              <span className="text-sm text-cream-dim">Pisten{r.pistes.count ? ` · ${r.pistes.count} Abfahrten` : ""}</span>
            </p>
          ) : null}

          <div className="mt-3 space-y-1.5">
            {(["blue", "red", "black"] as const).map((c) => (
              <ColorBar key={c} k={c} live={live ? r.live?.byColor?.[c] : undefined} totalKm={r.pistes?.[c]} />
            ))}
          </div>

          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-cream-dim">
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

        <div className="flex flex-col gap-3 text-sm">
          {r.ticket && (
            <p>
              <span className="block text-xs font-semibold text-cream-faint">{r.ticket.unit}</span>
              <span className="font-display text-2xl font-extrabold text-cream">CHF {r.ticket.from}{r.ticket.to && r.ticket.to !== r.ticket.from ? `–${r.ticket.to}` : ""}</span>
              {r.ticket.note && <span className="block text-xs text-cream-faint">{r.ticket.note}</span>}
            </p>
          )}
          {d !== undefined && (
            <div className="space-y-1.5 rounded-xl bg-ink-800/60 p-3">
              <Travel icon={<TrainFront size={15} aria-hidden />} active={mode === "oev"}>
                {conn ? <><strong className="text-cream">{fmtMin(conn.min)}</strong> bis {r.station}<span className="block text-xs text-cream-faint">ab {conn.dep}{conn.transfers ? `, ${conn.transfers}× umsteigen` : ", direkt"}</span></> : <>ca. <strong className="text-cream">{fmtMin(oev!)}</strong> bis {r.station}</>}
              </Travel>
              {car && (
                <Travel icon={<Car size={15} aria-hidden />} active={mode === "auto"}>
                  ca. <strong className="text-cream">{fmtMin(car.min)}</strong> · {car.km} km
                </Travel>
              )}
            </div>
          )}
          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 font-semibold">
            <Link href={href} className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500">Alles zum Gebiet <ArrowRight size={14} aria-hidden /></Link>
            {start?.name && (mode === "auto"
              ? <a href={carLink(start, r.coords)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><Car size={14} aria-hidden /> Route</a>
              : <a href={sbbLink(start.name, r.station, checkin)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><TrainFront size={14} aria-hidden /> Fahrplan</a>)}
            {nights > 0 && (
              <a href={bookingLink({ ss: r.name.split(/[ (/–-]/)[0], checkin, checkout, min: 0, max: hotelMax })} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500">
                <BedDouble size={14} aria-hidden /> Hotels bis CHF {hotelMax}
              </a>
            )}
            {r.url && <a href={r.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Website</a>}
          </div>
        </div>
      </div>
    </li>
  );
}

function Travel({ icon, active, children }: { icon: React.ReactNode; active: boolean; children: React.ReactNode }) {
  return (
    <p className={`flex items-start gap-1.5 ${active ? "" : "opacity-60"}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

/** Balken je Farbe: gesamt (hell) und offen (kräftig) */
export function ColorBar({ k, live, totalKm }: { k: "blue" | "red" | "black"; live?: Count; totalKm?: number }) {
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
        {live ? <>{live.open}/{live.total}{live.totalKm ? ` · ${Math.round(live.openKm ?? 0)}/${Math.round(live.totalKm)} km` : ""}</> : <>{Math.round(total!)} km</>}
      </span>
    </div>
  );
}
