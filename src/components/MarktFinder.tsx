"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import PointsMap from "@/components/PointsMap";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { crowKm } from "@/lib/ski-core";
import { KIND_LABEL, addDay, dateShort, nextOpen, openOn, spanText, type Markt } from "@/lib/maerkte-core";

type Day = "alle" | "heute" | "wochenende" | "datum";
type Sort = "naehe" | "gross" | "start";
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const chip = (on: boolean) =>
  `min-h-[38px] rounded-full border px-3.5 py-1 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;
const SIZE = { gross: 0, mittel: 1, klein: 2 };

function weekend(today: string) {
  const w = new Date(`${today}T12:00:00Z`).getUTCDay();
  const fri = addDay(today, w === 0 ? -2 : w === 6 ? -1 : 5 - w);
  return [fri, addDay(fri, 1), addDay(fri, 2)].filter((d) => d >= today);
}

/** Weihnachtsmärkte: welcher hat an meinem Tag offen, und wie weit ist er weg? */
export default function MarktFinder({ markets, today }: { markets: Markt[]; today: string }) {
  const [q, setQ] = useState("");
  const [day, setDay] = useState<Day>("alle");
  const [date, setDate] = useState(today);
  const [kind, setKind] = useState<Markt["kind"] | "">("");
  const [start, setStart] = useState<StartStation | null>(null);
  const [sort, setSort] = useState<Sort>("gross");
  const [focus, setFocus] = useState<string | null>(null);
  const [n, setN] = useState(24);

  useEffect(() => {
    const s = loadStart();
    setStart(s);
    if (s?.lat) setSort("naehe");
  }, []);

  const days = day === "heute" ? [today] : day === "wochenende" ? weekend(today) : day === "datum" ? [date] : null;
  const points = useMemo(() => markets.map((m) => ({ id: m.id, name: m.name, lat: m.coords.lat, lng: m.coords.lng, sub: `${m.place} · ${spanText(m)}`, href: `/weihnachtsmaerkte/${m.id}` })), [markets]);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    const from = start?.lat && start.lng ? { lat: start.lat, lng: start.lng } : undefined;
    return markets
      .filter((m) => m.to >= today)
      .filter((m) => (!kind || m.kind === kind) && (!days || days.some((d) => openOn(m, d))) && (!nq || norm(`${m.name} ${m.place} ${m.canton}`).includes(nq)))
      .map((m) => ({ m, d: from ? crowKm(from, m.coords) : undefined, next: nextOpen(m, days?.[0] ?? today) }))
      .sort((a, b) => (a.m.id === focus ? -1 : b.m.id === focus ? 1 : 0) || (sort === "naehe" && a.d !== undefined ? a.d - b.d! : sort === "start" ? (a.next ?? "9").localeCompare(b.next ?? "9") : SIZE[a.m.size] - SIZE[b.m.size] || (a.next ?? "9").localeCompare(b.next ?? "9")));
  }, [markets, q, kind, days?.join(), start, sort, today, focus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setN(24), [q, kind, day, date, sort, start]);
  const onPick = (id: string) => {
    setFocus(id);
    setQ("");
    setDay("alle");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };

  return (
    <div>
      <PointsMap points={points} color="#dc2626" onPick={onPick} />
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Tag">
            {([["alle", "Alle"], ["heute", "Heute offen"], ["wochenende", "Dieses Wochenende"], ["datum", "Datum"]] as [Day, string][]).map(([k, l]) => (
              <button key={k} type="button" aria-pressed={day === k} onClick={() => setDay(k)} className={chip(day === k)}>{l}</button>
            ))}
            {day === "datum" && <input type="date" value={date} min={today} max="2027-01-10" onChange={(e) => setDate(e.target.value)} aria-label="Datum" className="min-h-[38px] rounded-full border border-cream/20 bg-ink-900 px-3 text-sm text-cream" />}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Art">
            {(["", "weihnachtsmarkt", "adventsmarkt", "lichter", "schiff"] as const).map((k) => (
              <button key={k || "alle"} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>{k ? KIND_LABEL[k] : "Alle Arten"}</button>
            ))}
          </div>
          <label className="relative block">
            <span className="sr-only">Markt oder Ort suchen</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-faint" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ort oder Markt – z. B. «Basel», «Schloss»" className="min-h-[48px] w-full rounded-xl border border-cream/20 bg-ink-900 pl-10 pr-3 text-base text-cream placeholder:text-cream-faint focus:border-signal-500 focus:outline-none" />
          </label>
        </div>
        <div className="space-y-3">
          <StationPicker value={start} onChange={(s) => (setStart(s), setSort("naehe"))} label="In der Nähe von" />
          <label className="flex items-center gap-2 text-sm text-cream-dim">
            Sortieren
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[38px] rounded-xl border border-cream/20 bg-ink-900 px-2 text-sm font-semibold text-cream">
              {start?.lat && <option value="naehe">am nächsten</option>}
              <option value="gross">grosse zuerst</option>
              <option value="start">nächster Termin</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-5 text-sm text-cream-dim"><strong className="text-cream">{list.length}</strong> {list.length === 1 ? "Markt" : "Märkte"}{days ? (day === "heute" ? " heute offen" : day === "wochenende" ? " am Wochenende offen" : ` offen am ${dateShort(date)}`) : ""}</p>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, n).map(({ m, d, next }) => {
          const isToday = openOn(m, today);
          return (
            <li key={m.id} id={m.id} className={`card flex scroll-mt-24 flex-col p-4 ${m.id === focus ? "ring-2 ring-signal-500" : ""}`}>
              <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-cream-faint">
                <span>{KIND_LABEL[m.kind]}</span>
                <span>· {m.place} ({m.canton})</span>
                {d !== undefined && <span>· {d < 10 ? d.toFixed(1).replace(".", ",") : Math.round(d)} km</span>}
              </p>
              <h3 className="mt-0.5 font-display text-lg font-extrabold leading-tight tracking-tight text-cream">
                <Link href={`/weihnachtsmaerkte/${m.id}`} className="hover:underline">{m.name}</Link>
              </h3>
              <p className="mt-2 text-sm font-semibold">
                {isToday ? <span className="text-emerald-700">Heute offen{m.open ? ` ${m.open.from}–${m.open.to}` : ""}</span> : next ? <span className="text-cream">Nächster Tag: {dateShort(next)}</span> : <span className="text-cream-faint">vorbei</span>}
                <span className="font-normal text-cream-faint"> · {spanText(m)}</span>
              </p>
              {m.wow && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream-dim">{m.wow}</p>}
              <p className="mt-auto flex flex-wrap gap-x-3 pt-3 text-xs text-cream-faint">
                {m.stands && <span>ca. {m.stands} Stände</span>}
                {m.indoor && <span>drinnen</span>}
                {m.free === false && m.price ? <span>Eintritt {m.price}</span> : m.free ? <span>Eintritt frei</span> : null}
              </p>
            </li>
          );
        })}
      </ul>
      {list.length > n && <button type="button" onClick={() => setN(n + 36)} className="btn-secondary mt-5 min-h-[44px]">Weitere {Math.min(36, list.length - n)} zeigen</button>}
      {!list.length && <p className="mt-4 text-cream-dim">An diesem Tag hat keiner offen – «Alle» zeigt die ganze Saison.</p>}
    </div>
  );
}
