"use client";

import { useState } from "react";
import Link from "next/link";
import type { Mood, Tour } from "@/lib/types";
import { moodLabels, recommendTour, formatDuration } from "@/lib/tours";

const timeOptions = [
  { label: "60 Min.", minutes: 60 },
  { label: "90 Min.", minutes: 90 },
  { label: "2 Std.", minutes: 120 },
  { label: "3 Std.", minutes: 180 },
  { label: "Halber Tag", minutes: 300 },
];

const allMoods = Object.keys(moodLabels) as Mood[];

export default function SurpriseMe() {
  const [minutes, setMinutes] = useState<number | null>(null);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [result, setResult] = useState<{ tour: Tour; note: string } | null>(
    null
  );

  function toggleMood(m: Mood) {
    setMoods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  function generate() {
    if (!minutes) return;
    setResult(recommendTour(minutes, moods));
  }

  return (
    <div className="card mx-auto max-w-2xl p-6 sm:p-10">
      <h2 className="text-xl font-bold text-cream">Wie viel Zeit hast du?</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {timeOptions.map((t) => (
          <button
            key={t.minutes}
            onClick={() => setMinutes(t.minutes)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              minutes === t.minutes
                ? "bg-signal-500 text-white"
                : "border border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-bold text-cream">
        Wonach ist dir heute?
      </h2>
      <p className="mt-1 text-sm text-cream-dim">
        Wähl so viele aus, wie du willst.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {allMoods.map((m) => (
          <button
            key={m}
            onClick={() => toggleMood(m)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              moods.includes(m)
                ? "bg-signal-500 text-white"
                : "border border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"
            }`}
          >
            {moodLabels[m]}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={!minutes}
        className="btn-primary mt-8 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
      >
        ✨ Tour für mich finden
      </button>

      {result && (
        <div className="mt-8 animate-fade-up rounded-3xl border border-signal-500/40 bg-glacier-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal-600">
            Deine Tour für heute
          </p>
          <h3 className="mt-2 text-2xl font-bold text-cream">
            {result.tour.name}
          </h3>
          <p className="mt-1 text-sm italic text-cream-dim">
            «{result.tour.claim}»
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream-dim">
            {result.tour.teaser}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-dim">
            <span>⏱ {formatDuration(result.tour.durationMinutes)}</span>
            <span>📍 {result.tour.stops.length} Stops</span>
            <span>👣 {result.tour.distanceKm} km</span>
          </div>
          <p className="mt-3 text-sm text-signal-600">{result.note}</p>
          <Link
            href={`/${result.tour.citySlug}/${result.tour.slug}`}
            className="btn-primary mt-5"
          >
            Tour starten →
          </Link>
        </div>
      )}
    </div>
  );
}
