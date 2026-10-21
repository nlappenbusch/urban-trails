"use client";
import { useEffect, useState } from "react";

const audioPath = "/audio/frankenthal/kanalhafen-v1.mp3";
const prefix = "ut-tour-frankenthal-sample-";
const revision = "kanalhafen-v1";
const marker = "/__ut_offline_ready__";

export default function FrankenthalSample() {
  const [status, setStatus] = useState("Noch nicht offline gespeichert.");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!("caches" in window) || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => setStatus("Offline-Modus konnte nicht vorbereitet werden."));
    void (async () => {
      for (const name of await caches.keys()) {
        if (!name.startsWith(prefix)) continue;
        const cache = await caches.open(name);
        if (await cache.match(marker) && await cache.match(audioPath)) {
          setSaved(true); setStatus("Hörprobe und Seite offline gespeichert.");
        }
      }
    })().catch(() => setStatus("Offline-Speicher nicht zugänglich."));
  }, []);

  async function save() {
    if (!("caches" in window) || !("serviceWorker" in navigator)) {
      setStatus("Dieser Browser unterstützt den Offline-Modus nicht. Du kannst die MP3 herunterladen."); return;
    }
    setBusy(true); setStatus("Hörprobe wird gespeichert …");
    const name = `${prefix}${revision}-${Date.now()}`;
    try {
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
      const cache = await caches.open(name);
      const assets = new Set<string>([audioPath]);
      for (const path of ["/frankenthal", "/unterwegs"]) {
        const page = await fetch(path, { cache: "reload", headers: { Accept: "text/html" } });
        if (!page.ok || !page.headers.get("content-type")?.includes("text/html")) throw Error("Seite konnte nicht gespeichert werden.");
        const dom = new DOMParser().parseFromString(await page.clone().text(), "text/html");
        if (path === "/frankenthal" && dom.querySelector("[data-sample-revision]")?.getAttribute("data-sample-revision") !== revision) throw Error("Die Hörprobe wurde aktualisiert. Bitte lade die Seite neu.");
        for (const el of dom.querySelectorAll('script[src],link[rel="stylesheet"][href]')) {
          const url = new URL(el.getAttribute("src") ?? el.getAttribute("href")!, window.location.origin);
          if (url.origin === window.location.origin && url.pathname.startsWith("/_next/static/")) assets.add(url.href);
        }
        await cache.put(path, page);
      }
      for (const url of assets) {
        const response = await fetch(url, { cache: "reload" });
        if (response.status !== 200 || (url === audioPath && !response.headers.get("content-type")?.startsWith("audio/"))) throw Error("Download unvollständig. Bitte Verbindung und Speicher prüfen.");
        await cache.put(url, response);
      }
      await cache.put(marker, Response.json({ revision, audio: true, path: "/frankenthal", title: "Frankenthal · Kanalhafen-Hörprobe" }));
      for (const old of await caches.keys()) if (old.startsWith(prefix) && old !== name) await caches.delete(old);
      void navigator.storage?.persist?.().catch(() => false);
      setSaved(true); setStatus("Hörprobe und Seite offline gespeichert.");
    } catch (error) {
      await caches.delete(name).catch(() => false);
      setStatus(error instanceof Error ? error.message : "Download fehlgeschlagen.");
    } finally { setBusy(false); }
  }
  async function remove() {
    setBusy(true);
    try {
      for (const name of await caches.keys()) if (name.startsWith(prefix)) await caches.delete(name);
      setSaved(false); setStatus("Offline-Download entfernt.");
    } catch { setStatus("Download konnte nicht entfernt werden."); }
    finally { setBusy(false); }
  }
  return <section data-sample-revision={revision} className="card mt-10 p-6" aria-labelledby="kanalhafen-sample">
    <h2 id="kanalhafen-sample" className="text-2xl font-bold">Kanalhafen · Jetzt reinhören</h2>
    <p className="mt-3">Eine erste Hörprobe mit der ElevenLabs-Stimme „Arthur“, Wasser sowie nachgestalteten Holz- und Seilgeräuschen. Dauer: ca. 1:14 Minuten.</p>
    <audio controls preload="none" src={audioPath} className="my-5 w-full" aria-label="Kanalhafen-Hörprobe" onError={() => setStatus("Audio konnte nicht geladen werden. Prüfe die Verbindung oder speichere die Hörprobe erneut.")} />
    <div className="flex flex-wrap gap-3">
      <button className="btn-primary" disabled={busy} onClick={save}>{busy ? "Bitte warten …" : saved ? "Offline-Download aktualisieren" : "Hörprobe offline speichern"}</button>
      {saved && <button className="btn-secondary" disabled={busy} onClick={remove}>Offline-Download entfernen</button>}
      <a className="btn-secondary" href={audioPath} download="Frankenthal-Kanalhafen.mp3">MP3 herunterladen</a>
    </div>
    <p role="status" className="mt-3 text-sm">{status}</p>
    <p className="mt-3 text-sm text-cream-dim">Nach dem Speichern ist diese Seite mit der Hörprobe auch ohne Verbindung verfügbar. Du findest sie unter <a className="underline" href="/unterwegs">Meine Offline-Touren</a>. Browser können gespeicherte Daten bei Speicherknappheit löschen.</p>
    <p className="mt-3 text-sm text-cream-dim">Redaktioneller Entwurf zur Abstimmung. Die Klangszene ist nachgestaltet; historische Details und endgültige Inhalte werden mit Archiv und Museum geprüft.</p>
  </section>;
}
