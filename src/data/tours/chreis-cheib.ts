import type { Tour } from "@/lib/types";

export const chreisCheib: Tour = {
  slug: "chreis-cheib",
  citySlug: "zuerich",
  category: "people-social",
  name: "Chreis Cheib – das echte Zürich",
  claim: "Kreis 3 & 4 ungeschminkt: wo Zürich wohnt, streitet, isst und feiert – null Touristen, hundert Prozent Quartier.",
  teaser:
    "Die Tour, die kein Reiseführer kennt: Idaplatz-Apéro, Friedhof-Flanieren, Genossenschafts-Utopien, 1.-Mai-Pflaster und die Gasse, in der ein junger Mussolini Revolution lernte.",
  description:
    "«Chreis Cheib» nannten die Zürcher den Kreis 4 – nach den Tierkadavern (Cheibe), die hier einst vergraben wurden. Heute ist das Gebiet zwischen Wiedikon und Limmatplatz das ehrlichste Stück Zürich: Arbeitergeschichte, italienische Einwanderung, Genossenschafts-Avantgarde, Rotlicht-Vergangenheit und die beste Apéro-Kultur der Stadt. Diese Tour führt dich an Orte, an denen du garantiert keine Reisegruppe triffst – dafür bei jedem Stop einen Social-Check: Wie gut kommst du hier alleine klar, wo ergeben sich Gespräche, wer hängt hier ab? Das ist die Tour für alle, die eine Stadt nicht besichtigen, sondern verstehen wollen.",
  moods: ["menschen", "kultur", "essen", "ueberraschung"],
  audience:
    "Wiederholungstäter, Neu-Zuzüger, Expats, Solo-Traveller und alle, die wissen wollen, wie Zürich wirklich tickt.",
  vibe: "Ungeschminkt, warm, multikulturell – Quartierleben statt Sehenswürdigkeiten, Begegnung statt Besichtigung.",
  bestTimeOfDay: "Später Nachmittag bis Abend – die Plätze leben ab Feierabend, der Abschluss fällt in die Apéro-Zeit.",
  bestSeason: "Ganzjährig; im Sommer wegen der Platzkultur am intensivsten, samstags wegen Flohmarkt am besten.",
  difficulty: "leicht",
  durationMinutes: 170,
  distanceKm: 5.4,
  startPoint: "Bahnhof Wiedikon",
  endPoint: "Limmatplatz",
  publicTransport: {
    start: "S-Bahn Wiedikon (S2/S8/S14/S24), Tram 9/14 «Bahnhof Wiedikon»",
    end: "Tram 4/13/17 «Limmatplatz»",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#7a1f3d", "#e8a33d"],
  imageHint: "Idaplatz im Abendlicht mit Apéro-Publikum unter Bäumen",
  seo: {
    metaTitle: "Chreis Cheib: Die Insider-Tour durch Zürichs Kreis 3 & 4 | Urban Trails",
    metaDescription:
      "Zürich wie ein Local: Idaplatz, Friedhof Sihlfeld, Kalkbreite, Helvetiaplatz, Kanzlei-Flohmarkt und Langstrasse – 10 Stops Quartierleben mit Audioguide, Social-Check und Geschichten, die kein Reiseführer kennt.",
    keywords: [
      "Zürich Insider Tipps",
      "Kreis 4 Zürich Tour",
      "Langstrasse Zürich Geschichte",
      "Zürich wie ein Local",
      "Zürich alternative Stadtführung",
      "Idaplatz Zürich",
    ],
  },
  faq: [
    {
      question: "Warum heisst die Tour «Chreis Cheib»?",
      answer:
        "So nannten die Zürcher den Kreis 4: «Cheib» bedeutet im Alten Zürichdeutsch Tierkadaver – ausserhalb der Stadtmauern wurden hier die toten Tiere vergraben. Aus dem Schimpfwort wurde ein Ehrenname, den das Quartier heute mit Stolz trägt.",
    },
    {
      question: "Ist die Gegend sicher?",
      answer:
        "Ja. Die Langstrasse ist heute Ausgehmeile, kein Angstraum – belebt bis tief in die Nacht. Normale Grossstadt-Aufmerksamkeit reicht völlig.",
    },
    {
      question: "Was ist der Social-Check?",
      answer:
        "Bei den wichtigsten Stops bewerten wir: Fühlt sich der Ort alleine gut an? Wie wahrscheinlich sind Gespräche? Wer ist das Publikum? Wann ist die beste Zeit? Perfekt für Solo-Traveller und alle, die Leute kennenlernen wollen.",
    },
    {
      question: "Welcher Tag ist ideal?",
      answer:
        "Samstag: Dann läuft der Flohmarkt auf dem Kanzleiareal, die Plätze sind voll und das Quartier zeigt sich von seiner lebendigsten Seite. Unter der Woche ab 17 Uhr ebenfalls top.",
    },
    {
      question: "Wo esse ich unterwegs am besten?",
      answer:
        "Das Quartier ist Zürichs Food-Hotspot: vom italienischen Cooperativo-Erbe über türkische Bäckereien bis zu den Beizen am Idaplatz. Konkrete Empfehlungen stehen bei jedem Stop.",
    },
    {
      question: "Funktioniert die Tour auch tagsüber?",
      answer:
        "Ja, aber sie ist ab dem späten Nachmittag am stärksten – die Plätze leben von den Menschen, und die kommen nach Feierabend.",
    },
  ],
  stops: [
    {
      id: "bahnhof-wiedikon",
      name: "Bahnhof Wiedikon",
      teaser: "Unscheinbarer Start mit grosser Geschichte – das Tor zum jüdischen Wiedikon.",
      coords: { lat: 47.3716, lng: 8.5239 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 8,
      why: "Der perfekte Einstieg: ein Quartier, das kaum ein Besucher je betritt – dabei beginnt hier Zürichs vielfältigste Ecke.",
      story:
        "Der Bahnhof von 1927 mit seiner markanten Uhr ist das Tor zu einem besonderen Stück Zürich: Rund um die Brahmsstrasse lebt eine der grössten orthodox-jüdischen Gemeinden Europas – koschere Bäckereien, Synagogen, am Schabbat ruht das Strassenbild. Gleichzeitig beginnt hier der Kreis 3 mit seiner Beizen- und Genossenschaftskultur. Zwei Welten, ein Quartier, null Berührungsängste.",
      funFact:
        "Die Bäckerei Bollag und andere koschere Läden im Quartier beliefern jüdische Gemeinden in der halben Schweiz.",
      insiderTip:
        "Freitagabend kurz vor Sonnenuntergang durchs Quartier laufen: Wenn Schabbat beginnt, wechselt die Stimmung spürbar – ein stilles, schönes Ritual mitten in der Stadt.",
      photoSpot: "Bahnhofsgebäude mit Uhrturm von der Seebahnstrasse.",
      audioScript:
        "Willkommen im Zürich, das keine Postkarte je zeigt. Du stehst am Bahnhof Wiedikon, gebaut 1927, und auf den ersten Blick ist hier: nichts Besonderes. Genau deshalb fangen wir hier an. Denn rund um diesen Bahnhof liegt eines der faszinierendsten Quartiere der Stadt. Ein paar Strassen weiter, Richtung Brahmsstrasse, lebt eine der grössten orthodox-jüdischen Gemeinden Europas – mit koscheren Bäckereien, eigenen Schulen und Synagogen. Am Freitagabend, wenn der Schabbat beginnt, siehst du Familien in festlicher Kleidung durch die Strassen ziehen, und das Quartier wird still. Und gleich daneben: Beizen, Genossenschaftsbauten, türkische Läden, italienische Cafés. Diese Tour heisst Chreis Cheib – so nannten die Zürcher den Kreis vier, nach den Tierkadavern, den Cheibe, die früher vor den Stadtmauern hier vergraben wurden. Aus dem Schimpfwort wurde ein Ehrenname. In den nächsten drei Stunden zeige ich dir das Zürich der Zürcher: die Plätze, die Geschichten und die Menschen. Los geht's – Richtung Idaplatz.",
    },
    {
      id: "idaplatz",
      name: "Idaplatz",
      teaser: "Der berühmteste Platz, den kein Tourist kennt – Zürichs Apéro-Hauptstadt.",
      coords: { lat: 47.3695, lng: 8.5125 },
      walkMinutesFromPrevious: 10,
      directions: "Von der Seebahnstrasse über die Bertastrasse ins Quartier – dem Kopfsteinpflaster nach zum Platz.",
      stayMinutes: 20,
      why: "Wenn Zürich einen Dorfplatz hat, dann diesen: Hier siehst du die Stadt im Feierabend-Modus, wie sonst nirgends.",
      story:
        "Ein Kreisel mit Bäumen, ein Brunnen, zwei Beizen – mehr braucht es nicht für eine Institution. Der Idaplatz im Kreis 3 ist seit Jahren das Symbol für das neue Quartier-Zürich: Ab 17 Uhr füllen sich die Bänke, die Leute bringen ihre eigenen Flaschen mit, Kinder kurven mit Kickboards zwischen den Tischen durch. Hier wurde das Wort «Idaplatz-Gefühl» erfunden – Zürcher Kurzform für: Sommerabend, Freunde, kein Plan, perfekt.",
      funFact:
        "Der Platz ist nach Ida benannt – einer Frau, über die fast nichts bekannt ist. Die Strassen des Quartiers tragen reihenweise weibliche Vornamen: Berta, Martha, Anna.",
      insiderTip:
        "Nicht in die Beiz sitzen, sondern machen wie die Locals: Getränk im Quartierladen holen, Bank suchen, bleiben. Niemand schaut schief – das ist hier Kultur.",
      photoSpot: "Vom Brunnen Richtung Café: Kopfsteinpflaster, Bäume, Abendlicht – das Quartier-Idyll schlechthin.",
      isHiddenGem: true,
      social: {
        alleinOk: "Sehr gut – alleine auf der Bank ist hier Normalzustand, niemand fragt.",
        gespraech: "Hoch, besonders abends: gemeinsame Bänke, Hunde, Kinder und Bier sind natürliche Eisbrecher.",
        publikum: "25–45, Quartierbewohner, Kreative, junge Familien – entspannt durchmischt.",
        besteZeit: "17–21 Uhr, Mai bis September; sonntags Brunch-Stimmung.",
      },
      nearby: [
        {
          name: "Beizen rund um den Idaplatz",
          type: "cafe",
          note: "Klein, gut, quartiertypisch – aber die wahre Magie passiert auf den Bänken draussen.",
          address: "Idaplatz, 8003 Zürich",
        },
      ],
      audioScript:
        "Das hier ist der Idaplatz – und falls du dich fragst, warum ich dich zu einem Kreisel mit ein paar Bäumen führe: Gib dem Platz zehn Minuten. Dieser unscheinbare Fleck ist die Apéro-Hauptstadt von Zürich. Es gibt hier nichts zu besichtigen, und genau das ist der Punkt. Ab fünf Uhr abends passiert das Ritual: Die Leute kommen aus den Büros und Wohnungen, holen sich eine Flasche im Quartierladen, setzen sich auf die Bänke um den Brunnen – und bleiben. Kein Konsumzwang, keine Reservation, kein Dresscode. Die Zürcher haben dafür sogar ein Wort erfunden: das Idaplatz-Gefühl. Es bedeutet so viel wie: Sommerabend, nichts vor, alles gut. Übrigens, schau dir die Strassenschilder an: Berta, Martha, Anna, Ida – das halbe Quartier trägt Frauennamen, eine Seltenheit in Schweizer Städten. Wer Ida war? Weiss bis heute niemand so genau. Mein Vorschlag: Mach es wie die Locals. Hol dir was zu trinken, such dir eine Bank und schau dem Quartier beim Leben zu. Das ist keine Pause von der Tour – das IST die Tour.",
    },
    {
      id: "friedhof-sihlfeld",
      name: "Friedhof Sihlfeld",
      teaser: "Zürichs grösster Park ist ein Friedhof – mit Promi-Gräbern und Joggern.",
      coords: { lat: 47.3738, lng: 8.5095 },
      walkMinutesFromPrevious: 8,
      directions: "Über die Bertastrasse zur Aemtlerstrasse, Haupteingang beim markanten Torbogen.",
      stayMinutes: 20,
      why: "Klingt schräg, ist aber einer der schönsten Orte der Stadt: ein Park voller Geschichte, Alleen und Stille.",
      story:
        "Der Sihlfeld ist mit Abstand die grösste Grünanlage Zürichs – und die Zürcher nutzen ihn genau so: Sie joggen, lesen und flanieren zwischen den Gräbern, völlig selbstverständlich. Hier liegen Gottfried Keller und Johanna Spyri, die Erfinderin von Heidi. Und hier stand 1889 das erste Krematorium der Schweiz – damals ein handfester Skandal, gegen den die Kirchen Sturm liefen. Der Sihlfeld war seiner Zeit so weit voraus, dass man dafür extra einen Verein gründen musste: «Die Feuerbestattung».",
      funFact:
        "Heidi-Autorin Johanna Spyri und Gottfried Keller liegen wenige Gehminuten voneinander entfernt – die zwei meistgelesenen Zürcher aller Zeiten, vereint im Sihlfeld.",
      insiderTip:
        "Den Lageplan am Eingang fotografieren und die Promi-Gräber ablaufen – und danach durch die grosse Platanenallee in der Mitte: die schönste Allee der Stadt, Punkt.",
      photoSpot: "Die zentrale Allee im Gegenlicht – Symmetrie wie aus einem Wes-Anderson-Film.",
      isHiddenGem: true,
      audioScript:
        "Ich führe dich jetzt auf einen Friedhof – und bevor du abwinkst: Vertrau mir. Der Friedhof Sihlfeld ist die grösste Grünanlage von ganz Zürich, grösser als jeder Park. Und die Zürcher behandeln ihn auch so: Hier wird gejoggt, gelesen, spaziert und durchgeatmet, mitten zwischen den Gräbern, und das ist völlig normal und erlaubt. Zwei Bewohner solltest du besuchen. Erstens: Gottfried Keller, der grösste Dichter der Stadt. Zweitens: Johanna Spyri – die Frau, die Heidi erfunden hat, die berühmteste Schweizerin der Literaturgeschichte. Ihre Bücher wurden über fünfzig Millionen Mal verkauft, in Japan ist sie ein Superstar – und sie liegt hier, ein paar Schritte von Keller entfernt. Und dann ist da noch eine Geschichte: 1889 wurde hier das erste Krematorium der Schweiz gebaut. Heute klingt das banal, damals war es eine Ungeheuerlichkeit – die Kirchen tobten, Feuerbestattung galt als gottlos. Zürich machte es trotzdem. Dieses Quartier war schon immer gut darin, Dinge zuerst zu tun, über die sich der Rest des Landes noch empört. Nimm dir Zeit für die grosse Platanenallee in der Mitte. Es ist die schönste Allee der Stadt – und die stillste.",
    },
    {
      id: "kalkbreite",
      name: "Kalkbreite",
      teaser: "Wohnutopie über dem Tramdepot – Zürichs radikalstes Bauprojekt.",
      coords: { lat: 47.3717, lng: 8.5163 },
      walkMinutesFromPrevious: 12,
      directions: "Zurück über die Bertastrasse, der Kalkbreitestrasse entlang bis zur Badenerstrasse.",
      stayMinutes: 15,
      why: "Hier siehst du, wie Zürich das Wohnen neu erfindet – eine Genossenschafts-Stadt auf einem Tramdepot.",
      story:
        "2014 eröffnet, weltweit beachtet: Die Genossenschaft Kalkbreite baute über einem laufenden(!) Tramdepot einen Wohn- und Gewerbekomplex für rund 250 Menschen – autofrei, mit Gemeinschaftsküchen, flexiblen Zimmern, Kino (Houdini) und einem begrünten Innenhof auf dem Depot-Dach. Wer hier einzieht, verzichtet vertraglich aufs eigene Auto. Die Warteliste ist legendär lang. Ein Drittel aller Zürcher Wohnungen ist genossenschaftlich – die Kalkbreite ist das Aushängeschild dieser leisen Schweizer Revolution.",
      funFact:
        "Unter den Schlafzimmern parkieren nachts die Trams – die Bewohner sagen, man gewöhne sich ans leise Quietschen wie an Meeresrauschen.",
      insiderTip:
        "Die Aussentreppe zum Innenhof auf dem Depotdach ist öffentlich zugänglich – hochsteigen und das Dorf auf dem Dach anschauen. Im Houdini-Kino laufen Filme abseits des Blockbuster-Programms.",
      photoSpot: "Von der Badenerstrasse: Tram fährt ins Depot, darüber stapelt sich das Wohnhaus.",
      isHiddenGem: true,
      social: {
        alleinOk: "Gut – Café Bebek und Houdini-Bar sind solo-freundlich.",
        gespraech: "Mittel – eher Beobachtungs- als Anquatsch-Ort; im Kino-Foyer am ehesten.",
        publikum: "Urban, genossenschaftsbewegt, 30–50, viele Architektur-Pilger aus aller Welt.",
        besteZeit: "Nachmittags für den Hof, abends fürs Kino.",
      },
      nearby: [
        {
          name: "Café Bebek",
          type: "cafe",
          note: "Im Kalkbreite-Komplex – levantinisch angehaucht, vom Frühstück bis zum Abendessen gut.",
          address: "Badenerstrasse 171, 8003 Zürich",
        },
      ],
      audioScript:
        "Schau dir dieses Gebäude an: Unten fahren Trams rein, oben wohnen Menschen. Das ist die Kalkbreite – und sie ist der Grund, warum Architekten aus Tokio, Wien und Kopenhagen in dieses Quartier pilgern. Die Geschichte: Hier stand ein Tramdepot, und Land ist in Zürich unbezahlbar. Also dachte eine Genossenschaft radikal: Warum nicht beides? Sie bauten über dem laufenden Depot eine kleine Stadt – Wohnungen für zweihundertfünfzig Menschen, Läden, ein Kino, Gemeinschaftsküchen und einen grünen Innenhof, der auf dem Dach des Depots liegt. Die Bewohner verzichten vertraglich aufs eigene Auto. Es gibt Zimmer, die man dazumieten kann, wenn Besuch kommt, und wieder abgibt, wenn er geht. Klingt utopisch? Die Warteliste ist Jahre lang. Und hier kommt der grössere Zusammenhang: Ein Drittel aller Wohnungen in Zürich gehört Genossenschaften – nicht dem Markt. Das ist der Grund, warum diese Stadt trotz Bankenglanz durchmischter geblieben ist als London oder München. Steig die öffentliche Treppe zum Innenhof hoch und schau dir das Dorf auf dem Dach an. Unten quietschen die Trams, oben wachsen Tomaten. Zürich kann sehr seltsam sein. Zum Glück.",
    },
    {
      id: "hallwylplatz",
      name: "Hallwylplatz & Volkshaus-Quartier",
      teaser: "Das Bilderbuch-Eck des Kreis 4 – wo Arbeitergeschichte auf Feierabendbier trifft.",
      coords: { lat: 47.3712, lng: 8.5269 },
      walkMinutesFromPrevious: 10,
      directions: "Der Badenerstrasse stadteinwärts folgen, nach der Sihl rechts zum Platz.",
      stayMinutes: 12,
      why: "Einer der charmantesten Plätze der Stadt – und das Vorzimmer des legendären Volkshauses.",
      story:
        "Der Hallwylplatz mit seinen Altbauten und dem kleinen Park ist das gute Herz des unteren Kreis 4. Gleich daneben: das Volkshaus von 1910, gebaut von der Arbeiterbewegung als Gegenwelt zu den bürgerlichen Zunfthäusern – mit Sälen für Versammlungen, Theater und das erste alkoholfreie Restaurant der Stadt (man wollte die Arbeiter aus den Spelunken holen). Lenin sprach hier, die Generalstreik-Bewegung von 1918 organisierte sich hier. Heute: Konzerte, Beiz, Brasserie – die Revolution ist gemütlich geworden, aber die Mauern erinnern sich.",
      funFact:
        "1918 war das Volkshaus das Hirn des Schweizer Generalstreiks – der Bundesrat liess es zeitweise militärisch besetzen.",
      insiderTip:
        "Im Volkshaus die Treppenhäuser anschauen: Jugendstil-Arbeiterpalast. Die Konzerte im grossen Saal gehören akustisch zu den besten der Stadt.",
      photoSpot: "Hallwylplatz-Brunnen mit den Altbaufassaden – goldene Stunde Pflicht.",
      social: {
        alleinOk: "Sehr gut – Park und Beizen sind unkompliziert.",
        gespraech: "Mittel bis hoch – kleine Plätze machen gesprächig, abends Bar-Publikum.",
        publikum: "Quartier-Mix: alteingesessen bis kreativ, 25–60.",
        besteZeit: "Feierabend; bei Volkshaus-Konzerten verwandelt sich die ganze Ecke.",
      },
      audioScript:
        "Dieser kleine Platz mit dem Brunnen und den Altbauten ist der Hallwylplatz – und er ist das perfekte Vorzimmer für das Gebäude gleich um die Ecke: das Volkshaus. 1910 gebaut, und zwar aus Wut. Die Zünfte und das Bürgertum hatten ihre Prachtbauten an der Limmat – die Arbeiterbewegung beschloss: Wir bauen unseren eigenen Palast. Mit Versammlungssälen, Theater, Bibliothek und – kein Witz – dem ersten alkoholfreien Restaurant der Stadt. Man wollte die Arbeiter aus den Schnapskneipen holen und ihnen Bildung statt Branntwein geben. In diesen Sälen sprach Lenin während seiner Zürcher Jahre. Und 1918, beim Schweizer Generalstreik, dem grössten sozialen Konflikt der modernen Schweiz, war das Volkshaus die Kommandozentrale – der Bundesrat nahm das so ernst, dass er das Haus vom Militär besetzen liess. Heute? Spielen hier Bands, die Brasserie serviert Entrecôte, und der Klassenkampf beschränkt sich auf die Frage, wer zuerst an der Bar drankommt. Aber wenn du durchs Jugendstil-Treppenhaus läufst, spürst du noch, wofür dieses Haus gebaut wurde: für die Idee, dass Würde keine Frage des Kontostands ist.",
    },
    {
      id: "baeckeranlage",
      name: "Bäckeranlage",
      teaser: "Die grüne Lunge des Kreis 4 – Multikulti-Picknick unter Platanen.",
      coords: { lat: 47.3759, lng: 8.5224 },
      walkMinutesFromPrevious: 7,
      directions: "Über die Stauffacherstrasse Richtung Hohlstrasse – der Park öffnet sich linkerhand.",
      stayMinutes: 12,
      why: "Kein Park der Stadt ist internationaler: Hier picknickt die halbe Welt nebeneinander.",
      story:
        "Die Bäckeranlage ist seit über 100 Jahren der Hinterhof-Garten des dichtesten Quartiers der Stadt. An Sommerabenden grillieren hier eritreische Familien neben portugiesischen Senioren, tamilische Kinder spielen Fussball zwischen WG-Picknicks. Das Gemeinschaftszentrum mit seinem Pavillon-Café hält den Park sozial zusammen. Wer verstehen will, was Integration im Alltag bedeutet – nicht als Politikum, sondern als Normalität – setzt sich hier eine halbe Stunde auf die Wiese.",
      funFact:
        "Im Quartier rund um den Park werden über 100 Sprachen gesprochen – auf einem Quadratkilometer.",
      insiderTip:
        "Das Pavillon-Café des GZ ist eines der günstigsten Gartencafés der Stadt – und sonntags oft mit Quartier-Brunch.",
      photoSpot: "Unter den grossen Platanen Richtung Spielplatz – Leben in allen Farben.",
      isHiddenGem: true,
      social: {
        alleinOk: "Sehr gut – auf der Wiese fällt niemand auf.",
        gespraech: "Hoch bei Grill- und Spielplatz-Nähe; das GZ-Café ist ein natürlicher Anknüpfungspunkt.",
        publikum: "Der ganze Kreis 4: alle Herkünfte, alle Alter – Zürichs ehrlichster Querschnitt.",
        besteZeit: "Sommerabende und Sonntagnachmittage.",
      },
      audioScript:
        "Atme kurz durch – du bist in der Bäckeranlage, der grünen Lunge des Kreis vier. Auf den ersten Blick: ein Park wie viele. Auf den zweiten: das vielleicht internationalste Stück Schweiz überhaupt. Im Quartier rund um diese Wiese werden über hundert Sprachen gesprochen. Hundert – auf einem Quadratkilometer. An einem warmen Abend siehst du das hier in Echtzeit: eritreische Grossfamilien am Grill, portugiesische Männer beim Kartenspiel, tamilische Kinder am Fussballspielen, Schweizer WGs mit Picknickdecken, dazwischen Hunde, Frisbees und der Duft von einem Dutzend Küchen. Niemand hat das kuratiert. Es funktioniert einfach – seit über hundert Jahren, denn dieser Park wurde genau dafür angelegt: als Garten für die, die keinen haben. Das kleine Pavillon-Café gehört zum Gemeinschaftszentrum und ist eines der günstigsten Gartencafés der Stadt. Hol dir einen Kaffee, setz dich auf die Wiese und schau zu. Es gibt politische Reden über Integration – und es gibt die Bäckeranlage an einem Dienstagabend. Das zweite ist überzeugender.",
    },
    {
      id: "helvetiaplatz",
      name: "Helvetiaplatz",
      teaser: "Das politische Pflaster der Schweiz – Demos, 1. Mai und Quartiermarkt.",
      coords: { lat: 47.3776, lng: 8.5260 },
      walkMinutesFromPrevious: 4,
      directions: "Der Hohlstrasse entlang zur Molkenstrasse, der Platz öffnet sich beim Amtshaus.",
      stayMinutes: 10,
      why: "Kein Platz der Schweiz hat mehr Demonstrationen gesehen – hier schlägt das politische Herz des Landes links.",
      story:
        "Seit über 100 Jahren ist der Helvetiaplatz DER Demonstrations- und Kundgebungsort der Schweiz: 1.-Mai-Schlusspunkt, Frauenstreik, Klimastreik – wer in diesem Land protestiert, endet hier. Das Monumentalrelief «Arbeiterfamilie» am Amtshaus und Karl Geisers Denkmal erzählen von der Arbeiterbewegung, die dieses Quartier prägte. Dienstags und freitags wird der Asphalt friedlich besetzt: vom Quartiermarkt mit dem günstigsten Gemüse der Stadt.",
      funFact:
        "Am 1. Mai füllt sich der Platz seit Generationen – Zürich ist die einzige Schweizer Grossstadt, in der der Tag der Arbeit offizieller Feiertag ist.",
      insiderTip:
        "Markttage Dienstag und Freitag am Vormittag: bester Moment, um den Platz im Alltagsmodus zu erleben – und günstiger einzukaufen als irgendwo sonst.",
      photoSpot: "Vor dem Amtshaus mit dem Arbeiterrelief im Rücken über den Platz.",
      audioScript:
        "Du stehst auf dem wichtigsten politischen Pflaster der Schweiz. Der Helvetiaplatz ist seit über hundert Jahren der Ort, an dem dieses Land auf die Strasse geht: Hier endet die 1.-Mai-Demo, hier sammelte sich der grosse Frauenstreik, hier standen die Klimajugend, die Gewerkschaften, die Wütenden und die Hoffnungsvollen jeder Generation. Zürich ist übrigens die einzige Schweizer Grossstadt, in der der 1. Mai offizieller Feiertag ist – auch das ein Erbe dieses Quartiers. Schau ans Amtshaus: Das Relief zeigt eine Arbeiterfamilie, ungewöhnlich monumental für die bescheidene Schweiz. Es erinnert daran, wer dieses Quartier gebaut hat und wem es gehörte – den Näherinnen, Bauarbeitern, Saisonniers. Aber keine Sorge, der Platz kann auch unpolitisch: Dienstags und freitags steht hier der Quartiermarkt, und dann wird statt demonstriert verhandelt – über den Preis von Tomaten, in fünf Sprachen gleichzeitig. Wenn du an einem Markttag hier bist: Kauf etwas Obst und schau dem Platz beim Alltag zu. Revolutionen brauchen Pausen.",
    },
    {
      id: "kanzleiareal",
      name: "Kanzleiareal & Flohmarkt",
      teaser: "Samstags der beste Flohmarkt der Stadt, immer das Wohnzimmer der Subkultur.",
      coords: { lat: 47.3763, lng: 8.5246 },
      walkMinutesFromPrevious: 3,
      directions: "Direkt hinter dem Helvetiaplatz – der grosse Schulhof-Platz mit dem Kino.",
      stayMinutes: 15,
      why: "Das widerspenstigste Stück Zürich: besetzter Schulhof, gerettetes Kino, legendärer Flohmarkt.",
      story:
        "Das Kanzleiareal – ein alter Schulhof – wurde in den 80ern zum Zentrum der Jugendbewegung: autonomes Zentrum, Konzerte, Konflikte. Aus dem Provisorium von damals blieb das Xenix, ein Kino in Baracken, das längst Kultstatus hat. Samstags verwandelt sich der Platz in den grössten Flohmarkt der Stadt – Trödel, Vinyl, Velos und das beste People-Watching Zürichs. Das Areal ist der Beweis, dass aus Widerstand Institutionen werden können, ohne die Seele zu verlieren.",
      funFact:
        "Das Xenix startete 1981 als besetztes Provisorium für ein Jahr – es läuft bis heute, in denselben Baracken.",
      insiderTip:
        "Samstag früh kommen (vor 10 Uhr) für die Flohmarkt-Perlen – danach im Xenix-Gartencafé verschnaufen, einem der gemütlichsten Aussenplätze der Stadt.",
      photoSpot: "Flohmarkt-Gewusel mit Xenix-Baracke im Hintergrund.",
      isHiddenGem: true,
      social: {
        alleinOk: "Perfekt – Flohmarkt und Kino-Bar sind klassische Solo-Orte.",
        gespraech: "Sehr hoch am Flohmarkt: Feilschen ist Smalltalk mit Ziel. Xenix-Bar abends offen und gesprächig.",
        publikum: "Subkultur bis Familien, Sammler, Cinephile – herrlich unsortiert.",
        besteZeit: "Samstag ganztags; abends Kino-/Barbetrieb.",
      },
      nearby: [
        {
          name: "Xenix Bar & Kino",
          type: "kino",
          note: "Kultkino in der Baracke mit grossem Gartencafé – auch ohne Filmticket bestens.",
          address: "Kanzleistrasse 52, 8004 Zürich",
        },
      ],
      audioScript:
        "Dieser Schulhof hat mehr Geschichte als manches Museum. Willkommen auf dem Kanzleiareal. In den Achtzigern, nach den Opernhauskrawallen, war hier das Zentrum der Zürcher Jugendbewegung – autonome Konzerte, hitzige Vollversammlungen, Räumungen und Rückeroberungen. Aus dieser wilden Zeit ist etwas geblieben, und zwar etwas Wunderbares: das Xenix. Ein Kino in Holzbaracken, 1981 als Provisorium für ein einziges Jahr gestartet. Das Provisorium läuft jetzt seit über vierzig Jahren – dieselben Baracken, dasselbe Prinzip: Filme abseits des Mainstreams, Bier im Garten, niemand muss hier irgendwas. Und samstags passiert auf dem Platz das grosse Ritual: der Flohmarkt. Der grösste und beste der Stadt. Vinyl-Kisten, Omas Silberbesteck, Velos mit Vergangenheit, dazu das beste People-Watching von Zürich. Hier feilschen Sammler mit Künstlerinnen, Familien mit Händlern, und zwischendrin findest du tatsächlich Schätze. Falls heute Samstag ist: Tauch ein, verhandle, lass dich treiben. Falls nicht: Setz dich in den Xenix-Garten und stell dir vor, wie dieser verbeulte Schulhof einst die brave Schweiz das Fürchten lehrte.",
    },
    {
      id: "piazza-cella",
      name: "Piazza Cella & Klein-Italien",
      teaser: "Wo Zürich italienisch wurde – und ein junger Mussolini Revolution lernte.",
      coords: { lat: 47.3772, lng: 8.5288 },
      walkMinutesFromPrevious: 5,
      directions: "Über die Kanzleistrasse zur Zwinglistrasse – der kleine Platz mit den Lichterketten.",
      stayMinutes: 12,
      why: "Das italienische Erbe des Quartiers in einem Platz – mit einer Weltgeschichte-Pointe.",
      story:
        "Aussersihl war Zürichs Klein-Italien: Zehntausende italienische Arbeiter bauten ab 1880 die Bahnen, Tunnel und Häuser der Schweiz – und wohnten hier, oft zu sechst im Zimmer. Ihre Genossenschaftsbeiz «Cooperativo» (gegründet 1905) wurde zum Treffpunkt der italienischen Sozialisten im Exil. Stammgast um 1904: ein junger, mittelloser Heisssporn namens Benito Mussolini, damals noch glühender Sozialist. Die Piazza Cella mit ihren Beizen und Lichterketten ist das charmante Erbe dieser Ära – Italianità ohne Folklore.",
      funFact:
        "Mussolini lebte als junger Mann in Zürich von Gelegenheitsjobs, schlief zeitweise unter Brücken und diskutierte im Cooperativo über die Revolution – als Sozialist. Die Geschichte nahm bekanntlich eine andere Wendung.",
      insiderTip:
        "Abends, wenn die Lichterketten brennen, ist die Piazza einer der stimmungsvollsten Apéro-Orte der Stadt – deutlich ruhiger als die Langstrasse nebenan.",
      photoSpot: "Lichterketten über dem Platz zur blauen Stunde.",
      isHiddenGem: true,
      social: {
        alleinOk: "Gut – an der Bar der Beizen völlig normal.",
        gespraech: "Mittel bis hoch – kleiner Platz, gemeinsame Tische, italienische Gesprächskultur.",
        publikum: "30–55, Quartier-Stammgäste, Italo-Zürcher, Feierabend-Geniesser.",
        besteZeit: "Ab 18 Uhr, am schönsten zur blauen Stunde.",
      },
      audioScript:
        "Dieser kleine Platz mit den Lichterketten erzählt ein Kapitel, ohne das Zürich nicht Zürich wäre: die italienische Einwanderung. Ab 1880 kamen Zehntausende italienische Arbeiter in die Schweiz – sie gruben die Eisenbahntunnel, bauten die Bahnhöfe und die halben Quartiere, in denen du heute unterwegs warst. Gewohnt haben sie hier, in Aussersihl, oft zu sechst in einem Zimmer. Man nannte die Gegend Klein-Italien. Und jetzt die Pointe, die kaum jemand kennt: 1905 gründeten die italienischen Arbeiter ihre eigene Genossenschaftsbeiz, das Cooperativo – Treffpunkt der Sozialisten, Anarchisten und Exilanten. Und einer der jungen Hitzköpfe, die dort um 1904 über die Weltrevolution stritten, war ein mittelloser italienischer Emigrant, der zeitweise unter Zürcher Brücken schlief: Benito Mussolini. Damals glühender Sozialist. Wie die Geschichte weiterging, weisst du – aber gelernt hat er das Reden hier, in den verrauchten Hinterzimmern von Aussersihl. Heute ist die Piazza Cella einfach einer der schönsten Feierabend-Plätze der Stadt. Bestell einen Vermouth, schau in die Lichterketten und heb das Glas auf die Tunnelbauer – ihnen verdankt dieses Land mehr als manchem Denkmal.",
      nearby: [
        {
          name: "Bar & Beizen an der Piazza",
          type: "bar",
          note: "Italienisch geprägt, quartiertreu – Apéro-Pflichtstopp.",
          address: "Piazza Cella / Zwinglistrasse, 8004 Zürich",
        },
      ],
    },
    {
      id: "langstrasse",
      name: "Langstrasse",
      teaser: "Vom Rotlicht zur Lebensader – die ehrlichste Strasse der Schweiz.",
      coords: { lat: 47.3795, lng: 8.5295 },
      walkMinutesFromPrevious: 4,
      directions: "Von der Piazza zur Langstrasse und nach links – einfach treiben lassen.",
      stayMinutes: 15,
      why: "Keine Strasse der Schweiz hat mehr Wandel erlebt – und mehr Leben pro Meter.",
      story:
        "Die Langstrasse war jahrzehntelang Synonym für Rotlicht, Drogen und Verruf – das Gegen-Zürich zur Bahnhofstrasse. Heute ist sie die Ausgehmeile der Stadt: Bars, Clubs, Spätis, türkische Bäcker neben Naturwein-Bars, Sexshops neben Specialty Coffee. Die Gentrifizierung nagt, aber die Strasse wehrt sich mit Charakter. Nachts gehört sie allen: Bankern, Punks, Nachtschwärmern, Taxifahrern. Wer Zürich nur als brave Bankenstadt kennt, wird hier umerzogen.",
      funFact:
        "Die Langstrasse kreuzt unterirdisch die Gleise des HB – die Unterführung war einst der dunkelste Ort der Stadt und ist heute mit Bars und Läden eine der lebendigsten Passagen.",
      insiderTip:
        "Die Seitengassen sind die wahren Schätze: Brauerstrasse, Dienerstrasse, Zwinglistrasse – dort sitzt das Quartier, während auf der Hauptachse die Besucher flanieren.",
      photoSpot: "Neonlichter der Bars bei Dunkelheit – Zürichs einziges echtes Grossstadt-Motiv.",
      social: {
        alleinOk: "Sehr gut – Bars mit Tresenkultur, niemand ist hier lange allein.",
        gespraech: "Sehr hoch ab 22 Uhr – die gesprächigste Strasse der Schweiz.",
        publikum: "Alle. Wirklich alle. 20–60, jede Szene, jede Herkunft.",
        besteZeit: "Donnerstag bis Samstag ab 21 Uhr; tagsüber für Läden und Cafés.",
      },
      audioScript:
        "Und jetzt: die Langstrasse. Atme einmal tief ein – das hier ist die ehrlichste Strasse der Schweiz. Jahrzehntelang war sie das schwarze Schaf: Rotlicht, Drogenhandel, Razzien. Die feine Bahnhofstrasse liegt nur einen Kilometer entfernt, aber dazwischen lagen Welten – hüben die Schaufenster mit Uhren für Millionen, drüben das raue Pflaster. Die Stadt versuchte alles: Razzien, Verbote, Aufwertungsprogramme. Am Ende hat die Strasse die Stadt verändert, nicht umgekehrt. Heute ist die Langstrasse Zürichs Lebensader bei Nacht: Bars an Bars, Clubs in Kellern, der türkische Bäcker um drei Uhr früh, wenn die Clubgänger Hunger haben. Banker stossen mit Punks an, niemand fragt, was du verdienst. Mein Rat: Bleib nicht auf der Hauptachse. Die Wahrheit dieser Gegend liegt in den Seitengassen – Brauerstrasse, Dienerstrasse, Zwinglistrasse. Dort sitzt das Quartier vor den Beizen, während auf der Langstrasse die Besucher auf und ab ziehen. Du hast es fast geschafft – noch ein letztes Stück die Strasse runter wartet das Finale am Limmatplatz.",
    },
    {
      id: "limmatplatz",
      name: "Limmatplatz & Migros-Hochhaus",
      teaser: "Das Finale: der Platz des Brückenbauers – und ein Apéro hast du dir verdient.",
      coords: { lat: 47.3846, lng: 8.5318 },
      walkMinutesFromPrevious: 13,
      directions: "Der Langstrasse nordwärts folgen, durch die Unterführung – der grosse Platz mit dem Hochhaus.",
      stayMinutes: 15,
      why: "Hier endet die Tour bei der Geschichte eines Mannes, der die Schweiz mehr verändert hat als die meisten Bundesräte.",
      story:
        "Am Limmatplatz thront das Migros-Hochhaus – Hauptsitz des Konzerns, den Gottlieb Duttweiler 1925 mit fünf Ford-Lastwagen gründete: Lebensmittel zu fairen Preisen, direkt zu den Leuten, am Zwischenhandel vorbei. Die Händler hassten ihn, die Politik bekämpfte ihn, die Arbeiterquartiere liebten ihn. Duttweiler verschenkte sein Lebenswerk schliesslich an die Kundschaft: Die Migros gehört bis heute ihren über zwei Millionen Genossenschaftern. Kein Alkohol, kein Tabak in den Regalen – sein Wille, bis heute. Der Kreis schliesst sich: Auch dieses Quartier wurde von Genossenschaften gebaut.",
      funFact:
        "Duttweiler verkaufte anfangs nur sechs Artikel ab Lastwagen: Kaffee, Reis, Zucker, Teigwaren, Kokosfett und Seife – der Beginn des grössten Detailhändlers der Schweiz.",
      insiderTip:
        "Rund um den Platz: Quartier-Bars für den Abschluss-Apéro. Wer noch Energie hat, läuft fünf Minuten zur Josefwiese oder zum Letten – du kennst den Weg von der Hidden-Tour.",
      photoSpot: "Migros-Hochhaus mit Tram-Gewusel davor – Zürcher Alltags-Ikone.",
      social: {
        alleinOk: "Gut – Bars rund um den Platz sind unkompliziert.",
        gespraech: "Mittel – als Verteiler eher Durchgangsort, die Gespräche passieren in den Bars.",
        publikum: "Querschnitt Kreis 5: jung, urban, durchmischt.",
        besteZeit: "Feierabend bis Mitternacht.",
      },
      audioScript:
        "Finale – Limmatplatz. Und zum Schluss die Geschichte eines Mannes, der die Schweiz mehr geprägt hat als die meisten Politiker: Gottlieb Duttweiler. 1925 kaufte er fünf Ford-Lastwagen, lud Kaffee, Reis, Zucker, Teigwaren, Kokosfett und Seife auf – sechs Artikel, mehr nicht – und fuhr damit in die Arbeiterquartiere. Seine Idee: Lebensmittel ohne teuren Zwischenhandel, zu Preisen, die sich jeder leisten kann. Die etablierten Händler tobten, boykottierten ihn, die Politik schikanierte ihn mit Sondergesetzen. Die Quartiere wie dieses hier? Liebten ihn. Aus den fünf Lastwagen wurde die Migros, der grösste Detailhändler des Landes – und dann tat Duttweiler etwas, das in keiner Wirtschaftsgeschichte fehlen darf: Er verschenkte sein Lebenswerk. An die Kunden. Die Migros gehört bis heute über zwei Millionen Genossenschaftern, also: den Leuten. Und weil Duttweiler fand, mit Suchtmitteln verdiene man kein Geld, gibt es bis heute keinen Alkohol und keinen Tabak in den Regalen. Das Hochhaus vor dir ist die Zentrale dieses Imperiums. Damit schliesst sich der Kreis dieser Tour: Genossenschafts-Wohnungen, Genossenschafts-Beizen, Genossenschafts-Läden – dieses Quartier hat der Welt vorgemacht, dass Wirtschaft auch anders geht. Du bist fünf Kilometer durch das echte Zürich gelaufen. Jetzt: Apéro. Du weisst ja jetzt, wie das geht – Bank oder Bar, Hauptsache Quartier. Salute, Cheib!",
    },
  ],
};
