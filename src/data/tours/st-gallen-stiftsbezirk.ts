import type { Tour } from "@/lib/types";

export const stGallenStiftsbezirk: Tour = {
  slug: "st-gallen-stiftsbezirk",
  citySlug: "st-gallen",
  category: "story-mode",
  name: "St. Gallen – Bücher, Erker, roter Platz",
  claim: "Eine Bibliothek als Weltwunder, Erker als Statussymbole und ein Stadtplatz aus rotem Gummi.",
  teaser:
    "Vom UNESCO-Stiftsbezirk mit der schönsten Bibliothek der Welt durch die Erker-Altstadt zur knallroten Stadtlounge – und hinauf zu den Drei Weieren.",
  description:
    "St. Gallen verdankt einem irischen Wandermönch seinen Namen und einem Buchstaben-Schatz seinen Weltruhm: Die Stiftsbibliothek hütet 170'000 Bände, darunter Handschriften aus der Zeit Karls des Grossen – der Saal dazu gilt als schönster Bibliotheksraum der Welt. Drumherum: eine Altstadt, deren Kaufleute sich mit immer prächtigeren Erkern überboten, ein Stadtquartier, das Pipilotti Rist kurzerhand mit rotem Belag übergoss, und über allem die Drei Weieren – Badeteiche mit Stadtblick. Textilgeld, Klosterwissen, Kunst-Mut: St. Gallen in sechs Stops.",
  moods: ["kultur", "aussicht", "ruhe"],
  audience: "Bücherfreunde, Architektur-Fans, Ostschweiz-Entdecker – ideal als Tagesausflug ab Zürich (1 h).",
  vibe: "Gelehrt und verspielt zugleich – Barock trifft Pipilotti Rist.",
  bestTimeOfDay: "Vormittag für die Bibliothek (ruhiger), Abend für die Drei Weieren.",
  bestSeason: "Ganzjährig; Drei-Weieren-Bad Mai–September.",
  difficulty: "leicht",
  durationMinutes: 150,
  distanceKm: 3.8,
  startPoint: "Bahnhof St. Gallen",
  endPoint: "Drei Weieren (via Mühleggbahn)",
  publicTransport: {
    start: "Bahnhof St. Gallen – ab Zürich ~65 Min.",
    end: "Mühleggbahn talwärts, dann 10 Min. zum Bahnhof",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1f4a2a", "#d63f00"],
  seo: {
    metaTitle: "St. Gallen zu Fuss: Stiftsbibliothek, Erker & Drei Weieren mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Tour durch St. Gallen: UNESCO-Stiftsbezirk, die schönste Bibliothek der Welt, Erker-Altstadt, rote Stadtlounge und Drei Weieren. 6 Stops mit Audio-Stories.",
    keywords: ["St. Gallen Sehenswürdigkeiten","Stiftsbibliothek St. Gallen","St. Gallen Altstadt Rundgang","Drei Weieren","St. Gallen Audioguide"],
  },
  faq: [
    { question: "Was kostet die Stiftsbibliothek?", answer: "Eintritt ca. CHF 18 – und jeden Rappen wert. Filzpantoffeln gibts am Eingang, fotografieren ist drinnen tabu." },
    { question: "Wie komme ich zu den Drei Weieren?", answer: "Mit der Mühleggbahn (Standseilbahn, ÖV-Tarif) ab Altstadt-Rand – oben sind es 5 Minuten zu den Teichen." },
    { question: "Lohnt sich die Tour bei Regen?", answer: "Bibliothek, Kathedrale und Lauben sind gedeckt – nur das Weieren-Finale will trockenes Wetter." },
  ],
  stops: [
    {
      id: "bahnhof-st-gallen",
      name: "Bahnhof & Hauptpost",
      teaser: "Ankommen in der Textilmetropole von einst.",
      coords: { lat: 47.4233, lng: 9.3699 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 5,
      why: "Kurzer Auftakt: Hier zeigte sich St. Gallens Stickerei-Reichtum in Stein.",
      story:
        "Um 1900 kleidete St. Galler Stickerei die halbe Welt – die Stadt war Weltmarktführerin, und Prachtbauten wie die Hauptpost künden vom Textilgeld. Dann kam der Erste Weltkrieg, die Mode änderte sich, der Boom zerplatzte. Geblieben sind die Bauten – und Spitzenstoffe für Haute Couture bis heute.",
      funFact: "Noch heute stammen Stoffe für Pariser Laufstege aus St. Galler Manufakturen – Michelle Obamas Inaugurationskleid trug Stickerei von hier.",
      insiderTip: "Im Bahnhofbuffet-Gebäude lohnt der Blick nach oben – Belle-Époque-Reste überall.",
      photoSpot: "Hauptpost-Fassade von der Bahnhofstrasse.",
      audioScript:
        "Willkommen in der Stadt, die der Welt einst die Spitze lieferte – wörtlich. Um 1900 war St. Gallen Welthauptstadt der Stickerei: Mehr als die Hälfte der globalen Produktion kam aus dieser Region, die Pariser Mode hing an St. Galler Fäden, und das Geld floss in Prachtbauten wie die Hauptpost dort drüben. Dann kam der Krieg, die Mode wurde schlichter, und der Boom platzte wie eine Seifenblase. Aber zweierlei blieb: die Bauten – und das Können. Bis heute liefern hiesige Manufakturen Spitzenstoffe an Haute-Couture-Häuser; Michelle Obama trug bei der Amtseinführung St. Galler Stickerei. Die Stadt selbst aber wurde nicht vom Textil gegründet, sondern von einem Buch – beziehungsweise von einem irischen Mönch mit Bärenbegleitung. Dazu gleich mehr. Richtung Altstadt, der Stiftsbezirk wartet.",
    },
    {
      id: "stiftsbezirk-kathedrale",
      name: "Stiftsbezirk & Kathedrale",
      teaser: "UNESCO-Welterbe: Wo ein irischer Mönch 612 sein Kloster gründete.",
      coords: { lat: 47.4234, lng: 9.3768 },
      walkMinutesFromPrevious: 8,
      directions: "Durch die Multergasse zum Klosterplatz.",
      stayMinutes: 20,
      why: "Der barocke Doppelturm-Komplex ist das Herz der Stadt – und ihr Gründungsmythos in Stein.",
      story:
        "612 stolperte der irische Wandermönch Gallus hier in einen Dornbusch, deutete es als Zeichen und blieb – der Legende nach teilte er sein Brot mit einem Bären, der ihm dafür Holz brachte. Aus der Einsiedelei wurde eines der wichtigsten Klöster Europas. Die heutige Kathedrale (1767) ist Spätbarock vom Feinsten: türkisgrüne Stuckaturen, als stünde man in einer Hochzeitstorte.",
      funFact: "Der Bär ist bis heute im Stadtwappen – als Dank für die Bauholz-Lieferung, sozusagen der erste Handwerker der Stadt.",
      insiderTip: "In der Kathedrale nach hinten zur Beichtstuhl-Reihe gehen – die Stuck-Putten dort treiben es besonders bunt.",
      photoSpot: "Klosterhof-Wiese mit Doppelturm-Fassade.",
      audioScript:
        "Im Jahr 612 stolpert ein irischer Wandermönch namens Gallus genau hier in einen Dornbusch, fällt hin – und beschliesst, das sei ein Zeichen Gottes: Hier bleibe ich. Die Legende legt noch nach: Nachts kommt ein Bär ans Feuer, Gallus teilt sein Brot mit ihm, und der Bär bringt ihm dafür Holz für die Hütte. Deal. Der Bär steht bis heute im Stadtwappen – der erste Bauarbeiter St. Gallens. Aus der Einsiedelei wurde ein Kloster, aus dem Kloster eine der wichtigsten Wissenszentralen Europas: Hierher pilgerten Gelehrte, hier wurden Bücher kopiert, als Bücher noch Schätze waren. Die barocke Kathedrale vor dir kam erst 1767 – innen erwartet dich türkisgrüner Stuck, verspielt wie eine Hochzeitstorte, geh unbedingt kurz rein. Aber das eigentliche Heiligtum steht nebenan: ein Saal voller Bücher, für den Menschen aus aller Welt anreisen. Filzpantoffeln bereithalten.",
    },
    {
      id: "stiftsbibliothek",
      name: "Stiftsbibliothek",
      teaser: "«Seelenapotheke»: der schönste Bibliothekssaal der Welt.",
      coords: { lat: 47.4229, lng: 9.3762 },
      walkMinutesFromPrevious: 2,
      directions: "Eingang im Klosterhof, Südflügel.",
      stayMinutes: 30,
      why: "170'000 Bände, Handschriften aus dem 8. Jahrhundert, ein Rokoko-Saal zum Niederknien – Weltdokumentenerbe.",
      story:
        "Über dem Eingang steht griechisch «Psyches iatreion» – Apotheke der Seele. Drinnen: geschwungene Galerien aus poliertem Holz, Deckenfresken, und in Vitrinen Handschriften, die über 1200 Jahre alt sind, darunter der älteste erhaltene Architekturplan des Mittelalters, der St. Galler Klosterplan. Man schlurft in Filzpantoffeln über das Intarsienparkett – aus Ehrfurcht und Bodenschutz.",
      funFact: "Im Saal liegt auch eine ägyptische Mumie (Schepenese, 700 v. Chr.) – seit 200 Jahren skurrilster Dauergast der Bibliothek.",
      insiderTip: "Die Pantoffeln sind Pflicht und der heimliche Star – das Schlurf-Geräusch von 50 Besuchern gehört zum Erlebnis.",
      photoSpot: "Fotografieren drinnen verboten – das Bild bleibt im Kopf, und genau das macht es wertvoll.",
      audioScript:
        "Filzpantoffeln an – du betrittst die Seelenapotheke. So steht es auf Griechisch über der Tür: Psyches iatreion, Heilstätte der Seele. Und dann öffnet sich dieser Saal, und selbst abgebrühte Vielreisende werden still: geschwungene Holzgalerien, die im Licht glänzen, Deckenfresken, Bücherwände bis hinauf – der schönste Bibliotheksraum der Welt, sagen viele, und niemand widerspricht laut. Hundertsiebzigtausend Bände lagern hier, die ältesten über zwölfhundert Jahre alt. In den Vitrinen: Handschriften aus der Zeit Karls des Grossen und der berühmte St. Galler Klosterplan, der älteste Architekturplan des Mittelalters – gezeichnet um 820, nie gebaut, trotzdem weltberühmt. Und dann, zwischen all der Gelehrsamkeit, liegt da noch Schepenese: eine ägyptische Mumie, seit zweihundert Jahren Dauergast, weil ein Sammler sie einst der Bibliothek vermachte. Bücher, Barock und eine Mumie – schlurf langsam, schau lange. Solche Räume baut niemand mehr.",
    },
    {
      id: "erker-altstadt",
      name: "Erker-Altstadt",
      teaser: "111 Erker: Die Kaufleute zeigten am Haus, was die Firma hergab.",
      coords: { lat: 47.4239, lng: 9.3742 },
      walkMinutesFromPrevious: 5,
      directions: "Über Gallusplatz in Spisergasse und Kugelgasse.",
      stayMinutes: 15,
      why: "Die dichteste Erker-Sammlung der Schweiz – jedes Fenster ein Statussymbol mit Geschichte.",
      story:
        "111 Erker zieren die Altstadt – geschnitzt, bemalt, vergoldet. Die Textilkaufleute liessen an ihren Häusern darstellen, womit sie handelten und wie weit sie kamen: Kamele, Pelikane, Mohrenkönige erzählen von Handelsrouten bis Arabien. Der Erker war das LinkedIn-Profil des 17. Jahrhunderts – öffentlich, geschmückt, leicht übertrieben.",
      funFact: "Der berühmteste Erker («Zum Kamel») zeigt – natürlich – ein Kamel: Werbung für den Orienthandel des Besitzers.",
      insiderTip: "Spisergasse und Kugelgasse abschreiten und nur nach oben schauen – Crashkurs in Kaufmanns-Angeberei.",
      photoSpot: "Erker «Zum Pelikan» in der Schmiedgasse.",
      audioScript:
        "Kopf in den Nacken – jetzt kommt die Angeber-Meile. Hundertelf Erker hängen an den Häusern dieser Altstadt, geschnitzt, bemalt, manche vergoldet, und jeder einzelne war eine Investition in den Ruf. Im siebzehnten Jahrhundert galt: Wer im Leinwandhandel reüssierte, baute sich einen Erker – je exotischer die Motive, desto weiter die Handelsrouten, desto grösser das Prestige. Da prangen Kamele für den Orienthandel, Pelikane, Ananas, Mohrenkönige – das war Aussenwerbung, Statusbericht und Instagram-Feed in einem, nur in Eiche statt Pixeln. Mein Tipp: Lauf die Spisergasse und die Kugelgasse einfach langsam ab und schau konsequent in den ersten und zweiten Stock. Unten haben sich die Läden breitgemacht, aber oben ist das siebzehnte Jahrhundert komplett intakt – und es prahlt bis heute. Gleich danach wird es knallrot. Wörtlich.",
    },
    {
      id: "stadtlounge",
      name: "Stadtlounge – der rote Platz",
      teaser: "Pipilotti Rist goss ein ganzes Quartier in roten Gummi.",
      coords: { lat: 47.4244, lng: 9.3712 },
      walkMinutesFromPrevious: 5,
      directions: "Richtung Raiffeisenplatz / Bleicheli-Quartier.",
      stayMinutes: 12,
      why: "Einzigartig in Europa: ein öffentliches Wohnzimmer unter freiem Himmel – Sofas, Tische, Autos, alles rot.",
      story:
        "2005 verwandelten Künstlerin Pipilotti Rist und Architekt Carlos Martinez das Bankenquartier in eine «Stadtlounge»: Der gesamte Boden samt Sofas, Tischen und einem Auto-Podest wurde mit rotem Tartanbelag überzogen. Darüber schweben riesige Leuchten wie Mondsteine. Was als Provokation startete, ist heute Wahrzeichen – und tatsächlich benutztes Wohnzimmer.",
      funFact: "Der rote Belag ist derselbe wie auf Tartanbahnen – die Stadtlounge ist technisch gesehen eine begehbare Laufbahn zum Lümmeln.",
      insiderTip: "Aufs rote Sofa setzen ist nicht erlaubt, sondern erwünscht – abends, wenn die Kugelleuchten angehen, am stimmungsvollsten.",
      photoSpot: "Rotes Auto-Podest mit Bankentürmen dahinter – der Kontrast-Klassiker.",
      audioScript:
        "Und plötzlich: alles rot. Boden, Sofas, Tische, sogar ein Podest mit Auto – übergossen mit rotem Gummibelag, als hätte jemand das Quartier in Himbeersauce getaucht. Willkommen in der Stadtlounge, dem mutigsten Stück Stadtgestaltung der Schweiz. 2005 fragte sich St. Gallen, was man mit dem sterilen Bankenviertel anstellen könnte, und gab der Videokünstlerin Pipilotti Rist freie Hand. Ihre Antwort: Machen wir draussen ein Wohnzimmer. Der Belag ist tatsächlich Tartanbahn-Material – technisch lümmelst du gleich auf einer Laufbahn. Anfangs tobten die Kritiker: Geldverschwendung, Kindergarten, Schande! Heute ist der rote Platz das meistfotografierte Nachkriegs-Wahrzeichen der Stadt, und – wichtiger – er wird benutzt: Büroleute beim Lunch, Studierende, Familien, alle auf rotem Gummi. Setz dich aufs Sofa, das ist hier Programm. Danach wartet das Finale in der Höhe: Wasser mit Aussicht.",
    },
    {
      id: "drei-weieren",
      name: "Drei Weieren",
      teaser: "Das Finale: Badeteiche über der Stadt – St. Gallens Sonnendeck.",
      coords: { lat: 47.4172, lng: 9.3823 },
      walkMinutesFromPrevious: 15,
      directions: "Zur Mühlegg-Talstation und mit der Standseilbahn hoch (ÖV-Ticket gilt); oben 5 Min. zu den Teichen.",
      stayMinutes: 25,
      why: "Jugendstil-Badehäuschen, Stadtpanorama, Bodensee-Blick – der schönste Feierabendort der Ostschweiz.",
      story:
        "Die künstlichen Weiher von 1610 versorgten einst die Bleichen und Mühlen der Textilstadt mit Wasser – heute sind sie Badeteiche mit Jugendstil-Kabinen und Wiesen voller Stadtflüchter. Von hier oben liegt St. Gallen im Tal wie gestapelt, dahinter glänzt bei klarer Sicht der Bodensee.",
      funFact: "Der «Mannenweier» war bis 1972 Männern vorbehalten – heute baden alle überall, FKK-Ecke inklusive.",
      insiderTip: "Abendlicht-Regel: Beste Stimmung ab 18 Uhr, wenn die Stadt unten golden wird – Getränk vorher unten einpacken, oben gibts nur einen kleinen Kiosk.",
      photoSpot: "Vom Weier-Damm über die Stadt – mit Badehäuschen im Vordergrund.",
      audioScript:
        "Die kleine rote Standseilbahn hat dich hochgezogen, fünf Minuten Fussweg – und jetzt das: drei Teiche über den Dächern, Jugendstil-Badehäuschen, Wiesen, und unten im Tal stapelt sich St. Gallen zwischen seinen Hügeln, dahinter, bei klarer Sicht, ein silberner Streifen Bodensee. Die Drei Weieren wurden 1610 angelegt, ganz unromantisch als Wasserspeicher für die Textilindustrie – die Bleichen und Mühlen unten brauchten Druck auf der Leitung. Heute speichern die Teiche etwas anderes: die Feierabende der halben Stadt. Im Sommer wird hier gebadet, gegrillt und bis in die Nacht diskutiert; der Mannenweier war übrigens bis 1972 strikt Männersache, heute schwimmt jede und jeder überall. Such dir einen Platz am Damm, lass die Beine baumeln und schau auf die Stadt: Kloster, Erker, roter Platz – alles da unten, alles heute erlaufen. Bücher, Barock und Badeteiche. St. Gallen kann mehr, als alle denken. Bis zum nächsten Trail!",
      nearby: [
        { name: "Milchhüsli Drei Weieren", type: "cafe", note: "Kleiner Kiosk am Weier – Glace und Kaffee mit Panorama.", address: "Drei Weieren, 9000 St. Gallen" },
      ],
    },
  ],
};
