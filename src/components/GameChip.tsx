"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { score, type Catalog } from "@/lib/game";
import { currentUser, fetchAccount, getState, onGameChange, registerTourKeys } from "@/lib/game-client";

/** Punktestand im Kopf der Seite – führt zum Konto. */
export default function GameChip({ catalog }: { catalog: Catalog }) {
  const [points, setPoints] = useState<number | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    registerTourKeys(catalog.map((t) => t.key));
    let last = -1;
    const sync = () => {
      const p = score(getState(), catalog).points;
      if (last >= 0 && p > last) {
        setBump(true);
        setTimeout(() => setBump(false), 900);
      }
      last = p;
      setPoints(p);
      setUser(currentUser());
    };
    sync();
    if (currentUser()) void fetchAccount();
    return onGameChange(sync);
  }, [catalog]);

  return (
    <Link
      href="/konto"
      aria-label={user ? `Konto von ${user}: ${points ?? 0} Punkte` : `Dein Spielstand: ${points ?? 0} Punkte`}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full border border-cream/15 bg-ink-900 pl-2 pr-3 text-sm font-extrabold tabular-nums text-cream transition hover:border-signal-500 ${bump ? "scale-110 border-signal-500" : ""}`}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-signal-500 text-white" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" /></svg>
      </span>
      {points ?? 0}
    </Link>
  );
}
