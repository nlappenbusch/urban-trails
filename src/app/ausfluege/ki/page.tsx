import type { Metadata } from "next";
import { Suspense } from "react";
import { breadcrumbJsonLd, socialMeta } from "@/lib/seo";
import KiPlanner from "@/components/KiPlanner";
import AusflugTools from "@/components/AusflugTools";
import Brotkrumen from "@/components/Brotkrumen";

const TITLE = "KI-Ausflugsplaner: Sag, was ihr wollt – das Programm steht";
const DESC = "Beschreib deinen Ausflug in eigenen Worten – mit Kindern, Budget, Wetter, Startbahnhof. Die KI baut ein Programm nur aus geprüften Orten, mit Öffnungszeiten, Preisen und Zugverbindung.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/ausfluege/ki" },
  ...socialMeta({ title: TITLE, description: DESC, path: "/ausfluege/ki" }),
};

export default function KiPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Start", path: "/" }, { name: "Ausflüge", path: "/ausfluege" }, { name: "KI-Planer", path: "/ausfluege/ki" }])) }} />
      <Brotkrumen items={[{ label: "Ausflüge", href: "/ausfluege" }, { label: "KI-Planer" }]} />
      <h1 className="headline mt-3 max-w-3xl text-4xl text-cream sm:text-6xl">Sag einfach, was ihr wollt.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream-dim">
        «Samstag mit zwei Kindern, die lieben Tiere, nicht zu teuer» reicht. Die KI sucht die Region, schaut aufs Wetter und baut ein Programm –
        nur aus Orten, die wir geprüft haben, und nur aus solchen, die an dem Tag offen sind.
      </p>
      <div className="mt-8 max-w-5xl">
        <Suspense>
          <KiPlanner />
        </Suspense>
      </div>
      <section className="mt-16">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-cream">Lieber selbst klicken?</h2>
        <div className="mt-4"><AusflugTools /></div>
      </section>
    </div>
  );
}
