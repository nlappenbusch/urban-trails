"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import GameChip from "@/components/GameChip";
import { useMerkliste } from "@/lib/merkliste";
import { MEHR, TABS, activeTab } from "@/lib/hauptnav";
import type { Catalog } from "@/lib/game";

export default function Header({ catalog }: { catalog: Catalog }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = activeTab(pathname);
  const merk = useMerkliste().length;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-ink-950/85 backdrop-blur-md" style={{ viewTransitionName: "kopf" }}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 lg:flex">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              aria-current={active === t.key ? "page" : undefined}
              className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-4 text-[15px] font-bold transition duration-200 ease-out ${
                active === t.key ? "bg-ink-900 text-signal-600 shadow-soft" : "text-cream-dim hover:bg-ink-900/70 hover:text-cream"
              }`}
            >
              {t.key === "merkliste" && <Heart size={15} fill={merk ? "currentColor" : "none"} aria-hidden />}
              {t.label}
              {t.key === "merkliste" && merk > 0 && <span className="tabnums text-cream-faint">{merk}</span>}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <GameChip catalog={catalog} />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menü schliessen" : "Mehr anzeigen"}
            aria-expanded={open}
            aria-controls="mehr-panel"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink-900 px-3.5 text-sm font-bold text-cream shadow-soft ring-1 ring-cream/[0.06] transition duration-200 ease-out hover:ring-cream/20 active:scale-[0.97]"
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            <span className="hidden sm:inline">Mehr</span>
          </button>
        </div>
      </div>

      {open && (
        <div id="mehr-panel" className="absolute inset-x-0 top-16 border-t border-cream/[0.06] bg-ink-950 shadow-lift">
          <div className="container-page grid max-h-[calc(100dvh-4rem)] gap-6 overflow-y-auto py-6 pb-28 sm:grid-cols-3 lg:pb-8">
            {MEHR.map((g) => (
              <div key={g.title}>
                <p className="text-sm font-bold text-cream-faint">{g.title}</p>
                <ul className="mt-2 space-y-0.5">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex min-h-[44px] items-center rounded-xl px-2 -mx-2 text-[17px] font-semibold text-cream transition hover:bg-ink-900">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
