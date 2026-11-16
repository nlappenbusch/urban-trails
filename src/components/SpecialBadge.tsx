import { Gem, Zap } from "lucide-react";
import { specialLabel, type Place } from "@/lib/ausfluege-core";

/** Etikett «Krass» oder «Geheimtipp» – nur bei Orten, die das wirklich sind. */
export default function SpecialBadge({ p, className = "" }: { p: Pick<Place, "tags">; className?: string }) {
  const label = specialLabel(p);
  if (!label) return null;
  const Icon = label === "Geheimtipp" ? Gem : Zap;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold text-white ${label === "Geheimtipp" ? "bg-violet-600" : "bg-signal-500"} ${className}`}>
      <Icon size={11} aria-hidden /> {label}
    </span>
  );
}

/** Die harte Tatsache dahinter («Steilste Standseilbahn …»). */
export function WowLine({ p, className = "" }: { p: Pick<Place, "wow">; className?: string }) {
  if (!p.wow) return null;
  return <p className={`text-sm font-semibold leading-snug ${className || "text-cream"}`}>{p.wow}</p>;
}
