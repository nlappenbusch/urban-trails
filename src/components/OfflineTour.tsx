"use client";
import { useEffect, useRef, useState } from "react";
import { arrival, distanceMeters } from "@/lib/gps";
import type { OfflinePack } from "@/lib/offline-types";

const marker = "/__ut_offline_ready__";
export default function OfflineTour({ pack }: { pack: OfflinePack }) {
  const [current, setCurrent] = useState(0);
  const [played, setPlayed] = useState<string[]>([]);
  const [status, setStatus] = useState("Noch nicht offline gespeichert.");
  const [busy, setBusy] = useState(false);
  const [gps, setGps] = useState(false);
  const [auto, setAuto] = useState(false);
  const [location, setLocation] = useState("");
  const [audioError, setAudioError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const playedRef = useRef(played), currentRef = useRef(current), autoRef = useRef(auto);
  const arrivalSince = useRef<{ id: string; time: number } | null>(null);
  playedRef.current = played; currentRef.current = current; autoRef.current = auto;
  const progressKey = `ut-travel-${pack.id}-${pack.revision}`;
  const cachePrefix = `ut-tour-${pack.id}-`;
  const stop = pack.stops[current];
  useEffect(() => {
    try { const data = JSON.parse(localStorage.getItem(progressKey) ?? "{}");
      if (Array.isArray(data.played)) setPlayed(data.played.filter((id: string) => pack.stops.some(s => s.id === id)));
    } catch { /* storage unavailable */ }
    if (!("serviceWorker" in navigator) || !("caches" in window)) { setStatus("Offline-Speicher wird von diesem Browser nicht unterstützt."); return; }
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => setStatus("Offline-Modus konnte nicht vorbereitet werden."));
    void (async () => {
      for (const name of await caches.keys()) if (name.startsWith(cachePrefix)) {
        const saved = await (await caches.open(name)).match(marker);
        if (saved) { const data = await saved.json(); setStatus(data.revision === pack.revision ? (data.audio ? "Texte und Audio offline gespeichert." : "Texte offline gespeichert; Audio benötigt Internet.") : "Älterer Download vorhanden. Bitte aktualisieren."); }
      }
    })().catch(() => setStatus("Offline-Speicher nicht zugänglich."));
  }, [pack.id, pack.revision, progressKey, cachePrefix, pack.stops]);
  useEffect(() => {
    if (!gps) return;
    if (!navigator.geolocation) { setLocation("Standort wird nicht unterstützt. Manuelle Auswahl bleibt verfügbar."); setGps(false); return; }
    const watch = navigator.geolocation.watchPosition(pos => {
      const nextIndex = pack.stops.findIndex(s => !playedRef.current.includes(s.id));
      if (nextIndex < 0) { setLocation("Alle Hörpunkte beendet."); return; }
      const next = pack.stops[nextIndex], point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const distance = Math.round(distanceMeters(point, next.coords));
      setLocation(`Nächster Hörpunkt: ${next.name} · ca. ${distance} m · Genauigkeit ±${Math.round(pos.coords.accuracy)} m`);
      if (!autoRef.current || !arrival(point, pos.coords.accuracy, pos.timestamp, next.coords, Date.now())) { arrivalSince.current = null; return; }
      if (!arrivalSince.current || arrivalSince.current.id !== next.id) { arrivalSince.current = { id: next.id, time: Date.now() }; return; }
      if (Date.now() - arrivalSince.current.time < 2000 || !audio.current?.paused) return;
      // Advance sequentially; never mark a stop complete solely because GPS is nearby.
      if (currentRef.current !== nextIndex) { setCurrent(nextIndex); currentRef.current = nextIndex; }
      const element = audio.current;
      element.src = next.audio;
      void element.play().catch(() => { setAuto(false); setLocation("Automatischer Audiostart blockiert. Bitte Play drücken."); });
      arrivalSince.current = null;
    }, () => { setGps(false); setAuto(false); setLocation("Kein Standort verfügbar. Nutze die manuelle Stationswahl."); }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
    return () => navigator.geolocation.clearWatch(watch);
  }, [gps, pack.stops]);
  useEffect(() => { setAudioError(false); }, [current]);

  async function save(includeAudio: boolean) {
    if (!("caches" in window) || !("serviceWorker" in navigator)) { setStatus("Dieser Browser unterstützt den Offline-Modus nicht."); return; }
    setBusy(true);
    const name = `${cachePrefix}${pack.revision}-${Date.now()}`;
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const cache = await caches.open(name);
      const page = await fetch(pack.path, { cache: "reload", headers: { Accept: "text/html" } });
      if (!page.ok || !page.headers.get("content-type")?.includes("text/html")) throw Error("Tourseite nicht verfügbar.");
      const html = await page.clone().text();
      const dom = new DOMParser().parseFromString(html, "text/html");
      if (dom.querySelector("[data-tour-revision]")?.getAttribute("data-tour-revision") !== pack.revision) throw Error("Die Tour wurde aktualisiert. Bitte lade die Seite neu und starte den Download erneut.");
      const assets = [...dom.querySelectorAll('script[src],link[rel="stylesheet"][href]')].map(el => new URL(el.getAttribute("src") ?? el.getAttribute("href")!, window.location.origin)).filter(url => url.origin === window.location.origin && url.pathname.startsWith("/_next/static/")).map(url => url.href);
      const indexPage = await fetch("/unterwegs", { cache: "reload", headers: { Accept: "text/html" } });
      if (!indexPage.ok) throw Error("Offline-Startseite nicht verfügbar.");
      const indexDom = new DOMParser().parseFromString(await indexPage.clone().text(), "text/html");
      const indexAssets = [...indexDom.querySelectorAll('script[src],link[rel="stylesheet"][href]')].map(el => new URL(el.getAttribute("src") ?? el.getAttribute("href")!, window.location.origin)).filter(url => url.origin === window.location.origin && url.pathname.startsWith("/_next/static/")).map(url => url.href);
      const urls = [...new Set([...assets, ...indexAssets, ...(includeAudio ? pack.stops.map(s => s.audio) : [])])];
      await cache.put(pack.path, page);
      await cache.put("/unterwegs", indexPage);
      for (let i = 0; i < urls.length; i++) {
        setStatus(`Download ${i+1}/${urls.length} …`);
        const response = await fetch(urls[i], { cache: "reload" });
        if (!response.ok || response.status !== 200 || (urls[i].includes("/api/audio?") && !response.headers.get("content-type")?.startsWith("audio/"))) throw Error("Noch nicht alle Audios verfügbar. Speichere vorerst die Texte.");
        await cache.put(urls[i], response);
      }
      // Commit only after every requested asset is present. Incomplete downloads stay invisible.
      await cache.put(marker, Response.json({ revision: pack.revision, audio: includeAudio, path: pack.path, title: pack.title }));
      for (const old of await caches.keys()) if (old.startsWith(cachePrefix) && old !== name) await caches.delete(old);
      void navigator.storage?.persist?.().catch(() => false);
      setStatus(includeAudio ? "Texte und Audio offline gespeichert." : "Texte offline gespeichert; Audio benötigt Internet.");
    } catch (error) { await caches.delete(name).catch(() => false); setStatus(error instanceof Error ? error.message : "Download fehlgeschlagen. Speicher und Verbindung prüfen."); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!("caches" in window)) return;
    setBusy(true);
    try { for (const name of await caches.keys()) if (name.startsWith(cachePrefix)) await caches.delete(name); setStatus("Offline-Download entfernt."); }
    catch { setStatus("Download konnte nicht entfernt werden."); }
    finally { setBusy(false); }
  }
  async function startAuto() {
    const el = audio.current; if (!el) return;
    try { await el.play(); setGps(true); setAuto(true); }
    catch { setLocation("Audio noch nicht verfügbar. Du kannst Standort und Mitlesetext nutzen."); }
  }
  function choose(index: number) { setAuto(false); setCurrent(index); audio.current?.pause(); }
  function completed() {
    const ids = [...new Set([...playedRef.current, pack.stops[currentRef.current].id])];
    setPlayed(ids);
    try { localStorage.setItem(progressKey, JSON.stringify({ played: ids })); } catch { /* manual navigation remains */ }
  }
  return <div data-tour-revision={pack.revision} className="container-page max-w-3xl py-10 pb-32">
    <a href={`/${pack.city}/${pack.id.slice(pack.city.length + 1)}`} className="text-signal-600">Zur Tourübersicht</a>
    <h1 className="headline mt-4 text-3xl">{pack.title} · Unterwegs</h1>
    <p className="mt-3 text-cream-dim">Texte und verfügbare Audios lassen sich auf diesem Gerät speichern. Die Karten anderer Anbieter werden nicht heruntergeladen. Standortdaten bleiben für die Führung auf deinem Gerät.</p>
    <section aria-label="Offline-Download" className="card my-6 p-5">
      <p role="status" className="mb-4">{status}</p>
      <div className="flex flex-wrap gap-3"><button disabled={busy} onClick={() => save(false)} className="btn-secondary">Texte offline speichern</button><button disabled={busy} onClick={() => save(true)} className="btn-primary">Texte & Audio speichern</button><button disabled={busy} onClick={remove} className="btn-secondary">Download entfernen</button></div>
      <p className="mt-3 text-sm text-cream-dim">Browser können Downloads bei Speicherknappheit löschen. Öffne diese Unterwegs-Seite nach dem Download einmal ohne Netz zum Prüfen.</p>
    </section>
    <section aria-label="GPS-Führung" className="card p-5">
      <div className="flex flex-wrap gap-3"><button onClick={() => { setGps(!gps); if (gps) setAuto(false); }} className="btn-secondary">{gps ? "Standort ausschalten" : "Standort einschalten"}</button><button onClick={auto ? () => setAuto(false) : startAuto} className="btn-primary">{auto ? "GPS-Audio beenden" : "GPS-Hörmodus starten"}</button></div>
      <p role="status" className="mt-3 text-sm">{location}</p>
      <p className="mt-3 text-sm text-cream-dim">GPS-Audio benötigt präzisen Standortzugriff und beginnt erst nach deinem Start. Halte zum Hören sicher an. Im Web können Hintergrund und Displaysperre die Führung unterbrechen.</p>
    </section>
    <label htmlFor="stop-select" className="mt-8 block font-bold">Hörpunkt auswählen · {played.length}/{pack.stops.length} gehört</label>
    <select id="stop-select" value={current} onChange={e => choose(Number(e.target.value))} className="my-3 w-full rounded-xl border border-black/20 bg-white p-3 text-black">{pack.stops.map((s,i) => <option key={s.id} value={i}>{i+1}. {s.name}{played.includes(s.id) ? " · gehört" : ""}</option>)}</select>
    <article className="card p-5"><h2 className="text-2xl font-bold">{stop.name}</h2><p className="my-3">{stop.directions}</p>
      <audio ref={audio} src={stop.audio} controls preload="none" className="my-5 w-full" aria-label={`Audioguide ${stop.name}`} onEnded={completed} onPause={() => { if (!audio.current?.ended) setAuto(false); }} onError={() => { setAudioError(true); setAuto(false); }} />
      {audioError && <p role="status">Audio ist nicht verfügbar. Lies die Geschichte hier mit.</p>}
      <p className="whitespace-pre-line leading-relaxed">{stop.text}</p>
      <div className="mt-6 flex justify-between gap-3"><button disabled={!current} onClick={() => choose(current-1)} className="btn-secondary">Zurück</button><button disabled={current===pack.stops.length-1} onClick={() => choose(current+1)} className="btn-primary">Nächster Hörpunkt</button></div>
    </article>
  </div>;
}
