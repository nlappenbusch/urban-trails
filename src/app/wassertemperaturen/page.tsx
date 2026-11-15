import type { Metadata } from "next";
import Link from "next/link";
import { places } from "@/lib/ausfluege";
import { allLakeTemps, riverTemps, waterForPlace } from "@/lib/wasser";
import { waterFeel, type WaterReading } from "@/lib/wasser-core";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";

export const revalidate = 1800;

const TITLE = "Wassertemperaturen Schweiz live – Seen, Flüsse, Badestellen";
const DESC = "Wie warm ist die Aare, der Zürichsee, der Rhein? Aktuelle Wassertemperaturen aller Schweizer Messstationen (BAFU) und Seen (Eawag), dazu geprüfte Badestellen mit Preis.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/wassertemperaturen" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/wassertemperaturen" }),
};

const fmt = (t: number) => t.toLocaleString("de-CH", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const time = (iso: string) => new Date(iso).toLocaleString("de-CH", { timeZone: "Europe/Zurich", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
const tone = (t: number) => (t >= 20 ? "bg-signal-500" : t >= 17 ? "bg-amber-400" : t >= 12 ? "bg-sky-400" : "bg-sky-600");

export default async function WasserPage() {
  const [rivers, lakes] = await Promise.all([riverTemps().catch(() => [] as WaterReading[]), allLakeTemps().catch(() => [] as WaterReading[])]);
  const spots = places.filter((p) => p.water && (p.water.type === "see" || p.water.type === "fluss"));
  const spotTemps = await Promise.all(spots.map(async (p) => ({ p, r: await waterForPlace(p).catch(() => null) })));
  const warmest = [...lakes, ...rivers].sort((a, b) => b.temp - a.temp)[0];
  const byRiver = Object.entries(
    rivers.reduce<Record<string, WaterReading[]>>((acc, r) => ((acc[r.body] ??= []).push(r), acc), {}),
  ).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Wassertemperaturen", path: "/wassertemperaturen" }])) }} />
      <p className="kicker">Live · alle 30 Minuten neu</p>
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">Wie warm ist das Wasser?</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        {lakes.length} Seen und {rivers.length} Flussstationen.
        {warmest && <> Am wärmsten gerade: <strong className="text-cream">{warmest.label}</strong> mit {fmt(warmest.temp)} °C.</>}
      </p>

      {spotTemps.some((x) => x.r) && (
        <section className="mt-12" aria-labelledby="badestellen">
          <h2 id="badestellen" className="headline text-3xl text-cream">Unsere Badestellen</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {spotTemps.filter((x) => x.r).sort((a, b) => b.r!.temp - a.r!.temp).map(({ p, r }) => (
              <li key={p.id} className="card p-4">
                <p className="text-xs font-semibold text-cream-faint">{p.town} · {r!.source === "BAFU" ? r!.label : `${r!.body} (Modell)`}</p>
                <Link href={`/ausflugsziele/${p.region}#${p.id}`} className="mt-0.5 block font-display text-lg font-extrabold leading-tight tracking-tight text-cream hover:underline">{p.name}</Link>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-extrabold tabular-nums text-cream">{fmt(r!.temp)}°</span>
                  <span className="text-sm text-cream-dim">{waterFeel(r!.temp)}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="seen">
          <h2 id="seen" className="headline text-3xl text-cream">Seen</h2>
          <p className="mt-1 text-sm text-cream-dim">1 m unter der Oberfläche, Modell Simstrat der Eawag.</p>
          <Bars rows={[...lakes].sort((a, b) => b.temp - a.temp)} />
        </section>
        <section aria-labelledby="fluesse">
          <h2 id="fluesse" className="headline text-3xl text-cream">Flüsse</h2>
          <p className="mt-1 text-sm text-cream-dim">Messstationen des Bundesamts für Umwelt, in Klammern Tiefst- und Höchstwert der letzten 24 Stunden.</p>
          {byRiver.map(([body, rows]) => (
            <div key={body} className="mt-6">
              <h3 className="font-display text-lg font-extrabold text-cream">{body}</h3>
              <Bars rows={rows.sort((a, b) => b.temp - a.temp)} river />
            </div>
          ))}
        </section>
      </div>

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-cream-faint">
        Quellen: Flüsse – Bundesamt für Umwelt BAFU, hydrodaten.admin.ch. Seen – Alplakes, Eawag (CC BY 4.0), Modellwerte, keine Messung vor Ort.
        Angaben ohne Gewähr; an Badestellen gelten die Hinweise vor Ort.
      </p>
    </div>
  );
}

function Bars({ rows, river }: { rows: WaterReading[]; river?: boolean }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,11rem)_1fr_3.5rem] items-center gap-3 text-sm">
          <span className="truncate text-cream-dim" title={`${r.label}, ${time(r.at)}`}>{river ? r.label.replace(/^[^-]+ - /, "") : r.label}</span>
          <span className="relative h-2.5 rounded-full bg-ink-800">
            <span className={`absolute inset-y-0 left-0 rounded-full ${tone(r.temp)}`} style={{ width: `${Math.min(100, Math.max(4, (r.temp / 26) * 100))}%` }} />
          </span>
          <span className="text-right font-semibold tabular-nums text-cream">
            {fmt(r.temp)}°{river && r.min24 !== undefined && <span className="sr-only"> (24 h: {r.min24}–{r.max24})</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
