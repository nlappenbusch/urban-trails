import type { Tour } from "@/lib/types";

export const baselRhein: Tour = {
  slug: "basel-rhein",
  citySlug: "basel",
  category: "urban-vibes",
  name: "Basel – Stadt am Strom",
  claim: "Münster, Fähren ohne Motor und ein Fluss als Verkehrsmittel – Basel macht alles ein bisschen anders.",
  teaser:
    "Vom roten Rathaus über die Pfalz-Terrasse und die Mittlere Brücke nach Kleinbasel – mit Gierseilfähre, Wickelfisch-Kultur und Rheinblick-Finale.",
  description:
    "Basel ist die Schweizer Stadt mit dem südländischsten Lebensgefühl – und der Rhein ist ihr Boulevard. Diese Tour startet beim knallroten Rathaus, steigt zum Münster und seiner Pfalz-Terrasse hoch über dem Strom, quert auf der ältesten Rheinbrücke zwischen Bodensee und Nordsee – und wechselt dann die Seite wie die Basler selbst: mit einer Fähre, die ohne Motor fährt, nur von der Strömung gezogen. Drüben wartet Kleinbasel, die raue, charmante Schwester, und am Ende sitzt du am Unteren Rheinweg, wo im Sommer halb Basel mit wasserdichten Säcken den Fluss hinuntertreibt. Anders. Besser.",
  moods: ["natur", "kultur", "menschen"],
  audience: "Rhein-Romantiker, Architektur-Fans, Sommerschwimmer – und alle, die Basel nur von der Messe kennen.",
  vibe: "Mediterran am Strom – lässig, grenznah, mit trockenem Witz.",
  bestTimeOfDay: "Nachmittag bis Sonnenuntergang – das Finale am Rheinufer ist abends am besten.",
  bestSeason: "Mai bis September fürs volle Rheinschwimm-Spektakel; die Tour selbst geht ganzjährig.",
  difficulty: "leicht",
  durationMinutes: 160,
  distanceKm: 4.5,
  startPoint: "Marktplatz / Rathaus",
  endPoint: "Unterer Rheinweg (Kleinbasel)",
  publicTransport: {
    start: "Tram 6/8/11/14/16/17 «Marktplatz» – ab Bahnhof SBB 7 Min.",
    end: "Tram 8/17 «Rheingasse» oder 15 Min. zu Fuss zum Bahnhof",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1f6b5e", "#ff7a3d"],
  seo: {
    metaTitle: "Basel zu Fuss: Münster, Rheinfähre & Kleinbasel mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Tour durch Basel: 7 Stops vom roten Rathaus über die Pfalz und Mittlere Brücke bis zur motorlosen Rheinfähre und ans Kleinbasler Ufer. Audio-Stories, Karte, Geheimtipps.",
    keywords: ["Basel Sehenswürdigkeiten zu Fuss","Basel Altstadt Rundgang","Basler Münster Pfalz","Rheinfähre Basel","Basel Audioguide"],
  },
  faq: [
    { question: "Wie lange dauert die Tour?", answer: "Rund 2½ Stunden inklusive Fährfahrt und Pausen – reine Gehzeit etwa eine Stunde." },
    { question: "Was kostet die Fähre?", answer: "Ein paar Franken, bar oder Twint beim Fährimaa – die Fahrt dauert nur Minuten, ist aber das Basel-Erlebnis schlechthin." },
    { question: "Kann ich wirklich im Rhein schwimmen?", answer: "Im Sommer ja – mit Wickelfisch (wasserdichter Schwimmsack, gibts in Stadtläden) treiben lassen, Ausstiege sind markiert. Nur für sichere Schwimmer." },
    { question: "Lohnt sich Basel als Tagesausflug?", answer: "Sehr – ab Zürich oder Bern eine knappe Stunde, und diese Tour plus ein Museum füllen einen grossartigen Tag." },
  ],
  stops: [
    {
      id: "marktplatz-rathaus",
      name: "Marktplatz & Rathaus",
      teaser: "Das röteste Rathaus der Schweiz – aussen Markt, innen Märchenhof.",
      coords: { lat: 47.5584, lng: 7.5879 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 15,
      why: "Basels Bühne: leuchtend rotes Rathaus, Marktstände davor, und ein Innenhof, den die meisten verpassen.",
      story:
        "Das Rathaus von 1514 leuchtet in sattem Rot mit goldenen Zinnen und Fresken – gebaut, kurz nachdem Basel 1501 der Eidgenossenschaft beitrat, als selbstbewusste Ansage des reichen Stadtstaats. Der Innenhof ist frei zugänglich: bemalte Arkaden, eine prächtige Treppe und die Statue des Stadtgründers Munatius Plancus – ein Römer, denn Basel ist älter als die Schweiz, älter als fast alles hier.",
      funFact: "Die Basler nennen ihr Rathaus liebevoll «Roothuus» – und der Turm daneben ist jünger als er aussieht: 1900 im Neo-Stil dazugebaut.",
      insiderTip: "Unbedingt in den Innenhof gehen (werktags offen) – die Fresken und die Ratsstube-Treppe übersehen 90 % der Besucher.",
      photoSpot: "Schräg vom Marktplatz mit Marktständen im Vordergrund – das Rot knallt am Vormittag.",
      audioScript:
        "Dieses Rot siehst du nirgendwo sonst in der Schweiz. Das Basler Rathaus leuchtet seit 1514 wie eine Theaterkulisse – Sandstein, rot gestrichen, goldene Zinnen, Fresken bis unters Dach. Und genau so war es gemeint: Basel war 1501 der Eidgenossenschaft beigetreten, als reiche, gelehrte Handelsstadt mit Universität und Buchdruck – und baute sich ein Rathaus, das allen zeigte, wer hier der neue starke Partner ist. Geh unbedingt durch den Haupteingang in den Innenhof, der ist offen und gratis: bemalte Arkaden, eine Prunktreppe, und oben wacht eine Statue – kein Eidgenosse, sondern ein Römer. Munatius Plancus, der angebliche Stadtgründer. Basel pflegt seine Wurzeln gern ein paar Jahrhunderte tiefer als der Rest des Landes. Draussen auf dem Platz duftet werktags der Markt nach Käse und Blumen. Schnapp dir etwas für unterwegs – wir steigen jetzt hoch zum Münster, und danach gehört der Rest des Tages dem Fluss.",
      nearby: [
        { name: "Markt am Marktplatz", type: "shop", note: "Werktags vormittags: Käse, Brot, Blumen – Tour-Proviant erster Klasse.", address: "Marktplatz, 4001 Basel" },
      ],
    },
    {
      id: "muenster-pfalz",
      name: "Basler Münster & Pfalz",
      teaser: "Roter Sandstein, Erasmus' Grab – und die schönste Terrasse über dem Rhein.",
      coords: { lat: 47.5564, lng: 7.5921 },
      walkMinutesFromPrevious: 8,
      directions: "Vom Marktplatz die Sporenburg-Gassen hinauf zum Münsterhügel.",
      stayMinutes: 25,
      why: "Das Wahrzeichen aus rotem Sandstein – und dahinter die Pfalz, Basels Balkon mit Blick über Strom und Schwarzwald.",
      story:
        "Auf dem Münsterhügel siedelten schon die Kelten; das heutige Münster aus rotem Vogesen-Sandstein trägt Spuren von Romanik bis Spätgotik – und im Innern das Grab des Erasmus von Rotterdam, des berühmtesten Gelehrten seiner Zeit, der Basel zur geistigen Hauptstadt Europas machte. Dahinter öffnet sich die Pfalz: eine Platanen-Terrasse 20 Meter über dem Rhein, mit Blick über Kleinbasel bis zum Schwarzwald.",
      funFact: "An der Fassade reitet der heilige Georg gegen einen ziemlich kleinen Drachen – die Basler sagen: Der Drache sei geschrumpft, das Budget auch.",
      insiderTip: "Die Pfalz ist DER Ort für die erste Rast: Mauer, Schatten, Strom-Blick. Unten am Fluss siehst du schon die Fähre pendeln – dein Transportmittel in einer Stunde.",
      photoSpot: "Von der Pfalz-Brüstung rheinabwärts – Fluss, Brücken, Kleinbasel.",
      audioScript:
        "Roter Sandstein, zwei ungleiche Türme, tausend Jahre Geschichte – das Basler Münster. Hier oben auf dem Hügel sassen schon die Kelten, dann die Römer, dann die Bischöfe, denen Basel seinen Namen im Wappen verdankt: den Baselstab, den Bischofsstab. Drinnen liegt ein Mann begraben, der Europa veränderte, ohne je ein Schwert anzufassen: Erasmus von Rotterdam, der grösste Gelehrte seiner Zeit. Er kam nach Basel, weil hier die besten Buchdrucker Europas sassen – Basel war im sechzehnten Jahrhundert das, was heute ein Tech-Hub ist: der Ort, wo Wissen produziert und in die Welt verschickt wurde. Und dann geh hinter die Kirche, auf die Pfalz. Diese Platanen-Terrasse, zwanzig Meter über dem Rhein, ist der schönste Balkon der Stadt: Unter dir zieht der Strom, gegenüber liegt Kleinbasel, am Horizont der Schwarzwald – drei Länder in einem Blick, Frankreich und Deutschland sind nur ein paar Kilometer flussabwärts. Bleib einen Moment an der Brüstung. Den Fluss, den du hier von oben siehst, wirst du gleich überqueren – zweimal, auf zwei sehr verschiedene Arten.",
    },
    {
      id: "mittlere-bruecke",
      name: "Mittlere Brücke",
      teaser: "Die älteste Rheinbrücke weit und breit – seit 1226 Basels Lebensader.",
      coords: { lat: 47.5599, lng: 7.5904 },
      walkMinutesFromPrevious: 7,
      directions: "Vom Münsterhügel über den Rheinsprung hinunter zur Brücke.",
      stayMinutes: 10,
      why: "Hier wurde Basel reich: Jahrhundertelang war dies der einzige feste Rheinübergang zwischen Bodensee und Meer.",
      story:
        "1226 eröffnet, war die Mittlere Brücke über Jahrhunderte der einzige feste Rheinübergang zwischen Konstanz und der Nordsee – jeder Kaufmann, jeder Pilger musste hier durch und zahlte Zoll. Auf der Brückenmitte steht das Käppelijoch, eine kleine Kapelle; von hier wurden im Mittelalter Verurteilte in den Rhein gestossen. Wer das Ufer lebend erreichte, war frei – Gottesurteil, Basler Ausgabe.",
      funFact: "Die heutige Brücke ist von 1905 – aber das Käppelijoch wurde originalgetreu wieder aufgesetzt, inklusive Basilisk, dem Basler Fabelwesen.",
      insiderTip: "Vom Käppelijoch flussaufwärts schauen: Münster, Pfalz und mit Glück eine Fähre quer im Strom – das Basel-Panorama.",
      photoSpot: "Brückenmitte mit Blick auf Münsterhügel und Pfalz.",
      audioScript:
        "Du überquerst gerade den Grund, warum es Basel gibt. 1226 wurde hier die erste Brücke über den Rhein geschlagen – und sie blieb über Jahrhunderte die einzige feste Querung zwischen dem Bodensee und der Nordsee. Lass dir das auf der Zunge zergehen: Wer immer Waren von Italien nach Flandern bringen wollte, von den Alpenpässen zu den Häfen – er musste über diese Brücke. Und er zahlte. Basel wurde reich, ohne selbst viel herzustellen; die Stadt war die Mautstelle Europas. In der Brückenmitte steht das Käppelijoch, die kleine Kapelle – und die hat eine dunkle Doppelrolle: Von hier wurden im Mittelalter Verurteilte in den Rhein gestossen. Wer es lebend ans Ufer schaffte, war begnadigt – die Strömung als Richter. Auf dem Dach hockt übrigens ein Basilisk, das Basler Fabelwesen, halb Hahn, halb Schlange. Drüben wartet Kleinbasel – aber wir nehmen für die Rückkehr nachher nicht die Brücke. Wir nehmen das Boot ohne Motor. Du wirst es lieben.",
    },
    {
      id: "rheingasse-kleinbasel",
      name: "Rheingasse & Kleinbasel",
      teaser: "Die raue Schwester: multikulti, ehrlich, mit den besten Beizen der Stadt.",
      coords: { lat: 47.5605, lng: 7.5926 },
      walkMinutesFromPrevious: 3,
      directions: "Nach der Brücke rechts in die Rheingasse.",
      stayMinutes: 15,
      why: "Kleinbasel ist Basels Gegenstück zum feinen Grossbasel – Quartierleben, alte Zunfthäuser, neue Szene.",
      isHiddenGem: true,
      story:
        "Kleinbasel, das «mindere Basel», war immer die Seite der Handwerker, Schiffer und Zugezogenen – und pflegt bis heute eine eigene Identität samt eigenen Ehrengesellschaften und dem «Vogel Gryff»-Fest, bei dem drei Wappentiere tanzen und dem feinen Grossbasel demonstrativ den Rücken zukehren. Die Rheingasse war einst Basels verrufenste Gasse; heute reihen sich hier die lässigsten Beizen der Stadt.",
      funFact: "Beim Vogel-Gryff-Tanz im Januar dreht der Wilde Mann dem Grossbasler Ufer konsequent den Hintern zu – seit Jahrhunderten, mit Hingabe.",
      insiderTip: "In der Rheingasse liegt die älteste Beiz der Stadt («Zum Goldenen Fass» u.a.) neben Neo-Kneipen – abends ist die Gasse ein einziges Strassenfest.",
      photoSpot: "Rheingasse Richtung Brücke – Altbauten, Beizen-Schilder, Leben.",
      audioScript:
        "Willkommen auf der anderen Seite – wörtlich und gesellschaftlich. Kleinbasel hiess jahrhundertelang offiziell das mindere Basel: Hier wohnten Schiffer, Handwerker, Taglöhner, später die Gastarbeiter, heute hundert Nationen. Drüben das Geld, hüben die Arbeit – so war das sortiert. Aber Kleinbasel hat aus der zweiten Reihe eine Identität gemacht, die ihresgleichen sucht. Jedes Jahr im Januar tanzen hier drei Wappentiere durch die Gassen: der Vogel Gryff, der Leu und der Wilde Mann. Und der Wilde Mann tanzt auf einem Floss den Rhein hinunter – und dreht dabei dem feinen Grossbasler Ufer demonstrativ den Rücken zu. Seit Jahrhunderten. Mit Inbrunst. Diese Gasse hier, die Rheingasse, war einst die verrufenste Adresse der Stadt – Spelunken, Matrosen, Ärger. Heute ist sie Basels lässigste Ausgehmeile: alte Zunftbeizen neben Naturwein-Bars, alles ehrlich, nichts poliert. Merk sie dir für nachher – das Finale dieser Tour liegt nur zweihundert Meter flussabwärts, und danach hast du dir ein Bier in der Gasse verdient.",
      nearby: [
        { name: "Beizen der Rheingasse", type: "bar", note: "Von der ältesten Beiz bis zur Szene-Bar – abends Basels lebendigste Gasse.", address: "Rheingasse, 4058 Basel" },
      ],
    },
    {
      id: "klingental-faehre",
      name: "Rheinfähre «Klingental»",
      teaser: "Vier Fähren, null Motoren – nur Strömung, Seil und Fährimaa.",
      coords: { lat: 47.559, lng: 7.5958 },
      walkMinutesFromPrevious: 5,
      directions: "Ans Kleinbasler Ufer und flussaufwärts zum Fähristeg.",
      stayMinutes: 15,
      why: "Das vielleicht schönste Verkehrsmittel Europas: eine Gierseilfähre, angetrieben allein vom Rhein.",
      story:
        "Vier Fähren pendeln in Basel über den Rhein – ohne Motor. Sie hängen an einem hoch gespannten Seil, der Fährimaa stellt das Ruder schräg, und die Strömung drückt das Boot ans andere Ufer: Gierseilfähre nennt sich das Prinzip, seit 1854 in Betrieb. Leise, emissionsfrei und meditativ – die Überfahrt dauert wenige Minuten und ist Basels liebste Tradition.",
      funFact: "Jede Fähre trägt den Namen eines Basler Wappentiers – Wilde Maa, Leu, Vogel Gryff, Ueli – und jede hat ihren eigenen, oft wunderbar eigensinnigen Fährimaa.",
      insiderTip: "Fahr rüber und gleich wieder zurück, wenn du magst – oder nimm die Fähre als Abkürzung zum Münster-Ufer und lauf drüben zurück zur Brücke. Barzahlung oder Twint.",
      photoSpot: "Vom Steg: Fähre quer im Strom, Münster dahinter – das Basler Bild.",
      audioScript:
        "Und jetzt das Highlight – steig ein. Dieses kleine Holzboot ist ein Wunder der Einfachheit: kein Motor, kein Lärm, kein Treibstoff. Die Fähre hängt an einem langen Seil, das hoch über den Rhein gespannt ist. Der Fährimaa stellt das Ruder schräg in die Strömung – und der Fluss selbst drückt das Boot ans andere Ufer, wie von Geisterhand. Gierseilfähre heisst das Prinzip, und Basel betreibt es seit 1854, mit vier Fähren, jede nach einem Wappentier benannt: Wilde Maa, Leu, Vogel Gryff und Ueli. Während der Überfahrt hörst du nichts als das Wasser am Rumpf und vielleicht den Fährimaa, der dir mit trockenem Basler Humor erklärt, warum sein Boot das einzig vernünftige Verkehrsmittel der Welt ist. Er hat vermutlich recht. Drei Minuten dauert die Magie, ein paar Franken kostet sie, und sie ist mehr Basel als jedes Museum: Die Stadt hat den schnellsten Strom Europas vor der Tür – und nutzt ihn als sanftesten Antrieb. Drüben angekommen, schau zurück: Fähre, Strom, Münster. Wenn dich Basel bis hierher nicht hatte – jetzt hat es dich.",
    },
    {
      id: "unterer-rheinweg",
      name: "Unterer Rheinweg",
      teaser: "Basels Sommer-Boulevard: Buvetten, Treppen ans Wasser, Schwimmer im Strom.",
      coords: { lat: 47.5622, lng: 7.5945 },
      walkMinutesFromPrevious: 5,
      directions: "Zurück am Kleinbasler Ufer flussabwärts dem Rheinweg folgen.",
      stayMinutes: 20,
      why: "Die schönste Uferpromenade der Schweiz – im Sommer Basels Wohnzimmer, Badi und Bar in einem.",
      story:
        "Der Untere Rheinweg ist Kleinbasels Flaniermeile: breite Treppen ans Wasser, Buvetten, Bäume – und im Sommer das grosse Schauspiel: Hunderte Basler steigen mit ihrem «Wickelfisch», dem wasserdichten Schwimmsack, in den Rhein und lassen sich kilometerweit durch die Stadt treiben, die Kleider trocken im Sack. Schwimmen ist hier nicht Sport, sondern Verkehrsmittel und Lebenshaltung.",
      funFact: "Der Wickelfisch wurde in Basel erfunden – der fischförmige Schwimmsack ist inoffizielles Stadtsymbol und Standard-Pendlergepäck im Juli.",
      insiderTip: "Abends mit einem Getränk auf die Ufertreppen setzen: gegenüber leuchtet das Münster, im Wasser ziehen die letzten Schwimmer vorbei.",
      photoSpot: "Von den Treppen flussaufwärts: Münster-Silhouette über dem Strom zur goldenen Stunde.",
      audioScript:
        "Setz dich auf eine der Treppenstufen – hier endet die Tour, und hier zeigt Basel sein wahres Gesicht. Im Sommer passiert an diesem Ufer etwas, das Besucher aus aller Welt fassungslos macht: Menschen in Badehosen marschieren flussaufwärts, unter dem Arm einen knallbunten, fischförmigen Sack. Dann steigen sie in den Rhein – einen der mächtigsten Ströme Europas – und lassen sich treiben, vorbei am Münster, unter den Brücken durch, kilometerweit. Im Sack: Kleider, Handy, Portemonnaie, alles trocken. Wickelfisch heisst das Ding, eine Basler Erfindung, und es hat das Pendeln revolutioniert: Manche schwimmen im Juli tatsächlich zur Arbeit. Der Fluss ist hier nicht Kulisse – er ist Badi, Boulevard und Verkehrsmittel zugleich. Gegenüber glüht das Münster im Abendlicht, hinter dir öffnet die nächste Buvette, und die Rheingasse mit ihren Beizen wartet zwei Minuten landeinwärts. Du hast heute eine Stadt gesehen, die mit ihrem Fluss lebt wie keine andere im Land. Bleib sitzen, solange das Licht hält. Basel hat es nicht eilig – und du gerade auch nicht. Bis zum nächsten Trail!",
      nearby: [
        { name: "Buvetten am Rheinweg", type: "bar", note: "Mai–September: Flying Deck & Co. direkt am Wasser – Apéro mit Münsterblick.", address: "Unterer Rheinweg, 4058 Basel" },
      ],
    },
  ],
};
