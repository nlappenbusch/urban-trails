import Link from "next/link";
import { tours } from "@/lib/tours";
import { destinations } from "@/data/destinations";
import TourCard from "@/components/TourCard";
import { getTourHeroImage } from "@/data/images";

export default function HomePage() {
  const totalStops = tours.reduce((n, t) => n + t.stops.length, 0);
  const hiddenGems = tours.reduce(
    (n, t) => n + t.stops.filter((s) => s.isHiddenGem).length,
    0
  );
  const totalKm = tours.reduce((n, t) => n + t.distanceKm, 0);

  const idaplatz = tours
    .find((t) => t.slug === "chreis-cheib")
    ?.stops.find((s) => s.id === "idaplatz");
  const boeoegg = tours
    .find((t) => t.slug === "zuerich-klassiker")
    ?.stops.find((s) => s.id === "bellevue");
  const freitag = tours
    .find((t) => t.slug === "hidden-zuerich")
    ?.stops.find((s) => s.id === "freitag-tower");

  const tickerItems = tours.flatMap((t) => t.stops.map((s) => s.name));

  return (
    <>
      <section className="relative overflow-hidden border-b border-cream/10">
        <div className="container-page relative grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_360px]">
          <div>
          <p className="stamp mb-6">{destinations.filter((d) => !d.comingSoon).length} Destinationen live · {tours.length} Touren · echte Audio-Stories</p>
          <h1 className="headline max-w-5xl text-6xl text-cream sm:text-8xl lg:text-9xl">
            Die Stadt ist
            <br />
            kein <em>Museum.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream-dim">
            Selbstgeführte Spaziergänge durch Zürich und die schönsten Städtchen drumherum – für Leute, die Vibes suchen statt Sehenswürdigkeiten: Audio-Stories wie ein guter Podcast,
            Geheimtipps mit Adresse, Social-Check für jeden Spot – und ein
            KI-Guide für alles dazwischen.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/touren" className="btn-primary">
              Touren ansehen
            </Link>
            <Link href="/ueberrasche-mich" className="btn-secondary">
              Überrasch mich
            </Link>
          </div>

          <dl className="mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-cream/15 bg-cream/15 sm:grid-cols-4">
            {[
              { v: String(tours.length), l: "Touren" },
              { v: String(totalStops), l: "Stops" },
              { v: String(hiddenGems), l: "Geheimtipps" },
              { v: `${Math.round(totalKm)} km`, l: "Stadt zu Fuss" },
            ].map((s) => (
              <div key={s.l} className="bg-ink-950 p-4">
                <dd className="font-display text-3xl text-cream">{s.v}</dd>
                <dt className="kicker mt-1">{s.l}</dt>
              </div>
            ))}
          </dl>
          </div>

          {/* Foto-Collage – echte Tour-Bilder, leicht gestapelt */}
          <div className="relative hidden h-[480px] lg:block" aria-hidden="true">
            {[
              { slug: "zuerich-klassiker", cls: "left-2 top-4 -rotate-3", cap: "Zürich" },
              { slug: "ich-muss-mal-raus", cls: "right-0 top-36 rotate-2", cap: "Uetliberg" },
              { slug: "basel-rhein", cls: "left-8 top-72 -rotate-1", cap: "Basel" },
            ].map((p) => {
              const img = getTourHeroImage(p.slug);
              if (!img) return null;
              return (
                <div
                  key={p.slug}
                  className={`absolute w-64 ${p.cls} rounded-xl bg-ink-900 p-2 pb-7 shadow-lg ring-1 ring-cream/10 transition hover:z-10 hover:scale-[1.03]`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    loading="lazy"
                    className="h-40 w-full rounded-lg object-cover"
                  />
                  <p className="absolute bottom-1.5 left-3 font-display text-xs font-extrabold uppercase tracking-widest text-cream-faint">
                    {p.cap}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden border-t border-cream/10 bg-signal-500 py-2.5">
          <div className="flex w-max animate-ticker gap-8 whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((name, i) => (
              <span
                key={i}
                className="text-sm font-bold uppercase tracking-widest text-ink-950"
              >
                {name} <span className="opacity-50">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile: Foto-Streifen (Collage gibt es erst ab lg) */}
      <div className="border-b border-cream/10 lg:hidden" aria-hidden="true">
        <div className="flex snap-x gap-3 overflow-x-auto px-5 py-5">
          {["zuerich-klassiker", "ich-muss-mal-raus", "basel-rhein", "luzern-klassiker", "bern-altstadt"].map((slug, i) => {
            const img = getTourHeroImage(slug);
            if (!img) return null;
            return (
              <div
                key={slug}
                className={`w-44 shrink-0 snap-center rounded-xl bg-ink-900 p-1.5 pb-5 shadow ring-1 ring-cream/10 ${i % 2 ? "rotate-1" : "-rotate-1"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" loading="lazy" className="h-28 w-full rounded-lg object-cover" />
              </div>
            );
          })}
        </div>
      </div>

      <section className="container-page py-20">
        <p className="kicker">Kein Blabla – so sieht das wirklich aus</p>
        <h2 className="headline mt-3 max-w-2xl text-4xl text-cream sm:text-5xl">
          Was bei jedem Stop <em>drinsteckt</em>
        </h2>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="card flex flex-col p-6 lg:row-span-2">
            <span className="stamp-orange self-start">Audio-Story</span>
            <p className="mt-5 flex-1 text-lg leading-relaxed text-cream">
              «Neunzehn rostige Schiffscontainer, aufeinandergestapelt wie von
              einem Riesenkind – das ist kein Kunstwerk, das ist ein Laden.
              Und was für einer …»
            </p>
            <div className="mt-6 border-t border-cream/10 pt-4 text-sm text-cream-dim">
              <p className="font-bold text-cream">
                So klingen unsere Audioguides.
              </p>
              <p className="mt-1">
                Kein Wikipedia-Vorlesen – Geschichten wie von einem Freund,
                der hier aufgewachsen ist. Zu jedem einzelnen Stop, je 60–120
                Sekunden, generiert mit KI-Stimme oder Studio-Audio.
              </p>
            </div>
          </div>

          {idaplatz?.social && (
            <div className="card p-6">
              <span className="stamp self-start">Social-Check</span>
              <p className="mt-4 font-display text-lg font-semibold text-cream">
                {idaplatz.name}
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-cream-dim">
                  <span className="font-bold text-signal-600">Alleine ok? </span>
                  {idaplatz.social.alleinOk}
                </p>
                <p className="text-cream-dim">
                  <span className="font-bold text-signal-600">Gespräch? </span>
                  {idaplatz.social.gespraech}
                </p>
                <p className="text-cream-dim">
                  <span className="font-bold text-signal-600">Beste Zeit: </span>
                  {idaplatz.social.besteZeit}
                </p>
              </div>
              <p className="mt-4 border-t border-cream/10 pt-3 text-xs text-cream-faint">
                Für Solo-Traveller und alle, die Leute kennenlernen wollen –
                bei jedem relevanten Spot.
              </p>
            </div>
          )}

          {boeoegg && (
            <div className="card p-6">
              <span className="stamp-orange self-start">Fun Fact</span>
              <p className="mt-4 text-base leading-relaxed text-cream">
                {boeoegg.funFact}
              </p>
              <p className="mt-4 border-t border-cream/10 pt-3 text-xs text-cream-faint">
                Stoff, mit dem du beim nächsten Apéro glänzt – garantiert bei
                jedem Stop.
              </p>
            </div>
          )}

          {freitag && (
            <div className="card p-6">
              <span className="stamp self-start">Insider + Adresse</span>
              <p className="mt-4 font-display text-lg font-semibold text-cream">
                {freitag.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                {freitag.insiderTip}
              </p>
              <p className="mt-3 text-sm font-bold text-signal-400">
                📍 Geroldstrasse 17, 8005 Zürich
              </p>
              <p className="mt-4 border-t border-cream/10 pt-3 text-xs text-cream-faint">
                Bars, Cafés, Kinos, Fotospots – mit konkreter Adresse und
                Navigation per Klick.
              </p>
            </div>
          )}

          <div className="card p-6">
            <span className="stamp-orange self-start">Frag deinen Guide</span>
            <div className="mt-4 space-y-2 text-sm">
              <p className="ml-auto w-fit max-w-[90%] rounded-lg bg-ink-800 px-3 py-2 text-cream">
                Wo gibts hier guten Kaffee?
              </p>
              <p className="w-fit max-w-[90%] rounded-lg bg-glacier-100 px-3 py-2 text-cream">
                Vier Minuten von dir: die Markthalle im Viadukt – Flat White
                unter einem Eisenbahnbogen. 🙌
              </p>
            </div>
            <p className="mt-4 border-t border-cream/10 pt-3 text-xs text-cream-faint">
              Der KI-Guide kennt deine Route und antwortet unterwegs – Kaffee,
              Abkürzung, Bar, Fotospot.
            </p>
          </div>

          <div className="card p-6">
            <span className="stamp self-start">Tour-Modus</span>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm font-bold text-cream">
                <span>7/12 Stops</span>
                <span className="text-signal-400">📍 240 m bis Lindenhof</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream/10">
                <div className="h-full w-7/12 rounded-full bg-gradient-to-r from-signal-400 to-signal-600" />
              </div>
            </div>
            <p className="mt-4 border-t border-cream/10 pt-3 text-xs text-cream-faint">
              Stops abhaken, Fortschritt behalten, GPS-Distanz zum nächsten
              Spot, Karte mit eingezeichneter Route – fühlt sich an wie eine
              App, läuft im Browser.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Tour aussuchen",
              d: "Nach Stadt, Stimmung oder Zeitbudget – von 60 Minuten bis Halbtag, gratis oder Premium.",
            },
            {
              n: "02",
              t: "Kopfhörer rein",
              d: "Jeder Stop hat seine eigene Audio-Story – oder du liest einfach. Kein Download, keine App.",
            },
            {
              n: "03",
              t: "Loslaufen",
              d: "Karte zeigt den Weg, GPS die Distanz zum nächsten Spot – Stop für Stop abhaken.",
            },
          ].map((st) => (
            <div key={st.n} className="relative border-t-2 border-cream/10 pt-5 transition hover:border-signal-500">
              <span className="font-display text-6xl font-extrabold leading-none text-signal-500/25">
                {st.n}
              </span>
              <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight text-cream">
                {st.t}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{st.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-cream/10 bg-ink-900/40">
        <div className="container-page py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">Handgemacht, nicht zusammengeklickt</p>
              <h2 className="headline mt-3 text-4xl text-cream sm:text-5xl">
                Die <em>Touren</em>
              </h2>
            </div>
            <Link
              href="/touren"
              className="text-sm font-bold uppercase tracking-wide text-signal-400 hover:text-signal-500"
            >
              Alle ansehen →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tours.map((t) => (
              <TourCard key={t.slug} tour={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="kicker">Fairer Deal</p>
        <h2 className="headline mt-3 text-4xl text-cream sm:text-5xl">
          Was kostet der <em>Spass?</em>
        </h2>
        <div className="mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div className="ticket p-7">
            <p className="font-display text-2xl font-semibold text-cream">Gratis</p>
            <p className="mt-1 font-display text-4xl text-cream">CHF 0</p>
            <ul className="mt-5 space-y-2 text-sm text-cream-dim">
              <li>✓ Klassiker-Tour komplett</li>
              <li>✓ Karte, Route &amp; Tour-Modus</li>
              <li>✓ Alle Texte, Fun Facts &amp; Fotospots</li>
              <li>✓ Browser-Audio</li>
            </ul>
          </div>
          <div className="ticket border-signal-500/60 p-7">
            <p className="stamp-orange mb-3">Pro Tour</p>
            <p className="font-display text-2xl font-semibold text-cream">
              Premium
            </p>
            <p className="mt-1 font-display text-4xl text-signal-400">
              CHF 4.90
            </p>
            <ul className="mt-5 space-y-2 text-sm text-cream-dim">
              <li>✓ Insider-Touren (Hidden, Sunset, Chreis Cheib)</li>
              <li>✓ Studio-Audio-Stories</li>
              <li>✓ Social-Check &amp; Geheimtipps mit Adressen</li>
              <li>✓ KI-Guide unterwegs</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-xs text-cream-faint">
          Weniger als ein Glas Wein im Niederdorf – für drei Stunden Stadt, die
          du nie vergisst.
        </p>
      </section>

      <section className="border-t border-cream/10">
        <div className="container-page py-20">
          <p className="kicker">Gebaut als Plattform</p>
          <h2 className="headline mt-3 text-4xl text-cream sm:text-5xl">
            Eine Stadt nach der <em>anderen</em>
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            {destinations.map((d) =>
              d.comingSoon ? (
                <span
                  key={d.slug}
                  className="chip cursor-default py-2 opacity-50"
                  title={d.teaser}
                >
                  {d.name} · bald
                </span>
              ) : (
                <Link
                  key={d.slug}
                  href={`/${d.slug}`}
                  className="rounded-full bg-cream px-4 py-2 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-signal-500"
                  title={d.teaser}
                >
                  {d.name} · live
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-xl bg-signal-500 p-10 sm:p-16">
          <h2 className="headline max-w-xl text-4xl text-ink-950 sm:text-5xl">
            «Ich muss mal raus.»
          </h2>
          <p className="mt-4 max-w-md font-medium text-ink-950/80">
            Sag uns, wie viel Zeit du hast und wonach dir ist. Wir bauen dir
            den Feierabend.
          </p>
          <Link
            href="/ueberrasche-mich"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink-950 px-6 py-3 font-bold uppercase tracking-wide text-cream transition hover:-translate-y-0.5"
          >
            Überrasch mich
          </Link>
        </div>
      </section>
    </>
  );
}
