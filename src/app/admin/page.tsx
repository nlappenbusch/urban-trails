import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminEnabled, isAdmin } from "@/lib/admin";
import { getDb, korrMap, setKorrektur, type Bestand, type KorrFeld, type OrtRow } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orte pflegen", robots: { index: false, follow: false } };

/** Bestände, deren Seiten schon aus der Datenbank lesen – nur dort wirken Korrekturen sofort */
const LIVE: Bestand[] = ["verzeichnis", "maerkte", "schlitteln", "baden"];
const BESTAND_LABEL: Record<Bestand, string> = { verzeichnis: "Verzeichnis (OSM)", kuratiert: "Geprüfte Orte", maerkte: "Weihnachtsmärkte", schlitteln: "Schlittelwege", ski: "Skigebiete", nachtski: "Nachtski", baden: "Badestellen" };

async function save(form: FormData) {
  "use server";
  if (!(await isAdmin())) throw new Error("nicht angemeldet");
  const id = String(form.get("id"));
  const d = getDb();
  const row = d.prepare("SELECT * FROM ort WHERE id = ?").get(id) as OrtRow | undefined;
  if (!row || !LIVE.includes(row.bestand)) throw new Error("nicht bearbeitbar");
  const daten = JSON.parse(row.daten) as Record<string, unknown>;
  const korr = korrMap(d).get(id);
  const cur = (f: string) => (korr?.get(f) ?? (daten[f] as string | undefined) ?? "") as string;
  for (const f of ["name", "text", "web", "hours"] as KorrFeld[]) {
    const v = String(form.get(f) ?? "").trim();
    if (v !== cur(f)) setKorrektur(id, f, v === String(daten[f] ?? "") ? null : v, "pflege");
  }
  const status = form.get("versteckt") ? "versteckt" : "aktiv";
  if (status !== row.status && row.status !== "verschwunden") setKorrektur(id, "status", status, "pflege");
  const top = form.get("top") ? "1" : "0";
  if (top !== String(row.hervorgehoben)) setKorrektur(id, "hervorgehoben", top === "1" ? "1" : null, "pflege");
  revalidatePath("/", "layout");
  redirect(`/admin?${new URLSearchParams({ q: String(form.get("q") ?? ""), b: String(form.get("b") ?? ""), s: String(form.get("s") ?? "") })}#${encodeURIComponent(id)}`);
}

