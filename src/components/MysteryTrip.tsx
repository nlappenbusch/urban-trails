"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Backpack, Dices, Gift, Eye, Share2, TrainFront, Wallet } from "lucide-react";
import { AUDIENCE, addDays, fmtMin } from "@/lib/ausfluege-core";
import { WEATHER_LABEL, weatherKind } from "@/lib/wetter-core";
import { PACK, decodeMystery, fmtDate, type Mystery } from "@/lib/mystery";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import WeatherIcon from "@/components/WeatherIcon";

const chip = (on: boolean) =>
  `min-h-[40px] shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

const BUDGETS = [
  { label: "egal", value: 0 },
  { label: "bis 40.–", value: 40 },
  { label: "bis 80.–", value: 80 },
  { label: "bis 150.–", value: 150 },
];

function weekend(today: string) {
  const d = new Date(`${today}T12:00:00Z`).getUTCDay();
  const sat = addDays(today, (6 - d + 7) % 7);
  return { sat, sun: d === 0 ? today : addDays(sat, 1) };
}

/** Überraschungs-Ausflug: Ziel wird ausgelost, sichtbar sind nur Abfahrt, Gleis und Packliste. */
export default function MysteryTrip() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("z") ?? "";
  const mystery = useMemo(() => (token ? decodeMystery(token) : undefined), [token]);

  const today = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), []);
  const { sat, sun } = weekend(today);
  const [start, setStart] = useState<StartStation | null>(null);
  const [date, setDate] = useState(sat);
  const [mit, setMit] = useState("paar");
  const [budget, setBudget] = useState(0);
  const [state, setState] = useState<{ loading: boolean; error?: string }>({ loading: false });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => setStart(loadStart()), []);
  useEffect(() => setRevealed(false), [token]);

  async function draw(exclude?: string) {
    const from = start?.name ?? mystery?.s;
    if (!from) return;
    setState({ loading: true });
    const q = new URLSearchParams({ start: from, datum: mystery?.d ?? date, mit: mystery?.w ?? mit });
    if (budget) q.set("budget", String(budget));
    if (exclude) q.set("nicht", exclude);
    try {
      const r = await fetch(`/api/ueberraschung?${q}`).then((x) => x.json());
      if (r.token) {
        setState({ loading: false });
        router.replace(`/ausfluege/ueberraschung?z=${r.token}`, { scroll: false });
      } else setState({ loading: false, error: r.error ?? "Da hat etwas nicht geklappt." });
    } catch {
      setState({ loading: false, error: "Gerade keine Verbindung zum Server." });
    }
  }

  if (mystery) return <Ticket m={mystery} token={token} revealed={revealed} onReveal={() => setRevealed(true)} onRedraw={() => draw(mystery.r)} loading={state.loading} error={state.error} />;

  return (
    <div className="card grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
      <StationPicker value={start} onChange={setStart} label="Wo startet ihr?" />
      <div>
        <p className="text-sm font-bold text-cream">Wann?</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <button type="button" aria-pressed={date === sat} onClick={() => setDate(sat)} className={chip(date === sat)}>Samstag</button>
          <button type="button" aria-pressed={date === sun} onClick={() => setDate(sun)} className={chip(date === sun)}>Sonntag</button>
          <label className="sr-only" htmlFor="mystery-date">Anderes Datum</label>
          <input id="mystery-date" type="date" min={today} max={addDays(today, 6)} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="min-h-[40px] rounded-full border border-cream/20 bg-ink-900 px-4 text-sm font-semibold text-cream" />
        </div>
        <p className="mt-1 text-xs text-cream-faint">Bis eine Woche im Voraus – weiter reicht die Wetterprognose nicht.</p>
      </div>
      <div>
        <p className="text-sm font-bold text-cream">Mit wem?</p>
        <div className="-mx-1 mt-1.5 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
          {Object.entries(AUDIENCE).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={mit === k} onClick={() => setMit(k)} className={chip(mit === k)}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-cream">Budget pro Person (ohne Bahn)</p>
        <div className="-mx-1 mt-1.5 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
          {BUDGETS.map((b) => (
            <button key={b.value} type="button" aria-pressed={budget === b.value} onClick={() => setBudget(b.value)} className={chip(budget === b.value)}>{b.label}</button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2">
        <button type="button" onClick={() => draw()} disabled={!start || state.loading} className="btn-primary disabled:opacity-50">
          <Dices size={18} aria-hidden /> {state.loading ? "Wir losen aus …" : "Ziel auslosen"}
        </button>
        {!start && <p className="mt-2 text-sm text-cream-dim">Erst den Startort wählen.</p>}
        {state.error && <p className="mt-2 text-sm text-cream" role="alert">{state.error}</p>}
      </div>
    </div>
  );
}

function Ticket({ m, token, revealed, onReveal, onRedraw, loading, error }: { m: Mystery; token: string; revealed: boolean; onReveal: () => void; onRedraw: () => void; loading: boolean; error?: string }) {
  const [copied, setCopied] = useState(false);
  const planUrl = `/ausfluege/planen?${new URLSearchParams({ region: m.r, tage: "1", datum: m.d, mit: m.w, start: m.s })}`;
  const sbb = `https://www.sbb.ch/de?${new URLSearchParams({ von: m.s, nach: m.n, datum: m.d, zeit: m.t })}`;

  async function share() {
    const url = `${location.origin}/ausfluege/ueberraschung?z=${token}`;
    try {
      if (navigator.share) await navigator.share({ title: "Überraschungs-Ausflug", text: `Am ${fmtDate(m.d)} geht's los – wohin, verrate ich nicht.`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      /* abgebrochen */
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card overflow-hidden">
        <div className="border-b border-dashed border-cream/20 bg-signal-500 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold text-white/80">Überraschungs-Ausflug</p>
          <p className="mt-2 font-display text-3xl font-extrabold capitalize tracking-tight sm:text-4xl">{fmtDate(m.d)}</p>
          <p className="mt-1 text-white/90">{AUDIENCE[m.w] ?? ""}</p>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="kicker inline-flex items-center gap-1.5"><TrainFront size={14} aria-hidden /> Treffpunkt</p>
            <p className="mt-2 font-display text-5xl font-extrabold tabular-nums tracking-tight text-cream">{m.t}</p>
            <p className="mt-1 text-cream">{m.s}{m.g ? `, Gleis ${m.g}` : ""}</p>
            <p className="mt-1 text-sm text-cream-dim">
              {fmtMin(m.m)} unterwegs, {m.u === 0 ? "ohne Umsteigen" : `${m.u}× umsteigen`}. Ankunft {m.a}.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            {m.wc !== undefined && (
              <p className="inline-flex items-center gap-2 text-cream">
                <WeatherIcon code={m.wc} className="text-signal-600" /> Am Ziel: {WEATHER_LABEL[weatherKind(m.wc)]}{m.wt !== undefined ? `, bis ${m.wt}°` : ""}
              </p>
            )}
            {m.c && (
              <p className="flex items-center gap-2 text-cream"><Wallet size={16} className="text-signal-600" aria-hidden /> ca. CHF {m.c[0]}–{m.c[1]} pro Person, ohne Bahn</p>
            )}
            <div>
              <p className="flex items-center gap-2 font-semibold text-cream"><Backpack size={16} className="text-signal-600" aria-hidden /> Einpacken</p>
              <ul className="mt-1.5 space-y-1 pl-6 text-cream-dim">
                {m.p.map((k) => PACK[k] && <li key={k} className="list-disc">{PACK[k]}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-cream/10 p-6 sm:p-8" aria-live="polite">
          {revealed ? (
            <div>
              <p className="kicker">Es geht nach</p>
              <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-cream sm:text-5xl">{m.n}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={planUrl} className="btn-primary">Euer Programm</Link>
                <Link href={`/ausflugsziele/${m.r}`} className="btn-secondary">Alles über {m.n}</Link>
                <a href={sbb} target="_blank" rel="noopener" className="btn-secondary">Billett bei der SBB</a>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={onReveal} className="btn-primary"><Eye size={18} aria-hidden /> Ziel aufdecken</button>
              <p className="text-sm text-cream-dim">Oder erst am Bahnhof – spätestens die Anzeigetafel verrät&apos;s.</p>
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-3">
        <Link href={`/geschenk?z=${token}`} className="card group flex gap-3 p-4 transition hover:border-cream/30">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-signal-500 text-white"><Gift size={19} aria-hidden /></span>
          <span>
            <span className="block font-display font-extrabold text-cream group-hover:underline">Verschenken</span>
            <span className="block text-sm text-cream-dim">Als Karte zum Ausdrucken oder per Link – das Ziel bleibt geheim.</span>
          </span>
        </Link>
        <button type="button" onClick={share} className="card flex w-full gap-3 p-4 text-left transition hover:border-cream/30">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-800 text-signal-600"><Share2 size={19} aria-hidden /></span>
          <span>
            <span className="block font-display font-extrabold text-cream">{copied ? "Link kopiert" : "Link schicken"}</span>
            <span className="block text-sm text-cream-dim">Wer den Link öffnet, sieht nur Abfahrt und Packliste.</span>
          </span>
        </button>
        <button type="button" onClick={onRedraw} disabled={loading} className="card flex w-full gap-3 p-4 text-left transition hover:border-cream/30 disabled:opacity-60">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-800 text-signal-600"><Dices size={19} aria-hidden /></span>
          <span>
            <span className="block font-display font-extrabold text-cream">{loading ? "Wir losen neu aus …" : "Neu auslosen"}</span>
            <span className="block text-sm text-cream-dim">Gleicher Tag, anderes Ziel.</span>
          </span>
        </button>
        {error && <p className="text-sm text-cream" role="alert">{error}</p>}
        <p className="text-xs leading-relaxed text-cream-faint">
          Fürs Billett braucht&apos;s das Ziel: Wer verschenkt, deckt kurz auf und kauft es vorher – oder ihr reist mit GA oder Tageskarte.
        </p>
      </aside>
    </div>
  );
}
