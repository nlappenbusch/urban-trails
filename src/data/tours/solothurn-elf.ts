import type { Tour } from "@/lib/types";

export const solothurnElf: Tour = {
  slug: "solothurn-elf",
  citySlug: "solothurn",
  category: "story-mode",
  name: "Solothurn – die Stadt der Elf",
  claim: "Barock, Ambassadoren und eine Stadt, die heimlich alles in Elfern zählt.",
  teaser:
    "Vom schiefen Krummturm über die Wengibrücke an den Landhausquai, unter dem Zytglogge durch zur Jesuitenkirche, ins Rathaus-Viertel und zum Finale auf den 3 × 11 Stufen der St.-Ursen-Kathedrale.",
  description:
    "Solothurn gilt als «schönste Barockstadt der Schweiz» – und als einzige Stadt, die eine ganze Zahl zur Identität gemacht hat. Elf Zünfte, elf Altäre, elf Glocken, elf Stufen pro Treppenabschnitt: Auf dieser Tour lernst du, die Elf überall zu sehen. Dazwischen erzählt die Altstadt ihre echten Geschichten: von einem Schultheissen, der sich 1533 vor eine geladene Kanone stellte, von französischen Botschaftern, die so viel Wein bestellten, dass die Schiffer betrunken ankamen, und von einem Kirchturm, der 1762 um halb elf einfach einstürzte. Kompakt, flach, perfekt für den ersten Nachmittag in Solothurn – und gratis.",
  moods: ["kultur", "fotografie", "ueberraschung", "menschen"],
  audience: "Erstbesucher, Tagesausflügler aus Bern, Biel und Zürich, Geschichts-Fans und alle, die eine Stadt über ihre Spleens kennenlernen wollen.",
  vibe: "Barock-Kulisse mit Aare-Lässigkeit – südländisch, verspielt und ein bisschen verschroben.",
  bestTimeOfDay: "Später Nachmittag – danach direkt an den Landhausquai oder auf die Kathedralentreppe.",
  bestSeason: "Ganzjährig; im Sommer lebt der Landhausquai bis spät in den Abend.",
  difficulty: "leicht",
  durationMinutes: 104,
  distanceKm: 1.3,
  startPoint: "Krummturm, Vorstadt (ca. 8 Min. ab Bahnhof Solothurn)",
  endPoint: "Freitreppe der St.-Ursen-Kathedrale",
  publicTransport: {
    start: "Bahnhof Solothurn – ab Bern ca. 40 Min., ab Zürich ca. 1 h; zu Fuss westwärts durch die Vorstadt zum Krummturm",
    end: "Ca. 8 Min. zu Fuss über die Kreuzackerbrücke zurück zum Bahnhof Solothurn",
  },
  isPremium: false,
  gradient: ["#6b3f1f", "#e3b04b"],
  imageHint: "Freitreppe der St.-Ursen-Kathedrale mit Brunnen am Ende der Hauptgasse",
  seo: {
    metaTitle: "Solothurn zu Fuss: Altstadt-Tour rund um die Zahl 11 mit Audioguide",
    metaDescription:
      "Gratis-Tour durch Solothurn: Krummturm, Wengibrücke, Landhausquai, Zytglogge, Jesuitenkirche, Rathaus, Baseltor und St.-Ursen-Kathedrale – 7 Stopps mit Audio-Stories rund um die Solothurner Zahl 11.",
    keywords: [
      "Solothurn Sehenswürdigkeiten",
      "Solothurn Altstadt Rundgang",
      "Solothurn Zahl 11",
      "St. Ursen Kathedrale",
      "Solothurn Barockstadt",
    ],
  },
  faq: [
    {
      question: "Warum dreht sich in Solothurn alles um die Elf?",
      answer:
        "Der Ursprung liegt im Dunkeln. Belegt ist, dass die Bürgerschaft in elf Zünften organisiert war und der erste Rat elf Mitglieder hatte. Seither pflegen die Solothurner die Zahl bewusst – bis zur Kathedrale mit elf Altären und elf Glocken.",
    },
    {
      question: "Kann ich die Kathedrale und die Jesuitenkirche besichtigen?",
      answer:
        "Beide Kirchen sind tagsüber meist geöffnet – Öffnungszeiten können wegen Gottesdiensten, Konzerten oder Anlässen abweichen. Während Messen bitte draussen bleiben oder still hinten stehen.",
    },
    {
      question: "Ist die Tour kinderwagen- und rollstuhltauglich?",
      answer:
        "Weitgehend: Die Altstadt ist flach, teils mit Kopfsteinpflaster. Einzige echte Hürde ist die Freitreppe der Kathedrale mit 33 Stufen – das Finale funktioniert aber auch vom Fuss der Treppe aus.",
    },
    {
      question: "Kostet die Tour etwas?",
      answer: "Nein. Alle Touren sind gratis – mit Audio-Stories, Karte, Navi und Rätseln.",
    },
  ],
  stops: [
    {
      id: "so-krummturm",
      name: "Krummturm",
      teaser: "Der Turm, der schief aussieht – und es gar nicht ist.",
      coords: { lat: 47.204172, lng: 7.534633 },
      walkMinutesFromPrevious: 0,
      directions: "Vom Bahnhof westwärts durch die Vorstadt bis zum Turm mit dem windschiefen Dach nahe der Aare.",
      stayMinutes: 10,
      why: "Das älteste unverändert erhaltene Bauwerk Solothurns – und eine perfekte optische Täuschung zum Einstieg.",
      story:
        "Gebaut wurde der Krummturm ungefähr ab 1454, fertig war er erst 1462/63. Die Zeitgenossen spotteten über das Schneckentempo und nannten ihn «Kumuff» – «kaum auf». Krumm ist hier nur das Dach: Der Grundriss ist ein unregelmässiges Fünfeck, und weil die Dachspitze über dem Schnittpunkt der Achsen sitzt, wirken vier der fünf Dachflächen schief. Im Untergeschoss liegt ein rund zehn Meter tiefes Verlies.",
      funFact:
        "Seit 1948 gehört der Turm als Vereinslokal und Artilleriemuseum dem Artillerieverein Solothurn – überlassen auf 99 Jahre.",
      insiderTip: "Lauf einmal um den Turm herum: Je nach Blickwinkel kippt das Dach in eine andere Richtung.",
      photoSpot: "Von der Aare-Seite aus, Dachspitze gegen den Himmel – so sieht man die «Schieflage» am besten.",
      audioScript:
        "Willkommen in Solothurn – und gleich eine kleine Täuschung zum Start. Schau dir das Dach dieses Turms an. Schief, oder? Als hätte ihn jemand nach dem Bau leicht angeschubst. Stimmt aber nicht. Der Krummturm steht kerzengerade. Das Geheimnis ist sein Grundriss: kein Quadrat, kein Kreis, sondern ein unregelmässiges Fünfeck. Die Dachspitze sitzt über dem Schnittpunkt der Achsen, und deshalb sind vier der fünf Dachflächen ungleichseitige Dreiecke. Dein Auge erwartet Symmetrie – und meldet: krumm. Gebaut wurde der Turm ab etwa 1454, fertig war er erst 1462. Die Solothurner fanden das so lahm, dass sie ihm einen Spottnamen gaben: «Kumuff» – kaum auf. Das Geld war knapp, die Stadt hatte gerade grosse Gebiete im unteren Kanton gekauft. Unten im Turm liegt übrigens ein zehn Meter tiefes Verlies. Merk dir dieses Gefühl, dass hier nicht alles ist, wie es scheint. Denn Solothurn hat einen Spleen, und der heisst: elf. Gleich wirst du ihn überall sehen. Jetzt aber zuerst an die Aare.",
    },
    {
      id: "so-wengibruecke-landhausquai",
      name: "Wengibrücke & Landhausquai",
      teaser: "Ein Mann vor der Kanone – und die beste Feierabend-Meile der Stadt.",
      coords: { lat: 47.2061, lng: 7.536 },
      walkMinutesFromPrevious: 4,
      directions: "Der Aare flussabwärts folgen, über die Wengibrücke ans Altstadt-Ufer und kurz nach rechts auf den Landhausquai.",
      stayMinutes: 15,
      why: "Hier spielt Solothurns grösste Heldengeschichte – und hier trifft sich die Stadt heute am Wasser.",
      story:
        "1533 hatten sich die Reformierten in der Vorstadt verschanzt. Die katholische Mehrheit wollte das Quartier vom anderen Aareufer aus zusammenschiessen. Nach dem ersten Schuss stellte sich laut dem Chronisten Franz Haffner Schultheiss Niklaus von Wengi vor die Mündung der zweiten Kanone: Wenn sie schiessen wollten, solle er der erste sein, der umkomme. Es wurde nicht mehr geschossen. Die Brücke trägt heute seinen Namen. Am Quai steht das Landhaus von 1722 – dort luden die Weinschiffe für die französischen Botschafter aus.",
      funFact:
        "In der Romandie sagt man über Betrunkene «il a chargé pour Soleure» – er hat für Solothurn geladen. Die Weinschiffer, die den Ambassadoren Lavaux-Wein brachten, bedienten sich unterwegs gern an der Ladung.",
      insiderTip:
        "Im Sommer betreibt die Genossenschaft Kreuz am Landhausquai den Biergarten «Böxli». Abends sitzt halb Solothurn hier auf der Ufermauer.",
      photoSpot: "Mitte Wengibrücke: Landhausquai mit Häuserzeile und Kathedralenkuppel dahinter.",
      audioScript:
        "Stell dir vor, es ist November 1533. Solothurn ist gespalten: Die Reformierten haben sich auf der anderen Aareseite in der Vorstadt verschanzt, sie hoffen auf Hilfe aus Bern. Auf dieser Seite stehen die Katholiken und richten Kanonen über den Fluss. Der erste Schuss ist schon gefallen. Und dann passiert etwas, das sich die Stadt bis heute erzählt: Schultheiss Niklaus von Wengi, selbst katholisch, stellt sich vor die Mündung der nächsten Kanone. Überliefert sind sinngemäss diese Worte: Liebe Bürger, wenn ihr hinüberschiessen wollt, dann will ich der erste Mann sein, der umkommt. Es fällt kein zweiter Schuss. Ein Bürgerkrieg wird abgeblasen, weil einer seinen Körper in die Schusslinie stellt. Die Brücke, auf der du gerade warst, heisst deshalb Wengibrücke. Und noch etwas: Erst 2025 und 2026 haben Archäologen wenige Meter flussaufwärts Spuren einer spätrömischen Brücke gefunden. Hier wird also seit fast zweitausend Jahren übergesetzt. Jetzt dreh dich zum Landhausquai. Das Landhaus war die Anlegestelle der Weinschiffe für die französischen Botschafter, die über zweihundertfünfzig Jahre in Solothurn residierten. Die Schiffer kamen oft betrunken an, und so sagt man in der Westschweiz bis heute: Der hat für Solothurn geladen. Prost – aber erst nach der Tour.",
      nearby: [
        {
          name: "Genossenschaft Kreuz",
          type: "restaurant",
          note: "Seit 1973 die älteste selbstverwaltete Beiz der Schweiz – mit Kulturprogramm im Winterhalbjahr.",
          address: "Kreuzgasse 4, 4500 Solothurn",
        },
      ],
      social: {
        alleinOk: "Sehr gut – auf der Ufermauer sitzt man selbstverständlich auch allein.",
        gespraech: "Hoch an Sommerabenden: enge Bänke, Bars nebeneinander, viel junges Publikum.",
        publikum: "Durchmischt – Studierende, Familien, Afterwork, Tagesgäste.",
        besteZeit: "Mai bis September, ab 17 Uhr.",
      },
    },
    {
      id: "so-zytglogge",
      name: "Zytglogge am Marktplatz",
      teaser: "Der älteste Bau der Stadt – mit König, Ritter und Tod unter dem Dach.",
      coords: { lat: 47.207574, lng: 7.536931 },
      walkMinutesFromPrevious: 3,
      directions: "Vom Quai durch eine der Gassen hinauf zum Marktplatz – der Turm mit dem grossen Zifferblatt ist nicht zu verfehlen.",
      stayMinutes: 12,
      why: "Der Zeitglockenturm ist das älteste Bauwerk Solothurns und das Herz der Altstadt.",
      story:
        "Der untere Teil des Turms geht ins Hochmittelalter zurück, als hier die Stadtburg stand. 1545 bekam er seine astronomische Uhr vom Winterthurer Uhrmacher Laurentius Liechti. Unter dem kleinen Dach bewegen sich drei bemalte Figuren mit dem Schlagwerk: ein Ritter, ein König und der Tod. Ritter und König tragen die Solothurner Farben Rot und Weiss – und selbst der Pfeil des Todes ist rot-weiss gefiedert.",
      funFact:
        "Das Liechti-Uhrwerk von 1544/45 läuft bis heute – fast fünfhundert Jahre Dienst, ohne Pensionierung.",
      insiderTip:
        "Elf-Detour: An der Westfassade der UBS am Amthausplatz 1 (3 Min. Richtung Westen) hängt die «Solothurner Uhr» mit nur elf Stunden auf dem Zifferblatt. Ein Harlekin von Paul Gugelmann schlägt die Stunden.",
      photoSpot: "Vom Marktplatz aus: Turm mit Zifferblatt und Figurenhäuschen, davor das Markttreiben.",
      audioScript:
        "Du stehst vor dem ältesten Gebäude Solothurns. Der Zeitglockenturm, auf Solothurnisch Zytglogge, steckt mit seinem Fundament tief im Mittelalter. Damals stand hier die Stadtburg, und der Turm war ein Markt- und Wachturm. Schau hoch zum grossen Zifferblatt: Das ist eine astronomische Uhr von 1545, gebaut vom Winterthurer Laurentius Liechti. Sie zeigt nicht nur die Zeit, sondern auch Mond und Tierkreis. Und das Uhrwerk dahinter läuft bis heute. Jetzt der beste Teil: Unter dem kleinen Dach stehen drei Figuren, die sich zum Stundenschlag bewegen. Ein Ritter, ein König und der Tod. Eine Mini-Predigt in Holz und Farbe: Egal wie mächtig du bist, die Uhr läuft für alle. Und schau genau hin: Ritter und König tragen Rot und Weiss, die Farben Solothurns. Sogar der Pfeil des Todes ist rot-weiss gefiedert. Lokalpatriotismus bis ins Jenseits. Und weil wir bei Uhren sind: Ein paar Schritte westlich, am Amthausplatz, hängt eine Uhr mit nur elf Stunden. Die Solothurner Uhr. Damit hast du die erste offizielle Elf der Tour. Es werden noch viele.",
      nearby: [
        {
          name: "Roter Turm",
          type: "restaurant",
          note: "Traditionshaus direkt beim Zytglogge, mit Dachrestaurant «La Tourelle» über den Dächern.",
          address: "Hauptgasse 42, 4500 Solothurn",
        },
      ],
      social: {
        alleinOk: "Gut – Marktplatz und Brunnen sind klassische Warte- und Treffpunkte.",
        gespraech: "Mittel – an Markttagen und rund um den Stundenschlag am höchsten.",
        publikum: "Einheimische beim Einkauf, Touristengruppen, Strassencafé-Publikum.",
        besteZeit: "Kurz vor dem Stundenschlag – dann bewegen sich die Figuren.",
      },
    },
    {
      id: "so-jesuitenkirche",
      name: "Jesuitenkirche",
      teaser: "Barock-Explosion hinter einer schlichten Fassade – und beinahe ein Einkaufszentrum.",
      coords: { lat: 47.207778, lng: 7.538056 },
      walkMinutesFromPrevious: 2,
      directions: "Die Hauptgasse Richtung Kathedrale – die Kirche steht auf der linken Seite.",
      stayMinutes: 12,
      why: "Einer der schönsten Barockinnenräume der Schweiz – mitfinanziert vom französischen Königshaus.",
      story:
        "Die Kirche entstand 1680 bis 1689, vermutlich nach Plänen des Jesuiten Heinrich Mayer. Bezahlt hat zu einem guten Teil Frankreich, dessen Botschafter in Solothurn residierte. Im 20. Jahrhundert verfiel der Bau: 1922 wurde die Kirche geschlossen, und 1927 bot ein Baukonsortium an, sie zu kaufen, abzureissen und Geschäftshäuser hinzustellen. Zum Glück kam es anders – heute ist sie Kulturgut von nationaler Bedeutung.",
      funFact:
        "Hinter der Kirche liegt das Steinmuseum mit römischen Inschriftsteinen – die meisten wurden 1762 beim Abbruch der alten St.-Ursen-Kirche im Fundament gefunden.",
      insiderTip: "Die Fassade ist zurückhaltend – geh unbedingt hinein. Der Kontrast zum weiss-goldenen Stuck ist der eigentliche Effekt.",
      photoSpot: "Im Mittelgang mit Blick zum Hochaltar.",
      audioScript:
        "Von aussen wirkt diese Kirche fast bescheiden. Zwei Geschosse, ein Dreiecksgiebel, ein paar Heiligenfiguren in Nischen. Geh rein, und dir fällt die Kinnlade runter: weisser Stuck, Gold, Licht, Barock in Reinform. Gebaut wurde sie zwischen 1680 und 1689, und das Geld kam zu einem guten Teil aus Paris. Der französische Botschafter sass ja hier in Solothurn, und Frankreich investierte gern in gute Beziehungen. Solothurn nennt sich deshalb auch Ambassadorenstadt. Jetzt der Plot-Twist: Im zwanzigsten Jahrhundert wollte niemand mehr für den Unterhalt zahlen. 1922 wurde die Kirche geschlossen, und 1927 lag ein Angebot auf dem Tisch, sie abzureissen und Geschäftshäuser hinzustellen. Stell dir vor: an dieser Stelle ein Warenhaus. Es kam nicht dazu, aber die Kirche blieb rund dreissig Jahre gesperrt, bevor man sie restaurierte. Und noch eine Geschichte steckt hier drin: 1817 starb in Solothurn der polnische Freiheitsheld Tadeusz Kościuszko. Sein einbalsamierter Leichnam wurde von hier aus in die Königsgruft nach Krakau überführt. Solothurn, die kleine Stadt mit internationalen Verbindungen.",
      social: {
        alleinOk: "Sehr gut – ein Ort zum stillen Schauen.",
        gespraech: "Niedrig – hier wird geflüstert.",
        publikum: "Kulturreisende, Konzertpublikum, Ruhesuchende.",
        besteZeit: "Nachmittags, wenn Licht durch die Fenster fällt.",
      },
    },
    {
      id: "so-rathaus",
      name: "Rathaus",
      teaser: "Drei Türme, eine Wendeltreppe ohne Mittelsäule – und an Fasnacht die Eselsgasse.",
      coords: { lat: 47.208462, lng: 7.537477 },
      walkMinutesFromPrevious: 2,
      directions: "Ein paar Schritte zurück und durch die Gasse nordwärts auf den Rathausplatz.",
      stayMinutes: 12,
      why: "Das Rathaus ist über Jahrhunderte gewachsen – und bis heute Sitz von Kantonsregierung und Kantonsrat.",
      story:
        "1472 zog das Rathaus von der Hauptgasse hierher und wurde Stück für Stück erweitert: der mittlere Treppenturm 1480, der Archivturm 1624, das Schatzgewölbe 1707. Die prunkvolle Ostfassade wurde 1711 bis 1713 vollendet. Im nördlichen Treppenturm von 1634 windet sich eine elegante Wendeltreppe ohne Mittelsäule hinauf in den Steinsaal.",
      funFact:
        "Ab dem 13. Januar, dem Hilari-Tag, heisst Solothurn «Honolulu» – und die Rathausgasse wird zur «Eselsgasse».",
      insiderTip:
        "Nur 2 Minuten weiter steht das Museum Altes Zeughaus (um 1609 erbaut) mit rund 400 Rüstungen – eine der grössten Harnischsammlungen der Schweiz.",
      photoSpot: "Vom Rathausplatz: die Ostfassade mit ihren drei Türmen frontal.",
      audioScript:
        "Das hier ist kein Rathaus aus einem Guss, sondern eines, das gewachsen ist wie eine Stadt im Kleinen. 1472 zog die Regierung von der Hauptgasse hierher, und danach wurde angebaut, aufgestockt, ergänzt: ein Treppenturm 1480, ein Archivturm 1624, ein Schatzgewölbe 1707. Die Fassade, die du jetzt siehst, mit dem prächtigen Portal zwischen den Türmen, wurde erst 1711 bis 1713 fertig. Über zweihundert Jahre Baustelle. Drinnen gibt es ein Juwel: eine Wendeltreppe ohne Mittelsäule. Normalerweise dreht sich eine Wendeltreppe um eine Spindel. Hier schaust du in ein offenes Treppenauge, und die Stufen tragen sich selbst. Sie führt in den Steinsaal. Und noch ein Insider: Ab dem dreizehnten Januar verwandelt sich Solothurn in Honolulu. Kein Witz, so heisst die Stadt während der Fasnachtszeit. Die Rathausgasse wird dann zur Eselsgasse, und am Schmutzigen Donnerstag um fünf Uhr früh zieht die Chesslete los, mit weissen Nachthemden, Zipfelmützen und viel Lärm. Wenn du Rüstungen magst: Gleich um die Ecke steht das Alte Zeughaus mit rund vierhundert Harnischen. Wir aber gehen weiter zum Stadttor im Osten.",
    },
    {
      id: "so-baseltor",
      name: "Baseltor",
      teaser: "Zwei runde Wehrtürme, ein Tor – und dahinter beginnt der Jura.",
      coords: { lat: 47.2087, lng: 7.53969 },
      walkMinutesFromPrevious: 3,
      directions: "Vom Rathausplatz ostwärts, am Alten Zeughaus vorbei, bis zum Stadttor hinter der Kathedrale.",
      stayMinutes: 8,
      why: "Das Baseltor ist eines der eindrücklichsten erhaltenen Stadttore der Schweiz und Teil der alten Befestigung.",
      story:
        "Das Tor mit seinen runden Flankentürmen entstand 1504 bis 1508 – Wehrtechnik nach neuestem Stand, denn runde Türme halten Kanonenkugeln besser stand. Gleich nördlich davon stehen der Riedholzturm von 1548 und die Riedholzschanze, Reste der barocken Festung. Diese Befestigung, ab 1667 über rund sechzig Jahre gebaut, hatte vor ihrem Teilabbruch – natürlich – elf Bastionen.",
      funFact:
        "Der Riedholzturm ersetzt den Nydeck-Pulverturm, der 1546 nach einem Blitzschlag explodierte.",
      insiderTip:
        "Geh einmal durchs Tor nach draussen und dreh dich um: Von der Feldseite wirkt das Tor viel wehrhafter als von der Stadt aus.",
      photoSpot: "Feldseite des Tors mit beiden Rundtürmen.",
      audioScript:
        "Bis hierher und nicht weiter – das war die Ansage dieses Tores. Das Baseltor entstand zwischen 1504 und 1508, und die runden Türme waren kein Schmuck, sondern Hightech: Rundungen lenken Kanonenkugeln besser ab als flache Mauern. Ein paar Schritte nördlich siehst du den Riedholzturm. Er steht dort, weil 1546 ein Blitz in den alten Pulverturm einschlug und der ganze Turm in die Luft flog. Später, ab 1667, umgab sich Solothurn mit einer mächtigen barocken Festung. Rund sechzig Jahre wurde gebaut, und jetzt rate mal, wie viele Bastionen sie hatte? Genau. Elf. Ein grosser Teil wurde später abgebrochen, die Riedholzschanze ist einer der Reste. Bevor wir zum Finale gehen, mach den Test: Geh kurz durchs Tor hinaus und dreh dich um. Von draussen siehst du, was die Angreifer gesehen haben. Und dann zurück – zur grössten Bühne der Stadt.",
      nearby: [
        {
          name: "Baseltor",
          type: "restaurant",
          note: "Genossenschaftlich geführtes Hotel-Restaurant in einem historischen Stadthaus gegenüber der Kathedrale.",
          address: "Hauptgasse 79, 4500 Solothurn",
        },
      ],
    },
    {
      id: "so-st-ursen",
      name: "St.-Ursen-Kathedrale",
      teaser: "3 × 11 Stufen, 11 Altäre, 11 Glocken – das Finale der Elf.",
      coords: { lat: 47.20828, lng: 7.53905 },
      walkMinutesFromPrevious: 1,
      directions: "Zurück durchs Tor und um die Kathedrale herum zur Freitreppe an der Hauptgasse.",
      stayMinutes: 20,
      why: "Solothurns Wahrzeichen und Bischofskirche des Bistums Basel – die Zahl 11 in Stein gebaut.",
      story:
        "Am 25. März 1762, kurz nach dem Hochamt, stürzte um halb elf der alte Kirchturm ein – dass niemand starb, verdankte man Uhrzeit und Feiertag. Danach baute Gaetano Matteo Pisoni aus Ascona eine ganz neue Kirche, vollendet 1773 von seinem Neffen Paolo Antonio Pisoni. Die Elf ist überall: elf Altäre, elf Glocken, eine Freitreppe mit dreimal elf Stufen, ein 66 Meter hoher Turm. Seit 1828 ist sie Kathedrale des Bistums Basel.",
      funFact:
        "Die elfte schwarze Bodenplatte im Hauptschiff, vom Haupteingang aus gezählt, ist die einzige Stelle, von der aus alle elf Altäre gleichzeitig zu sehen sind.",
      insiderTip:
        "Setz dich auf die Treppe: Hier starten die Stadtführungen, und an warmen Abenden ist sie der Wohnzimmer-Balkon der Stadt mit Blick die Hauptgasse hinunter.",
      photoSpot: "Am unteren Ende der Treppe zwischen den beiden Brunnen, Fassade bildfüllend.",
      audioScript:
        "Das Finale, und es ist ein Monument. Zähl mal die Stufen dieser Freitreppe. Drei Abschnitte, jeder mit elf Stufen. Die untersten elf sind etwas schmaler, damit die beiden Brunnen links und rechts Platz haben. Jetzt schau hoch zum Turm: sechsundsechzig Meter, also sechs mal elf. Drinnen stehen elf Altäre, oben hängen elf Glocken. Und gebaut wurde von 1762 bis 1773 – elf Jahre. Wie es dazu kam, ist fast filmreif. Die alte Kirche war marode, man begann gerade mit dem Abbruch, und am 25. März 1762, kurz nach der Festmesse, krachte um halb elf der alte Turm in sich zusammen. Weil Feiertag war und die Messe vorbei, kam niemand ums Leben. Danach war klar: Es braucht eine ganz neue Kirche. Gaetano Matteo Pisoni aus Ascona plante sie, sein Neffe vollendete sie. Wenn du hineingehst: Zähl vom Haupteingang die schwarzen Bodenplatten im Mittelgang. Auf der elften stehst du am einzigen Punkt, von dem aus alle elf Altäre gleichzeitig zu sehen sind. Und dann komm wieder raus, setz dich auf die Stufen und schau die Hauptgasse hinunter. Du hast heute einen schiefen Turm gesehen, der nicht schief ist, einen Mann vor einer Kanone, einen Tod mit rot-weissem Pfeil und eine Stadt, die in Elfern denkt. Willkommen in Solothurn. Bis zum nächsten Trail!",
      social: {
        alleinOk: "Sehr gut – auf der Treppe sitzen ist Solothurner Volkssport.",
        gespraech: "Mittel bis hoch an Sommerabenden; Führungsgruppen und Reisende kommen hier zusammen.",
        publikum: "Gemischt: Einheimische, Studierende, Tagesgäste.",
        besteZeit: "Später Nachmittag bis Sonnenuntergang.",
      },
    },
  ],
};
