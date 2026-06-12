import type { Tour } from "@/lib/types";

export const badenAltstadt: Tour = {
  slug: "baden-altstadt",
  citySlug: "baden",
  category: "story-mode",
  name: "Baden – Bäder, Brücke, Burgruine",
  claim: "Die Stadt, in der Europa kurte und die Eidgenossen stritten – kompakt wie ein Bilderbuch.",
  teaser:
    "Vom Stadtturm durch die Altstadt zur gedeckten Holzbrücke, hinauf zur Ruine Stein und hinunter ins Bäderquartier mit den heissesten Quellen der Schweiz.",
  description:
    "Baden ist die unterschätzteste Kurzreise der Deutschschweiz: 15 Minuten ab Zürich, und du stehst in einer Altstadt, die seit den Römern vom warmen Wasser lebt. «Aquae Helveticae» nannten sie den Ort – seine 47 Grad heissen Quellen sind bis heute die wärmsten des Landes. Dazwischen: ein Wahrzeichen-Stadtturm, eine gedeckte Holzbrücke wie aus dem Bilderbuch, eine Habsburger-Ruine mit Postkartenblick und die Geschichte der Tagsatzung, als Baden so etwas wie die heimliche Hauptstadt der alten Eidgenossenschaft war. Diese Tour packt alles in zweieinhalb Stunden – inklusive Bade-Option zum Schluss.",
  moods: ["kultur", "natur", "essen"],
  audience: "Tagesausflügler ab Zürich, Geschichts-Fans, Thermal-Geniesser – und alle, die Baden nur vom Bahnhof kennen.",
  vibe: "Gemütlich, warm (wörtlich), geschichtsgesättigt – kleine Stadt, grosse Vergangenheit.",
  bestTimeOfDay: "Vormittag bis später Nachmittag; mit Bade-Finale am Abend besonders rund.",
  bestSeason: "Ganzjährig – im Winter ist das Thermalbad-Finale unschlagbar.",
  difficulty: "leicht",
  durationMinutes: 150,
  distanceKm: 4.0,
  startPoint: "Bahnhof Baden",
  endPoint: "Bäderquartier (Thermalbad-Option)",
  publicTransport: {
    start: "Ab Zürich HB 4–6× pro Stunde, 15 Min. – einer der dichtesten Takte der Schweiz",
    end: "Vom Bäderquartier 10 Min. zu Fuss zurück zum Bahnhof",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#7a3b1f", "#38a5ff"],
  seo: {
    metaTitle: "Baden AG zu Fuss: Altstadt, Holzbrücke & Bäderquartier mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Tour durch Baden: Stadtturm, gedeckte Holzbrücke, Ruine Stein und die heissesten Thermalquellen der Schweiz. 6 Stops, Karte, Audio-Stories und Geheimtipps – 15 Minuten ab Zürich.",
    keywords: [
      "Baden AG Sehenswürdigkeiten",
      "Baden Altstadt Rundgang",
      "Baden Bäderquartier Therme",
      "Holzbrücke Baden",
      "Tagesausflug ab Zürich",
    ],
  },
  faq: [
    {
      question: "Lohnt sich Baden als Tagesausflug ab Zürich?",
      answer:
        "Absolut – 15 Bahnminuten, und du bekommst Altstadt, Burgruine, Flusslandschaft und Thermalbad in einem Nachmittag. Das beste Verhältnis von Anreise zu Erlebnis weit und breit.",
    },
    {
      question: "Soll ich Badesachen mitnehmen?",
      answer:
        "Ja! Das Finale liegt direkt beim Thermalbad – 47 Grad heisses Quellwasser, gemischt auf Wohlfühltemperatur. Der perfekte Abschluss, besonders im Winter.",
    },
    {
      question: "Ist die Tour kinderwagentauglich?",
      answer:
        "Grösstenteils – nur der kurze Aufstieg zur Ruine Stein hat Treppen. Er lässt sich auslassen, der Blick lohnt sich aber.",
    },
    {
      question: "Wo isst man gut?",
      answer:
        "In der Altstadt zwischen Stadtturm und Holzbrücke reihen sich Cafés und Beizen; konkrete Tipps stehen bei den Stops.",
    },
  ],
  stops: [
    {
      id: "baden-bahnhof",
      name: "Bahnhof Baden",
      teaser: "Der älteste Bahnhof-Standort der Schweiz – hier begann 1847 das Bahnzeitalter.",
      coords: { lat: 47.4763, lng: 8.307 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 5,
      why: "Startpunkt mit Symbolkraft: Die erste Eisenbahn der Schweiz fuhr von Zürich genau hierher.",
      story:
        "1847 dampfte die «Spanisch-Brötli-Bahn» als erste Schweizer Eisenbahn von Zürich nach Baden – benannt nach dem Blätterteiggebäck, das Zürcher Herrschaften so liebten, dass sich die Anreise lohnte. Die Fahrt dauerte 45 Minuten; heute schafft es die S-Bahn in 15. Baden war damit früher ans Schienennetz angeschlossen als fast jede andere Stadt des Landes – der Kurtourismus verlangte es.",
      funFact:
        "Die «Spanisch-Brötli-Bahn» hiess offiziell Schweizerische Nordbahn – aber der Gebäck-Übername setzte sich durch und hält sich seit über 175 Jahren.",
      insiderTip:
        "Ein Spanisch Brötli gibt es heute wieder: in Badener Bäckereien als Hommage – probier eins als Tour-Proviant.",
      photoSpot: "Bahnhofplatz Richtung Altstadt – Stadtturm schon im Blick.",
      audioScript:
        "Willkommen in Baden – und du stehst hier auf historischem Boden, bevor du auch nur einen Schritt gemacht hast. 1847 fuhr von Zürich hierher die allererste Eisenbahn der Schweiz. Ihr offizieller Name: Schweizerische Nordbahn. Ihr echter Name, bis heute: die Spanisch-Brötli-Bahn. Der Grund ist herrlich schweizerisch: In Baden gab es ein Blätterteiggebäck, die Spanischen Brötli, nach denen die feine Zürcher Gesellschaft verrückt war. Vor der Bahn mussten Dienstboten nachts losmarschieren, um die Dinger frisch nach Zürich zu bringen. Die Eisenbahn löste also zuallererst ein Gebäck-Logistikproblem. Fünfundvierzig Minuten dauerte die Fahrt damals, fünfzehn heute – und Baden war damit früher am Schienennetz als fast jede andere Stadt der Schweiz. Warum, siehst du auf dieser Tour: Diese kleine Stadt war ein europäischer Kurort und die heimliche Hauptstadt der alten Eidgenossenschaft. Los geht's, der Stadtturm wartet.",
    },
    {
      id: "baden-stadtturm",
      name: "Stadtturm",
      teaser: "Das Wahrzeichen: 56 Meter Torturm mit astronomischer Uhr.",
      coords: { lat: 47.4734, lng: 8.306 },
      walkMinutesFromPrevious: 5,
      directions: "Vom Bahnhofplatz die Badstrasse hinauf Richtung Altstadt – der Turm ist nicht zu verfehlen.",
      stayMinutes: 10,
      why: "Eines der schönsten Stadttore der Schweiz – und das Selfie-Motiv von Baden.",
      story:
        "Der Stadtturm von 1445 war Wehrturm, Stadttor, Gefängnis und Uhrenträger in einem. Sein spätgotischer Helm mit den vier Ecktürmchen und die bemalte Fassade machen ihn zum meistfotografierten Bauwerk der Region. Durch sein Tor lief jahrhundertelang der gesamte Verkehr zwischen Zürich und dem Westen – wer nach Baden wollte, kam an diesem Turm nicht vorbei. Wörtlich.",
      funFact:
        "Im Turm sassen einst Gefangene direkt über dem Tor – sie konnten dem Stadtleben unter sich zuhören, ohne teilzunehmen. Raffinierte mittelalterliche Strafverschärfung.",
      insiderTip:
        "Durch das Tor und sofort umdrehen: Die bemalte Innenseite mit Wappen übersehen die meisten.",
      photoSpot: "Von der Badstrasse frontal auf Turm und Gasse – klassischer geht's nicht.",
      audioScript:
        "Da steht es, das Postkartenmotiv: der Stadtturm, seit 1445 der Türsteher von Baden. Sechsundfünfzig Meter Sandstein, ein spätgotischer Helm mit vier Ecktürmchen, astronomische Uhr, bemalte Fassade – dieser Turm wollte nie nur nützlich sein, er wollte beeindrucken. Und musste er auch: Durch sein Tor lief der komplette Verkehr zwischen Zürich und dem Westen der Eidgenossenschaft. Jeder Kaufmann, jeder Gesandte, jeder Kurgast – alle mussten hier durch, und alle sollten beim Durchreiten spüren: Baden ist wohlhabend, Baden ist wichtig. Der Turm war übrigens auch Gefängnis, und zwar mit psychologischem Feinschliff: Die Zellen lagen direkt über dem Tor. Die Gefangenen hörten das Markttreiben, das Lachen, die Musik – nur eben von oben, ausgeschlossen. Geh jetzt durchs Tor und dreh dich gleich um: Die bemalte Innenseite verpassen fast alle. Dahinter beginnt die Altstadt – und die ist ein einziges Freilichtmuseum mit Beizen.",
      nearby: [
        {
          name: "Cafés in der Weiten Gasse",
          type: "cafe",
          note: "Die Gasse hinter dem Turm ist Badens Flaniermeile – fürs Spanisch Brötli zum Kaffee.",
          address: "Weite Gasse, 5400 Baden",
        },
      ],
    },
    {
      id: "baden-tagsatzung",
      name: "Altstadt & Tagsatzungs-Erbe",
      teaser: "Hier regierte die alte Eidgenossenschaft – zwischen Kur und Konferenz.",
      coords: { lat: 47.4727, lng: 8.3077 },
      walkMinutesFromPrevious: 4,
      directions: "Durch die Weite Gasse zur Mittleren Gasse schlendern – Zeit lassen.",
      stayMinutes: 15,
      why: "Badens grosse Pointe: Die kleine Kurstadt war fast 300 Jahre lang Tagungsort der Eidgenossenschaft.",
      story:
        "Von 1426 bis 1712 trafen sich die Gesandten der eidgenössischen Orte regelmässig in Baden zur Tagsatzung – dem höchsten politischen Gremium der alten Schweiz. Warum ausgerechnet hier? Zentral gelegen, gut erreichbar, und: Es gab heisse Bäder. Politik am Vormittag, Kur am Nachmittag – die Diplomatie hat sich nie wieder so komfortabel organisiert. Im Rathaus an der Halde wurde verhandelt, in den Badgasthöfen intrigiert.",
      funFact:
        "Selbst der Westfälische Friede wurde in Baden nachverhandelt: 1714 endete hier mit dem «Frieden von Baden» ein europäischer Krieg – die Stadt war kurz Weltbühne.",
      insiderTip:
        "Im Innenhof des Rathauses (Halde) hängt die Tafel zur Tagsatzung – der unscheinbarste «Bundesplatz» der Schweizer Geschichte.",
      photoSpot: "Mittlere Gasse aufwärts mit Fassaden und Wirtshausschildern.",
      audioScript:
        "Schlendere durch diese Gassen und stell dir vor: Fast dreihundert Jahre lang war dieses Städtchen so etwas wie die Hauptstadt der Schweiz. Von 1426 bis 1712 trafen sich hier die Gesandten aller eidgenössischen Orte zur Tagsatzung – dem höchsten Gremium der alten Eidgenossenschaft. Bern, Zürich, Luzern, Uri – alle schickten ihre Leute nach Baden. Und warum hierher? Die offizielle Antwort: zentrale Lage. Die ehrliche Antwort: die Bäder. Vormittags wurde im Rathaus verhandelt, nachmittags lag man gemeinsam im warmen Quellwasser, und abends wurde in den Badgasthöfen weiterintrigiert. Die Geschichte ging sogar europäisch weiter: 1714 wurde hier der Friede von Baden geschlossen, ein Nachspiel des Spanischen Erbfolgekriegs – für einen Moment schaute der ganze Kontinent auf diese Gassen. Heute schaut hier niemand mehr her, und genau das macht den Charme aus: grosse Geschichte, null Rummel. Weiter zur Limmat – die schönste Brücke der Region wartet.",
    },
    {
      id: "baden-holzbruecke",
      name: "Gedeckte Holzbrücke & Landvogteischloss",
      teaser: "Das Bilderbuch-Motiv: Holzbrücke von 1810, dahinter der trutzige Schlossturm.",
      coords: { lat: 47.4753, lng: 8.3092 },
      walkMinutesFromPrevious: 5,
      directions: "Den Gassen abwärts zur Limmat folgen – die Brücke liegt am Fuss der Altstadt.",
      stayMinutes: 15,
      why: "Eine der schönsten gedeckten Brücken der Schweiz – und der beste Fotospot der Stadt.",
      story:
        "Seit dem Mittelalter quert hier eine Brücke die Limmat; die heutige gedeckte Holzkonstruktion stammt von 1810. Am anderen Ufer wacht das Landvogteischloss, in dem von 1415 bis 1798 die eidgenössischen Landvögte residierten – heute beherbergt es das Historische Museum. Brücke, Fluss, Schloss und Altstadtkulisse ergeben zusammen das Postkartenbild, für das Baden berühmt sein müsste.",
      funFact:
        "Im Brückeninnern siehst du das nackte Holztragwerk von 1810 – gebaut ganz ohne Stahl, und es trägt seit über 200 Jahren.",
      insiderTip:
        "Unter die Brücke ans Limmatufer steigen: Von dort unten ist das Ensemble mit Schloss am eindrücklichsten – kaum jemand macht das.",
      photoSpot: "Vom rechten Limmatufer flussabwärts: Brücke, Schloss und Altstadt in einer Achse.",
      audioScript:
        "Bleib in der Mitte der Brücke kurz stehen und schau nach oben: Dieses hölzerne Tragwerk über dir arbeitet seit 1810 – ohne einen einzigen Stahlträger. Mehr als zweihundert Jahre Wind, Wetter und Fussvolk, und die Konstruktion trägt, als wäre nichts. Gedeckte Brücken wie diese baute man übrigens nicht wegen der Fussgänger: Das Dach schützt das Tragwerk selbst – Holz, das trocken bleibt, lebt praktisch ewig. Am anderen Ufer wartet der trutzige Turm des Landvogteischlosses. Dort sassen fast vierhundert Jahre lang die Landvögte der Eidgenossen – die Statthalter, die im Namen der Orte regierten und kassierten. Heute residiert dort friedlich das Historische Museum. Mein Tipp für gleich: Steig am Ufer die Treppe hinunter und schau dir das Ensemble von unten an – Brücke, Schloss, Altstadtkulisse über dem grünen Fluss. Es ist das beste Bild der Stadt, und du wirst es fast sicher alleine haben. Danach geht's bergauf: Die Ruine ruft.",
    },
    {
      id: "baden-ruine-stein",
      name: "Ruine Stein",
      teaser: "Habsburger-Trotzburg über den Dächern – mit dem besten Blick auf Stadt und Limmatknie.",
      coords: { lat: 47.4744, lng: 8.3037 },
      walkMinutesFromPrevious: 12,
      directions: "Zurück durch die Altstadt und den beschilderten Treppenweg zur Ruine hinauf (ca. 10 Min. Aufstieg).",
      stayMinutes: 15,
      why: "Der Aussichtspunkt der Tour: ganz Baden, das Limmatknie und die Lägern zu Füssen.",
      story:
        "Auf dem Felssporn über der Stadt thronte einst eine der wichtigsten Burgen der Habsburger – hier lagerte zeitweise ihr Archiv, hier sicherten sie ihre Stammlande. 1415 eroberten die Eidgenossen Baden und schleiften die Burg; was die Berner Sprengmeister 1712 übrig liessen, steht heute als romantische Ruine im Abendlicht. Die Aussichtsplattform macht den Aufstieg mit dem besten Panorama des Tages wett.",
      funFact:
        "Die Burg wurde gleich zweimal zerstört: 1415 von den siegreichen Eidgenossen, und die wiederaufgebauten Reste 1712 im Zweiten Villmergerkrieg – Baden lag einfach zu strategisch.",
      insiderTip:
        "Abends ist die Ruine beleuchtet und frei zugänglich – mit Blick auf die glitzernde Stadt einer der romantischsten Orte des Aargaus.",
      photoSpot: "Von der Plattform über Stadtturm und Limmatknie – das Panorama-Finale.",
      audioScript:
        "Geschafft – und dieser Blick ist den Aufstieg wert: Unter dir liegt ganz Baden, der Stadtturm, die Dächer, das elegante Knie, das die Limmat um die Altstadt zieht, dahinter der lange Rücken der Lägern. Du stehst auf den Resten einer Habsburger-Festung – und ihre Geschichte erzählt, wie die Schweiz wurde, was sie ist. Die Habsburger, deren Stammburg nur ein paar Kilometer von hier steht, sicherten mit dieser Anlage ihre Kernlande; zeitweise lagerte hier sogar ihr Archiv. Dann kam 1415: Die Eidgenossen eroberten den Aargau, nahmen Baden ein und schleiften die Burg ihrer alten Herren – Machtwechsel, in Stein dokumentiert. Was wieder aufgebaut wurde, sprengten Berner Truppen 1712 endgültig. Seither ist die Ruine das, was sie heute Abend für dich ist: ein Aussichtsbalkon mit Geschichte. Geniess das Panorama – danach geht es hinunter zum eigentlichen Schatz dieser Stadt: dem heissen Wasser.",
    },
    {
      id: "baden-baederquartier",
      name: "Bäderquartier",
      teaser: "Das Finale: 47 Grad heisse Quellen – die wärmsten der Schweiz, seit den Römern in Betrieb.",
      coords: { lat: 47.479, lng: 8.3133 },
      walkMinutesFromPrevious: 15,
      directions: "Hinunter und der Limmat flussabwärts folgen – das Bäderquartier liegt an der Flussbiegung.",
      stayMinutes: 30,
      why: "Der Grund, warum es Baden überhaupt gibt – und die beste Belohnung für 4 km Stadtgeschichte.",
      story:
        "«Aquae Helveticae» gründeten die Römer um das Jahr 20 – wegen der 18 Quellen, die hier mit 47 Grad aus dem Boden schiessen, die heissesten der Schweiz. Seither kurte hier halb Europa: römische Legionäre, Tagsatzungs-Gesandte, Casanova, Hermann Hesse. Nach Jahrzehnten des Dornröschenschlafs hat das von Mario Botta entworfene Thermalbad «Fortyseven» dem Quartier 2021 neues Leben eingehaucht – der Name ist Programm.",
      funFact:
        "Hermann Hesse kurte mehrfach wochenlang in Baden und schrieb darüber das ironische Büchlein «Kurgast» – das Bäderquartier hat einen Literaturnobelpreisträger als Stammgast in den Akten.",
      insiderTip:
        "Beim «Heissen Brunnen» am Kurplatz kannst du gratis die Hände ins 47-Grad-Quellwasser halten – und im Fortyseven mit Badesachen das Ganzkörper-Upgrade nehmen.",
      photoSpot: "Limmatufer beim Bäderquartier: Botta-Bau, Fluss und Hangwald im Abendlicht.",
      audioScript:
        "Riechst du es? Dieser Hauch von Schwefel in der Luft ist der Grund, warum diese Stadt existiert. Achtzehn Quellen schiessen hier mit siebenundvierzig Grad aus der Erde – das heisseste Wasser der Schweiz, und das seit Jahrtausenden. Die Römer gründeten dafür um das Jahr zwanzig «Aquae Helveticae», die Legionäre des Legionslagers Vindonissa kurierten hier ihre Knochen. Später lag halb Europa in diesen Becken: die Gesandten der Tagsatzung, Casanova auf Durchreise, und Hermann Hesse gleich mehrfach wochenlang – sein spöttisches Büchlein «Kurgast» ist die beste Werbung, die nie eine sein wollte. Heute trägt das neue Thermalbad den Namen der Quellen: Fortyseven, entworfen von Mario Botta, ein Wellnessschiff direkt an der Limmat. Und jetzt du: Am Heissen Brunnen drüben kannst du gratis die Hände ins Quellwasser halten – oder du hast Badesachen dabei und gönnst dir das volle Finale. Vier Kilometer, zweitausend Jahre, ein heisses Bad. Besser endet ein Tagesausflug nicht. Bis zum nächsten Trail!",
      nearby: [
        {
          name: "Fortyseven Wellness-Therme",
          type: "restaurant",
          note: "Das Botta-Thermalbad direkt an der Limmat – Tageseintritt, Badesachen mitbringen.",
          address: "Bäderstrasse 22, 5400 Baden",
        },
      ],
    },
  ],
};
