"use client";
import { useEffect, useState } from "react";
export default function SavedTours() {
  const [tours, setTours] = useState<{ title: string; path: string; audio: boolean }[]>([]);
  const [message, setMessage] = useState("Gespeicherte Touren werden geladen …");
  useEffect(() => { void (async () => {
    if (!("caches" in window)) { setMessage("Dieser Browser unterstützt keine Offline-Downloads."); return; }
    const saved = [];
    for (const name of await caches.keys()) if (name.startsWith("ut-tour-")) {
      const marker = await (await caches.open(name)).match("/__ut_offline_ready__");
      if (marker) { const data = await marker.json(); if (data.path && data.title) saved.push(data); }
    }
    setTours(saved); setMessage(saved.length ? "Auf diesem Gerät verfügbar:" : "Noch keine Tour gespeichert. Öffne eine Tour und wähle Offline & GPS.");
  })().catch(() => setMessage("Offline-Speicher konnte nicht gelesen werden.")); }, []);
  return <div className="container-page max-w-3xl py-12"><h1 className="headline text-3xl">Meine Offline-Touren</h1><p role="status" className="my-6">{message}</p><ul className="space-y-4">{tours.map(t => <li key={t.path} className="card p-5"><a className="text-xl font-bold text-signal-600" href={t.path}>{t.title}</a><p>{t.audio ? "Texte und Audio gespeichert" : "Texte gespeichert"}</p></li>)}</ul><a href="/unterwegs/zuerich/zuerich-klassiker" className="btn-primary mt-8">Zürich-Tour vorbereiten</a><p className="mt-6 text-sm">Zum erstmaligen Herunterladen brauchst du Internet. Karten anderer Anbieter sind nicht Teil des Downloads.</p></div>;
}
