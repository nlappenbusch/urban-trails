"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const links = [
  { href: "/touren", label: "Touren" },
  { href: "/destinationen", label: "Destinationen" },
  { href: "/kategorien", label: "Kategorien" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-cream/10 bg-ink-950/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop-Nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition hover:text-cream ${
                pathname.startsWith(l.href) ? "text-signal-600" : "text-cream-dim"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/ueberrasche-mich"
            className="ml-1 rounded-full bg-signal-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-signal-600"
          >
            Überrasch mich
          </Link>
        </nav>

        {/* Mobile: CTA + Burger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/ueberrasche-mich"
            className="rounded-full bg-signal-500 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-white"
            onClick={() => setOpen(false)}
          >
            Überrasch mich
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="3" y1="3" x2="15" y2="15" />
                  <line x1="15" y1="3" x2="3" y2="15" />
                </>
              ) : (
                <>
                  <line x1="2" y1="4.5" x2="16" y2="4.5" />
                  <line x1="2" y1="9" x2="16" y2="9" />
                  <line x1="2" y1="13.5" x2="16" y2="13.5" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile-Panel */}
      {open && (
        <nav className="border-t border-cream/10 bg-ink-900 md:hidden">
          <div className="container-page flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`border-b border-cream/5 py-3.5 font-display text-lg font-extrabold tracking-tight ${
                  pathname.startsWith(l.href) ? "text-signal-600" : "text-cream"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/ueberrasche-mich"
              onClick={() => setOpen(false)}
              className="py-3.5 font-display text-lg font-extrabold tracking-tight text-signal-600"
            >
              ✨ Überrasch mich
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
