import type { Tour } from "@/lib/types";

export const zuerichKlassiker: Tour = {
  slug: "zuerich-klassiker",
  citySlug: "zuerich",
  category: "story-mode",
  name: "Zürich Klassiker",
  claim: "Die ganze Stadt in einem Nachmittag – ohne einen einzigen langweiligen Meter.",
  teaser:
    "Vom Hauptbahnhof durch die Altstadt bis zum Chinagarten: alle Highlights, erzählt wie von einem Freund, der hier aufgewachsen ist.",
  description:
    "Diese Tour ist der perfekte erste Kontakt mit Zürich – aber auch für Locals voller Aha-Momente. Du läufst vom Hauptbahnhof über den Lindenhof durch die schönsten Altstadtgassen, an Fraumünster und Grossmünster vorbei ans Seebecken und endest im Chinagarten. Unterwegs: römische Kastelle, Lenin als Nachbar, Chagall-Fenster, der teuerste Boulevard Europas und ein Geschenk aus Kunming. Jeder Stop mit Audio-Story, Fun Facts und Insider-Tipps.",
  moods: ["kultur", "aussicht", "fotografie"],
  audience: "Erstbesucher, Wochenendgäste, Locals mit Besuch – alle, die Zürich einmal richtig sehen wollen.",
  vibe: "Entspannt, neugierig, voller Geschichten – wie ein Spaziergang mit einem Freund, der alles weiss.",
  bestTimeOfDay: "Start am Vormittag oder frühen Nachmittag – goldenes Licht am See zum Schluss.",
  bestSeason: "Ganzjährig; im Sommer mit Badehose (Seebad!), im Dezember mit Glühwein.",
  difficulty: "leicht",
  durationMinutes: 165,
  distanceKm: 5.2,
  startPoint: "Zürich Hauptbahnhof, Haupthalle",
  endPoint: "Chinagarten Zürich, Seefeldquai",
  publicTransport: {
    start: "Zürich HB – alle S-Bahnen, Trams 3/4/6/7/10/11/13/14",
    end: "Tram 2/4 ab Haltestelle «Fröhlichstrasse» oder Bus 33 «Chinagarten»",
  },
  isPremium: false,
  gradient: ["#0e3a6b", "#38a5ff"],
  imageHint: "Blick von der Münsterbrücke auf Grossmünster und Limmat im Abendlicht",
  seo: {
    metaTitle: "Zürich Sehenswürdigkeiten zu Fuss: Die Klassiker-Tour mit Audioguide (5 km, ~3h)",
    metaDescription:
      "Selbstgeführte Walking-Tour durch Zürich: 12 Stops vom Hauptbahnhof über Lindenhof, Fraumünster und Grossmünster bis zum Chinagarten. Mit Audioguide, Karte, Geheimtipps und Gehzeiten.",
    keywords: [
      "Zürich Sehenswürdigkeiten zu Fuss",
      "Zürich Stadtrundgang",
      "Zürich Walking Tour Deutsch",
      "Zürich Audioguide",
      "Zürich Altstadt Tour",
    ],
  },
  faq: [
    {
      question: "Wie lange dauert die Zürich Klassiker Tour?",
      answer:
        "Reine Gehzeit ca. 75 Minuten, mit Aufenthalten an den 12 Stops rund 2¾ bis 3 Stunden. Du kannst jederzeit pausieren – die Route ist in jeder Richtung mit ÖV erreichbar.",
    },
    {
      question: "Ist die Tour kostenlos?",
      answer:
        "Ja, die Klassiker-Tour ist unsere kostenlose Basis-Tour inklusive Karte und allen Texten. Premium-Features wie Offline-Audio und KI-Guide gibt es in der Premium-Version.",
    },
    {
      question: "Ist die Route kinderwagentauglich?",
      answer:
        "Grösstenteils ja. Einzig der Aufstieg zum Lindenhof hat Stufen – alternativ führt der Rennweg stufenlos hinauf.",
    },
    {
      question: "Wo kann ich unterwegs einkehren?",
      answer:
        "Bei fast jedem Stop gibt es Empfehlungen – vom Café Schober im Niederdorf bis zur Gelateria di Berna nahe Bellevue.",
    },
    {
      question: "Brauche ich Tickets für die Kirchen?",
      answer:
        "Fraumünster verlangt einen kleinen Eintritt (inkl. Chagall-Fenster), der Grossmünster-Turm kostet separat. Beide lohnen sich.",
    },
    {
      question: "Kann ich die Tour abkürzen?",
      answer:
        "Ja. Die 90-Minuten-Variante endet beim Bellevue (Stop 10) – von dort fahren alle wichtigen Trams.",
    },
  ],
  stops: [
    {
      id: "hauptbahnhof",
      name: "Hauptbahnhof & Schutzengel",
      teaser: "Der grösste Bahnhof der Schweiz – mit einem schwebenden Engel von Niki de Saint Phalle.",
      coords: { lat: 47.37785, lng: 8.54035 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 10,
      why: "Hier beginnt fast jede Zürich-Geschichte – und kaum jemand schaut nach oben.",
      story:
        "Seit 1871 steht diese Halle, gebaut als Kathedrale des Eisenbahnzeitalters. Täglich rauschen fast 3'000 Züge durch den Bahnhof – mehr als fast überall sonst auf der Welt. Und über allem schwebt seit 1997 «L'Ange Protecteur», der knallbunte Schutzengel von Niki de Saint Phalle: elf Meter, 1.2 Tonnen, ein Geschenk zur 150-Jahr-Feier der Schweizer Bahnen.",
      funFact:
        "Unter deinen Füssen liegen vier weitere Bahnhof-Etagen – der HB ist ein Eisberg, du siehst nur die Spitze.",
      insiderTip:
        "Mittwochs verwandelt sich die Haupthalle in einen der grössten überdachten Wochenmärkte Europas.",
      photoSpot: "Vom Treppenaufgang Landesmuseum-Seite: Engel + Halle in einer Achse.",
      audioScript:
        "Willkommen in Zürich – und bleib gleich mal stehen. Schau nach oben. Siehst du sie? Die bunte Dame mit den goldenen Flügeln, die da seit über fünfundzwanzig Jahren über dem Pendlerstrom schwebt? Das ist der Schutzengel von Niki de Saint Phalle – und ehrlich gesagt laufen die meisten Menschen ihr Leben lang unter ihr durch, ohne sie je zu bemerken. Du gehörst ab heute nicht mehr dazu. Diese Halle wurde 1871 eröffnet, als Züge das Internet ihrer Zeit waren – und Zürich wollte zeigen, was es kann. Heute fahren hier fast dreitausend Züge pro Tag. Unter dir liegen noch vier weitere Etagen voller Gleise und Gänge, eine ganze Unterstadt. Aber wir bleiben oben, im Licht. Geh jetzt Richtung Ausgang zur Limmat – unser nächster Stop ist ein Schloss, das eigentlich ein Museum ist.",
      nearby: [
        {
          name: "Brasserie Federal",
          type: "cafe",
          note: "Direkt in der Halle – über 100 Schweizer Biere, perfekt für ein Tour-Abschluss-Versprechen.",
          address: "Im Hauptbahnhof, Bahnhofplatz, 8001 Zürich",
        },
      ],
    },
    {
      id: "landesmuseum",
      name: "Landesmuseum & Platzspitz",
      teaser: "Ein Märchenschloss von 1898 – dahinter der Park, an dem zwei Flüsse heiraten.",
      coords: { lat: 47.37905, lng: 8.54071 },
      walkMinutesFromPrevious: 3,
      directions: "Aus der Haupthalle Richtung Limmat, über den Bahnhofplatz – das Schloss siehst du sofort.",
      stayMinutes: 15,
      why: "Das meistbesuchte historische Museum der Schweiz – und der Park dahinter hat eine der heftigsten Geschichten der Stadt.",
      story:
        "Architekt Gustav Gull baute 1898 ein Fantasieschloss aus hundert Schweizer Baustilen – Kritiker spotteten, Besucher liebten es. Dahinter liegt der Platzspitz, wo Limmat und Sihl zusammenfliessen. In den 80ern als «Needle Park» weltberühmt-berüchtigt, heute einer der friedlichsten Orte der Stadt. Diese Verwandlung ist Zürich in einer Nuss: Die Stadt schaut hin, räumt auf, erfindet sich neu.",
      funFact: "James Joyce spazierte hier täglich – er nannte den Zusammenfluss «seine Denkmaschine».",
      insiderTip:
        "Der Neubau-Innenhof des Museums ist frei zugänglich – Beton-Brutalismus trifft Schlossromantik, kaum Touristen.",
      photoSpot: "Spitze des Platzspitz-Parks: zwei Flüsse, eine Perspektive.",
      isHiddenGem: false,
      audioScript:
        "Sieht aus wie ein Märchenschloss, oder? Türmchen, Zinnen, Erker – als hätte jemand die ganze Schweizer Geschichte in ein Gebäude gegossen. Genau das war 1898 der Plan. Aber die spannendste Geschichte liegt hinter dem Schloss. Der Park dort heisst Platzspitz – und in den Achtzigern kannte ihn die ganze Welt unter einem anderen Namen: Needle Park. Hier spielte sich eine der grössten offenen Drogenszenen Europas ab. Tausende Menschen, jeden Tag. Die Bilder gingen um die Welt und zwangen die Schweiz, ihre Drogenpolitik komplett neu zu denken – mit einem Ansatz, der heute als Vorbild gilt. Wenn du heute durch den Park gehst, hörst du Vogelgezwitscher und siehst Yoga-Gruppen. Ganz vorne an der Spitze fliessen Limmat und Sihl zusammen. James Joyce stand genau dort, fast jeden Tag, und dachte über den Ulysses nach. Nicht das schlechteste Plätzchen zum Denken.",
    },
    {
      id: "lindenhof",
      name: "Lindenhof",
      teaser: "Die Keimzelle Zürichs: römisches Kastell, beste Altstadt-Aussicht, null Eintritt.",
      coords: { lat: 47.37301, lng: 8.54063 },
      walkMinutesFromPrevious: 10,
      directions:
        "Zurück über den Bahnhofplatz, die Bahnhofstrasse entlang, links in den Rennweg und den Hügel hinauf.",
      stayMinutes: 15,
      why: "Der älteste Ort der Stadt mit dem besten Gratis-Blick über Altstadt, Limmat und ETH.",
      story:
        "Hier oben stand vor 2000 Jahren ein römisches Zollkastell namens Turicum – daraus wurde irgendwann «Zürich». 1292 retteten die Zürcher Frauen die Stadt, als sie in voller Rüstung auf dem Lindenhof aufmarschierten und die Belagerer Habsburgs bluffen – die hielten sie für ein Heer. Der Brunnen erinnert an sie. Heute spielen hier Rentner Boule und Schach unter Linden, während unten die Limmat glitzert.",
      funFact:
        "Beim Brunnen ist eine Kopie eines römischen Grabsteins eingemauert – mit der ältesten Erwähnung des Stadtnamens «Turicum».",
      insiderTip:
        "Komm einmal abends nach 22 Uhr wieder: Der Platz gehört dann dir, und die beleuchtete Altstadt liegt unter dir wie eine Modellbahn.",
      photoSpot: "Mauerkante Mitte: Grossmünster, Limmat und ETH-Kuppel in einem Bild.",
      audioScript:
        "Geschafft – und jetzt dreh dich um. Das da unten ist Zürich, wie es im Buche steht: die Limmat, die Dächer des Niederdorfs, die Türme des Grossmünsters, oben rechts die Kuppel der ETH. Du stehst auf dem ältesten Stück Stadt überhaupt. Vor zweitausend Jahren kassierten hier römische Zöllner an einer Handelsroute Richtung Alpen – ihr Kastell hiess Turicum, und aus diesem Wort wurde über die Jahrhunderte: Zürich. Und dann ist da noch die Geschichte von 1292. Die Männer der Stadt waren im Krieg unterwegs, als habsburgische Truppen anrückten. Was taten die Zürcherinnen? Sie zogen Rüstungen an, griffen zu Speeren und marschierten hier oben auf. Die Belagerer sahen die Silhouetten, hielten sie für ein frisches Heer – und zogen ab. Der Brunnen neben dir erinnert an diesen grossartigen Bluff. Nimm dir einen Moment. Die Boule-Spieler hier oben haben es verstanden: Manche Orte muss man nicht besichtigen, man muss sie geniessen.",
      nearby: [
        {
          name: "Bäckereien am Rennweg",
          type: "cafe",
          note: "Am Fusse des Hügels – Gipfeli holen und oben auf der Lindenhof-Mauer mit Aussicht essen.",
          address: "Rennweg, 8001 Zürich",
        },
      ],
    },
    {
      id: "augustinergasse",
      name: "Augustinergasse",
      teaser: "Die fotogenste Gasse der Stadt – bunte Erker, gebaut um anzugeben.",
      coords: { lat: 47.37236, lng: 8.53961 },
      walkMinutesFromPrevious: 4,
      directions: "Vom Lindenhof die Pfalzgasse hinunter, unten links in die Augustinergasse.",
      stayMinutes: 10,
      why: "Mittelalterliches Instagram: Mit diesen Erkern zeigten Kaufleute, wer es geschafft hat.",
      story:
        "Die bemalten Holzerker aus dem 17. und 18. Jahrhundert waren pure Statussymbole – je kunstvoller der Erker, desto erfolgreicher der Hausherr. Während die Zünfte drinnen regierten, wurde draussen Architektur zum Wettbewerb. Heute ist die Gasse eine der letzten fast vollständig erhaltenen Altstadt-Achsen.",
      funFact:
        "Erker waren auch praktisch: Man konnte sehen, wer an die Tür klopft – die mittelalterliche Türspion-App.",
      insiderTip:
        "Im Durchgang zur Münzplatz-Seite versteckt sich der ruhigste Innenhof der Altstadt.",
      photoSpot: "Von der St.-Peter-Seite gassenaufwärts – am frühen Morgen ohne Menschen.",
      audioScript:
        "Diese Gasse ist das mittelalterliche Instagram von Zürich. Schau dir die Erker an, diese bunten, geschnitzten Vorbauten an den Fassaden. Die waren nie nur Dekoration – die waren Ansage. Wer im siebzehnten Jahrhundert Geld hatte, baute sich einen Erker. Wer mehr Geld hatte, baute einen grösseren. Von dort oben konnte man beobachten, wer durch die Gasse lief, wer vor der Tür stand, wer mit wem unterwegs war – die Nachbarschafts-Überwachung funktionierte schon vor vierhundert Jahren tadellos. Lass dir Zeit hier. Schau in die Hauseingänge, in die kleinen Läden. Und wenn du Glück hast und früh dran bist, hast du die Gasse fast für dich – dann hörst du nur deine Schritte auf dem Pflaster, genau wie die Kaufleute damals.",
    },
    {
      id: "st-peter",
      name: "St. Peter",
      teaser: "Das grösste Kirchenzifferblatt Europas – Zürichs alte Stadtuhr.",
      coords: { lat: 47.37113, lng: 8.54056 },
      walkMinutesFromPrevious: 3,
      directions: "Der Augustinergasse folgen, dann links zum St.-Peter-Hofstatt-Platz.",
      stayMinutes: 10,
      why: "8.64 Meter Zifferblatt-Durchmesser – grösser als Big Ben. Und ein herrlich ruhiger Platz.",
      story:
        "St. Peter ist die älteste Pfarrkirche der Stadt, und ihr Turm war jahrhundertelang Feuerwache: Der Turmwächter musste alle Viertelstunde aus allen vier Fenstern schauen und bei Brand eine Fahne Richtung Feuer hängen. Die Riesenuhr war dabei kein Schmuck, sondern Infrastruktur – nach ihr richtete sich die ganze Stadt, lange bevor jeder eine Uhr besass.",
      funFact: "Der Minutenzeiger ist fast 4 Meter lang – und Big Bens Zifferblatt misst nur 7 Meter.",
      insiderTip:
        "Der Platz davor, die St.-Peter-Hofstatt, ist einer der stillsten Orte der Altstadt – perfekt für eine Pause abseits des Stroms.",
      photoSpot: "Vom unteren Platzrand mit den Bäumen im Vordergrund.",
      audioScript:
        "Schau auf die Uhr – im wahrsten Sinne. Das Zifferblatt über dir ist das grösste Kirchenzifferblatt Europas: fast neun Meter Durchmesser. Zum Vergleich: Big Ben in London bringt es auf sieben. Diese Uhr war früher die Master-Clock der ganzen Stadt – alle anderen Uhren Zürichs wurden nach ihr gestellt. Wer hier zu spät kam, hatte keine Ausreden. Und der Turm konnte noch mehr: Bis ins zwanzigste Jahrhundert lebte hier oben ein Turmwächter, dessen Job es war, alle fünfzehn Minuten aus allen vier Fenstern zu schauen – Tag und Nacht. Sah er irgendwo Rauch, hängte er eine Fahne in die Richtung des Feuers. Dieser Mann war Feuermelder, Stadt-App und Frühwarnsystem in einer Person. Setz dich kurz auf den Platz hier. Er gehört zu den ruhigsten der Altstadt – als hätte die Kirche all die Hektik einfach weggeläutet.",
    },
    {
      id: "fraumuenster",
      name: "Fraumünster & Chagall-Fenster",
      teaser: "Eine Kirche, gegründet von Königstöchtern – mit Fenstern von Marc Chagall.",
      coords: { lat: 47.36991, lng: 8.54135 },
      walkMinutesFromPrevious: 4,
      directions: "Vom St. Peter die Schlüsselgasse hinunter Richtung Limmat, rechts zum Münsterhof.",
      stayMinutes: 20,
      why: "Die fünf Chagall-Fenster gehören zum Bewegendsten, was man in Zürich gratis fast sehen kann.",
      story:
        "853 gründete König Ludwig der Deutsche hier ein Kloster für seine Töchter. Die Äbtissinnen des Fraumünsters wurden später faktisch Stadtherrinnen – sie prägten Münzen und vergaben Marktrechte. Eine Frau regierte Zürich, im Mittelalter. 1970 dann der Coup: Der 83-jährige Marc Chagall gestaltete fünf Chorfenster – leuchtende Bibelszenen in Blau, Grün, Gelb und Rot, die er persönlich bemalte.",
      funFact:
        "Chagall stand mit 83 Jahren selbst auf dem Gerüst und korrigierte jedes Detail – drei Jahre lang.",
      insiderTip:
        "Geh am späten Nachmittag hinein, wenn die Sonne tief steht: Dann brennen die Fenster förmlich.",
      photoSpot: "Aussen: vom Münsterhof mit Zunfthaus zur Meisen im Rücken. (Innen Fotografierverbot.)",
      audioScript:
        "Bevor du hineingehst, eine Geschichte, die kaum jemand kennt: Diese Kirche war achthundert Jahre lang ein Machtzentrum – geführt von Frauen. Die Äbtissin des Fraumünsters war im Mittelalter faktisch die Stadtherrin von Zürich. Sie liess Münzen prägen, sie ernannte Bürgermeister, sie vergab Marktrechte. Während anderswo Männer über Frauen bestimmten, war es hier exakt umgekehrt. Und dann, mehr als tausend Jahre nach der Gründung, kam ein alter Mann mit Pinsel: Marc Chagall, dreiundachtzig Jahre alt, sagte zu, die fünf Chorfenster zu gestalten. Drei Jahre arbeitete er daran, stieg selbst aufs Gerüst, bemalte das Glas eigenhändig. Wenn du gleich davorstehst – besonders am Nachmittag, wenn die Sonne durchs blaue Fenster fällt – wirst du verstehen, warum Menschen hier manchmal einfach stehen bleiben und nichts mehr sagen. Nimm dir die Zeit. Das hier ist kein Stop zum Abhaken.",
      nearby: [
        {
          name: "Zunfthaus zur Waag",
          type: "restaurant",
          note: "Klassische Zürcher Küche am Münsterhof – das Geschnetzelte ist hier zu Hause.",
          address: "Münsterhof 8, 8001 Zürich",
        },
      ],
    },
    {
      id: "muensterbruecke",
      name: "Münsterbrücke",
      teaser: "Die Postkarten-Achse: Fraumünster, Grossmünster und Limmat in einem Blick.",
      coords: { lat: 47.36964, lng: 8.54262 },
      walkMinutesFromPrevious: 2,
      directions: "Vom Münsterhof direkt auf die Brücke Richtung Grossmünster.",
      stayMinutes: 5,
      why: "Der eine Blick, der auf jeder Zürich-Postkarte ist – und trotzdem jedes Mal wirkt.",
      story:
        "Seit 1838 verbindet die Brücke die beiden grossen Kirchen – und damit symbolisch zwei Welten: das aristokratische Fraumünster-Ufer und das handwerkliche Grossmünster-Quartier. Der Reiterstandbild-Mann ist übrigens Hans Waldmann, Bürgermeister, Feldherr – und 1489 hier ganz in der Nähe enthauptet.",
      funFact:
        "Hans Waldmann liess Hunde der Bauern erschlagen und Luxusgesetze für alle ausser sich selbst erlassen – die Stadt köpfte ihn. Das Denkmal kam trotzdem, 450 Jahre später.",
      insiderTip:
        "Unter der Brücke, am Limmatquai-Ufer, schwimmen im Sommer die Mutigen – der schönste improvisierte Badeplatz der Altstadt.",
      photoSpot: "Brückenmitte flussabwärts: Limmat, Rathaus und beide Ufer.",
      audioScript:
        "Bleib mal in der Mitte der Brücke stehen. Links das Fraumünster mit seiner schlanken grünen Spitze, rechts die beiden wuchtigen Türme des Grossmünsters – und unter dir zieht die Limmat seelenruhig Richtung Rhein. Diese Brücke verbindet seit fast zweihundert Jahren zwei Welten: drüben das feine, aristokratische Zürich, hier das raue Handwerkerquartier. Und siehst du den Reiter aus Bronze? Das ist Hans Waldmann – Bürgermeister, Kriegsheld, Aufsteiger. Er regierte die Stadt wie ein Fürst, verbot den Bauern ihre Hunde und gönnte sich selbst jeden Luxus, den er anderen verbot. 1489 hatten die Zürcher genug: Sie köpften ihn, keine fünfhundert Meter von hier. Und dann, viereinhalb Jahrhunderte später, stellten sie ihm trotzdem ein Denkmal hin. Vielleicht ist das die zürcherischste Pointe überhaupt: Erst köpfen, dann ehren – Hauptsache, es dauert lange genug.",
    },
    {
      id: "grossmuenster",
      name: "Grossmünster",
      teaser: "Zwinglis Kanzel, Karls Legende und 187 Stufen zum besten Blick der Altstadt.",
      coords: { lat: 47.37014, lng: 8.54394 },
      walkMinutesFromPrevious: 3,
      directions: "Über die Brücke, dann links die Treppe zum Zwingliplatz hinauf.",
      stayMinutes: 25,
      why: "Hier wurde die Reformation gepredigt, die Zürich für immer veränderte – und der Karlsturm bietet das beste Panorama der Altstadt.",
      story:
        "Der Legende nach stiess Karl der Grosse hier auf die Gräber der Stadtheiligen Felix und Regula – und stiftete die Kirche. Ab 1519 predigte Huldrych Zwingli hier die Reformation: Bilder raus, Orgel raus, Fastenregeln gebrochen – beim berühmten Wurstessen von 1522 ass man demonstrativ Wurst in der Fastenzeit. Aus der Stadt der Klöster wurde die Stadt der Arbeit – das Fundament des heutigen Zürichs.",
      funFact:
        "Die Stadtheiligen Felix und Regula sollen nach ihrer Enthauptung die eigenen Köpfe unter dem Arm den Hügel hinaufgetragen haben – genau bis hierher.",
      insiderTip:
        "Die 187 Stufen auf den Karlsturm kosten ein paar Franken und etwas Schnauf – dafür: bester Blick über Altstadt, See und Alpen.",
      photoSpot: "Vom Karlsturm über die Limmat – oder von der Krypta die Aussicht nach oben sparen.",
      audioScript:
        "Zwei Türme, die aussehen wie Pfeffermühlen – sorry, aber das sagen alle Zürcher liebevoll. Dieses Gebäude hat die Stadt mehr verändert als jedes andere. Im Jahr 1519 stieg hier ein Priester namens Huldrych Zwingli auf die Kanzel und tat etwas Unerhörtes: Er predigte nicht auf Latein, sondern auf Deutsch. Verständlich, direkt, radikal. Drei Jahre später sass er bei einem Abendessen, bei dem demonstrativ Wurst gegessen wurde – mitten in der Fastenzeit. Klingt banal? Das war Rebellion. Aus diesem Wurstessen wurde die Zürcher Reformation: Die Bilder flogen aus den Kirchen, die Klöster wurden aufgelöst, und aus der frommen Stadt wurde eine Stadt der Arbeit und des Handels. Ohne Zwingli kein Banken-Zürich, so direkt darf man das sagen. Und die Legende zur Gründung? Felix und Regula, die Stadtheiligen, wurden unten an der Limmat enthauptet – und trugen dann, so erzählt man, ihre Köpfe unter dem Arm genau hierher. Wenn du Energie hast: Hundertsiebenundachtzig Stufen führen auf den Karlsturm. Der Blick gehört zum Besten, was Zürich zu bieten hat.",
      nearby: [
        {
          name: "Café Schober / Conditorei Péclard",
          type: "cafe",
          note: "Im Niederdorf, zwei Minuten entfernt – heisse Schokolade, die süchtig macht, in einem Märchen-Interieur.",
          address: "Napfgasse 4, 8001 Zürich",
        },
      ],
    },
    {
      id: "niederdorf",
      name: "Niederdorf & Cabaret Voltaire",
      teaser: "Gassen voller Leben – und das Geburtshaus des Dada.",
      coords: { lat: 47.37241, lng: 8.54400 },
      walkMinutesFromPrevious: 3,
      directions: "Vom Zwingliplatz ins Niederdorf eintauchen, Richtung Spiegelgasse.",
      stayMinutes: 20,
      why: "Das «Dörfli» ist Zürichs Wohnzimmer – und an der Spiegelgasse 1 wurde 1916 die Kunst neu erfunden.",
      story:
        "Im Cabaret Voltaire an der Spiegelgasse 1 gründeten Hugo Ball, Emmy Hennings und Freunde 1916 den Dadaismus – mitten im Weltkrieg, als Anti-Antwort auf eine verrückt gewordene Welt. Ein paar Häuser weiter, an der Spiegelgasse 14, wohnte zur exakt selben Zeit ein gewisser Wladimir Iljitsch Uljanow – Lenin. Weltrevolution und Anti-Kunst, Tür an Tür, in einer Zürcher Gasse.",
      funFact:
        "Lenin und die Dadaisten besuchten möglicherweise dieselben Cafés – belegt ist: Sie wohnten keine 100 Meter voneinander entfernt.",
      insiderTip:
        "Das Cabaret Voltaire existiert noch immer als Kulturlokal – unten Bar, oben Veranstaltungen. Reinschauen!",
      photoSpot: "Spiegelgasse aufwärts mit Kopfsteinpflaster und Lenin-Gedenktafel an der 14.",
      audioScript:
        "Du bist jetzt im Dörfli, wie die Zürcher das Niederdorf nennen – enge Gassen, Bars, kleine Läden. Aber 1916 passierte hier etwas Weltbewegendes, und zwar gleich doppelt. Geh mal die Spiegelgasse hoch. Hausnummer eins: das Cabaret Voltaire. Hier standen mitten im Ersten Weltkrieg ein paar junge Künstler auf der Bühne, schrien Lautgedichte ins Publikum, trugen kubistische Kostüme und erklärten die gesamte Kultur für bankrott. Sie nannten es Dada – das vielleicht einflussreichste Anti-Kunst-Projekt der Geschichte. Und jetzt schau ein paar Häuser weiter, Nummer vierzehn. Hier wohnte zur exakt gleichen Zeit ein unauffälliger russischer Emigrant mit Halbglatze, der tagsüber in der Bibliothek sass: Lenin. Während nebenan die Dadaisten die Kunst sprengten, plante er die Weltrevolution. Ein Jahr später sass er im Zug nach Petrograd. Zwei Bewegungen, die das zwanzigste Jahrhundert prägten – geboren in derselben hundert Meter langen Zürcher Gasse. Lass dich treiben hier. Das Dörfli belohnt alle, die langsam gehen.",
      nearby: [
        {
          name: "Bar Münster",
          type: "bar",
          note: "Charmant-schräge Bar mit Blick aufs Grossmünster – gut durchmischtes Publikum, leicht ins Gespräch zu kommen.",
        },
      ],
    },
    {
      id: "bellevue",
      name: "Bellevue & Sechseläutenplatz",
      teaser: "Zürichs Verkehrsherz – und der Platz, auf dem ein Schneemann explodiert.",
      coords: { lat: 47.36672, lng: 8.54497 },
      walkMinutesFromPrevious: 8,
      directions: "Limmatquai flussabwärts bis zur Quaibrücke, das Bellevue liegt direkt davor.",
      stayMinutes: 10,
      why: "Hier öffnet sich die Stadt zum See – und im April brennt hier der Böögg.",
      story:
        "Der Sechseläutenplatz ist mit 16'000 m² einer der grössten Stadtplätze der Schweiz, belegt mit Quarzit aus dem Wallis. Jeden April verbrennen die Zünfte hier den Böögg, einen Schneemann voller Sprengstoff: Je schneller sein Kopf explodiert, desto schöner der Sommer – sagt man. Die Wartezeit wird live im Fernsehen übertragen, halb Zürich fiebert mit.",
      funFact:
        "Der Böögg-Rekord: 5 Minuten 7 Sekunden. Die längste Wartezeit: über 57 Minuten – der Sommer wurde übrigens trotzdem okay.",
      insiderTip:
        "Im Sommer abends: Openair-Kino-Stimmung auch ohne Kino – Take-away holen, auf die Quarzit-Steine sitzen, Seeluft.",
      photoSpot: "Von der Quaibrücke Richtung See: Alpenpanorama bei Föhn unschlagbar.",
      audioScript:
        "Hier öffnet sich Zürich. Eben noch enge Gassen – und plötzlich: Weite, Wasser, und an guten Tagen die Alpen am Horizont. Das Bellevue ist das Verkehrsherz der Stadt, und der riesige Platz daneben, mit Walliser Quarzit gepflastert, ist der Sechseläutenplatz. Was hier jeden April passiert, musst du dir vorstellen: Die Zürcher Zünfte bauen einen riesigen Schneemann aus Watte – den Böögg –, stopfen seinen Kopf mit Sprengstoff voll, setzen ihn auf einen zwölf Meter hohen Scheiterhaufen und zünden ihn an. Dann reiten Hunderte Männer in historischen Kostümen um das brennende Ding herum, und die ganze Stadt schaut auf die Uhr. Denn je schneller der Kopf explodiert, desto schöner wird der Sommer. Das ist kein Witz – das ist Zürichs offiziellste Wetterprognose, live im Fernsehen. Manchmal dauert es fünf Minuten, manchmal fast eine Stunde. Die Statistik-Profis der Stadt haben übrigens nachgerechnet: Die Trefferquote ist miserabel. Es ist allen egal. Manche Traditionen brauchen keine Genauigkeit, nur Feuer.",
      nearby: [
        {
          name: "Sternen Grill",
          type: "restaurant",
          note: "Die berühmteste Bratwurst der Stadt – mit scharfem Senf, im Stehen, wie es sich gehört.",
          address: "Theaterstrasse 22, 8001 Zürich",
        },
      ],
    },
    {
      id: "opernhaus",
      name: "Opernhaus",
      teaser: "Neobarocke Pracht – und der Auslöser der grössten Jugendunruhen der Schweiz.",
      coords: { lat: 47.36502, lng: 8.54671 },
      walkMinutesFromPrevious: 3,
      directions: "Über den Sechseläutenplatz auf das helle Gebäude mit den Säulen zu.",
      stayMinutes: 10,
      why: "Aussen Zuckerbäcker-Architektur, dahinter eine Geschichte über Kultur, Geld und Rebellion.",
      story:
        "1891 in nur 16 Monaten gebaut, gehört das Opernhaus heute zur Weltspitze. 1980 wurde es zum Symbol: Die Stadt sprach 61 Millionen für die Oper – und nichts für Jugendkultur. Die Folge: die «Opernhauskrawalle», monatelange Jugendunruhen, aus denen letztlich die Rote Fabrik und Zürichs alternative Kulturszene hervorgingen. Ohne diesen Konflikt wäre Zürich heute eine andere, langweiligere Stadt.",
      funFact:
        "Auf der Fassade thronen Büsten von Wagner, Weber und Mozart – Schiller und Goethe schauen von den Seiten zu.",
      insiderTip:
        "Stehplätze und Last-Minute-Tickets gibt es oft für unter 20 Franken – Weltklasse-Oper zum Kinopreis.",
      photoSpot: "Schräg vom Seeufer mit Platz und Fassade im Abendlicht.",
      audioScript:
        "Sieht harmlos aus, oder? Zuckerbäcker-Fassade, Säulen, Musen – ein Tempel fürs Bildungsbürgertum. Aber dieses Gebäude hat 1980 die Schweiz verändert. Damals beschloss die Stadt, einundsechzig Millionen Franken für die Renovierung der Oper auszugeben. Für junge Leute, für alternative Kultur: null. Am 30. Mai 1980 eskalierte es genau hier. Aus einer Demo wurden Monate von Strassenschlachten, die als Opernhauskrawalle in die Geschichte eingingen – die heftigsten Jugendunruhen, die die brave Schweiz je gesehen hat. Der Spruch der Bewegung: «Wir wollen alles, und zwar subito.» Und das Verrückte ist: Es hat funktioniert. Die Stadt gab nach, die Rote Fabrik am See wurde zum Kulturzentrum, und aus der biederen Bankenstadt wurde langsam das Zürich, das heute Clubs, Off-Spaces und eine der lebendigsten Kulturszenen Europas hat. Wenn du heute Abend in Zürich ausgehst und es gut findest – ein kleines Dankeschön an die Leute, die hier 1980 auf der Strasse standen.",
    },
    {
      id: "seepromenade",
      name: "Seepromenade & Quaianlagen",
      teaser: "Flanieren wie 1887 – die Quais machten Zürich zur Stadt am See.",
      coords: { lat: 47.36247, lng: 8.54905 },
      walkMinutesFromPrevious: 5,
      directions: "Vom Opernhaus ans Wasser und rechts der Promenade Richtung Zürichhorn folgen.",
      stayMinutes: 15,
      why: "Der schönste Spazierkilometer der Stadt – Alpenblick inklusive.",
      story:
        "Bis 1887 hatte Zürich kaum öffentlichen Seezugang – das Ufer gehörte Industrie und Schuppen. Stadtingenieur Arnold Bürkli liess aufschütten, bepflanzen, bauen: Die Quaianlagen waren ein radikal demokratisches Projekt – Seeblick für alle, nicht nur für Villenbesitzer. Heute undenkbar, dass es je anders war.",
      funFact:
        "Die Platanenallee wird seit über 130 Jahren in Form geschnitten – jedes Frühjahr, jeder Baum, von Hand.",
      insiderTip:
        "Die kleinen Stege zwischen Opernhaus und Zürichhorn sind perfekte Sonnenuntergangs-Logen – die meisten Touristen laufen vorbei.",
      photoSpot: "Höhe Bauschänzli-Blick zurück: Stadt, See und Möwen im Gegenlicht.",
      audioScript:
        "Atme mal durch. See, Berge, Platanen – das hier fühlt sich an, als wäre es schon immer so gewesen. Ist es aber nicht. Vor hundertfünfzig Jahren war dieses Ufer versperrt: Lagerschuppen, Industrie, Privatgrundstücke. Den See sah nur, wer ihn sich leisten konnte. Dann kam ein Mann namens Arnold Bürkli, Stadtingenieur, mit einer für die Zeit radikalen Idee: Das Seeufer gehört allen. Er liess Land aufschütten, Bäume pflanzen, Wege anlegen – 1887 wurden die Quaianlagen eröffnet, und Zürich wurde zum ersten Mal wirklich zur Stadt am See. Heute joggen hier Banker neben Rentnerinnen, Familien neben Liebespaaren, und im Sommer hängen die Beine von halb Zürich über die Quaimauern ins Wasser. Wenn dir heute jemand erzählt, öffentlicher Raum sei Luxus – hier ist der Gegenbeweis, seit bald hundertvierzig Jahren. Geniess den Kilometer. Es ist der schönste der Stadt.",
    },
    {
      id: "chinagarten",
      name: "Chinagarten & Zürichhorn",
      teaser: "Ein kaiserliches Geschenk aus Kunming – das würdige Finale am Wasser.",
      coords: { lat: 47.35470, lng: 8.55200 },
      walkMinutesFromPrevious: 15,
      directions: "Der Promenade weiter Richtung Zürichhorn folgen – der rote Tempelbau ist nicht zu übersehen.",
      stayMinutes: 20,
      why: "Einer der ranghöchsten chinesischen Gärten ausserhalb Chinas – und ein perfekter Ort zum Ankommen.",
      story:
        "1994 schenkte Zürichs Partnerstadt Kunming der Stadt diesen Garten – als Dank für Zürcher Hilfe beim Aufbau der Trinkwasserversorgung. Es ist ein Garten des Typs «Tempelgarten», der höchsten Kategorie, mit Original-Handwerkern aus China gebaut. Drei Inseln im Teich, ein Wandelgang, der Drei-Freunde-im-Winter-Garten: Pinie, Bambus, Winterkirsche – Symbole für Freundschaft, die Kälte übersteht.",
      funFact:
        "Fast alle Bauteile wurden in Kunming gefertigt, verschifft und hier von chinesischen Handwerkern montiert – ein 7'000-Kilometer-Flatpack.",
      insiderTip:
        "Direkt daneben liegt die Wiese am Zürichhorn mit Heureka, der kinetischen Maschine von Jean Tinguely – läuft zu jeder vollen Stunde.",
      photoSpot: "Durch das Eingangstor auf den Teichpavillon – klassischer Rahmen-im-Rahmen-Shot.",
      audioScript:
        "Und plötzlich: China. Rote Säulen, geschwungene Dächer, ein stiller Teich – mitten am Zürichsee. Dieser Garten ist kein Themenpark, sondern ein echtes Staatsgeschenk. Zürichs Partnerstadt Kunming schenkte ihn der Stadt 1994 – als Dankeschön dafür, dass Zürcher Ingenieure beim Aufbau der Trinkwasserversorgung geholfen hatten. Wasser gegen Garten – ein schöner Tausch. Und Kunming kleckerte nicht: Es ist ein Tempelgarten, die höchste Kategorie chinesischer Gartenkunst. Die Bauteile wurden in China gefertigt, um die halbe Welt verschifft und hier von angereisten Handwerkern zusammengesetzt. Das Thema des Gartens sind die drei Freunde des Winters: Pinie, Bambus und Winterkirsche – die drei Pflanzen, die der Kälte trotzen. Ein Symbol für Freundschaft, die schwierige Zeiten übersteht. Damit ist deine Tour offiziell geschafft: vom römischen Zoll-Hügel bis zum kaiserlichen Garten, zweitausend Jahre in fünf Kilometern. Setz dich ans Wasser, schau auf den See – und falls du noch Energie hast: Die Badi Utoquai auf dem Rückweg hat bis in den Abend offen. Du hast es dir verdient.",
      nearby: [
        {
          name: "Fischstube Zürichhorn",
          type: "restaurant",
          note: "Direkt am Wasser – Fisch mit Seeblick zum Tour-Abschluss.",
          address: "Bellerivestrasse 160, 8008 Zürich",
        },
      ],
    },
  ],
};
