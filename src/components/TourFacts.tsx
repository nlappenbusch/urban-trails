import { Clock, Flag, Leaf, MapPin, Mountain } from "lucide-react";
import type { Tour } from "@/lib/types";

/** Infobox der Tourseite: Start, Ende, Zeit, Saison, Schwierigkeit. */
export default function TourFacts({ tour }: { tour: Tour }) {
  const rows = [
    { icon: MapPin, label: "Start", value: tour.startPoint, note: tour.publicTransport.start },
    { icon: Flag, label: "Ende", value: tour.endPoint, note: tour.publicTransport.end },
    { icon: Clock, label: "Beste Zeit", value: tour.bestTimeOfDay },
    { icon: Leaf, label: "Saison", value: tour.bestSeason },
    { icon: Mountain, label: "Schwierigkeit", value: tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1) },
  ];
  return (
    <aside className="card h-fit space-y-4 p-6 text-sm">
      {rows.map(({ icon: Icon, label, value, note }) => (
        <div key={label} className="flex gap-3">
          <Icon size={18} className="mt-0.5 shrink-0 text-signal-600" aria-hidden="true" />
          <div>
            <p className="font-semibold text-cream">{label}</p>
            <p className="text-cream-dim">{value}</p>
            {note && <p className="mt-1 text-xs text-cream-faint">{note}</p>}
          </div>
        </div>
      ))}
    </aside>
  );
}
