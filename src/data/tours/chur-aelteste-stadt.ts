import type { Tour } from "@/lib/types";

export const churAeltesteStadt: Tour = {
  slug: "chur-aelteste-stadt",
  citySlug: "chur",
  category: "hidden-gems",
  name: "Chur – die älteste Stadt",
  claim: "5000 Jahre Siedlungsgeschichte, eine autofreie Altstadt – und eine Seilbahn, die mitten in der Stadt in die Berge startet.",
  teaser:
    "Durch die Bündner Altstadt vom Obertor über Arcas-Platz und Kathedrale bis zur Brambrüesch-Bahn – die einzige Stadt der Schweiz mit Hausberg-Direktanschluss ab Zentrum.",
  description:
    "Chur ist älter als Rom – auf dem Stadtgebiet siedeln Menschen seit rund 5000 Jahren, länger als irgendwo sonst in der Schweiz. Diese Tour führt durch die komplett autofreie Altstadt: vom Bahnhof durch die Bahnhofstrasse zum Obertor, über den verwinkelten Arcas-Platz mit seinen bemalten Fassaden hinauf in den Bischöflichen Hof, wo die Kathedrale seit 800 Jahren über der Stadt wacht und der Bischof bis heute residiert. Danach durch die Obere Gasse, die schmalste und älteste Gasse der Stadt, zur Martinskirche – und zum Finale, das nur Chur bietet: Die Brambrüesch-Bahn startet mitten im Stadtzentrum und schwebt in 25 Minuten auf 1600 Meter. Stadt und Berg, ein Ticket. Gratis-Tour zum Bündner Reinschnuppern.",
  moods: ["kultur", "ruhe", "aussicht"],
  audience: "Graubünden-Durchreisende (Bernina-/Glacier-Express-Umsteiger!), Geschichtsfans, Alpenstadt-Neugierige.",
  vibe: "Bündner Gelassenheit – alte Steine, kurze Wege, Berge immer im Blick.",
  bestTimeOfDay: "Vormittag bis Nachmittag; mit Brambrüesch-Verlängerung den ganzen Tag.",
  bestSeason: "Ganzjährig; Brambrüesch-Bahn fährt Sommer wie Winter (Bikepark/Schneeschuh).",
  difficulty: "leicht",
  durationMinutes: 120,
  distanceKm: 2.8,
  startPoint: "Bahnhof Chur",
  endPoint: "Talstation Brambrüesch-Bahn",
  publicTransport: {
    start: "Bahnhof Chur – Drehscheibe von Glacier- und Bernina-Express, ab Zürich ~75 Min.",
    end: "Talstation liegt 5 Min. vom Bahnhof – perfekter Rundkurs",
  },
  isPremium: false,
  gradient: ["#4a3a1f", "#9fc626"],
  seo: {
    metaTitle: "Chur zu Fuss: Altstadt, Kathedrale & Brambrüesch mit Audioguide | Urban Trails",
    metaDescription:
      "Gratis-Tour durch Chur, die älteste Stadt der Schweiz: Obertor, Arcas-Platz, Bischöflicher Hof, Obere Gasse und die Stadtseilbahn nach Brambrüesch. 6 Stops mit Audio-Stories.",
    keywords: ["Chur Sehenswürdigkeiten","Chur Altstadt Rundgang","älteste Stadt der Schweiz","Brambrüesch Chur","Chur Audioguide"],
  },
  faq: [
    { question: "Ist Chur wirklich die älteste Stadt der Schweiz?", answer: "Die Siedlungsgeschichte reicht rund 5000 Jahre zurück – belegt durch Funde auf dem Stadtgebiet. Damit gilt Chur als älteste durchgehend besiedelte Stadt des Landes." },
    { question: "Lohnt sich Brambrüesch?", answer: "Sehr – die Bahn startet 5 Minuten vom Bahnhof und bringt dich auf 1600 m: Sommer Wandern/Biken, Winter Schlitteln. Rechne +2 bis 3 Stunden." },
    { question: "Passt die Tour in einen Zug-Umstieg?", answer: "Ja – die Kerntour dauert 2 Stunden. Wer auf Glacier- oder Bernina-Express wartet, schafft Altstadt und Kathedrale locker." },
  ],
  stops: [
    {
      id: "bahnhof-chur",
      name: "Bahnhof Chur",
      teaser: "Drehscheibe der Alpenbahnen – hier starten Glacier- und Bernina-Express.",
      coords: { lat: 46.8531, lng: 9.5292 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 5,
      why: "Der Bahnhof ist selbst eine Attraktion: Normalspur trifft Rhätische Bahn, Stadt trifft Hochgebirge.",
      story:
        "In Chur wechselt die Schweiz die Spurweite: Hier enden die SBB-Gleise, und die schmalspurige Rhätische Bahn übernimmt – mit Glacier- und Bernina-Express starten zwei der berühmtesten Bahnstrecken der Welt (die Bernina-Linie ist UNESCO-Welterbe) direkt an diesem Perron. Die roten Züge im Bahnhof sind das Versprechen: Hinter dieser Stadt beginnen die hohen Berge.",
      funFact: "Die Rhätische Bahn betreibt ab hier fast 400 km Schmalspurnetz – das grösste der Schweiz, quer durch 115 Tunnels und über 600 Brücken.",
      insiderTip: "Kurz auf die RhB-Perrons schauen: Die knallroten Panoramawagen des Bernina-Express sind auch im Stand ein Foto wert.",
      photoSpot: "RhB-Zug vor Bergkulisse, Gleis 9 ff.",
      audioScript:
        "Willkommen in der ältesten Stadt der Schweiz – und an einem Bahnhof, der eigentlich ein Tor ist. Hier in Chur wechselt das Land buchstäblich die Spur: Die normalen SBB-Gleise enden, und die schmale, rote Rhätische Bahn übernimmt – fast vierhundert Kilometer Schmalspurnetz, hundertfünfzehn Tunnels, sechshundert Brücken, hinauf in Täler, die sonst kaum erreichbar wären. Von diesem Perron starten zwei Legenden: der Glacier-Express nach Zermatt und der Bernina-Express über den höchsten Bahnübergang der Alpen nach Italien – die Strecke ist UNESCO-Welterbe. Aber bevor du irgendwann in einen dieser roten Züge steigst, schauen wir uns die Stadt an, die alle nur durchfahren. Grosser Fehler, wirst du gleich sehen: Fünftausend Jahre Siedlungsgeschichte, eine komplett autofreie Altstadt und am Ende eine Seilbahn, die mitten aus dem Zentrum in die Berge schwebt. Los geht's, das Obertor wartet.",
    },
    {
      id: "obertor",
      name: "Obertor & Stadtmauer-Rest",
      teaser: "Das Tor zur Alpenstadt – hier begann der Säumerweg über die Pässe.",
      coords: { lat: 46.8475, lng: 9.5326 },
      walkMinutesFromPrevious: 10,
      directions: "Durch Bahnhof- und Poststrasse geradeaus zur Altstadt – das Tor steht am oberen Ende.",
      stayMinutes: 8,
      why: "Vom mittelalterlichen Mauerring blieb das Obertor – jahrhundertelang der Start aller Pass-Reisen.",
      story:
        "Durch das Obertor verliess man Chur Richtung Süden: Julier, Splügen, San Bernardino – die grossen Bündner Pässe begannen logistisch genau hier. Säumerkolonnen mit Maultieren, Weinfässern und Salzsäcken zogen durch diesen Bogen; Chur lebte als letzte grosse Stadt vor den Pässen vom Umschlag, von Herbergen und vom Zoll.",
      funFact: "Bis zur Eisenbahn war der Transit über die Bündner Pässe Churs Haupteinnahmequelle – die Stadt war das Logistikzentrum der Alpen.",
      insiderTip: "Direkt hinter dem Tor beginnt die Fussgängerzone – ab hier ist die ganze Altstadt autofrei, eine der konsequentesten der Schweiz.",
      photoSpot: "Torbogen mit Altstadtgasse dahinter.",
      audioScript:
        "Dieser Torbogen war jahrhundertelang die wichtigste Tür der Alpen. Wer von Norden kam und nach Italien wollte – über den Julier, den Splügen oder den San Bernardino –, der musste durch Chur, und der Weg zu den Pässen begann genau hier, am Obertor. Stell dir den Betrieb vor: Säumerkolonnen mit Dutzenden Maultieren, beladen mit Salz, Wein, Tuch und Eisen; Fuhrleute, die in den Herbergen der Stadt übernachteten; Zöllner, die an diesem Tor kassierten. Chur war das Logistikzentrum der Alpen – die letzte grosse Stadt vor der Höhe, der Ort, wo umgeladen, verhandelt und übernachtet wurde. Die Eisenbahn beendete das Säumerwesen, aber die Rolle blieb: Noch heute ist Chur die Drehscheibe Graubündens. Geh jetzt durch das Tor – dahinter beginnt die autofreie Altstadt, und sie gehört zu den stillsten und schönsten des Landes. Erste Station: ein Platz wie eine Theaterkulisse.",
    },
    {
      id: "arcas-platz",
      name: "Arcas-Platz",
      teaser: "Churs schönste Bühne – bemalte Fassaden über römischen Fundamenten.",
      coords: { lat: 46.8485, lng: 9.5335 },
      walkMinutesFromPrevious: 4,
      directions: "Vom Obertor in die Gassen östlich Richtung Arcas.",
      stayMinutes: 12,
      why: "Der dreieckige Platz mit seinen Farbfassaden ist das Postkartenmotiv der Stadt – und steht auf antikem Grund.",
      isHiddenGem: true,
      story:
        "Der Arcas war einst dicht bebautes Handwerkerquartier; bei Sanierungen stiess man auf römische Mauern – im Quartier darunter lag das antike Curia Raetorum, das den Stadtnamen prägte. Heute rahmen pastellfarbene Häuser mit Bündner Fassadenmalerei den Platz, im Sommer voller Caféterrassen.",
      funFact: "«Chur» geht auf das römische Curia zurück – als Augustus' Truppen kamen, war die Siedlung schon Jahrtausende alt.",
      insiderTip: "Unter dem benachbarten Gebäudekomplex sind römische Ausgrabungen konserviert – Hinweistafeln am Platz zeigen den Zugang.",
      photoSpot: "Platzdreieck mit Fassadenzeile im Nachmittagslicht.",
      audioScript:
        "Und plötzlich öffnet sich die Gasse zu diesem Dreieck aus Farbe: der Arcas, Churs schönster Platz – und einer mit doppeltem Boden. Die pastellfarbenen Häuser mit ihren bemalten Fassaden sehen aus wie eine Bündner Theaterkulisse, aber das eigentliche Schauspiel liegt darunter: Bei Bauarbeiten stiess man hier auf römische Mauern. Curia Raetorum hiess der Ort, als die Legionen des Augustus kamen – Verwaltungsposten an der Strasse zu den Pässen. Aus Curia wurde über die Jahrhunderte: Chur. Und das Verrückte ist – die Römer waren hier schon die Späten. Auf dem Stadtgebiet siedeln Menschen seit rund fünftausend Jahren, seit der Jungsteinzeit, ohne Unterbruch. Das macht Chur zur ältesten Stadt der Schweiz; als Rom gegründet wurde, gab es diesen Flecken längst. Setz dich einen Moment an den Platz, am besten mit Blick auf die Fassaden. Fünf Jahrtausende unter den Füssen – und oben Caféterrassen. Geschichte kann sehr gemütlich sein. Weiter geht's, bergauf zum Bischof.",
      nearby: [
        { name: "Cafés am Arcas", type: "cafe", note: "Sonnenterrassen mit Fassadenblick – der Pausenplatz der Tour.", address: "Arcas, 7000 Chur" },
      ],
    },
    {
      id: "bischoeflicher-hof",
      name: "Bischöflicher Hof & Kathedrale",
      teaser: "Eine Stadt in der Stadt: Hier residiert seit 1500 Jahren der Bischof.",
      coords: { lat: 46.8484, lng: 9.5354 },
      walkMinutesFromPrevious: 5,
      directions: "Die Treppen zum erhöhten Hofbezirk hinauf.",
      stayMinutes: 20,
      why: "Der ummauerte Hof mit der romanischen Kathedrale ist das geistliche Herz Graubündens – ein Bezirk mit eigener Aura.",
      story:
        "Das Bistum Chur ist eines der ältesten nördlich der Alpen – erstmals erwähnt 451. Der Bischöfliche Hof thront als eigener, einst befestigter Bezirk über der Stadt: Schloss, Kathedrale, Stille. Die Kathedrale St. Mariä Himmelfahrt (geweiht 1272) birgt den grössten spätgotischen Schnitzaltar der Schweiz – vergoldet, fast zehn Meter hoch.",
      funFact: "Der Bischof von Chur war jahrhundertelang auch weltlicher Fürst – die Stadt unten und der Hof oben führten eine jahrhundertelange, teils handfeste Dauerfehde.",
      insiderTip: "Den goldenen Hochaltar in der dunklen Kathedrale wirken lassen – Augen erst ans Dämmerlicht gewöhnen, dann nach vorne gehen.",
      photoSpot: "Vom Hofplatz über die Dächer der Altstadt zum Calanda-Massiv.",
      audioScript:
        "Du betrittst jetzt eine Stadt in der Stadt. Der Bischöfliche Hof war jahrhundertelang ein eigener, ummauerter Kosmos – mit eigenem Recht, eigenen Wachen und einem Herrn, der beides war: Bischof und Fürst. Das Bistum Chur taucht erstmals im Jahr 451 in den Quellen auf, es gehört zu den ältesten nördlich der Alpen – hier oben wurde Kirchengeschichte geschrieben, während unten die Bürgerstadt wuchs. Die beiden Welten lagen übrigens permanent im Clinch: Die Churer Bürger nahmen die Reformation an, der Hof blieb katholisch – und so trennt bis heute eine unsichtbare Linie diese Treppe vom Rest der Stadt. In der Kathedrale wartet der Schatz: der grösste spätgotische Schnitzaltar der Schweiz, fast zehn Meter vergoldetes Schnitzwerk, das im Dämmerlicht des romanischen Chors glüht. Gib deinen Augen einen Moment, sich an das Dunkel zu gewöhnen, bevor du nach vorne gehst – der Altar belohnt Geduld. Und draussen auf dem Hofplatz: der Blick über die Dächer zum Calanda. Bischofsblick, könnte man sagen.",
    },
    {
      id: "obere-gasse",
      name: "Obere Gasse & Martinskirche",
      teaser: "Die älteste Gasse der ältesten Stadt – eng, krumm, voller Leben.",
      coords: { lat: 46.8489, lng: 9.5322 },
      walkMinutesFromPrevious: 5,
      directions: "Vom Hof hinunter und in die schmale Gasse Richtung Martinsplatz.",
      stayMinutes: 12,
      why: "Hier fühlt sich Chur am ältesten an: schiefe Häuser, kleine Läden, und am Ende Giacomettis Kirchenfenster.",
      story:
        "Die Obere Gasse folgt dem ältesten Strassenverlauf der Stadt; ihre Häuser drängen sich, als hätten sie sich in 800 Jahren aneinander gewöhnt. Am Martinsplatz steht die spätgotische Martinskirche – mit drei Fenstern von Augusto Giacometti (1919), dem Bündner Farbmagier, dessen Glaskunst die Kirche von innen leuchten lässt.",
      funFact: "Augusto Giacometti – Cousin zweiten Grades von Alberto – schuf auch die berühmten Hallenfresken im Zürcher Amtshaus («Blüemlihalle»); seine Heimat war Graubünden.",
      insiderTip: "In der Gasse sitzen Churs eigenwilligste Läden: Bündner Spezialitäten, Buchhandlung, Handwerk – Mitbringsel-Zone.",
      photoSpot: "Gassenflucht mit Martinsturm am Ende.",
      audioScript:
        "Diese Gasse ist der älteste Weg der Stadt – und sie fühlt sich auch so an. Die Häuser der Oberen Gasse lehnen sich aneinander wie alte Freunde, kein Winkel ist gerade, und genau darin liegt der Charme: Hier wurde nie für Touristen restauriert, hier wird seit achthundert Jahren einfach gewohnt, verkauft und gelebt. Die kleinen Läden führen Bündner Spezialitäten – Birnbrot, Salsiz, Röteli-Likör – und am Ende der Gasse wartet ein Farbwunder: die Martinskirche. Von aussen schlichte Spätgotik, innen aber leuchten drei Fenster von Augusto Giacometti, dem grossen Bündner Glas- und Farbkünstler – übrigens aus derselben weitverzweigten Künstlerfamilie wie der berühmte Alberto mit seinen dünnen Figuren. Giacomettis Fenster von 1919 machen aus Licht Farbe und aus der Kirche einen Farbraum; an Sonnentagen wandern rote und blaue Flecken über die Bänke. Kurz reinschauen, kurz still sein. Danach das Finale – und das hat in der Schweiz keine Konkurrenz: eine Bergbahn ab Stadtmitte.",
    },
    {
      id: "brambruesch-bahn",
      name: "Brambrüesch-Talstation",
      teaser: "Das Finale: ab Stadtzentrum auf 1600 Meter – Churs einzigartiger Trumpf.",
      coords: { lat: 46.8477, lng: 9.5285 },
      walkMinutesFromPrevious: 6,
      directions: "Westwärts durch die Altstadt zur Talstation am Kasernenplatz.",
      stayMinutes: 10,
      why: "Chur ist die einzige Schweizer Stadt mit Hausberg-Seilbahn direkt ab Zentrum – Stadt und 1600er-Gipfel, ein Übergang.",
      story:
        "Fünf Gehminuten vom Bahnhof startet die Bahn nach Brambrüesch: erst Gondel aufs Känzeli, dann Sesselbahn auf 1600 m – im Sommer Wander- und Bikegebiet, im Winter Churs Skiberg. Kein anderer Schweizer Stadtkern hat das: Feierabend, Gondel, Gipfel. Die Churer nennen es schlicht «ihren Berg».",
      funFact: "Chur wirbt als einzige «Alpenstadt» der Schweiz mit Skigebiet ab Stadtzentrum – morgens Sitzung, mittags Schneeschuh, abends Altstadt-Beiz.",
      insiderTip: "Wenn du 2–3 Stunden hast: hochfahren, Höhenrundweg, Plattenhütte oder Bergrestaurant, runterschweben – der perfekte Tour-Epilog.",
      photoSpot: "Gondel vor Altstadtdächern beim Start – Stadt und Berg in einem Bild.",
      audioScript:
        "Und hier ist er, Churs grosser Trumpf, den keine andere Schweizer Stadt ausspielen kann: eine Bergbahn, die mitten im Zentrum startet. Fünf Minuten vom Bahnhof, ein paar Schritte von der Altstadt – und diese Gondel schwebt dich erst aufs Känzeli, dann trägt dich die Sesselbahn weiter auf sechzehnhundert Meter, nach Brambrüesch. Oben: Wanderwege mit Blick über das Rheintal, ein Bikepark, im Winter Pisten und Schlittelwege. Die Churer sagen schlicht «mein Berg», und sie meinen es wörtlich – hier fährt man nach Feierabend hoch, so wie andere in den Park gehen. Damit schliesst sich der Kreis dieser Tour: Du bist durch fünftausend Jahre gelaufen, vom römischen Curia über Bischofsmacht und Säumerwege bis zu Giacomettis Farbfenstern – und am Ende zeigt die älteste Stadt der Schweiz, dass sie auch das Moderne am lässigsten kann: Stadt und Gipfel, ein Ticket. Wenn du Zeit hast, fahr hoch. Wenn nicht: Der Bahnhof ist fünf Minuten entfernt, und jetzt weisst du, warum man in Chur aussteigt statt durchzufahren. Bis zum nächsten Trail!",
      nearby: [
        { name: "Bergrestaurant Brambrüesch", type: "restaurant", note: "Oben auf 1600 m – Capuns mit Aussicht, falls du die Verlängerung nimmst.", address: "Brambrüesch, 7074 Malix" },
      ],
    },
  ],
};
