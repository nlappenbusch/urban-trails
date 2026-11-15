import { MapPin, Umbrella } from "lucide-react";
import { KIND_LABEL, hikeText, priceText, type Place } from "@/lib/ausfluege-core";
import { imgAttrs } from "@/lib/img";
import SpecialBadge, { WowLine } from "@/components/SpecialBadge";
import LiveWater from "@/components/LiveWater";

/** Orte als Karten mit Foto, Preis, Öffnungshinweis und Tipp – für Themen- und Regionsseiten. */
export default function PlaceGrid({ places, showKind = true }: { places: Place[]; showKind?: boolean }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((p) => (
        <li key={p.id} id={p.id} className="card relative flex scroll-mt-24 flex-col overflow-hidden">
          <SpecialBadge p={p} className="absolute left-3 top-3 z-10 shadow" />
          {p.img ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={p.img.small} {...imgAttrs(p.img, "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw")} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
          ) : (
            <div className="grid aspect-[16/10] w-full place-items-center bg-ink-800 text-cream-faint"><MapPin size={28} aria-hidden /></div>
          )}
          <div className="flex flex-1 flex-col p-4">
            <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold text-cream-faint">
              {showKind && <span className="text-signal-600">{KIND_LABEL[p.kind]}</span>}
              <span>{p.town}</span>
              {p.weatherProof && <span className="inline-flex items-center gap-1"><Umbrella size={12} aria-hidden /> regenfest</span>}
            </p>
            <h3 className="mt-1 font-display text-lg font-extrabold leading-tight tracking-tight text-cream">{p.name}</h3>
            <WowLine p={p} className="mt-1 text-signal-600" />
            <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">{p.text}</p>
            {p.tip && <p className="mt-2 text-sm leading-relaxed text-cream"><span className="font-semibold">Tipp:</span> {p.tip}</p>}
            <div className="mt-auto pt-3 text-xs text-cream-faint">
              {p.hike && <p className="mb-0.5 text-sm font-semibold text-cream">{hikeText(p.hike)}{p.hike.start && <span className="font-normal text-cream-faint"> · ab {p.hike.start}</span>}</p>}
              {p.water && (p.water.type === "see" || p.water.type === "fluss") && <LiveWater id={p.id} className="mb-0.5" />}
              {p.water?.tempC && <p className="mb-0.5 text-sm text-cream-dim">Wasser {p.water.tempC} °C{p.water.body ? ` · ${p.water.body}` : ""}</p>}
              {p.priceInfo && <p className="text-sm font-semibold text-cream">{priceText(p.priceInfo)}</p>}
              {(p.hours || p.season) && <p className="mt-0.5">{[p.hours, p.season].filter(Boolean).join(" · ")}</p>}
              <p className="mt-0.5">
                {p.address}
                {p.url && <> · <a href={p.url} target="_blank" rel="noopener" className="font-semibold text-cream-dim hover:text-cream">Website</a></>}
                {p.img && <> · <a href={p.img.credit} target="_blank" rel="noopener noreferrer" className="hover:text-cream-dim">Foto</a></>}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
