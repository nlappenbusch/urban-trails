import type { Tour } from "@/lib/types";

export const bernAltstadt: Tour = {
  slug: "bern-altstadt",
  citySlug: "bern",
  category: "story-mode",
  name: "Bern – Lauben, Einstein, Bären",
  claim: "Sechs Kilometer Laubengänge, eine Uhr, die die Physik veränderte, und Bären mit Flussblick – die gemütlichste Hauptstadt der Welt.",
  teaser:
    "Vom Zytglogge über Einsteins Wohnung und den höchsten Kirchturm der Schweiz bis zu den Bären an der Aare – UNESCO-Welterbe in einem Nachmittag.",
  description:
    "Bern ist die einzige Hauptstadt, in der man das Regierungsviertel mit Badehose durchqueren kann. Diese Tour führt durch die UNESCO-Altstadt mit ihren sechs Kilometern Lauben: zum Zytglogge, dessen Astro-Uhr Einstein täglich sah, als er um die Ecke die Relativitätstheorie erfand – seine Wohnung an der Kramgasse besuchst du gleich danach. Weiter zum Münster mit dem höchsten Kirchturm des Landes, durch die Gerechtigkeitsgasse hinunter zur Aare, zu den Bären im Park und hinauf zum Rosengarten, wo dir die ganze Altstadt im Abendlicht zu Füssen liegt.",
  moods: ["kultur", "aussicht", "ruhe"],
  audience: "Hauptstadt-Neulinge, Geschichts- und Physik-Fans, Geniesser – Bern belohnt alle, die langsam gehen.",
  vibe: "Sandstein, Brunnen, Gelassenheit – eine Stadt im Spazier-Tempo.",
  bestTimeOfDay: "Nachmittag bis Abend – das Finale im Rosengarten fällt ins goldene Licht.",
  bestSeason: "Ganzjährig; im Sommer mit Aare-Schwumm als Bonus, im Juni blüht der Rosengarten.",
  difficulty: "leicht",
  durationMinutes: 165,
  distanceKm: 4.0,
  startPoint: "Bahnhof Bern / Heiliggeistkirche",
  endPoint: "Rosengarten",
  publicTransport: {
    start: "Bahnhof Bern – ab Zürich ~1 h, ab Basel ~1 h",
    end: "Bus 10 «Rosengarten» zurück zum Bahnhof (10 Min.)",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#8a1f1f", "#ffc940"],
  seo: {
    metaTitle: "Bern zu Fuss: Zytglogge, Einsteinhaus, Münster & Bärenpark mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Tour durch die Berner Altstadt (UNESCO): 7 Stops vom Zytglogge über das Einsteinhaus und Münster bis Bärenpark und Rosengarten. Audio-Stories, Karte, Geheimtipps.",
    keywords: ["Bern Sehenswürdigkeiten zu Fuss","Bern Altstadt Rundgang","Zytglogge Bern","Einsteinhaus Bern","Bern Audioguide"],
  },
  faq: [
    { question: "Wie lange dauert die Tour?", answer: "Knapp 3 Stunden mit Pausen; reine Gehzeit rund eine Stunde. Mit Münsterturm-Aufstieg und Rosengarten-Apéro: ein perfekter halber Tag." },
    { question: "Sind die Bären immer zu sehen?", answer: "Meistens – der Bärenpark an der Aare ist ihr Zuhause, frei zugänglich und gratis. Im Hochwinter halten sie zeitweise Winterruhe." },
    { question: "Lohnt sich der Münsterturm?", answer: "312 Stufen, kleiner Eintritt, grosser Lohn: der höchste Kirchturm der Schweiz mit Alpensicht bei Föhn." },
    { question: "Was ist mit Aare-Schwimmen?", answer: "Im Sommer Pflichtprogramm: Im Marzili lassen sich die Berner von der Aare durch die Stadt treiben. Nur für geübte Schwimmer – die Strömung ist kräftig." },
  ],
  stops: [
    {
      id: "bahnhof-heiliggeistkirche",
      name: "Bahnhofplatz & Heiliggeistkirche",
      teaser: "Start unter Lauben: Ab hier läufst du kilometerweit im Trockenen.",
      coords: { lat: 46.948, lng: 7.4404 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 5,
      why: "Der Einstieg in die grösste gedeckte Einkaufspromenade Europas – die Berner Lauben.",
      story:
        "Direkt am Bahnhof steht die barocke Heiliggeistkirche – und dahinter beginnt das Berner Markenzeichen: sechs Kilometer Laubengänge, im 15. Jahrhundert entstanden, als die Häuser nach dem grossen Stadtbrand von 1405 in Stein wieder aufgebaut wurden. Bern ist die Stadt, in der Regen keine Ausrede ist.",
      funFact: "Unter den Lauben liegen die «Kellergewölbe»: ehemalige Warenkeller, heute Bars, Theater und Läden unter dem Trottoir.",
      insiderTip: "Achte auf die schrägen Kellerklappen im Boden – dahinter verbergen sich einige der coolsten Lokale der Stadt.",
      photoSpot: "Spitalgasse-Laubenflucht – die Perspektive zieht sich endlos.",
      audioScript:
        "Willkommen in der gemütlichsten Hauptstadt der Welt – und das ist messbar. Bern hat sechs Kilometer Laubengänge, du kannst ab hier quer durch die halbe Stadt laufen, ohne je nass zu werden. Entstanden sind die Lauben nach der Katastrophe von 1405, als ein Feuer die hölzerne Stadt in Schutt legte. Bern baute neu, in grünlichem Sandstein, und legte die Erdgeschosse zurück – so entstanden diese endlosen Arkaden, die grösste gedeckte Flaniermeile Europas. Schau beim Laufen auf den Boden: Diese schrägen Holz- und Metallklappen im Trottoir führen in die alten Warenkeller – heute verstecken sich darin Weinbars, Kellertheater und Boutiquen. Bern spielt sich auf drei Ebenen ab: oben Wohnungen, mittendrin Lauben, unten Keller. Wir tauchen jetzt ein in die Hauptachse der Altstadt – und in vierhundert Metern wartet die berühmteste Uhr der Schweiz. Sie hat einem gewissen Albert beim Denken geholfen.",
    },
    {
      id: "zytglogge",
      name: "Zytglogge",
      teaser: "Die Uhr, auf die Einstein schaute, als er die Zeit neu erfand.",
      coords: { lat: 46.9479, lng: 7.4477 },
      walkMinutesFromPrevious: 8,
      directions: "Durch Spital- und Marktgasse geradeaus – der Turm steht quer in der Gasse.",
      stayMinutes: 15,
      why: "Astronomische Uhr von 1530 mit Figurenspiel – und ein Hauptdarsteller der Relativitätstheorie.",
      story:
        "Der Zytglogge war Stadttor, Gefängnis und ist seit 1530 Bühne einer astronomischen Wunderuhr: Vier Minuten vor jeder vollen Stunde tanzen Narr, Bären und Chronos. Einstein wohnte 200 Meter entfernt und fuhr täglich an dieser Uhr vorbei zum Patentamt. Sein berühmtes Gedankenexperiment: Was sähe ich, wenn mein Tram mit Lichtgeschwindigkeit von dieser Uhr wegführe? Die Antwort wurde 1905 die Spezielle Relativitätstheorie.",
      funFact: "Das Figurenspiel beginnt 4 Minuten VOR der vollen Stunde – wer pünktlich kommt, hat es verpasst.",
      insiderTip: "Stell dich schräg unter die Astrolabium-Scheibe: Sie zeigt nicht nur Zeit, sondern Sternzeichen, Mondphase und Sonnenstand – eine Renaissance-Smartwatch.",
      photoSpot: "Aus der Kramgasse Richtung Turm – mit Lauben als Rahmen.",
      audioScript:
        "Vier Minuten vor jeder vollen Stunde passiert hier ein kleines Welttheater: Ein goldener Hahn kräht, Bären ziehen im Kreis, ein Narr läutet seine Glocken, und Chronos, der Gott der Zeit, dreht sein Stundenglas. Seit 1530 läuft dieses Programm, mechanisch, ohne Strom, fast ohne Pause. Aber die beste Geschichte des Zytglogge ist jünger. Um 1905 fuhr ein junger Patentamts-Angestellter täglich mit dem Tram an dieser Uhr vorbei: Albert Einstein, wohnhaft zweihundert Meter von hier. Und eines Tages stellte er sich eine Frage, die klingt wie ein Kinderrätsel: Was würde ich sehen, wenn mein Tram mit Lichtgeschwindigkeit von dieser Uhr wegrasen würde? Seine Antwort: Die Uhr schiene für mich stillzustehen – meine Taschenuhr aber liefe weiter. Zeit ist relativ. Aus dem Tramfenster-Gedanken vor diesem Turm wurde die Spezielle Relativitätstheorie, das Wunderjahr 1905, ein neues Universum. Merk dir den Moment: Du stehst vor der Uhr, an der die Zeit, wie wir sie kannten, aufgehört hat zu existieren. Einsteins Wohnung schauen wir uns jetzt an – sie ist zwei Minuten entfernt.",
    },
    {
      id: "einsteinhaus",
      name: "Einsteinhaus, Kramgasse 49",
      teaser: "Die Wohnung, in der 1905 das Universum neu geschrieben wurde.",
      coords: { lat: 46.9478, lng: 7.4513 },
      walkMinutesFromPrevious: 3,
      directions: "Die Kramgasse hinunter – Hausnummer 49, rechte Seite.",
      stayMinutes: 15,
      why: "Im zweiten Stock dieses Altstadthauses entstand das «Wunderjahr» – die Wohnung ist im Originalzustand besuchbar.",
      story:
        "Von 1903 bis 1905 wohnte Einstein mit Mileva und Söhnchen Hans Albert in dieser Drei-Zimmer-Wohnung. Tagsüber prüfte er Patente («Experte III. Klasse»), abends schrieb er am Küchentisch vier Aufsätze, die die Physik sprengten: Lichtquanten, Brownsche Bewegung, Spezielle Relativität, E=mc². Kein Labor, kein Institut – eine Mietwohnung über einer Laube.",
      funFact: "Einstein nannte das Patentamt später «weltliches Kloster, wo ich meine schönsten Gedanken ausbrütete» – der Brotjob als Glücksfall.",
      insiderTip: "Der Schreibtisch am Fenster mit Blick in die Kramgasse ist der Originalplatz – kurz hinsetzen denken, niemand wehrt sich.",
      photoSpot: "Von der Gasse: Fassade mit Einstein-Fahne, Lauben darunter.",
      audioScript:
        "Kramgasse neunundvierzig, zweiter Stock. Drei Zimmer, Laubenblick, Miete bescheiden. Hier wohnte von 1903 bis 1905 ein Mann, den die Universitäten nicht wollten: Albert Einstein, durchgefallen bei Bewerbungen, untergekommen als Patentprüfer dritter Klasse. Tagsüber begutachtete er Erfindungen – elektrische Apparate, Uhrenmechanismen. Und abends, am Küchentisch, während nebenan das Baby schrie, schrieb er. 1905, in einem einzigen Jahr, aus dieser Wohnung: vier Aufsätze. Einer erklärte das Licht neu, einer bewies die Existenz der Atome, einer hiess Spezielle Relativitätstheorie, und ein Nachtrag enthielt die berühmteste Formel der Welt: E gleich m c Quadrat. Physiker nennen es das Annus mirabilis, das Wunderjahr – und es fand nicht in Princeton statt, nicht in einem Labor, sondern hier, über einer Berner Laube. Die Wohnung ist heute Museum, original eingerichtet. Steig hoch, setz dich kurz an den Schreibtisch am Fenster und schau in die Gasse. Genau dieser Blick war das ganze Labor.",
      nearby: [
        { name: "Einstein-Kaffee", type: "cafe", note: "Im Erdgeschoss des Hauses – Kaffee unter der Wohnung des Genies.", address: "Kramgasse 49, 3011 Bern" },
      ],
    },
    {
      id: "muenster",
      name: "Berner Münster & Plattform",
      teaser: "Der höchste Kirchturm der Schweiz – und ein Jüngstes Gericht in 3D.",
      coords: { lat: 46.947, lng: 7.4514 },
      walkMinutesFromPrevious: 5,
      directions: "Durch eine der Quergassen zur Münstergasse, dem Turm entgegen.",
      stayMinutes: 25,
      why: "100,6 Meter Sandstein-Gotik, ein spektakuläres Hauptportal – und die Plattform-Terrasse hoch über der Aare.",
      story:
        "1421 begonnen, wurde der Turm erst 1893 vollendet – mit 100,6 Metern der höchste Kirchturm der Schweiz. Über dem Hauptportal drängen sich 294 Figuren zum Jüngsten Gericht: Die Verdammten fahren detailverliebt zur Hölle, die Geretteten lächeln mild. Daneben liegt die Münsterplattform, eine Terrasse hoch über der Aare – mit Buvette, Bäumen und Blick auf die badenden Berner unten im Fluss.",
      funFact: "Das Jüngste Gericht überlebte den reformatorischen Bildersturm von 1528 fast unversehrt – angeblich, weil es zu hoch hing, um es bequem abzuschlagen.",
      insiderTip: "Die 312 Turmstufen lohnen sich – aber der Gratis-Geheimtipp ist die Plattform: Buvette, Schatten, Aare-Blick. Im Sommer siehst du von hier die Schwimmer im Fluss treiben.",
      photoSpot: "Von der Plattform-Brüstung auf Aare-Schlaufe und Marzili.",
      audioScript:
        "Hundert Komma sechs Meter – kein Kirchturm der Schweiz ragt höher. Aber bevor du den Kopf in den Nacken legst, schau erst aufs Hauptportal: Dort spielt sich das Jüngste Gericht ab, zweihundertvierundneunzig Figuren, geschnitzt im fünfzehnten Jahrhundert. Links die Geretteten, mild lächelnd in feinen Gewändern. Rechts die Verdammten – und denen hat sich der Künstler mit Hingabe gewidmet: nackt, verzweifelt, von Teufeln traktiert, ein mittelalterlicher Horrorfilm in Stein. Dass das Ensemble den Bildersturm der Reformation überlebte, grenzt an ein Wunder – die Legende sagt: Es hing schlicht zu hoch zum Zertrümmern. Faulheit als Denkmalschutz. Wenn du Beine hast, steig die dreihundertzwölf Stufen hoch; bei Föhn stehen die Alpen wie bestellt am Horizont. Und danach gönn dir den entspannteren Höhepunkt: die Münsterplattform nebenan, eine Gartenterrasse hoch über der Aare. Unten zieht der türkisgrüne Fluss vorbei, im Sommer voller Schwimmer. Hol dir was an der Buvette und schau ihnen zu – Bern von seiner besten Seite: erhaben und völlig tiefenentspannt zugleich.",
      nearby: [
        { name: "Plattform-Buvette", type: "cafe", note: "Unter den Bäumen der Münsterplattform – Kaffee und Apéro mit Aare-Blick.", address: "Münsterplattform, 3011 Bern" },
      ],
    },
    {
      id: "gerechtigkeitsgasse",
      name: "Gerechtigkeitsgasse & Nydegg",
      teaser: "Die schönste Gasse Berns – hinunter zur ältesten Ecke der Stadt.",
      coords: { lat: 46.9482, lng: 7.4561 },
      walkMinutesFromPrevious: 5,
      directions: "Die Kramgasse weiter abwärts – sie wird zur Gerechtigkeitsgasse.",
      stayMinutes: 10,
      why: "Patrizierfassaden, Figurenbrunnen und das Gefälle zur Aare – Berns Gründungsmeile im Renaissance-Kleid.",
      story:
        "Die Gerechtigkeitsgasse führt zur Nydegg, wo Bern 1191 gegründet wurde. Der Gerechtigkeitsbrunnen zeigt Justitia mit verbundenen Augen – zu ihren Füssen die Häupter von Papst, Kaiser, Sultan und Schultheiss: Vor dem Recht sind alle gleich, eine freche Ansage von 1543. Die Brunnen der Altstadt (elf Figurenbrunnen!) waren Wasserversorgung und politisches Plakat zugleich.",
      funFact: "1986 schlugen Unbekannte der Justitia den Kopf ab – die Restaurierung wurde zur nationalen Affäre; heute steht eine Kopie, das Original liegt im Museum.",
      insiderTip: "Kurz in die Seitengasse zur Nydeggkirche: Dort stand die Gründungsburg – und von der Nydeggbrücke hast du den klassischen Blick auf die Aareschlaufe.",
      photoSpot: "Gassenflucht abwärts mit Brunnen mittig – am besten frühabends.",
      audioScript:
        "Diese Gasse ist Berns Visitenkarte: sanftes Gefälle, Patrizierhäuser, Lauben links und rechts – und mittendrin einer der berühmtesten Brunnen der Schweiz. Schau dir die Dame auf der Säule an: Justitia, die Gerechtigkeit, Schwert in der einen, Waage in der anderen Hand, Augen verbunden. Und jetzt schau zu ihren Füssen: Da liegen vier abgeschlagene Häupter – Papst, Kaiser, Sultan und der Berner Schultheiss. Die Botschaft von 1543 war ungeheuerlich: Vor dem Recht sind alle gleich, auch die Mächtigsten. Dass eine Stadt das damals öffentlich aufstellte, war politische Provokation vom Feinsten. Bern hat elf solcher Figurenbrunnen, jeder ein Manifest – vom Bannerträger bis zum Kindlifresser, der bis heute Kindern Albträume macht. Die Gasse führt hinunter zur Nydegg, der Keimzelle: Hier, an der engsten Stelle der Aareschlaufe, gründete Herzog Berchtold von Zähringen 1191 die Stadt. Der Legende nach benannte er sie nach dem ersten Tier, das er auf der Jagd erlegte. Es war – natürlich – ein Bär. Womit wir beim nächsten Stop wären.",
    },
    {
      id: "baerenpark",
      name: "BärenPark",
      teaser: "Die Wappentiere live – mit eigenem Aare-Zugang und Flussblick.",
      coords: { lat: 46.948, lng: 7.4599 },
      walkMinutesFromPrevious: 6,
      directions: "Über die Nydeggbrücke – der Park liegt am Hang direkt dahinter.",
      stayMinutes: 15,
      why: "Seit über 500 Jahren hält Bern Bären – heute in einem 6000-m²-Hangpark mit Fluss-Badewanne.",
      story:
        "Bern ohne Bären ist undenkbar: Seit 1513 – als Berner aus der Schlacht bei Novara einen lebenden Bären als Beute heimbrachten – hält die Stadt ihre Wappentiere. Aus dem engen Bärengraben von einst wurde 2009 der BärenPark: 6000 m² Hang mit Höhlen, Bäumen und eigenem Aare-Becken. Hier wohnen Finn, Björk und Nachwuchs – mit der besten Adresse der Stadt.",
      funFact: "Der alte Bärengraben von 1857 ist begehbar und mit dem Park verbunden – die Bären pendeln zwischen Alt- und Neubau wie ihre menschlichen Nachbarn.",
      insiderTip: "Bestes Beobachtungsdeck: unten am Aareweg – im Sommer schwimmen die Bären manchmal, während 20 Meter weiter Menschen in der Aare treiben.",
      photoSpot: "Vom unteren Parkweg: Bär, Aare und Altstadt-Silhouette in einem Bild.",
      audioScript:
        "Es gibt Städte mit Wappentieren auf Fahnen – und es gibt Bern, das seine Wappentiere füttert. Seit 1513 hält die Stadt lebende Bären, ohne Unterbruch: Damals kehrten Berner Söldner aus der Schlacht heim und brachten als Kriegsbeute – einen Bären. Man baute ihm ein Zuhause mitten in der Stadt, und seither ist der Bär Mitbürger. Jahrhundertelang lebten die Tiere im engen Bärengraben, einer Betonwanne, über die sich zu Recht alle Welt empörte. 2009 kam die Wende: der BärenPark, sechstausend Quadratmeter Hang direkt an der Aare, mit Höhlen, Wald und eigenem Schwimmbecken mit Flusswasser. Hier unten wohnen Finn und Björk – schau den Hang ab, oft liegen sie dösend zwischen den Büschen oder planschen im Becken. Und das vielleicht Bernerischste überhaupt: Im Sommer schwimmen zwanzig Meter neben den badenden Bären die badenden Berner die Aare hinunter. Zwei Spezies, ein Fluss, totale Gelassenheit. Gleich geht es hoch zum grossen Finale – der Rosengarten wartet mit dem schönsten Blick der Hauptstadt.",
    },
    {
      id: "rosengarten",
      name: "Rosengarten",
      teaser: "Das Finale: die ganze Altstadt im Abendlicht – Berns Logenplatz.",
      coords: { lat: 46.9508, lng: 7.4604 },
      walkMinutesFromPrevious: 10,
      directions: "Vom BärenPark dem Aargauerstalden-Weg bergauf folgen (10 Min. Anstieg).",
      stayMinutes: 25,
      why: "220 Rosensorten, eine Wiese voller Berner – und DER Postkartenblick über Aareschlaufe und Altstadtdächer.",
      story:
        "Wo bis 1877 ein Friedhof lag, blüht heute Berns beliebtester Park: 220 Rosensorten, Iris- und Rhododendrenfelder, ein Pavillon, ein Restaurant. Aber die Hauptattraktion ist der Blick: Die ganze UNESCO-Altstadt liegt dir zu Füssen – die Dächer, das Münster, die Aareschlaufe. Abends sitzt halb Bern mit Bier und Decke auf der Wiese und schaut zu, wie die Sandsteinstadt golden wird.",
      funFact: "Im Park sitzt eine Einstein-Bronzefigur auf einer Bank – auf dem Schoss Platz nehmen ist ausdrücklich erlaubt und das meistgeschossene Foto des Gartens.",
      insiderTip: "Getränk vom Kiosk holen und auf die Wiesenkante sitzen statt ins Restaurant – der Blick ist derselbe, die Stimmung lokaler.",
      photoSpot: "Wiesenkante zur blauen Stunde: Münsterturm überragt das Dächermeer, die Aare glänzt.",
      audioScript:
        "Geschafft – und was für ein Schlussbild. Unter dir liegt die komplette Altstadt von Bern: ein Meer aus Ziegeldächern, eingefasst von der türkisen Aareschlaufe, überragt vom Münsterturm. Die UNESCO hat dieses Ensemble 1983 zum Welterbe erklärt, und von hier oben verstehst du in einer Sekunde, warum – die Stadt von 1405 ist praktisch komplett erhalten, kein Hochhaus stört, nichts. Du stehst übrigens auf einem ehemaligen Friedhof: Bis 1877 wurden hier die Berner begraben, dann machte man aus dem Gottesacker einen Rosengarten – zweihundertzwanzig Sorten blühen heute über den alten Gräbern, was die Berner mit ihrem trockenen Humor nie gestört hat. Auf einer Bank im Park sitzt eine Bronzefigur: Einstein, entspannt, mit Platz auf dem Schoss – setz dich ruhig dazu, das gehört sich so. Und dann mach es wie die Einheimischen: Getränk vom Kiosk, Platz auf der Wiesenkante, und zuschauen, wie der Sandstein unten golden wird. Lauben, eine Weltformel, Bären und dieser Blick – das war Bern. Die gemütlichste Hauptstadt der Welt macht keine grossen Gesten. Sie hat sie nicht nötig. Bis zum nächsten Trail!",
      nearby: [
        { name: "Restaurant Rosengarten", type: "restaurant", note: "Terrasse mit Altstadtblick – fürs Apéro-Finale mit Service.", address: "Alter Aargauerstalden 31b, 3006 Bern" },
      ],
    },
  ],
};
