# Urban Trails Switzerland

Selbstgeführte Premium-Walking-Touren mit Storytelling-Audioguides, interaktiver Karte, Geheimtipps und KI-Guide. Gebaut mit Next.js 15 (App Router), TypeScript und Tailwind CSS – als Plattform für beliebig viele Städte.

## Schnellstart

```bash
npm install
cp .env.example .env.local   # Keys eintragen (optional, läuft auch ohne)
npm run dev                  # http://localhost:3000
```

Die Seite funktioniert komplett ohne API-Keys: Die Karte zeigt dann einen Platzhalter, Audio nutzt die Browser-Vorlesestimme. Mit Keys wird daraus das volle Produkt:

| Key | Wofür | Woher |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Interaktive Karte mit Route + Markern | [account.mapbox.com](https://account.mapbox.com/access-tokens/) (gratis bis 50k Loads/Monat) |
| `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` | Studio-Qualität-Audioguides | [elevenlabs.io](https://elevenlabs.io) |
| `OPENAI_API_KEY` | «Frag deinen Guide» (`POST /api/guide`) | [platform.openai.com](https://platform.openai.com) |

## Architektur

```
src/
├── app/
│   ├── page.tsx                  Startseite (Hero, Touren, Destinationen)
│   ├── touren/                   Übersicht aller Touren
│   ├── ueberrasche-mich/         Abenteuer-Generator (Zeit + Mood → Tour)
│   ├── [city]/                   Stadtseite (z.B. /zuerich)
│   │   └── [tour]/               Tour-Detailseite mit Karte, Timeline, Audio, FAQ, JSON-LD
│   ├── api/audio/                ElevenLabs-TTS-Proxy (Fallback: Browser-TTS)
│   ├── api/guide/                KI-Guide (OpenAI, mit Tour-Kontext)
│   ├── sitemap.ts / robots.ts    SEO
│   └── layout.tsx                Root-Layout + Default-Metadata
├── components/                   Header, Footer, TourCard, TourMap, AudioPlayer, StopTimeline, SurpriseMe
├── data/
│   ├── destinations.ts           Städte (Zürich live, weitere als comingSoon)
│   └── tours/                    Eine Datei pro Tour – reiner Content, kein Code
└── lib/
    ├── types.ts                  Datenmodell (Destination → Tour → Stop)
    ├── tours.ts                  Registry, Helpers, Empfehlungslogik
    └── seo.ts                    JSON-LD (TouristTrip + FAQPage), URLs
```

## Neue Tour / neue Stadt hinzufügen

1. Stadt in `src/data/destinations.ts` ergänzen (oder `comingSoon` entfernen).
2. Neue Datei `src/data/tours/<slug>.ts` nach dem Muster der bestehenden Touren anlegen.
3. Tour in `src/lib/tours.ts` im `tours`-Array registrieren.

Fertig – Routen, Sitemap, SEO und Karten entstehen automatisch.

## Audio mit ElevenLabs produzieren

Jeder Stop hat ein fertiges deutsches Audioguide-Skript (60–120 Sek.), sichtbar auf der Tour-Seite unter «Audioguide-Skript lesen». Zwei Wege:

1. **Automatisch:** Keys in `.env.local`, der Player generiert on-the-fly über `/api/audio`. Für Produktion: Ergebnisse cachen (S3/Supabase Storage) – ElevenLabs rechnet pro Zeichen ab.
2. **Manuell:** Skript kopieren, in ElevenLabs einfügen. Empfohlene Settings stehen in `src/app/api/audio/route.ts` (stability 0.55, style 0.35, `eleven_multilingual_v2`). Stimmen-Brief: warm, ruhig, neugierig – wie ein moderner Reise-Podcast, Schweizer Ortsnamen natürlich aussprechen.

## SEO

Pro Tour: eigene URL, Meta-Title/-Description, Keywords, OpenGraph, FAQ und Schema.org JSON-LD (`TouristTrip` + `FAQPage`). Sitemap und robots.txt werden generiert. Für Produktion `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen.

## Monetarisierung (vorbereitet)

Das Datenmodell kennt `isPremium` + `priceChf`; Cards und Tour-Seiten zeigen Gratis/Premium-Badges. Nächste Schritte für echten Verkauf: Auth (Supabase), Stripe Checkout, Gating der Stop-Inhalte ab Stop 3 für Nicht-Käufer, Affiliate-Links bei den `nearby`-Empfehlungen.

## Roadmap-Ideen

V1 (dieses Repo): 3 Zürich-Touren, Karte, Audio, SEO, Überrasche-mich.
V2: Stripe + Supabase, Audio-Caching, Fortschritt («4/12 Stops») mit Geolocation.
V3: Weitere Städte (Winterthur, Baden, Luzern), Badges/Gamification.
V4: «Frag deinen Guide» als Chat-UI auf der Tour-Seite, dynamische Routenkürzung.
V5: White-Label für Tourismusbüros & Hotels.
