import type { Tour } from "@/lib/types";

export const zuerichFoodies: Tour = {
  slug: "zuerich-foodies",
  citySlug: "zuerich",
  category: "food-discovery",
  name: "Zürich zum Anbeissen",
  claim: "Essen ist die beste Stadtführung – von der Luxemburgerli-Legende bis zur Markthalle, mit Kost-Auftrag pro Stop.",
  teaser:
    "Sechs Stationen Zürcher Esskultur: Sprüngli am Paradeplatz, der Kolonialwarenladen von 1864, heisse Schokolade im Märchencafé, Mittagsteller unterm Bahnbogen – und bei jedem Stop etwas zum Probieren.",
  description:
    "Diese Tour erzählt Zürich durch den Magen. Du startest am Paradeplatz, wo seit 1859 die Luxemburgerli-Dynastie residiert, kaufst im vielleicht schönsten Lebensmittelladen Europas ein (Schwarzenbach, seit 1864, Kaffeerösterei inklusive), trinkst die berühmteste heisse Schokolade der Stadt im Plüsch des Café Schober, und isst dich durch die Markthalle im Viadukt bis ans Industrieufer von Frau Gerolds Garten. Jeder Stop kommt mit einem konkreten Kost-Auftrag – klein genug fürs Budget, gross genug, dass du am Ende sagen kannst: Ich habe Zürich probiert. Hungrig starten ist Pflicht.",
  moods: ["essen", "kultur", "menschen"],
  audience: "Foodies, Mitbringsel-Jäger, Date-Planer – und alle, die finden, dass Sightseeing durch den Magen geht.",
  vibe: "Genüsslich, duftend, gut gelaunt – die Tour mit eingebautem Picknick.",
  bestTimeOfDay: "Vormittag bis Nachmittag (Läden offen!) – Finale ab 17 Uhr im Garten.",
  bestSeason: "Ganzjährig; im Dezember mit Glühwein-Upgrade an jeder Ecke.",
  difficulty: "leicht",
  durationMinutes: 170,
  distanceKm: 4.3,
  startPoint: "Paradeplatz",
  endPoint: "Frau Gerolds Garten",
  publicTransport: {
    start: "Tram 2/6/7/8/9/11/13 «Paradeplatz»",
    end: "S-Bahn/Tram «Hardbrücke», 3 Min. zu Fuss",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#7a4a1f", "#ff4d00"],
  seo: {
    metaTitle: "Zürich Food-Tour: Sprüngli, Schwarzenbach & Markthalle mit Audioguide | Urban Trails",
    metaDescription:
      "Die kulinarische Walking-Tour durch Zürich: Luxemburgerli am Paradeplatz, Kolonialwaren seit 1864, Café Schober, Markthalle im Viadukt und Frau Gerolds Garten. 6 Stops mit Kost-Aufträgen.",
    keywords: ["Zürich Food Tour","Zürich kulinarisch entdecken","Sprüngli Luxemburgerli","Schwarzenbach Zürich","Markthalle Zürich Essen"],
  },
  faq: [
    { question: "Wie viel Geld brauche ich für die Kost-Aufträge?", answer: "Plane 25–40 Franken ein – die Aufträge sind bewusst kleine Portionen (ein Luxemburgerli kostet wenig, die Markthalle skaliert nach Hunger)." },
    { question: "Funktioniert die Tour sonntags?", answer: "Eingeschränkt – Schwarzenbach und einige Läden sind zu. Bester Tag: Dienstag bis Samstag, hungrig ab 10 Uhr." },
    { question: "Vegetarisch/vegan machbar?", answer: "Problemlos – alle Stationen haben fleischlose Optionen, die Markthalle sogar überdurchschnittlich viele." },
    { question: "Ist das eine Schlemmer- oder eine Stadt-Tour?", answer: "Beides: Jede Station hat ihre Geschichte – du lernst nebenbei mehr Stadtgeschichte als auf mancher Klassiker-Tour, nur eben mit vollem Mund." },
  ],
  stops: [
    {
      id: "paradeplatz-spruengli",
      name: "Paradeplatz & Sprüngli",
      teaser: "Banken links, Pralinen rechts – und die Erfindung des Luxemburgerli.",
      coords: { lat: 47.3699, lng: 8.5394 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 20,
      why: "Der berühmteste Platz der Schweizer Finanzwelt – aber die wahre Institution ist die Confiserie an der Ecke.",
      story:
        "Seit 1859 steht Sprüngli am Paradeplatz – älter als die meisten Banken ringsum. Hausheiligtum: das Luxemburgerli, ein federleichtes Mini-Macaron, das ein Konditor-Lehrling in den 1950ern aus Luxemburg mitbrachte. Im Café im ersten Stock treffen sich seit Generationen Zürcher Damen, Banker und alle, die wissen, dass Macht süss schmeckt.",
      funFact: "«Treffen wir uns beim Sprüngli» gilt als der klassischste Zürcher Verabredungssatz – der Platz davor ist inoffizieller Treffpunkt der Stadt.",
      insiderTip: "🍴 KOST-AUFTRAG 1: Zwei Luxemburgerli an der Theke – ein Klassiker (Schoko/Vanille) plus die aktuelle Saison-Sorte. Sofort essen, sie sind nach Stunden nicht mehr dieselben.",
      photoSpot: "Sprüngli-Schriftzug mit Tram im Vordergrund.",
      audioScript:
        "Willkommen am Paradeplatz – dem Platz, unter dem angeblich das Gold der Schweiz lagert. Links und rechts residieren die Grossbanken, aber die älteste Macht am Platz verkauft keine Aktien, sondern Pralinen: Sprüngli, seit 1859, älter als die meisten Geldhäuser ringsum. Und ihr berühmtestes Produkt ist eine Geschichte für sich: In den Fünfzigern brachte ein junger Konditor aus Luxemburg ein Rezept mit – winzige, federleichte Doppel-Macarons mit Cremefüllung. Man nannte sie nach seiner Herkunft: Luxemburgerli. Heute sind sie das essbare Wahrzeichen Zürichs, und es gibt eine eiserne Regel: frisch essen, am selben Tag, sonst verlieren sie ihre Seele. Dein erster Kost-Auftrag wartet also an der Theke – ein Klassiker, eine Saison-Sorte, und beide gehören direkt in den Mund, nicht in die Tasche. Beobachte dabei kurz den Platz: «Treffen wir uns beim Sprüngli» ist seit Generationen DER Verabredungssatz dieser Stadt. Du stehst am Rendezvous-Punkt von Zürich. Gut gestärkt geht es jetzt in die Altstadt – zum schönsten Lebensmittelladen, den du je gesehen hast.",
      nearby: [
        { name: "Confiserie Sprüngli", type: "cafe", note: "Stammhaus mit Café im 1. Stock – Frühstücks-Institution.", address: "Bahnhofstrasse 21, 8001 Zürich" },
      ],
    },
    {
      id: "schwarzenbach",
      name: "Schwarzenbach Kolonialwaren",
      teaser: "Seit 1864: Datteln, Tee und Nüsse in Holzschubladen – ein begehbares Gesamtkunstwerk.",
      coords: { lat: 47.3719, lng: 8.5446 },
      walkMinutesFromPrevious: 12,
      directions: "Über Münsterhof und Münsterbrücke ins Niederdorf, in die Münstergasse.",
      stayMinutes: 20,
      why: "Einer der letzten echten Kolonialwarenläden Europas – sechste Generation, Original-Interieur, eigene Rösterei.",
      isHiddenGem: true,
      story:
        "Seit 1864 verkauft die Familie Schwarzenbach an der Münstergasse Trockenfrüchte, Gewürze, Tee und Kaffee – in einem Laden, der seit über 100 Jahren praktisch unverändert ist: dunkle Holzregale, Messingwaagen, Papiertüten. Gegenüber röstet die hauseigene Kaffeerösterei – wenn der Wind richtig steht, riecht die halbe Gasse danach.",
      funFact: "Im Sortiment liegen über 400 Trockenfrüchte-, Nuss- und Gewürzsorten – vieles wird noch von Hand abgewogen wie 1864.",
      insiderTip: "🍴 KOST-AUFTRAG 2: 100 g von etwas, das du noch NIE probiert hast (geröstete Saubohnen? Bergamotte-Schale?) – plus einen Kaffee aus der Rösterei gegenüber als Wegbegleiter.",
      photoSpot: "Ladenfront mit historischer Beschriftung.",
      audioScript:
        "Bleib kurz stehen, bevor du eintrittst, und atme durch die Nase. Riechst du das? Kaffee, Gewürze, getrocknete Früchte – das ist der Duft von 1864. Der Laden der Familie Schwarzenbach ist einer der letzten echten Kolonialwarenläden Europas, geführt in sechster Generation, und innen hat sich seit über hundert Jahren fast nichts verändert: dunkle Holzregale bis zur Decke, Messingwaagen, Schubladen voller Schätze, Papiertüten statt Plastik. Über vierhundert Sorten Trockenfrüchte, Nüsse, Tees und Gewürze lagern hier – vieles wird von Hand abgewogen, wie eh und je. Und gegenüber, im selben Familienbesitz, rattert die hauseigene Kaffeerösterei. Dein Auftrag hier ist Entdeckerpflicht: Kauf hundert Gramm von etwas, das du noch nie im Leben probiert hast. Lass dich beraten – das Personal kennt jede Schublade und liebt Neugierige. Dazu einen frisch gerösteten Kaffee auf die Hand, und du flanierst durchs Niederdorf wie die Zürcher seit hundertsechzig Jahren: mit einer Papiertüte voller Weltreise. Nächster Halt: die berühmteste heisse Schokolade der Stadt.",
      nearby: [
        { name: "Schwarzenbach Kolonialwaren & Rösterei", type: "shop", note: "Laden + Kaffeebar gegenüber – Mitbringsel-Hauptquartier.", address: "Münstergasse 19, 8001 Zürich" },
      ],
    },
    {
      id: "cafe-schober",
      name: "Café Schober",
      teaser: "Plüsch, Kronleuchter und eine heisse Schokolade mit Suchtpotenzial.",
      coords: { lat: 47.3722, lng: 8.5443 },
      walkMinutesFromPrevious: 2,
      directions: "Um die Ecke in die Napfgasse.",
      stayMinutes: 25,
      why: "Das Märchencafé des Niederdorfs – seit 1875 Konditorei, heute barock-verspieltes Gesamterlebnis.",
      story:
        "In der Napfgasse residiert seit 1875 eine Konditorei; heute führt das Haus als Café Schober (Conditorei Péclard) die Tradition mit Samt, Stuck, Blumenpracht und Kronleuchtern weiter – ein Interieur zwischen Belle Époque und Wes Anderson. Die heisse Schokolade wird mit echter geschmolzener Schokolade angerührt und gilt stadtbekannt als die beste weit und breit.",
      funFact: "Das Haus war im 19. Jh. eine «Conditorei mit Schokoladenfabrikation» – die Schoggi-Tradition an dieser Adresse ist also älter als die meisten Schweizer Schokoladenmarken.",
      insiderTip: "🍴 KOST-AUFTRAG 3: Die klassische heisse Schokolade (dunkel) – und teile dir dazu ein Stück Hausgebäck. Vormittags unter der Woche bekommst du am ehesten einen Platz im Plüsch-Séparée.",
      photoSpot: "Treppenaufgang mit Blumendeko – das meistfotografierte Café-Interieur der Stadt.",
      audioScript:
        "Zwei Schritte um die Ecke, und du stehst vor einem Märchen. Das Café Schober in der Napfgasse ist seit 1875 dem Süssen verschrieben, und sein Interieur ist ein Ereignis: Samtsessel, Stuckdecken, Kronleuchter, üppige Blumenbouquets – als hätte die Belle Époque beschlossen, einfach nie auszuziehen. Aber die wahre Berühmtheit dieses Hauses ist flüssig: die heisse Schokolade. Hier wird nicht Pulver in Milch gerührt, hier schmilzt echte Schokolade ins Kännchen – dickflüssig, dunkel, kompromisslos. Generationen von Zürchern haben an diesen Tischen ihre Wintersonntage verbracht, und der Ruf der Schoggi hat längst die Stadtgrenzen überschritten. Dein Auftrag ist entsprechend einfach und schwer zugleich: die klassische dunkle Trinkschokolade, dazu ein geteiltes Stück Hausgebäck – geteilt, weil die Tour noch zwei Ess-Stationen hat und du Strategie brauchst. Nimm dir hier wirklich Zeit. Manche Orte besichtigt man, in diesem sitzt man. Danach: Tapetenwechsel total – vom Plüsch unter die Bahnbögen.",
      nearby: [
        { name: "Café Schober / Conditorei Péclard", type: "cafe", note: "Das Märchencafé – heisse Schokolade als Hausreligion.", address: "Napfgasse 4, 8001 Zürich" },
      ],
    },
    {
      id: "markthalle-foodtour",
      name: "Markthalle im Viadukt",
      teaser: "Zürichs Speisekammer unterm Bahnbogen – regional, ehrlich, zum Durchprobieren.",
      coords: { lat: 47.3857, lng: 8.5247 },
      walkMinutesFromPrevious: 25,
      directions: "Mit Tram 4/13 ab «Rudolf-Brun-Brücke» bis «Dammweg» oder 25 Min. zu Fuss der Limmat entlang – der Verdauungsspaziergang gehört zum Konzept.",
      stayMinutes: 35,
      why: "Unter einem Bahnviadukt von 1894 versammelt sich die beste Regionalküche der Stadt – Mittagsteller, Käsetheke, Bäckerei, Bar.",
      story:
        "Die Markthalle im Viadukt ist seit 2010 Zürichs kulinarisches Klassenzimmer: Produzenten aus der Region verkaufen unter den Steinbögen Käse, Brot, Fisch, Gemüse und Wein; mittendrin Stände mit Mittagstellern und lange Gemeinschaftstische. Über allem donnern die Züge – die Gewölbe schlucken den Lärm, der Charme bleibt.",
      funFact: "Die Halle hat eine eigene Hausbäckerei, deren Sauerteig älter ist als so mancher Stand – das Brot ist der heimliche Star des Sortiments.",
      insiderTip: "🍴 KOST-AUFTRAG 4 (Hauptgang!): Ein Mittags- oder Degustationsteller nach Wahl am Gemeinschaftstisch – plus ein Stück Alpkäse von der Theke für später. Beim Käser nach der «Empfehlung der Woche» fragen.",
      photoSpot: "Längsachse der Halle mit Ständen unter den Bögen.",
      audioScript:
        "Und jetzt der Hauptgang. Die Markthalle im Viadukt ist Zürichs Speisekammer: Unter den Steinbögen eines Eisenbahnviadukts von 1894 verkaufen Bauern, Käser, Bäcker und Winzer aus der Region – keine Ketten, keine Importware ohne Gesicht, sondern Leute, die dir erzählen können, wie ihr Produkt entstanden ist. Mittendrin: Stände mit Mittagstellern und lange Holztische, an denen sich das Quartier zum Essen trifft, während über den Köpfen die Züge donnern – die meterdicken Gewölbe machen aus dem Lärm ein fernes Grummeln. Dein Hauptgang-Auftrag: Such dir einen Teller aus – die Auswahl wechselt täglich – und setz dich an den Gemeinschaftstisch, nicht an den Rand. Danach Pflichtbesuch an der Käsetheke: Frag nach der Empfehlung der Woche und nimm ein Stück Alpkäse mit – das ist deine Wegzehrung fürs Finale. Und falls du dem Duft der Hausbäckerei nicht widerstehen kannst: Niemand verlangt das von dir. Der Sauerteig hier hat mehr Dienstjahre als mancher Bäcker. Gut gesättigt wartet jetzt noch ein Garten – mit Feierabendbier zwischen Hochbeeten.",
      nearby: [
        { name: "Markthalle im Viadukt", type: "restaurant", note: "Stände, Theken, Gemeinschaftstische – das Herz der Tour.", address: "Limmatstrasse 231, 8005 Zürich" },
      ],
    },
    {
      id: "gerold-garten-finale",
      name: "Frau Gerolds Garten – Apéro-Finale",
      teaser: "Garten-to-Table zwischen Containern: Das Dessert ist ein Feierabend.",
      coords: { lat: 47.3856, lng: 8.5211 },
      walkMinutesFromPrevious: 6,
      directions: "Dem Viadukt entlang Richtung Geroldstrasse – der bunte Garten liegt am Ende.",
      stayMinutes: 35,
      why: "Der charmanteste Garten der Stadt: Hochbeete liefern die Küche, Container die Kulisse, der Prime Tower die Skyline.",
      story:
        "Frau Gerolds Garten begann 2012 als Zwischennutzung und wurde Institution: Zwischen bemalten Containern wachsen Tomaten und Kräuter, die direkt in der Gartenküche landen; im Sommer ist Open-Air-Beiz, im Winter Fondue-Hütte. Hier endet die Tour, wo Zürichs Esskultur am entspanntesten ist – mit Blick auf Gleise, Kräne und den Abendhimmel.",
      funFact: "Was in den Hochbeeten wächst, steht tags darauf auf der Karte – kürzer ist keine Lieferkette der Stadt.",
      insiderTip: "🍴 KOST-AUFTRAG 5 (Finale): Ein Glas Schweizer Wein oder ein lokales Bier – dazu packst du deinen Schwarzenbach-Fund und den Alpkäse aus. Selbst zusammengestelltes Zürich-Dessert, beste Terrasse der Stadt.",
      photoSpot: "Von der oberen Container-Ebene über Garten und Prime Tower – goldene Stunde.",
      audioScript:
        "Das Finale ist ein Garten – und deine Tasche ist das Dessert. Frau Gerolds Garten, gestartet als Provisorium zwischen Bahngleisen, ist heute Zürichs liebster Open-Air-Esstisch: Zwischen knallbunten Containern wachsen Tomaten, Kräuter und Salate in Hochbeeten, und was dort reift, steht am nächsten Tag in der Gartenküche auf der Karte – eine kürzere Lieferkette gibt es nicht. Im Sommer sitzt du unter Lichterketten, im Winter dampft das Fondue in der Hütte. Dein letzter Auftrag bringt alles zusammen: Hol dir ein Glas Schweizer Wein oder ein lokales Bier, such dir einen Platz mit Blick auf den Prime Tower – und dann pack aus, was du unterwegs gesammelt hast. Die Entdeckung von Schwarzenbach. Den Alpkäse aus der Markthalle. Vielleicht ist noch ein Luxemburgerli übrig – Respekt, falls ja. Das ist dein selbst zusammengestelltes Zürich-Degustationsmenü, fünf Stationen, hundertsechzig Jahre Esskultur, eine Stadt zum Anbeissen. En Guete – und bis zum nächsten Trail!",
      nearby: [
        { name: "Frau Gerolds Garten", type: "bar", note: "Sommerbeiz & Wintergrill – das Apéro-Finale.", address: "Geroldstrasse 23, 8005 Zürich" },
      ],
    },
  ],
};
