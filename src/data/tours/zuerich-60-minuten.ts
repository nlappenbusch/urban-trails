import type { Tour } from "@/lib/types";

export const zuerich60Minuten: Tour = {
  slug: "zuerich-60-minuten",
  citySlug: "zuerich",
  category: "adhs-quick",
  name: "Zürich in 60 Minuten",
  claim: "Der Quick-Fix: alle 10 Minuten ein neuer Reiz – Aussicht, Wasser, Geschichte, fertig.",
  teaser:
    "Eine Stunde Lücke im Tag? Diese Express-Route presst das Beste der Altstadt in fünf dichte Stops – ohne Längen, überall abbrechbar.",
  description:
    "Für Tage, an denen drei Stunden nicht drinliegen: Zürich in sechzig Minuten, getaktet wie eine gute Playlist. Vom Hauptbahnhof auf den Lindenhof (Aussicht), durch die Schipfe (Mittelalter am Wasser), über die Münsterbrücke (Postkarte) zum Grossmünster (Weltgeschichte) und ans Bellevue (See und Abgang). Jeder Stop liefert einen anderen Reiz, kein Stop dauert länger als zehn Minuten, und an jeder Ecke wartet ein Tram, falls dein Zeitfenster doch kleiner war. Maximale Dichte, null Füllmaterial.",
  moods: ["kultur", "aussicht", "ueberraschung"],
  audience: "Zwischen-zwei-Terminen-Menschen, Zugumsteiger mit Gepäckfach, Spontane – und alle, die lange Touren nervös machen.",
  vibe: "Schnell, dicht, befriedigend – die Espresso-Variante der Stadtbesichtigung.",
  bestTimeOfDay: "Jederzeit – die Route funktioniert morgens um 7 wie abends um 22 Uhr (beleuchtet).",
  bestSeason: "Ganzjährig, wetterrobust – nur die Lindenhof-Aussicht will klare Sicht.",
  difficulty: "leicht",
  durationMinutes: 60,
  distanceKm: 2.6,
  startPoint: "Zürich HB, Haupthalle",
  endPoint: "Bellevue",
  publicTransport: {
    start: "Zürich HB – du bist schon da",
    end: "Bellevue: alle Trams Richtung HB in 6 Min.",
  },
  isPremium: false,
  gradient: ["#0e3a6b", "#ff4d00"],
  seo: {
    metaTitle: "Zürich in 60 Minuten: Die Express-Tour ab Hauptbahnhof | Urban Trails",
    metaDescription:
      "Nur eine Stunde Zeit in Zürich? Die Express-Route ab HB: Lindenhof, Schipfe, Münsterbrücke, Grossmünster, Bellevue – 5 Stops, 2.6 km, mit Audio-Stories. Gratis.",
    keywords: ["Zürich 1 Stunde Sehenswürdigkeiten","Zürich Express Tour","Zürich Zwischenstopp HB","Zürich kurz besichtigen","Zürich Layover"],
  },
  faq: [
    { question: "Schaffe ich das wirklich in 60 Minuten?", answer: "Ja – reine Gehzeit ist 35 Minuten, der Rest verteilt sich auf fünf kurze Stops. Wer Fotos liebt, plant 75 Minuten." },
    { question: "Geht das mit Gepäck?", answer: "Mit Rucksack problemlos; Rollkoffer ins HB-Schliessfach – das Kopfsteinpflaster der Altstadt ist Koffer-Feind Nr. 1." },
    { question: "Funktioniert die Route abends?", answer: "Sehr gut – Lindenhof und Münsterbrücke sind beleuchtet besonders stimmungsvoll, und offen ist draussen bekanntlich immer." },
    { question: "Und wenn ich doch mehr Zeit habe?", answer: "Dann wechsle am Bellevue nahtlos in die grosse Klassiker-Tour – sie führt von dort weiter zum See und Chinagarten." },
  ],
  stops: [
    {
      id: "hb-blitzstart",
      name: "Hauptbahnhof – Blitzstart",
      teaser: "Engel angucken, los.",
      coords: { lat: 47.37785, lng: 8.54035 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 3,
      why: "Ein Blick nach oben, einer auf die Uhr – mehr braucht der Start nicht.",
      story:
        "Über dir schwebt der bunte Schutzengel von Niki de Saint Phalle, unter dir liegen vier Bahnhofsetagen, und vor dir liegen 60 sehr effiziente Minuten. Der HB ist mit fast 3000 Zügen täglich einer der dichtesten Bahnhöfe der Welt – passender Startpunkt für eine dichte Tour.",
      funFact: "Der Engel wiegt 1.2 Tonnen und hängt seit 1997 – Pendler-Schutzpatronin mit Goldflügeln.",
      insiderTip: "Rollkoffer? Schliessfächer Ebene -1. Diese Route mag Hände in den Taschen.",
      photoSpot: "Engel von der Treppe Landesmuseum-Seite.",
      audioScript:
        "Sechzig Minuten, fünf Stops, los. Kurz nach oben schauen: Die bunte Dame mit den Goldflügeln ist der Schutzengel von Niki de Saint Phalle – seit 1997 wacht sie über die Pendlerströme, und die meisten haben sie noch nie bemerkt. Du schon, zehn Sekunden, Haken dran. Dieser Bahnhof wickelt fast dreitausend Züge pro Tag ab, einer der dichtesten der Welt – und genau in diesem Takt läuft jetzt deine Tour: kein Stop über zehn Minuten, alle zehn Minuten ein komplett neuer Reiz. Aussicht, Mittelalter, Postkarte, Weltgeschichte, See. Falls dein Zeitfenster platzt: An jeder Ecke dieser Route steht ein Tram zurück zum HB. Jetzt raus Richtung Bahnhofstrasse und gleich links halten – in acht Minuten stehst du über den Dächern der Stadt.",
    },
    {
      id: "lindenhof-express",
      name: "Lindenhof – die Aussicht",
      teaser: "2000 Jahre und der beste Blick – in acht Minuten erlaufen.",
      coords: { lat: 47.37301, lng: 8.54063 },
      walkMinutesFromPrevious: 8,
      directions: "Bahnhofstrasse, links in den Rennweg, dem Hügel hoch.",
      stayMinutes: 8,
      why: "Der ganze Stadt-Überblick auf einmal: Limmat, Altstadt, ETH – dein Lageplan für die nächsten 40 Minuten.",
      story:
        "Römisches Kastell, Frauen-Bluff von 1292, Boule-Rentner – der Lindenhof hat Geschichte im Übermass. Für dich heute vor allem: Orientierung. Von hier siehst du alles, was gleich kommt – die Brücke, die Türme, den Weg zum See.",
      funFact: "Der Name Zürich stammt vom römischen Zollposten «Turicum», der genau hier stand.",
      insiderTip: "Merk dir den Blick: Grossmünster-Doppelturm rechts – da läufst du in 20 Minuten durch.",
      photoSpot: "Mauerkante Mitte, Grossmünster im Bild.",
      audioScript:
        "Acht Minuten, und du stehst auf zweitausend Jahren Geschichte mit dem besten Gratisblick der Stadt. Hier oben stand das römische Turicum – aus dem Wort wurde Zürich. Hier bluffte 1292 die weibliche Stadtbevölkerung in Rüstungen eine Belagerungsarmee weg. Und hier spielen heute Rentner Boule, als wäre nichts gewesen. Für deine Expresstour ist der Lindenhof vor allem eines: die Karte im Massstab eins zu eins. Schau runter – der Fluss ist die Limmat, die Häuserzeile direkt unter dir am Wasser ist die Schipfe, dein nächster Stop. Die zwei wuchtigen Türme rechts: Grossmünster, Stop vier. Und wo die Limmat hinten breiter wird, liegt der See – dein Finale. Du hast die ganze Tour gerade mit einem Blick abgelaufen. Jetzt im Schnelldurchlauf in echt: Treppe runter zur Schipfe, Mittelalter wartet.",
    },
    {
      id: "schipfe-express",
      name: "Schipfe – das Mittelalter",
      teaser: "Handwerker-Gasse am Wasser, von Touristen übersehen.",
      coords: { lat: 47.3723, lng: 8.5416 },
      walkMinutesFromPrevious: 4,
      directions: "Den Fussweg vom Lindenhof direkt ans Limmatufer hinunter.",
      stayMinutes: 7,
      why: "Zürichs ältestes Arbeitsquartier in zwei Gehminuten – echter als jede Museumsgasse.",
      isHiddenGem: true,
      story:
        "Wo einst Schiffe anlegten und Färber die Limmat bunt spülten, sitzen heute Buchbinderinnen und Goldschmiede – die Stadt vergibt die Mini-Läden bewusst ans Handwerk. Die Schipfe ist das Altstadt-Stück, das die Reisegruppen auslassen. Ihr Fehler.",
      funFact: "Im 15. Jahrhundert schimmerte die Limmat hier je nach Färber-Auftrag rot, blau oder violett.",
      insiderTip: "Kurz in die Werkstattfenster schauen – hier wird gearbeitet, nicht ausgestellt.",
      photoSpot: "Häuserzeile mit Spiegelung im Fluss.",
      audioScript:
        "Zwei Minuten Abstieg, sechshundert Jahre zurück. Die Schipfe war Zürichs Hafen und Industriezone, als Industrie noch Hände bedeutete: Fischer, Gerber, und vor allem die Seidenfärber, die ihre Stoffe direkt im Fluss spülten – je nach Auftragslage schimmerte die Limmat rot, blau oder violett. Mit Seide wurde diese Stadt zum ersten Mal reich, lange vor jeder Bank. Heute sitzt in den schmalen Häusern wieder Handwerk – Buchbinderei, Hutmacherin, Goldschmiede – weil die Stadt die Läden bewusst nicht an die Meistbietenden vergibt. Wirf im Vorbeigehen einen Blick in die Werkstattfenster: Hier wird gearbeitet, nicht inszeniert. Und das Beste: Die Reisegruppen verpassen diese Gasse zuverlässig. Du nicht. Weiter dem Wasser entlang – die berühmteste Brücke der Stadt ist drei Minuten entfernt.",
    },
    {
      id: "muensterbruecke-grossmuenster-express",
      name: "Münsterbrücke & Grossmünster",
      teaser: "Postkarte plus Reformation – Doppelstop in zwölf Minuten.",
      coords: { lat: 47.3701, lng: 8.5440 },
      walkMinutesFromPrevious: 5,
      directions: "Am Ufer entlang zur Münsterbrücke, drüben die Treppe zum Zwingliplatz.",
      stayMinutes: 12,
      why: "Der eine Pflicht-Fotostop – und die Kirche, die Zürichs Charakter geprägt hat wie nichts sonst.",
      story:
        "Brückenmitte: links Fraumünster mit Chagall-Fenstern, rechts die Grossmünster-Türme – das Zürich-Panorama. Drüben predigte Zwingli ab 1519 die Reformation: Bilder raus, Arbeit rein – ohne diese Kanzel kein Banken-Zürich. Die Stadtheiligen trugen der Legende nach ihre Köpfe eigenhändig den Hügel hinauf.",
      funFact: "Die Zürcher nennen die Grossmünster-Türme liebevoll «Pfeffermühlen» – einmal gehört, nie mehr anders gesehen.",
      insiderTip: "Keine Zeit für den Turm (187 Stufen) – aber der Blick in den romanischen Kreuzgang nebenan kostet zwei Minuten und nichts.",
      photoSpot: "Brückenmitte, beide Münster in einem Schwenk.",
      audioScript:
        "Doppelstop, zwölf Minuten, erst das Bild, dann die Wucht. Brückenmitte, kurz stehen: links das Fraumünster mit seiner grünen Nadel – drinnen leuchten Chagall-Fenster –, rechts die zwei Türme, die alle Zürcher liebevoll Pfeffermühlen nennen. Das ist die Postkarte, einmal im Kopf abspeichern, gern auch im Handy. Jetzt rüber zum Grossmünster, denn da wurde Zürich erfunden, wie es heute tickt: 1519 stieg hier Huldrych Zwingli auf die Kanzel und predigte auf Deutsch statt Latein. Drei Jahre später flogen die Heiligenbilder aus den Kirchen, die Klöster wurden zu Schulen, und aus der frommen Stadt wurde eine Stadt der Arbeit – die direkte Ahnenlinie zum Finanzplatz. Gegründet wurde die Kirche übrigens, wo die enthaupteten Stadtheiligen ihre Köpfe selbst hinaufgetragen haben sollen. Zürich war schon immer effizient. Apropos: Noch ein Stop. Acht Minuten zum See.",
    },
    {
      id: "bellevue-express",
      name: "Bellevue – See & Abgang",
      teaser: "Horizont auf, Tour zu – mit Bratwurst-Option.",
      coords: { lat: 47.36672, lng: 8.54497 },
      walkMinutesFromPrevious: 8,
      directions: "Limmatquai flussabwärts bis zur Quaibrücke.",
      stayMinutes: 8,
      why: "Der Moment, für den Zürich gebaut wurde: Die Stadt öffnet sich zum See, bei Föhn mit Alpen.",
      story:
        "Nach den Gassen: Weite. Am Bellevue trifft die Stadt den See, auf dem Sechseläutenplatz verbrennt sie jeden April einen explosiven Schneemann namens Böögg als Wetterorakel, und am Sternen Grill wartet die berühmteste Bratwurst des Landes. Würdiger Abschluss-Snack.",
      funFact: "Böögg-Logik: Je schneller der Schneemann-Kopf explodiert, desto schöner der Sommer. Trefferquote: bescheiden. Begeisterung: ungebrochen.",
      insiderTip: "Noch 10 Minuten übrig? Bratwurst am Sternen Grill, scharfer Senf, im Stehen – das vollständigste Zürich-Erlebnis pro Minute.",
      photoSpot: "Quaibrücke Richtung See – bei Föhn mit Alpenkette.",
      audioScript:
        "Und – Horizont. Nach all den Gassen öffnet sich Zürich hier mit einem Schlag: der See, die Segelboote, bei Föhn die komplette Alpenkette als Kulisse. Der riesige Platz neben dir ist der Sechseläutenplatz, und auf dem passiert jeden April das Verrückteste, was diese vernünftige Stadt sich leistet: Sie verbrennt einen Schneemann. Den Böögg, vollgestopft mit Sprengstoff – je schneller sein Kopf explodiert, desto schöner der Sommer, sagt die Tradition. Die Statistik sagt was anderes, aber wen interessiert Statistik bei Feuerwerk. Damit: Tour geschafft. Fünf Stops, eine Stunde, das Beste der Stadt im Schnellformat. Wenn noch zehn Minuten drinliegen, geh die fünfzig Meter zum Sternen Grill – die berühmteste Bratwurst der Schweiz, mit scharfem Senf, im Stehen. Mehr Zürich pro Minute gibt es nirgends. Alle Trams hier fahren zurück zum Hauptbahnhof. Und falls dir das zu schnell ging: Die grosse Klassiker-Tour startet genau hier in die Verlängerung. Bis zum nächsten Quickie!",
      nearby: [
        { name: "Sternen Grill", type: "restaurant", note: "Die Bratwurst-Institution – 5 Minuten, lebensverändernd.", address: "Theaterstrasse 22, 8001 Zürich" },
      ],
    },
  ],
};
