"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bed, CalendarPlus, CloudRain, Coffee, ExternalLink, Footprints, Headphones, Landmark, MapPin, Mountain, Sparkles, Sun, UtensilsCrossed, Waves, Wine,
} from "lucide-react";
import { effectiveSlot, KIND_LABEL, priceLabel, priceText, type Place, type PlaceKind, type TripDay } from "@/lib/ausfluege-core";
import { imgAttrs } from "@/lib/img";

export interface TimelineTour { name: string; citySlug: string }

const KIND_ICON: Record<PlaceKind, typeof MapPin> = {
  hotel: Bed,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  bar: Wine,
  aktivitaet: Sparkles,
  sehenswuerdigkeit: Landmark,
  aussicht: Mountain,
  bad: Waves,
};

const mapsLink = (p: Place) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([p.name, p.address ?? p.town].join(", "))}`;

/** Programm Tag für Tag, mit Regen-Schalter und Kalender-Export (.ics). */
export default function TripTimeline({
  title,
  days,
  places,
  tours,
  hotel,
  allowRainToggle = true,
  initialRain = false,
}: {
  title: string;
  days: TripDay[];
  places: Record<string, Place>;
  tours: Record<string, TimelineTour>;
  hotel?: Place;
  allowRainToggle?: boolean;
  initialRain?: boolean;
}) {
  const [rain, setRain] = useState(initialRain);
  const hasRain = useMemo(() => days.some((d) => d.slots.some((s) => s.rain)), [days]);
  const [start, setStart] = useState("");
  const today = useMemo(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10), []);

  function exportIcs() {
    if (!start) return;
    const pad = (n: number) => String(n).padStart(2, "0");
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Urban Trails//Ausflug//DE", "CALSCALE:GREGORIAN"];
    days.forEach((day, di) => {
      const date = new Date(`${start}T12:00:00`);
      date.setDate(date.getDate() + di);
      const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
      day.slots.forEach((raw, si) => {
        const s = effectiveSlot(raw, rain);
        const p = places[s.placeId ?? ""];
        const [h, m] = s.time.split(":").map(Number);
        const next = day.slots[si + 1]?.time.split(":").map(Number);
        const endMin = next ? next[0] * 60 + next[1] : h * 60 + m + 90;
        const dur = Math.max(30, Math.min(endMin - (h * 60 + m), 300));
        const end = h * 60 + m + dur;
        const desc = [s.text, p?.url, s.tourSlug ? `${location.origin}/${tours[s.tourSlug]?.citySlug}/${s.tourSlug}` : ""].filter(Boolean).join("\n");
        lines.push(
          "BEGIN:VEVENT",
          `UID:${ymd}-${di}-${si}-${Math.random().toString(36).slice(2)}@urban-trails.ch`,
          `DTSTAMP:${stamp}`,
          `DTSTART;TZID=Europe/Zurich:${ymd}T${pad(h)}${pad(m)}00`,
          `DTEND;TZID=Europe/Zurich:${ymd}T${pad(Math.floor(end / 60) % 24)}${pad(end % 60)}00`,
          `SUMMARY:${esc(s.title)}`,
          `DESCRIPTION:${esc(desc)}`,
          ...(p?.address ? [`LOCATION:${esc(`${p.name}, ${p.address}`)}`] : []),
          "END:VEVENT",
        );
      });
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase()}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {allowRainToggle && hasRain && (
          <div role="group" aria-label="Wetter" className="inline-flex rounded-full border border-cream/15 bg-ink-900 p-1">
            <button type="button" aria-pressed={!rain} onClick={() => setRain(false)} className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition ${!rain ? "bg-signal-500 text-white" : "text-cream-dim hover:text-cream"}`}>
              <Sun size={16} aria-hidden /> Schönwetter
            </button>
            <button type="button" aria-pressed={rain} onClick={() => setRain(true)} className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition ${rain ? "bg-signal-500 text-white" : "text-cream-dim hover:text-cream"}`}>
              <CloudRain size={16} aria-hidden /> Regen
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="ics-start" className="sr-only">Startdatum</label>
          <input id="ics-start" type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} className="min-h-[44px] rounded-full border border-cream/20 bg-ink-900 px-4 text-sm text-cream outline-none focus:border-signal-500" />
          <button type="button" onClick={exportIcs} disabled={!start} className="btn-secondary min-h-[44px] py-2 text-sm disabled:opacity-50" title={start ? "" : "Erst ein Startdatum wählen"}>
            <CalendarPlus size={16} aria-hidden /> In den Kalender
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-12">
        {days.map((day) => (
          <section key={day.title}>
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-cream">{day.title}</h3>
            <ol className="mt-5 space-y-0">
              {day.slots.map((raw, i) => {
                const s = effectiveSlot(raw, rain);
                const p = s.placeId ? places[s.placeId] : undefined;
                const tour = s.tourSlug ? tours[s.tourSlug] : undefined;
                const Icon = tour ? Headphones : p ? KIND_ICON[p.kind] : Footprints;
                return (
                  <li key={i} className="relative grid grid-cols-[3.25rem_1fr] gap-3 pb-7 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-5">
                    {i < day.slots.length - 1 && <span aria-hidden className="absolute bottom-0 left-[1.6rem] top-10 w-px bg-cream/15 sm:left-[2rem]" />}
                    <div className="flex flex-col items-center">
                      <span className="font-display text-sm font-extrabold tabular-nums text-cream">{s.time}</span>
                      <span className={`mt-1.5 grid h-9 w-9 place-items-center rounded-full ${s.swapped ? "bg-cream text-ink-900" : "bg-ink-800 text-signal-600"}`}>
                        <Icon size={17} aria-hidden />
                      </span>
                    </div>
                    <div className="flex min-w-0 gap-3 pt-0.5 sm:gap-5">
                      <div className="min-w-0 flex-1">
                        {raw.travel && <p className="mb-1 text-xs text-cream-faint">{raw.travel}</p>}
                        <p className="font-bold leading-snug text-cream">
                          {s.title}
                          {s.swapped && <span className="ml-2 align-middle text-xs font-bold uppercase tracking-wide text-cream-faint">Regenvariante</span>}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-cream-dim">{s.text}</p>
                        {tour && (
                          <Link href={`/${tour.citySlug}/${s.tourSlug}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-signal-600 hover:text-signal-500">
                            Tour öffnen: {tour.name}
                          </Link>
                        )}
                        {p && <PlaceLine p={p} />}
                      </div>
                      {p?.img && <Thumb p={p} />}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      {hotel && (
        <section className="mt-12">
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-cream">Übernachten</h3>
          <div className="card mt-4 flex gap-4 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-800 text-signal-600"><Bed size={18} aria-hidden /></span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-cream">{hotel.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-cream-dim">{hotel.text}</p>
              {hotel.tip && <p className="mt-1 text-sm text-cream-dim"><strong className="text-cream">Tipp:</strong> {hotel.tip}</p>}
              <PlaceLine p={hotel} />
            </div>
            {hotel.img && <Thumb p={hotel} />}
          </div>
        </section>
      )}
    </div>
  );
}

