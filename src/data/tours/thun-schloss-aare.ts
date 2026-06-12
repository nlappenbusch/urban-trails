import type { Tour } from "@/lib/types";

export const thunSchlossAare: Tour = {
  slug: "thun-schloss-aare",
  citySlug: "thun",
  category: "natur-escape",
  name: "Thun – Schloss, Surfer, Alpenblick",
  claim: "Hochtrottoirs, ein Zähringer-Schloss und Surfer mitten im Fluss – das Tor zum Berner Oberland.",
  teaser:
    "Durch die Obere Hauptgasse mit ihren begehbaren Trottoir-Dächern hinauf zum Schloss, hinunter zur Surferwelle an der Mühleschleuse und ans Seeufer mit Eiger-Mönch-Jungfrau-Panorama.",
  description:
    "Thun ist die Stadt, in der das Mittelalter aufs Wassersport-Mekka trifft: In der Oberen Hauptgasse läufst du auf den Dächern der Ladengeschäfte – die berühmten Hochtrottoirs gibt es nur hier. Darüber wacht das Zähringer-Schloss mit seinem Bilderbuch-Donjon, darunter rauscht die Aare so kraftvoll durch die Stadt, dass an der Mühleschleuse eine stehende Welle entsteht, auf der ganzjährig gesurft wird – mitten in der Altstadt. Das Finale gehört dem Seeufer: Eiger, Mönch und Jungfrau am Horizont, Schiffe im Vordergrund, Berner Oberland-Gefühl total. Gratis-Tour, weil Thun jeden Franken in Schönheit längst investiert hat.",
  moods: ["natur", "aussicht", "fotografie"],
  audience: "Oberland-Durchreisende, die endlich aussteigen; Familien; Fluss-Fans – Thun ist der meistunterschätzte Zwischenhalt der Schweiz.",
  vibe: "Alpenstadt mit Lässigkeit – mittelalterlich oben, sportlich unten.",
  bestTimeOfDay: "Nachmittag – Surfer aktiv, Alpenlicht am Abend.",
  bestSeason: "Ganzjährig; Surfer trotzen auch dem Winter (Neopren sei Dank).",
  difficulty: "leicht",
  durationMinutes: 135,
  distanceKm: 3.5,
  startPoint: "Bahnhof Thun",
  endPoint: "Schadaupark am See",
  publicTransport: {
    start: "Bahnhof Thun – ab Bern 18 Min., ab Zürich ~1 h 40",
    end: "Bus 1 ab «Schadau» oder 15 Min. Uferweg zum Bahnhof",
  },
  isPremium: false,
  gradient: ["#1f4a6b", "#9fc626"],
  seo: {
    metaTitle: "Thun zu Fuss: Hochtrottoirs, Schloss & Aare-Surfer mit Audioguide | Urban Trails",
    metaDescription:
      "Gratis-Tour durch Thun: Obere Hauptgasse mit Hochtrottoirs, Zähringer-Schloss, Surferwelle an der Mühleschleuse und Alpenpanorama am Thunersee. 6 Stops mit Audio-Stories.",
    keywords: ["Thun Sehenswürdigkeiten","Thun Altstadt Hochtrottoirs","Schloss Thun","Thun Surfer Welle","Thunersee Rundgang"],
  },
  faq: [
    { question: "Surfen die wirklich das ganze Jahr?", answer: "Ja – die Welle an der Mühleschleuse läuft, solange die Aare genug Wasser führt. Im Winter mit dickem Neopren; zuschauen kostet nichts und fasziniert immer." },
    { question: "Lohnt sich der Schlossturm?", answer: "Der Blick über Dächer, Aare und Alpen ist top; das Museum im Rittersaal nimmt einen kleinen Eintritt." },
    { question: "Warum ist die Tour gratis?", answer: "Jede Destination hat bei uns eine Gratis-Tour zum Reinschnuppern – in Thun ist es diese." },
  ],
  stops: [
    {
      id: "bahnhof-thun",
      name: "Bahnhof & Aarefeld",
      teaser: "Aussteigen, Berge sehen – Thun verschwendet keine Zeit.",
      coords: { lat: 46.7549, lng: 7.6298 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 5,
      why: "Schon am Bahnhofplatz zeigt sich, warum Thun «Tor zum Berner Oberland» heisst.",
      story:
        "Kaum aus dem Zug, grüssen über den Dächern die ersten Schneegipfel – Thun liegt exakt dort, wo das Mittelland endet und die Alpen beginnen. Die Stadt war immer Umschlagplatz: erst für Säumer und Schiffe, heute für Interlaken-Reisende, die hier viel zu selten aussteigen. Ihr Fehler, dein Gewinn.",
      funFact: "Thun hat mehr Sonnenstunden als die meisten Schweizer Städte – der Thunersee-Föhn räumt den Himmel regelmässig frei.",
      insiderTip: "Gleich beim Bahnhof legen die Kursschiffe ab – die Rückfahrt nach Bern lässt sich theoretisch per Schiff+Zug ab Interlaken verlängern.",
      photoSpot: "Bahnhofplatz Richtung Stockhorn-Kette.",
      audioScript:
        "Aussteigen, durchatmen, hochschauen: Da sind sie schon, die Berge. Thun verschwendet keine Zeit mit Vorgeplänkel – die Stadt liegt exakt an der Naht, wo das sanfte Mittelland endet und das Berner Oberland aufsteigt. Seit Jahrhunderten ist sie Umschlagplatz: Früher luden hier Säumer ihre Waren von Schiffen auf Maultiere Richtung Alpenpässe, heute sitzen Tausende täglich im Zug nach Interlaken und schauen nur aus dem Fenster. Du bist ausgestiegen – gute Entscheidung. Was die Durchfahrer verpassen: eine Altstadt mit einer baulichen Kuriosität, die es nirgendwo sonst gibt, ein Schloss wie aus dem Ritterbuch, und – das Verrückteste – Surfer. Echte Surfer, auf einer stehenden Flusswelle, mitten in der Stadt, das ganze Jahr. Los geht's, die Aare zeigt den Weg.",
    },
    {
      id: "obere-hauptgasse",
      name: "Obere Hauptgasse & Hochtrottoirs",
      teaser: "Einkaufen auf zwei Etagen: Du läufst auf den Dächern der Läden.",
      coords: { lat: 46.7587, lng: 7.628 },
      walkMinutesFromPrevious: 8,
      directions: "Über den Mühleplatz in die Obere Hauptgasse.",
      stayMinutes: 15,
      why: "Die Hochtrottoirs sind ein Schweizer Unikat – eine zweistöckige Einkaufsgasse aus dem Mittelalter.",
      story:
        "In der Oberen Hauptgasse liegen die Gehsteige auf Höhe des ersten Stocks: Du flanierst auf den Dächern der unteren Ladenzeile, Treppchen verbinden die Ebenen. Entstanden ist das Kuriosum im Mittelalter – die Keller wurden zur Gasse hin geöffnet und ihre Decken zum Trottoir. Zwei Ladenzeilen übereinander: mittelalterliche Verkaufsflächen-Optimierung.",
      funFact: "Die Häuser haben dadurch zwei Eingangsebenen mit zwei Hausnummern-Logiken – Päckli-Kuriere verzweifeln hier mit System.",
      insiderTip: "Einmal oben hin, unten zurück – die Gasse ist zweimal eine andere.",
      photoSpot: "Von einem Treppchen die doppelte Flucht entlang.",
      audioScript:
        "Schau dir diese Gasse genau an – irgendwas ist anders, oder? Richtig: Das Trottoir liegt im ersten Stock. Du kannst hier auf zwei Ebenen flanieren – unten an den Kellerläden vorbei, oder oben auf deren Dächern, wo sich die nächste Ladenzeile aufreiht. Diese Hochtrottoirs gibt es in dieser Form nur in Thun, und entstanden sind sie aus mittelalterlichem Geschäftssinn: Irgendwann öffneten die Händler ihre Gewölbekeller zur Gasse hin, und die Kellerdecken wurden kurzerhand zum erhöhten Gehweg erklärt. Doppelte Verkaufsfläche, gleiche Gasse – Flächenoptimierung, sechshundert Jahre vor dem Shoppingcenter. Mein Rat: Lauf die Gasse oben entlang und unten zurück, es ist zweimal eine völlig andere Strasse. Und wirf einen Blick auf die Treppchen, die die Ebenen verbinden – jedes ist anders, manche kaum schulterbreit. Am Ende der Gasse wartet dann der Aufstieg zum Wahrzeichen: vier Türmchen, tausend Jahre, bester Blick.",
    },
    {
      id: "schloss-thun",
      name: "Schloss Thun",
      teaser: "Der Bilderbuch-Donjon der Zähringer – seit 1190 ungeschlagen fotogen.",
      coords: { lat: 46.7599, lng: 7.6286 },
      walkMinutesFromPrevious: 6,
      directions: "Vom Gassenende die Schlossstiege hinauf.",
      stayMinutes: 20,
      why: "Einer der besterhaltenen Wohntürme des Mittelalters – mit Rittersaal und Panorama von den Ecktürmen.",
      story:
        "Um 1190 bauten die Herzöge von Zähringen diesen mächtigen Wohnturm – dieselbe Dynastie, die Bern und Freiburg gründete. Der Rittersaal im Innern ist einer der grössten erhaltenen des Mittelalters; von den vier Ecktürmchen reicht der Blick über Stadt, Aare-Schlaufen und die Gipfelkette vom Stockhorn bis zur Jungfrau-Region.",
      funFact: "Der Saal war einst Gerichtssaal – und das Schloss bis 2009 tatsächlich noch Sitz von Verwaltung und Gericht. 800 Jahre Amtsstube.",
      insiderTip: "Auch ohne Museums-Ticket lohnt der Schlosshof – und die Stiege aussen herum zur Stadtkirche hat den besten Gratis-Blick.",
      photoSpot: "Vom Kirchplateau: Donjon mit vier Türmchen über den Altstadtdächern.",
      audioScript:
        "Vier Ecktürmchen auf einem wuchtigen Würfel – das Schloss Thun sieht aus, als hätte ein Kind das perfekte Ritterschloss gezeichnet. Gebaut haben es um 1190 die Herzöge von Zähringen, die grossen Städtegründer des Mittelalters – Bern, Freiburg, Burgdorf gehen auf ihr Konto, und hier in Thun setzten sie sich diesen Donjon als Machtzeichen über die Aare. Drinnen wartet einer der grössten erhaltenen Rittersäle des Mittelalters, ein Raum wie eine steinerne Kathedrale des Weltlichen. Das Erstaunlichste aber: Dieses Schloss war keine Ruine und kein Museum, sondern bis ins Jahr 2009 ganz banal in Betrieb – Regierungsstatthalter, Gericht, Amtsstuben. Achthundert Jahre Verwaltung im Ritterturm; vermutlich die langlebigste Bürogemeinschaft der Schweiz. Steig auf jeden Fall zu den Ecktürmchen hoch oder nimm wenigstens das Kirchplateau nebenan mit: Unter dir die Dächer und die Aare, am Horizont die weisse Wand des Oberlands. Und jetzt – runter zum Wasser. Es wird sportlich.",
    },
    {
      id: "muehleschleuse-surfer",
      name: "Mühleschleuse – die Surferwelle",
      teaser: "Surfen im Alpenfluss, 365 Tage im Jahr – mitten in der Altstadt.",
      coords: { lat: 46.7585, lng: 7.6262 },
      walkMinutesFromPrevious: 8,
      directions: "Zurück zur Aare und zum Mühleplatz – die Welle ist nicht zu überhören.",
      stayMinutes: 15,
      why: "Eine der bekanntesten Flusswellen Europas – Gratiskino mit Gischt-Garantie.",
      story:
        "Wenn die Schleusentore richtig stehen, wirft die Aare an der Mühleschleuse eine perfekte stehende Welle – und Thun hat eine eingeschworene Riversurf-Szene, die sie bei jedem Wetter reitet, im Winter im dicken Neopren. Zuschauer lehnen am Geländer, Surfer warten in der Reihe auf dem Steg: Es gelten ungeschriebene Regeln wie im Line-up von Hawaii, nur mit Bergpanorama.",
      funFact: "Die Thuner Welle gilt als eine der konstantesten Flusswellen Europas – Surfer reisen aus München (der Eisbach-Konkurrenz!) zum Vergleichstest an.",
      insiderTip: "Bestes Zuschauer-Eck: das Geländer beim Mühleplatz – Gischt-Spritzer inklusive, Respektabstand empfohlen.",
      photoSpot: "Surfer in der Welle mit Altstadt im Hintergrund – Sport trifft Mittelalter.",
      audioScript:
        "Hörst du das Rauschen? Das ist kein Wehr – das ist ein Surfspot. An der Mühleschleuse drückt die Aare mit solcher Kraft durch die Tore, dass eine stehende Welle entsteht: Das Wasser rast, die Welle bleibt, und darauf reiten sie. Mitten in der Altstadt, dreissig Meter von mittelalterlichen Fassaden, surfen die Thuner ihre Hauswelle – und zwar dreihundertfünfundsechzig Tage im Jahr. Im Januar stehen sie mit fünf Millimeter Neopren im Schnee am Steg und warten auf ihren Turn. Die Szene hat ihre eigenen Gesetze, wie jedes Line-up der Welt: Wer am Steg wartet, ist dran, niemand drängelt, und gestürzt wird elegant flussabwärts. Lehn dich ans Geländer und schau zu – es ist hypnotisch: dieselbe Welle, immer neue Choreografie, dahinter Schloss und Schneeberge. München hat seinen Eisbach, Thun hat das hier – nur mit besserer Kulisse, sagen die Thuner. Sie haben nicht unrecht. Jetzt dem Fluss folgen, dem See entgegen – das Panorama-Finale wartet.",
    },
    {
      id: "aarequai",
      name: "Aarequai",
      teaser: "Der Spazier-Klassiker: türkises Wasser, weisse Gipfel.",
      coords: { lat: 46.7531, lng: 7.6334 },
      walkMinutesFromPrevious: 10,
      directions: "Der Aare flussaufwärts Richtung See folgen.",
      stayMinutes: 10,
      why: "Der Quai zwischen Stadt und See ist Thuns Flaniermeile – mit wachsendem Bergpanorama bei jedem Schritt.",
      story:
        "Je näher der See, desto breiter der Himmel: Der Aarequai führt unter Platanen am türkisen Wasser entlang, vorbei an Bootshäusern und Badeplätzen, bis sich der Thunersee öffnet – und mit ihm die Parade von Niesen, Stockhorn und den Eistitanen des Oberlands.",
      funFact: "Der pyramidenförmige Niesen gegenüber hat die längste Treppe der Welt (11'674 Stufen, Dienstweg der Bahn) – einmal jährlich gibts ein Treppenrennen.",
      insiderTip: "Die Badeplattformen am Quai sind öffentlich – mutige Zehen testen die Aare (erfrischend ist geschmeichelt).",
      photoSpot: "Quai-Geländer mit Niesen-Pyramide überm See.",
      audioScript:
        "Jetzt kommt der Teil zum Runterfahren: der Aarequai, Thuns Flaniermeile zwischen Stadt und See. Links zieht die Aare in diesem unverschämten Türkis, das aussieht wie nachbearbeitet, aber echt ist – Gletschermehl aus dem Oberland bricht das Licht. Rechts Platanen, Bootshäuser, Bänke mit Aussicht-Garantie. Und mit jedem Schritt seewärts wächst das Panorama: Zuerst schiebt sich der Niesen ins Bild, diese perfekte Pyramide – an seiner Bahntrasse läuft übrigens die längste Treppe der Welt hinauf, elftausendsechshundertvierundsiebzig Stufen, einmal im Jahr rennen Wahnsinnige sie hoch. Dann das Stockhorn, und schliesslich, wenn der See sich ganz öffnet, die weisse Dreifaltigkeit: Eiger, Mönch und Jungfrau. Geh langsam. Dieser Kilometer ist kein Transferweg, er ist das halbe Ziel.",
    },
    {
      id: "schadaupark",
      name: "Schadaupark & Seepanorama",
      teaser: "Das Finale: Märchenschloss, Seewiese und die ganz grosse Bergwand.",
      coords: { lat: 46.7488, lng: 7.6353 },
      walkMinutesFromPrevious: 8,
      directions: "Dem Uferweg bis zum Park mit dem Schlösschen folgen.",
      stayMinutes: 25,
      why: "Schloss Schadau mit Seewiese ist Thuns Postkarten-Finale – Picknickwiese mit 4000er-Blick.",
      story:
        "Das neugotische Schloss Schadau (1854) liess sich ein Bankier als Sommersitz bauen – Loire-Romantik am Thunersee. Heute gehört der Park allen: Riesige Wiesen fallen zum Wasser ab, Segelboote kreuzen, und am Horizont steht die Berner-Oberland-Kette wie gemalt. In der Schlosskuppel versteckt sich zudem das älteste erhaltene Rundpanorama der Welt (Wocher-Panorama, 1814).",
      funFact: "Das Wocher-Panorama zeigt Thun um 1810 in 360° – die Stadt besass also schon ein «Street View», bevor es Fotografie gab.",
      insiderTip: "Picknick auf der Seewiese schlägt jede Restaurant-Terrasse – Sonnenuntergangsfarbe an der Eiger-Nordwand als Dessert.",
      photoSpot: "Schloss Schadau mit See und Blüemlisalp-Kette – DAS Thun-Bild.",
      audioScript:
        "Und zum Schluss wird es fürstlich. Schloss Schadau sieht aus, als hätte es jemand von der Loire hierher geflogen – tatsächlich liess es sich 1854 ein Berner Bankier als Sommersitz bauen, Neugotik mit Seeanstoss, Bescheidenheit war nicht das Briefing. Heute gehört der Park uns allen, und er ist das perfekte Finale: Die Wiese fällt sanft zum Wasser, davor kreuzen Segelboote, und dahinter steht sie in voller Breite – die Wand des Berner Oberlands, Eiger, Mönch, Jungfrau, Blüemlisalp. Ein Geheimnis trägt das Schloss noch in seiner Kuppel: das Wocher-Panorama, das älteste erhaltene Rundgemälde der Welt. Es zeigt Thun um 1810, in dreihundertsechzig Grad – die Stadt hatte sozusagen Street View, bevor die Fotografie erfunden war. Aber das kannst du auch ein andermal anschauen. Jetzt: Wiese, Sitzplatz, Bergblick. Du bist heute durchs Mittelalter auf zwei Etagen gelaufen, hast Surfern im Alpenfluss zugeschaut und stehst jetzt vor einer der schönsten Aussichten des Landes. Thun, der meistunterschätzte Halt der Schweiz – jetzt nicht mehr von dir. Bis zum nächsten Trail!",
      nearby: [
        { name: "Schloss Schadau Restaurant", type: "restaurant", note: "Gehoben essen im Schlösschen – oder schlicht: Wiese + Picknick.", address: "Seestrasse 45, 3600 Thun" },
      ],
    },
  ],
};
