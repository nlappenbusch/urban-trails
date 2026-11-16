"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Accessibility, BadgeCheck, ExternalLink, MapPin, Search } from "lucide-react";
import PointsMap from "@/components/PointsMap";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { crowKm } from "@/lib/ski-core";
import { hoursText, kantonByAk, subLabel, type RubrikItem } from "@/lib/rubriken-core";

type Sort = "naehe" | "bekannt" | "name";
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const chip = (on: boolean) =>
  `min-h-[38px] rounded-full border px-3.5 py-1 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

/** Verzeichnis einer Rubrik: suchen, nach Nähe zur eigenen Haltestelle sortieren, filtern. */
export default function RubrikFinder({ items, one, showCanton, color }: { items: RubrikItem[]; one: string; showCanton?: boolean; color?: string }) {
  const [focus, setFocus] = useState<string | null>(null);
  const points = useMemo(() => items.map((i) => ({ id: i.id, name: i.name, lat: i.lat, lng: i.lng, sub: i.ort ?? kantonByAk(i.kt)?.name })), [items]);
  const [q, setQ] = useState("");
  const [start, setStart] = useState<StartStation | null>(null);
  const [sort, setSort] = useState<Sort>("bekannt");
  const [free, setFree] = useState(false);
  const [wheel, setWheel] = useState(false);
  const [kt, setKt] = useState("");
  const [n, setN] = useState(24);

  useEffect(() => {
    const s = loadStart();
    setStart(s);
    if (s?.lat) setSort("naehe");
  }, []);

  const cantons = useMemo(() => [...new Set(items.map((i) => i.kt))].map((ak) => kantonByAk(ak)!).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name, "de")), [items]);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    const from = start?.lat && start.lng ? { lat: start.lat, lng: start.lng } : undefined;
    return items
      .filter((i) => (!free || i.fee === false) && (!wheel || i.wheel) && (!kt || i.kt === kt) && (!nq || norm(`${i.name} ${i.ort ?? ""} ${kantonByAk(i.kt)?.name ?? ""}`).includes(nq)))
      .map((i) => ({ i, d: from ? crowKm(from, i) : undefined }))
      .sort((a, b) => (a.i.id === focus ? -1 : b.i.id === focus ? 1 : 0) || (sort === "naehe" && a.d !== undefined ? a.d - b.d! : sort === "name" ? a.i.name.localeCompare(b.i.name, "de") : b.i.q - a.i.q || a.i.name.localeCompare(b.i.name, "de")));
  }, [items, q, start, sort, free, wheel, kt]);

  useEffect(() => setN(24), [q, sort, start, free, wheel, kt]);
  const onPick = (id: string) => {
    setFocus(id);
    setQ("");
    setKt("");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };
  // Link von anderen Seiten mit #id: Eintrag nach oben holen
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (h && items.some((i) => i.id === h)) onPick(h);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const hasFree = items.some((i) => i.fee === false);
  const hasWheel = items.some((i) => i.wheel);

  return (
    <div>
      <PointsMap points={points} color={color} onPick={onPick} />
      <p className="mt-2 text-xs text-cream-faint">Punkt antippen: der Eintrag rückt in der Liste nach oben.</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <label className="relative block">
            <span className="sr-only">Name oder Ort suchen</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-faint" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name oder Ort suchen" className="min-h-[48px] w-full rounded-xl border border-cream/20 bg-ink-900 pl-10 pr-3 text-base text-cream placeholder:text-cream-faint focus:border-signal-500 focus:outline-none" />
          </label>
          <div className="flex flex-wrap gap-2">
            {hasFree && <button type="button" aria-pressed={free} onClick={() => setFree(!free)} className={chip(free)}>gratis</button>}
            {hasWheel && <button type="button" aria-pressed={wheel} onClick={() => setWheel(!wheel)} className={chip(wheel)}>rollstuhlgängig</button>}
            {showCanton && cantons.length > 1 && (
              <select value={kt} onChange={(e) => setKt(e.target.value)} aria-label="Kanton" className="min-h-[38px] rounded-full border border-cream/20 bg-ink-900 px-3 text-sm font-semibold text-cream">
                <option value="">alle Kantone</option>
                {cantons.map((c) => <option key={c.ak} value={c.ak}>{c.name}</option>)}
              </select>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <StationPicker value={start} onChange={(s) => (setStart(s), setSort("naehe"))} label="In der Nähe von" />
          <label className="flex items-center gap-2 text-sm text-cream-dim">
            Sortieren
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[38px] rounded-xl border border-cream/20 bg-ink-900 px-2 text-sm font-semibold text-cream">
              {start?.lat && <option value="naehe">am nächsten</option>}
              <option value="bekannt">bekannteste zuerst</option>
              <option value="name">A–Z</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-5 text-sm text-cream-dim"><strong className="text-cream">{list.length}</strong> Einträge{q ? ` für «${q}»` : ""}</p>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, n).map(({ i, d }) => {
          const sub = subLabel(i.sub);
          const text = i.text ?? (i.desc ? i.desc.charAt(0).toUpperCase() + i.desc.slice(1) + "." : undefined);
          return (
            <li key={i.id} id={i.id} className={`card flex scroll-mt-24 flex-col overflow-hidden ${i.id === focus ? "ring-2 ring-signal-500" : ""}`}>
              {i.img && (
                <figure className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={i.img.src} alt={i.name} width={i.img.w} height={i.img.h} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
                  <figcaption className="absolute bottom-0 right-0 max-w-full truncate bg-black/55 px-2 py-0.5 text-[10px] text-white/85">
                    <a href={i.img.page} target="_blank" rel="noopener" className="hover:underline">Foto: {i.img.by ?? "Wikimedia Commons"}{i.img.lic ? `, ${i.img.lic}` : ""}</a>
                  </figcaption>
                </figure>
              )}
              <div className="flex flex-1 flex-col p-4">
                <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-cream-faint">
                  <span>{i.ort ?? kantonByAk(i.kt)?.name}{i.ort && ` (${i.kt})`}</span>
                  {d !== undefined && <span>· {d < 10 ? d.toFixed(1).replace(".", ",") : Math.round(d)} km</span>}
                  {sub && <span>· {sub}</span>}
                  {i.height && <span>· {Math.round(i.height)} m hoch</span>}
                </p>
                <h3 className="mt-0.5 font-display text-lg font-extrabold leading-tight tracking-tight text-cream">{i.ours ? <Link href={i.ours} className="hover:underline">{i.name}</Link> : i.name}</h3>
                {i.ours && <Link href={i.ours} className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-signal-600 hover:text-signal-500"><BadgeCheck size={13} aria-hidden /> von uns geprüft: Preis, Zeiten, Tipp</Link>}
                {text && <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-cream-dim">{text}</p>}
                {i.hours && <p className="mt-2 line-clamp-2 text-xs text-cream-faint" title={i.hours}>Offen: {hoursText(i.hours)}</p>}
                <p className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-sm font-semibold">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${i.lat},${i.lng}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><MapPin size={14} aria-hidden /> Karte</a>
                  {i.web && <a href={i.web} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Website</a>}
                  {i.wiki && <a href={i.wiki} target="_blank" rel="noopener" className="text-cream-faint hover:text-cream">Wikipedia</a>}
                  {i.fee === false && <span className="text-emerald-700">gratis</span>}
                  {i.wheel && <Accessibility size={15} className="text-cream-faint" aria-label="rollstuhlgängig" />}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {list.length > n && (
        <button type="button" onClick={() => setN(n + 36)} className="btn-secondary mt-5 min-h-[44px]">Weitere {Math.min(36, list.length - n)} zeigen</button>
      )}
      {!list.length && <p className="mt-4 text-cream-dim">Kein {one} gefunden – Suche oder Filter lockern.</p>}
    </div>
  );
}
