"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LocateFixed } from "lucide-react";

export interface StartStation {
  name: string;
  lat?: number;
  lng?: number;
}

const KEY = "ut-start";

export function loadStart(): StartStation | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return v && typeof v.name === "string" ? v : null;
  } catch {
    return null;
  }
}

function saveStart(s: StartStation) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* privates Fenster – egal */
  }
}

/** Haltestelle wählen: Tippen mit Vorschlägen oder «Mein Standort» (nächste Haltestelle). */
export default function StationPicker({ value, onChange, label = "Ab wo fährst du?" }: { value: StartStation | null; onChange: (s: StartStation) => void; label?: string }) {
  const id = useId();
  const [text, setText] = useState(value?.name ?? "");
  const [list, setList] = useState<StartStation[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setText(value?.name ?? ""), [value?.name]);

  function type(v: string) {
    setText(v);
    clearTimeout(timer.current);
    if (v.trim().length < 2) return setList([]);
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/oev?q=${encodeURIComponent(v.trim())}`).then((x) => x.json());
        setList(r.stations ?? []);
      } catch {
        setList([]);
      }
    }, 250);
  }

  function choose(s: StartStation) {
    setText(s.name);
    setList([]);
    saveStart(s);
    onChange(s);
  }

  function locate() {
    if (!navigator.geolocation) return setMsg("Dein Browser kennt keinen Standort.");
    setBusy(true);
    setMsg("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(`/api/oev?lat=${pos.coords.latitude.toFixed(4)}&lng=${pos.coords.longitude.toFixed(4)}`).then((x) => x.json());
          if (r.station) choose(r.station);
          else setMsg("Keine Haltestelle in der Nähe gefunden – tipp den Ort ein.");
        } catch {
          setMsg("Fahrplan gerade nicht erreichbar.");
        } finally {
          setBusy(false);
        }
      },
      () => {
        setBusy(false);
        setMsg("Standort nicht freigegeben – tipp den Ort ein.");
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="text-sm font-bold text-cream">{label}</label>
      <div className="mt-1.5 flex gap-2">
        <input
          id={id}
          value={text}
          onChange={(e) => type(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && list[0]) {
              e.preventDefault();
              choose(list[0]);
            }
          }}
          placeholder="z. B. Winterthur"
          autoComplete="off"
          role="combobox"
          aria-expanded={list.length > 0}
          aria-controls={`${id}-list`}
          className="min-h-[44px] w-full min-w-0 rounded-full border border-cream/20 bg-ink-900 px-4 text-sm text-cream outline-none focus:border-signal-500"
        />
        <button type="button" onClick={locate} disabled={busy} className="btn-secondary min-h-[44px] shrink-0 px-3 py-2 text-sm" title="Nächste Haltestelle zu meinem Standort">
          <LocateFixed size={16} aria-hidden /> <span className="sr-only sm:not-sr-only">{busy ? "Suche …" : "Standort"}</span>
        </button>
      </div>
      {list.length > 0 && (
        <ul id={`${id}-list`} role="listbox" className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-cream/15 bg-ink-900 shadow-lg">
          {list.map((s) => (
            <li key={s.name} role="option" aria-selected={false}>
              <button type="button" onClick={() => choose(s)} className="block w-full px-4 py-2.5 text-left text-sm text-cream hover:bg-ink-800">{s.name}</button>
            </li>
          ))}
        </ul>
      )}
      {msg && <p className="mt-1 text-xs text-cream-faint">{msg}</p>}
    </div>
  );
}
