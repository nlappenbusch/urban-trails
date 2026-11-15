import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Compass size={56} strokeWidth={1.5} className="text-signal-500" aria-hidden="true" />
      <h1 className="headline mt-6 text-4xl text-cream">
        Falsch abgebogen.
      </h1>
      <p className="mt-3 max-w-md text-cream-dim">
        Diese Seite gibt es nicht. Vielleicht findest du hier, was du suchst:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary">
          Zur Startseite
        </Link>
        <Link href="/touren" className="btn-secondary">
          Alle Touren
        </Link>
      </div>
    </div>
  );
}
