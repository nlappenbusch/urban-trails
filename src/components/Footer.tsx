import Link from "next/link";
import { destinations } from "@/data/destinations";
import { tours } from "@/lib/tours";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-cream/10 bg-ink-900/60">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-base font-extrabold tracking-tight text-cream">
            URBAN TRAILS <span className="text-signal-500">CH</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream-dim">
            Walking-Touren für Vibes statt Sehenswürdigkeiten. Audio-Stories,
            Geheimtipps mit Adresse, Social-Check – handgemacht, Stadt für
            Stadt.
          </p>
        </div>
        <div>
          <p className="kicker">Destinationen</p>
          <ul className="mt-3 space-y-2 text-sm">
            {destinations.slice(0, 6).map((d) => (
              <li key={d.slug}>
                {d.comingSoon ? (
                  <span className="text-cream-faint">
                    {d.name} <span className="chip ml-1">bald</span>
                  </span>
                ) : (
                  <Link
                    href={`/${d.slug}`}
                    className="font-bold text-cream-dim hover:text-cream"
                  >
                    {d.name}
                  </Link>
                )}
              </li>
            ))}
            <li className="text-cream-faint">
              + {Math.max(0, destinations.length - 6)} weitere unterwegs
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker">Beliebte Touren</p>
          <ul className="mt-3 space-y-2 text-sm">
            {tours.slice(0, 5).map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.citySlug}/${t.slug}`}
                  className="font-bold text-cream-dim hover:text-cream"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="kicker">Entdecken</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/touren"
                className="font-bold text-cream-dim hover:text-cream"
              >
                Alle Touren
              </Link>
            </li>
            <li>
              <Link
                href="/destinationen"
                className="font-bold text-cream-dim hover:text-cream"
              >
                Alle Destinationen
              </Link>
            </li>
            <li>
              <Link
                href="/kategorien"
                className="font-bold text-cream-dim hover:text-cream"
              >
                Kategorien
              </Link>
            </li>
            <li>
              <Link
                href="/ueberrasche-mich"
                className="font-bold text-cream-dim hover:text-cream"
              >
                Überrasch mich
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="overflow-hidden">
        <p className="outline-word -mb-[1.5vw] whitespace-nowrap text-center text-[12.5vw] transition-colors hover:text-signal-500/10">
          URBAN TRAILS
        </p>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream-faint">
        © {new Date().getFullYear()} Urban Trails Switzerland — made with viel
        Fussweg in Zürich · Fotos: Wikimedia Commons
      </div>
    </footer>
  );
}