/** Foto des Orts; Klick führt zur Commons-Seite mit Urheber und Lizenz. */
function Thumb({ p }: { p: Place }) {
  const img = p.img!;
  return (
    <a href={img.credit} target="_blank" rel="noopener noreferrer" title="Foto: Wikimedia Commons – Urheber & Lizenz" className="shrink-0 self-start">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.small} {...imgAttrs(img, "128px")} loading="lazy" decoding="async" className="h-16 w-16 rounded-lg object-cover sm:h-24 sm:w-32" />
    </a>
  );
}

function PlaceLine({ p }: { p: Place }) {
  const price = priceText(p.priceInfo);
  const facts = [KIND_LABEL[p.kind], p.priceInfo ? "" : priceLabel(p.price), p.season && p.season !== "ganzjährig" ? p.season : "", p.hours].filter(Boolean);
  return (
    <div className="mt-2 text-xs leading-relaxed text-cream-faint">
      {price && (
        <p className="mb-1 text-sm font-semibold text-cream">
          {price}
          {p.priceInfo?.note && <span className="font-normal text-cream-faint"> – {p.priceInfo.note}</span>}
        </p>
      )}
      <p>{facts.join(" · ")}</p>
      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        <a href={mapsLink(p)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-cream-dim hover:text-cream">
          <MapPin size={13} aria-hidden /> {p.address ?? p.town}
        </a>
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold text-cream-dim hover:text-cream">
            <ExternalLink size={13} aria-hidden /> Website
          </a>
        )}
      </p>
    </div>
  );
}
