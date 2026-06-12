import type { Tour } from "@/lib/types";

export const ichMussMalRaus: Tour = {
  slug: "ich-muss-mal-raus",
  citySlug: "zuerich",
  category: "natur-escape",
  name: "Ich muss mal raus",
  claim: "Wald, Grat, Weitblick, Sonnenuntergang – der Reset-Knopf für Tage vor dem Bildschirm.",
  teaser:
    "Die Anti-Bildschirm-Tour: Mit der Bahn auf den Uetliberg, über den Gratweg zur Felsenegg, Sonnenuntergang über dem See – und mit der Seilbahn zurück ins Tal.",
  description:
    "Diese Tour ist für genau einen Satz gebaut: «Ich muss mal raus.» Kein Museum, keine Gassen, keine Menschenmassen – stattdessen Zürichs Hausberg in seiner besten Form. Die Uetlibergbahn zieht dich in zwanzig Minuten aus dem Stadtlärm auf 800 Meter, oben wartet der Blick über Stadt, See und Alpen, danach führt der Gratweg zwei Stunden über den Albisgrat: Wald links, Seeblick rechts, dazwischen ein Planetensystem im Massstab eins zu einer Milliarde. Finale auf der Felsenegg mit Sonnenuntergang über dem Zürichsee – und statt müdem Abstieg schwebst du mit der Seilbahn nach Adliswil hinunter. Kopf leer, Akku voll.",
  moods: ["natur", "ruhe", "aussicht"],
  audience:
    "Bildschirmarbeiter, Kopf-Voll-Menschen, Feierabend-Flüchter – alle, die heute keine Stadt mehr sehen können.",
  vibe: "Wald, Weite, Wind – entschleunigt, aber mit Gipfelgefühl.",
  bestTimeOfDay: "Start ca. 3 Stunden vor Sonnenuntergang – das Finale auf der Felsenegg fällt in die goldene Stunde.",
  bestSeason: "Ganzjährig – im Herbst über dem Nebelmeer am magischsten, im Winter mit Schnee.",
  difficulty: "mittel",
  durationMinutes: 180,
  distanceKm: 7.5,
  startPoint: "Bergstation Uetliberg (S10 ab Zürich HB)",
  endPoint: "Felsenegg → Luftseilbahn nach Adliswil (S4 zurück)",
  publicTransport: {
    start: "S10 ab Zürich HB bis Endstation Uetliberg (ca. 20 Min.)",
    end: "Luftseilbahn Felsenegg–Adliswil (ZVV!), dann S4 Richtung HB",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1d4a2a", "#ff7a3d"],
  seo: {
    metaTitle: "Uetliberg–Felsenegg: Die «Ich muss mal raus»-Tour mit Audioguide | Urban Trails",
    metaDescription:
      "Zürichs schönste Feierabend-Flucht: Uetlibergbahn, Aussichtsturm, Planetenweg über den Albisgrat und Sonnenuntergang auf der Felsenegg. 7.5 km, 6 Stops, mit Karte und Audio-Stories.",
    keywords: [
      "Uetliberg Wanderung",
      "Uetliberg Felsenegg Planetenweg",
      "Zürich Natur Tour",
      "Zürich Sonnenuntergang Berg",
      "Feierabend Wanderung Zürich",
    ],
  },
  faq: [
    {
      question: "Wie anstrengend ist die Tour?",
      answer:
        "Moderat: Der Aufstieg übernimmt die Bahn, der Gratweg ist breit und sanft hügelig. 7.5 km in normalen Turnschuhen machbar – nach Regen kann es stellenweise matschig sein.",
    },
    {
      question: "Fährt die Seilbahn am Abend noch?",
      answer:
        "Die Luftseilbahn Adliswil–Felsenegg fährt in der Regel bis in den Abend (im Sommer länger) – Betriebszeiten vor dem Start kurz auf zvv.ch prüfen. Notfalls führt ein Fussweg nach Adliswil hinunter.",
    },
    {
      question: "Kann ich oben essen?",
      answer:
        "Ja – Restaurant auf Uto Kulm und auf der Felsenegg. Schöner: Picknick und Getränk im Rucksack, gegessen wird am Aussichtspunkt.",
    },
    {
      question: "Geht die Tour auch mit wenig Zeit?",
      answer:
        "Kurzversion: Uetliberg–Turm–zurück mit der S10 dauert gut eine Stunde. Aber der Gratweg ist der eigentliche Reset – nimm dir die drei Stunden.",
    },
    {
      question: "Lohnt sich die Tour bei Nebel?",
      answer:
        "Gerade dann! Im Herbst liegt Zürich oft unter der Nebeldecke – oben: Sonne, unten: Wattemeer. Webcam auf utokulm.ch checken.",
    },
  ],
  stops: [
    {
      id: "uetliberg-bahn",
      name: "Bergstation Uetliberg",
      teaser: "20 Minuten ab HB – und die Stadt ist weg.",
      coords: { lat: 47.3536, lng: 8.4884 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 5,
      why: "Der schnellste Tapetenwechsel der Schweiz: vom Hauptbahnhof direkt in den Bergwald.",
      story:
        "Die Uetlibergbahn klettert seit 1875 auf Zürichs Hausberg – mit bis zu 79 Promille Steigung eine der steilsten Adhäsionsbahnen Europas, ganz ohne Zahnrad. Was als Ausflugs-Attraktion für die feine Gesellschaft begann, ist heute Zürichs offizielles Ventil: Wenn die Stadt zu eng wird, nimmt man die S10.",
      funFact:
        "Die Bahn überwindet auf 9 km rund 470 Höhenmeter – und gehört trotzdem zum normalen ZVV-Tarif. Der günstigste «Bergurlaub» des Landes.",
      insiderTip:
        "Im Zug rechts sitzen: Ab halber Höhe öffnet sich der Blick über die Stadt.",
      photoSpot: "Gleisende mit Turm im Hintergrund – das «Gipfelbahnhof»-Gefühl.",
      audioScript:
        "Tür auf, tief einatmen – riechst du das? Wald statt Abgas, und es ist messbar ein paar Grad kühler als unten. Du bist auf gut achthundert Metern, zwanzig Minuten vom Hauptbahnhof entfernt, und genau diese Zahl macht den Uetliberg so besonders: Es gibt kaum eine Grossstadt der Welt, die ihren Hausberg so schnell und so billig erreicht – die Bahn hier fährt seit 1875 und gehört einfach zum normalen Stadttarif. Sie klettert ohne Zahnrad, nur mit Haftreibung, eine der steilsten Strecken Europas. Heute lassen wir den Bildschirm-Tag hinter uns: erst auf den Gipfel mit Turm und Panorama, dann zwei Stunden über den Grat – Wald, Lichtungen, Seeblick – bis zur Felsenegg, wo die Sonne für dich untergeht. Kein Programm, keine Pflichttermine. Nur laufen. Los geht's, der Gipfel ist zehn Minuten entfernt.",
    },
    {
      id: "uto-kulm",
      name: "Uto Kulm & Aussichtsturm",
      teaser: "871 m: Stadt, See und Alpen in einem 360°-Schwenk.",
      coords: { lat: 47.3497, lng: 8.4922 },
      walkMinutesFromPrevious: 10,
      directions: "Der breiten Kieswegspur bergauf folgen – dem Strom nach, verlaufen unmöglich.",
      stayMinutes: 25,
      why: "Der klassische Zürich-Überblick – einmal alles sehen, worauf du nachher hinunterläufst.",
      story:
        "Uto Kulm, der Gipfel des Uetlibergs: Schon die Kelten hatten hier oben eine Befestigung, im Mittelalter stand eine Burg, heute ein Hotel und der 30 Meter hohe Aussichtsturm. Von der Plattform reicht der Blick an klaren Tagen von den Glarner Alpen über den ganzen Zürichsee bis zu den Jurahöhen – und im Herbst schwebst du hier regelmässig über einem geschlossenen Nebelmeer.",
      funFact:
        "Der Fernsehturm nebenan misst 187 Meter – steht aber so weit oben, dass seine Spitze der höchste Punkt im Umkreis von vielen Kilometern ist.",
      insiderTip:
        "Die Turm-Plattform kostet ein paar Franken und lohnt sich – aber der Gratis-Blick von der Kante vor dem Hotel ist fast genauso gut. Im Herbst: Nebelmeer-Webcam vorher checken.",
      photoSpot: "Turmplattform Richtung See – oder von der Wiese mit Turm-Silhouette im Gegenlicht.",
      audioScript:
        "Da ist er, der Blick. Nimm dir einen Moment: Unter dir liegt die ganze Stadt – die Gleise, die du heute Morgen vielleicht noch genervt entlanggependelt bist, sehen von hier aus aus wie Modellbau. Dahinter der See, und am Horizont, wenn der Tag klar ist, die Alpen vom Säntis bis zu den Glarnern. Menschen stehen seit Jahrtausenden genau hier oben und schauen genau das an: Die Kelten bauten auf diesem Gipfel eine Wallanlage, im Mittelalter wachte eine Burg, heute tut es ein Aussichtsturm. Dreissig Meter Stahl, ein paar Franken Eintritt, dreihundertsechzig Grad Panorama. Und im Herbst passiert hier das Schönste, was dieser Berg kann: Zürich versinkt im Nebel, und du stehst in der Sonne über einem weissen Meer, aus dem nur Bergspitzen ragen. Schau dir alles gut an – und dann dreh der Stadt den Rücken zu. Ab jetzt gehört der Nachmittag dem Grat.",
    },
    {
      id: "fallaetsche",
      name: "Fallätsche",
      teaser: "Zürichs wilde Seite: ein Erosionskessel wie aus den Dolomiten.",
      coords: { lat: 47.3402, lng: 8.4961 },
      walkMinutesFromPrevious: 25,
      directions: "Dem Gratweg Richtung Felsenegg folgen (Wegweiser «Planetenweg/Felsenegg») – nach gut 20 Minuten öffnet sich links der Kessel.",
      stayMinutes: 10,
      why: "Der überraschendste Anblick des Albisgrats – eine Steilwand-Arena mitten im Wald.",
      isHiddenGem: true,
      story:
        "Plötzlich reisst der Wald auf: Die Fallätsche ist ein gewaltiger Erosionskessel, den das Wasser über Jahrtausende in die Nagelfluh- und Mergelschichten des Berges gefressen hat. Steile Kiesflanken, karge Rippen, fast alpine Anmutung – Geologen lieben den Ort, weil hier der Aufbau des ganzen Berges offenliegt wie in einem Schnittmodell.",
      funFact:
        "Der Kessel «wandert» rückwärts: Jedes Gewitter nagt weiter am Hang – pro Jahrhundert frisst sich die Fallätsche messbar in den Grat hinein.",
      insiderTip:
        "Bei der Kante kurz still sein: Im Kessel brüten Vögel, die du im Wald nie hörst – und das Echo ist verblüffend.",
      photoSpot: "Von der Gratkante in den Kessel – mit Person am Rand für den Massstab.",
      audioScript:
        "Stopp – und schau nach links. Damit hast du nicht gerechnet, oder? Mitten im sanften Zürcher Hügelwald reisst der Boden auf, und du stehst an der Kante eines riesigen Kessels aus steilen Kiesflanken und kargen Rippen. Das ist die Fallätsche – Zürichs heimliches Stück Dolomiten. Kein Bagger war hier am Werk, nur Wasser und Zeit: Über Jahrtausende hat sich der Regen in die weichen Schichten des Berges gefressen und diese Arena ausgehöhlt. Und sie wächst weiter – jedes Gewitter nagt ein Stückchen mehr, der Kessel frisst sich langsam rückwärts in den Grat, auf dem du gerade stehst. Keine Sorge: In deinem Tempo gemessen hast du noch ein paar Jahrhunderte. Geologen pilgern hierher, weil der Berg an dieser Wunde sein Innerstes zeigt. Für dich ist es vor allem eins: der Beweis, dass «raus» manchmal näher liegt, als man denkt. Weiter geht's – ab jetzt begleiten dich die Planeten.",
    },
    {
      id: "planetenweg",
      name: "Planetenweg über den Grat",
      teaser: "Vom Mars bis zum Saturn in Wanderschuhen – das Sonnensystem im Massstab 1:1 Milliarde.",
      coords: { lat: 47.3305, lng: 8.501 },
      walkMinutesFromPrevious: 20,
      directions: "Einfach auf dem Gratweg bleiben – die Planeten-Stationen tauchen am Wegrand auf.",
      stayMinutes: 10,
      why: "Der charmanteste Wanderweg-Gag der Schweiz – und nebenbei die beste Lektion über kosmische Distanzen.",
      story:
        "Auf dem Grat zwischen Uetliberg und Felsenegg ist das Sonnensystem aufgebaut – im Massstab eins zu einer Milliarde: Ein Meter Weg entspricht einer Million Kilometern. Die Sonne hängt als goldene Kugel beim Uetliberg, die inneren Planeten folgen nach wenigen Schritten, dann wird es einsam: Bis zum Saturn läufst du über eine Stunde. Nichts macht die Leere des Alls so begreifbar wie müde Beine.",
      funFact:
        "In diesem Massstab läufst du mit etwa vierfacher Lichtgeschwindigkeit – das Licht braucht für die Strecke Sonne–Erde acht Minuten, du schaffst das Modell in zwei.",
      insiderTip:
        "Bei den Stationen die Grössen vergleichen: Die Erde ist eine Murmel, der Jupiter ein Handball – und dazwischen liegt fast nichts. Bester Smalltalk-Stoff für Wochen.",
      photoSpot: "Saturn-Station mit Grat und Seeblick – Wissenschaft mit Aussicht.",
      audioScript:
        "Falls dir eben eine goldene Kugel auf einer Stele aufgefallen ist: Du bist gerade an der Sonne vorbeigelaufen. Willkommen auf dem Planetenweg – das komplette Sonnensystem, aufgebaut im Massstab eins zu einer Milliarde. Ein Meter auf diesem Weg ist eine Million Kilometer im All. Merkur, Venus, Erde, Mars – die kommen schnell, ein paar Dutzend Schritte. Und dann? Dann kommt lange: nichts. Genau das ist der Punkt. Zwischen Mars und Jupiter liegt eine halbe Stunde Fussweg, und bis zum Saturn wirst du noch eine gute Stunde wandern. Nichts – kein Buch, kein Planetarium – macht die absurde Leere des Weltalls so körperlich begreifbar wie dieser Weg. Übrigens bewegst du dich gerade mit vierfacher Lichtgeschwindigkeit, im Modellmassstab jedenfalls – das darfst du heute Abend ruhig so erzählen. Lass die Gedanken laufen. Das hier ist der meditative Teil der Tour: Wald, Schritte, Planeten. Der Bildschirm von heute Morgen ist jetzt ungefähr so weit weg wie Neptun.",
    },
    {
      id: "felsenegg",
      name: "Felsenegg",
      teaser: "Das Finale: Sonnenuntergang über dem Zürichsee – mit Beiz in Rufweite.",
      coords: { lat: 47.3146, lng: 8.5121 },
      walkMinutesFromPrevious: 50,
      directions: "Dem Gratweg bis zum Wegweiser «Felsenegg» folgen – die Aussichtskanzel liegt kurz vor der Seilbahn.",
      stayMinutes: 40,
      why: "Einer der besten Sonnenuntergangs-Punkte des Kantons – der See liegt dir golden zu Füssen.",
      story:
        "Die Felsenegg ist die Belohnung: eine Aussichtskanzel hoch über dem Zürichsee, der sich von hier in voller Länge zeigt – vorne Thalwil und Rüschlikon, hinten die Glarner Alpen. Daneben das Bergrestaurant für den Schlusstrunk. Wenn die Sonne hinter dir den Himmel über dem See orange färbt, weisst du, warum diese Tour «Ich muss mal raus» heisst – und warum sie hier endet.",
      funFact:
        "Die Felsenegg-Kanzel ist ein beliebter Start für Gleitschirmflieger – mit etwas Glück schweben beim Sonnenuntergang bunte Schirme vor dem Panorama.",
      insiderTip:
        "Getränk fürs Finale im Rucksack mitbringen und auf die Kanzel setzen – die Restaurant-Terrasse ist schön, aber die Kante ist Kino.",
      photoSpot: "Von der Kanzel über den See zur goldenen Stunde – das Bild, für das du losgelaufen bist.",
      audioScript:
        "Geschafft. Setz dich an die Kante, pack das Getränk aus, das du hoffentlich dabei hast – und schau. Unter dir liegt der ganze Zürichsee, von Thalwil bis zur Halbinsel Au, und wenn dein Timing stimmt, beginnt jetzt das Farbenspiel: Erst wird das Wasser silbern, dann golden, dann brennt der Himmel. Mit etwas Glück ziehen Gleitschirme vor dem Panorama vorbei – die Felsenegg ist einer ihrer Lieblingsstartplätze. Denk kurz zurück: Vor drei Stunden sassest du noch in der Stadt, Kopf voll, Schultern oben. Dazwischen lagen ein Gipfel, ein wilder Erosionskessel, ein komplettes Sonnensystem und ein paar tausend Schritte Wald. Das ist der ganze Trick dieser Tour – sie ist kein Sightseeing, sie ist Wartung für den Kopf. Wenn die Sonne weg ist: Zwei Minuten weiter wartet die Seilbahn und schwebt dich nach Adliswil hinunter, die S4 bringt dich zurück. Und das Beste? Der Berg bleibt hier. Nächstes Mal, wenn du raus musst: Du weisst jetzt, wohin.",
      nearby: [
        {
          name: "Bergrestaurant Felsenegg",
          type: "restaurant",
          note: "Terrasse mit Seeblick – für alle, die das Finale lieber mit warmem Essen feiern.",
          address: "Felseneggstrasse 55, 8134 Adliswil",
        },
      ],
    },
    {
      id: "felseneggbahn",
      name: "Luftseilbahn nach Adliswil",
      teaser: "Der schönste Abstieg ist keiner: schwebend ins Tal.",
      coords: { lat: 47.3115, lng: 8.5197 },
      walkMinutesFromPrevious: 3,
      directions: "Vom Aussichtspunkt dem Wegweiser «LAF / Seilbahn» folgen.",
      stayMinutes: 10,
      why: "Müde Beine schonen, letzten Blick geniessen – und die Bahn gehört sogar zum ZVV.",
      story:
        "Seit 1954 verbindet die Luftseilbahn Adliswil–Felsenegg (LAF) das Sihltal mit dem Grat – als einzige Luftseilbahn im ZVV-Gebiet fährst du mit dem normalen Zonenticket. Fünf Minuten Schwebeflug über Wald und Wiesen, unten wartet die S4 zurück in die Stadt. Besserer Abspann ist nicht verfügbar.",
      funFact:
        "Die LAF ist die einzige Luftseilbahn im gesamten Zürcher Verkehrsverbund – dein normales Abo gilt, als wäre sie ein Bus.",
      insiderTip:
        "In der Kabine talseitig stehen: Beim Abschweben öffnet sich noch einmal das Sihltal-Panorama – letzter Foto-Moment der Tour.",
      photoSpot: "Aus der Kabine über das Sihltal, kurz nach der Bergstation.",
      audioScript:
        "Und jetzt die eleganteste Pointe dieser Tour: Du musst nicht mehr runterlaufen. Die rote Kabine vor dir ist die Luftseilbahn nach Adliswil, seit 1954 in Betrieb – und die einzige Luftseilbahn im ganzen Zürcher Verkehrsverbund. Heisst: Dein ganz normales Ticket gilt, als wärst du in einem Bus. Bist du aber nicht. Fünf Minuten schwebst du gleich lautlos über Baumwipfel und Wiesen ins Sihltal hinunter, während hinter dir der Grat im Abendlicht verschwindet. Unten in Adliswil bringt dich die S-Bahn zurück in die Stadt – dieselbe Stadt wie heute Morgen, aber du bist nicht mehr derselbe Pendler. Kopf leer, Beine angenehm schwer, Speicher voller Bilder. Das war «Ich muss mal raus». Funktioniert übrigens beliebig oft – der Berg hat immer offen. Gute Heimfahrt!",
    },
  ],
};
