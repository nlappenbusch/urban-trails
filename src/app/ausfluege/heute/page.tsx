import type { Metadata } from "next";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import HeuteFinder from "@/components/HeuteFinder";
import Brotkrumen from "@/components/Brotkrumen";

const TITLE = "Was machen wir heute? Ausflug für heute finden – mit Wetter und Zug";
const DESC =
  "Startort eingeben, Tag wählen: Urban Trails schlägt drei Ausflüge vor, die heute wirklich gehen – mit aktuellem Wetter, nächster Zugverbindung und nur Orten, die offen haben.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/ausfluege/heute" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/ausfluege/heute" }),
};

export default function HeutePage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflüge", path: "/ausfluege" }, { name: "Heute", path: "/ausfluege/heute" }])) }}
      />
      <Brotkrumen items={[{ label: "Ausflüge", href: "/ausfluege" }, { label: "Heute" }]} />
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">
        Was machen wir <em>heute?</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        Drei Vorschläge, die heute wirklich klappen: Wir schauen aufs Wetter, suchen den nächsten Zug und nehmen nur Orte, die offen haben.
      </p>
      <div className="mt-10">
        <HeuteFinder />
      </div>
    </div>
  );
}
