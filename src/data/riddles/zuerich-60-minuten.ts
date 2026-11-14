import type { TourRiddles } from "@/lib/riddle-types";

export const riddles: TourRiddles = {
  "hb-blitzstart": {
    kind: "knobel",
    question: "Der Schutzengel hängt seit 1997 im HB. Wie viele Jahre schwebt sie im Jahr 2026 schon über den Pendlern?",
    options: ["19", "25", "29", "39"],
    answer: 2,
    hint: "2026 minus 1997.",
    explanation: "29 Jahre – und die meisten Pendler haben die 1.2 Tonnen schwere Dame mit den Goldflügeln noch nie bemerkt.",
    points: 10,
  },
  "lindenhof-express": {
    kind: "story",
    question: "Welche Häuserzeile siehst du direkt unter dem Lindenhof am Wasser – deinen nächsten Stop?",
    options: ["Die Schipfe", "Das Niederdorf", "Die Augustinergasse", "Den Limmatquai"],
    answer: 0,
    hint: "Hier legten früher die Schiffe an.",
    explanation: "Die Schipfe liegt direkt unter dir. Der Lindenhof ist dein Lageplan: rechts die Grossmünster-Türme, hinten der See.",
    points: 10,
  },
  "schipfe-express": {
    kind: "story",
    question: "Mit welchem Material wurde Zürich laut Guide zum ersten Mal reich – lange vor den Banken?",
    options: ["Mit Salz", "Mit Wolle", "Mit Seide", "Mit Eisen"],
    answer: 2,
    hint: "Die Färber spülten diesen edlen Stoff direkt in der Limmat.",
    explanation: "Die Seidenindustrie machte Zürich reich – und die Limmat schimmerte je nach Auftrag rot, blau oder violett.",
    points: 20,
  },
  "muensterbruecke-grossmuenster-express": {
    kind: "story",
    question: "Wie nennen die Zürcher die beiden Grossmünster-Türme liebevoll?",
    options: ["Salzstreuer", "Zuckerhüte", "Kerzenständer", "Pfeffermühlen"],
    answer: 3,
    hint: "Ein Küchenutensil zum Würzen.",
    explanation: "«Pfeffermühlen» – einmal gehört, nie mehr anders gesehen. Hier predigte Zwingli ab 1519 auf Deutsch statt Latein.",
    points: 10,
  },
  "bellevue-express": {
    kind: "story",
    question: "Wo gibt es laut Guide beim Bellevue die berühmteste Bratwurst des Landes?",
    options: ["In der Kronenhalle", "Am Sternen Grill", "Im Zeughauskeller", "Am Bürkliplatz-Kiosk"],
    answer: 1,
    hint: "Ein Grill mit himmlischem Namen.",
    explanation: "Der Sternen Grill – Bratwurst mit scharfem Senf, im Stehen. Mehr Zürich pro Minute gibt es nirgends.",
    points: 10,
  },
};
