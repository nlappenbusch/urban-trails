"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Compass, Headphones, Heart } from "lucide-react";
import { useMerkliste } from "@/lib/merkliste";
import { activeTab, TABS } from "@/lib/hauptnav";

const ICON = { ziele: Compass, touren: Headphones, kalender: CalendarDays, merkliste: Heart };

/** Daumenleiste unten auf dem Handy: die vier Hauptpunkte. */
export default function BottomNav() {
  const pathname = usePathname();
  const merk = useMerkliste().length;
  const active = activeTab(pathname);
  return (
    <nav aria-label="Hauptnavigation" style={{ viewTransitionName: "daumenleiste" }} className="bottom-nav fixed inset-x-0 bottom-0 z-40 bg-ink-900/95 pb-[env(safe-area-inset-bottom)] shadow-bar backdrop-blur-md lg:hidden">
      <ul className="mx-auto grid h-[4.25rem] max-w-md grid-cols-4">
        {TABS.map((t) => {
          const Icon = ICON[t.key];
          const on = active === t.key;
          return (
            <li key={t.key}>
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] font-bold transition duration-200 ease-out active:scale-[0.94] ${on ? "text-signal-500" : "text-cream-faint hover:text-cream"}`}
              >
                <span className={`relative grid h-8 w-14 place-items-center rounded-full transition-colors duration-200 ${on ? "bg-signal-500/10" : ""}`}>
                  <Icon size={21} strokeWidth={on ? 2.4 : 2} fill={t.key === "merkliste" && merk > 0 ? "currentColor" : "none"} aria-hidden />
                  {t.key === "merkliste" && merk > 0 && (
                    <span className="tabnums absolute -top-0.5 right-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-signal-500 px-1 text-[10px] font-extrabold text-white">{merk}</span>
                  )}
                </span>
                {t.short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
