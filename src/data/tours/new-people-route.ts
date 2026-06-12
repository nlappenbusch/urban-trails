import type { Tour } from "@/lib/types";

export const newPeopleRoute: Tour = {
  slug: "new-people-route",
  citySlug: "zuerich",
  category: "people-social",
  name: "New People Route",
  claim: "Diese Tour endet nicht an Gebäuden – sie endet bei Menschen. Mit einer Mikro-Aufgabe pro Stop.",
  teaser:
    "Sechs Orte, an denen Gespräche von selbst passieren – und bei jedem Stop eine kleine Aufgabe, die das Eis bricht. Für Neu-Zuzüger, Solos und alle, die Anschluss suchen.",
  description:
    "Neue Leute kennenzulernen ist in der Schweiz angeblich schwer. Stimmt – wenn man an den falschen Orten wartet. Diese Tour führt zu sechs Zürcher Spots, deren Architektur Gespräche erzwingt: Gemeinschaftstische, Pingpong-Platten, Buchhandlungs-Bars, Flussbäder. Und weil Hingehen allein nicht reicht, bekommst du bei jedem Stop eine Mikro-Aufgabe – klein genug, um machbar zu sein, gross genug, um etwas auszulösen: eine Empfehlung erfragen, ein Match spielen, einen Gemeinschaftstisch wählen. Du brauchst keinen Smalltalk-Kurs. Du brauchst die richtigen Orte und einen Vorwand. Beides liefert diese Route.",
  moods: ["menschen", "essen", "ueberraschung"],
  audience: "Neu-Zuzüger, Expats, Solo-Traveller, Homeoffice-Vereinsamte – alle, die heute mit mehr Kontakten heimkommen wollen als losgegangen sind.",
  vibe: "Mutig light: niederschwellige Challenges, freundliche Orte, null Zwang – jede Aufgabe ist optional.",
  bestTimeOfDay: "Später Nachmittag bis Abend (ab ca. 16 Uhr) – die Orte füllen sich mit Feierabend-Publikum.",
  bestSeason: "Ganzjährig; im Sommer mit Letten-Finale unschlagbar, im Winter verlagert sich Stop 6 in die Bar.",
  difficulty: "leicht",
  durationMinutes: 180,
  distanceKm: 4.5,
  startPoint: "Europaallee / Bahnhof Zürich",
  endPoint: "Oberer Letten",
  publicTransport: {
    start: "Zürich HB, Ausgang Europaallee",
    end: "Tram 4/13/17 «Limmatplatz», 5 Min. zu Fuss",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#6b1f4a", "#ff7a3d"],
  seo: {
    metaTitle: "New People Route Zürich: Die Tour zum Leute-Kennenlernen | Urban Trails",
    metaDescription:
      "Die Social-Tour durch Zürich: 6 Orte mit hoher Gesprächswahrscheinlichkeit, Social-Check und einer Mikro-Aufgabe pro Stop. Für Neu-Zuzüger, Expats und Solo-Traveller.",
    keywords: ["Zürich Leute kennenlernen","Zürich neu zugezogen Tipps","Zürich alleine unterwegs","Expats Zürich Treffpunkte","Social Tour Zürich"],
  },
  faq: [
    { question: "Muss ich die Aufgaben machen?", answer: "Nein – alles ist optional. Aber die Aufgaben sind bewusst winzig: eine Frage stellen, einen Platz wählen. Die Erfahrung zeigt: Aufgabe 1 ist die schwerste, danach läuft es von allein." },
    { question: "Ist das nicht awkward?", answer: "Die Orte sind so gewählt, dass Ansprechen dort normal ist – an einem Gemeinschaftstisch oder einer Pingpong-Platte wundert sich niemand über Kontakt. Du nutzt nur Strukturen, die es schon gibt." },
    { question: "Funktioniert die Tour alleine?", answer: "Sie ist genau dafür gebaut. Zu zweit funktioniert sie auch – dann gilt: getrennt Aufgaben lösen, gemeinsam debriefen." },
    { question: "Welcher Wochentag ist ideal?", answer: "Donnerstag und Freitag ab 17 Uhr sind die sozialsten Zeitfenster der Stadt. Sonntagnachmittag funktioniert für die Park-Stops am besten." },
  ],
  stops: [
    {
      id: "europaallee",
      name: "Europaallee & Kaffeebar-Start",
      teaser: "Warm-up im neuen Quartier – mit der einfachsten Aufgabe zum Eingrooven.",
      coords: { lat: 47.3781, lng: 8.5345 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 20,
      why: "Hohe Dichte an Specialty-Coffee-Theken mit Stehplätzen – ideale Trainingsumgebung für Aufgabe 1.",
      story:
        "Die Europaallee ist Zürichs jüngstes Quartier – poliert, urban, voller Pendler und Studierender der angrenzenden PH. Entscheidend für dich: Die Kaffeebars hier haben Theken statt Tischchen, und an Theken redet man. Baristas sind ausserdem die unterschätztesten Stadtführer überhaupt – niemand kennt das Quartier besser.",
      funFact: "Auf dem Areal stand früher die grösste Postverladeanlage der Schweiz – heute werden hier statt Paketen Flat Whites durchgereicht.",
      insiderTip:
        "🎯 DEINE AUFGABE 1: Bestell deinen Kaffee an der Theke und frag die Barista: «Wo würdest DU heute Abend essen gehen – nicht für Touristen, ehrlich?» Notier dir die Antwort. Das ist dein Eisbrecher-Training: eine Frage, ein Mensch, null Risiko.",
      photoSpot: "Lange Treppenflucht der Europaallee Richtung Gleisfeld.",
      social: {
        alleinOk: "Perfekt – Thekenkultur, hohe Solo-Quote.",
        gespraech: "Mittel bis hoch an der Theke; Baristas antworten immer.",
        publikum: "Pendler, Studierende, Kreativbüros – 20–40.",
        besteZeit: "Werktags 8–18 Uhr.",
      },
      audioScript:
        "Willkommen zur Tour, die anders endet als alle anderen – nämlich bei Menschen. Bevor du die Augen verdrehst: Niemand verlangt, dass du Fremde anquatschst wie ein Staubsaugervertreter. Diese Route nutzt einen Trick: Es gibt Orte, deren Bauweise Gespräche automatisch erzeugt – Theken, Gemeinschaftstische, Spielfelder. Du musst nur hingehen und die Strukturen nutzen. Wir starten im Übungsmodus, an der Europaallee. Die Kaffeebars hier haben Theken, und an einer Theke zu reden ist so normal wie an einer Bushaltestelle zu schweigen. Deine erste Aufgabe ist winzig: Bestell einen Kaffee und frag die Person hinter der Maschine nach ihrem ehrlichen Abendessens-Tipp – nicht für Touristen. Das ist alles. Eine Frage. Baristas beantworten sie gern, meistens ausführlich, manchmal mit Herzblut. Was du dabei trainierst: die Schwelle. Wer einmal gefragt hat, fragt wieder. Kaffee austrinken, Antwort notieren – die Empfehlung brauchst du vielleicht heute Abend noch. Weiter geht's ins Quartier, wo Zürich am gesprächigsten ist.",
    },
    {
      id: "kanzlei-flohmarkt-social",
      name: "Kanzleiareal & Xenix-Garten",
      teaser: "Feilschen ist Smalltalk mit Ziel – der einfachste Ort der Stadt, um zu reden.",
      coords: { lat: 47.3763, lng: 8.5246 },
      walkMinutesFromPrevious: 12,
      directions: "Über die Lagerstrasse Richtung Helvetiaplatz, dahinter liegt das Kanzleiareal.",
      stayMinutes: 25,
      why: "Samstags Flohmarkt (Gespräch eingebaut), sonst Xenix-Gartenbar mit den geselligsten Bänken des Kreis 4.",
      story:
        "Am Flohmarkt zu schweigen ist fast unmöglich – jede Frage nach einem Preis ist ein Gesprächsanfang, jedes Objekt eine Geschichte. Und ausserhalb des Samstags übernimmt der Xenix-Garten: lange Bänke, durchmischtes Publikum, Kino-Gesprächsstoff inklusive.",
      funFact: "Flohmarkt-Psychologie: Wer ein Objekt in die Hand nimmt, bekommt in 90 % der Fälle ungefragt seine Geschichte erzählt – nutze das.",
      insiderTip:
        "🎯 DEINE AUFGABE 2: Samstags – handle bei einem Objekt den Preis um mindestens 2 Franken runter (freundlich!). Unter der Woche – setz dich im Xenix-Garten an einen Tisch, an dem schon jemand sitzt, nicht an den leeren daneben.",
      photoSpot: "Flohmarkt-Wimmelbild mit Xenix-Baracke im Hintergrund.",
      social: {
        alleinOk: "Sehr gut – Flohmarkt und Gartenbar sind klassische Solo-Territorien.",
        gespraech: "Sehr hoch samstags; hoch abends im Garten.",
        publikum: "Sammler, Künstler, Quartier, Cinephile – bunt wie sonst nirgends.",
        besteZeit: "Sa 9–16 Uhr (Markt); sonst ab 17 Uhr (Garten).",
      },
      audioScript:
        "Stufe zwei – und jetzt wird es fast unfair einfach. Falls heute Samstag ist, stehst du gleich auf dem besten Gesprächs-Trainingsgelände der Stadt: dem Kanzlei-Flohmarkt. Feilschen ist nämlich nichts anderes als Smalltalk mit eingebautem Zweck. Du musst dir kein Thema ausdenken – das Thema liegt auf dem Tisch, kostet fünfzehn Franken und du findest, zwölf wären fair. Deine Aufgabe: Handle irgendwo den Preis runter, mindestens zwei Franken, mit einem Lächeln. Dabei passiert das Eigentliche: Der Händler erzählt dir, woher das Ding stammt, du erzählst, wofür du es brauchst – und schon hast du geredet, verhandelt, vielleicht gelacht. Kein Samstag? Dann gilt die Garten-Variante: Im Xenix-Hof setzt du dich an einen Tisch, an dem schon jemand sitzt. Nicht an den freien daneben – an den besetzten. Das ist hier völlig normal, die Bänke sind lang, der Platz knapp, und ein «Ist hier noch frei?» ist die älteste Türöffner-Frage der Welt. Sie funktioniert seit Jahrhunderten. Auch heute.",
    },
    {
      id: "markthalle-gemeinschaftstisch",
      name: "Markthalle im Viadukt",
      teaser: "Gemeinschaftstische sind Geständnisse: Hier will man nicht allein essen.",
      coords: { lat: 47.3857, lng: 8.5247 },
      walkMinutesFromPrevious: 15,
      directions: "Durch den Kreis 4 nordwärts, über die Langstrasse-Unterführung zum Viadukt.",
      stayMinutes: 30,
      why: "Die Markthalle hat lange Gemeinschaftstische – die ehrlichste Esskultur der Stadt, Kontakt eingebaut.",
      story:
        "Unter den Bahnbögen isst man an langen Holztischen, Schulter an Schulter mit Fremden – das Konzept stammt aus Markthallen weltweit und funktioniert überall gleich: Wer sein Essen teilt (den Tisch jedenfalls), teilt irgendwann Worte. Die Stände wechseln, das Publikum bleibt neugierig.",
      funFact: "Über deinem Kopf donnern beim Essen die Züge – der klassische Gesprächseinstieg hier ist schlicht: «Spürt man die eigentlich irgendwann nicht mehr?»",
      insiderTip:
        "🎯 DEINE AUFGABE 3: Iss am Gemeinschaftstisch und stell deinen Tischnachbarn EINE Frage zu ihrem Essen («Was ist das? Sieht besser aus als meins.»). Essen ist das sicherste Gesprächsthema der Menschheit.",
      photoSpot: "Längs durch die Halle: Bögen, Stände, lange Tische.",
      social: {
        alleinOk: "Ideal – Solo-Esser sind hier die Norm, nicht die Ausnahme.",
        gespraech: "Hoch am Gemeinschaftstisch, besonders mittags und ab 18 Uhr.",
        publikum: "Foodies, Büro-Crowds, Anwohner – gesprächsbereit.",
        besteZeit: "12–13:30 oder 18–20 Uhr.",
      },
      audioScript:
        "Zeit für die Königsdisziplin in freundlicher Verpackung: der Gemeinschaftstisch. Die Markthalle im Viadukt funktioniert wie Markthallen auf der ganzen Welt – lange Holztische, fremde Ellbogen, dampfende Teller. Und sie verrät ein offenes Geheimnis: Wer sich hierher setzt statt ins Séparée, hat nichts gegen Gesellschaft. Deine Aufgabe ist die einfachste Frage der Kulinarik-Geschichte: Schau auf den Teller deiner Tischnachbarin und frag, was das ist – mit dem Zusatz, dass es besser aussieht als deins. Essen ist das sicherste Smalltalk-Thema der Menschheit: Jeder hat eine Meinung, niemand fühlt sich ausgefragt, und die Antwort dauert selten unter einer Minute. Während du isst, übrigens: Alle paar Minuten donnert über dir ein Zug durch – und falls dein Gespräch stockt, ist genau das der Rettungsanker. «Hört man die irgendwann nicht mehr?» hat hier schon hundert Unterhaltungen gerettet. Lass dir Zeit an diesem Stop. Satt und gesprächswarm läuft sich der Rest der Route von allein.",
    },
    {
      id: "josefwiese-pingpong",
      name: "Josefwiese – Pingpong & Kiosk",
      teaser: "Eine Pingpong-Platte ist eine Einladung mit Netz.",
      coords: { lat: 47.3866, lng: 8.5266 },
      walkMinutesFromPrevious: 5,
      directions: "Am Ende des Viadukts liegt die Wiese – Platten beim Kiosk.",
      stayMinutes: 25,
      why: "Sport ist der älteste Kontakt-Beschleuniger: Beim Spiel verschwinden Smalltalk-Hürden von selbst.",
      story:
        "Die Pingpong-Platten auf der Josefwiese sind Quartier-Institution: Schläger gibt's am Kiosk zu leihen, Rundlauf ist Standard, und wer am Rand wartet, wird traditionell reingewinkt. Sport schlägt Konversation – man muss nichts sagen und redet trotzdem.",
      funFact: "Rundlauf («Chinesisch») ist das sozialste Spielformat der Welt: Es funktioniert ab drei Personen und skaliert beliebig – Fremde inklusive.",
      insiderTip:
        "🎯 DEINE AUFGABE 4: Leih am Kiosk einen Schläger und frag die nächste Gruppe an der Platte, ob du beim Rundlauf einsteigen kannst. Erfolgsquote erfahrungsgemäss: nahe 100 %. Alternative bei leerer Platte: Frag am Kiosk, wann hier am meisten los ist.",
      photoSpot: "Platte im Vordergrund, Viaduktbögen dahinter.",
      social: {
        alleinOk: "Gut – mit Schläger in der Hand bist du Mitspieler, nicht Beobachter.",
        gespraech: "Sehr hoch beim Spiel; der Kiosk ist Plan B.",
        publikum: "Quartier-Mix 8–80, sportlich-locker.",
        besteZeit: "Schönwetter-Abende und Sonntage.",
      },
      audioScript:
        "Jetzt wird gespielt – wörtlich. Sport ist der älteste Trick, um Distanz zu überbrücken: Beim Spiel gibt es Regeln, Rollen und ein gemeinsames Ziel, und das Reden passiert nebenbei, ohne Druck. Die Pingpong-Platten hier auf der Josefwiese sind dafür perfekt: Schläger leihst du dir für ein paar Franken am Kiosk, und das Standardformat ist Rundlauf – alle rennen um die Platte, wer den Ball versemmelt, fliegt raus. Rundlauf hat eine wunderbare Eigenschaft: Je mehr Leute, desto lustiger. Deshalb wird, wer am Rand steht und interessiert schaut, traditionell reingewinkt. Deine Aufgabe: Hol dir einen Schläger und frag die nächste Gruppe, ob du einsteigen kannst. Die Antwort ist praktisch immer ja – du erhöhst schliesslich den Spielwert. Drei Runden später kennst du Vornamen, hast über verschossene Bälle gelacht und das Eis ist nicht gebrochen, sondern geschmolzen. Falls die Platte leer ist: Kiosk-Aufgabe – frag, wann hier am meisten läuft. Die Antwort ist dein Insider-Wissen für nächstes Mal.",
    },
    {
      id: "spheres-buchbar",
      name: "Sphères – Buch & Bar",
      teaser: "Buchhandlung plus Bar: Hier ist das Gesprächsthema schon im Regal.",
      coords: { lat: 47.3905, lng: 8.5152 },
      walkMinutesFromPrevious: 15,
      directions: "Über die Hardturmstrasse Richtung Schiffbau – Sphères liegt am Turbinenplatz.",
      stayMinutes: 30,
      why: "Die Buch-Bar ist Zürichs Wohnzimmer für Alleinkommende: Lesen ist hier Gesellschaftsform, nicht Rückzug.",
      isHiddenGem: true,
      story:
        "Sphères kombiniert seit 20 Jahren Buchhandlung, Café und Bar – ein Ort, an dem Alleinsein in Gesellschaft erfunden wurde. Abends Lesungen und Veranstaltungen; tagsüber sitzen hier Menschen mit Büchern, Laptops und erstaunlich offener Körpersprache. Ein Buch in der Hand ist das beste Gesprächsangebot: Man sieht sofort, womit du dich beschäftigst.",
      funFact: "Studien zeigen: Menschen mit Buch werden häufiger angesprochen als Menschen mit Handy – das Buch signalisiert Musse, das Handy Abschottung.",
      insiderTip:
        "🎯 DEINE AUFGABE 5: Nimm ein Buch aus dem Regal, das dich wirklich interessiert, bestell ein Getränk und leg das Buch sichtbar auf den Tisch. Bonus: Frag die Person am Nachbartisch, was SIE liest. In einer Buch-Bar ist das keine Anmache, sondern Hausordnung.",
      photoSpot: "Bücherregal-Wand mit Bar-Licht.",
      social: {
        alleinOk: "Der vielleicht beste Solo-Ort der Stadt.",
        gespraech: "Mittel – aber von hoher Qualität; bei Lesungen hoch.",
        publikum: "Lesende, Kreative, ruhige Gesellige – 25–55.",
        besteZeit: "Abends; Veranstaltungskalender lohnt den Blick.",
      },
      audioScript:
        "Der nächste Stop ist für die leiseren Töne – und er ist mein Lieblingsort für eine bestimmte Sorte Begegnung. Sphères ist Buchhandlung und Bar in einem: Du kannst ein Buch aus dem Regal nehmen, ein Glas Wein bestellen und beides gleichzeitig geniessen. Das Geniale daran: Ein Buch auf deinem Tisch ist eine offene Visitenkarte. Jeder sieht, wofür du dich interessierst – und Bücher sind, anders als Handys, eine Einladung. Tatsächlich werden Menschen mit Buch deutlich öfter angesprochen als Menschen am Bildschirm: Das Buch sagt «Ich habe Zeit und Tiefe», das Handy sagt «Stör mich nicht». Deine Aufgabe hier ist entsprechend sanft: Such dir ein Buch aus, das dich ehrlich packt, leg es sichtbar hin – und wenn du mutig bist, frag am Nachbartisch, was dort gelesen wird. In einer Buch-Bar ist das keine Grenzüberschreitung, das ist der Sinn des Ladens. Manche der besten Gespräche dieser Stadt haben mit dem Satz begonnen: Und, ist es gut?",
      nearby: [
        { name: "Sphères", type: "bar", note: "Buchhandlung, Café, Bar, Bühne – alles in einem.", address: "Hardturmstrasse 66, 8005 Zürich" },
      ],
    },
    {
      id: "letten-finale-social",
      name: "Oberer Letten – das Social-Finale",
      teaser: "Flussbad, Bar, Sonnenuntergang – und deine Abschluss-Aufgabe ist die schönste.",
      coords: { lat: 47.3856, lng: 8.5356 },
      walkMinutesFromPrevious: 20,
      directions: "Zurück Richtung Limmat, dem Wasser entlang zum Letten-Areal.",
      stayMinutes: 35,
      why: "Am Letten sitzt die ganze Stadt dicht an dicht am Wasser – die natürlichste Begegnungszone Zürichs.",
      story:
        "Holzdecks, Flussrauschen, Bars: Der Obere Letten ist im Sommer Zürichs verdichtetes Sozialleben. Man sitzt nah, teilt Sonnenplätze, kommentiert Schwimmer – die Hemmschwellen sind so niedrig wie das Wasser schnell. Im Winter übernimmt die Quartierbar die Rolle: drinnen, wärmer, gleicher Effekt.",
      funFact: "Die Letten-Decks haben keine Einzelplätze – die Architektur kennt nur Bank und Boden, und beide muss man teilen.",
      insiderTip:
        "🎯 DEINE ABSCHLUSS-AUFGABE: Nutze die Barista-Empfehlung von Aufgabe 1 – erzähl jemandem hier davon («Mir wurde heute X empfohlen, kennst du das?»). Du schliesst damit den Kreis: Aus einer erfragten Info wird ein verschenktes Gespräch. So funktioniert Anschluss.",
      photoSpot: "Vom Deck flussaufwärts in den Sonnenuntergang.",
      social: {
        alleinOk: "Sehr gut – Solo-Sitzen am Deck ist Standard.",
        gespraech: "Hoch ab Feierabend; sehr hoch bei Sonnenuntergang.",
        publikum: "Ganz Zürich unter 45, plus die weisen Älteren mit Stammplatz.",
        besteZeit: "17 Uhr bis Sonnenuntergang, Mai–September.",
      },
      audioScript:
        "Finale – und zwar dort, wo Zürich am dichtesten zusammenrückt. Die Holzdecks am Oberen Letten kennen keine Einzelplätze: Es gibt Bänke und Boden, und beides teilt man sich. Genau deshalb passieren hier mehr spontane Gespräche als irgendwo sonst in der Stadt – über die Wassertemperatur, über den Hund, der gerade ins Wasser springt, über nichts Besonderes. Nichts Besonderes ist der beste Gesprächsstoff der Welt. Deine letzte Aufgabe schliesst den Kreis dieser Tour: Erinnerst du dich an die Restaurant-Empfehlung der Barista von heute Nachmittag? Erzähl jemandem hier davon. «Mir wurde heute dieser Ort empfohlen – kennst du den?» Damit verwandelst du eine erhaltene Information in ein verschenktes Gespräch – und genau so entsteht Zugehörigkeit: nicht durch grosse Auftritte, sondern durch weitergereichte Kleinigkeiten. Sechs Stops, fünf Aufgaben, wahrscheinlich ein paar Namen mehr im Kopf als heute Morgen. Das Schöne: Die Orte bleiben. Du kannst jede dieser Übungen wiederholen, so oft du willst. Zürich ist nicht verschlossen. Es wartet nur auf den ersten Satz.",
      nearby: [
        { name: "Primitivo Bar", type: "bar", note: "Flussaufwärts am Wasser – der Sundowner-Klassiker.", address: "Wasserwerkstrasse, 8037 Zürich" },
      ],
    },
  ],
};
