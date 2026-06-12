import type { Tour } from "@/lib/types";

export const luzernKlassiker: Tour = {
  slug: "luzern-klassiker",
  citySlug: "luzern",
  category: "story-mode",
  name: "Luzern – Brücken, Türme, Löwen",
  claim: "Die Postkarte lebt – aber hinter Kapellbrücke und Löwen warten Totentänze, Stadtmauern und ein Uhrwerk, das allen voraus ist.",
  teaser:
    "Kapellbrücke, Totentanz auf der Spreuerbrücke, die begehbare Museggmauer und das Löwendenkmal, das Mark Twain zum Weinen brachte – Luzern komplett, zu Fuss.",
  description:
    "Luzern ist die meistfotografierte Stadt der Schweiz – und die meisten Besucher sehen trotzdem nur zehn Prozent davon. Diese Tour holt den Rest: Du läufst über beide historischen Holzbrücken (die berühmte und die unheimliche), steigst auf die Museggmauer mit ihren neun Türmen, hörst, warum die älteste Uhr der Stadt jeden Abend eine Minute zu früh schlägt, und stehst am Ende vor dem «traurigsten Stein der Welt». Dazwischen: Jesuitenbarock, bemalte Zunftfassaden und der Quai mit Pilatus-Panorama. Vier Kilometer, zweitausend Jahre Drama.",
  moods: ["kultur", "aussicht", "fotografie"],
  audience: "Erstbesucher und Wiederkehrer, Tagesausflügler ab Zürich/Bern, Foto-Fans – Luzern in einem halben Tag, richtig gemacht.",
  vibe: "Postkarte mit doppeltem Boden – malerisch vorne, morbid und überraschend hinten.",
  bestTimeOfDay: "Früher Vormittag (Brücken noch leer) oder später Nachmittag fürs Quai-Licht.",
  bestSeason: "Ganzjährig; Museggmauer-Türme sind ca. April bis Oktober geöffnet.",
  difficulty: "leicht",
  durationMinutes: 160,
  distanceKm: 4.2,
  startPoint: "Bahnhof Luzern (Torbogen)",
  endPoint: "Nationalquai / Seebecken",
  publicTransport: {
    start: "Bahnhof Luzern – ab Zürich/Bern je ~1 h, alle 30 Min.",
    end: "Vom Quai 10 Min. zu Fuss zurück zum Bahnhof",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1f4a6b", "#ff7a3d"],
  seo: {
    metaTitle: "Luzern zu Fuss: Kapellbrücke, Museggmauer & Löwendenkmal mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Walking-Tour durch Luzern: 8 Stops von der Kapellbrücke über die Totentanz-Brücke und die Museggmauer bis zum Löwendenkmal. Mit Audio-Stories, Karte und Geheimtipps.",
    keywords: ["Luzern Sehenswürdigkeiten zu Fuss","Luzern Stadtrundgang","Kapellbrücke Luzern","Museggmauer Tour","Luzern Audioguide"],
  },
  faq: [
    { question: "Wie lange dauert die Tour?", answer: "Rund 2½ Stunden mit Pausen – reine Gehzeit etwa eine Stunde. Mit Museggmauer-Türmen und Kaffee eher 3 Stunden." },
    { question: "Ist die Museggmauer offen?", answer: "Die begehbaren Türme sind in der Regel von ca. April bis Oktober tagsüber geöffnet und gratis. Im Winter läufst du aussen der Mauer entlang – lohnt sich trotzdem." },
    { question: "Lohnt sich Luzern als Tagesausflug?", answer: "Absolut: Eine Stunde ab Zürich oder Bern, und diese Tour plus Mittagessen füllt einen perfekten Halbtag." },
    { question: "Ist die Route kinderwagentauglich?", answer: "Bis auf die Turmaufstiege der Museggmauer ja – die Mauer lässt sich unten umgehen." },
  ],
  stops: [
    {
      id: "bahnhof-luzern",
      name: "Bahnhof & Torbogen",
      teaser: "Das Portal des alten Bahnhofs steht noch – als Tor zur Stadt.",
      coords: { lat: 47.0502, lng: 8.3103 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 5,
      why: "Der dramatischste Bahnhofsvorplatz der Schweiz: vorne See, hinten Berge, mittendrin ein einsames Portal.",
      story:
        "1971 brannte der prächtige alte Bahnhof von 1896 nieder – übrig blieb nur das monumentale Eingangsportal, das heute frei auf dem Platz steht wie ein Triumphbogen ohne Gebäude. Dahinter glitzert der Vierwaldstättersee, daneben wölbt sich das KKL von Jean Nouvel mit seinem riesigen Flachdach. Alt und neu, in einem Blick.",
      funFact: "Das KKL-Dach ragt 45 Meter frei über den Platz – darunter fliesst Seewasser durch das Gebäude, Nouvel wollte den See «hineinziehen».",
      insiderTip: "Durch den Torbogen Richtung See fotografieren – er rahmt Pilatus und Schiffe wie ein Bilderrahmen.",
      photoSpot: "Unter dem Torbogen, Blick zum See.",
      audioScript:
        "Willkommen in Luzern – und dreh dich gleich mal um. Dieses einsame Steinportal hinter dir ist alles, was vom alten Prachtbahnhof übrig ist. 1971 brannte er nieder, ein Jahrhundertgebäude, weg in einer Nacht. Die Luzerner stellten das gerettete Portal mitten auf den Platz – als Erinnerung und als Tor: Wer hindurchgeht, hat den schönsten ersten Blick der Schweiz. Vorne der Vierwaldstättersee mit den Dampfschiffen, links der Pilatus, und daneben das KKL, das Kulturzentrum von Stararchitekt Jean Nouvel, dessen gigantisches Dach wie ein schwebendes Tablett über dem Ufer hängt. Luzern lebt seit Jahrhunderten von genau diesem Moment – dem ersten Blick. Heute schauen wir hinter die Postkarte: zwei Holzbrücken, eine davon voller Totentänze, eine begehbare Stadtmauer und ein sterbender Löwe warten. Los geht's zur berühmtesten Brücke des Landes.",
    },
    {
      id: "kapellbruecke",
      name: "Kapellbrücke & Wasserturm",
      teaser: "Die älteste gedeckte Holzbrücke Europas – 1993 fast komplett verbrannt.",
      coords: { lat: 47.0517, lng: 8.3076 },
      walkMinutesFromPrevious: 5,
      directions: "Vom Bahnhofplatz ans Reuss-Ufer und rechts zur Brücke.",
      stayMinutes: 15,
      why: "DAS Wahrzeichen – aber die Geschichte der Brandnacht 1993 kennen die wenigsten Besucher.",
      story:
        "Seit etwa 1365 quert die Kapellbrücke schräg die Reuss, der achteckige Wasserturm ist noch älter – er war Archiv, Tresor und Folterkammer. In den Giebeln hingen 111 Bildtafeln aus dem 17. Jahrhundert. Dann, in der Nacht des 18. August 1993, fing ein unter der Brücke vertäutes Boot Feuer: Zwei Drittel der Brücke und 86 Tafeln verbrannten. Luzern baute in acht Monaten wieder auf – die verkohlten Balkenstümpfe liess man bewusst sichtbar.",
      funFact: "Schau auf die Bildtafeln: Einige sind schwarz verkohlt – Original-Brandspuren, als Mahnmal absichtlich hängen gelassen.",
      insiderTip: "Früh am Morgen (vor 9 Uhr) gehört die Brücke dir – tagsüber schieben sich 20'000 Menschen durch.",
      photoSpot: "Von der Rathausquai-Seite: Brücke diagonal, Wasserturm mittig, Pilatus dahinter – das Schweiz-Bild schlechthin.",
      audioScript:
        "Du stehst vor dem meistfotografierten Bauwerk der Schweiz – und kennst wahrscheinlich seine dunkelste Nacht noch nicht. Die Kapellbrücke spannt sich seit rund 1365 schräg über die Reuss, der wuchtige Wasserturm daneben ist noch älter: Er war Stadtarchiv, Goldtresor und Folterkammer in einem. Oben in den Giebeln hingen über hundert bemalte Tafeln, dreihundert Jahre alt, Luzerns Geschichte als Comic seiner Zeit. Und dann: 18. August 1993, kurz nach Mitternacht. Ein Boot unter der Brücke fängt Feuer, Funken springen aufs trockene Holz, und innert Minuten steht das Wahrzeichen in Flammen. Die Luzerner standen weinend am Ufer. Zwei Drittel der Brücke, sechsundachtzig Tafeln – verloren. Aber dann das: In nur acht Monaten wurde alles wieder aufgebaut. Geh jetzt langsam hindurch und schau nach oben – zwischen den Tafeln hängen einige schwarz verkohlte. Das ist kein Versehen. Luzern liess sie absichtlich hängen, als Erinnerung daran, wie schnell siebenhundert Jahre verschwinden können.",
    },
    {
      id: "jesuitenkirche",
      name: "Jesuitenkirche",
      teaser: "Barock wie Schlagrahm – die schönste Kirche zwischen München und Mailand.",
      coords: { lat: 47.0511, lng: 8.3046 },
      walkMinutesFromPrevious: 4,
      directions: "Über die Brücke und dem linken Reuss-Ufer flussabwärts folgen.",
      stayMinutes: 10,
      why: "Von aussen elegant, innen eine Explosion in Rosa und Weiss – der erste grosse Barockbau der Schweiz.",
      story:
        "1666 begannen die Jesuiten diesen Bau als Machtdemonstration der Gegenreformation – Luzern war die katholische Vormacht der Eidgenossenschaft. Innen: Stuck wie Zuckerguss, ein Deckenhimmel voller Engel und das Gewand von Bruder Klaus, dem Nationalheiligen. Der Kontrast zum protestantisch-kargen Zürich oder Bern könnte grösser nicht sein.",
      funFact: "Die Zwiebeltürme kamen erst 200 Jahre später dazu – das Geld war zwischendurch schlicht aus.",
      insiderTip: "Mittags finden oft kurze Orgelkonzerte statt – 20 Minuten Barock-Sound gratis, Programm hängt am Eingang.",
      photoSpot: "Vom gegenüberliegenden Reuss-Ufer: weisse Fassade, Zwiebeltürme, Spiegelung im Fluss.",
      audioScript:
        "Von aussen: eine elegante weisse Dame mit zwei Zwiebeltürmen. Innen – geh ruhig kurz rein – ein Paukenschlag in Rosa, Weiss und Gold. Die Jesuitenkirche war 1666 der erste grosse Barockbau der Schweiz, und sie war eine Kampfansage. Während Zürich und Bern ihre Kirchen reformiert leer geräumt hatten, kalkweiss und bilderlos, antwortete das katholische Luzern mit maximaler Sinnlichkeit: Stuck wie Schlagrahm, ein gemalter Himmel voller Engel, Marmor, der gar keiner ist, sondern bemalter Gips – Hauptsache prächtig. Das war Religionspolitik mit den Mitteln der Schönheit: Seht her, bei uns ist der Himmel üppig. In einem Seitenaltar liegt übrigens das Gewand von Bruder Klaus, dem Einsiedler, der die Eidgenossen 1481 vor dem Bürgerkrieg bewahrte – der Schweizer Nationalheilige, im Original-Stoff. Wenn du Glück hast, probt gerade jemand an der Orgel. Dann bleib zwei Minuten sitzen. Barock muss man hören, nicht nur sehen.",
    },
    {
      id: "spreuerbruecke",
      name: "Spreuerbrücke & Totentanz",
      teaser: "Die unheimliche Schwester der Kapellbrücke – 67 Bilder über das Sterben.",
      coords: { lat: 47.0518, lng: 8.3019 },
      walkMinutesFromPrevious: 4,
      directions: "Dem Ufer weiter flussabwärts folgen bis zur zweiten Holzbrücke.",
      stayMinutes: 12,
      why: "Original erhalten, kaum Touristen – und der berührendste Bilderzyklus der Schweiz hängt einfach so im Gebälk.",
      isHiddenGem: true,
      story:
        "Die Spreuerbrücke von 1408 ist die echte Überlebende – nie abgebrannt, alles original. In ihren Giebeln hängt der «Totentanz» von Kaspar Meglinger (1626–1635): 67 Tafeln, auf denen der Tod als Skelett alle zum Tanz holt – Bischof, Kaufmann, Braut, Bauer, Kind. Gemalt während der Pestjahre, als der Tod täglicher Nachbar war. Der Name kommt von «Spreu»: Nur hier durfte Abfall in die Reuss gekippt werden.",
      funFact: "Auf vielen Tafeln sind die Sponsoren mitsamt Wappen verewigt – Luzerner Familien bezahlten dafür, neben dem Tod zu hängen.",
      insiderTip: "Tafel für Tafel lesen lohnt sich: Der Tod ist oft charmant, fast freundlich – das macht es umso eindringlicher.",
      photoSpot: "Brückenmitte flussaufwärts: Nadelwehr, Altstadt und Kapellbrücke in der Ferne.",
      audioScript:
        "Und jetzt die Brücke, die kaum jemand kennt – dabei ist sie die echtere von beiden. Die Spreuerbrücke, 1408 vollendet, ist nie abgebrannt: Alles, was du hier siehst, ist Original. Und was du siehst, hat es in sich. Schau hoch ins Gebälk: siebenundsechzig Bildtafeln, gemalt vor vierhundert Jahren, und auf jeder einzelnen tanzt der Tod. Als Skelett holt er den Bischof von der Kanzel, den Kaufmann vom Goldtisch, die Braut von der Hochzeit, das Kind aus der Wiege. Totentanz nennt sich das – gemalt in den Pestjahren, als das Sterben zum Alltag gehörte. Die Botschaft war demokratisch und radikal: Der Tod macht keine Unterschiede, Reichtum hin oder her. Das Verblüffende: Luzerner Familien bezahlten dafür, auf diesen Tafeln verewigt zu werden – ihre Wappen kleben neben dem Sensenmann. Man wollte dabei sein, sogar beim Memento mori. Nimm dir Zeit für ein paar Tafeln. Es ist das eindringlichste Kunstwerk der Stadt – und es hängt gratis in einem Fussgängerübergang.",
    },
    {
      id: "museggmauer",
      name: "Museggmauer & Zytturm",
      teaser: "Die begehbare Stadtmauer – mit der Uhr, die allen eine Minute voraus ist.",
      coords: { lat: 47.0553, lng: 8.3043 },
      walkMinutesFromPrevious: 10,
      directions: "Hinter der Spreuerbrücke den beschilderten Aufstieg zur Museggmauer nehmen.",
      stayMinutes: 25,
      why: "Eine fast komplett erhaltene Stadtmauer von 1400 mit neun Türmen – drei davon kannst du besteigen, gratis.",
      story:
        "870 Meter Mauer, neun Türme, gebaut um 1400 – die Musegg ist eine der besterhaltenen Stadtbefestigungen der Schweiz. Im Zytturm hängt die älteste Uhr der Stadt (1535), und sie hat ein verbrieftes Privileg: Sie darf jede Stunde eine Minute VOR allen anderen Uhren schlagen. Vom Männliturm aus liegt dir die ganze Stadt zu Füssen: Dächer, Reuss, See, Pilatus.",
      funFact: "Das Uhrwerk von 1535 läuft noch mechanisch – aufgezogen von Hand, und der Eine-Minute-Vorsprung ist amtlich geschützt.",
      insiderTip: "Kurz vor der vollen Stunde im Zytturm sein: Erst schlägt es hier, dann antwortet die ganze Stadt – Gänsehaut-Moment.",
      photoSpot: "Vom Männliturm über die Altstadt-Dächer zum See – das beste Panorama Luzerns.",
      audioScript:
        "Achthundertsiebzig Meter Mauer, neun Türme, sechshundert Jahre alt – und du darfst einfach rauf. Die Museggmauer war Luzerns Schutzschild, gebaut um 1400, und sie ist fast komplett erhalten, weil die Stadt schlicht nie erobert wurde. Drei Türme sind begehbar, und einer davon hat die beste Geschichte der Stadt: der Zytturm mit der ältesten Uhr Luzerns, Baujahr 1535. Diese Uhr hat ein offizielles, bis heute gültiges Privileg – sie darf jede Stunde eine Minute vor allen anderen Uhren der Stadt schlagen. Eine Minute Vorsprung, amtlich garantiert, seit fast fünfhundert Jahren. Warum? Damit alle wissen: Die Zeit der Stadt wird HIER gemacht. Wenn du es einrichten kannst, steh kurz vor der vollen Stunde im Turm: Erst schlägt das alte Werk über dir, schwer und mechanisch – und dann antworten, eine Minute später, alle Glocken der Stadt. Danach steig auf den Männliturm: Dächer, Reuss, See und Pilatus liegen dir zu Füssen. Es ist der beste Aussichtspunkt Luzerns, und er kostet: nichts.",
    },
    {
      id: "weinmarkt",
      name: "Weinmarkt & Altstadtplätze",
      teaser: "Bemalte Fassaden wie Bilderbücher – hier schwor Luzern 1332 den Eidgenossen die Treue.",
      coords: { lat: 47.0521, lng: 8.305 },
      walkMinutesFromPrevious: 12,
      directions: "Von der Mauer hinunter in die Altstadt, den Gassen zum Weinmarkt folgen.",
      stayMinutes: 15,
      why: "Die Altstadtplätze sind ein Freilichtmuseum der Fassadenmalerei – und historischer Boden erster Güte.",
      story:
        "Auf dem Weinmarkt trat Luzern 1332 als erste Stadt dem Bund der Waldstätte bei – die Geburtsstunde der Stadt-Eidgenossenschaft. Die Häuser ringsum tragen Fresken wie Festgewänder: Zunftszenen, Heilige, Fabelwesen. Auch Hirschenplatz und Kornmarkt sind bemalt – Luzern war zu reich, um seine Wände leer zu lassen.",
      funFact: "Auf dem Hirschenplatz logierte Goethe 1779 – im Gasthaus «Zum Hirschen», die Fassade erzählt es bis heute.",
      insiderTip: "Nach oben schauen, nicht in die Schaufenster: Die besten Details (Drachen, Narren, Wappen) sitzen im zweiten und dritten Stock.",
      photoSpot: "Weinmarkt-Brunnen mit den Fassaden im Rundumblick.",
      audioScript:
        "Bleib mal mitten auf diesem Platz stehen und dreh dich langsam einmal im Kreis. Diese bemalten Fassaden sind keine Tapete für Touristen – das ist Renaissance-Prahlerei im Original. Luzern lag am Gotthardweg und verdiente prächtig; und wer Geld hatte, liess sein Haus bemalen wie ein Bilderbuch: Zunftszenen, Heilige, Drachen, Lebensweisheiten. Und dieser Platz hier, der Weinmarkt, ist dazu noch heiliger Boden der Schweizer Geschichte: 1332 schwor Luzern genau hier den Waldstätten Uri, Schwyz und Unterwalden die Treue – als erste Stadt überhaupt. Aus dem Bauernbund wurde damit ein Machtfaktor, aus dem Machtfaktor irgendwann die Schweiz. Die Touristenströme schieben sich meist nur durch die Hauptgasse – nimm dir die Nebenplätze: Hirschenplatz, wo Goethe übernachtete, Kornmarkt mit dem alten Rathaus. Und immer schön nach oben schauen. In Luzern spielt die Musik im zweiten Stock.",
      nearby: [
        { name: "Wirtshaus Galliker", type: "restaurant", note: "Seit 1856 unverändert: Chügelipastete und Innereien – Luzern auf dem Teller, keine Touristenfalle.", address: "Schützenstrasse 1, 6003 Luzern" },
      ],
    },
    {
      id: "loewendenkmal",
      name: "Löwendenkmal",
      teaser: "«Der traurigste und bewegendste Stein der Welt» – Mark Twain.",
      coords: { lat: 47.0585, lng: 8.311 },
      walkMinutesFromPrevious: 12,
      directions: "Durch die Altstadt und über den Löwenplatz zum Denkmal-Park.",
      stayMinutes: 12,
      why: "Ein sterbender Löwe, in eine Felswand gehauen – Weltliteratur aus Stein, mitten in einem stillen Park.",
      story:
        "Der Löwe erinnert an die rund 760 Schweizergardisten, die 1792 beim Sturm auf die Tuilerien in Paris starben – sie verteidigten einen König, der längst geflohen war. Bertel Thorvaldsen entwarf den sterbenden Löwen, durchbohrt von einer Lanze, die Pranke noch schützend über dem Bourbonen-Lilienschild. Mark Twain nannte ihn «den traurigsten und bewegendsten Stein der Welt».",
      funFact: "Schau auf die Umrisslinie der Nische: Sie hat die Form eines Schweins – angeblich die Rache des Bildhauers, der um sein Honorar geprellt wurde.",
      insiderTip: "Früh morgens oder abends kommen: Dann ist der kleine Park still, und der Löwe wirkt, wie Twain ihn sah.",
      photoSpot: "Frontal über den Teich – Spiegelung inklusive.",
      audioScript:
        "Es gibt Denkmäler, die beeindrucken. Und es gibt dieses hier, das wehtut. In die Sandsteinwand vor dir ist ein sterbender Löwe gehauen, zehn Meter lang: Eine abgebrochene Lanze steckt in seiner Flanke, der Kopf sinkt, und mit der letzten Kraft hält seine Pranke ein Schild mit der französischen Lilie. Er erinnert an die Schweizergardisten, die am 10. August 1792 in Paris die Tuilerien verteidigten – gegen die Revolution, für einen König, der da längst geflohen war. Rund 760 Schweizer starben für einen leeren Palast, aus Pflichttreue. Mark Twain stand 1880 genau hier und schrieb: der traurigste und bewegendste Stein der Welt. Und dann ist da noch das Detail, das fast niemand sieht: Tritt einen Schritt zurück und schau auf den Umriss der Felsnische. Sie hat – ziemlich eindeutig – die Form eines Schweins. Die Legende sagt: Der Bildhauer wurde ums Honorar geprellt und rächte sich für die Ewigkeit. Trauer und Trotz, in denselben Fels gehauen. Schweizerischer geht es kaum.",
    },
    {
      id: "nationalquai",
      name: "Nationalquai & Seebecken",
      teaser: "Das Finale: Pilatus, Rigi und Dampfschiffe – Luzerns grosse Bühne.",
      coords: { lat: 47.0541, lng: 8.3122 },
      walkMinutesFromPrevious: 8,
      directions: "Vom Löwendenkmal hinunter zum See und rechts auf den Quai.",
      stayMinutes: 20,
      why: "Der schönste Spazierkilometer der Zentralschweiz – Belle-Époque-Kulisse mit Bergpanorama.",
      story:
        "Im 19. Jahrhundert wurde Luzern zur Bühne des europäischen Tourismus: Queen Victoria ritt auf die Rigi, Wagner komponierte in Tribschen, die Grandhotels am Quai empfingen Zaren und Industrielle. Der Nationalquai mit seinen Kastanien ist das Erbe dieser Epoche – und die Dampfschiffe, die hier ablegen, fahren teils seit über 100 Jahren.",
      funFact: "Die «Stadt Luzern» von 1928 ist das letzte je in der Schweiz gebaute Raddampfschiff – und fährt noch immer fahrplanmässig.",
      insiderTip: "Mit einem Getränk auf die Quai-Mauer sitzen, wenn ein Raddampfer ablegt – grosses Kino, null Eintritt. Oder gleich aufs Schiff: Kurze Rundfahrten gibts ab einer Stunde.",
      photoSpot: "Quai-Mitte Richtung Pilatus bei tiefer Sonne – Berge, See, Dampfschiff.",
      audioScript:
        "Das Finale gehört der grossen Bühne. Der Nationalquai war im neunzehnten Jahrhundert der Laufsteg Europas: Hier flanierten Zaren und Stahlbarone, Queen Victoria stieg um die Ecke ab, Richard Wagner komponierte drüben in Tribschen seine Meistersinger und beschwerte sich über die Touristen – zu denen er selbst gehörte. Luzern hat den Tourismus nicht erlebt, Luzern hat ihn miterfunden. Und die Kulisse spielt bis heute mit: links der schroffe Pilatus, der Hausdrache, rechts die sanfte Rigi, die Königin der Berge, dazwischen der See – und mit etwas Glück legt gerade ein Raddampfer ab. Die Stadt Luzern, Baujahr 1928, ist das letzte Dampfschiff, das je in der Schweiz gebaut wurde, und sie fährt noch immer im Fahrplan, mit blankpolierten Kolben, denen man im Maschinenraum zuschauen darf. Hol dir was zu trinken, setz dich auf die Quaimauer und lass die Tour ausklingen: zwei Brücken, neun Türme, ein Löwe und ein See voller Geschichte. Luzern, einmal richtig. Bis zum nächsten Trail!",
      nearby: [
        { name: "Wirtshaus Taube / Quai-Buvetten", type: "bar", note: "Im Sommer Buvetten direkt am Wasser – Apéro mit Pilatus-Blick.", address: "Nationalquai, 6006 Luzern" },
      ],
    },
  ],
};
