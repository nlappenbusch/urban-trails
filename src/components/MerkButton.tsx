"use client";

import { Heart } from "lucide-react";
import { merkKey, toggleMerk, useMerkliste, type Merk } from "@/lib/merkliste";

/** Herz zum Merken eines Ziels (Merkliste im Browser). */
export default function MerkButton({ item, className = "" }: { item: Omit<Merk, "t">; className?: string }) {
  const list = useMerkliste();
  const on = list.some((x) => merkKey(x.r, x.id) === merkKey(item.r, item.id));
  return (
    <button
      type="button"
      onClick={() => toggleMerk(item)}
      aria-pressed={on}
      aria-label={on ? `${item.name} von der Merkliste nehmen` : `${item.name} merken`}
      title={on ? "Gemerkt – nochmals tippen zum Entfernen" : "Auf die Merkliste"}
      className={`inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-full transition ${on ? "text-rose-600" : "text-cream-faint hover:text-cream"} ${className}`}
    >
      <Heart size={18} fill={on ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

/** Kleiner Link zur Merkliste mit Anzahl – erscheint erst, wenn etwas gemerkt ist. */
export function MerkLink() {
  const list = useMerkliste();
  if (!list.length) return null;
  return (
    <a href="/merkliste" className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-rose-500/40 px-3.5 text-sm font-semibold text-rose-600 hover:border-rose-500">
      <Heart size={14} fill="currentColor" aria-hidden /> Merkliste ({list.length})
    </a>
  );
}
