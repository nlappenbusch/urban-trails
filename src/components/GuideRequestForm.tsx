"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { INTERESTS, LANGUAGES, TIMES } from "@/lib/guide-options";

export interface FormCity { slug: string; name: string }
export interface FormTour { slug: string; name: string; city: string }

const field = "mt-1 w-full rounded-xl border border-cream/20 bg-ink-900 px-4 py-3 text-base text-cream outline-none focus:border-signal-500";
const label = "block text-sm font-bold text-cream";

export default function GuideRequestForm({ cities, tours, initialCity = "", initialTour = "" }: {
  cities: FormCity[];
  tours: FormTour[];
  initialCity?: string;
  initialTour?: string;
}) {
  const [city, setCity] = useState(initialCity);
  const [tour, setTour] = useState(initialTour);
  const [interests, setInterests] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ id: string; name: string } | null>(null);

  const cityTours = useMemo(() => tours.filter((t) => t.city === city), [tours, city]);
  const today = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), []);

  function toggle(i: string) {
    setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const body = { ...Object.fromEntries(f.entries()), city, tour, interests };
    setBusy(true);
    try {
      const res = await fetch("/api/fuehrung", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Das hat nicht geklappt. Bitte versuch es nochmal.");
      setDone({ id: data.id, name: String(f.get("name") ?? "").split(" ")[0] });
      window.scrollTo({ top: (e.target as HTMLElement).getBoundingClientRect().top + window.scrollY - 120 });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card p-6 sm:p-8" role="status">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-signal-500 text-white"><Check size={20} aria-hidden /></span>
        <p className="mt-4 font-display text-2xl font-extrabold tracking-tight text-cream">Danke{done.name ? `, ${done.name}` : ""}!</p>
        <p className="mt-2 max-w-lg leading-relaxed text-cream-dim">
          Deine Anfrage ist bei uns. Wir melden uns per E-Mail mit einem Vorschlag und einem festen Preis. Zugesagt ist erst, wenn du bestätigst.
        </p>
        <p className="mt-3 text-sm text-cream-faint">Anfragenummer {done.id}</p>
        <Link href="/touren" className="btn-secondary mt-6">Bis dahin: Touren ansehen</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-5 sm:p-8" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="g-city">Stadt</label>
          <select id="g-city" required value={city} onChange={(e) => { setCity(e.target.value); setTour(""); }} className={field}>
            <option value="" disabled>Bitte wählen</option>
            {cities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="g-tour">Tour als Grundlage <span className="font-normal text-cream-faint">(optional)</span></label>
          <select id="g-tour" value={tour} onChange={(e) => setTour(e.target.value)} disabled={!city} className={`${field} disabled:opacity-50`}>
            <option value="">Guide stellt zusammen</option>
            {cityTours.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="g-date">Wunschdatum <span className="font-normal text-cream-faint">(optional)</span></label>
          <input id="g-date" name="date" type="date" min={today} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="g-time">Tageszeit</label>
          <select id="g-time" name="time" required defaultValue="Flexibel" className={field}>
            {TIMES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="g-size">Personen</label>
          <input id="g-size" name="groupSize" type="number" inputMode="numeric" min={1} max={200} required defaultValue={6} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="g-lang">Sprache</label>
          <select id="g-lang" name="language" required defaultValue="Deutsch" className={field}>
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className={label}>Worauf habt ihr Lust? <span className="font-normal text-cream-faint">(mehrere möglich)</span></legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTERESTS.map((i) => {
            const on = interests.includes(i);
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(i)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"
                }`}
              >
                {i}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label className={label} htmlFor="g-occasion">Anlass <span className="font-normal text-cream-faint">(optional)</span></label>
        <input id="g-occasion" name="occasion" maxLength={120} placeholder="z. B. Firmenausflug, Geburtstag, Schulreise" className={field} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="g-name">Name</label>
          <input id="g-name" name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="g-email">E-Mail</label>
          <input id="g-email" name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="g-phone">Telefon <span className="font-normal text-cream-faint">(optional)</span></label>
          <input id="g-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} />
        </div>
      </div>

      <div className="mt-6">
        <label className={label} htmlFor="g-msg">Noch etwas, das der Guide wissen sollte? <span className="font-normal text-cream-faint">(optional)</span></label>
        <textarea id="g-msg" name="message" rows={4} maxLength={2000} placeholder="Rollstuhl dabei, zwei Kinder, wir wollen unbedingt zum …" className={field} />
      </div>

      {/* Falle für Bots, für Menschen unsichtbar */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="g-web">Website</label>
        <input id="g-web" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {error && <p role="alert" className="mt-5 text-sm font-semibold text-red-700">{error}</p>}
      <button disabled={busy} className="btn-primary mt-6 w-full justify-center disabled:opacity-60 sm:w-auto">
        {busy ? "Wird gesendet …" : "Unverbindlich anfragen"}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-cream-faint">
        Wir nutzen deine Angaben nur, um dir ein Angebot zu machen. Mehr dazu im <Link href="/datenschutz" className="underline">Datenschutz</Link>.
      </p>
    </form>
  );
}
