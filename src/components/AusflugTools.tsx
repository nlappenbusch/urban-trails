import Link from "next/link";
import { CloudSun, Wand2, type LucideIcon } from "lucide-react";

interface Tool {
  href: string;
  icon: LucideIcon;
  title: string;
  text: string;
}

export const TOOLS: Tool[] = [
  { href: "/ausfluege/heute", icon: CloudSun, title: "Was machen wir heute?", text: "Drei Ausflüge, die heute klappen – mit Wetter, Zug und offenen Türen." },
  { href: "/ausfluege/planen", icon: Wand2, title: "Selbst zusammenstellen", text: "Dauer, Begleitung, Lust – und das Programm steht in Sekunden." },
];

/** Einstiege in die Werkzeuge rund um Ausflüge. */
export default function AusflugTools({ exclude }: { exclude?: string }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
