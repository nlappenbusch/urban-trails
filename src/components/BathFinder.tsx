"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ExternalLink, MapPin, Search } from "lucide-react";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { waterFeel, type BathSpot } from "@/lib/wasser-core";
import { crowKm } from "@/lib/ski-core";

const KINDS: [BathSpot["kind"] | "", string][] = [["", "Alle"], ["offen", "See & Fluss"], ["freibad", "Freibad"], ["hallenbad", "Hallenbad"], ["therme", "Therme"]];
const KIND_WORD: Record<BathSpot["kind"], string> = { offen: "See / Fluss", freibad: "Freibad", hallenbad: "Hallenbad", therme: "Therme" };
type Sort = "naehe" | "warm" | "name";
const fmt = (t: number) => t.toLocaleString("de-CH", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const chip = (on: boolean) =>
  `min-h-[38px] rounded-full border px-3.5 py-1 text-sm font-semibold transition ${on ? "border-signal-500 bg-signal-500 text-white" : "border-cream/20 bg-ink-900 text-cream-dim hover:border-cream/40"}`;

/** Alle Badestellen der Schweiz – durchsuchbar, nach Nähe oder Wassertemperatur sortiert. */
export default function BathFinder({ spots }: { spots: BathSpot[] }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<BathSpot["kind"] | "">("");
  const [start, setStart] = useState<StartStation | null>(null);
  const [sort, setSort] = useState<Sort>("warm");
  const [n, setN] = useState(36);

  useEffect(() => {
    const s = loadStart();
    setStart(s);
    if (s?.lat) setSort("naehe");
  }, []);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    const from = start?.lat && start.lng ? { lat: start.lat, lng: start.lng } : undefined;
    return spots
      .filter((s) => (!kind || s.kind === kind) && (!nq || norm(`${s.name} ${s.town ?? ""} ${s.water?.label ?? ""}`).includes(nq)))
      .map((s) => ({ s, d: from ? crowKm(from, s) : undefined }))
      .sort((a, b) =>
        sort === "naehe" && a.d !== undefined ? a.d - b.d! : sort === "warm" ? (b.s.water?.temp ?? -99) - (a.s.water?.temp ?? -99) || a.s.name.localeCompare(b.s.name, "de") : a.s.name.localeCompare(b.s.name, "de"),
      );
  }, [spots, q, kind, start, sort]);

  useEffect(() => setN(36), [q, kind, sort, start]);

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          <label className="relative block">
            <span className="sr-only">Badestelle, Ort oder Gewässer suchen</span>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-faint" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Badi, Ort, See oder Fluss – z. B. «Aare», «Zug», «Strandbad»" className="min-h-[48px] w-full rounded-xl border border-cream/20 bg-ink-900 pl-10 pr-3 text-base text-cream placeholder:text-cream-faint focus:border-signal-500 focus:outline-none" />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Art">
            {KINDS.map(([k, l]) => (
              <button key={l} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>
                {l} <span className={kind === k ? "text-white/80" : "text-cream-faint"}>{k ? spots.filter((s) => s.kind === k).length : spots.length}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <StationPicker value={start} onChange={(s) => (setStart(s), setSort("naehe"))} label="In der Nähe von" />
          <label className="flex items-center gap-2 text-sm text-cream-dim">
            Sortieren
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[38px] rounded-xl border border-cream/20 bg-ink-900 px-2 text-sm font-semibold text-cream">
              {start?.lat && <option value="naehe">am nächsten</option>}
              <option value="warm">wärmstes Wasser</option>
              <option value="name">A–Z</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-5 text-sm text-cream-dim"><strong className="text-cream">{list.length}</strong> Badestellen{q ? ` für «${q}»` : ""}</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, n).map(({ s, d }) => (
          <li key={s.id} className="card flex flex-col p-4">
            <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-cream-faint">
              <span>{KIND_WORD[s.kind]}</span>
              {s.town && <span>· {s.town}</span>}
              {d !== undefined && <span>· {d < 10 ? d.toFixed(1).replace(".", ",") : Math.round(d)} km</span>}
              {s.ours && <span className="inline-flex items-center gap-0.5 text-signal-600"><BadgeCheck size={13} aria-hidden /> geprüft</span>}
            </p>
            <h3 className="mt-0.5 font-display text-lg font-extrabold leading-tight tracking-tight text-cream">
              {s.ours ? <Link href={s.ours} className="hover:underline">{s.name}</Link> : s.name}
            </h3>
            {s.water ? (
              <p className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold tabular-nums text-cream">{fmt(s.water.temp)}°</span>
                <span className="text-sm text-cream-dim">
                  {waterFeel(s.water.temp)} ·{" "}
                  {s.water.slug ? <Link href={`/wassertemperaturen/${s.water.slug}`} className="underline decoration-cream/30 underline-offset-2 hover:text-cream">{s.water.label}</Link> : s.water.label}
                </span>
              </p>
            ) : (
              s.kind === "offen" && <p className="mt-2 text-sm text-cream-faint">Keine Messung in der Nähe</p>
            )}
            {s.hours && <p className="mt-2 line-clamp-2 text-xs text-cream-faint" title={s.hours}>Öffnungszeiten: {s.hours}</p>}
            <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-3 text-sm font-semibold">
              <a href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-signal-600 hover:text-signal-500"><MapPin size={14} aria-hidden /> Karte</a>
              {s.url && <a href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Website</a>}
              {s.fee === false && <span className="text-emerald-700">gratis</span>}
            </p>
          </li>
        ))}
      </ul>
      {list.length > n && (
        <button type="button" onClick={() => setN(n + 48)} className="btn-secondary mt-5 min-h-[44px]">Weitere {Math.min(48, list.length - n)} zeigen</button>
      )}
      <p className="mt-4 text-xs text-cream-faint">Badestellen aus OpenStreetMap (© OSM-Mitwirkende, ODbL) und unserer eigenen Datenbank. Temperatur: nächste Flussstation (BAFU) bzw. Seemodell (Eawag) – an der Badestelle selbst kann es abweichen.</p>
    </div>
  );
}
