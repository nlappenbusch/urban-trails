import type { Destination } from "@/lib/types";

export const destinations: Destination[] = [
  {
    slug: "zuerich",
    name: "Zürich",
    canton: "ZH",
    teaser: "Weltstadt im Taschenformat – Wasser, Gassen, Aussicht und Industrie-Charme.",
    description:
      "Zürich ist klein genug, um alles zu Fuss zu erleben, und gross genug, um dich jedes Mal neu zu überraschen. Zwischen Altstadtgassen, Limmat, Seebecken und dem rauen Charme von Zürich-West liegen Welten – und genau dazwischen verlaufen unsere Trails.",
    center: { lat: 47.3744, lng: 8.5410 },
  },
  {
    slug: "winterthur",
    name: "Winterthur",
    canton: "ZH",
    teaser: "Industriekultur, Museen und überraschend viel Grün.",
    description:
      "Die unterschätzte Schwester Zürichs: alte Sulzer-Hallen, lebendige Altstadt und Aussichtspunkte wie der Eschenbergturm.",
    center: { lat: 47.4997, lng: 8.7241 },
  },
  {
    slug: "luzern",
    name: "Luzern",
    canton: "LU",
    teaser: "Kapellbrücke, See und Bergpanorama – Postkarte mit Geheimgängen.",
    description:
      "Hinter den Postkartenmotiven versteckt sich ein Luzern voller Innenhöfe, Stadtmauern und stiller Quais.",
    center: { lat: 47.0502, lng: 8.3093 },
  },
  {
    slug: "baden",
    name: "Baden",
    canton: "AG",
    teaser: "Bäderquartier, Ruine Stein und die schönste Holzbrücke der Region.",
    description:
      "Thermalquellen seit den Römern, eine Altstadt zum Verlieben und die Limmat immer in Hörweite.",
    center: { lat: 47.4734, lng: 8.3063 },
  },
  {
    slug: "bern",
    name: "Bern",
    canton: "BE",
    teaser: "Lauben, Aare-Schwumm und die gemütlichste Hauptstadt der Welt.",
    description:
      "Sechs Kilometer Lauben, mittelalterliche Gassen, der Bärengraben – und im Sommer treibt die halbe Stadt in der Aare Richtung Marzili.",
    center: { lat: 46.9480, lng: 7.4474 },
  },
  {
    slug: "basel",
    name: "Basel",
    canton: "BS",
    teaser: "Rhein-Schwimmen, Kunst an jeder Ecke und das beste Grenzgefühl Europas.",
    description:
      "Dreiländereck, 40 Museen, Fasnacht und ein Fluss, der als Sommer-Pendlerroute dient – Basel ist Zürichs entspannter Gegenentwurf.",
    center: { lat: 47.5596, lng: 7.5886 },
  },
  {
    slug: "st-gallen",
    name: "St. Gallen",
    canton: "SG",
    teaser: "Weltkulturerbe-Bibliothek, Erker-Pracht und die rote Stadtlounge.",
    description:
      "Die barocke Stiftsbibliothek gehört zum UNESCO-Welterbe, die Innenstadt trägt Erker wie Schmuck – und mitten drin liegt ein knallroter Platz zum Abhängen.",
    center: { lat: 47.4245, lng: 9.3767 },
  },
  {
    slug: "genf",
    name: "Genf",
    canton: "GE",
    teaser: "Jet d'eau, Diplomaten-Dichte und Quartiere mit Pariser Flair.",
    description:
      "Internationale Organisationen, Calvins Erbe und das quirlige Les Grottes – Genf ist die kosmopolitischste Ecke des Landes.",
    center: { lat: 46.2044, lng: 6.1432 },
  },
  {
    slug: "lausanne",
    name: "Lausanne",
    canton: "VD",
    teaser: "Steile Gassen, Olympia-Flair und Seeblick an jeder Ecke.",
    description:
      "Die Stadt der Treppen und Hügel: Flon-Ausgehviertel, Kathedrale, Ouchy am Wasser – Kondition mitbringen, Aussicht kassieren.",
    center: { lat: 46.5197, lng: 6.6323 },
  },
  {
    slug: "lugano",
    name: "Lugano",
    canton: "TI",
    teaser: "Dolce Vita auf Schweizerisch – Piazze, Palmen und Monte Brè.",
    description:
      "Italianità mit Schweizer Taktfahrplan: Seepromenade, Gelato-Kultur und Aussichtsberge direkt ab Stadtrand.",
    center: { lat: 46.0037, lng: 8.9511 },
  },
  {
    slug: "rapperswil",
    name: "Rapperswil",
    canton: "SG",
    teaser: "Rosenstadt mit Schloss, Holzsteg und Seepromenade.",
    description:
      "Das Schloss über dem See, der längste Holzsteg der Schweiz nach Hurden und Altstadtgassen voller Rosen – perfekt für einen halben Tag.",
    center: { lat: 47.2269, lng: 8.8184 },
  },
  {
    slug: "thun",
    name: "Thun",
    canton: "BE",
    teaser: "Alpenpanorama, Schloss und Surfer mitten in der Aare.",
    description:
      "Das Tor zum Berner Oberland: Schloss Thun, die Obere Hauptgasse mit ihren Hochtrottoirs – und an der Mühleschleuse surfen sie auf der Flusswelle.",
    center: { lat: 46.7580, lng: 7.6280 },
  },
  {
    slug: "chur",
    name: "Chur",
    canton: "GR",
    teaser: "Die älteste Stadt der Schweiz – Gassen, Berge, Bündner Gelassenheit.",
    description:
      "5000 Jahre Siedlungsgeschichte, eine autofreie Altstadt und Berge, die direkt hinter dem Bahnhof anfangen.",
    center: { lat: 46.8508, lng: 9.5320 },
  },
];

// Kleinstädte aus dem «Züri zu Fuss»-Port
const kleinstaedte: Destination[] = [
  {
    slug: "regensberg",
    name: "Regensberg",
    canton: "ZH",
    teaser: "Das vergessene Bergstädtchen – Mittelalter komplett, Touristen keine.",
    description:
      "Ein komplettes Mittelalterstädtchen auf einem Hügelsporn im Zürcher Unterland: Rundturm, Schloss, Fachwerk und Reben – 25 Minuten von Zürich.",
    center: { lat: 47.4838, lng: 8.4408 },
  },
  {
    slug: "eglisau",
    name: "Eglisau",
    canton: "ZH",
    teaser: "Bunte Fassaden am Rhein, Weinterrassen und eine Badi im Strom.",
    description:
      "Das südlichste Rheinstädtchen: Häuserzeile direkt am Wasser, Reben über dem Fluss und Kurzferien-Stimmung, 35 Minuten ab Zürich HB.",
    center: { lat: 47.5722, lng: 8.5103 },
  },
];
destinations.push(...kleinstaedte);

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
