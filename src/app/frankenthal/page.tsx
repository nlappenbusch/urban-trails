import type { Metadata } from "next";
import { frankenthal as project } from "@/data/projects/frankenthal";
export const metadata: Metadata = { title: "Frankenthal · Projektvorschau", robots: { index: false, follow: false } };
export default function FrankenthalPage() {
  return <div className="container-page max-w-4xl py-12">
    <p className="kicker">Projektvorschau · Noch nicht als Tour freigegeben</p>
    <h1 className="headline mt-4 text-4xl sm:text-6xl">{project.name}</h1>
    <p className="mt-6 text-lg leading-relaxed">{project.description}</p>
    <p className="mt-4 font-bold">15 geplante Hörpunkte · 30 Minuten Ziel-Audiozeit · 45–60 Minuten geplante Gesamtzeit</p>
    <div className="card my-8 p-6"><h2 className="text-xl font-bold">Erst prüfen, dann losgehen</h2><p className="mt-3">Die Route, Gehzeiten, sicheren Hörorte und Koordinaten müssen vor Ort geprüft werden. GPS-Start und Offline-Tour sind für Frankenthal deshalb noch nicht freigeschaltet.</p></div>
    <section><h2 className="text-2xl font-bold">Sprachen und Stimmen</h2><ul className="my-4 space-y-2">{project.languages.map(l => <li key={l.code}><strong>{l.name}</strong> · {l.status}</li>)}</ul><p>{project.voice.provider} · {project.voice.status}</p><p className="mt-2 text-sm">{project.voice.regionalVoice}</p></section>
    <section className="mt-10"><h2 className="text-2xl font-bold">Der geplante Hörspaziergang</h2><ol className="mt-5 space-y-3">{project.stops.map((s,i) => <li key={s.id} className="card p-5"><h3 className="font-bold">{i+1}. {s.name}</h3><p className="mt-1">{s.theme}</p><p className="mt-2 text-sm text-cream-dim">Geplante Audiozeit: {Math.floor(s.audioSeconds/60)}:{String(s.audioSeconds%60).padStart(2,"0")} Minuten · Recherche und Freigabe offen</p></li>)}</ol></section>
    <section className="card mt-10 p-6"><h2 className="text-2xl font-bold">Kanalhafen · Beispiel für den Erzählton</h2><p className="mt-3 leading-relaxed">Was verbindet eine Stadt mit der Welt? Heute fallen uns Straßen ein. Vielleicht die Bahn. Für Frankenthal gehörte einmal ein anderer Weg dazu: das Wasser. Die Stadt war über einen Kanal mit dem Rhein verbunden. Der Kanalhafen erzählt von dieser Verbindung. Diese Spur nehmen wir mit auf unseren Weg durch Frankenthal.</p><p className="mt-3 text-sm text-cream-dim">Redaktionelles Textmuster, keine historische Zeugenaussage und noch keine produzierte Hörprobe. Weitere Details werden mit Archiv und Museum geprüft.</p></section>
    <p className="mt-8 text-sm text-cream-dim">Grundlage: {project.source}</p>
    <a className="btn-primary mt-8" href="/unterwegs/zuerich/zuerich-klassiker">Offline & GPS mit Zürich ausprobieren</a>
  </div>;
}
