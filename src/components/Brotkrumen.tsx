import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Pfad über der H1: Eltern als Links, die eigene Seite zuletzt (ohne Link). */
export default function Brotkrumen({ items, className = "" }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Brotkrumen" className={`text-sm text-cream-faint ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} aria-hidden />}
            {it.href ? (
              <Link href={it.href} className="font-semibold hover:text-cream">{it.label}</Link>
            ) : (
              <span aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Grüner Live-Punkt mit Text, z. B. «Live, alle 30 Minuten neu». */
export function LiveHinweis({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 ${className}`}>
      <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden /> {children}
    </p>
  );
}
