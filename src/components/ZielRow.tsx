import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import MerkButton from "@/components/MerkButton";
import { Plakette } from "@/lib/rubrik-style";
import { kmText } from "@/lib/ziel";
import type { Hit } from "@/lib/hit";

/**
 * Eine Zielzeile: Plakette (oder Foto mit Nachweis), Name, Ort und Rubrik, rechts die Entfernung
 * in tabellarischen Ziffern wie eine Abfahrtszeit. Funktioniert ohne Foto.
 */
export default function ZielRow({ h, focus = false, distLabel = "km" }: { h: Hit; focus?: boolean; distLabel?: string }) {
  return (
    <li
      id={h.id}
      style={{ viewTransitionName: `z-${h.id.replace(/[^a-zA-Z0-9_-]/g, "_")}` }}
      className={`group relative flex scroll-mt-28 items-start gap-3.5 rounded-[22px] bg-ink-900 p-3.5 shadow-soft ring-1 transition duration-200 ease-out hover:shadow-lift sm:gap-4 sm:p-4 ${focus ? "ring-2 ring-signal-500" : "ring-cream/[0.06]"}`}
    >
      {h.img ? (
        <span className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={h.img.src} alt="" width={h.img.w} height={h.img.h} loading="lazy" decoding="async" className="h-14 w-14 rounded-2xl object-cover sm:h-16 sm:w-16" />
          <Plakette r={h.r} size={24} className="absolute -bottom-1.5 -right-1.5 rounded-lg ring-2 ring-white" />
        </span>
      ) : (
        <Plakette r={h.r} size={56} className="sm:h-16 sm:w-16" />
      )}
      <div className="min-w-0 flex-1 pr-1">
        <h3 className="text-[17px] font-bold leading-snug tracking-[-0.01em] text-cream">
          <Link href={h.href} className="after:absolute after:inset-0 after:rounded-[22px] focus-visible:outline-none">
            {h.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-sm text-cream-dim">
          {h.ort} · {h.rl}
          {h.fee === false && <span className="font-semibold text-emerald-800"> · gratis</span>}
        </p>
        {h.ours && <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-800"><BadgeCheck size={13} aria-hidden /> von uns geprüft: Preis, Zeiten, Tipp</p>}
        {h.line && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-cream-faint">{h.line}</p>}
        {h.img && (
          <a href={h.img.page} target="_blank" rel="noopener" className="relative z-10 mt-1 inline-block text-[11px] text-cream-faint hover:text-cream">
            Foto: {h.img.by ?? "Wikimedia Commons"}{h.img.lic ? `, ${h.img.lic}` : ""}
          </a>
        )}
      </div>
      <div className="relative z-10 flex shrink-0 flex-col items-end gap-1">
        {h.d !== undefined ? (
          <p className="tabnums text-right leading-none">
            <span className="text-[22px] font-extrabold tracking-[-0.02em] text-cream">{kmText(h.d)}</span>
            <span className="ml-0.5 text-xs font-semibold text-cream-faint">{distLabel}</span>
          </p>
        ) : null}
        <MerkButton item={{ id: h.id, r: h.r, name: h.name, ort: h.ort, kt: h.kt, lat: h.lat, lng: h.lng, web: h.web, href: h.href }} className="-mr-1.5" />
      </div>
    </li>
  );
}
