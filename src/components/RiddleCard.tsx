"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import type { Riddle } from "@/lib/riddle-types";
import { riddlePoints, type RiddleResult } from "@/lib/game";
import { getRiddleResult, onGameChange, saveRiddleResult } from "@/lib/game-client";

const KIND: Record<Riddle["kind"], string> = { story: "Gut zugehört?", "vor-ort": "Schau dich um", knobel: "Knobelfrage" };

/** Ein Rätsel pro Stopp: zwei Versuche, Hinweis kostet die Hälfte. */
export default function RiddleCard({ tourKey, stopId, riddle, compact = false }: { tourKey: string; stopId: string; riddle: Riddle; compact?: boolean }) {
  const [result, setResult] = useState<RiddleResult | undefined>(undefined);
  const [wrong, setWrong] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setResult(getRiddleResult(tourKey, stopId));
    sync();
    return onGameChange(sync);
  }, [tourKey, stopId]);

  function finish(ok: boolean, tries: number) {
    const r: RiddleResult = { ok, tries, hint, at: Date.now() };
    saveRiddleResult(tourKey, stopId, r);
    setResult(r);
    if (ok) navigator.vibrate?.(60);
  }

  function choose(i: number) {
    if (result) return;
    setPicked(i);
    if (i === riddle.answer) finish(true, wrong.length + 1);
    else if (wrong.length >= 1) finish(false, 2);
    else setWrong([i]);
  }

  const max = riddle.points;
  const now = Math.max(1, Math.round(max / (hint ? 2 : 1) / (wrong.length ? 2 : 1)));
  const earned = riddlePoints(max, result);

  return (
    <div className={`rounded-2xl border border-signal-500/30 bg-signal-500/[0.04] ${compact ? "p-3.5" : "p-4 sm:p-5"}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="kicker text-signal-600">Rätsel · {KIND[riddle.kind]}</p>
        <p className="shrink-0 rounded-full bg-ink-900 px-2.5 py-0.5 font-display text-xs font-extrabold tabular-nums text-cream ring-1 ring-cream/10">
          {result ? (result.ok ? `+${earned} Punkte` : "0 Punkte") : `${now} Punkte`}
        </p>
      </div>
      <p className={`mt-2 font-display font-extrabold leading-snug text-cream ${compact ? "text-base" : "text-lg"}`}>{riddle.question}</p>

      <div className="mt-3 grid gap-1.5">
        {riddle.options.map((o, i) => {
          const isAnswer = i === riddle.answer;
          const state = result ? (isAnswer ? "right" : picked === i || wrong.includes(i) ? "wrong" : "off") : wrong.includes(i) ? "wrong" : "open";
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={Boolean(result) || wrong.includes(i)}
              className={`flex min-h-[44px] items-center gap-3 rounded-xl border px-3.5 py-2 text-left text-sm font-semibold transition ${
                state === "right"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : state === "wrong"
                    ? "border-red-300 bg-red-50 text-red-700 line-through decoration-red-300"
                    : state === "off"
                      ? "border-cream/10 bg-ink-900 text-cream-faint"
                      : "border-cream/15 bg-ink-900 text-cream hover:border-signal-500 active:scale-[0.99]"
              }`}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-800 font-display text-xs font-extrabold text-cream-dim">
                {state === "right" ? <Check size={14} aria-hidden="true" /> : state === "wrong" ? <X size={14} aria-hidden="true" /> : String.fromCharCode(65 + i)}
              </span>
              {o}
            </button>
          );
        })}
      </div>

      {result ? (
        <p className="mt-3 text-sm leading-relaxed text-cream-dim">
          <span className="font-bold text-cream">{result.ok ? (result.tries === 1 ? "Richtig! " : "Im zweiten Anlauf! ") : "Knapp daneben. "}</span>
          {riddle.explanation}
        </p>
      ) : (
        <div className="mt-3 text-sm">
          {wrong.length > 0 && <p className="font-semibold text-red-700">Nicht ganz – ein Versuch bleibt dir.</p>}
          {hint ? (
            <p className="mt-1 leading-relaxed text-cream-dim">
              <span className="font-bold text-cream">Hinweis: </span>
              {riddle.hint}
            </p>
          ) : (
            <button onClick={() => setHint(true)} className="mt-1 font-semibold text-cream-faint underline underline-offset-2 hover:text-cream">
              Hinweis zeigen (halbe Punkte)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
