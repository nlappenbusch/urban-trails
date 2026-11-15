"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Link2, Lightbulb, Loader2, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import TripTimeline from "@/components/TripTimeline";
import TripMap from "@/components/TripMap";
import TripBudget from "@/components/TripBudget";
import TripPlanPanel from "@/components/TripPlanPanel";
import HotelCheck from "@/components/HotelCheck";
import { addDays, type Budget, type Place, type TripDay } from "@/lib/ausfluege-core";
import type { TimelineTour } from "@/components/TripTimeline";

interface Result {
  summary: string[];
  region: { slug: string; name: string; station: string };
  intent: { date: string; days: number; audience: string; adults: number; moods: string[] };
  intro: string;
  tips: string[];
  days: TripDay[];
  hotel?: Place;
  places: Record<string, Place>;
  tours: Record<string, TimelineTour>;
  budget: Budget;
  fallback: boolean;
  error?: string;
}

const EXAMPLES = [
  "Samstag mit den Kids (6 und 9), die lieben Tiere, max. 120 Franken für alle, bitte nicht zu viel laufen",
  "Zu zweit ein Wochenende, wir wollen was richtig Krasses erleben und abends gut essen",
  "Morgen allein, ab Bern, Regen angesagt – Museum ist ok, aber nichts Langweiliges",
  "Mit 4 Kollegen, Wandern mit Aussicht und danach Fondue, ab Winterthur",
];

const STEPS = ["Wunsch verstehen …", "Wetter und Fahrplan anschauen …", "Orte prüfen, die an dem Tag offen sind …", "Programm zusammenstellen …"];

