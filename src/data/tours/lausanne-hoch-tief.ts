import type { Tour } from "@/lib/types";

export const lausanneHochTief: Tour = {
  slug: "lausanne-hoch-tief",
  citySlug: "lausanne",
  category: "urban-vibes",
  name: "Lausanne – Stadt der Treppen",
  claim: "Die steilste Grossstadt der Schweiz: oben Kathedrale mit Nachtrufer, unten Olympia am See.",
  teaser:
    "Von der Kathedrale (wo nachts noch immer ein Wächter die Stunden ruft) über die Markttreppen ins Szeneviertel Flon und hinunter nach Ouchy ans Wasser – Lausanne in der Falllinie.",
  description:
    "Lausanne ist auf drei Hügeln gebaut und hat das Beste daraus gemacht: eine Stadt der Treppen, Brücken und Übergänge, in der man Quartiere wie Stockwerke wechselt. Diese Tour nimmt die Falllinie: Start bei der gotischen Kathedrale, wo seit über 600 Jahren jede Nacht ein Wächter die Stunden in alle Himmelsrichtungen ruft – der letzte seiner Art. Dann über die hölzernen Escaliers du Marché hinunter zur Place de la Palud, weiter ins Flon – ein ehemaliges Lagerhaus-Tal, heute Ausgehviertel auf Industriefundament – und schliesslich mit Schwung (oder Metro) hinunter nach Ouchy, wo Olympia residiert und der Genfersee glitzert. Bergab denken, Lausanne verstehen.",
  moods: ["kultur", "aussicht", "menschen"],
  audience: "Romandie-Fans, Treppen-Tolerante, Nachtleben-Neugierige – und alle, die Olympia-Geschichte mögen.",
  vibe: "Vertikal, jung, französisch – die Stadt mit dem höchsten Studierenden-Anteil der Schweiz.",
  bestTimeOfDay: "Nachmittag bis Abend – Flon erwacht ab 17 Uhr, Ouchy glüht im Abendlicht.",
  bestSeason: "Ganzjährig; der Nachtwächter ruft bei jedem Wetter (22–2 Uhr).",
  difficulty: "mittel",
  durationMinutes: 150,
  distanceKm: 4.0,
  startPoint: "Cathédrale de Lausanne",
  endPoint: "Ouchy, Quai am See",
  publicTransport: {
    start: "Metro M2 «Bessières» oder 12 Min. bergauf ab Gare",
    end: "Metro M2 «Ouchy-Olympique» zurück zum Bahnhof (4 Min.)",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#4a1f6b", "#38a5ff"],
  seo: {
    metaTitle: "Lausanne zu Fuss: Kathedrale, Flon & Ouchy mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Tour durch Lausanne: Kathedrale mit Nachtwächter, Escaliers du Marché, Szeneviertel Flon und Olympia-Hafen Ouchy. 6 Stops bergab, mit Audio-Stories.",
    keywords: ["Lausanne Sehenswürdigkeiten","Lausanne Altstadt Rundgang","Kathedrale Lausanne Nachtwächter","Flon Lausanne","Ouchy Lausanne"],
  },
  faq: [
    { question: "Wie anstrengend sind die Treppen?", answer: "Die Tour läuft bewusst bergab – knieschonend geplant. Wer mag, ersetzt das letzte Stück mit der Metro M2, der steilsten U-Bahn der Welt." },
    { question: "Kann man den Nachtwächter hören?", answer: "Ja – jede Nacht zwischen 22 und 2 Uhr ruft er nach jedem Stundenschlag vom Kathedralenturm. Die Tour erklärt, wo man am besten lauscht." },
    { question: "Lohnt sich das Olympische Museum?", answer: "Für Sportfans absolut (in Ouchy direkt an der Route); der Park davor mit Skulpturen ist gratis und schon die halbe Miete." },
  ],
  stops: [
    {
      id: "cathedrale-lausanne",
      name: "Cathédrale & Nachtwächter",
      teaser: "Die schönste Gotik der Schweiz – mit dem letzten rufenden Turmwächter Europas.",
      coords: { lat: 46.5224, lng: 6.6358 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 25,
      why: "Bedeutendster gotischer Bau des Landes, berühmte Fensterrose – und eine 600-jährige Tonspur.",
      story:
        "Die Kathedrale (geweiht 1275) war im Mittelalter eine der grossen Pilgerkirchen Europas. Ihr Schatz: die Fensterrose mit mittelalterlichem Weltbild – und eine lebendige Tradition: Seit 1405 ruft jede Nacht ein «Guet» vom Turm die Stunden («C'est le guet! Il a sonné dix!») – in alle vier Himmelsrichtungen, von 22 bis 2 Uhr. Einst Feueralarm-System, heute der letzte seiner Art.",
      funFact: "Der aktuelle Nachtwächter hat den vielleicht sichersten Job der Schweiz – die Stelle wurde seit 1405 nie abgeschafft, nicht mal probeweise.",
      insiderTip: "Tagsüber: Turmaufstieg für den Stadt-See-Alpen-Blick. Nachts um 22 Uhr unten auf der Esplanade stehen und lauschen – Gänsehaut garantiert.",
      photoSpot: "Von der Esplanade über die Dächer zum See.",
      audioScript:
        "Stell dir vor: Jede Nacht, seit dem Jahr 1405, steigt in dieser Stadt ein Mensch auf den Kathedralenturm und ruft die Stunden aus – in alle vier Himmelsrichtungen, von zehn Uhr abends bis zwei Uhr früh. C'est le guet! Il a sonné dix! Es ist der Wächter, es hat zehn geschlagen. Sechshundert Jahre, ohne Unterbruch – durch Reformation, Revolutionen, Weltkriege und die Erfindung der Armbanduhr hindurch. Ursprünglich war der Ruf ein Feueralarm-System: Der Wächter spähte nach Bränden, sein Ruf bewies, dass er wach war. Heute ist er der letzte seiner Art in Europa – und Lausanne denkt nicht daran, aufzuhören. Die Kathedrale selbst ist der bedeutendste gotische Bau der Schweiz; drinnen leuchtet eine Fensterrose, die das mittelalterliche Weltbild in Glas erzählt – Jahreszeiten, Elemente, Fabelwesen, das Universum in einem Kreis. Nimm dir Zeit für beides: das Bauwerk und den Gedanken, dass hier heute Nacht wieder jemand rufen wird. Danach geht es bergab – wörtlich, und zwar über die schönsten Treppen der Stadt.",
    },
    {
      id: "escaliers-du-marche",
      name: "Escaliers du Marché",
      teaser: "Die gedeckte Holztreppe – Lausannes meistfotografierte Abkürzung.",
      coords: { lat: 46.5227, lng: 6.6338 },
      walkMinutesFromPrevious: 2,
      directions: "Von der Esplanade direkt in die überdachte Treppe.",
      stayMinutes: 8,
      why: "Mittelalterliche Holztreppe mit Dach – die charmanteste Verbindung zwischen Ober- und Unterstadt.",
      story:
        "Seit dem 13. Jahrhundert verbindet diese gedeckte Treppe Kathedralenhügel und Marktplatz – damit Marktleute und Kirchgänger trockenen Fusses pendeln konnten. Das hölzerne Zickzack mit den schiefen Läden links und rechts ist heute das Instagram-Motiv der Stadt – und immer noch schlicht: der schnellste Weg nach unten.",
      funFact: "Die Treppe hat ihre eigene Adresse und Hausnummern – man kann offiziell «an der Treppe» wohnen.",
      insiderTip: "Auf halber Höhe kurz umdrehen: Der Blick treppauf zur Kathedrale ist das bessere Foto als treppab.",
      photoSpot: "Halbe Höhe, Blick nach oben zur Kathedrale.",
      audioScript:
        "Und jetzt: die schönste Abkürzung der Schweiz. Die Escaliers du Marché verbinden seit dem dreizehnten Jahrhundert die Kathedrale mit dem Marktplatz – eine gedeckte Holztreppe, die sich im Zickzack den Hang hinunterfaltet, gesäumt von windschiefen Häuschen, die aussehen, als hielten sie sich gegenseitig fest. Gebaut wurde sie aus purem Pragmatismus: Die Marktfrauen sollten trockenen Fusses zur Messe kommen und die Geistlichen trockenen Fusses zum Einkaufen. Sechshundert Jahre später ist der Nutzbau zum Liebling der Fotografen geworden – aber er funktioniert noch genauso: Es ist schlicht der schnellste Weg nach unten. Kleine Kuriosität: Die Treppe hat eine eigene Adresse mit Hausnummern – man kann in Lausanne offiziell an einer Treppe wohnen. Auf halber Höhe lohnt sich ein Stopp: Dreh dich um und schau treppauf – die Kathedrale thront über den Holzdächern, und du verstehst, warum diese Stadt in Ebenen denkt. Unten wartet der Platz, auf dem Lausanne seit Jahrhunderten verhandelt.",
    },
    {
      id: "place-de-la-palud",
      name: "Place de la Palud",
      teaser: "Rathaus, Gerechtigkeitsbrunnen und eine Uhr mit Stundenshow.",
      coords: { lat: 46.5219, lng: 6.6327 },
      walkMinutesFromPrevious: 3,
      directions: "Am Treppenfuss liegt der Platz direkt vor dir.",
      stayMinutes: 10,
      why: "Das bürgerliche Herz der Stadt – Markt, Rathaus und animierte Uhr im Stundentakt.",
      story:
        "Die Palud ist seit dem Mittelalter Lausannes Marktplatz: Rathaus von 1675, der älteste Brunnen der Stadt mit der Justitia – und an der Fassade darüber eine animierte Uhr, deren Figuren zu jeder vollen Stunde die Waadtländer Geschichte nachspielen. Mittwochs und samstags füllt der Markt den Platz bis in die Gassen.",
      funFact: "Die Figuren-Uhr läuft seit 1964 und erzählt in 90 Sekunden mehrere Jahrhunderte – die kompakteste Geschichtsstunde der Schweiz.",
      insiderTip: "Zur vollen Stunde kurz warten und hochschauen – danach in der Markthalle nebenan (Mittwoch/Samstag) ein Stück Waadtländer Saucisson ergattern.",
      photoSpot: "Justitia-Brunnen mit Rathausfassade.",
      audioScript:
        "Willkommen im bürgerlichen Wohnzimmer von Lausanne. Die Place de la Palud – der Name erinnert daran, dass hier mal Sumpf war – ist seit dem Mittelalter der Marktplatz der Stadt: Hier wurde verkauft, verkündet und verhandelt. Das Rathaus mit seiner barocken Fassade wacht seit 1675 über das Treiben, davor sprudelt der älteste Brunnen der Stadt, gekrönt von der Justitia mit Waage und Schwert. Und dann ist da noch das Stundenspektakel: An der Wand über dem Platz sitzt eine animierte Uhr, und zu jeder vollen Stunde setzen sich Figuren in Bewegung und spielen in neunzig Sekunden die Geschichte des Waadtlands nach – Bernerzeit, Revolution, Unabhängigkeit, alles im Schnelldurchlauf. Die kompakteste Geschichtslektion des Landes, kostenlos, stündlich. Falls Mittwoch oder Samstag ist, drängt sich zusätzlich der Markt über den Platz – dann gilt: Saucisson probieren, das Waadtland isst man am besten direkt. Von hier sind es nur ein paar Schritte – und ein Jahrhundertsprung – ins Flon.",
    },
    {
      id: "flon",
      name: "Le Flon",
      teaser: "Vom Lagerhaus-Tal zum Ausgehviertel – Lausannes urbanes Labor.",
      coords: { lat: 46.5208, lng: 6.6296 },
      walkMinutesFromPrevious: 5,
      directions: "Westwärts, die Rampen hinunter ins tiefergelegte Quartier.",
      stayMinutes: 20,
      why: "Ein komplettes Industrieviertel im Talgrund, umgebaut zu Clubs, Kinos, Rooftops – europaweit beachtet.",
      story:
        "Im 19. Jh. wurde der Fluss Flon überwölbt und sein Tal zum Warenumschlagplatz: Lagerhäuser, Gleise, Rampen. Als die Logistik wegzog, verfiel das Quartier – bis Lausanne es ab den 90ern neu erfand: Heute füllen Clubs, Galerien, Kinos und Boutiquen die alten Speicher, dazwischen kühne Neubauten. Tagsüber Shopping-Deck, nachts das Ausgehzentrum der Romandie.",
      funFact: "Unter dem Quartier fliesst immer noch der Fluss Flon – kanalisiert und unsichtbar; das ganze Viertel steht quasi auf einem Deckel.",
      insiderTip: "Auf eine der Rooftop-Terrassen steigen (z.B. beim zentralen Platz) – von oben liest sich das Lagerhaus-Raster perfekt.",
      photoSpot: "Zentrale Esplanade mit Industriefassaden und LED-Kuben.",
      audioScript:
        "Du steigst gerade in ein zugeschüttetes Flusstal hinab – und in Lausannes spannendstes Experiment. Unter deinen Füssen fliesst, unsichtbar in Röhren, der Fluss Flon: Im neunzehnten Jahrhundert wurde er überwölbt, und sein Tal füllte sich mit dem, was eine Handelsstadt braucht – Lagerhäuser, Rampen, Gleise. Hundert Jahre lang stapelte sich hier alles vom Weinfass bis zur Maschinenkiste. Dann zog die Logistik weg, und das Tal verfiel zum Schmuddelkind der Stadt: leer, dunkel, gemieden. Die Wende kam mit einer mutigen Idee – nicht abreissen, sondern umnutzen. Heute sind die Speicher Clubs, Kinos, Galerien und Läden, dazwischen leuchten neue Glaskuben, und nachts ist das Flon das Ausgehzentrum der ganzen Romandie. Das Quartier gilt europaweit als Lehrstück: Wie macht man aus toter Infrastruktur lebendigen Stadtraum, ohne die Industrie-Seele zu verkaufen? Stroller jetzt durchs Raster der alten Gassen, vielleicht hoch auf eine Rooftop-Terrasse – und dann bringt dich die steilste U-Bahn der Welt ans Wasser. Oder deine Beine, die Wahl ist deine.",
      nearby: [
        { name: "Flon-Rooftops & Bars", type: "bar", note: "Ab 17 Uhr erwacht das Quartier – Apéro über den Lagerhausdächern.", address: "Esplanade du Flon, 1003 Lausanne" },
      ],
    },
    {
      id: "ouchy-olympia",
      name: "Ouchy & Olympia-Hafen",
      teaser: "Hauptstadt des Sports: Hier wohnt das IOC – und der See glitzert dazu.",
      coords: { lat: 46.5066, lng: 6.6266 },
      walkMinutesFromPrevious: 20,
      directions: "Zu Fuss die Avenue d'Ouchy hinunter (20 Min.) oder mit der Metro M2 in 4 Minuten.",
      stayMinutes: 15,
      why: "Lausanne ist seit 1915 Olympia-Hauptstadt – Ouchy trägt das mit Museum, Park und Fackel-Skulpturen.",
      story:
        "1915 verlegte Pierre de Coubertin das IOC nach Lausanne – mitten im Weltkrieg suchte Olympia neutralen Boden. Seither ist die Stadt «Capitale Olympique»: 50+ Sportverbände residieren hier. In Ouchy erzählt das Olympische Museum die Geschichte, sein Skulpturenpark (gratis) stellt Sprinter und Turnerinnen ans Seeufer, und im Hafen schaukeln Boote vor Alpenkulisse.",
      funFact: "Im Museumspark brennt eine ewige olympische Flamme – Lausanne hat als einzige Stadt der Welt dauerhaft Feuer.",
      insiderTip: "Der Skulpturenpark zum See ist frei zugänglich – die berühmte Sprinter-Statue vor Seepanorama ist das Sport-Foto schlechthin.",
      photoSpot: "Hafenrund mit Belle-Époque-Hotels und Savoyer Alpen.",
      audioScript:
        "Unten angekommen – und du betrittst die Hauptstadt einer Weltbewegung. 1915, mitten im Ersten Weltkrieg, traf Pierre de Coubertin, der Erfinder der modernen Olympischen Spiele, eine Entscheidung: Olympia braucht neutralen Boden. Er verlegte das Internationale Olympische Komitee nach Lausanne – und es blieb. Heute nennt sich die Stadt offiziell Capitale Olympique, über fünfzig internationale Sportverbände haben hier ihren Sitz, vom Fussball-Schiedsgericht bis zum Tischtennis. In Ouchy zeigt sich das von seiner schönsten Seite: Das Olympische Museum thront über dem See, und sein Skulpturenpark – frei zugänglich – stellt Sprinter, Speerwerferinnen und Turner direkt ans Wasser. Dort brennt auch eine ewige olympische Flamme: Lausanne ist die einzige Stadt der Welt mit Dauerfeuer. Der Hafen selbst ist Belle Époque pur – Grandhotels, Platanen, Dampfschiffe, gegenüber die Savoyer Alpen. Noch hundert Meter zum letzten Stop: dem Quai, wo diese Tour im Abendlicht ausrollt.",
    },
    {
      id: "quai-ouchy",
      name: "Quai d'Ouchy – das Finale",
      teaser: "Seepromenade mit Mont-Blanc-Ahnung – Lausannes Belohnung fürs Bergablaufen.",
      coords: { lat: 46.5052, lng: 6.6293 },
      walkMinutesFromPrevious: 3,
      directions: "Vom Hafen auf die Uferpromenade.",
      stayMinutes: 20,
      why: "Der Quai ist die Sonnenterrasse der Stadt – Abendlicht über dem grössten See Westeuropas.",
      story:
        "Der Quai d'Ouchy flaniert seit der Belle Époque am Wasser entlang: Bootsstege, Glaciers, Blumenrabatten, Blick auf Évian drüben am französischen Ufer. Hier endet die Falllinie der Stadt – 500 Höhenmeter über dir ruft heute Nacht wieder der Wächter, und du sitzt am See und hast Lausanne von oben bis unten erlaufen.",
      funFact: "Der Genfersee ist der grösste See Westeuropas – und Lausanne mit seinen Höhenlagen die einzige Stadt, die ihn von der «Tribüne» aus betrachtet.",
      insiderTip: "Glace am Quai-Stand holen und auf die Mole hinauslaufen – der klassische Lausanner Abend-Abschluss.",
      photoSpot: "Mole mit Hafenlicht und Alpen-Silhouette zur blauen Stunde.",
      audioScript:
        "Geschafft – fünfhundert Höhenmeter Stadt liegen hinter dir, beziehungsweise über dir. Setz dich auf die Quaimauer und sortier kurz: Da oben, wo der Turm in den Himmel sticht, wird heute Nacht wieder gerufen – sechshundert Jahre Tradition, du weisst jetzt warum. Darunter falten sich die Treppen, die Plätze, das versunkene Flusstal mit seinen Clubs. Und hier unten: der grösste See Westeuropas, der im Abendlicht liegt, als wäre er dafür bestellt. Drüben funkelt Frankreich – Évian, ja, das mit dem Wasser. Lausanne ist die einzige Stadt, die diesen See von der Tribüne aus geniesst, Reihe eins bis Reihe dreihundert, und du hast heute alle Ränge durchschritten. Der korrekte Abschluss ist eine Glace vom Stand und ein langsamer Gang auf die Mole hinaus. Bergab kann so schön sein. Und falls dir nach Wiederholung ist: Die Metro M2, die steilste U-Bahn der Welt, fährt in vier Minuten wieder hoch. Lausanne hat an alles gedacht. Bis zum nächsten Trail!",
      nearby: [
        { name: "Glaciers am Quai", type: "cafe", note: "Glace-Stände mit Kultstatus – das Abend-Ritual von Ouchy.", address: "Quai d'Ouchy, 1006 Lausanne" },
      ],
    },
  ],
};
