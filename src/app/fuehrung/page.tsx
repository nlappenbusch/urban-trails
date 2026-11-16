import type { Metadata } from "next";
import Link from "next/link";
import { CloudSun, Footprints, Smile } from "lucide-react";
import { destinations } from "@/data/destinations";
import { tours } from "@/lib/tours";
import { getTourHeroImage } from "@/data/images";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import GuideRequestForm from "@/components/GuideRequestForm";
import Brotkrumen from "@/components/Brotkrumen";

const TITLE = "Stadtführung mit Guide anfragen – individuell für eure Gruppe";
const DESC =
  "Private Stadtführung in Zürich, Bern, Luzern, Solothurn und weiteren Schweizer Städten: Der Guide passt Route, Tempo und Themen unterwegs an Wetter, Lust und Laune eurer Gruppe an. Unverbindlich anfragen.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/fuehrung" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/fuehrung", image: getTourHeroImage("bern-altstadt") }),
};

const adapts = [
  {
    icon: CloudSun,
    title: "Wetter",
    text: "Regen? Dann über die Lauben, in die Kirche und auf einen Kaffee. Sonne? Hinauf zur Aussicht und ans Wasser. Ausfallen muss nichts.",
  },
  {
    icon: Footprints,
    title: "Lust",
    text: "Wie weit, wie schnell, wie viele Pausen – der Guide richtet sich nach der Gruppe, nicht nach dem Plan. Mit Kindern oder Rollstuhl genauso.",
  },
  {
    icon: Smile,
    title: "Laune",
    text: "Die einen wollen Jahreszahlen, die anderen Klatsch von früher oder den besten Apéro-Spot. Der Guide merkt, was zieht, und verschiebt die Schwerpunkte.",
  },
];

const faq = [
  {
    q: "Was kostet eine Führung?",
    a: "Das hängt von Gruppengrösse, Dauer und Sprache ab. Du bekommst einen festen Preis, bevor du zusagst. Die Touren zum Selberlaufen bleiben gratis.",
  },
  {
    q: "Wie lange dauert sie?",
    a: "Das legt ihr fest. Üblich sind eineinhalb bis zweieinhalb Stunden – kürzer für eine Mittagspause, länger mit Apéro am Schluss.",
  },
  {
    q: "Müssen wir eine bestehende Tour wählen?",
    a: "Nein. Eine Tour als Grundlage hilft, ist aber kein Muss. Schreib einfach, was euch interessiert – der Guide stellt die Route zusammen.",
  },
  {
    q: "Und wenn es am Tag selbst regnet?",
    a: "Dann stellt der Guide die Route um, statt abzusagen. Bei Unwetter findet ihr gemeinsam einen neuen Termin.",
  },
];

export default async function GuidePage({ searchParams }: { searchParams: Promise<{ tour?: string; stadt?: string }> }) {
  const sp = await searchParams;
  const cities = destinations.filter((d) => !d.comingSoon).map((d) => ({ slug: d.slug, name: d.name }));
  const formTours = tours.map((t) => ({ slug: t.slug, name: t.name, city: t.citySlug }));
  const preTour = formTours.find((t) => t.slug === sp.tour);
  const preCity = preTour?.city ?? (cities.some((c) => c.slug === sp.stadt) ? sp.stadt! : "");
  const cityName = cities.find((c) => c.slug === preCity)?.name;

  return (
    <div className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Führung mit Guide", path: "/fuehrung" }]),
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ]),
        }}
      />
      <Brotkrumen items={[{ label: "Audio-Touren", href: "/touren" }, { label: "Führung mit Guide" }]} />
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">
        Mit Guide – <em>nach Laune.</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Unsere Touren gibt es gratis zum Selberlaufen. Wer lieber mit einem Menschen unterwegs ist, fragt hier eine
        private Führung {cityName ? `in ${cityName} ` : ""}für die eigene Gruppe an. Die Route steht dabei nicht fest:
        Sie richtet sich nach dem, was der Tag bringt.
      </p>

      <section className="mt-12" aria-labelledby="anpassen">
        <h2 id="anpassen" className="font-display text-2xl font-extrabold tracking-tight text-cream">Was der Guide unterwegs anpasst</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {adapts.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5">
              <Icon size={22} className="text-signal-600" aria-hidden />
              <h3 className="mt-3 font-display text-xl font-extrabold tracking-tight text-cream">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="anfrage" className="mt-14 grid gap-10 lg:grid-cols-[1fr_300px]" aria-labelledby="anfrage-titel">
        <div>
          <h2 id="anfrage-titel" className="font-display text-2xl font-extrabold tracking-tight text-cream">Führung anfragen</h2>
          <p className="mt-2 mb-5 text-cream-dim">Zwei Minuten, unverbindlich. Wir melden uns mit Vorschlag und Preis.</p>
          <GuideRequestForm cities={cities} tours={formTours} initialCity={preCity} initialTour={preTour?.slug ?? ""} />
        </div>
        <aside className="lg:pt-14">
          <h3 className="kicker">So läuft es</h3>
          <ol className="mt-3 space-y-4 text-sm leading-relaxed text-cream-dim">
            <li><strong className="text-cream">1. Anfrage schicken.</strong> Stadt, Gruppe, worauf ihr Lust habt.</li>
            <li><strong className="text-cream">2. Vorschlag bekommen.</strong> Route, Treffpunkt und fester Preis per E-Mail.</li>
            <li><strong className="text-cream">3. Zusagen und losgehen.</strong> Erst mit deiner Bestätigung ist die Führung gebucht.</li>
          </ol>
          <p className="mt-6 text-sm leading-relaxed text-cream-dim">
            Lieber erst allein schauen? Alle <Link href="/touren" className="font-semibold text-signal-600 hover:text-signal-500">Touren</Link> laufen gratis im Browser.
          </p>
        </aside>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Häufige Fragen</h2>
        <div className="mt-5 space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="card p-5">
              <summary className="cursor-pointer font-semibold text-cream marker:text-signal-400">{f.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