export default function KiPlanner() {
  const [start, setStart] = useState<StartStation | null>(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [res, setRes] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStart(loadStart());
    const q = new URLSearchParams(location.search).getAll("w").filter(Boolean).slice(0, 5);
    if (q.length) void run(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!busy) return;
    setStep(0);
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 3500);
    return () => clearInterval(t);
  }, [busy]);

  async function run(list: string[]) {
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      const r = await fetch("/api/ki-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: list, start: start ?? loadStart() ?? undefined }) });
      const j = (await r.json()) as Result;
      if (!r.ok || j.error) throw new Error(j.error ?? "Etwas ist schiefgelaufen.");
      setMessages(list);
      setRes(j);
      setText("");
      const u = new URL(location.href);
      u.searchParams.delete("w");
      list.forEach((m) => u.searchParams.append("w", m));
      history.replaceState(null, "", u.toString());
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const t = text.trim();
    if (t.length < 8 || busy) return;
    void run(res ? [...messages, t] : [t]);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="card p-4 sm:p-5">
        <label htmlFor="ki-text" className="text-sm font-bold text-cream">
          {res ? "Passt noch nicht ganz? Sag, was anders sein soll." : "Erzähl einfach: wer, wann, worauf ihr Lust habt – und was gar nicht geht."}
        </label>
        <div className="mt-2 flex items-end gap-2">
          <textarea
            id="ki-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={res ? 2 : 3}
            maxLength={600}
            placeholder={res ? "z. B. «lieber was mit Wasser», «weniger Museum», «doch erst am Sonntag»" : EXAMPLES[0]}
            className="min-h-[56px] w-full resize-y rounded-xl border border-cream/20 bg-ink-900 px-3 py-2.5 text-base text-cream placeholder:text-cream-faint focus:border-signal-500 focus:outline-none"
          />
          <button type="submit" disabled={busy || text.trim().length < 8} aria-label="Programm machen" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-signal-500 text-white transition hover:bg-signal-600 disabled:opacity-40">
            {busy ? <Loader2 size={20} className="animate-spin" aria-hidden /> : <ArrowUp size={20} aria-hidden />}
          </button>
        </div>
        {!res && (
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" onClick={() => setText(ex)} className="rounded-full border border-cream/15 px-3 py-1.5 text-left text-xs text-cream-dim transition hover:border-signal-500 hover:text-cream">
                {ex}
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 max-w-sm">
          <StationPicker value={start} onChange={setStart} label="Ab wo fährst du? (für die Region-Wahl)" />
        </div>
      </form>

      {busy && (
        <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-cream-dim" role="status">
          <Sparkles size={16} className="text-signal-600" aria-hidden /> {STEPS[step]}
        </p>
      )}
      {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}

      {res && (
        <div ref={resultRef} className="mt-10 scroll-mt-24">
          {messages.length > 0 && (
            <ol className="mb-5 space-y-1 text-sm text-cream-faint">
              {messages.map((m, i) => (
                <li key={i}>«{m}»</li>
              ))}
            </ol>
          )}
          <p className="kicker">Dein Programm{res.fallback ? " (vom normalen Planer – die KI hat gerade gestreikt)" : ""}</p>
          <h2 className="headline mt-1 text-3xl text-cream sm:text-4xl">{res.region.name}</h2>
          <p className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
            {res.summary.map((s) => (
              <span key={s} className="rounded-full bg-ink-800 px-2.5 py-1 text-cream-dim">{s}</span>
            ))}
          </p>
          {res.intro && <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream">{res.intro}</p>}
          {res.tips.length > 0 && (
            <ul className="mt-4 max-w-3xl space-y-1.5 text-sm text-cream-dim">
              {res.tips.map((t) => (
                <li key={t} className="flex gap-2"><Lightbulb size={15} className="mt-0.5 shrink-0 text-signal-600" aria-hidden /> {t}</li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={share} className="btn-secondary min-h-[44px] py-2 text-sm"><Link2 size={16} aria-hidden /> {copied ? "Link kopiert" : "Link teilen"}</button>
            <button type="button" disabled={busy} onClick={() => run([...messages, "Mach mir eine ganz andere Variante – andere Orte, gleiche Wünsche."])} className="btn-secondary min-h-[44px] py-2 text-sm"><RotateCcw size={16} aria-hidden /> Ganz andere Variante</button>
            <Link href={`/ausfluege/planen?region=${res.region.slug}&tage=${res.intent.days}&datum=${res.intent.date}&mit=${res.intent.audience}${res.intent.moods.length ? `&stimmung=${res.intent.moods.join(",")}` : ""}`} className="btn-secondary min-h-[44px] py-2 text-sm"><Wand2 size={16} aria-hidden /> Selbst weiterbauen</Link>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <div className="card p-5">
              <p className="kicker mb-4">Hin und zurück</p>
              <TripPlanPanel key={res.region.slug + res.intent.date} region={res.region.slug} station={res.region.station} days={res.days} />
            </div>
            {(res.budget.high > 0 || res.intent.days > 1) && (
              <div className="card h-fit space-y-6 p-5 text-sm">
                {res.budget.high > 0 && <TripBudget budget={res.budget} />}
                {res.intent.days > 1 && (
                  <div className={res.budget.high > 0 ? "border-t border-cream/10 pt-5" : ""}>
                    <HotelCheck place={res.region.name.split(/[ ,&(/]/)[0]} checkin={res.intent.date} checkout={addDays(res.intent.date, res.intent.days - 1)} adults={res.intent.adults} />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-6"><TripMap key={messages.join("|")} days={res.days} places={res.places} hotel={res.hotel} /></div>
          <div className="mt-8">
            <TripTimeline title={`Ausflug ${res.region.name}`} days={res.days} places={res.places} tours={res.tours} hotel={res.hotel} allowRainToggle={false} />
          </div>
          <p className="mt-8 text-xs text-cream-faint">
            Die KI wählt nur aus Orten, die wir geprüft haben, und prüft Öffnungszeiten für dein Datum. Die Texte schreibt sie selbst – Preise und Zeiten kommen aus unserer Datenbank.
          </p>
        </div>
      )}
    </div>
  );
}
