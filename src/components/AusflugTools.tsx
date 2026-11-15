import Link from "next/link";
import { CloudSun, Dices, Gift, MapPinned, MountainSnow, Sparkles, Wand2, Waves, type LucideIcon } from "lucide-react";

interface Tool {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
}

export const TOOLS: Tool[] = [
  { href: "/ausfluege/ki", icon: Sparkles, title: "KI-Planer", text: "Sag in eigenen Worten, was ihr wollt – das Programm steht in Sekunden." },
  { href: "/ausfluege/heute", icon: CloudSun, title: "Was machen wir heute?", text: "Drei Ausflüge, die heute klappen – mit Wetter, Zug und offenen Türen." },
  { href: "/ausfluege/planen", icon: Wand2, title: "Selbst zusammenstellen", text: "Dauer, Begleitung, Lust – und das Programm steht in Sekunden." },
  { href: "/ausfluege/ueberraschung", icon: Dices, title: "Überraschungs-Ausflug", text: "Ziel wird ausgelost. Ihr erfahrt nur Gleis, Abfahrt und Packliste." },
  { href: "/ausflugsziele", icon: MapPinned, title: "Alle Ausflugsziele", text: "Jeder Ort geprüft: Preis, Öffnungszeiten, Foto – nach Region und Thema." },
  { href: "/geschenk", icon: Gift, title: "Ausflug verschenken", text: "Karte mit eigenem Text und QR-Code zum Programm. Gratis." },
  { href: "/skigebiete", icon: MountainSnow, title: "Wo kann ich skifahren?", text: "59 Skigebiete: Pisten je Farbe, Schnee, Tageskarte und Zugzeit ab deinem Bahnhof." },
  { href: "/wassertemperaturen", icon: Waves, title: "Wie warm ist das Wasser?", text: "Alle Seen und Flüsse live – Aare, Rhein, Zürichsee und deine Badestelle." },
];

/** Einstiege in die Werkzeuge rund um Ausflüge. */
export default function AusflugTools({ exclude }: { exclude?: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.filter((t) => t.href !== exclude).map(({ href, icon: Icon, title, text }) => (
        <li key={href}>
          <Link href={href} className="card group flex h-full gap-3 p-4 transition hover:border-cream/30">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-signal-500 text-white"><Icon size={19} aria-hidden /></span>
            <span className="min-w-0">
              <span className="block font-display text-base font-extrabold leading-tight tracking-tight text-cream decoration-2 underline-offset-4 group-hover:underline">{title}</span>
              <span className="mt-1 block text-sm leading-snug text-cream-dim">{text}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
