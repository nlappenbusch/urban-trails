import type { Tour } from "@/lib/types";

export const urbanSunsetWalk: Tour = {
  slug: "urban-sunset-walk",
  citySlug: "zuerich",
  category: "sunset-walks",
  name: "Urban Sunset Walk",
  claim: "Der Feierabend-Reset: Aussicht, Wasser, goldenes Licht – Kopf aus, Stadt an.",
  teaser:
    "Nach einem Tag vor dem Bildschirm: von der Polyterrasse über den Lindenhof ans Seeufer bis zum Sonnenuntergang auf der Saffa-Insel.",
  description:
    "Diese Tour ist für genau einen Moment gebaut: den Feierabend, an dem du raus musst. Kein Museum, kein Pflichtprogramm – stattdessen drei der schönsten Aussichtspunkte der Stadt, Wasser fast auf der ganzen Strecke und ein Finale, bei dem die Sonne hinter dem Uetliberg im See versinkt. Unterwegs erfährst du, warum Einstein hier durchhing, wo Zürich badet und welcher Park einst ein Bollwerk war. Start um zwei Stunden vor Sonnenuntergang – die Tour bringt dich genau zur goldenen Stunde ans Wasser.",
  moods: ["aussicht", "ruhe", "natur", "fotografie"],
  audience:
    "Alle, die zu viel sitzen: Büromenschen, Homeoffice-Helden, Expats, Solo-Walker – auch perfekt als entschleunigtes Date.",
  vibe: "Entschleunigt, golden, leicht melancholisch im besten Sinn – ein Spaziergang wie ein langer Atemzug.",
  bestTimeOfDay: "Start ca. 2–2.5 Stunden vor Sonnenuntergang – das Finale fällt in die goldene Stunde.",
  bestSeason: "April bis Oktober am eindrücklichsten; im Winter als Lichter-Tour ebenfalls schön.",
  difficulty: "leicht",
  durationMinutes: 150,
  distanceKm: 5.5,
  startPoint: "Central / Polybahn-Talstation",
  endPoint: "Saffa-Insel (Landiwiese)",
  publicTransport: {
    start: "Tram 3/4/6/7/10/15 «Central», 3 Min. vom HB",
    end: "Bus 161/165 «Stadtgrenze/Landiwiese» oder Tram 7 «Brunaustrasse», 8 Min. zu Fuss",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1a2336", "#ff7a3d"],
  imageHint: "Sonnenuntergang über dem Zürichsee von der Saffa-Insel, Uetliberg als Silhouette",
  seo: {
    metaTitle: "Urban Sunset Walk Zürich: Die Feierabend-Tour zum Sonnenuntergang | Urban Trails",
    metaDescription:
      "Die schönste Abendtour durch Zürich: Polyterrasse, Lindenhof, Seepromenade und Sonnenuntergang auf der Saffa-Insel. 5.5 km, 9 Stops, mit Audioguide und Karte – perfekt nach Feierabend.",
    keywords: [
      "Zürich Sonnenuntergang Spots",
      "Zürich Feierabend Spaziergang",
      "Zürich Abend Tour",
      "Zürich Aussichtspunkte",
      "Polyterrasse Zürich",
    ],
  },
  faq: [
    {
      question: "Wann sollte ich die Tour starten?",
      answer:
        "Etwa 2 bis 2.5 Stunden vor Sonnenuntergang. Die Tour ist so getaktet, dass du zur goldenen Stunde am See bist und den Sonnenuntergang auf der Saffa-Insel erlebst.",
    },
    {
      question: "Eignet sich die Tour als Date?",
      answer:
        "Absolut – sie ist halb scherzhaft als «romantischste Route der Stadt» bekannt: Aussicht, Altstadt, Seeufer, Sonnenuntergang. Mehr Kulisse geht nicht.",
    },
    {
      question: "Was, wenn das Wetter schlecht ist?",
      answer:
        "Bei Regen fehlt das Finale – dann lieber verschieben oder die Hidden-Zürich-Tour mit gedeckten Abschnitten laufen. Bewölkt-dramatischer Himmel ist dagegen oft sogar fotogener.",
    },
    {
      question: "Kann ich unterwegs essen?",
      answer:
        "Ja – vom Studierenden-Klassiker bQm an der Polyterrasse über Bars am Seeufer bis zur Roten Fabrik kurz vor dem Ziel.",
    },
    {
      question: "Ist die Tour auch alleine angenehm?",
      answer:
        "Sie ist dafür gemacht. Viele laufen sie solo mit Kopfhörern – der Audioguide ist als Begleiter konzipiert, nicht als Vorlesung.",
    },
    {
      question: "Wie komme ich nach Sonnenuntergang zurück?",
      answer:
        "Bus 161/165 ab Landiwiese oder 8 Minuten zu Fuss zum Tram 7 – beide bringen dich in unter 15 Minuten zurück ins Zentrum.",
    },
  ],
  stops: [
    {
      id: "central-polybahn",
      name: "Central & Polybahn",
      teaser: "Start mit Stil: die rote Mini-Standseilbahn der Studierenden.",
      coords: { lat: 47.37680, lng: 8.54420 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 8,
      why: "Die charmanteste Art, den Feierabend zu beginnen: 100 Sekunden bergauf schweben.",
      story:
        "Seit 1889 zuckelt die Polybahn vom Central zur ETH hinauf – ursprünglich mit Wasserballast betrieben. Heute transportiert die rote Bahn vor allem Studierende, die zu spät zur Vorlesung sind. Zwei Wagen, 176 Höhenmeter Strecke, knapp zwei Minuten Fahrt – und oben wartet eine der besten Terrassen der Stadt.",
      funFact:
        "Die Bahn fuhr anfangs mit Wassertanks: Oben wurde Wasser eingefüllt, das Gewicht zog den Wagen hoch – unten wurde abgelassen. Öko-Antrieb, 1889.",
      insiderTip:
        "Die Bahn gehört zum ÖV-Tarif – mit Tageskarte oder Zonen-Ticket fährst du gratis. Alternativ: 5 Minuten Treppen.",
      photoSpot: "Untere Station: rote Bahn vor Altstadt-Kulisse.",
      audioScript:
        "Feierabend. Handy auf lautlos – ausser für diese Stimme natürlich – und einsteigen. Die kleine rote Bahn vor dir ist die Polybahn, seit 1889 die Verbindung zwischen Stadt und Hochschule, und sie ist der perfekte Start für diesen Spaziergang: hundert Sekunden bergauf schweben, während unten der Feierabendverkehr hupt. Als sie gebaut wurde, fuhr sie mit Wasserballast – oben wurde ein Tank gefüllt, das Gewicht zog den Wagen den Hügel hoch, unten liess man das Wasser wieder ab. Genial einfach. Heute fährt sie elektrisch und transportiert hauptsächlich Studierende der ETH, die exakt sieben Minuten vor Vorlesungsbeginn merken, dass der Hörsaal oben liegt und sie unten stehen. Steig ein, schnapp dir einen Fensterplatz, und lass dich hochziehen. Oben wartet die erste von drei grossen Aussichten des Abends – und glaub mir, sie wird mit jedem Stop besser.",
    },
    {
      id: "polyterrasse",
      name: "Polyterrasse",
      teaser: "Zürichs Balkon: ETH im Rücken, die ganze Stadt zu Füssen.",
      coords: { lat: 47.37630, lng: 8.54780 },
      walkMinutesFromPrevious: 3,
      directions: "Aus der Bergstation der Polybahn direkt auf die grosse Terrasse.",
      stayMinutes: 15,
      why: "Der klassische Über-die-Stadt-Blick – Altstadt, See und bei Föhn die Alpen.",
      story:
        "Die Terrasse vor der ETH ist seit Generationen der Ort, an dem Studierende Pause, Paare Aussicht und Fotografen Panoramen sammeln. Hinter dir: die ETH, an der Einstein studierte (und einige Prüfungen vergeigte) – 21 Nobelpreise gehen auf ihr Konto. Vor dir: Grossmünster, Limmat, See und an klaren Tagen die Glarner Alpen.",
      funFact:
        "Einstein fiel an der ETH durchs erste Aufnahmeexamen – mit 16, immerhin. Mathe und Physik waren brillant, Französisch nicht.",
      insiderTip:
        "Im bQm, dem Studierenden-Café unter der Terrasse, gibt's die günstigsten Drinks mit dieser Aussicht – Gäste willkommen.",
      photoSpot: "Terrassen-Brüstung Mitte: Grossmünster-Türme mittig, See links – Klassiker zur goldenen Stunde.",
      audioScript:
        "Da ist sie, Aussicht Nummer eins. Geh ruhig ganz nach vorne an die Brüstung. Unter dir die Dächer der Altstadt, die Türme von Grossmünster, Fraumünster und St. Peter, dahinter glitzert der See – und wenn der Föhn mitspielt, stehen die Alpen am Horizont wie aufgemalt. Hinter dir übrigens: die ETH, eine der besten Hochschulen der Welt. Einundzwanzig Nobelpreise sind mit ihr verbunden – und ihr berühmtester Student ist eine schöne Pointe für alle, die heute einen mittelmässigen Arbeitstag hatten: Albert Einstein fiel hier zuerst durchs Aufnahmeexamen. Mathe und Physik: brillant. Aber Französisch und Botanik versemmelte er. Er musste ein Jahr nachsitzen, bevor man ihn liess. Falls dein Tag also suboptimal war – Einstein kennt das Gefühl. Bleib ein paar Minuten. Die Studierenden um dich herum sehen diese Aussicht jeden Tag und schauen trotzdem immer wieder hin. Das ist das beste Qualitätssiegel, das eine Aussicht haben kann.",
      nearby: [
        {
          name: "bQm Café & Bar",
          type: "bar",
          note: "Unter der Polyterrasse – Studipreise, Liegestühle, beste Aussicht der Preisklasse.",
          address: "Leonhardstrasse 34, 8001 Zürich",
        },
      ],
    },
    {
      id: "lindenhof-abend",
      name: "Lindenhof am Abend",
      teaser: "Der älteste Platz der Stadt – am schönsten, wenn die Sonne tief steht.",
      coords: { lat: 47.37301, lng: 8.54063 },
      walkMinutesFromPrevious: 15,
      directions:
        "Hinunter durchs Niederdorf, über die Rathausbrücke und durch die Strehlgasse hinauf zum Lindenhof.",
      stayMinutes: 12,
      why: "Abends verwandelt sich der Touristen-Hotspot in einen stillen Stadtbalkon mit Goldlicht auf der Limmat.",
      story:
        "Tagsüber Reisegruppen, abends Magie: Wenn die Sonne tief steht, leuchten die Fassaden des Niederdorfs gegenüber, die Limmat wird zum Goldband, und unter den Linden klacken die Boule-Kugeln der Feierabend-Spieler. Auf diesem Hügel stand das römische Turicum – du machst Feierabend, wo schon Legionäre Schichtende hatten.",
      funFact:
        "Die Boule-Spieler des Lindenhofs sind eine eingeschworene Gemeinschaft – manche Partien laufen hier seit Jahrzehnten, fast täglich.",
      insiderTip:
        "Die Mauer an der Ostkante ist die beste Sitzbank: Beine baumeln lassen, Altstadt-Blick, niemand stört.",
      photoSpot: "Über die Mauer Richtung ETH/Niederdorf – goldene Fassaden überm Fluss.",
      audioScript:
        "Zurück auf dem ältesten Boden der Stadt – aber zur besten Stunde. Tagsüber schieben sich hier die Reisegruppen durch, jetzt am Abend gehört der Lindenhof den Locals: Boule-Spieler unter den Linden, ein paar Leute mit Feierabendbier auf der Mauer, und das Licht – schau dir dieses Licht an. Die tiefe Sonne trifft die Fassaden auf der anderen Limmatseite, und der Fluss wird für eine halbe Stunde zum Goldband. Vor zweitausend Jahren stand hier das römische Kastell Turicum. Das heisst: Auf diesem Hügel machen Menschen seit zwei Jahrtausenden Feierabend. Legionäre, Zöllner, Wächter, Kaufleute – und jetzt du. Die Boule-Spieler dort drüben sind übrigens eine Institution für sich: Manche dieser Partien laufen seit Jahrzehnten, fast jeden Abend, bei fast jedem Wetter. Such dir einen Platz auf der Mauerkante, lass die Beine baumeln und gönn dir zehn Minuten Nichtstun. Das ist der Kern dieser Tour: Du musst hier nichts besichtigen. Nur da sein.",
    },
    {
      id: "schipfe",
      name: "Schipfe",
      teaser: "Das älteste Handwerksquartier – Lädchen, Limmat und Mittelalter-Flair.",
      coords: { lat: 47.37230, lng: 8.54160 },
      walkMinutesFromPrevious: 4,
      directions: "Vom Lindenhof den Fussweg hinunter zur Limmat – die Häuserzeile am Wasser ist die Schipfe.",
      stayMinutes: 10,
      why: "Zürichs verstecktstes Altstadt-Stück: direkt am Wasser, fast ohne Touristen.",
      story:
        "Die Schipfe ist eines der ältesten Quartiere der Stadt – hier landeten einst die Schiffe (daher der Name), hier arbeiteten Färber, Fischer und Seidenweber. Heute reihen sich in den schmalen Häusern Handwerksateliers: Buchbinderei, Hutmacherin, Goldschmiede. Die Stadt vergibt die Läden bewusst an Handwerk statt an Höchstbietende – gelebter Denkmalschutz.",
      funFact:
        "Im 15. Jahrhundert war die Schipfe das Zentrum der Zürcher Seidenindustrie – die Limmat diente als Färber-Spülbecken und schimmerte je nach Auftragslage in anderen Farben.",
      insiderTip:
        "Das Restaurant Schipfe 16 ist ein Sozialprojekt mit Mittagsmenüs direkt am Wasser – ehrlich, günstig, mit der schönsten Terrasse, von der kaum jemand weiss.",
      photoSpot: "Vom Limmatufer: bunte Häuserzeile spiegelt sich im Fluss.",
      isHiddenGem: true,
      audioScript:
        "Nur ein paar Treppenstufen unter dem Lindenhof – und trotzdem laufen neunzig Prozent der Besucher hier nie durch. Die Schipfe ist Zürichs bestgehütetes Altstadt-Geheimnis: eine schmale Häuserzeile direkt am Wasser, in der seit Jahrhunderten gearbeitet wird. Der Name kommt von den Schiffen, die hier anlegten. Im Mittelalter war das hier Industriegebiet: Fischer, Färber, Gerber – und später das Zentrum der Zürcher Seidenweberei, die die Stadt reich machte, lange bevor es Banken gab. Die Färber spülten ihre Stoffe direkt in der Limmat, und je nach Auftragslage soll der Fluss rot, blau oder violett geschimmert haben. Heute sitzen in den kleinen Läden wieder Handwerker: eine Buchbinderin, eine Hutmacherin, Goldschmiede. Die Stadt vergibt diese Räume bewusst günstig an Handwerk – damit dieser Ort bleibt, was er immer war: ein Ort, wo etwas mit den Händen entsteht. Schlendere die Zeile entlang und wirf einen Blick in die Schaufenster. Hier hat es das Mittelalter ins Heute geschafft, ohne Kostümfest zu werden.",
      nearby: [
        {
          name: "Restaurant Schipfe 16",
          type: "restaurant",
          note: "Sozialprojekt mit Terrasse direkt an der Limmat – einer der ehrlichsten Mittagstische der Stadt.",
          address: "Schipfe 16, 8001 Zürich",
        },
      ],
    },
    {
      id: "buerkliplatz",
      name: "Bürkliplatz & Seeblick",
      teaser: "Wo die Stadt den See trifft – Möwen, Schiffe, Alpenlinie.",
      coords: { lat: 47.36660, lng: 8.54100 },
      walkMinutesFromPrevious: 10,
      directions: "Der Limmat entlang flussabwärts – am Wasser bleiben, bis sich der See öffnet.",
      stayMinutes: 10,
      why: "Der Moment, in dem sich nach engen Gassen plötzlich der Horizont öffnet – jedes Mal ein kleiner Reset.",
      story:
        "Benannt nach Arnold Bürkli, dem Ingenieur der Quaianlagen, ist der Platz das Scharnier zwischen Stadt und See. Samstags Flohmarkt, im Sommer Abfahrt der Kursschiffe, immer: Möwen, Wasser, Weite. Hier beginnt die Seepromenade, die du jetzt entlangläufst – einst radikales Projekt für öffentlichen Seezugang.",
      funFact:
        "Die beiden Ausguck-Pavillons am Platz sind beliebte Heiratsantrag-Spots – die Parkwächter haben angeblich schon Dutzende miterlebt.",
      insiderTip:
        "Kurz aufs Bauschänzli schauen: Die kleine Insel-Bastion von 1660 ist im Sommer Biergarten – ein Apéro auf einer Festungsinsel.",
      photoSpot: "Hafenmäuerchen: Möwen im Vordergrund, Alpen hinten – Zürichs meistfotografierte Vogelperspektive.",
      audioScript:
        "Und – Horizont. Spürst du, wie der Blick aufatmet? Eben noch Gassen, Mauern, Fassaden, und jetzt: Wasser bis zu den Bergen. Dieser Übergang ist kein Zufall, sondern das Werk eines Mannes, dem Zürich mehr verdankt als fast jedem anderen: Arnold Bürkli, Stadtingenieur, hat im neunzehnten Jahrhundert durchgesetzt, dass das Seeufer allen gehört – nicht den Fabriken, nicht den Villen. Der Platz hier trägt seinen Namen, zu Recht. Schau kurz nach links zum Wasser: Die kleine Insel mit den Bäumen ist das Bauschänzli, eine Festungsbastion von 1660, gebaut gegen Feinde, die nie kamen. Heute ist sie im Sommer ein Biergarten – die Schweizer Art, mit Festungen umzugehen. Ab hier folgst du dem Ufer Richtung Südwesten, immer am Wasser entlang. Die Sonne sollte jetzt schon tief stehen und alles in dieses warme Licht tauchen, für das es kein Wort gibt, das nicht kitschig klingt. Macht nichts. Manchmal darf es kitschig sein.",
    },
    {
      id: "arboretum",
      name: "Arboretum & Voliere",
      teaser: "Der grüne Salon am See – alte Bäume, stille Buchten, Uferwege.",
      coords: { lat: 47.36370, lng: 8.53660 },
      walkMinutesFromPrevious: 8,
      directions: "Vom Bürkliplatz dem General-Guisan-Quai folgen, dann rechts ins Arboretum.",
      stayMinutes: 12,
      why: "Der ruhigste Abschnitt des Seeufers – ein Park wie ein tiefer Atemzug.",
      story:
        "Das Arboretum entstand 1887 als botanische Schausammlung innerhalb der Quaianlagen – ein Park zum Lernen, mit Bäumen aus aller Welt. Heute ist er vor allem eines: Zürichs eleganteste Verschnaufpause. Trauerweiden hängen ins Wasser, Schwäne ziehen vorbei, und die Stadt fühlt sich plötzlich sehr weit weg an.",
      funFact:
        "Viele der Bäume sind über 130 Jahre alt – gepflanzt, als die Quais eröffnet wurden, und damit älter als fast alles Gebaute am Ufer.",
      insiderTip:
        "Die kleine Bucht hinter der Voliere hat Stufen direkt ans Wasser – der unterschätzteste Sitzplatz am ganzen Seebecken.",
      photoSpot: "Trauerweide am Ufer mit See und Uetliberg dahinter – besonders im Gegenlicht.",
      isHiddenGem: true,
      audioScript:
        "Jetzt wird es noch einmal leiser. Das Arboretum ist der Teil des Seeufers, den die meisten nur durchqueren – dabei ist er zum Bleiben gebaut. 1887 angelegt, als lebendiges Lehrbuch: Bäume aus aller Welt, sauber gepflanzt und beschriftet, damit die Zürcher etwas lernen beim Flanieren. Hundertdreissig Jahre später sind aus den Setzlingen Riesen geworden. Die Trauerweiden hängen bis ins Wasser, die Platanen werfen lange Schatten, und zwischen den Stämmen blitzt immer wieder der See. Mein Lieblingsplatz hier: die kleine Bucht hinter der Voliere, wo Stufen direkt ans Wasser führen. Kaum jemand kennt sie, dabei sitzt man nirgends am Seebecken schöner. Setz dich zwei Minuten. Hör auf das Wasser. Der Lärm der Stadt ist hier nur noch ein fernes Summen – und genau dafür bist du heute losgelaufen. Gleich kommt das letzte Stück: die Promenade zur Saffa-Insel, wo die Sonne auf dich wartet.",
    },
    {
      id: "rentenwiese-seebad",
      name: "Seebad Enge & Rentenwiese",
      teaser: "Baden mit Stil seit 1960 – und die Liegewiese mit dem Millionenblick.",
      coords: { lat: 47.36100, lng: 8.53580 },
      walkMinutesFromPrevious: 5,
      directions: "Dem Mythenquai entlang – das Holzdeck im See ist das Seebad Enge.",
      stayMinutes: 10,
      why: "Das urbanste Seebad der Stadt – im Sommer Bühne des Zürcher Sommerlebens, im Winter Sauna mit Seeblick.",
      story:
        "Das Seebad Enge schwimmt als Holzdeck im See – im Sommer Treffpunkt für Feierabend-Schwimmer und Yoga-Klassen, im Winter mit Sauna und Eisbad. Daneben breitet sich die Rentenwiese aus: der inoffizielle Strand der Stadt, wo an warmen Abenden Hunderte mit Grill und Gitarre sitzen, alle mit Blick auf die untergehende Sonne.",
      funFact:
        "Im Winter saunieren hier die Hartgesottenen und springen danach in den See – bei Wassertemperaturen um die 5 Grad.",
      insiderTip:
        "Auch ohne Badi-Eintritt: Die Rentenwiese daneben ist gratis, und der Sonnenuntergangs-Blick exakt derselbe.",
      photoSpot: "Von der Wiese über die Badehäuschen: Sonne, See, Segelboote.",
      audioScript:
        "Das Holzdeck da draussen im Wasser ist das Seebad Enge – und es ist eine kleine Zürcher Lebensschule. Im Sommer schwimmt hier nach Büroschluss die halbe Stadt: Anzugträger, die fünf Minuten später kraulen, Yoga auf dem Deck, Apéro am Beckenrand. Und im Winter, wenn der See um die fünf Grad kalt ist, sitzen drinnen Menschen in der Sauna und springen dann – freiwillig! – ins Eiswasser. Die Zürcher nennen das Erholung. Daneben liegt die Rentenwiese, und der Name führt komplett in die Irre: Statt Rentnern findest du hier an warmen Abenden das jüngste Publikum der Stadt – Grills, Gitarren, Picknickdecken, und alle Gesichter zeigen in dieselbe Richtung: Westen, wo die Sonne langsam Richtung Uetliberg sinkt. Du bist fast am Ziel. Noch ein kurzes Stück der Promenade entlang, dann kommt der Ort, für den sich dieser ganze Spaziergang gelohnt hat.",
    },
    {
      id: "rote-fabrik",
      name: "Rote Fabrik (Blick & Abstecher)",
      teaser: "Vom Krawall zum Kulturbetrieb – das rote Backstein-Wahrzeichen am Ufer.",
      coords: { lat: 47.35630, lng: 8.53690 },
      walkMinutesFromPrevious: 8,
      directions: "Weiter dem Ufer entlang – die roten Backsteinbauten am Wasser sind nicht zu verfehlen.",
      stayMinutes: 8,
      why: "Hier endete der Kampf, der 1980 vor dem Opernhaus begann – heute Konzerte, Theater und Seeblick-Beiz.",
      story:
        "Die ehemalige Seidenweberei von 1892 wurde nach den Jugendunruhen von 1980 zum alternativen Kulturzentrum – genau das hatten die Demonstrierenden gefordert. Seit über 40 Jahren gibt es hier Konzerte, Theater und Ateliers. Die Ziegelmauern am See sind das Symbol dafür, dass Zürich gelernt hat, seiner Jugend Raum zu geben.",
      funFact:
        "Gebaut wurde die Fabrik für Seide – der Stoff, mit dem Zürich schon im Mittelalter (Schipfe!) sein erstes Geld verdiente. Der Kreis schliesst sich.",
      insiderTip:
        "Die Ziegel-Beiz der Fabrik hat eine Terrasse direkt am Wasser – perfekter Stopp für ein Bier vor dem Finale.",
      photoSpot: "Vom Uferweg: rote Backsteine, Wasser, Abendhimmel.",
      audioScript:
        "Erinnerst du dich an die Geschichte der Opernhauskrawalle – falls du unsere Klassiker-Tour gelaufen bist? Hier ist das Happy End. Diese rote Backsteinfabrik, 1892 als Seidenweberei gebaut, stand in den Siebzigern leer. Als 1980 die Jugend auf die Strasse ging – «Wir wollen alles, und zwar subito» – war ihre konkreteste Forderung: ein autonomes Kulturzentrum, genau hier. Sie haben es bekommen. Seit über vierzig Jahren ist die Rote Fabrik nun Bühne, Konzertsaal, Atelierhaus und Beiz – aus dem Skandalprojekt wurde eine Institution, über die sich heute höchstens noch jemand beschwert, wenn ein Konzert zu früh aufhört. Wenn du Zeit für ein Bier hast: Die Terrasse der Beiz liegt direkt am Wasser, und es gibt schlechtere Orte, um auf die letzte Etappe anzustossen. Aber verpass die Sonne nicht – die Saffa-Insel ist nur noch ein paar Minuten entfernt, und das Timing ist jetzt alles.",
      nearby: [
        {
          name: "Ziegel oh Lac",
          type: "restaurant",
          note: "Die Beiz der Roten Fabrik – Terrasse am Wasser, entspanntes Publikum, faire Preise.",
          address: "Seestrasse 407, 8038 Zürich",
        },
      ],
    },
    {
      id: "saffa-insel",
      name: "Saffa-Insel",
      teaser: "Das Finale: Zürichs Sonnenuntergangs-Insel – gebaut von Frauen, geliebt von allen.",
      coords: { lat: 47.35540, lng: 8.53580 },
      walkMinutesFromPrevious: 4,
      directions: "Über den kleinen Steg bei der Landiwiese auf die Insel.",
      stayMinutes: 30,
      why: "Der beste Sonnenuntergangs-Spot der Stadt – die Sonne versinkt direkt hinter dem Uetliberg.",
      story:
        "Die Insel wurde 1958 für die SAFFA aufgeschüttet – die Schweizerische Ausstellung für Frauenarbeit, komplett von Frauen geplant und gebaut, inklusive der Architektinnen. Eine Leistungsschau zu einer Zeit, als Frauen in der Schweiz noch nicht einmal abstimmen durften. Heute ist die Insel der inoffizielle Sunset-Treffpunkt der Stadt: Im Sommer sitzen Hunderte auf der Wiese und den Steinen, wenn die Sonne hinter dem Uetliberg versinkt.",
      funFact:
        "Das Schweizer Frauenstimmrecht kam erst 1971 – dreizehn Jahre nachdem Frauen hier eine komplette Insel gebaut hatten.",
      insiderTip:
        "Nimm etwas zu trinken mit – auf der Insel gibt es nichts zu kaufen, und genau das macht sie so entspannt.",
      photoSpot: "Westspitze der Insel: Sonne hinter Uetliberg, Segelboote als Silhouetten – das Bild des Abends.",
      isHiddenGem: true,
      audioScript:
        "Geschafft. Such dir einen Platz – auf der Wiese, auf den Steinen am Wasser, wo immer noch frei ist – und dann lass uns kurz über diese Insel reden, denn sie hat die beste Entstehungsgeschichte der Stadt. 1958 fand hier die SAFFA statt, die Schweizerische Ausstellung für Frauenarbeit. Für diese Ausstellung wurde die Insel aufgeschüttet – geplant von einer Architektin, gebaut unter weiblicher Leitung, finanziert und organisiert von Frauen. Eine komplette Insel, von Frauen erschaffen. Und jetzt halte das gegen die Jahreszahl: 1958. Schweizer Frauen durften damals nicht einmal abstimmen. Das Stimmrecht kam erst dreizehn Jahre später, 1971. Die Insel war also auch eine Ansage: Schaut her, was wir können. Heute wissen das die wenigsten, die hier sitzen – aber jetzt weisst du es. Und nun: Schluss mit Geschichte. Die Sonne steht tief, gleich berührt sie den Grat des Uetlibergs, und für die nächsten Minuten gibt es nichts zu tun ausser hinzuschauen. Du warst heute auf drei Aussichtspunkten, bist durch zweitausend Jahre Stadtgeschichte gelaufen und hast es rechtzeitig hierher geschafft. Der Bildschirm ist weit weg. Genau hier wolltest du hin.",
    },
  ],
};
