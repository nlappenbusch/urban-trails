# 🥾 Urban Trails Switzerland

**Selbstgeführte Premium-Walking-Touren durch die Schweiz** – Audio-Stories
wie ein guter Podcast, Geheimtipps mit Adresse, Social-Check pro Spot und
ein KI-Guide für unterwegs. Live: **https://urban-trails.ch**

> «Die Stadt ist kein Museum.» – Netflix + Komoot + Rick Steves, für Leute,
> die Vibes suchen statt Sehenswürdigkeiten.

## Was drinsteckt

- **22 komplett ausgearbeitete Touren in 15 Destinationen** (Zürich, Luzern,
  Bern, Basel, Genf, Lausanne, Lugano, St. Gallen, Thun, Chur, Winterthur,
  Rapperswil, Baden, Eglisau, Regensberg) – jede mit GPS-Stops, Gehzeiten,
  Stories, Fun Facts, Insider-Tipps mit echter Adresse, Fotospots
- **8 Erlebnis-Kategorien**: Urban Vibes, Natur & Escape, Food Discovery,
  People & Social, Hidden Gems, Sunset Walks, ADHS Quick, Story Mode
- **Audio-Guides** pro Stop (60–120 s): Datei-Cache → ElevenLabs →
  Gemini-TTS (Vertex) → Browser-Fallback; Warmup-Route zum Vorgenerieren
- **Tour-Modus** wie eine App: Fortschritt (localStorage), GPS-Distanz,
  «Du bist hier»-Erkennung, Sticky-Bar mit Mini-Player, Vollbild-Live-Karte
  mit Standort-Tracking, Audio direkt von den Karten-Pins
- **Mapbox**-Karten mit echten Fusswegen (Directions API), **KI-Guide**
  («Frag deinen Guide», OpenAI), SEO (JSON-LD TouristTrip/FAQ, Sitemap)

## Stack

Next.js 15 (App Router, SSG, standalone) · TypeScript · Tailwind CSS ·
Mapbox GL · Gemini TTS / ElevenLabs · Docker

## Lokal entwickeln

```bash
npm install
cp .env.example .env.local   # Keys eintragen (siehe unten)
npm run dev                  # http://localhost:3000
```

| Variable | Zweck |
|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Karten (pk.…) |
| `GEMINI_API_KEY` / `GEMINI_TTS_VOICE` | Audio-TTS (Vertex Express) |
| `ELEVENLABS_API_KEY` / `…_VOICE_ID` | optional, hat Vorrang |
| `OPENAI_API_KEY` | optional, KI-Guide |
| `NEXT_PUBLIC_PREFER_TTS` | 1 = einheitliche TTS-Stimme |
| `NEXT_PUBLIC_SITE_URL` | Canonical/Sitemap-Domain |

## Content erweitern

Neue Tour = eine Datei in `src/data/tours/` (Typ `Tour`, siehe
`src/lib/types.ts`) + Registry-Eintrag in `src/lib/tours.ts` +
ggf. Destination in `src/data/destinations.ts`. Bilder: `src/data/images.ts`
(Wikimedia Commons mit Credit). Audio entsteht automatisch.

## Deployment

`git push` auf `main` deployed automatisch (GitHub Actions self-hosted
Runner → `deploy.sh` → `docker compose up -d --build`, hinter Nginx Proxy
Manager). Komplette Anleitung inkl. Troubleshooting: **SERVER-SETUP.md**

Nach grösseren Audio-Änderungen einmalig Cache füllen:
`curl "http://127.0.0.1:8083/api/audio/warmup?limit=64"` (wiederholen bis
`remaining: 0`).

---

Fotos: Wikimedia Commons (CC, Credit am Bild) · Karten: © Mapbox/OSM ·
Made with viel Fussweg in Zürich.
