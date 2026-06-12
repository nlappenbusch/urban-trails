import Link from "next/link";

/**
 * Marke: App-Icon-Tile mit Höhenlinien (Topo), gepunkteter Route vom
 * Startpunkt zum klassischen Map-Pin. Route wandert beim Hover
 * (.logo-route in globals.css).
 */
export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="shrink-0 drop-shadow-sm transition duration-300 group-hover:-rotate-6 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="utTile" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6a1f" />
            <stop offset="100%" stopColor="#e83a00" />
          </linearGradient>
          <clipPath id="utClip">
            <rect width="40" height="40" rx="11" />
          </clipPath>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#utTile)" />
        {/* Höhenlinien wie auf der Wanderkarte */}
        <g clipPath="url(#utClip)" stroke="#fff" strokeOpacity="0.16" fill="none" strokeWidth="1.3">
          <path d="M-4 12 C 8 6, 18 16, 28 10 S 42 4, 46 8" />
          <path d="M-4 20 C 8 14, 20 24, 30 18 S 44 12, 48 16" />
          <path d="M-4 30 C 10 24, 18 34, 30 28 S 44 24, 48 28" />
        </g>
        {/* Startpunkt */}
        <circle cx="9.5" cy="31" r="2.8" fill="#fff" />
        {/* Route zum Pin */}
        <path
          d="M9.5 31 C 17 29, 13 22, 20 19.5 S 26.5 17.5, 27 14.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="logo-route"
        />
        {/* Map-Pin (Tropfenform) */}
        <path
          d="M27 3.5c-3.6 0-6.5 2.9-6.5 6.5 0 4.9 6.5 11 6.5 11s6.5-6.1 6.5-11c0-3.6-2.9-6.5-6.5-6.5z"
          fill="#fff"
        />
        <circle cx="27" cy="10" r="2.6" fill="#e83a00" />
      </svg>
      <span className="font-display text-base font-extrabold leading-[0.92] tracking-tight text-cream">
        URBAN
        <br />
        TRAILS
        <span className="ml-1.5 inline-block -translate-y-px rounded-sm bg-signal-500 px-1 py-px align-middle text-[9px] font-bold tracking-widest text-white">
          CH
        </span>
      </span>
    </Link>
  );
}
