import type { Tour } from "@/lib/types";

export const genfJetDeau: Tour = {
  slug: "genf-jet-deau",
  citySlug: "genf",
  category: "story-mode",
  name: "Genf – Wasserstrahl & Weltbühne",
  claim: "140 Meter Fontäne, Calvins Kanzel und Saunieren im See – die kosmopolitischste Ecke der Schweiz.",
  teaser:
    "Vom Jet d'eau durch die Vieille Ville mit Kathedrale und Reformationsmauer bis zu den Bains des Pâquis – Genf zwischen Weltpolitik und Seebad-Lässigkeit.",
  description:
    "Genf ist die kleinste Weltstadt der Erde: Sitz von UNO und IKRK, Geburtsort der Genfer Konventionen, Calvins «protestantisches Rom» – und gleichzeitig eine Stadt, die ihre Mittagspause im Seebad verbringt. Diese Tour verbindet beides: Du startest am Jet d'eau, dem 140-Meter-Wahrzeichen mit Pannen-Vergangenheit, steigst in die Vieille Ville zur Kathedrale, in der Calvin predigte, flanierst durch den Parc des Bastions an der Reformationsmauer vorbei – und endest dort, wo Genf am genfischsten ist: in den Bains des Pâquis, dem Volksbad mit Sauna, Buvette und dem besten Mont-Blanc-Blick der Stadt.",
  moods: ["kultur", "natur", "menschen"],
  audience: "Romandie-Einsteiger, Weltpolitik-Interessierte, Seebad-Geniesser – Genf in einem Nachmittag verstehen.",
  vibe: "International und doch intim – Diplomatenstadt mit Badehose.",
  bestTimeOfDay: "Nachmittag; Finale in den Bains zur goldenen Stunde.",
  bestSeason: "Ganzjährig – die Bains haben im Winter Sauna-Saison, der Jet pausiert nur bei Sturm und Frost.",
  difficulty: "leicht",
  durationMinutes: 160,
  distanceKm: 4.5,
  startPoint: "Jardin Anglais / Jet d'eau",
  endPoint: "Bains des Pâquis",
  publicTransport: {
    start: "Tram/Bus «Métropole» oder 10 Min. ab Gare Cornavin",
    end: "Bus 1 «Pâquis» oder 12 Min. zu Fuss nach Cornavin",
  },
  isPremium: true,
  priceChf: 4.9,
  gradient: ["#1f3a6b", "#38a5ff"],
  seo: {
    metaTitle: "Genf zu Fuss: Jet d'eau, Vieille Ville & Bains des Pâquis mit Audioguide | Urban Trails",
    metaDescription:
      "Selbstgeführte Tour durch Genf: Jet d'eau, Kathedrale St-Pierre, Reformationsmauer und das Kultbad Bains des Pâquis. 6 Stops mit Audio-Stories, Karte und Geheimtipps.",
    keywords: ["Genf Sehenswürdigkeiten zu Fuss","Genf Altstadt Rundgang","Jet d'eau Genf","Bains des Pâquis","Genf Audioguide deutsch"],
  },
  faq: [
    { question: "Läuft der Jet d'eau immer?", answer: "Fast – bei starkem Wind, Frost oder Wartung pausiert er. Tagsüber stehen die Chancen sehr gut; abends ist er beleuchtet." },
    { question: "Was kosten die Bains des Pâquis?", answer: "Der Eintritt ist symbolisch (wenige Franken), die Buvette günstig – das egalitärste Bad der Schweiz: Banker neben Studentinnen." },
    { question: "Reicht Deutsch in Genf?", answer: "Mit Englisch kommst du überall durch, Deutsch oft auch – und ein «Bonjour» öffnet jede Tür." },
  ],
  stops: [
    {
      id: "jardin-anglais",
      name: "Jardin Anglais & Blumenuhr",
      teaser: "Die Uhr aus 6500 Blumen – Genfs Gruss an seine Industrie.",
      coords: { lat: 46.2044, lng: 6.1516 },
      walkMinutesFromPrevious: 0,
      stayMinutes: 8,
      why: "Der klassische Auftakt: Seepromenade, Mont-Blanc-Brücke und die berühmteste Blumenuhr der Welt.",
      story:
        "Seit 1955 blüht im Jardin Anglais die «Horloge fleurie»: eine funktionierende Uhr aus rund 6500 Pflanzen, Hommage an die Genfer Uhrmacherkunst, die seit Calvins Schmuckverbot die Stadt ernährt – Schmuck war Sünde, Uhren waren Handwerk, und so wurden die Goldschmiede zu Uhrmachern.",
      funFact: "Der Sekundenzeiger der Blumenuhr ist mit 2,5 m einer der längsten der Welt – und die Bepflanzung wechselt mehrmals jährlich.",
      insiderTip: "Von hier hast du bereits den ersten Jet-d'eau-Blick – aber warte mit Fotos, gleich kommst du viel näher ran.",
      photoSpot: "Blumenuhr mit See im Hintergrund.",
      audioScript:
        "Willkommen in Genf – und gleich zum Auftakt eine Uhr, wie sie nur diese Stadt bauen würde: aus sechseinhalbtausend Blumen. Die Horloge fleurie tickt seit 1955 im Jardin Anglais und ehrt das Handwerk, das Genf gross machte – und das ausgerechnet einem Verbot entsprang. Als der Reformator Calvin im sechzehnten Jahrhundert Schmuck und Prunk verbot, standen die Genfer Goldschmiede vor dem Nichts. Ihre Rettung: Uhren. Die galten als nützlich, nicht als eitel. Aus den arbeitslosen Juwelieren wurden die besten Uhrmacher der Welt – Calvins Strenge schuf, ungewollt, eine Weltindustrie. Diese Pointe begleitet dich heute überall: Genf ist die Stadt der produktiven Widersprüche. Calvinistisch und genussfreudig, diplomatisch und rebellisch, Weltbühne und Badeanstalt. Den ersten Beweis siehst du schon von hier glitzern – diese weisse Säule überm See. Gehen wir näher ran.",
    },
    {
      id: "jet-deau",
      name: "Jet d'eau",
      teaser: "140 Meter Wasser – das Wahrzeichen, das als Betriebspanne begann.",
      coords: { lat: 46.2074, lng: 6.1557 },
      walkMinutesFromPrevious: 8,
      directions: "Der Promenade zum Jet-Steg (Jetée des Eaux-Vives) folgen.",
      stayMinutes: 15,
      why: "Du kannst bis fast an den Fuss des Strahls laufen – inklusive Dusch-Risiko bei Winddrehung.",
      story:
        "1886 brauchten die Wasserwerke ein Überdruckventil: Abends, wenn die Uhrenateliers ihre Wasserkraft-Maschinen abstellten, musste der Druck irgendwohin – also liess man eine Fontäne in den Himmel schiessen. Die Genfer fanden die Panne so schön, dass sie sie zum Denkmal machten: Heute pumpt der Jet 500 Liter pro Sekunde 140 Meter hoch.",
      funFact: "Das Wasser ist mit 200 km/h unterwegs; in der Luft stehen jederzeit rund 7 Tonnen Wasser – bei Winddrehung duscht der Steg.",
      insiderTip: "Auf den Steg hinauslaufen lohnt sich – Windrichtung checken, sonst gibts die Genf-Taufe gratis.",
      photoSpot: "Vom Stegansatz mit ganzer Strahlhöhe – nachmittags mit Regenbogen-Chance.",
      audioScript:
        "Hundertvierzig Meter Wasser, fünfhundert Liter pro Sekunde, zweihundert Stundenkilometer Austrittsgeschwindigkeit – und alles begann mit einer Betriebspanne. 1886 hatten die Genfer Wasserwerke ein Problem: Tagsüber trieben sie mit Wasserdruck die Maschinen der Uhrenateliers an, aber abends, wenn alle Ventile schlossen, musste der Überdruck irgendwohin. Die pragmatische Lösung: ein Ablassventil, das den Druck einfach in den Himmel jagte. Eine technische Notlösung – bis die Genfer abends am Ufer standen und fanden: eigentlich wunderschön. Also baute man die Panne zum Denkmal aus, versetzte sie prominent in den See und machte sie immer höher. Heute stehen permanent etwa sieben Tonnen Wasser in der Luft über dir. Lauf ruhig den Steg hinaus, so nah kommst du keinem Wahrzeichen dieser Grösse – aber wirf einen Blick auf die Windrichtung, sonst nimmst du ungeplant an der Genfer Taufe teil. Danach geht es hinauf in die Altstadt, zu dem Mann, der diese Stadt erfunden hat – im Guten wie im Strengen.",
    },
    {
      id: "cathedrale-st-pierre",
      name: "Cathédrale St-Pierre & Vieille Ville",
      teaser: "Calvins Kanzel – und 157 Stufen zum besten Blick über See und Mont Blanc.",
      coords: { lat: 46.2011, lng: 6.1481 },
      walkMinutesFromPrevious: 12,
      directions: "Durch die Rues Basses und die Altstadtgassen bergauf zur Kathedrale.",
      stayMinutes: 25,
      why: "Das Epizentrum der Reformation frankophoner Prägung – karg innen, gewaltig oben.",
      story:
        "Ab 1536 machte Johannes Calvin Genf zum «protestantischen Rom»: strenger als Luther, radikaler als Zwingli. In der Kathedrale predigte er fast täglich – sein schlichter Stuhl steht noch da. Die Stadt wurde Zufluchtsort für Glaubensflüchtlinge aus ganz Europa, die Know-how mitbrachten: Drucker, Bankiers, Uhrmacher. Genfs Weltläufigkeit beginnt hier.",
      funFact: "Calvin liess sich in einem anonymen Grab bestatten – Personenkult war ihm zuwider; bis heute weiss niemand exakt, wo er liegt.",
      insiderTip: "Die 157 Turmstufen kosten ein paar Franken und belohnen mit dem 360°-Blick über Altstadt, See, Jura und – bei klarem Wetter – Mont Blanc.",
      photoSpot: "Vom Nordturm über die Dächer zum See und Jet d'eau.",
      audioScript:
        "Du stehst im Epizentrum eines Bebens, das Europa umformte. 1536 übernahm Johannes Calvin diese Stadt – ein französischer Flüchtling mit eisernem Willen und einer Vision: Genf als Stadt Gottes, geregelt bis ins Detail. Tanz verboten, Schmuck verboten, Wirtshausbesuche überwacht – aber gleichzeitig: Schulen für alle, Fürsorge, eine Akademie. In dieser Kathedrale predigte er fast täglich, von einem schlichten Holzstuhl, der noch immer hier steht. Schau dich um: Der Raum ist karg, kein Gold, keine Bilder – das war Programm. Und doch machte ausgerechnet diese Strenge Genf zur Weltstadt: Aus ganz Europa flohen verfolgte Protestanten hierher – und brachten ihr Können mit. Französische Drucker, italienische Bankiers, flämische Tuchmacher. Genf wurde zum Sammelbecken der Tüchtigen, und diese DNA – Zuflucht plus Talent – trägt die Stadt bis heute, vom Roten Kreuz bis zur UNO. Wenn du Puste hast: hundertsiebenundfünfzig Stufen auf den Turm. Oben wartet der ganze See, der Jura – und an guten Tagen der Mont Blanc.",
    },
    {
      id: "bourg-de-four",
      name: "Place du Bourg-de-Four",
      teaser: "Genfs ältester Platz – römischer Markt, heute Apéro-Bühne.",
      coords: { lat: 46.2002, lng: 6.1494 },
      walkMinutesFromPrevious: 3,
      directions: "Hinter der Kathedrale die Gassen hinunter zum Platz.",
      stayMinutes: 12,
      why: "Seit 2000 Jahren Treffpunkt: erst Forum, dann Viehmarkt, heute Caféterrassen rund um den Brunnen.",
      story:
        "Auf dem Bourg-de-Four handelten schon die Römer – «Forum» steckt im Namen. Im Mittelalter kreuzten sich hier die Messerouten Europas, Hugenotten fanden in den umliegenden Häusern Unterschlupf (man erkennt die aufgestockten Etagen!), und heute ist der Platz mit seinen Terrassen das Wohnzimmer der Vieille Ville.",
      funFact: "Die Häuser am Platz wurden im 16. Jh. um mehrere Stockwerke erhöht, um Glaubensflüchtlinge unterzubringen – Verdichtung anno 1550.",
      insiderTip: "Hier den klassischen Genfer Apéro nehmen – ein Glas Chasselas vom nahen Genfersee-Weinberg, der grösste Weinkanton der Schweiz liegt vor der Tür.",
      photoSpot: "Brunnen mit Terrassen-Rund und Kathedralenturm darüber.",
      audioScript:
        "Wenn Plätze reden könnten, wäre dieser hier nicht mehr zu stoppen. Auf dem Bourg-de-Four wird seit über zweitausend Jahren gehandelt, getratscht und getrunken: Die Römer hielten hier ihr Forum ab – das Wort steckt bis heute im Namen. Im Mittelalter kreuzten sich hier die grossen Messerouten, halb Europa kam zum Feilschen vorbei. Und dann kamen die Flüchtlinge: Als die Hugenotten vor der Verfolgung aus Frankreich flohen, platzte Genf aus allen Nähten – schau an den Häusern hoch und du siehst die Lösung: Man stockte einfach auf, zwei, drei Etagen obendrauf, erkennbar an den wechselnden Fensterreihen. Verdichtetes Bauen, Ausgabe 1550. Heute ist der Platz das Wohnzimmer der Altstadt: Terrassen ums Brunnenrund, Anwälte neben Studentinnen, und ab fünf Uhr regiert der Apéro. Stilecht wäre ein Glas Chasselas – kaum jemand weiss, dass Genf der drittgrösste Weinkanton der Schweiz ist. Calvin würde die Stirn runzeln. Genau deshalb schmeckt es so gut.",
      nearby: [
        { name: "Terrassen am Bourg-de-Four", type: "cafe", note: "Klassischer Apéro-Stopp – Chasselas und People-Watching.", address: "Place du Bourg-de-Four, 1204 Genève" },
      ],
    },
    {
      id: "parc-des-bastions",
      name: "Parc des Bastions & Reformationsmauer",
      teaser: "Vier Fünf-Meter-Reformatoren und Schachfiguren im Kniehoch-Format.",
      coords: { lat: 46.2002, lng: 6.1453 },
      walkMinutesFromPrevious: 5,
      directions: "Durch die Promenade de la Treille (längste Holzbank der Welt!) in den Park hinunter.",
      stayMinutes: 15,
      why: "Das Reformationsdenkmal ist Genfs steinernes Selbstverständnis – und der Park sein lässigster Gegenentwurf.",
      story:
        "An der 100 Meter langen Mur des Réformateurs wachen Calvin, Farel, Bèze und Knox in Fünf-Meter-Format über den Park – flankiert vom Genfer Motto «Post Tenebras Lux», nach der Finsternis das Licht. Davor: Riesenschachfelder, Studierende der angrenzenden Uni, Boule-Spieler. Strenge und Spiel, friedlich vereint.",
      funFact: "Auf der Promenade de la Treille oberhalb steht die längste Holzbank der Welt (126 m) – Genfer sitzen gern mit Abstand UND zusammen.",
      insiderTip: "Eine Partie am Riesenschach mitspielen oder zuschauen – die Stammspieler kommentieren gnadenlos und herzlich.",
      photoSpot: "Frontal vor den vier Reformatoren – Menschen davor zeigen den Massstab.",
      audioScript:
        "Vier Männer aus Stein, jeder fünf Meter hoch, blicken streng über einen Park, in dem Riesenschach gespielt wird – das ist Genf in einem Bild. Die Mur des Réformateurs ehrt Calvin und seine Mitstreiter, darüber das Stadtmotto: Post Tenebras Lux, nach der Finsternis das Licht. Hundert Meter Mauer für die Idee, dass diese Stadt einst das Hauptquartier einer Weltbewegung war – von hier reiste die Reformation nach Schottland, Holland, Amerika. Und dann dreh dich um: Vor den steinernen Sittenwächtern schieben Rentner kniehohe Schachfiguren übers Feld, Studierende lümmeln im Gras, Boule-Kugeln klacken. Genf hat seine Strenge zur Geschichte erklärt und das Leben in ihren Schatten gepflanzt – eleganter kann man mit einem schweren Erbe nicht umgehen. Oben an der Parkkante übrigens, auf der Promenade de la Treille, steht die längste Holzbank der Welt: hundertsechsundzwanzig Meter. Platz für alle, auch das sehr genferisch. Jetzt zum Finale – runter ans Wasser, dorthin, wo Genf die Krawatte ablegt.",
    },
    {
      id: "bains-des-paquis",
      name: "Bains des Pâquis",
      teaser: "Das Finale: Volksbad, Sauna, Fondue – Genfs demokratischster Ort.",
      coords: { lat: 46.2114, lng: 6.1528 },
      walkMinutesFromPrevious: 18,
      directions: "Durch die Rues Basses zurück ans Ufer und über die Mont-Blanc-Brücke zur Bad-Mole.",
      stayMinutes: 30,
      why: "Auf dieser Mole trifft sich ganz Genf: Baden im Sommer, Sauna & Fondue im Winter, Jet-Blick immer.",
      story:
        "Die Bains des Pâquis (1872) sind Genfs Herzstück: ein Volksbad auf einer Mole, in den 80ern vor dem Abriss gerettet durch eine Volksabstimmung – die Genfer wählten ihr Bad. Heute: Sommer-Badi, Winter-Sauna mit Seegang-Abkühlung, legendäres Buvette-Fondue und jeden Morgen Sonnenaufgangs-Schwimmer. UNO-Diplomatin neben Velokurier, alle im selben Wasser.",
      funFact: "Das Winter-Fondue der Buvette gilt vielen als bestes der Stadt – Käse mit Seeblick schlägt Käse mit Täfelung.",
      insiderTip: "Sauna-Winterritual: Schwitzen, dann die Leiter direkt in den 7-Grad-See – danach verstehst du Genf endgültig.",
      photoSpot: "Von der Molenspitze: Jet d'eau über dem Wasser, Mont Blanc bei Klarsicht.",
      audioScript:
        "Vergiss UNO, Banken und Uhrenpaläste – wenn du Genf wirklich verstehen willst, dann hier. Die Bains des Pâquis sind ein Volksbad von 1872 auf einer Mole mitten im Hafenbecken, und sie sind der demokratischste Ort der Stadt: Eintritt symbolisch, Publikum komplett – die UNO-Diplomatin auf demselben Betonsteg wie der Velokurier, alle im selben Wasser. Als die Stadt das in die Jahre gekommene Bad in den Achtzigern abreissen wollte, taten die Genfer das Genferischste überhaupt: Sie stimmten ab. Und retteten ihr Bad mit grosser Mehrheit – Volkswille für Volksbad. Im Sommer wird hier gesprungen und gesonnt, im Winter kommt das Doppel-Ritual: Sauna auf der Mole, dann die Leiter runter in den sieben Grad kalten See – und danach das angeblich beste Fondue der Stadt in der Buvette, Käse mit Jet-d'eau-Blick. Setz dich an die Molenspitze: links die Fontäne, geradeaus bei klarem Wetter der Mont Blanc, hinter dir eine Stadt, die Weltpolitik macht und trotzdem schwimmen geht. Kleinste Weltstadt der Erde – jetzt weisst du, warum. Bis zum nächsten Trail!",
      nearby: [
        { name: "Buvette des Bains", type: "restaurant", note: "Frühstück, Plat du jour, Winter-Fondue – Kult seit Jahrzehnten.", address: "Quai du Mont-Blanc 30, 1201 Genève" },
      ],
    },
  ],
};
