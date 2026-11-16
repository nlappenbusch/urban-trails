"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lightbulb, Search, TrainFront } from "lucide-react";
import PointsMap from "@/components/PointsMap";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { crowKm } from "@/lib/ski-core";
import { DIFF, kmText, type SledRun } from "@/lib/schlitteln-core";
import { kantonByAk } from "@/lib/rubriken-core";

type Sort = "naehe" | "lang" | "steil";
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const chip = (on: boolean) =>
  `min-h-[38px] rounded-full border px-3.5 py-1 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

export default function SledFinder({ runs }: { runs: Omit<SledRun, "lines">[]; }) {
  const [q, setQ] = useState("");
  const [min, setMin] = useState(0);
  const [ov, setOv] = useState(false);
  const [lit, setLit] = useState(false);
  const [kt, setKt] = useState("");
  const [start, setStart] = useState<StartStation | null>(null);
  const [sort, setSort] = useState<Sort>("lang");
  const [n, setN] = useState(30);

  useEffect(() => {
    const s = loadStart();
    setStart(s);
    if (s?.lat) setSort("naehe");
  }, []);

  const points = useMemo(() => runs.map((r) => ({ id: r.id, name: r.name, lat: r.top.lat, lng: r.top.lng, sub: `${kmText(r.km)} · ${r.drop} Hm`, href: `/schlitteln/${r.id}` })), [runs]);
  const cantons = useMemo(() => [...new Set(runs.map((r) => r.kt))].map((a) => kantonByAk(a)!).sort((a, b) => a.name.localeCompare(b.name, "de")), [runs]);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    const from = start?.lat && start.lng ? { lat: start.lat, lng: start.lng } : undefined;
    return runs
      .filter((r) => r.km >= min && (!ov || (r.top.st && r.bottom.st)) && (!lit || r.lit) && (!kt || r.kt === kt) && (!nq || norm(`${r.name} ${r.ort ?? ""} ${kantonByAk(r.kt)?.name}`).includes(nq)))
      .map((r) => ({ r, d: from ? crowKm(from, r.bottom) : undefined }))
      .sort((a, b) => (sort === "naehe" && a.d !== undefined ? a.d - b.d! : sort === "steil" ? b.r.drop / b.r.km - a.r.drop / a.r.km : b.r.km - a.r.km));
  }, [runs, q, min, ov, lit, kt, start, sort]);
  useEffect(() => setN(30), [q, min, ov, lit, kt, start, sort]);

  return (
    <div>
      <PointsMap points={points} color="#2563eb" />
      <p className="mt-2 text-xs text-cream-faint">Punkte = Start oben. Antippen öffnet den Schlittelweg.</p>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {[0, 3, 5].map((k) => <button key={k} type="button" aria-pressed={min === k} onClick={() => setMin(k)} className={chip(min === k)}>{k ? `ab ${k} km` : "alle Längen"}</button>)}
            <button type="button" aria-pressed={ov} onClick={() => setOv(!ov)} className={chip(ov)}>Bahn hoch, Haltestelle unten</button>
            <button type="button" aria-pressed={lit} onClick={() => setLit(!lit)} className={chip(lit)}>beleuchtet</button>
            <select value={kt} onChange={(e) => setKt(e.target.value)} aria-label="Kanton" className="min-h-[38px] rounded-full border border-cream/20 bg-ink-900 px-3 text-sm font-semibold text-cream">
              <option value="">alle Kantone</option>
              {cantons.map((c) => <option key={c.ak} value={c.ak}>{c.name}</option>)}
            </select>
          </div>
          <label className="relative block">
            <span className="sr-only">Ort suchen</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-faint" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ort oder Name – z. B. «Grindelwald», «Rigi»" className="min-h-[48px] w-full rounded-xl border border-cream/20 bg-ink-900 pl-10 pr-3 text-base text-cream placeholder:text-cream-faint focus:border-signal-500 focus:outline-none" />
          </label>
        </div>
        <div className="space-y-3">
          <StationPicker value={start} onChange={(s) => (setStart(s), setSort("naehe"))} label="In der Nähe von" />
          <label className="flex items-center gap-2 text-sm text-cream-dim">
            Sortieren
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[38px] rounded-xl border border-cream/20 bg-ink-900 px-2 text-sm font-semibold text-cream">
              {start?.lat && <option value="naehe">am nächsten</option>}
              <option value="lang">längste zuerst</option>
              <option value="steil">steilste zuerst</option>
            </select>
          </label>
        </div>
      </div>
      <p className="mt-5 text-sm text-cream-dim"><strong className="text-cream">{list.length}</strong> Schlittelwege</p>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, n).map(({ r, d }) => (
          <li key={r.id} className="card flex flex-col p-4">
            <p className="flex flex-wrap gap-x-2 text-xs font-semibold text-cream-faint">
              <span>{r.ort ?? kantonByAk(r.kt)?.name} ({r.kt})</span>
              {d !== undefined && <span>· {d < 10 ? d.toFixed(1).replace(".", ",") : Math.round(d)} km</span>}
              {r.diff && DIFF[r.diff] && <span>· {DIFF[r.diff]}</span>}
            </p>
            <h3 className="mt-0.5 font-display text-lg font-extrabold leading-tight tracking-tight text-cream"><Link href={`/schlitteln/${r.id}`} className="hover:underline">{r.name}</Link></h3>
            <p className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl font-extrabold tabular-nums text-cream">{kmText(r.km)}</span>
              <span className="text-sm text-cream-dim">{r.drop} Hm · {r.top.ele} → {r.bottom.ele} m</span>
            </p>
            <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3 text-xs text-cream-faint">
              {r.top.st && <span className="inline-flex items-center gap-1"><TrainFront size={13} aria-hidden /> oben: {r.top.st}</span>}
              {r.lit && <span className="inline-flex items-center gap-1 text-signal-600"><Lightbulb size={13} aria-hidden /> beleuchtet</span>}
            </p>
          </li>
        ))}
      </ul>
      {list.length > n && <button type="button" onClick={() => setN(n + 30)} className="btn-secondary mt-5 min-h-[44px]">Weitere {Math.min(30, list.length - n)} zeigen</button>}
    </div>
  );
}
