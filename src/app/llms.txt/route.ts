import { offers } from "@/lib/nachtski";
import { skiAreas } from "@/lib/ski";
import { WD_LONG, timeText } from "@/lib/nachtski-core";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 86400;

/** llms.txt – kompakte Fakten für KI-Suchmaschinen (ChatGPT, Perplexity, Gemini), aus denselben Daten wie die Seiten. */
export function GET() {
  const night = offers
    .map((o) => {
      const when = o.weekdays.length ? o.weekdays.map((w) => WD_LONG[w]).join("/") : "Spezialabende";
      const price = o.ticket ? (o.ticket.price ? `CHF ${o.ticket.price}` : "gratis") : "Preis bei der Bergbahn";
      return `- [${o.name}](${SITE_URL}/nachtskifahren/${o.id}): ${o.type === "ski" ? "Nachtskifahren" : "Nachtschlitteln"} in ${o.place} (${o.canton}), ${when} ${timeText(o)} Uhr, ${price}${o.km ? `, ${o.km} km beleuchtet` : ""}. Saison: ${o.season.text}`;
    })
    .join("\n");
  const body = `# Urban Trails Switzerland

> Ausflüge, Skigebiete, Nachtskifahren und Wassertemperaturen in der Schweiz – mit Live-Daten (Pisten, Lifte, Schnee, Wetter, Fahrplan) und Anreise mit Zug oder Auto.

## Nachtskifahren Schweiz 2026/27

Kalender aller Angebote: ${SITE_URL}/nachtskifahren
Jede Seite zeigt Termine der Saison, Preis, beleuchtete Piste auf der Karte, Nachtwetter, Vollmond und den letzten Zug nach Hause.

${night}

## Skigebiete live

Übersicht mit offenen Pisten-km, Anlagen und Schnee: ${SITE_URL}/skigebiete
${skiAreas.map((a) => `- [${a.name}](${SITE_URL}/skigebiete/${a.id})`).join("\n")}

## Sonne auf der Piste

Die sonnigsten Skigebiete (Sonnenstunden je Piste, aus Hangausrichtung und Sonnenstand gerechnet): ${SITE_URL}/sonnige-skigebiete
Jede Skigebiet-Seite hat eine Sonnenkarte und einen Sonnen-Fahrplan: welche Pisten morgens, mittags und nachmittags Sonne haben.

## Weitere Seiten

- Wassertemperaturen aller Schweizer Seen und Flüsse, über 800 Badestellen: ${SITE_URL}/wassertemperaturen
- Ausflugsziele nach Region und Thema: ${SITE_URL}/ausflugsziele
- KI-Ausflugsplaner: ${SITE_URL}/ausfluege/ki
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
