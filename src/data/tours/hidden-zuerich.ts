import type { Tour } from "@/lib/types";

export const hiddenZuerich: Tour = {
  slug: "hidden-zuerich",
  citySlug: "zuerich",
  category: "urban-vibes",
  name: "Hidden Zürich",
  claim: "Das Zürich, das nicht in den Reiseführern steht – Industrie, Streetart und Orte mit Charakter.",
  teaser:
    "Kreis 5 statt Bahnhofstrasse: Josefwiese, Negrellisteg, Freitag-Tower, Viadukt und das wilde Erbe von Zürich-West.",
  description:
    "Diese Tour zeigt dir das Zürich der Zürcher: das ehemalige Industriequartier im Kreis 5, wo Schiffsmotoren gebaut wurden und heute Festivals, Flohmärkte und die beste Aussicht von einem Container-Turm zu Hause sind. Du läufst über den Negrellisteg über ein Gleismeer, kletterst auf den Freitag-Tower, isst dich durch die Markthalle und endest dort, wo Zürich am ehrlichsten ist: am Wasser des Oberen Lettens. Mindestens acht der elf Stops kennt kein Standard-Reiseführer.",
  moods: ["fotografie", "menschen", "kultur", "ueberraschung"],
  audience: "Wiederholungsbesucher, Expats, Neu-Zuzüger, Foto-Fans – alle, die das echte Zürich suchen.",
  vibe: "Urban, rau, kreativ – Backstein, Stahl, Streetart und überraschend viel Gemütlichkeit.",
  bestTimeOfDay: "Nachmittag bis Sonnenuntergang – der Freitag-Tower im Abendlicht ist Pflicht.",
  bestSeason: "Frühling bis Herbst; im Sommer mit Badesachen für den Oberen Letten.",
  difficulty: "leicht",
  durationMinutes: 180,
  distanceKm: 5.8,
  startPoint: "Bahnhof Hardbrücke",
  endPoint: "Oberer Letten",
  publicTransport: {
    start: "S-Bahn Hardbrücke (S3/S5/S6/S7/S9/S12/S15/S16), Tram 8, Bus 33/72",
    end: "Tram 4/13/17 «Limmatplatz», 5 Min. zu Fuss",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#3d1d54", "#f25c1f"],
  imageHint: "Freitag-Tower aus Frachtcontainern vor Prime Tower im Abendlicht",
  seo: {
    metaTitle: "Hidden Zürich: Geheimtipps-Tour durch Zürich-West mit Audioguide | Urban Trails",
    metaDescription:
      "Zürich abseits der Touristenpfade: 11 Stops durch Kreis 5 – Freitag Tower, Negrellisteg, Josefwiese, Im Viadukt, Frau Gerolds Garten und Oberer Letten. Selbstgeführte Tour mit Karte und Audio.",
    keywords: [
      "Zürich Geheimtipps",
      "Zürich Hidden Gems",
      "Zürich West Tour",
      "Zürich abseits Touristen",
      "Kreis 5 Zürich Sehenswürdigkeiten",
    ],
  },
  faq: [
    {
      question: "Ist die Tour auch für Zürcher interessant?",
      answer:
        "Gerade für Zürcher: Viele kennen die Orte einzeln, aber nicht ihre Geschichten – vom Bierkartell bis zur Hausbesetzer-Geschichte des Lettens.",
    },
    {
      question: "Warum ist die Tour Premium?",
      answer:
        "Sie enthält recherchierte Geschichten und Insider-Spots, die in keinem Reiseführer stehen, plus voll ausgearbeitete Audioguide-Skripte. Vorschau auf alle Stops ist gratis.",
    },
    {
      question: "Kann ich im Oberen Letten wirklich schwimmen?",
      answer:
        "Ja – von Mai bis September ist das Flussbad offen und gratis. Die Strömung trägt dich sanft den Kanal hinunter. Locals-Erlebnis Nummer eins.",
    },
    {
      question: "Ist die Tour abends machbar?",
      answer:
        "Sehr gut sogar – Frau Gerolds Garten, Viadukt-Bars und der Letten leben abends auf. Nur der Freitag-Tower schliesst mit dem Laden.",
    },
    {
      question: "Wie viel Geld sollte ich einplanen?",
      answer:
        "Die Tour selbst braucht nichts. Für Markthalle, Kaffee und ein Feierabendbier sind 20–40 Franken realistisch.",
    },
    {
      question: "Funktioniert die Tour bei Regen?",
      answer:
        "Teilweise – Viadukt und Markthalle sind gedeckt, der Rest ist Open Air. Bei Dauerregen lieber die Klassiker-Tour mit Kirchen und Museen.",
    },
  ],
  stops: [
    {
      id: "hardbruecke",
      name: "Bahnhof Hardbrücke & Prime Tower",
      teaser: "Zürichs Manhattan-Moment: Glas, Gleise und der einst höchste Turm der Schweiz.",
      coords: { lat: 47.38515, lng: 8.51742 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 10,
      why: "Der perfekte Einstieg: Hier siehst du das neue Zürich, bevor du sein altes Industrieherz erkundest.",
      story:
        "Der Prime Tower (126 m, 2011) war bis 2015 das höchste Hochhaus der Schweiz – gebaut auf dem Gelände der ehemaligen Maag-Zahnräderfabrik. Sein grünliches Glas wechselt mit dem Himmel die Farbe. Rundherum: das Labor der Stadt – wo vor 30 Jahren noch geschweisst, gegossen und gestreikt wurde, wird heute gegessen, gegründet und gefeiert.",
      funFact:
        "Im 35. Stock liegt die Clouds Bar – der Kaffee kostet kaum mehr als unten, die Aussicht ist gratis dazu.",
      insiderTip:
        "Clouds Bar statt teurem Aussichtspunkt: Espresso bestellen, Fensterplatz suchen, ganz Zürich liegt dir zu Füssen.",
      photoSpot: "Von der Hardbrücke-Plattform: Prime Tower spiegelt den Himmel.",
      audioScript:
        "Willkommen im anderen Zürich. Keine Kirchtürme, keine Gassen – stattdessen Gleise, Beton und ein Turm aus grünem Glas, der je nach Wetter die Farbe wechselt. Der Prime Tower war bei seiner Eröffnung das höchste Hochhaus der Schweiz, und er steht nicht zufällig genau hier: Unter seinem Fundament liegt die Geschichte der Maag-Zahnräderfabrik, eines der grossen Industriebetriebe, die dieses Quartier hundert Jahre lang prägten. Zürich-West war Malocher-Land – Schiffsmotoren, Zahnräder, Seifen, Bier. Als die Industrie in den Neunzigern wegzog, blieb eine riesige Brache mitten in der Stadt. Und dann passierte das Spannende: Statt alles abzureissen, liess man das Quartier sich selbst neu erfinden. Clubs in Fabrikhallen, Theater im Schiffbau, Start-ups in Lagerhäusern. Auf dieser Tour siehst du das Resultat – und ein paar Orte, die selbst viele Zürcher nicht kennen. Kleiner Tipp gleich zu Beginn: Im fünfunddreissigsten Stock des Turms gibt es eine Bar. Der Kaffee kostet fast normal viel – die Aussicht ist geschenkt.",
    },
    {
      id: "freitag-tower",
      name: "Freitag Tower",
      teaser: "19 rostige Frachtcontainer, gestapelt zum Kult-Turm – oben: Gratis-Aussicht.",
      coords: { lat: 47.38524, lng: 8.52041 },
      walkMinutesFromPrevious: 4,
      directions: "Von der Hardbrücke der Geroldstrasse entlang – der Containerturm ist unübersehbar.",
      stayMinutes: 20,
      why: "Das Wahrzeichen von Zürich-West: Flagship-Store der Freitag-Taschen und kostenloser Aussichtsturm in einem.",
      story:
        "1993 nähten die Brüder Markus und Daniel Freitag aus alten LKW-Planen eine Velokurier-Tasche – heute ist Freitag eine Weltmarke und das Paradebeispiel für Schweizer Upcycling-Design. Ihr Flagship-Store: 19 ausrangierte, verrostete Schiffscontainer, 26 Meter hoch gestapelt. Jede Tasche im Laden ist ein Unikat aus echter, gebrauchter LKW-Plane.",
      funFact:
        "Die Container haben ihre alten Frachtnummern behalten – jeder ist tatsächlich um die Welt gefahren, bevor er hier in Rente ging.",
      insiderTip:
        "Die Plattform ganz oben ist gratis zugänglich (während Ladenöffnungszeiten) – bester kostenloser Fotospot über die Gleise.",
      photoSpot: "Von oben: Gleisfeld, Prime Tower und bei Föhn die Alpen. Von unten: Container-Stapel im Gegenlicht.",
      isHiddenGem: true,
      audioScript:
        "Neunzehn rostige Schiffscontainer, aufeinandergestapelt wie von einem Riesenkind – das ist kein Kunstwerk, das ist ein Laden. Und was für einer. Die Geschichte beginnt 1993 mit zwei Brüdern, Markus und Daniel Freitag, beide Grafiker, beide Velofahrer, beide genervt davon, dass ihre Taschen im Zürcher Regen durchweichten. Ihre Lösung: alte LKW-Planen, Sicherheitsgurte, Veloschläuche – zusammengenäht zur unzerstörbaren Kuriertasche. Aus der WG-Idee wurde eine Weltmarke. Heute hängen Freitag-Taschen in Tokio, New York und Berlin – und jede einzelne ist ein Unikat, geschnitten aus einer echten, gefahrenen LKW-Plane. Der Turm hier ist ihr Flagship-Store, gebaut aus ausrangierten Frachtcontainern, die alle tatsächlich jahrelang über die Weltmeere geschippert sind – die Frachtnummern sind noch drauf. Und jetzt der beste Teil: Steig hoch. Ganz oben ist eine Aussichtsplattform, kostenlos. Von dort siehst du das ganze Gleisfeld, den Prime Tower und an klaren Tagen die Alpen. Zürichs ehrlichste Aussicht – von einem Turm aus Schrott.",
    },
    {
      id: "frau-gerolds-garten",
      name: "Frau Gerolds Garten",
      teaser: "Stadtgarten, Sommerbar und Wintergrill zwischen Containern und Gemüsebeeten.",
      coords: { lat: 47.38556, lng: 8.52114 },
      walkMinutesFromPrevious: 2,
      directions: "Direkt neben dem Freitag Tower – Eingang an der Geroldstrasse.",
      stayMinutes: 20,
      why: "Zürichs charmantester Zwischennutzungs-Ort: Hier trinkt die Stadt ihren Feierabend.",
      story:
        "2012 als «Zwischennutzung» auf einer Industriebrache gestartet, ist Frau Gerolds Garten längst Institution: Sommerbeiz, Wintergrill, Urban Gardening, Kunst und Flohmarkt-Atmosphäre zwischen bemalten Containern. Der Name spielt auf die Geroldstrasse an – eine Frau Gerold gab es nie. Im Sommer sitzen hier 600 Leute zwischen Tomatenbeeten und Lichterketten.",
      funFact:
        "Das Gemüse aus den Hochbeeten landet tatsächlich in der Küche – Garten-to-Table im Wortsinn.",
      insiderTip:
        "Im Winter nicht abschrecken lassen: Dann gibt's Fondue und Feuer – die gemütlichste Jahreszeit des Gartens.",
      photoSpot: "Treppe zur zweiten Container-Ebene: Lichterketten, Garten und Prime Tower in einem Bild.",
      isHiddenGem: true,
      nearby: [
        {
          name: "Frau Gerolds Garten",
          type: "bar",
          note: "Du bist schon da – hol dir was zu trinken und such dir ein Plätzchen zwischen den Beeten.",
          address: "Geroldstrasse 23, 8005 Zürich",
        },
      ],
      audioScript:
        "Falls du dich je gefragt hast, wie Zürich entspannt: genau so. Frau Gerolds Garten ist eine Mischung aus Schrebergarten, Sommerbar, Kunstinstallation und Wohnzimmer – zusammengewürfelt aus bunten Containern, Holztischen und Gemüsebeeten, zwischen denen abends die Lichterketten glühen. Das Verrückteste daran: Offiziell war das hier nie für die Ewigkeit gedacht. 2012 als Zwischennutzung auf einer Industriebrache gestartet – ein Provisorium. Aber Zürich hat diesen Ort so sehr ins Herz geschlossen, dass aus dem Provisorium eine Institution wurde. Und Frau Gerold selbst? Hat nie existiert. Der Name kommt von der Geroldstrasse. Die Beete hier sind übrigens keine Deko: Was zwischen den Containern wächst, landet in der Küche. Hol dir ein Getränk, setz dich zwischen Tomaten und Stahlträger und schau den Zügen zu, die hinter dem Zaun vorbeiziehen. Das ist Zürich-West in einem Bild: Industrie, Improvisation und Lebensfreude, friedlich vereint.",
    },
    {
      id: "geroldstrasse-streetart",
      name: "Geroldstrasse & Streetart-Meile",
      teaser: "Zürichs buntester Strassenzug – legale Wände, wilde Kunst.",
      coords: { lat: 47.38602, lng: 8.52260 },
      walkMinutesFromPrevious: 3,
      directions: "Der Geroldstrasse Richtung Viadukt folgen – die Wände werden immer bunter.",
      stayMinutes: 10,
      why: "Hier wechselt die Galerie monatlich – Streetart, Wandbilder und die Subkultur-Seite der Bankenstadt.",
      story:
        "Entlang der Geroldstrasse und unter den Bahnbögen hat sich Zürichs lebendigste Streetart-Szene etabliert. Einige Flächen sind legal bespielbar, andere Werke entstehen über Nacht. Die Stadt, die einst Sprayer jagte, hat gelernt: Die Bilder gehören zum Quartier wie der Rost zu den Containern.",
      funFact:
        "Zürichs berühmtester Sprayer Harald Naegeli, der «Sprayer von Zürich», wurde in den 70ern international gesucht – heute gelten seine Strichfiguren als schützenswertes Kulturgut.",
      insiderTip:
        "Auch in die Seitengassen und Hinterhöfe schauen – die besten Pieces verstecken sich abseits der Hauptachse.",
      photoSpot: "Bahnbögen-Unterführung: Kunst + Architektur + Zuggeräusche.",
      isHiddenGem: true,
      audioScript:
        "Langsam gehen jetzt – und die Augen überall. Die Wände entlang dieser Strasse sind eine Galerie, die sich ständig neu erfindet. Heute ein riesiges Wandbild, nächsten Monat vielleicht etwas völlig anderes. Zürich und Streetart, das ist übrigens eine Geschichte mit Pointe. In den Siebzigerjahren jagte die Stadt einen Mann, der nachts dünne, tanzende Strichfiguren an Betonwände sprühte: Harald Naegeli, der Sprayer von Zürich. Er wurde verhaftet, verurteilt, floh nach Deutschland, wurde mit internationalem Haftbefehl gesucht – wegen Strichmännchen. Heute? Gelten seine erhaltenen Figuren als Kulturgut, die Stadt lässt einzelne sogar restaurieren. Vom Staatsfeind zum Kulturerbe in fünfzig Jahren. Die Künstler hier an der Geroldstrasse profitieren von diesem Sinneswandel: Einige Flächen sind offiziell freigegeben, und das Quartier trägt seine Kunst mit Stolz. Schau auch in die Hinterhöfe und Seitengassen – die besten Stücke hängen nie an der Hauptstrasse.",
    },
    {
      id: "im-viadukt",
      name: "Im Viadukt & Markthalle",
      teaser: "Ein Eisenbahnviadukt von 1894, dessen Bögen heute Läden, Ateliers und eine Markthalle füllen.",
      coords: { lat: 47.38566, lng: 8.52478 },
      walkMinutesFromPrevious: 3,
      directions: "Die Bahnbögen entlang bis zur Markthalle am Anfang des Viadukts.",
      stayMinutes: 25,
      why: "Bestes Beispiel der Stadt für Umnutzung: 36 Bögen voller Design, Food und Handwerk.",
      story:
        "1894 für die Eisenbahn gebaut, standen die Steinbögen des Lettenviadukts ein Jahrhundert lang nutzlos im Quartier. 2010 zog unter die Bögen das Leben ein: 36 Gewölbe mit Läden, Ateliers und der Markthalle, wo regionale Produzenten verkaufen. Oben donnern weiter die Züge – unten probierst du Käse. Das Projekt gilt europaweit als Vorzeigebeispiel für Industrie-Umnutzung.",
      funFact: "Über deinem Kopf fahren täglich Hunderte Züge – die Gewölbe schlucken den Lärm fast komplett.",
      insiderTip:
        "In der Markthalle mittags den Tagesteller eines der Stände nehmen – günstiger als jedes Restaurant im Quartier, und du sitzt unter einem Eisenbahnbogen.",
      photoSpot: "Längsachse des Viadukts: Bogen reiht sich an Bogen, perfekte Fluchtlinien.",
      nearby: [
        {
          name: "Markthalle im Viadukt",
          type: "restaurant",
          note: "Regionale Produkte, Mittagsteller, Kaffee – alles unter einem Bahnbogen.",
          address: "Limmatstrasse 231, 8005 Zürich",
        },
      ],
      audioScript:
        "Du stehst unter einem Bauwerk, das hundert Jahre lang nur eine Aufgabe hatte: Züge tragen. 1894 gebaut, Stein auf Stein, sechsunddreissig Bögen quer durchs Quartier. Und ein Jahrhundert lang passierte unter diesen Bögen: nichts. Abstellplätze, Gerümpel, tote Ecken. Dann, 2010, die simple wie geniale Idee – wenn oben Züge fahren, kann unten doch Leben einziehen. Heute findest du in den Gewölben Velowerkstätten, Modelabels, Ateliers und die Markthalle, in der Bauern und Produzenten aus der Region verkaufen. Bleib mal kurz stehen und horch: Alle paar Minuten donnert über deinem Kopf ein Zug vorbei – aber die meterdicken Steingewölbe schlucken den Lärm fast vollständig. Die Architekten haben das Viadukt nicht versteckt oder verkleidet, sondern gefeiert: roher Stein, sichtbare Bögen, ehrliches Material. Mein Tipp: Geh in die Markthalle, probier dich durch, und wenn du hungrig bist, nimm einen Mittagsteller. Du isst unter einem fahrenden Zug – wie oft kannst du das schon sagen?",
    },
    {
      id: "josefwiese",
      name: "Josefwiese",
      teaser: "Das grüne Wohnzimmer des Kreis 5 – Pétanque, Pingpong und Kioskbier.",
      coords: { lat: 47.38658, lng: 8.52658 },
      walkMinutesFromPrevious: 3,
      directions: "Am Ende des Viadukts liegt die grosse Wiese direkt vor dir.",
      stayMinutes: 15,
      why: "Kein Park der Stadt ist demokratischer: Hier trifft sich das ganze Quartier, vom Baby bis zur Boule-Legende.",
      story:
        "Seit 1924 ist die Josefwiese der Quartierpark des Industrie-Kreises – angelegt, damit die Arbeiterfamilien der umliegenden Fabriken Luft und Licht bekamen. Heute: Pétanque-Bahnen, Brunnen, Pingpong und der legendäre Kiosk. Im Sommer wird hier gegrillt, im Winter Glühwein getrunken. Das Viadukt rahmt die Wiese wie eine römische Aquädukt-Kulisse.",
      funFact:
        "Der Kiosk Josefwiese ist eine Institution – sein Kaffee- und Bierumsatz dürfte manchem Innenstadt-Café Konkurrenz machen.",
      insiderTip:
        "Sonntagvormittag ist die magischste Zeit: halbe Stadt beim Brunch auf der Decke, Boule-Kugeln klacken, Züge ziehen vorbei.",
      photoSpot: "Von der Wiesenmitte Richtung Viadukt – grüne Wiese, Steinbögen, Prime Tower dahinter.",
      isHiddenGem: true,
      audioScript:
        "Eine Wiese. Einfach eine Wiese – und trotzdem einer der wichtigsten Orte dieses Quartiers. Die Josefwiese wurde 1924 angelegt, mit einem klaren sozialen Auftrag: Die Arbeiterfamilien des Industriequartiers, die in engen Wohnungen zwischen Fabrikhallen lebten, sollten einen Ort haben für Luft, Licht und Feierabend. Hundert Jahre später hat sich erstaunlich wenig geändert – nur dass die Fabrikarbeiter heute Grafikerinnen, Köche, Programmierer und Familien aus aller Welt sind. Schau dich um: Pétanque-Spieler unter den Bäumen, Kinder am Brunnen, Pingpong-Duelle, und am Kiosk holt sich das halbe Quartier Kaffee oder Bier. Die Steinbögen des Viadukts rahmen das alles wie eine antike Kulisse. Es gibt Orte, die brauchen keine Sehenswürdigkeit zu sein, um sehenswert zu sein. Setz dich zehn Minuten auf die Wiese oder an den Brunnen. Wenn du verstehen willst, warum Menschen in Zürich-West wohnen wollen – hier ist die Antwort.",
      nearby: [
        {
          name: "Kiosk Josefwiese",
          type: "cafe",
          note: "Kaffee, Bier, Glace – die inoffizielle Quartierzentrale.",
          address: "Josefstrasse 214, 8005 Zürich",
        },
      ],
    },
    {
      id: "negrellisteg",
      name: "Negrellisteg",
      teaser: "Die elegante Fussgängerbrücke über das Gleismeer – Zürichs jüngste Ikone.",
      coords: { lat: 47.38280, lng: 8.53180 },
      walkMinutesFromPrevious: 12,
      directions:
        "Von der Josefwiese über die Heinrichstrasse Richtung Gleisfeld, dem Wegweiser «Negrellisteg» folgen.",
      stayMinutes: 10,
      why: "160 Meter Stahl über 16 Gleisen – der spektakulärste Fussweg der Stadt, erst seit 2021 offen.",
      story:
        "Jahrzehntelang trennte das Gleisfeld die Kreise 4 und 5 wie ein Fluss ohne Brücke. 2021 kam der Negrellisteg: ein filigraner, geschwungener Steg, benannt nach Alois Negrelli, dem Schweizer Ingenieur, der den Suezkanal plante. Heute queren hier täglich Tausende – und bleiben in der Mitte stehen, weil der Blick über das Gleismeer süchtig macht.",
      funFact:
        "Namensgeber Negrelli entwarf die Pläne für den Suezkanal – gebaut wurde er erst nach seinem Tod, den Ruhm kassierte Lesseps.",
      insiderTip:
        "Zur blauen Stunde hierherkommen: Gleise glänzen, Signale leuchten, Züge ziehen Lichtspuren – Stativ lohnt sich.",
      photoSpot: "Stegmitte Richtung HB: 16 Gleise, Signalwald und Stadtsilhouette.",
      isHiddenGem: true,
      audioScript:
        "Das hier ist die jüngste Ikone der Stadt – und mein Lieblingsort für einen ganz bestimmten Moment, dazu gleich mehr. Jahrzehntelang war dieses Gleisfeld eine Wunde im Stadtplan: sechzehn Gleise breit, eine Barriere, die zwei Quartiere trennte wie ein Fluss ohne Brücke. Wer von Kreis vier nach Kreis fünf wollte, lief riesige Umwege. Erst 2021 bekam die Stadt diesen Steg – hundertsechzig Meter geschwungener Stahl, benannt nach Alois Negrelli. Der Mann ist eine Geschichte für sich: ein Schweizer Ingenieur, der im neunzehnten Jahrhundert die Pläne für den Suezkanal entwarf. Gebaut wurde der Kanal erst nach seinem Tod – und den Weltruhm strich ein Franzose ein. Wenigstens hat Negrelli jetzt diesen Steg. Und nun zu dem Moment: Stell dich in die Mitte, leg die Arme aufs Geländer und schau über das Gleismeer Richtung Hauptbahnhof. Züge gleiten unter dir durch, Signale blinken, die Stadt rauscht. Bei Sonnenuntergang oder zur blauen Stunde ist das hier pures Kino – und fast niemand weiss es.",
    },
    {
      id: "roentgenplatz",
      name: "Röntgenplatz & Kreis 4/5-Leben",
      teaser: "Der Dorfplatz des Multikulti-Quartiers – Quartierleben in Reinform.",
      coords: { lat: 47.38152, lng: 8.52950 },
      walkMinutesFromPrevious: 5,
      directions: "Vom Steg hinunter und durch die Röntgenstrasse zum Platz.",
      stayMinutes: 10,
      why: "Hier siehst du, wie Zürichs ehemals härtestes Pflaster zum begehrtesten Wohnquartier wurde.",
      story:
        "Das Langstrassenquartier galt lange als Problemzone – Rotlicht, Drogen, billige Mieten. Genau deshalb zogen Künstler, Studierende und Migrantenfamilien her und machten daraus das lebendigste Stück Zürich. Der Röntgenplatz mit seinen Platanen ist sein Dorfplatz: Beizen, Kinder, Schach, Feierabendbier. Gentrifizierung inklusive – die Debatte darüber gehört hier zum guten Ton.",
      funFact:
        "Der Platz ist autofrei, seit ihn die Anwohner in den 80ern kurzerhand selbst «befreiten» – die Stadt zog später offiziell nach.",
      insiderTip: "Die umliegenden Beizen sind ehrlich und günstig – hier isst das Quartier, nicht der Tourist.",
      photoSpot: "Unter den Platanen mit Blick auf die Altbau-Fassaden.",
      isHiddenGem: true,
      audioScript:
        "Ein Platz mit Platanen, ein paar Bänke, Kinder, die zwischen den Tischen durchrennen – nichts Spektakuläres, könnte man meinen. Aber dieser Platz erzählt die Geschichte eines ganzen Quartiers. Das Gebiet zwischen Langstrasse und Gleisfeld war jahrzehntelang Zürichs verrufenste Ecke: Rotlicht, Drogenhandel, billigste Mieten. Genau das machte es interessant – für alle, die woanders keinen Platz fanden. Italienische, portugiesische, tamilische, türkische Familien. Studierende, Künstlerinnen, Lebenskünstler. Sie machten aus dem Problemquartier das lebendigste Stück Zürich. Und dieser Platz hier wurde zu seinem Dorfplatz – übrigens auf rebellische Art: In den Achtzigern stellten die Anwohner kurzerhand selbst Blumenkübel auf die Strasse und erklärten den Platz für autofrei. Die Stadt musste irgendwann nachziehen. Heute ist das Quartier so begehrt, dass über steigende Mieten gestritten wird – die ewige Geschichte aller cool gewordenen Viertel. Setz dich kurz auf eine Bank. Das hier ist Zürich ungeschminkt, und genau so am schönsten.",
    },
    {
      id: "schiffbau",
      name: "Schiffbau & Turbinenplatz",
      teaser: "Wo Schiffsmotoren für die Weltmeere entstanden, spielt heute das Schauspielhaus.",
      coords: { lat: 47.38900, lng: 8.51680 },
      walkMinutesFromPrevious: 15,
      directions:
        "Zurück über den Negrellisteg (zweiter Blick gratis!), dann der Hardstrasse entlang Richtung Schiffbauplatz.",
      stayMinutes: 15,
      why: "Die eindrücklichste Industriehalle der Stadt – aussen Backstein-Kathedrale, innen Weltklasse-Theater.",
      story:
        "In der Schiffbauhalle der Escher Wyss & Cie. wurden ab 1891 Schiffsmotoren und Turbinen gebaut, die auf allen Weltmeeren liefen – Binnenland hin oder her. Heute bespielt das Schauspielhaus Zürich die Halle, dazu Jazzclub Moods und Restaurant LaSalle, dessen Glaskubus mitten in der Halle steht. Der Turbinenplatz davor ist der grösste Platz der Stadt – benannt nach dem, was hier einst dampfte.",
      funFact:
        "Escher Wyss baute als Binnenland-Firma Schiffe und Motoren für die ganze Welt – zerlegt, verschifft, anderswo montiert.",
      insiderTip:
        "Auch ohne Theaterticket reingehen: Foyer und LaSalle-Glaskubus sind zugänglich – Industriekathedrale gratis.",
      photoSpot: "Turbinenplatz bei Dämmerung: beleuchtete Backsteinfassade + Prime Tower.",
      audioScript:
        "Stell dir diesen Ort vor hundert Jahren vor: Funkenflug, Hammerschläge, der Geruch von heissem Metall. In dieser Halle baute die Firma Escher Wyss Schiffsmotoren und Turbinen – und zwar für die ganze Welt. Ja, richtig gehört: Die Schweiz, das Land ohne Meer, lieferte Schiffstechnik auf alle Ozeane. Die Maschinen wurden hier gebaut, zerlegt, per Bahn und Schiff verschickt und am Zielort wieder montiert. Schweizer Gründlichkeit als Exportschlager. Als die Industrie das Quartier verliess, stand die Halle leer – zu gross, zu teuer, zu schön zum Abreissen. Die Rettung kam von unerwarteter Seite: das Schauspielhaus Zürich, eines der wichtigsten Theater im deutschsprachigen Raum, zog ein. Heute wird dort geprobt und gespielt, wo früher geschweisst wurde, im Keller swingt der Jazzclub Moods, und mitten in der Halle steht ein Glaskubus mit Restaurant. Geh ruhig hinein, auch ohne Ticket – das Foyer ist offen, und die Halle wirkt von innen wie eine Kathedrale, deren Religion die Arbeit war.",
      nearby: [
        {
          name: "LaSalle",
          type: "restaurant",
          note: "Im Glaskubus mitten in der Halle – Dinner in der Industriekathedrale.",
          address: "Schiffbaustrasse 4, 8005 Zürich",
        },
      ],
    },
    {
      id: "platzspitz-letten-weg",
      name: "Lettenviadukt-Promenade",
      teaser: "Auf dem alten Bahntrassee zurück Richtung Fluss – Zürichs High Line.",
      coords: { lat: 47.38730, lng: 8.53050 },
      walkMinutesFromPrevious: 15,
      directions: "Vom Schiffbau zurück, beim Viadukt die Rampe hoch – oben führt der Weg auf dem Trassee Richtung Limmat.",
      stayMinutes: 5,
      why: "Spazieren auf dem stillgelegten Bahnviadukt – mit Blick in die Hinterhöfe des Quartiers.",
      story:
        "Der obere Strang des Lettenviadukts trägt keine Züge mehr – heute läufst du auf dem alten Trassee, Zürichs Antwort auf die New Yorker High Line. Unten Läden, oben Velos und Fussgänger, und der Weg führt fast bis ans Wasser.",
      funFact: "Bis 1989 fuhren hier tatsächlich Züge – die Strecke zum alten Bahnhof Letten.",
      insiderTip: "Die Perspektive in die Hinterhöfe und Dachterrassen gibt's nur von hier oben.",
      photoSpot: "Geländer Richtung Innenstadt: Dächer, Kräne, Kirchtürme gemischt.",
      isHiddenGem: true,
      audioScript:
        "Du läufst gerade auf einer Bahnstrecke – keine Sorge, hier kommt seit 1989 kein Zug mehr. Bis dahin ratterte auf diesem Viadukt die Bahn zum kleinen Bahnhof Letten unten am Fluss. Dann wurde die Strecke stillgelegt, und statt sie abzureissen, machte Zürich daraus einen Spazierweg in luftiger Höhe – im Prinzip dasselbe Konzept wie die berühmte High Line in New York, nur ohne Hype und Menschenmassen. Und genau das ist das Schöne: Hier oben gehst du auf Augenhöhe mit Dachterrassen und Hinterhöfen, siehst in Ateliers und Wohnzimmer, unter dir das Quartierleben. Es ist die vielleicht intimste Perspektive auf die Stadt – Zürich von der Seite, die es einem nicht extra zeigt. Geniess die paar hundert Meter. Am Ende wartet das Wasser – und der schönste Abschluss, den diese Tour haben kann.",
    },
    {
      id: "oberer-letten",
      name: "Oberer Letten",
      teaser: "Flussbad, Sonnendeck, Feierabend-Treffpunkt – das Finale am Wasser.",
      coords: { lat: 47.38560, lng: 8.53560 },
      walkMinutesFromPrevious: 6,
      directions: "Dem Trassee bis zur Limmat folgen, dann die Treppe hinunter ans Wasser.",
      stayMinutes: 30,
      why: "Gratis-Flussbad mitten in der Stadt – im Sommer der demokratischste Ort Zürichs.",
      story:
        "Der Letten war in den 90ern nach der Platzspitz-Räumung kurz die zweite offene Drogenszene der Stadt – seine Räumung 1995 markierte den Wendepunkt der Schweizer Drogenpolitik. Heute ist er das Gegenteil: Im Flussbad Oberer Letten schwimmen Tausende gratis im Limmat-Kanal, auf den Holzdecks liegt das halbe Quartier, abends übernehmen Bars und Skater. Kaum ein Ort der Stadt erzählt Wandel so deutlich.",
      funFact:
        "Die Strömung im Kanal trägt dich in gut zwei Minuten einmal durchs ganze Bad – Ausstieg, zurücklaufen, wiederholen.",
      insiderTip:
        "Auch ausserhalb der Badesaison lohnt es sich: Die Holzdecks sind ganzjährig offen und perfekt für eine Pause über dem Wasser.",
      photoSpot: "Vom Steg flussaufwärts: Wasser, Bäume, Brücken – kein einziges Auto im Bild.",
      audioScript:
        "Geschafft – Schuhe aus, hinsetzen, ans Wasser. Du bist am Oberen Letten, und dieser Ort ist das perfekte Finale, weil er die ganze Geschichte dieser Tour noch einmal erzählt. In den frühen Neunzigern war der Letten der dunkelste Ort der Schweiz: Nach der Räumung des Platzspitz verlagerte sich die offene Drogenszene hierher, auf das stillgelegte Bahnareal. Die Bilder von damals will niemand zurück. 1995 wurde geräumt – und die Schweiz stellte ihre Drogenpolitik komplett um: Hilfe statt nur Härte. Es funktionierte. Und der Letten? Wurde neu geboren. Heute ist hier eines der schönsten Flussbäder Europas: gratis, offen, mitten in der Stadt. Im Sommer springen Tausende in den Kanal und lassen sich von der Strömung treiben – zwei Minuten Fahrt, aussteigen, zurücklaufen, nochmal. Auf den Holzdecks liegt das halbe Quartier, abends kommen Bars und Musik dazu. Vom dunkelsten Ort zum hellsten in einer Generation. Wenn du eine Badehose dabei hast: Jetzt wäre der Moment. Falls nicht – Füsse ins Wasser geht immer. Du hast elf Stops geschafft und ein Zürich gesehen, das die meisten Besucher nie zu Gesicht bekommen. Willkommen im Club der Eingeweihten.",
      nearby: [
        {
          name: "Primitivo Bar",
          type: "bar",
          note: "Direkt am Wasser flussaufwärts – Sundowner mit Füssen im Kies.",
        },
      ],
    },
  ],
};
