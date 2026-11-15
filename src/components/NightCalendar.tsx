"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Moon, MountainSnow, Sparkles, TrainFront } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { WD, WD_LONG, dow, eventOn, nightStatus, timeText, type NightOffer } from "@/lib/nachtski-core";
import { crowKm, oevEstimate } from "@/lib/ski-core";
import { fmtMin } from "@/lib/ausfluege-core";

type View = "woche" | "plan" | "events";
type Kind = "" | "ski" | "schlitteln";

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const monday = (iso: string) => addDays(iso, -((dow(iso) + 6) % 7));
const short = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("de-CH", { day: "numeric", month: "numeric" });
const long = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long" });
const chip = (on: boolean) =>
  `min-h-[38px] rounded-full border px-3.5 py-1 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

export default function NightCalendar({ offers, today }: { offers: NightOffer[]; today: string }) {
  const [view, setView] = useState<View>("woche");
  const [kind, setKind] = useState<Kind>("");
  // vor Saisonstart direkt die erste Woche mit Angeboten zeigen
  const firstWeek = useMemo(() => {
    for (let i = 0; i < 20; i++) {
      const w = addDays(monday(today), i * 7);
      if (Array.from({ length: 7 }, (_, k) => addDays(w, k)).some((d) => d >= today && offers.some((o) => nightStatus(o, d)))) return w;
    }
    return monday(today);
  }, [offers, today]);
  const [week, setWeek] = useState(firstWeek);
  const [start, setStart] = useState<StartStation | null>(null);

  useEffect(() => setStart(loadStart()), []);

  const list = useMemo(() => {
    const from = start?.lat && start.lng ? { lat: start.lat, lng: start.lng } : undefined;
    return offers
      .filter((o) => !kind || o.type === kind)
      .map((o) => {
        const d = from ? crowKm(from, o.coords) : undefined;
        return { o, d, travel: d !== undefined ? oevEstimate(d) : undefined };
      })
      .sort((a, b) => (a.travel ?? 0) - (b.travel ?? 0) || a.o.canton.localeCompare(b.o.canton) || a.o.name.localeCompare(b.o.name, "de"));
  }, [offers, kind, start]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const tonight = list.filter(({ o }) => nightStatus(o, today));
  const nextNight = useMemo(() => {
    for (let i = 1; i < 140; i++) {
      const d = addDays(today, i);
      const on = list.filter(({ o }) => nightStatus(o, d) === "fix");
      if (on.length) return { date: d, places: on.map(({ o }) => o.place) };
    }
    return undefined;
  }, [list, today]);
  const special = useMemo(
    () =>
      list
        .flatMap(({ o, travel }) => [...o.events.map((e) => ({ o, travel, date: e.date, title: e.title })), ...o.dates.filter((d) => !o.events.some((e) => e.date === d)).map((d) => ({ o, travel, date: d, title: "Zusatzabend" }))])
        .filter((x) => x.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [list, today],
  );

  return (
    <div>
      <section aria-labelledby="heute" className="card border-signal-500/40 p-5 sm:p-6">
        <h2 id="heute" className="kicker flex items-center gap-2"><Moon size={14} aria-hidden /> Heute Abend · {long(today)}</h2>
        {tonight.length ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {tonight.map(({ o, travel }) => (
              <li key={o.id}>
                <a href={`#${o.id}`} className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-ink-800 px-3.5 text-sm font-semibold text-cream hover:bg-ink-700">
                  {o.name.replace(/^Nacht(ski|schlitteln)\w* /i, "")} <span className="text-cream-faint">{timeText(o)}{travel ? ` · ${fmtMin(travel)}` : ""}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-cream-dim">
            Heute Abend ist nirgends Nachtskifahren angesagt.
            {nextNight && <> Nächster Abend: <strong className="text-cream">{long(nextNight.date)}</strong> in {nextNight.places.join(", ")}.</>}
          </p>
        )}
      </section>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ansicht">
          {([["woche", "Woche"], ["plan", "Wochenplan"], ["events", `Spezialabende (${special.length})`]] as [View, string][]).map(([v, l]) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className={chip(view === v)}>{l}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Art">
          {([["", "Alles"], ["ski", "Ski & Snowboard"], ["schlitteln", "Schlitteln"]] as [Kind, string][]).map(([k, l]) => (
            <button key={l} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="mt-4 max-w-sm"><StationPicker value={start} onChange={setStart} label="Ab wo fährst du? (sortiert nach Anreise)" /></div>

      {view === "woche" && (
        <section className="mt-6" aria-label="Wochenkalender">
          <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={() => setWeek(addDays(week, -7))} disabled={week <= monday(today)} className="btn-secondary min-h-[40px] px-3 py-1 text-sm disabled:opacity-40" aria-label="Vorherige Woche"><ChevronLeft size={16} aria-hidden /></button>
            <p className="font-display text-lg font-extrabold text-cream">{short(days[0])} – {short(days[6])}{week === monday(today) ? " · diese Woche" : week === firstWeek ? " · erste Nachtski-Woche" : ""}</p>
            <button type="button" onClick={() => setWeek(addDays(week, 7))} className="btn-secondary min-h-[40px] px-3 py-1 text-sm" aria-label="Nächste Woche"><ChevronRight size={16} aria-hidden /></button>
          </div>
          <ol className="mt-4 grid gap-3 md:grid-cols-7">
            {days.map((d) => {
              const on = list.map((x) => ({ ...x, st: nightStatus(x.o, d) })).filter((x) => x.st);
              const past = d < today;
              return (
                <li key={d} className={`rounded-2xl border p-3 ${d === today ? "border-signal-500 bg-signal-500/5" : "border-cream/10"} ${past ? "opacity-50" : ""}`}>
                  <p className="flex items-baseline justify-between text-sm">
                    <span className="font-bold text-cream">{WD[dow(d)]} {short(d)}</span>
                    <span className="text-xs text-cream-faint">{on.length || ""}</span>
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {on.map(({ o, st }) => {
                      const ev = eventOn(o, d);
                      return (
                        <li key={o.id}>
                          <a href={`#${o.id}`} title={st === "voraussichtlich" ? "Wochentag belegt, Saisondaten noch nicht publiziert" : undefined} className={`block rounded-lg px-2 py-1.5 text-xs leading-tight transition hover:bg-ink-800 ${st === "fix" ? "bg-ink-800/70" : "border border-dashed border-cream/20"} ${ev ? "ring-1 ring-signal-500/50" : ""}`}>
                            <span className="block font-semibold text-cream">{o.place}</span>
                            <span className="block text-cream-faint">{timeText(o)}{o.type === "schlitteln" ? " · Schlitteln" : ""}</span>
                            {ev && <span className="mt-0.5 block font-semibold text-signal-600">{ev}</span>}
                          </a>
                        </li>
                      );
                    })}
                    {on.length === 0 && <li className="text-xs text-cream-faint">–</li>}
                  </ul>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-xs text-cream-faint">Gestrichelt: Wochentag belegt, aber die Bergbahn hat die Saisondaten 2026/27 noch nicht publiziert. Umrandet: Spezialabend.</p>
        </section>
      )}

      {view === "plan" && (
        <section className="mt-6 overflow-x-auto" aria-label="Wochenplan">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs text-cream-faint">
                <th className="py-2 pr-3 font-semibold" scope="col">Wo</th>
                {[1, 2, 3, 4, 5, 6, 0].map((w) => <th key={w} scope="col" className="px-1 py-2 text-center font-semibold">{WD[w]}</th>)}
                <th className="py-2 pl-3 font-semibold" scope="col">Zeit</th>
              </tr>
            </thead>
            <tbody>
              {list.map(({ o, travel }) => (
                <tr key={o.id} className="border-t border-cream/10">
                  <th scope="row" className="py-2 pr-3 text-left font-normal">
                    <a href={`#${o.id}`} className="font-semibold text-cream hover:underline">{o.place}</a>
                    <span className="block text-xs text-cream-faint">{o.canton}{o.type === "schlitteln" ? " · Schlitteln" : ""}{travel ? ` · ${fmtMin(travel)}` : ""}</span>
                  </th>
                  {[1, 2, 3, 4, 5, 6, 0].map((w) => (
                    <td key={w} className="px-1 py-2 text-center">
                      {o.weekdays.includes(w) ? <span className="mx-auto block h-3.5 w-3.5 rounded-full bg-signal-500" aria-label={WD_LONG[w]} /> : <span className="mx-auto block h-1 w-1 rounded-full bg-cream/15" aria-hidden />}
                    </td>
                  ))}
                  <td className="whitespace-nowrap py-2 pl-3 text-cream-dim">{o.weekdays.length ? timeText(o) : <span className="text-xs">nur an Einzeldaten</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {view === "events" && (
        <section className="mt-6" aria-label="Spezialabende">
          {special.length ? (
            <ol className="space-y-2">
              {special.map((x) => (
                <li key={`${x.o.id}-${x.date}`} className="card flex flex-wrap items-baseline gap-x-4 gap-y-1 p-4">
                  <span className="w-44 shrink-0 font-display font-extrabold text-cream">{long(x.date)}</span>
                  <span className="min-w-0 flex-1">
                    <a href={`#${x.o.id}`} className="font-semibold text-cream hover:underline">{x.title}</a>
                    <span className="block text-sm text-cream-dim">{x.o.name} · {x.o.place} · {timeText(x.o)}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-cream-dim">Gerade keine Spezialabende angekündigt.</p>
          )}
        </section>
      )}

      <section className="mt-14" aria-labelledby="alle">
        <h2 id="alle" className="headline text-3xl text-cream">Alle {list.length} Angebote</h2>
        <ul className="mt-5 grid gap-4 lg:grid-cols-2">
          {list.map(({ o, d, travel }) => (
            <li key={o.id} id={o.id} className="card scroll-mt-24 p-5">
              <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-cream-faint">
                <span className="inline-flex items-center gap-1">{o.type === "ski" ? <MountainSnow size={13} aria-hidden /> : <Sparkles size={13} aria-hidden />} {o.type === "ski" ? "Nachtskifahren" : "Nachtschlitteln"}</span>
                <span>· {o.place}, {o.canton}</span>
                {travel !== undefined && <span className="inline-flex items-center gap-1">· <TrainFront size={12} aria-hidden /> ca. {fmtMin(travel)} ({Math.round(d!)} km)</span>}
              </p>
              <h3 className="mt-1 font-display text-xl font-extrabold leading-tight tracking-tight text-cream">{o.name}</h3>
              <p className="mt-2 flex flex-wrap items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 0].map((w) => (
                  <span key={w} className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${o.weekdays.includes(w) ? "bg-signal-500 text-white" : "bg-ink-800 text-cream-faint"}`}>{WD[w]}</span>
                ))}
                <span className="ml-2 font-display text-lg font-extrabold text-cream">{timeText(o)}</span>
              </p>
              <p className="mt-2 text-sm text-cream-dim">{o.season.text}</p>
              {o.events.length > 0 && <p className="mt-1 text-sm text-cream-dim">Spezial: {o.events.map((e) => `${short(e.date)} ${e.title}`).join(" · ")}</p>}
              <p className="mt-3 text-sm leading-relaxed text-cream">{o.text}</p>
              <p className="mt-2 text-sm text-cream-dim">{o.piste}</p>
              {o.extras.length > 0 && <p className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold text-cream-dim">{o.extras.map((x) => <span key={x} className="rounded-full bg-ink-800 px-2.5 py-1">{x}</span>)}</p>}
              <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                {o.ticket ? (
                  <p>
                    <span className="block text-xs font-semibold text-cream-faint">{o.ticket.unit}</span>
                    <span className="font-display text-xl font-extrabold text-cream">{o.ticket.price ? `CHF ${o.ticket.price}` : "gratis"}</span>
                    {o.ticket.note && <span className="block text-xs text-cream-faint">{o.ticket.note}</span>}
                  </p>
                ) : <span />}
                <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-semibold">
                  {o.skiAreaId && <Link href={`/skigebiete/${o.skiAreaId}`} className="text-signal-600 hover:text-signal-500">Pisten & Wetter</Link>}
                  {start?.name && <a href={`https://www.sbb.ch/de?von=${encodeURIComponent(start.name)}&nach=${encodeURIComponent(o.station)}&zeit=${o.from}`} target="_blank" rel="noopener" className="text-signal-600 hover:text-signal-500">Fahrplan</a>}
                  <a href={o.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Bergbahn</a>
                </p>
              </div>
              {o.confidence === "mittel" && <p className="mt-3 text-xs text-cream-faint">Angaben aus zweiter Quelle – vor der Fahrt bei der Bergbahn bestätigen.</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
