"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Link2, Shuffle } from "lucide-react";
import { AUDIENCE, MOODS, daysLabel, tripBudget, type Place } from "@/lib/ausfluege-core";
import { composePlan, type PlanInput, type PlanTour } from "@/lib/compose";
import TripTimeline, { type TimelineTour } from "@/components/TripTimeline";
import TripMap from "@/components/TripMap";
import TripBudget from "@/components/TripBudget";
import TripPlanPanel from "@/components/TripPlanPanel";

const chip = (on: boolean) =>
  `min-h-[40px] rounded-full border px-4 py-1.5 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;
const BUDGET = ["", "Günstig", "Mittel", "Gehoben", "Egal"];

export default function Planner({ regions, places, tours }: {
  regions: { slug: string; name: string; station: string; hotels: boolean }[];
  places: Place[];
  tours: PlanTour[];
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const input: PlanInput = {
    region: regions.some((r) => r.slug === sp.get("region")) ? sp.get("region")! : "",
    days: Math.min(3, Math.max(1, Number(sp.get("tage")) || 1)),
    audience: sp.get("mit") && AUDIENCE[sp.get("mit")!] ? sp.get("mit")! : "paar",
    moods: (sp.get("stimmung") ?? "").split(",").filter((m) => MOODS[m]),
    rain: sp.get("wetter") === "regen",
    budget: Math.min(4, Math.max(1, Number(sp.get("budget")) || 2)),
    date: /^\d{4}-\d{2}-\d{2}$/.test(sp.get("datum") ?? "") ? sp.get("datum")! : undefined,
  };
  const region = regions.find((r) => r.slug === input.region);
  const days = region && !region.hotels ? 1 : input.days;

  function set(patch: Record<string, string | null>) {
    const q = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) v ? q.set(k, v) : q.delete(k);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  }

  const plan = useMemo(() => (input.region ? composePlan({ ...input, days }, places, tours) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sp.toString(), places, tours]);

  const placeMap = useMemo(() => Object.fromEntries(places.map((p) => [p.id, p])), [places]);
  const budget = useMemo(() => (plan ? tripBudget(plan.days, placeMap, plan.hotel, input.rain) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan, placeMap]);
  const tourMap = useMemo(() => Object.fromEntries(tours.map((t) => [t.slug, { name: t.name, citySlug: t.citySlug } satisfies TimelineTour])), [tours]);

  useEffect(() => setCopied(false), [sp]);

  // Datum + Wetter aus dem Panel: Programm neu bauen (Öffnungszeiten, Regen)
  useEffect(() => {
    function onDate(e: Event) {
      const d = (e as CustomEvent<{ date: string; rainByDay: boolean[] }>).detail;
      const wetter = d.rainByDay.some(Boolean) ? "regen" : null;
      if (d.date !== sp.get("datum") || (d.rainByDay.length > 0 && wetter !== sp.get("wetter"))) set({ datum: d.date, ...(d.rainByDay.length ? { wetter } : {}) });
    }
    window.addEventListener("ut-trip-date", onDate);
    return () => window.removeEventListener("ut-trip-date", onDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  async function share() {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const toggleMood = (m: string) => {
    const next = input.moods.includes(m) ? input.moods.filter((x) => x !== m) : [...input.moods, m];
    set({ stimmung: next.join(",") || null });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
      <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
        <Group label="Wohin?">
          {regions.map((r) => (
            <button key={r.slug} type="button" aria-pressed={input.region === r.slug} onClick={() => set({ region: r.slug })} className={chip(input.region === r.slug)}>{r.name}</button>
          ))}
        </Group>
        <Group label="Wie lange?">
          {[1, 2, 3].map((d) => {
            const off = d > 1 && region && !region.hotels;
            return (
              <button key={d} type="button" disabled={Boolean(off)} aria-pressed={days === d} onClick={() => set({ tage: String(d) })} className={`${chip(days === d)} disabled:opacity-40`}>{daysLabel(d)}</button>
            );
          })}
        </Group>
        <Group label="Mit wem?">
          {Object.entries(AUDIENCE).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={input.audience === k} onClick={() => set({ mit: k })} className={chip(input.audience === k)}>{l}</button>
          ))}
        </Group>
        <Group label="Worauf habt ihr Lust?">
          {Object.entries(MOODS).filter(([k]) => k !== "familie").map(([k, l]) => (
            <button key={k} type="button" aria-pressed={input.moods.includes(k)} onClick={() => toggleMood(k)} className={chip(input.moods.includes(k))}>{l}</button>
          ))}
        </Group>
        <Group label="Wetterbericht?">
          <button type="button" aria-pressed={!input.rain} onClick={() => set({ wetter: null })} className={chip(!input.rain)}>Eher schön</button>
          <button type="button" aria-pressed={input.rain} onClick={() => set({ wetter: "regen" })} className={chip(input.rain)}>Regen angesagt</button>
        </Group>
        <Group label="Budget fürs Essen & Hotel">
          {[1, 2, 3, 4].map((b) => (
            <button key={b} type="button" aria-pressed={input.budget === b} onClick={() => set({ budget: String(b) })} className={chip(input.budget === b)}>{BUDGET[b]}</button>
          ))}
        </Group>
      </div>

      <div className="min-w-0">
        {!plan || !region ? (
          <div className="card p-6 sm:p-8">
            <p className="font-display text-2xl font-extrabold tracking-tight text-cream">Wähl links ein Ziel.</p>
            <p className="mt-2 text-cream-dim">Der Rest ist schon voreingestellt – du siehst dein Programm sofort und kannst es mit jedem Klick umbauen.</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="kicker">Dein Programm</p>
                <h2 className="headline mt-1 text-3xl text-cream sm:text-4xl">{region.name}, {daysLabel(days)}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={share} className="btn-secondary min-h-[44px] py-2 text-sm">
                  <Link2 size={16} aria-hidden /> {copied ? "Link kopiert" : "Link teilen"}
                </button>
                <button type="button" onClick={() => set({ stimmung: shuffleMoods(input.moods) })} className="btn-secondary min-h-[44px] py-2 text-sm">
                  <Shuffle size={16} aria-hidden /> Andere Mischung
                </button>
              </div>
            </div>
            {plan.notes.length > 0 && <ul className="mt-4 space-y-1 text-sm text-cream-dim">{plan.notes.map((n) => <li key={n}>{n}</li>)}</ul>}
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              <div className="card p-5">
                <p className="kicker mb-4">Dein Ausflug</p>
                <TripPlanPanel key={region.slug} region={region.slug} station={region.station} days={plan.days} />
              </div>
              {budget && budget.high > 0 && (
                <div className="card h-fit p-5 text-sm">
                  <TripBudget budget={budget} />
                </div>
              )}
            </div>
            <div className="mt-6">
              <TripMap key={sp.toString()} days={plan.days} places={placeMap} hotel={plan.hotel} />
            </div>
            <div className="mt-8">
              <TripTimeline title={`Ausflug ${region.name}`} days={plan.days} places={placeMap} tours={tourMap} hotel={plan.hotel} allowRainToggle={false} />
            </div>
            <p className="mt-10 text-sm text-cream-dim">
              Soll jemand mitkommen, der die Gegend kennt?{" "}
              <Link href={`/fuehrung?stadt=${region.slug}#anfrage`} className="font-semibold text-signal-600 hover:text-signal-500">Führung mit Guide anfragen</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label}>
      <p className="text-sm font-bold text-cream">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/** «Andere Mischung»: eine zufällige Stimmung dazu oder weg – ergibt andere Orte. */
function shuffleMoods(cur: string[]) {
  const all = Object.keys(MOODS).filter((m) => m !== "familie");
  const pick = all[Math.floor(Math.random() * all.length)];
  const next = cur.includes(pick) ? cur.filter((m) => m !== pick) : [...cur, pick];
  return next.join(",") || all.filter((m) => m !== pick)[0];
}
