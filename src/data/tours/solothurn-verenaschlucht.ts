import type { Tour } from "@/lib/types";

export const solothurnVerenaschlucht: Tour = {
  slug: "solothurn-verenaschlucht",
  citySlug: "solothurn",
  category: "natur-escape",
  name: "Solothurn Escape – Aare, Schlucht & Schloss",
  claim: "Von der Aare in eine Waldschlucht mit Einsiedelei – und zum Finale in einen Barockgarten.",
  teaser:
    "Start an der Aare mit Altstadt-Panorama, vorbei an der letzten Bastion hinaus nach St. Niklaus, durch die Verenaschlucht zur Einsiedelei, über Kreuzen und den alten Kreuzweg zum Schloss Waldegg.",
  description:
    "Eine halbe Stunde vom Barock-Trubel entfernt rauscht ein Bach durch eine Waldschlucht, an deren Ende eine Felsenkapelle klebt – und dort lebt seit Jahrhunderten eine Einsiedlerin oder ein Einsiedler, bezahlt von der Bürgergemeinde. Diese Tour holt dich vom Aareufer raus in die Verenaschlucht: ein romantischer Landschaftsgarten aus dem 18. Jahrhundert mit Gedenksteinen, Grotte und zwei Kapellen. Zurück geht es über die Waldlichtung Kreuzen und einen der ältesten Kreuzwege nördlich der Alpen – und das Finale gehört Schloss Waldegg, dem Sommersitz einer Familie, die es vom Aostataler Händler bis an den Hof von Versailles schaffte. Wald, Wasser, Stille, Geschichten.",
  moods: ["natur", "ruhe", "kultur", "ueberraschung"],
  audience: "Alle, die nach der Altstadt Grün brauchen; Familien, Spaziergänger, Ruhesuchende und Fotografinnen.",
  vibe: "Moosgrün und mystisch in der Schlucht, barock-elegant am Schluss.",
  bestTimeOfDay: "Vormittag oder früher Nachmittag – in der Schlucht wird es früh schattig.",
  bestSeason: "Frühling bis Herbst; im Sommer angenehm kühl in der Schlucht. Bei Nässe und Eis kann der Weg rutschig sein.",
  difficulty: "leicht",
  durationMinutes: 158,
  distanceKm: 4.3,
  startPoint: "Rötibrücke an der Aare (4 Min. ab Bahnhof Solothurn)",
  endPoint: "Schloss Waldegg, Feldbrunnen-St. Niklaus",
  publicTransport: {
    start: "Bahnhof Solothurn – über die Rötistrasse nordwärts zur Rötibrücke",
    end: "Ca. 8 Min. zum Bahnhof Feldbrunnen (S11 nach Solothurn) oder Bus 4 ab «St. Niklaus SO» Richtung Solothurn Hauptbahnhof",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1e4634", "#9bc46a"],
  imageHint: "Bachweg in der Verenaschlucht mit Felswänden und Moos",
  seo: {
    metaTitle: "Verenaschlucht & Schloss Waldegg: Natur-Tour ab Solothurn mit Audioguide | Urban Trails",
    metaDescription:
      "Von der Aare durch die Verenaschlucht zur Einsiedelei St. Verena, über Kreuzen und den Kreuzweg zum Barockschloss Waldegg – 7 Stops mit Audio-Stories, Karte und Geheimtipps.",
    keywords: [
      "Verenaschlucht Solothurn",
      "Einsiedelei St. Verena",
      "Schloss Waldegg",
      "Solothurn Wanderung",
      "Solothurn Ausflug Natur",
    ],
  },
  faq: [
    {
      question: "Wie anspruchsvoll ist der Weg durch die Verenaschlucht?",
      answer:
        "Leicht: ein gut ausgebauter Spazierweg dem Bach entlang mit wenigen Stufen und moderater Steigung. Gute Schuhe sind trotzdem sinnvoll – bei Regen kann es glitschig werden. Mit Kinderwagen ist die Schlucht nur bedingt geeignet.",
    },
    {
      question: "Kann ich die Tour abkürzen?",
      answer:
        "Ja. Bus 4 hält bei «St. Niklaus SO» direkt am Schluchteingang und bei «Rüttenen, Grünegg» unterhalb von Kreuzen. Wer nur die Schlucht will, fährt mit Bus 4 hin und startet bei Stop 3.",
    },
    {
      question: "Ist Schloss Waldegg offen?",
      answer:
        "Das Schloss ist ein Museum mit saisonalen Öffnungszeiten – prüf sie vorab auf der offiziellen Website. Allee und Aussenanlagen machen das Finale aber auch ohne Museumsbesuch lohnend.",
    },
    {
      question: "Kostet die Tour etwas?",
      answer:
        "Nein. Alle Touren sind gratis – mit Audio-Stories, Karte, Navi und Rätseln. Wer danach noch Zeit hat: Die Altstadt-Tour «Solothurn – die Stadt der Elf» startet gleich um die Ecke.",
    },
  ],
  stops: [
    {
      id: "so-roetibruecke",
      name: "Rötibrücke – Aare-Panorama",
      teaser: "Ein letzter Blick auf die Barockstadt, bevor der Wald übernimmt.",
      coords: { lat: 47.20683, lng: 7.54213 },
      walkMinutesFromPrevious: 0,
      directions: "Vom Bahnhof über die Rötistrasse nordwärts bis auf die Brücke.",
      stayMinutes: 10,
      why: "Von hier siehst du Aare, Altstadtufer und die Kathedrale in einem Bild – der perfekte Startpunkt für den Kontrast, der kommt.",
      story:
        "Flussaufwärts liegt die Altstadt wie eine Kulisse am Wasser, überragt von der Kuppel und dem Turm der St.-Ursen-Kathedrale. Die Aare ist hier eine Verkehrsader mit Geschichte: Schon die Römer setzten bei Salodurum über den Fluss, und heute fahren die Kursschiffe der Aarefahrt zwischen Biel und Solothurn unter den Brücken durch.",
      funFact:
        "Der Schweizer Vorname Urs geht auf Ursus zurück – den Stadtpatron Solothurns, dem die Kathedrale da drüben geweiht ist.",
      insiderTip: "Brückenmitte, Blick flussaufwärts Richtung Westen: Am frühen Morgen liegt oft Dunst über der Aare – dann wirkt die Altstadt wie gemalt.",
      photoSpot: "Brückengeländer flussaufwärts: Aare, Ufermauern, Kathedralenturm.",
      audioScript:
        "Bevor wir abhauen, schau noch einmal zurück. Da liegt sie, die Barockstadt: Ufermauern, Dächer, und darüber der Turm und die Kuppel der St.-Ursen-Kathedrale. Die Kathedrale ist Ursus geweiht, einem Soldaten der legendären Thebäischen Legion, der hier in Solothurn hingerichtet worden sein soll. Auf ihn geht übrigens der Vorname Urs zurück. Jeder Urs der Schweiz hat also einen Namenspatron, der von hier aus grüsst. Die Aare unter dir war immer die Lebensader der Stadt. Schon die Römer haben bei Salodurum den Fluss überquert, später kamen Weinschiffe für die französischen Botschafter, und heute tuckern Kursschiffe zwischen Biel und Solothurn unter diesen Brücken hindurch. Aber heute geht es nicht dem Fluss entlang, sondern bergwärts. Wir verlassen die Stadt nach Norden, Richtung Jurafuss. In gut einer halben Stunde stehst du in einer Waldschlucht, in der ein Bach rauscht und eine Kapelle im Fels klebt. Und am Ende wartet ein Schloss, das breiter ist als manche Strasse lang. Los geht's.",
    },
    {
      id: "so-riedholzturm",
      name: "Riedholzturm & Bastion",
      teaser: "Die letzte Mauer der Barockfestung – dahinter beginnt das Grüne.",
      coords: { lat: 47.20985, lng: 7.53887 },
      walkMinutesFromPrevious: 7,
      directions: "Über die Brücke ans Altstadtufer, durch die Gassen zum Baseltor und links zum runden Turm an der Nordostecke.",
      stayMinutes: 8,
      why: "Hier endete die Stadt jahrhundertelang – ein guter Ort, um den Schalter von Stadt auf Natur umzulegen.",
      story:
        "Der Riedholzturm wurde 1548 gebaut, nachdem sein Vorgänger, der Nydeck-Pulverturm, 1546 von einem Blitz getroffen worden und explodiert war. Ab 1667 bekam Solothurn eine mächtige barocke Festung im Bastionärsystem – rund sechzig Jahre Bauzeit, vor dem Teilabbruch mit elf Bastionen. Die Schanze beim Riedholzturm ist einer der eindrücklichsten erhaltenen Reste.",
      funFact: "Elf Bastionen – natürlich. In Solothurn ist auch die Festung im Elfer-Takt gebaut.",
      insiderTip: "Von der Nordseite aus wirkt das Ensemble aus Turm und Bastion am wuchtigsten – kurz stehen bleiben, bevor du stadtauswärts gehst.",
      photoSpot: "Von Norden: Riedholzturm über der Bastionsmauer.",
      audioScript:
        "Ein runder Turm, dicke Mauern, eine Schanze: Hier war Solothurn jahrhundertelang zu Ende. Der Riedholzturm steht seit 1548, und seine Vorgeschichte ist explosiv. Hier stand vorher der Nydeck-Turm, in dem Schiesspulver lagerte. 1546 schlug ein Blitz ein, und der Turm flog in die Luft. Zwei Jahre später stand der Nachfolger. Ab 1667 rüstete die Stadt dann richtig auf: eine barocke Festung mit spitzen Bastionen, wie sie damals in ganz Europa Mode war. Rund sechzig Jahre wurde gebaut, und die Festung hatte, du ahnst es, elf Bastionen. Heute ist der grösste Teil weg, aber hier spürst du noch, wie massiv die Stadt einmal umklammert war. Und genau deshalb ist das der richtige Ort für einen Schnitt. Hinter dir: Gassen, Cafés, Barock. Vor dir: der Weg hinaus nach St. Niklaus und an den Jurafuss. Die nächsten zwanzig Minuten sind Transfer durch ruhige Quartiere. Steck das Handy weg, wenn du magst – die Wegweiser zur Verenaschlucht bringen dich spätestens ab St. Niklaus ans Ziel.",
    },
    {
      id: "so-schluchteingang",
      name: "Schluchteingang St. Niklaus",
      teaser: "Wo der Asphalt aufhört und der Verenabach anfängt.",
      coords: { lat: 47.22029, lng: 7.54033 },
      walkMinutesFromPrevious: 18,
      directions: "Nordwärts aus der Stadt nach St. Niklaus, dann den Wegweisern «Verenaschlucht / Einsiedelei» zum südlichen Schluchteingang beim Alterszentrum Wengistein folgen.",
      stayMinutes: 10,
      why: "Hier beginnt der Weg durch die Verenaschlucht – ein Weg, den das Inventar historischer Verkehrswege als national bedeutend führt.",
      story:
        "Die Schlucht trägt den Namen der heiligen Verena. Der Legende nach stammte sie aus Theben in Ägypten, kam mit der Thebäischen Legion in die Gegend und lebte nach dem Tod der Solothurner Märtyrer Ursus und Victor eine Zeit lang in einer Höhle bei Solothurn, bevor sie nach Zurzach weiterzog. Von der Kirche St. Niklaus führt zudem ein Kreuzweg von 1613 hinauf nach Kreuzen – einer der ältesten nördlich der Alpen. Auf ihm kommen wir später zurück.",
      funFact: "Verenas Gedenktag ist der 1. September – und verehrt wird sie bis heute vor allem in Zurzach, wo sie gestorben sein soll.",
      insiderTip:
        "Bus 4 hält bei «St. Niklaus SO» fast am Schluchteingang – praktisch, wenn du die Tour später nochmals nur für die Schlucht machen willst.",
      photoSpot: "Der erste Blick in den Waldkorridor mit dem Bach.",
      isHiddenGem: true,
      audioScript:
        "Hörst du den Unterschied? Eben noch Strassen, jetzt Blätterrauschen und Wasser. Hier beginnt die Verenaschlucht. Ihr Name kommt von der heiligen Verena, und ihre Geschichte ist ein Roadmovie des dritten Jahrhunderts. Laut Legende stammte Verena aus Theben am Nil, in Ägypten. Sie kam mit der Thebäischen Legion über die Alpen, jener christlichen Truppe, zu der auch Ursus und Victor gehörten, die Stadtheiligen von Solothurn. Nachdem die beiden hingerichtet worden waren, soll Verena sich in eine Höhle bei Solothurn zurückgezogen haben, irgendwo da vorne im Wald. Später zog sie weiter nach Zurzach am Rhein, wo sie bis heute verehrt wird. Ob das alles genau so war, weiss niemand. Aber die Höhle, die Kapellen und die Einsiedelei gibt es wirklich, und sie warten am Ende dieses Weges. Noch etwas: Von der Kirche St. Niklaus hier in der Nähe führt ein Kreuzweg mit vierzehn Stationen hinauf nach Kreuzen, angelegt 1613. Über ihn kommen wir am Schluss zurück. Jetzt aber: rein in die Schlucht, dem Bach entgegen.",
      social: {
        alleinOk: "Sehr gut – hier sind viele allein oder mit Hund unterwegs.",
        gespraech: "Niedrig bis mittel; ein Grüezi gehört dazu.",
        publikum: "Spaziergänger, Familien, Seniorinnen, Jogger.",
        besteZeit: "Werktags vormittags am ruhigsten.",
      },
    },
    {
      id: "so-verenaschlucht",
      name: "Verenaschlucht – der Bachweg",
      teaser: "Ein Landschaftsgarten der Romantik, getarnt als Wildnis.",
      coords: { lat: 47.22266, lng: 7.5364 },
      walkMinutesFromPrevious: 6,
      directions: "Dem Weg am Verenabach bachaufwärts folgen.",
      stayMinutes: 15,
      why: "Die Schlucht wirkt wild, wurde aber Ende des 18. Jahrhunderts bewusst als romantischer Landschaftsgarten inszeniert.",
      story:
        "Was nach unberührter Natur aussieht, ist auch ein Kunstwerk: Ende des 18. Jahrhunderts wurde die Schlucht – ähnlich der Ermitage in Arlesheim – zu einem romantischen Landschaftsgarten gestaltet, massgeblich angestossen vom französischen Diplomaten Louis Auguste Le Tonnelier de Breteuil. Im 19. Jahrhundert kamen Tafeln und Gedenksteine für berühmte Solothurner dazu, etwa für den Geologen Amanz Gressly. So wurde der Weg zur Ruhmeshalle unter freiem Himmel.",
      funFact:
        "Die Schlucht steht als Kulturlandschaft im Bundesinventar der schützenswerten Ortsbilder der Schweiz – Natur und Denkmal in einem.",
      insiderTip: "Achte am Wegrand auf die Inschriften an Felsen und Steinen – viele gehen im Vorbeigehen unter.",
      photoSpot: "Steg oder Wegbiegung mit Bach im Vordergrund und Felswand dahinter.",
      isHiddenGem: true,
      audioScript:
        "Bleib kurz stehen und schau dich um. Moos auf Felsen, Bachrauschen, Licht, das durch die Blätter tropft. Fühlt sich an wie pure Wildnis, oder? Hier kommt der Twist: Diese Schlucht ist auch inszeniert. Ende des achtzehnten Jahrhunderts war die Romantik in Mode. Man wollte Natur, die Gefühle weckt: Schauder, Sehnsucht, Andacht. Und so wurde die Verenaschlucht zu einem Landschaftsgarten gestaltet, mit Wegen, Durchblicken und Stationen, ähnlich wie die berühmte Ermitage in Arlesheim bei Basel. Eine treibende Kraft war ein französischer Diplomat, Louis Auguste de Breteuil. Solothurn und Frankreich, das zieht sich durch die ganze Stadtgeschichte. Im neunzehnten Jahrhundert kamen dann Gedenktafeln und Steine für berühmte Solothurner dazu, zum Beispiel für den Geologen Amanz Gressly. Die Schlucht wurde so zu einer Art Ruhmeshalle im Wald. Halte also die Augen offen: Inschriften verstecken sich an Felsen und Steinen. Und dann geh langsam weiter. Gleich öffnet sich die Schlucht, und vor dir taucht etwas auf, das es so nur hier gibt.",
      social: {
        alleinOk: "Ideal – Gehmeditation mit Soundtrack vom Bach.",
        gespraech: "Niedrig – die meisten geniessen die Ruhe.",
        publikum: "Naturfans, Familien, Gruppen am Wochenende.",
        besteZeit: "Vormittags; an schönen Sonntagnachmittagen wird es voll.",
      },
    },
    {
      id: "so-einsiedelei",
      name: "Einsiedelei St. Verena",
      teaser: "Zwei Kapellen, eine Felsgrotte – und ein Job als Eremit.",
      coords: { lat: 47.22448, lng: 7.53394 },
      walkMinutesFromPrevious: 4,
      directions: "Weiter bachaufwärts, bis Kapellen und Klause am Fels auftauchen.",
      stayMinutes: 20,
      why: "Eine bewohnte Einsiedelei mitten im Wald, wenige Kilometer von einer Kantonshauptstadt – ein Schweizer Unikat.",
      story:
        "Die Martinskapelle stammt teilweise aus dem 12. Jahrhundert und gilt als zweitältestes Bauwerk Solothurns. Die Verenakapelle ist halb in den Fels gebaut, mit einem Heiligen Grab in der Felshöhle. Ein Einsiedler ist hier 1442 erstmals bezeugt. Seinen Lebensunterhalt bezahlt nach alter Tradition die Bürgergemeinde Solothurn. 2009 zog mit Verena Dubacher erstmals eine Frau ein.",
      funFact:
        "Über der Tür steht ein lateinisches Wortspiel: Verena diente «pectore» Christus und «pectine» den Armen – mit dem Herzen Christus, mit dem Kamm den Bedürftigen. Der Kamm ist eines ihrer Attribute.",
      insiderTip:
        "Als 2014 eine Nachfolge gesucht wurde, wünschte sich die Ausschreibung eine idealistische, religiöse Person, die Freude an Begegnungen hat – Eremit sein heisst hier: viele Besucher.",
      photoSpot: "Von unten: Verenakapelle mit Arkaden am Felsen.",
      isHiddenGem: true,
      nearby: [
        {
          name: "Restaurant Einsiedelei",
          type: "restaurant",
          note: "Gartenwirtschaft am Nordende der Schlucht – Ruhetage vorab prüfen.",
          address: "Verenastrasse 1, 4522 Rüttenen",
        },
      ],
      audioScript:
        "Da ist sie. Eine Kapelle, halb in den Felsen gebaut, daneben eine zweite, ein Häuschen mit Schindeldach, ein Garten. Willkommen in der Einsiedelei St. Verena. Die Martinskapelle hier stammt teilweise aus dem zwölften Jahrhundert und gilt als das zweitälteste Bauwerk Solothurns. In der Verenakapelle führt eine Felshöhle zu einem Heiligen Grab. Und über der Tür steht ein lateinischer Spruch mit einem herrlichen Wortspiel: Verena habe mit dem Herzen, pectore, Christus gedient und mit dem Kamm, pectine, den Armen. Der Kamm ist ihr Erkennungszeichen, sie soll Bedürftige gepflegt haben. Jetzt das wirklich Erstaunliche: Hier lebt traditionell ein Einsiedler. Erstmals bezeugt ist einer 1442. Und bezahlt wird er, nach jahrhundertealtem Brauch, von der Bürgergemeinde Solothurn. Ein Eremit mit Arbeitgeber, sozusagen. 2009 zog zum ersten Mal eine Frau ein. Und als man 2014 eine Nachfolge suchte, stand in der Ausschreibung sinngemäss: Gesucht wird eine idealistische, religiöse Person, die Freude an Begegnungen hat. Denn wer hier wohnt, ist nie wirklich allein. Bitte sei leise, respektiere die Privatsphäre der Klause und geniesse den Ort. Er ist seit fast sechshundert Jahren ein Rückzugsort, und genau das spürt man.",
      social: {
        alleinOk: "Sehr gut – ein Ort zum Innehalten.",
        gespraech: "Niedrig; im Restaurant nebenan entspannter.",
        publikum: "Spaziergänger, Pilgernde, Familien, Hochzeitsgesellschaften in der Kapelle.",
        besteZeit: "Vormittags oder an Werktagen.",
      },
    },
    {
      id: "so-kreuzen",
      name: "Kreuzen",
      teaser: "Eine Lichtung mit spätgotischer Kapelle – Endstation des alten Kreuzwegs.",
      coords: { lat: 47.22212, lng: 7.53588 },
      walkMinutesFromPrevious: 5,
      directions: "Von der Einsiedelei den Wegweisern nach Kreuzen folgen – kurz aus dem Wald hinaus auf die Lichtung.",
      stayMinutes: 15,
      why: "Ein stilles Ensemble aus dem 17. Jahrhundert, das kaum jemand kennt, der nur die Schlucht macht.",
      story:
        "Kreuzen ist eine kleine religiöse Siedlung aus dem 17. Jahrhundert auf einer Waldlichtung. Die spätgotische Kapelle mit steilem Satteldach birgt im Chor eine Nachbildung des Heiligen Grabes. Hier endet der Kreuzweg, der 1613 von der Kirche St. Niklaus aus angelegt wurde und zu den ältesten nördlich der Alpen zählt – im Jahr 2000 wurde er restauriert und heisst heute auch Meditationsweg.",
      funFact: "Der Kreuzweg hat 14 Stationen – du gehst ihn gleich von oben nach unten, also rückwärts.",
      insiderTip: "Brunnen und Bank auf der Lichtung sind der perfekte Pausenplatz – oder du kehrst im Restaurant Kreuzen ein.",
      photoSpot: "Kapelle mit Lichtung und Waldrand.",
      isHiddenGem: true,
      nearby: [
        {
          name: "Restaurant Kreuzen",
          type: "restaurant",
          note: "Landgasthof direkt an der Lichtung – Ruhetag vorab prüfen.",
          address: "Kreuzen 3, 4522 Rüttenen",
        },
      ],
      audioScript:
        "Raus aus dem Wald, rein ins Licht. Diese Lichtung heisst Kreuzen, und sie ist der Geheimtipp dieser Tour. Viele laufen nur durch die Schlucht und kehren um. Dabei steht hier ein kleines Ensemble aus dem siebzehnten Jahrhundert: eine spätgotische Kapelle mit steilem Dach, ein Brunnen, ein paar Häuser. Im Chor der Kapelle befindet sich eine Nachbildung des Heiligen Grabes von Jerusalem. Pilgern, ohne nach Jerusalem zu reisen, das war die Idee. Und deshalb führt auch ein Kreuzweg hierher. Angelegt wurde er 1613, von der Kirche St. Niklaus bis hier hinauf, mit vierzehn Stationen. Er gilt als einer der ältesten Kreuzwege nördlich der Alpen. Im Jahr 2000 wurde er restauriert und heisst heute auch Meditationsweg. Genau den gehen wir jetzt hinunter, also sozusagen rückwärts, von der letzten Station zur ersten. Mach eine Pause am Brunnen, atme durch. Und dann geht es los, Richtung Finale. Dort wartet ein Schloss, das aussieht wie ein Palast, aber eigentlich eine Kulisse ist.",
      social: {
        alleinOk: "Sehr gut – Bänke, Brunnen, Ruhe.",
        gespraech: "Mittel im Restaurant-Garten, sonst gering.",
        publikum: "Wanderer, Ausflügler aus der Region, Familien.",
        besteZeit: "Mittags zur Einkehr oder am späten Nachmittag.",
      },
    },
    {
      id: "so-schloss-waldegg",
      name: "Schloss Waldegg",
      teaser: "70 Meter Fassade, 12 Meter tief – Barock als Bühnenbild.",
      coords: { lat: 47.22338, lng: 7.54837 },
      walkMinutesFromPrevious: 15,
      directions: "Den Kreuzweg hinunter zur Kirche St. Niklaus, dann ostwärts der Riedholzstrasse entlang zum Schloss.",
      stayMinutes: 25,
      why: "Der am prominentesten gelegene Landsitz des Ancien Régime rund um Solothurn – mit rekonstruiertem Barockgarten.",
      story:
        "Schultheiss Johann Viktor I. von Besenval liess die Waldegg 1682 bis 1690 als Sommerresidenz bauen. Sein Vater Martin war 1628 als Händler aus dem Aostatal eingewandert und rasch in die Solothurner Oberschicht aufgestiegen. Ein Nachfahre, Peter Viktor von Besenval, kommandierte 1789 in Paris die Truppen, die gegen die Revolution aufgeboten wurden. 1963 ging das Schloss als Stiftung an den Kanton; der Barockgarten wurde ab 1989 rekonstruiert.",
      funFact:
        "Die Gartenfassade ist über 70 Meter breit, das Gebäude aber nur rund 12 Meter tief – ein bewusst auf Wirkung gebauter Kulissenbau.",
      insiderTip:
        "Die letzten Besitzer legten 1963 fest, dass das umliegende Land nicht bebaut werden darf – darum ist der Blick vom Schloss bis heute frei.",
      photoSpot: "Südseite: Barockgarten mit der ganzen Breite der Fassade.",
      audioScript:
        "Das Finale, und es ist ein Auftritt. Schau dir diese Fassade an: über siebzig Meter breit, Türmchen, Symmetrie, Barockgarten davor. Und jetzt das Verblüffende: Das Gebäude ist nur rund zwölf Meter tief. Die Waldegg ist ein Bühnenbild. Gebaut, um aus der Ferne Eindruck zu machen. Bauherr war Johann Viktor von Besenval, Schultheiss von Solothurn, zwischen 1682 und 1690. Die Geschichte seiner Familie ist ein Aufstiegsdrama. Der Vater kam 1628 als Händler aus dem Aostatal, ein Silberkrämer, und innerhalb kurzer Zeit gehörte die Familie zur Elite. Weil der französische Botschafter in Solothurn sass, standen den Patriziersöhnen Karrieren in Frankreich offen. Ein Nachfahre, Peter Viktor von Besenval, stand 1789 in Paris an der Spitze der Truppen, die gegen die Revolution aufgeboten wurden. Sein Pariser Stadtpalais ist heute die Schweizer Botschaft. Später gehörte das Schloss der Familie von Sury, und 1963 schenkten die letzten Geschwister es dem Kanton, mit einer Bedingung: Das Land rundherum darf nicht bebaut werden. Darum siehst du hier noch, wie ein barocker Landsitz in der Landschaft wirkte. Du bist heute von der Aare durch eine Schlucht, zu einer Einsiedelei und über einen vierhundert Jahre alten Kreuzweg bis hierher gelaufen. Setz dich in den Garten und lass das sacken. Bis zum nächsten Trail!",
      social: {
        alleinOk: "Gut – Allee und Garten sind zum Flanieren gemacht.",
        gespraech: "Mittel bei Veranstaltungen und Konzerten, sonst ruhig.",
        publikum: "Kulturinteressierte, Familien, Hochzeitsgesellschaften.",
        besteZeit: "Spätnachmittags, wenn die Sonne auf der Südfassade liegt.",
      },
    },
  ],
};
