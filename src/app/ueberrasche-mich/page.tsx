import type { Metadata } from "next";
import SurpriseMe from "@/components/SurpriseMe";

export const metadata: Metadata = {
  title: "Überrasche mich – dein Abenteuer-Generator",
  description:
    "Sag uns, wie viel Zeit du hast und wonach dir ist – wir empfehlen dir die perfekte Walking-Tour durch Zürich. Spontan, persönlich, sofort startklar.",
  alternates: { canonical: "/ueberrasche-mich" },
};

export default function SurprisePage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-white">
          Was soll ich <span className="text-sunset-400">heute</span> tun?
        </h1>
        <p className="mt-3 text-slate-400">
          Genau dafür gibt es diese Seite. Zwei Fragen, eine Tour, null
          Planungsaufwand.
        </p>
      </div>
      <div className="mt-10">
        <SurpriseMe />
      </div>
    </div>
  );
}
