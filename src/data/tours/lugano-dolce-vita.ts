import type { Tour } from "@/lib/types";

export const luganoDolceVita: Tour = {
  slug: "lugano-dolce-vita",
  citySlug: "lugano",
  category: "sunset-walks",
  name: "Lugano – Dolce Vita Walk",
  claim: "Piazze, Palmen und ein Renaissance-Paukenschlag – Italianità mit Schweizer Taktfahrplan.",
  teaser:
    "Von der Piazza della Riforma durch die Via Nassa zum berühmtesten Fresko der Schweiz, durch den Parco Ciani ans Wasser – Finale mit Seepromenade im Abendlicht.",
  description:
    "Lugano ist die Schweiz auf Italienisch: Espresso im Stehen, Piazza-Leben, Palmen am See – und pünktliche Busse. Diese Tour nimmt die Stadt im Flanier-Modus: Start auf der Piazza della Riforma, dem Wohnzimmer des Tessins, dann durch die Arkaden der Via Nassa (Luxus links, Gelato rechts) zur Kirche Santa Maria degli Angioli, wo das monumentale Passions-Fresko von Bernardino Luini hängt – der «Sixtinische Moment» der Schweiz. Weiter durch den Parco Ciani, den schönsten Stadtpark des Landes, und der Seepromenade entlang, bis San Salvatore und Monte Brè im Abendlicht glühen. Dolce Vita, helvetisch verlässlich.",
  moods: ["ruhe", "natur", "essen"],
  audience: "Süden-Sehnsüchtige, Geniesser, Park-Flaneure – Lugano belohnt alle, die langsamer werden wollen.",
  vibe: "Mediterran-entspannt – die Tour zum Runterschalten.",
  bestTimeOfDay: "Später Nachmittag – das Finale fällt in die goldene Stunde über dem See.",
  bestSeason: "Ganzjährig mild; Frühling mit Kamelienblüte im Parco Ciani, Sommer mit Bade-Option.",
  difficulty: "leicht",
  durationMinutes: 140,
  distanceKm: 3.8,
  startPoint: "Piazza della Riforma",
  endPoint: "Seepromenade / Belvedere-Garten",
  publicTransport: {
    start: "Ab Bahnhof Lugano mit der Standseilbahn (Funicolare) direkt ins Zentrum",
    end: "10 Min. zu Fuss zurück zur Funicolare",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1f6b4a", "#ffc940"],
  seo: {
    metaTitle: "Lugano zu Fuss: Piazze, Luini-Fresko & Parco Ciani mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Tour durch Lugano: Piazza della Riforma, Via Nassa, das Luini-Fresko in Santa Maria degli Angioli, Parco Ciani und Seepromenade. 6 Stops mit Audio-Stories.",
    keywords: ["Lugano Sehenswürdigkeiten","Lugano Altstadt Rundgang","Santa Maria degli Angioli Luini","Parco Ciani","Lugano Audioguide"],
  },
  faq: [
    { question: "Wann blüht der Parco Ciani am schönsten?", answer: "März/April zur Kamelien- und Magnolienblüte – aber der Park ist dank mildem Klima ganzjährig grün." },
    { question: "Lohnt sich ein Berg dazu?", answer: "Sehr: San Salvatore (Funicolare ab Paradiso) oder Monte Brè ergänzen die Tour perfekt – je +2 bis 3 Stunden." },
    { question: "Sprechen alle Italienisch?", answer: "Ja, aber Deutsch und Englisch funktionieren überall – ein «Buongiorno» wirkt trotzdem Wunder." },
  ],
  stops: [
    {
      id: "piazza-riforma",
      name: "Piazza della Riforma",
      teaser: "Das Wohnzimmer des Tessins – Espresso-Bühne unter Arkaden.",
      coords: { lat: 46.0036, lng: 8.9511 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 15,
      why: "Die schönste Piazza der Schweiz: ockerfarbene Palazzi, Caféterrassen, Mittelmeer-Taktgefühl.",
      story:
        "Die Riforma ist Luganos Bühne seit Jahrhunderten – benannt nach den liberalen Reformen von 1830, gerahmt vom klassizistischen Palazzo Civico. Hier wird jeder Anlass gefeiert, vom Jazz-Festival bis zum Eishockey-Titel; dazwischen regiert das Espresso-Ritual: kurz, stehend, mit Blick auf die Piazza.",
      funFact: "Beim Frühlingsfest wird die Piazza zur Risotto-Küche: Riesige Pfannen, tausende Portionen – Risotto-Ausschank als Volksrecht.",
      insiderTip: "Espresso an der Bar trinken (nicht am Tisch) – halber Preis, doppeltes Lokalgefühl.",
      photoSpot: "Vom Platzrand auf den Palazzo Civico mit Caféterrassen davor.",
      audioScript:
        "Benvenuto in Lugano – und mitten hinein ins Wohnzimmer des Tessins. Die Piazza della Riforma ist das, was Stadtplaner überall auf der Welt zu bauen versuchen und selten schaffen: ein Platz, der von früh bis spät einfach funktioniert. Morgens klappern hier die Espressotassen, mittags kreuzen sich die Wege der halben Stadt, abends übernehmen die Terrassen – und wenn das Tessin etwas zu feiern hat, vom Jazz-Festival bis zum Hockey-Titel, dann genau hier. Die ockerfarbenen Palazzi rundum könnten in Norditalien stehen, der Palazzo Civico gibt den würdevollen Rahmen, aber die Busse am Platzrand fahren auf die Schweizer Minute – das ist der Lugano-Deal: südliches Lebensgefühl mit nördlicher Verlässlichkeit. Erste Lektion gleich hier: Bestell deinen Espresso an der Bar, im Stehen, wie die Einheimischen – kostet die Hälfte und schmeckt nach Zugehörigkeit. Dann lass uns flanieren. Die berühmteste Einkaufsgasse des Tessins wartet.",
      nearby: [
        { name: "Bars an der Riforma", type: "cafe", note: "Espresso al banco – das Ritual zum Tourstart.", address: "Piazza della Riforma, 6900 Lugano" },
      ],
    },
    {
      id: "via-nassa",
      name: "Via Nassa",
      teaser: "Arkaden-Flanieren: Uhren-Vitrinen, Gelato und 700 Jahre Handelsgeschichte.",
      coords: { lat: 46.0023, lng: 8.949 },
      walkMinutesFromPrevious: 3,
      directions: "Von der Piazza südwärts in die Arkadengasse.",
      stayMinutes: 12,
      why: "Die eleganteste Lauben-Gasse südlich der Alpen – Schaufenster-Kino unter Bögen.",
      story:
        "Die Via Nassa folgt der alten Uferlinie – ihr Name kommt von den Fischreusen («nasse»), die hier einst hingen. Heute reihen sich unter den Arkaden Uhren- und Modehäuser, dazwischen halten Gelaterie und Pasticcerie die Balance: Luxus und Alltag teilen sich dieselben Bögen seit Jahrhunderten.",
      funFact: "Unter den Arkaden bleibt man bei jedem Wetter trocken – das mediterrane Pendant zu Berns Lauben, nur mit mehr Sonnenbrillen.",
      insiderTip: "Die Seitengassen zum See hinunter nehmen – alle fünfzig Meter blitzt das Wasser zwischen den Häusern auf.",
      photoSpot: "Arkadenflucht mit Lichtspiel am Nachmittag.",
      audioScript:
        "Du flanierst jetzt über den Grund alter Fischernetze. Via Nassa – der Name kommt von den Reusen, den «nasse», die hier hingen, als diese Gasse noch die Uferlinie war und Lugano vom Fischfang lebte. Der See wurde später zurückgedrängt, die Fischer wichen den Händlern, und heute ist die Nassa die eleganteste Arkadengasse südlich der Alpen: Unter den Bögen spiegeln sich Uhren-Vitrinen und Modehäuser, dazwischen duftet es aus Pasticcerie nach Mandeln und aus Gelaterie nach allem Guten. Das Schöne: Luxus und Alltag teilen sich hier seit Jahrhunderten dieselben Arkaden – die Nonna mit dem Einkaufstrolley hat denselben Wetterschutz wie die Uhrenkundschaft. Mein Flanier-Tipp: Nimm zwischendurch eine der schmalen Seitengassen Richtung See – alle fünfzig Meter blitzt das Wasser auf, wie Fenster in einem langen Korridor. Am Ende der Gasse wartet dann ein unscheinbarer Kirchenbau mit dem grössten Kunstschatz der Schweiz. Von aussen ahnst du: nichts.",
    },
    {
      id: "santa-maria-angioli",
      name: "Santa Maria degli Angioli",
      teaser: "Das Luini-Fresko: der «Sixtinische Moment» der Schweiz.",
      coords: { lat: 46.0014, lng: 8.9477 },
      walkMinutesFromPrevious: 4,
      directions: "Am Gassenende zur kleinen Kirche an der Piazza Luini.",
      stayMinutes: 15,
      why: "Hinter schlichter Fassade: das bedeutendste Renaissance-Fresko des Landes, raumhoch.",
      story:
        "1529 vollendete Bernardino Luini – Leonardo-Schüler – hier seine monumentale Passion: Eine ganze Trennwand voller Figuren, die Kreuzigung im Zentrum, hunderte Gesichter, jedes individuell. Kunsthistoriker pilgern; die meisten Touristen laufen vorbei, weil die Fassade so bescheiden tut. Drinnen wartet der grösste Wow-Moment des Tessins.",
      funFact: "Luini lernte bei Leonardo da Vinci – die sanften Gesichter seiner Figuren tragen erkennbar die Handschrift des Meisters.",
      insiderTip: "Münze ins Beleuchtungs-Kästchen – das Fresko leuchtet auf, und der Raum verwandelt sich für zwei Minuten.",
      photoSpot: "Mittelgang mit Blick auf die ganze Trennwand (ohne Blitz).",
      audioScript:
        "Von aussen: eine bescheidene Klosterkirche, fast schüchtern. Tritt ein – und bleib gleich hinter der Schwelle stehen. Vor dir erhebt sich eine Wand, die komplett bemalt ist, raumhoch, randvoll: die Passion Christi, gemalt 1529 von Bernardino Luini. In der Mitte die Kreuzigung, darum herum Hunderte von Figuren – Soldaten, Trauernde, Schaulustige, jedes Gesicht ein eigenes Porträt, jede Geste erzählt. Luini war Schüler von Leonardo da Vinci, und man sieht es: Diese sanften, fast atmenden Gesichter tragen die Handschrift des Meisters. Kunsthistoriker nennen diese Wand das bedeutendste Renaissance-Werk der Schweiz – Touristen laufen draussen vorbei, weil die Fassade so wenig verspricht. Ihr Verlust. Wirf eine Münze ins Beleuchtungskästchen: Das Fresko flammt auf, und für zwei Minuten gehört dir der sixtinische Moment des Tessins. Nimm dir Zeit für die Details – der Soldat, der würfelt, die Frau, die wegschaut. Danach: zurück ins Licht, dem grünsten Kapitel der Stadt entgegen.",
    },
    {
      id: "parco-ciani",
      name: "Parco Ciani",
      teaser: "Der schönste Stadtpark der Schweiz – subtropisch, seeumspült.",
      coords: { lat: 46.0066, lng: 8.9582 },
      walkMinutesFromPrevious: 12,
      directions: "Der Seepromenade ostwärts folgen bis zum Parktor.",
      stayMinutes: 25,
      why: "63'000 m² Kamelien, Zedern und Uferwege – mit Seetor direkt ins Wasser.",
      story:
        "Die Brüder Ciani, liberale Revoluzzer und Bankiers, legten den Park im 19. Jh. um ihre Villa an – heute gehört er allen. Dank Tessiner Mikroklima wachsen hier Kamelien, Magnolien und Palmen wie am Mittelmeer; das berühmte schmiedeiserne Seetor rahmt Wasser und Berge wie ein Gemälde.",
      funFact: "Das «Cancello sul lago», das Tor zum See, führt nirgendwohin ausser ins Panorama – das vielleicht poetischste Nichts der Schweiz.",
      insiderTip: "Ganz nach hinten zum Seeufer-Weg gehen – die Bänke dort haben Monte-Brè-Blick und Ruhe auch an vollen Tagen.",
      photoSpot: "Durch das Seetor auf Wasser und San Salvatore – das Lugano-Bild.",
      audioScript:
        "Und jetzt der grünste Beweis für Luganos Sonderklima. Der Parco Ciani ist das, was passiert, wenn man Mittelmeerflora an einen Schweizer See lässt: Kamelien gross wie Bäume, Magnolien, Zedern, Palmen – alles echt, alles draussen, alles ganzjährig. Angelegt haben ihn die Brüder Ciani, ein bemerkenswertes Doppel aus Revolutionären und Bankiers, die im neunzehnten Jahrhundert für ein liberales Tessin kämpften und nebenbei diese Garten-Utopie um ihre Villa pflanzten. Heute gehört der Park allen, und er gilt vielen als schönster Stadtpark des Landes. Sein berühmtestes Detail ist herrlich sinnlos: das Cancello sul lago, ein schmiedeisernes Prachttor direkt am Ufer, das sich öffnet auf – nichts. Nur See, Wellen, Berge. Ein Tor ins Panorama, das poetischste Nichts der Schweiz, und natürlich das meistfotografierte. Schlendere bis ans hintere Seeufer, such dir eine Bank mit Blick auf den Monte Brè und übe das Tessiner Kernfach: dolce far niente. Das süsse Nichtstun. Du bist fast am Ziel – das Finale gehört der goldenen Stunde.",
    },
    {
      id: "lungolago",
      name: "Lungolago – die Seepromenade",
      teaser: "Palmen-Boulevard zwischen Zucker-Berg und Brè – Flanieren in Reinkultur.",
      coords: { lat: 46.0029, lng: 8.9532 },
      walkMinutesFromPrevious: 8,
      directions: "Vom Park zurück und der Uferlinie westwärts folgen.",
      stayMinutes: 12,
      why: "Die Promenade ist Luganos Laufsteg – links der See, rechts Belle-Époque, vorne der San Salvatore.",
      story:
        "Der Lungolago verbindet Parco Ciani mit Paradiso: Platanen und Palmen im Wechsel, Bootsstege, Blumenrabatten. Links ragt der Monte San Salvatore auf – der «Zuckerhut von Lugano» –, rechts der sanftere Monte Brè, der als einer der sonnigsten Punkte der Schweiz gilt. Dazwischen: du, im Schlendermodus.",
      funFact: "Monte Brè gilt offiziell als einer der sonnenreichsten Orte der Schweiz – die Funicolare hinauf fährt seit 1908.",
      insiderTip: "Gelato-Stopp ist hier Pflicht, nicht Option – die Dichte an Top-Gelaterie pro Promenadenmeter ist landesweit unerreicht.",
      photoSpot: "Promenadenbogen mit San Salvatore als Pyramide überm See.",
      audioScript:
        "Das hier ist kein Spazierweg, das ist ein Laufsteg – und alle machen mit. Auf dem Lungolago flaniert Lugano seit der Belle Époque: Familien, Senatoren-Typen mit Sonnenbrille, Jogger, die eigentlich zu entspannt zum Joggen sind. Links liegt der See wie poliert, rechts wechseln sich Platanen, Palmen und Blumenrabatten ab, und vorne wacht der Monte San Salvatore – diese perfekte grüne Pyramide, die sie den Zuckerhut von Lugano nennen. Auf der anderen Seite der sanftere Monte Brè, offiziell einer der sonnigsten Flecken der Schweiz; seine Standseilbahn klettert seit 1908 hinauf. Beide Berge wären lohnende Verlängerungen – aber heute gehört dir die Horizontale. Eine Pflicht gibt es allerdings: Gelato. Die Dichte an erstklassigen Gelaterie pro Promenadenmeter ist hier landesweit unerreicht, und ein Becher in der Hand ist auf diesem Boulevard quasi Dresscode. Noch ein paar hundert Meter, dann kommt der Moment, für den die ganze Tour getaktet ist.",
    },
    {
      id: "belvedere-finale",
      name: "Giardino Belvedere – Sunset-Finale",
      teaser: "Skulpturen, Seemauer, Abendgold – der Schlusspunkt mit Süd-Garantie.",
      coords: { lat: 46.0005, lng: 8.9456 },
      walkMinutesFromPrevious: 8,
      directions: "Der Promenade bis zum kleinen Skulpturengarten am Westende folgen.",
      stayMinutes: 25,
      why: "Der Belvedere-Garten fängt das letzte Licht – San Salvatore als Silhouette, See in Gold.",
      story:
        "Der kleine Giardino Belvedere am westlichen Promenadenende versammelt moderne Skulpturen unter Palmen – und die beste Abendmauer der Stadt: Wenn die Sonne hinter den Hügeln versinkt, färbt sie See und San Salvatore in Schichten von Gold bis Violett. Tessiner Abende machen keine halben Sachen.",
      funFact: "Dank Südlage und Seespiegelung dauert die «goldene Stunde» in Lugano gefühlt doppelt so lang wie nördlich der Alpen – Physik mit Ferienbonus.",
      insiderTip: "Auf die flache Ufermauer sitzen, Füsse Richtung Wasser – und mindestens bis zur Violett-Phase bleiben.",
      photoSpot: "Skulptur im Vordergrund, San-Salvatore-Silhouette im Gegenlicht.",
      audioScript:
        "Letzter Stop – und Lugano hat sich das Beste für den Schluss aufgehoben. Der Giardino Belvedere ist ein kleiner Skulpturengarten am Ende der Promenade: moderne Kunst unter Palmen, davor eine flache Ufermauer, die abends zur besten Sitzbank der Stadt wird. Nimm Platz, Füsse Richtung Wasser. Was jetzt kommt, ist Südlagen-Physik mit Ferienbonus: Die Sonne sinkt hinter die Hügel, und weil der See das Licht spiegelt und die Berge es staffeln, zieht sich die goldene Stunde hier wie warmer Honig – erst Gold, dann Kupfer, dann ein tiefes Violett, vor dem der San Salvatore als schwarze Pyramide steht. Lass den Tag durchlaufen: die Piazza mit dem Espresso-Ritual, die Arkaden über alten Fischernetzen, Luinis Gesichter-Wand, das Tor ins Nichts, Gelato als Dresscode. Lugano ist die Schweiz, die beschlossen hat, sich zu entspannen – pünktlich, aber mit Palmen. Bleib sitzen, bis die Lichter am Ufer angehen. Es lohnt sich. Ci vediamo – bis zum nächsten Trail!",
      nearby: [
        { name: "Gelateria-Klassiker an der Promenade", type: "cafe", note: "Der Becher fürs Finale – Pistacchio gilt als Königsdisziplin.", address: "Riva Caccia / Lungolago, 6900 Lugano" },
      ],
    },
  ],
};
