"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { Baby, CloudRain, Dog, RotateCcw, Shuffle, Sun, Users } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import ZielRow from "@/components/ZielRow";
import type { Hit } from "@/lib/hit";
import type { Mit, Wetter } from "@/lib/wohin";

interface Res {
  wetter: Wetter;
  heute?: { kind: string; label: string; tmax: number; tmin: number; rainProb: number };
  total: number;
  hits: Hit[];
}

const WETTER: { v: Wetter; label: string; Icon?: typeof Sun }[] = [
  { v: "egal", label: "Egal" },
  { v: "schoen", label: "Schön", Icon: Sun },
  { v: "regen", label: "Regen", Icon: CloudRain },
];
const MIT: { v: Mit; label: string; Icon: typeof Sun }[] = [
  { v: "kinder", label: "Mit Kindern", Icon: Baby },
  { v: "hund", label: "Mit Hund", Icon: Dog },
  { v: "gruppe", label: "Als Gruppe", Icon: Users },
];

/** Neue Liste mit gleitenden Zeilen (View Transitions), ohne Animation bei «weniger Bewegung». */
function swap(fn: () => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (d.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) d.startViewTransition(() => flushSync(fn));
  else fn();
}

export default function WohinFinder({ initial }: { initial: Res }) {
  const [start, setStart] = useState<StartStation | null>(null);
  const [wetter, setWetter] = useState<Wetter | "auto">("auto");
  const [mit, setMit] = useState<Mit[]>([]);
  const [n, setN] = useState(30);
  const [res, setRes] = useState<Res>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0);
  const first = useRef(true);

  useEffect(() => setStart(loadStart()), []);

  useEffect(() => {
    // Erster Aufruf ohne Haltestelle: die Liste vom Server stimmt schon
    if (first.current && !start && wetter === "auto" && !mit.length && n === 30 && !tick) {
      first.current = false;
      return;
    }
    first.current = false;
    let stop = false;
    setBusy(true);
    setErr("");
    const q = new URLSearchParams({ wetter, n: String(n) });
    if (start?.lat && start.lng) q.set("lat", start.lat.toFixed(4)), q.set("lng", start.lng.toFixed(4));
    if (mit.length) q.set("mit", mit.join(","));
    fetch(`/api/wohin?${q}`)
      .then((r) => r.json())
      .then((r) => {
        if (stop) return;
        if (r.error) return setErr(r.error);
        swap(() => setRes(r));
      })
      .catch(() => !stop && setErr("Gerade keine Verbindung zum Server."))
      .finally(() => !stop && setBusy(false));
    return () => {
      stop = true;
    };
  }, [start, wetter, mit, n, tick]);

  const shown = wetter === "auto" ? res.wetter : wetter;
  const toggleMit = (v: Mit) => (setN(30), setMit((m) => (m.includes(v) ? m.filter((x) => x !== v) : [...m, v])));
  const hasPos = Boolean(start?.lat);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <section aria-label="Deine Angaben" className="card p-4 sm:p-5 lg:sticky lg:top-20">
        <StationPicker value={start} onChange={(s) => (setN(30), setStart(s))} label="Ab welcher Haltestelle?" />

        <div className="mt-4 space-y-2.5 lg:space-y-0">
          <fieldset>
            <legend className="sr-only lg:not-sr-only lg:text-sm lg:font-bold lg:text-cream">Wetter</legend>
            <div role="radiogroup" aria-label="Wetter" className="grid grid-cols-3 gap-1 rounded-full bg-ink-800 p-1 lg:mt-2">
              {WETTER.map(({ v, label, Icon }) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={shown === v}
                  onClick={() => (setN(30), setWetter(v))}
                  className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-bold transition duration-200 ease-out active:scale-[0.97] ${shown === v ? "bg-ink-900 text-cream shadow-soft" : "text-cream-dim hover:text-cream"}`}
                >
                  {Icon && <Icon size={16} aria-hidden />}
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="lg:mt-5">
            <legend className="sr-only lg:not-sr-only lg:text-sm lg:font-bold lg:text-cream">Wer kommt mit?</legend>
            <div className="flex flex-wrap gap-2 lg:mt-2">
              {MIT.map(({ v, label, Icon }) => (
                <button key={v} type="button" aria-pressed={mit.includes(v)} onClick={() => toggleMit(v)} className="chip">
                  <Icon size={16} aria-hidden /> <span className="lg:hidden">{label.replace(/^(Mit|Als) /, "")}</span><span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <p className="mt-2 text-[13px] leading-snug text-cream-faint empty:hidden lg:mt-3" aria-live="polite">
          {res.heute && wetter === "auto" ? (
            <>Heute bei {start?.name}: {res.heute.label}, bis {res.heute.tmax}° – {res.wetter === "regen" ? "darum nur Ziele mit Dach." : res.wetter === "schoen" ? "darum Ziele draussen." : "alles möglich."}</>
          ) : wetter !== "auto" && hasPos ? (
            <button type="button" onClick={() => setWetter("auto")} className="inline-flex items-center gap-1 font-semibold text-signal-600 hover:text-signal-700">
              <RotateCcw size={13} aria-hidden /> Wieder nach Vorhersage
            </button>
          ) : null}
        </p>
      </section>

      <section aria-label="Vorschläge" aria-busy={busy}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg font-bold tracking-[-0.01em] text-cream">
            {hasPos ? <>Für dich ab {start?.name}</> : <>Gerade Saison in der Schweiz</>}
          </h2>
          <p className="tabnums text-sm text-cream-faint">{res.total.toLocaleString("de-CH")} passende Ziele</p>
        </div>
        {!hasPos && <p className="mt-1 text-sm text-cream-dim">Wähl deine Haltestelle – dann steht das Nächste oben, mit Entfernung.</p>}
        {err && (
          <p role="alert" className="mt-3 rounded-2xl bg-ink-900 p-3 text-sm text-cream-dim ring-1 ring-cream/10">
            {err}{" "}
            <button type="button" onClick={() => setTick((t) => t + 1)} className="font-bold text-signal-600">Nochmals</button>
          </p>
        )}
        {res.hits.length ? (
          <ul className={`mt-3 grid gap-3 transition-opacity duration-200 xl:grid-cols-2 ${busy ? "opacity-60" : ""}`}>
            {res.hits.map((h) => (
              <ZielRow key={h.id} h={h} />
            ))}
          </ul>
        ) : (
          <div className="mt-3 rounded-[22px] bg-ink-900 p-6 text-cream-dim shadow-soft">
            <p className="font-bold text-cream">Dazu passt gerade nichts.</p>
            <p className="mt-1 text-sm">Nimm einen Filter weg – bei Regen mit Hund wird es zum Beispiel eng.</p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {res.hits.length >= n && n < 90 && (
            <button type="button" onClick={() => setN(n + 30)} className="btn-secondary min-h-[48px]">
              30 weitere zeigen
            </button>
          )}
          <Link href="/ueberrasche-mich" className="inline-flex min-h-[48px] items-center gap-2 px-2 text-sm font-bold text-signal-600 hover:text-signal-700">
            <Shuffle size={16} aria-hidden /> Überrasch mich
          </Link>
        </div>
      </section>
    </div>
  );
}
