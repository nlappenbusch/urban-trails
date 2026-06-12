import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-7xl">🧭</p>
      <h1 className="mt-6 text-4xl font-extrabold text-white">
        Falsch abgebogen.
      </h1>
      <p className="mt-3 max-w-md text-slate-400">
        Diese Seite gibt es nicht – aber das passiert den Besten. Die schönsten
        Entdeckungen beginnen mit einem Umweg.
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
