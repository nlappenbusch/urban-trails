"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Heart, MapPin, Share2, Trash2 } from "lucide-react";
import PointsMap from "@/components/PointsMap";
import StationPicker, { loadStart, type StartStation } from "@/components/StationPicker";
import { crowKm } from "@/lib/ski-core";
import { getRubrik, kantonByAk } from "@/lib/rubriken-core";
import { clearMerk, loadMerk, merkKey, removeMerk, useMerkliste, type Merk } from "@/lib/merkliste";

type Packed = [string, string, string, string, string, number, number, string, string];
const pack = (l: Merk[]) => l.map((m): Packed => [m.r, m.id, m.name, m.ort ?? "", m.kt, m.lat, m.lng, m.web ?? "", m.href]);
const toB64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));
const labelOf = (r: string) => getRubrik(r)?.label ?? (r === "markt" ? "Weihnachtsmärkte" : r === "fest" ? "Feste & Bräuche" : "Weitere");

/** Merkliste: Karte, Entfernung ab Haltestelle, teilen per Link (Liste steckt im Link, nichts auf dem Server). */
export default function MerklisteView() {
  const list = useMerkliste();
  const [start, setStart] = useState<StartStation | null>(null);
  const [shared, setShared] = useState<Merk[] | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setStart(loadStart());
    const m = window.location.hash.match(/^#l=(.+)$/);
    if (!m) return;
    try {
      const rows = JSON.parse(fromB64(m[1])) as Packed[];
      setShared(rows.map(([r, id, name, ort, kt, lat, lng, web, href]) => ({ r, id, name, ort: ort || undefined, kt, lat, lng, web: web || undefined, href, t: Date.now() })));
    } catch {
      setMsg("Der geteilte Link ist unvollständig.");
    }
  }, []);

  const from = start?.lat && start.lng ? { lat: start.lat, lng: start.lng } : undefined;
  const rows = useMemo(
    () => list.map((m) => ({ m, d: from ? crowKm(from, m) : undefined })).sort((a, b) => (a.d !== undefined && b.d !== undefined ? a.d - b.d : b.m.t - a.m.t)),
    [list, from?.lat, from?.lng], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const groups = useMemo(() => {
    const g = new Map<string, typeof rows>();
    for (const x of rows) g.set(x.m.r, [...(g.get(x.m.r) ?? []), x]);
    return [...g.entries()];
  }, [rows]);

  async function share() {
    const url = `${window.location.origin}/merkliste#l=${toB64(JSON.stringify(pack(list)))}`;
    const text = `Meine Ausflugsideen (${list.length}):\n${list.map((m) => `– ${m.name}${m.ort ? `, ${m.ort}` : ""}`).join("\n")}`;
    try {
      if (navigator.share) await navigator.share({ title: "Merkliste Urban Trails", text, url });
      else {
        await navigator.clipboard.writeText(`${text}\n\n${url}`);
        setMsg("Link kopiert – wer ihn öffnet, sieht deine Liste und kann sie übernehmen.");
      }
    } catch {
      /* abgebrochen */
    }
  }

  function adopt() {
    if (!shared) return;
    const have = new Set(loadMerk().map((m) => merkKey(m.r, m.id)));
    const merged = [...loadMerk(), ...shared.filter((m) => !have.has(merkKey(m.r, m.id)))];
    try {
      localStorage.setItem("ut-merkliste", JSON.stringify(merged));
    } catch {
      /* ignorieren */
    }
    window.dispatchEvent(new Event("ut-merkliste"));
    history.replaceState(null, "", "/merkliste");
    setMsg(`${shared.length} Ziele übernommen.`);
    setShared(null);
  }

  return (
    <div className="container-page pb-16 pt-6 sm:pt-10">
      <h1 className="headline text-[2.5rem] text-cream sm:text-6xl">Meine Merkliste</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Mit dem Herz gemerkte Ziele aus allen Rubriken, ohne Konto. Die Liste liegt nur in deinem Browser – wer sie sehen soll, bekommt einen Link, in dem sie steckt.
      </p>

      {shared && (
        <div className="card mt-8 border-rose-500/40 p-5">
          <p className="font-bold text-cream">Jemand hat dir {shared.length} Ausflugsziele geschickt:</p>
          <ul className="mt-2 text-sm text-cream-dim">{shared.slice(0, 12).map((m) => <li key={merkKey(m.r, m.id)}>– <Link href={m.href} className="underline underline-offset-2">{m.name}</Link>{m.ort ? `, ${m.ort}` : ""}</li>)}</ul>
          {shared.length > 12 && <p className="mt-1 text-sm text-cream-faint">und {shared.length - 12} weitere</p>}
          <button type="button" onClick={adopt} className="btn-primary mt-4 min-h-[44px]"><Heart size={16} aria-hidden /> In meine Merkliste übernehmen</button>
        </div>
      )}
      {msg && <p role="status" className="mt-4 text-sm font-semibold text-signal-600">{msg}</p>}

      {!list.length ? (
        <div className="mt-10 max-w-2xl">
          <p className="text-cream-dim">Noch nichts gemerkt. Tipp in einer Rubrik auf das Herz bei einem Eintrag – zum Beispiel bei den <Link href="/rubriken/tierparks" className="underline underline-offset-2">Tierparks</Link>, <Link href="/rubriken/bikeparks" className="underline underline-offset-2">Pumptracks</Link> oder <Link href="/rubriken/thermen" className="underline underline-offset-2">Thermen</Link>.</p>
          <Link href="/rubriken" className="btn-secondary mt-6 min-h-[44px]">Alle Rubriken</Link>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
            <PointsMap points={list.map((m) => ({ id: merkKey(m.r, m.id), name: m.name, lat: m.lat, lng: m.lng, sub: m.ort, href: m.href }))} color="#e11d48" height={360} />
            <div className="space-y-3">
              <StationPicker value={start} onChange={setStart} label="Entfernung ab" />
              <button type="button" onClick={share} className="btn-primary min-h-[44px] w-full"><Share2 size={16} aria-hidden /> Liste teilen</button>
              <button type="button" onClick={() => confirm("Ganze Merkliste leeren?") && clearMerk()} className="btn-secondary min-h-[44px] w-full"><Trash2 size={16} aria-hidden /> Alles entfernen</button>
            </div>
          </div>

          {groups.map(([r, xs]) => (
            <section key={r} className="mt-10">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">{labelOf(r)} <span className="text-cream-faint">{xs.length}</span></h2>
              <ul className="mt-3 divide-y divide-cream/10 rounded-2xl border border-cream/10">
                {xs.map(({ m, d }) => (
                  <li key={merkKey(m.r, m.id)} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4">
                    <div className="min-w-0 flex-1">
                      <Link href={m.href} className="font-bold text-cream hover:underline">{m.name}</Link>
                      <p className="text-xs text-cream-faint">{m.ort ?? kantonByAk(m.kt)?.name}{m.ort ? ` (${m.kt})` : ""}{d !== undefined && ` · ${d < 10 ? d.toFixed(1).replace(".", ",") : Math.round(d)} km`}</p>
                    </div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-signal-600"><MapPin size={14} aria-hidden /> Karte</a>
                    {m.web && <a href={m.web} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-cream-dim hover:text-cream"><ExternalLink size={14} aria-hidden /> Website</a>}
                    <button type="button" onClick={() => removeMerk(m.r, m.id)} aria-label={`${m.name} entfernen`} className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full text-rose-600 hover:bg-rose-500/10"><Heart size={18} fill="currentColor" aria-hidden /></button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
