"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, List, Map as MapIcon, MapPin, Search, X } from "lucide-react";
import PointsMap from "@/components/PointsMap";
import { MerkLink } from "@/components/MerkButton";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import ZielRow from "@/components/ZielRow";
import { crowKm } from "@/lib/ski-core";
import { kantonByAk, type RubrikItem } from "@/lib/rubriken-core";
import { toHit } from "@/lib/hit";

type Sort = "naehe" | "bekannt" | "name";
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Bildschirm breit genug für Liste und Karte nebeneinander? */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

/** Verzeichnis einer Rubrik: Liste zuerst, Karte umschaltbar (Desktop daneben), nach Nähe zur eigenen Haltestelle. */
export default function RubrikFinder({ items, one, showCanton, color }: { items: RubrikItem[]; one: string; showCanton?: boolean; color?: string }) {
  const wide = useWide();
  const [view, setView] = useState<"liste" | "karte">("liste");
  const [focus, setFocus] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [start, setStart] = useState<StartStation | null>(null);
  const [pick, setPick] = useState(false);
  const [sort, setSort] = useState<Sort>("bekannt");
  const [free, setFree] = useState(false);
  const [wheel, setWheel] = useState(false);
  const [kt, setKt] = useState("");
  const [n, setN] = useState(24);
  const [mapH, setMapH] = useState(520);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = loadStart();
    setStart(s);
    if (s?.lat) setSort("naehe");
    setMapH(Math.max(360, window.innerHeight - (window.innerWidth >= 1024 ? 225 : 300)));
  }, []);

  const cantons = useMemo(() => [...new Set(items.map((i) => i.kt))].map((ak) => kantonByAk(ak)!).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name, "de")), [items]);

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    return items.filter((i) => (!free || i.fee === false) && (!wheel || i.wheel) && (!kt || i.kt === kt) && (!nq || norm(`${i.name} ${i.ort ?? ""} ${kantonByAk(i.kt)?.name ?? ""}`).includes(nq)));
  }, [items, q, free, wheel, kt]);

  const list = useMemo(() => {
    const from = start?.lat && start.lng ? { lat: start.lat, lng: start.lng } : undefined;
    return filtered
      .map((i) => ({ i, d: from ? crowKm(from, i) : undefined }))
      .sort((a, b) => (a.i.id === focus ? -1 : b.i.id === focus ? 1 : 0) || (sort === "naehe" && a.d !== undefined ? a.d - b.d! : sort === "name" ? a.i.name.localeCompare(b.i.name, "de") : b.i.q - a.i.q || a.i.name.localeCompare(b.i.name, "de")));
  }, [filtered, start, sort, focus]);

  const points = useMemo(() => filtered.map((i) => ({ id: i.id, name: i.name, lat: i.lat, lng: i.lng, sub: i.ort ?? kantonByAk(i.kt)?.name })), [filtered]);

  useEffect(() => setN(24), [q, sort, start, free, wheel, kt]);
  const onPick = (id: string) => {
    setFocus(id);
    setQ("");
    setKt("");
    setView("liste");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };
  // Link von anderen Seiten mit #id: Eintrag nach oben holen
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (h && items.some((i) => i.id === h)) onPick(h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const hasFree = items.some((i) => i.fee === false);
  const hasWheel = items.some((i) => i.wheel);
  const showMap = wide || view === "karte";

  return (
    <div ref={top} className="scroll-mt-16">
      <div className="sticky top-16 z-30 -mx-5 bg-ink-950/90 px-5 pb-3 pt-2 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex gap-2">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">Name oder Ort suchen</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-faint" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name oder Ort" className="min-h-[46px] w-full rounded-full bg-ink-900 pl-11 pr-4 text-base text-cream shadow-soft ring-1 ring-cream/10 placeholder:text-cream-faint focus:outline-none focus:ring-2 focus:ring-signal-500" />
          </label>
          <div role="radiogroup" aria-label="Ansicht" className="flex shrink-0 gap-1 rounded-full bg-ink-800 p-1 lg:hidden">
            {(["liste", "karte"] as const).map((v) => (
              <button key={v} type="button" role="radio" aria-checked={view === v} onClick={() => (setView(v), !wide && top.current && (v === "karte" || top.current.getBoundingClientRect().top < 0) ? top.current.scrollIntoView({ block: "start" }) : null)} className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3 text-sm font-bold transition duration-200 ease-out ${view === v ? "bg-ink-900 text-cream shadow-soft" : "text-cream-dim"}`}>
                {v === "liste" ? <List size={16} aria-hidden /> : <MapIcon size={16} aria-hidden />}
                {v === "liste" ? "Liste" : "Karte"}
              </button>
            ))}
          </div>
        </div>
        <div className="-mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <button type="button" aria-expanded={pick} onClick={() => setPick(!pick)} className="chip" aria-pressed={Boolean(start?.lat)}>
            <MapPin size={16} aria-hidden /> {start?.name ? `Ab ${start.name}` : "Haltestelle wählen"} <ChevronDown size={14} aria-hidden />
          </button>
          {hasFree && <button type="button" aria-pressed={free} onClick={() => setFree(!free)} className="chip">gratis</button>}
          {hasWheel && <button type="button" aria-pressed={wheel} onClick={() => setWheel(!wheel)} className="chip">rollstuhlgängig</button>}
          {showCanton && cantons.length > 1 && (
            <span className={`relative inline-flex shrink-0 ${kt ? "text-white" : "text-cream-dim"}`}>
              <select value={kt} onChange={(e) => setKt(e.target.value)} aria-label="Kanton" className={`chip w-auto appearance-none pr-8 ${kt ? "!bg-signal-500 !text-white !ring-signal-500" : ""}`}>
                <option value="">alle Kantone</option>
                {cantons.map((c) => <option key={c.ak} value={c.ak}>{c.name}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden />
            </span>
          )}
          <span className="relative inline-flex shrink-0 text-cream-dim">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sortieren" className="chip w-auto appearance-none pr-8">
              {start?.lat && <option value="naehe">am nächsten</option>}
              <option value="bekannt">bekannteste zuerst</option>
              <option value="name">A–Z</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" aria-hidden />
          </span>
        </div>
        {pick && (
          <div className="mt-3 rounded-[22px] bg-ink-900 p-4 shadow-lift ring-1 ring-cream/[0.06]">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <StationPicker value={start} onChange={(s) => (setStart(s), setSort("naehe"), setPick(false))} label="In der Nähe von" />
              </div>
              <button type="button" onClick={() => setPick(false)} aria-label="Schliessen" className="-mr-1 -mt-1 grid h-10 w-10 place-items-center rounded-full text-cream-faint hover:text-cream">
                <X size={18} aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start">
        <div className={view === "karte" ? "hidden lg:block" : ""}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-cream-dim">
              <strong className="tabnums text-cream">{list.length.toLocaleString("de-CH")}</strong> {list.length === 1 ? "Eintrag" : "Einträge"}{q ? ` für «${q}»` : ""}
              {start?.lat && sort === "naehe" ? `, nächste zuerst ab ${start.name}` : ""}
            </p>
            <MerkLink />
          </div>
          <ul className="mt-3 grid gap-3">
            {list.slice(0, n).map(({ i, d }) => (
              <ZielRow key={i.id} h={toHit(i, d)} focus={i.id === focus} />
            ))}
          </ul>
          {list.length > n && (
            <button type="button" onClick={() => setN(n + 36)} className="btn-secondary mt-5 min-h-[48px]">Weitere {Math.min(36, list.length - n)} zeigen</button>
          )}
          {!list.length && (
            <div className="mt-3 rounded-[22px] bg-ink-900 p-6 shadow-soft">
              <p className="font-bold text-cream">Kein {one} gefunden.</p>
              <p className="mt-1 text-sm text-cream-dim">Suche kürzen oder einen Filter wegnehmen.</p>
            </div>
          )}
        </div>
        {showMap && (
          <div className="overflow-hidden rounded-[22px] shadow-soft ring-1 ring-cream/[0.06] lg:sticky lg:top-44">
            <PointsMap points={points} color={color} height={mapH} onPick={onPick} />
            <p className="bg-ink-900 px-4 py-2.5 text-xs text-cream-faint">Punkt antippen: der Eintrag rückt in der Liste nach oben.</p>
          </div>
        )}
      </div>
    </div>
  );
}