const input = "w-full rounded-lg border border-cream/20 bg-ink-900 px-2 py-1.5 text-sm text-cream";

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  if (!adminEnabled()) return <div className="container-page py-16"><h1 className="headline text-4xl text-cream">Pflege ist aus</h1><p className="mt-4 text-cream-dim">Auf dem Server ist kein Passwort gesetzt (UT_ADMIN_PASSWORD, mindestens 12 Zeichen).</p></div>;
  if (!(await isAdmin()))
    return (
      <div className="container-page max-w-md py-16">
        <h1 className="headline text-4xl text-cream">Orte pflegen</h1>
        <form method="post" action="/api/admin/login" className="mt-6 space-y-3">
          <label className="block text-sm font-bold text-cream">Passwort<input type="password" name="password" autoComplete="current-password" required className={`${input} mt-1 min-h-[44px]`} /></label>
          {sp.fehler && <p className="text-sm font-semibold text-signal-600">Passwort falsch.</p>}
          <button className="btn-primary min-h-[44px]">Anmelden</button>
        </form>
      </div>
    );

  const d = getDb();
  const q = (sp.q ?? "").trim();
  const b = (sp.b ?? "") as Bestand | "";
  const s = sp.s ?? "";
  const stats = d.prepare("SELECT bestand, status, COUNT(*) n, SUM(gleich_wie IS NOT NULL) dup, SUM(fehlt_seit IS NOT NULL) miss FROM ort GROUP BY bestand, status").all() as { bestand: Bestand; status: string; n: number; dup: number; miss: number }[];
  const korrN = (d.prepare("SELECT COUNT(*) n FROM korrektur").get() as { n: number }).n;
  const lastSync = (d.prepare("SELECT v FROM meta WHERE k = 'sync_verzeichnis'").get() as { v: string } | undefined)?.v;
  const logRows = d.prepare("SELECT am, art, text FROM protokoll ORDER BY id DESC LIMIT 15").all() as { am: string; art: string; text: string }[];

  const where: string[] = [];
  const args: (string | number)[] = [];
  if (q) { where.push("(name LIKE ? OR ort LIKE ? OR id = ?)"); args.push(`%${q}%`, `%${q}%`, q); }
  if (b) { where.push("bestand = ?"); args.push(b); }
  if (s === "fehlt") where.push("fehlt_seit IS NOT NULL");
  else if (s === "dublette") where.push("gleich_wie IS NOT NULL");
  else if (s === "korrigiert") where.push("id IN (SELECT ort_id FROM korrektur)");
  else if (s) { where.push("status = ?"); args.push(s); }
  const rows = where.length || s ? (d.prepare(`SELECT * FROM ort ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY hervorgehoben DESC, name LIMIT 60`).all(...args) as unknown as OrtRow[]) : [];
  const korr = korrMap(d);
  const bestaende = [...new Set(stats.map((x) => x.bestand))];

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Orte-Datenbank</p>
          <h1 className="headline mt-2 text-4xl text-cream">Orte pflegen</h1>
        </div>
        <form method="post" action="/api/admin/login"><input type="hidden" name="logout" value="1" /><button className="text-sm font-semibold text-cream-dim hover:text-cream">Abmelden</button></form>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {bestaende.map((bs) => {
          const xs = stats.filter((x) => x.bestand === bs);
          const n = (st: string) => xs.find((x) => x.status === st)?.n ?? 0;
          return (
            <div key={bs} className="rounded-xl bg-ink-800/60 p-4 text-sm">
              <p className="font-bold text-cream">{BESTAND_LABEL[bs]}</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-cream">{n("aktiv").toLocaleString("de-CH")}</p>
              <p className="text-xs text-cream-faint">
                {n("versteckt") ? `${n("versteckt")} versteckt · ` : ""}{n("verschwunden") ? `${n("verschwunden")} verschwunden · ` : ""}
                {xs.reduce((a, x) => a + (x.dup ?? 0), 0) ? `${xs.reduce((a, x) => a + (x.dup ?? 0), 0)} = geprüfter Ort · ` : ""}
                {xs.reduce((a, x) => a + (x.miss ?? 0), 0) ? `${xs.reduce((a, x) => a + (x.miss ?? 0), 0)} fehlen in Quelle` : ""}
              </p>
              {!LIVE.includes(bs) && <p className="mt-1 text-xs text-cream-faint">Seiten lesen noch die JSON-Datei</p>}
            </div>
          );
        })}
      </section>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-cream-dim">
        <span>{korrN === 1 ? "1 Korrektur" : `${korrN} Korrekturen`} ·letzter OSM-Abgleich: {lastSync ? new Date(lastSync).toLocaleString("de-CH", { timeZone: "Europe/Zurich" }) : "noch keiner"}</span>
        <form method="post" action="/api/admin/sync"><button className="btn-secondary min-h-[38px] text-sm">Jetzt mit OSM abgleichen (1–5 Min.)</button></form>
      </div>

      <form method="get" className="mt-10 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <input name="q" defaultValue={q} placeholder="Name, Ort oder ID" className={`${input} min-h-[44px]`} />
        <select name="b" defaultValue={b} className={`${input} min-h-[44px]`}>
          <option value="">alle Bestände</option>
          {bestaende.map((x) => <option key={x} value={x}>{BESTAND_LABEL[x]}</option>)}
        </select>
        <select name="s" defaultValue={s} className={`${input} min-h-[44px]`}>
          <option value="">alle</option>
          <option value="aktiv">aktiv</option>
          <option value="versteckt">versteckt</option>
          <option value="verschwunden">verschwunden</option>
          <option value="fehlt">fehlt in Quelle</option>
          <option value="dublette">= geprüfter Ort</option>
          <option value="korrigiert">korrigiert</option>
        </select>
        <button className="btn-primary min-h-[44px]">Suchen</button>
      </form>

      {rows.length > 0 && <p className="mt-4 text-sm text-cream-dim">{rows.length === 60 ? "Erste 60 Treffer" : `${rows.length} Treffer`}</p>}
      <ul className="mt-3 space-y-3">
        {rows.map((r) => {
          const daten = JSON.parse(r.daten) as Record<string, unknown>;
          const k = korr.get(r.id);
          const val = (f: string) => (k?.get(f) ?? (daten[f] as string | undefined) ?? "") as string;
          const editable = LIVE.includes(r.bestand);
          const osm = r.quelle === "osm" && r.quelle_ref && /^[nwr]\d+$/.test(r.quelle_ref) ? `https://www.openstreetmap.org/${{ n: "node", w: "way", r: "relation" }[r.quelle_ref[0] as "n" | "w" | "r"]}/${r.quelle_ref.slice(1)}` : r.quelle_ref?.startsWith("http") ? r.quelle_ref : undefined;
          return (
            <li key={r.id} id={r.id} className={`card scroll-mt-24 p-4 ${r.status !== "aktiv" ? "opacity-70" : ""}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-bold text-cream">{val("name") || r.name} {k?.size ? <span className="text-xs font-semibold text-signal-600">korrigiert</span> : null}</p>
                <p className="text-xs text-cream-faint">
                  {BESTAND_LABEL[r.bestand]} · {r.art} · {r.ort ?? ""} {r.kanton ?? ""} · {r.status}{r.fehlt_seit ? ` · fehlt seit ${r.fehlt_seit.slice(0, 10)}` : ""}
                  {r.gleich_wie && ` · = ${r.gleich_wie}`} · Stand {r.stand.slice(0, 10)} · {osm ? <a href={osm} target="_blank" rel="noopener" className="underline">Quelle</a> : r.quelle}
                </p>
              </div>
              {editable ? (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-semibold text-signal-600">Bearbeiten</summary>
                  <form action={save} className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="q" value={q} /><input type="hidden" name="b" value={b} /><input type="hidden" name="s" value={s} />
                    <label className="text-xs font-bold text-cream-dim">Name<input name="name" defaultValue={val("name")} className={input} /></label>
                    <label className="text-xs font-bold text-cream-dim">Website<input name="web" defaultValue={val("web")} className={input} /></label>
                    <label className="text-xs font-bold text-cream-dim sm:col-span-2">Text<textarea name="text" defaultValue={val("text")} rows={3} className={input} /></label>
                    <label className="text-xs font-bold text-cream-dim sm:col-span-2">Öffnungszeiten<input name="hours" defaultValue={val("hours")} className={input} /></label>
                    <label className="flex items-center gap-2 text-sm text-cream"><input type="checkbox" name="versteckt" defaultChecked={r.status === "versteckt"} /> ausblenden</label>
                    <label className="flex items-center gap-2 text-sm text-cream"><input type="checkbox" name="top" defaultChecked={r.hervorgehoben === 1} /> hervorheben (oben in Listen)</label>
                    <button className="btn-primary min-h-[40px] sm:col-span-2 sm:justify-self-start">Speichern</button>
                  </form>
                </details>
              ) : (
                <p className="mt-1 text-xs text-cream-faint">Nur Ansicht – diese Seiten lesen noch die JSON-Datei.</p>
              )}
            </li>
          );
        })}
      </ul>
      {!rows.length && (q || b || s) && <p className="mt-4 text-cream-dim">Nichts gefunden.</p>}

      <section className="mt-14">
        <h2 className="font-display text-xl font-extrabold text-cream">Protokoll</h2>
        <ul className="mt-3 space-y-1 text-sm text-cream-dim">
          {logRows.map((l, i) => <li key={i}><span className="text-cream-faint">{new Date(l.am).toLocaleString("de-CH", { timeZone: "Europe/Zurich" })} · {l.art}</span> – {l.text}</li>)}
        </ul>
      </section>
    </div>
  );
}
