"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Dices, Link2, Printer } from "lucide-react";
import { daysLabel } from "@/lib/ausfluege-core";
import { PACK, decodeMystery, fmtDate } from "@/lib/mystery";

export interface GiftTrip {
  slug: string;
  title: string;
  teaser: string;
  regionName: string;
  days: number;
  img?: string;
}

const field = "mt-1 w-full rounded-xl border border-cream/20 bg-ink-900 px-3 py-2.5 text-cream placeholder:text-cream-faint focus:border-signal-500 focus:outline-none";

/** Geschenkkarte für einen Ausflug: Formular + Vorschau, druckbar, mit QR-Code zum Programm. */
export default function GiftCard({ trips }: { trips: GiftTrip[] }) {
  const sp = useSearchParams();
  const token = sp.get("z") ?? "";
  const mystery = useMemo(() => (token ? decodeMystery(token) : undefined), [token]);
  const [tripSlug, setTripSlug] = useState(sp.get("trip") ?? "");
  const [fuer, setFuer] = useState(sp.get("fuer") ?? "");
  const [von, setVon] = useState(sp.get("von") ?? "");
  const [text, setText] = useState(sp.get("text") ?? "");
  const [datum, setDatum] = useState(sp.get("datum") ?? "");
  const [copied, setCopied] = useState(false);
  const trip = trips.find((t) => t.slug === tripSlug);

  useEffect(() => setCopied(false), [fuer, von, text, datum, tripSlug]);

  const target = mystery
    ? `/ausfluege/ueberraschung?z=${token}`
    : trip
      ? `/ausfluege/${trip.slug}${datum ? `?datum=${datum}` : ""}`
      : "";

  async function copyLink() {
    const q = new URLSearchParams();
    if (token) q.set("z", token);
    else if (tripSlug) q.set("trip", tripSlug);
    for (const [k, v] of Object.entries({ fuer, von, text, datum })) if (v) q.set(k, v);
    const url = `${location.origin}/geschenk?${q}`;
    try {
      if (navigator.share) await navigator.share({ title: "Ein Ausflug für dich", url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      /* abgebrochen */
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <style>{`@media print{body *{visibility:hidden}#gift-card,#gift-card *{visibility:visible}#gift-card{position:absolute;inset:0 auto auto 0;width:100%;box-shadow:none;border:1px solid #ddd}@page{margin:12mm}}`}</style>
      <form className="space-y-4 print:hidden" onSubmit={(e) => e.preventDefault()}>
        {!mystery && (
          <div>
            <label htmlFor="g-trip" className="text-sm font-bold text-cream">Welcher Ausflug?</label>
            <select id="g-trip" value={tripSlug} onChange={(e) => setTripSlug(e.target.value)} className={field}>
              <option value="">Bitte wählen</option>
              {trips.map((t) => <option key={t.slug} value={t.slug}>{t.regionName}: {t.title}</option>)}
            </select>
            <Link href="/ausfluege/ueberraschung" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-signal-600 hover:text-signal-500">
              <Dices size={15} aria-hidden /> Lieber ein Ziel auslosen, das geheim bleibt
            </Link>
          </div>
        )}
        <div>
          <label htmlFor="g-fuer" className="text-sm font-bold text-cream">Für</label>
          <input id="g-fuer" value={fuer} maxLength={60} onChange={(e) => setFuer(e.target.value)} placeholder="Name" className={field} />
        </div>
        <div>
          <label htmlFor="g-von" className="text-sm font-bold text-cream">Von</label>
          <input id="g-von" value={von} maxLength={60} onChange={(e) => setVon(e.target.value)} placeholder="Dein Name" className={field} />
        </div>
        {!mystery && (
          <div>
            <label htmlFor="g-datum" className="text-sm font-bold text-cream">Datum (optional)</label>
            <input id="g-datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={field} />
          </div>
        )}
        <div>
          <label htmlFor="g-text" className="text-sm font-bold text-cream">Ein paar Worte</label>
          <textarea id="g-text" value={text} maxLength={280} rows={4} onChange={(e) => setText(e.target.value)} placeholder="Alles Gute zum Geburtstag! Den Tag halten wir uns frei." className={field} />
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => window.print()} disabled={!target} className="btn-primary disabled:opacity-50"><Printer size={17} aria-hidden /> Drucken</button>
          <button type="button" onClick={copyLink} disabled={!target} className="btn-secondary disabled:opacity-50"><Link2 size={17} aria-hidden /> {copied ? "Link kopiert" : "Als Link schicken"}</button>
        </div>
        <p className="text-xs leading-relaxed text-cream-faint">Name und Text stehen nur im Link bzw. auf der gedruckten Karte – wir speichern nichts.</p>
      </form>

      <div id="gift-card" className="overflow-hidden rounded-3xl border border-cream/10 bg-white text-zinc-900 shadow-xl">
        {!target ? (
          <div className="grid min-h-[360px] place-items-center p-8 text-center text-zinc-500">Wähle links einen Ausflug – hier erscheint die Karte.</div>
        ) : (
          <div className="grid sm:grid-cols-[1fr_200px]">
            <div className="p-7 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-signal-600">Gutschein · urban-trails.ch</p>
              <p className="mt-4 font-display text-4xl font-extrabold leading-none tracking-tight">{fuer ? `Für ${fuer}` : "Für dich"}</p>
              {mystery ? (
                <>
                  <p className="mt-5 font-display text-2xl font-extrabold tracking-tight">Ein Ausflug ins Blaue</p>
                  <p className="mt-1 text-zinc-700"><span className="capitalize">{fmtDate(mystery.d)}</span> · Treffpunkt {mystery.t} Uhr, {mystery.s}{mystery.g ? `, Gleis ${mystery.g}` : ""}</p>
                  <p className="mt-3 text-sm text-zinc-600">Einpacken: {mystery.p.map((k) => PACK[k]).filter(Boolean).slice(0, 3).join(" · ")}</p>
                  <p className="mt-3 text-sm font-semibold text-zinc-800">Wohin? Verrät der Code – oder die Anzeigetafel am Bahnhof.</p>
                </>
              ) : trip ? (
                <>
                  <p className="mt-5 font-display text-2xl font-extrabold tracking-tight">{trip.title}</p>
                  <p className="mt-1 text-zinc-700">{trip.regionName} · {daysLabel(trip.days)}{datum ? ` · ${fmtDate(datum)}` : ""}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">{trip.teaser}</p>
                </>
              ) : null}
              {text && <p className="mt-6 whitespace-pre-line border-l-4 border-signal-500 pl-4 text-lg leading-relaxed text-zinc-800">{text}</p>}
              {von && <p className="mt-4 font-semibold text-zinc-800">– {von}</p>}
            </div>
            <div className="flex flex-col items-center justify-center gap-2 border-t border-dashed border-zinc-300 bg-zinc-50 p-6 sm:border-l sm:border-t-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/qr?p=${encodeURIComponent(target)}`} alt="QR-Code zum Programm" width={150} height={150} className="h-[150px] w-[150px]" />
              <p className="text-center text-xs text-zinc-500">Scannen: Programm, Zug und Wetter am Tag</p>
            </div>
          </div>
        )}
        {trip?.img && !mystery && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={trip.img} alt="" width={480} height={200} className="h-40 w-full object-cover" />
        )}
      </div>
    </div>
  );
}
