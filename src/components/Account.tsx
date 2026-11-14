"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LEVELS, score, type Catalog } from "@/lib/game";
import { accountCall, currentUser, fetchAccount, getState, onGameChange, registerTourKeys } from "@/lib/game-client";

type Board = { name: string; points: number }[];

export default function Account({ catalog }: { catalog: Catalog }) {
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [board, setBoard] = useState<Board>([]);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    registerTourKeys(catalog.map((t) => t.key));
    const sync = () => {
      setUser(currentUser());
      setTick((n) => n + 1);
    };
    sync();
    setReady(true);
    void fetchAccount().then((r) => r.leaderboard && setBoard(r.leaderboard));
    return onGameChange(sync);
  }, [catalog]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const s = useMemo(() => score(ready ? getState() : { v: 1, stops: {}, riddles: {} }, catalog), [tick, ready, catalog]);
  const prev = LEVELS[s.level].min;
  const pct = s.nextLevelAt ? Math.min(100, ((s.points - prev) / (s.nextLevelAt - prev)) * 100) : 100;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await accountCall(mode, { name, password });
    setBusy(false);
    if (res.error) setMessage(res.error);
    else {
      setPassword("");
      if (res.leaderboard) setBoard(res.leaderboard);
    }
  }

  async function logout() {
    await accountCall("logout");
  }

  async function remove() {
    if (!window.confirm("Konto wirklich löschen? Der Spielstand bleibt nur auf diesem Gerät.")) return;
    await accountCall("delete");
    void fetchAccount().then((r) => r.leaderboard && setBoard(r.leaderboard));
  }

  return (
    <div className="container-page max-w-3xl py-10 pb-24">
      <p className="kicker">{user ? `Angemeldet als ${user}` : "Dein Spielstand"}</p>
      <h1 className="headline mt-2 text-4xl text-cream sm:text-5xl">
        {s.points} <em>Punkte</em>
      </h1>

      {/* Level */}
      <section className="card mt-6 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-xl font-extrabold text-cream">
            Level {s.level + 1} · {s.levelName}
          </p>
          <p className="text-sm font-semibold text-cream-faint">{s.nextLevelAt ? `noch ${s.nextLevelAt - s.points} bis ${LEVELS[s.level + 1].name}` : "Höchstes Level"}</p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink-700">
          <div className="h-full rounded-full bg-signal-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Stopps", s.stopsVisited],
            ["Rätsel gelöst", s.riddlesSolved],
            ["Touren komplett", s.toursDone],
            ["Städte", s.cities],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl bg-ink-800 p-3">
              <dt className="kicker">{label}</dt>
              <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums text-cream">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-cream-faint">
          So gibt es Punkte: 5 pro besuchtem Stopp, 10–30 pro gelöstem Rätsel (Hinweis oder zweiter Versuch halbieren), 50 für eine komplette Tour, 25 extra, wenn dabei alle Rätsel stimmen.
        </p>
      </section>

      {/* Abzeichen */}
      <section className="mt-10">
        <h2 className="headline text-2xl text-cream">
          Abzeichen <span className="text-cream-faint">{s.badges.filter((b) => b.earned).length}/{s.badges.length}</span>
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {s.badges.map((b) => (
            <li key={b.id} className={`rounded-2xl border p-4 ${b.earned ? "border-signal-500 bg-signal-500/[0.06]" : "border-cream/10 bg-ink-900 opacity-60"}`}>
              <p className="font-display text-base font-extrabold text-cream">
                {b.earned ? "★ " : "☆ "}
                {b.name}
              </p>
              <p className="mt-1 text-xs leading-snug text-cream-dim">{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Touren */}
      <section className="mt-10">
        <h2 className="headline text-2xl text-cream">Deine Touren</h2>
        {s.tours.length === 0 ? (
          <p className="mt-3 text-cream-dim">
            Noch nichts gesammelt. <Link href="/touren" className="font-bold text-signal-600 underline underline-offset-2">Such dir eine Tour aus</Link>, hak Stopps ab und lös die Rätsel.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {s.tours.map((t) => (
              <li key={t.key}>
                <Link href={`/${t.key}`} className="card flex items-center justify-between gap-3 p-4 transition hover:border-signal-500">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-cream">
                      {t.name} {t.perfect ? "★" : t.done ? "✓" : ""}
                    </p>
                    <p className="text-xs text-cream-faint">
                      {t.cityName} · {t.visited}/{t.total} Stopps · {t.solved} Rätsel
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-lg font-extrabold tabular-nums text-signal-600">{t.points}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Konto */}
      <section className="mt-10">
        <h2 className="headline text-2xl text-cream">Konto</h2>
        {user ? (
          <div className="card mt-4 p-5">
            <p className="text-cream-dim">
              Dein Spielstand wird im Konto <span className="font-bold text-cream">{user}</span> gesichert und auf jedem Gerät geladen, auf dem du dich anmeldest.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={logout} className="btn-secondary">Abmelden</button>
              <button onClick={remove} className="px-3 py-3 text-sm font-semibold text-cream-faint underline underline-offset-2">Konto löschen</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="card mt-4 p-5">
            <p className="text-sm leading-relaxed text-cream-dim">
              Ohne Konto bleibt dein Spielstand nur auf diesem Gerät. Mit Konto ist er gesichert, auf dem Handy und am Laptop gleich, und du erscheinst in der Rangliste. Es braucht nur einen Spielernamen und ein Passwort – keine E-Mail.
            </p>
            <div className="mt-4 inline-flex rounded-full bg-ink-800 p-1 text-sm font-bold">
              {(["register", "login"] as const).map((m) => (
                <button key={m} type="button" onClick={() => { setMode(m); setMessage(""); }} className={`rounded-full px-4 py-2 ${mode === m ? "bg-ink-900 text-cream shadow-sm" : "text-cream-faint"}`}>
                  {m === "register" ? "Neues Konto" : "Anmelden"}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-bold text-cream" htmlFor="acc-name">Spielername</label>
            <input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="username" required minLength={3} maxLength={20} className="mt-1 w-full rounded-xl border border-cream/20 bg-ink-900 px-4 py-3 text-base text-cream outline-none focus:border-signal-500" />
            <label className="mt-3 block text-sm font-bold text-cream" htmlFor="acc-pw">Passwort{mode === "register" ? " (mindestens 8 Zeichen)" : ""}</label>
            <input id="acc-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={8} className="mt-1 w-full rounded-xl border border-cream/20 bg-ink-900 px-4 py-3 text-base text-cream outline-none focus:border-signal-500" />
            {message && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{message}</p>}
            <button disabled={busy} className="btn-primary mt-4 w-full justify-center disabled:opacity-60">
              {busy ? "Einen Moment …" : mode === "register" ? "Konto anlegen und Spielstand sichern" : "Anmelden"}
            </button>
            {mode === "register" && <p className="mt-3 text-xs text-cream-faint">Merk dir das Passwort gut: Ohne E-Mail gibt es kein «Passwort vergessen».</p>}
          </form>
        )}
      </section>

      {/* Rangliste */}
      {board.length > 0 && (
        <section className="mt-10">
          <h2 className="headline text-2xl text-cream">Rangliste</h2>
          <ol className="card mt-4 divide-y divide-cream/10">
            {board.map((b, i) => (
              <li key={b.name} className={`flex items-center gap-3 px-4 py-3 ${b.name === user ? "bg-signal-500/[0.06]" : ""}`}>
                <span className="w-6 font-display text-sm font-extrabold tabular-nums text-cream-faint">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate font-semibold text-cream">{b.name}</span>
                <span className="font-display font-extrabold tabular-nums text-cream">{b.points}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
