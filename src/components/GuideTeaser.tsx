import Link from "next/link";
import { Users } from "lucide-react";

/** Hinweis auf die Führung mit Guide (Tour-, Stadt- und Startseite). */
export default function GuideTeaser({ href, place }: { href: string; place?: string }) {
  return (
    <div className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-800 text-signal-600">
          <Users size={20} aria-hidden />
        </span>
        <div>
          <p className="font-display text-xl font-extrabold tracking-tight text-cream">
            Lieber mit Guide{place ? ` durch ${place}` : ""}?
          </p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-cream-dim">
            Private Führung für eure Gruppe – der Guide passt Route, Tempo und Themen an Wetter, Lust und Laune an.
          </p>
        </div>
      </div>
      <Link href={href} className="btn-secondary shrink-0 justify-center">Führung anfragen</Link>
    </div>
  );
}
