import type { TourRiddles } from "@/lib/riddle-types";

export const riddles: TourRiddles = {
  "paradeplatz-spruengli": {
    kind: "story",
    question: "Woher hat das Luxemburgerli seinen Namen?",
    options: [
      "Von einem Konditor, der das Rezept aus Luxemburg mitbrachte",
      "Vom Grossherzog von Luxemburg, der es bestellte",
      "Von der Luxemburgerstrasse in Zürich",
      "Weil es zuerst in Luxemburg verkauft wurde",
    ],
    answer: 0,
    hint: "Ein junger Konditor brachte in den 1950ern etwas aus seiner Heimat mit.",
    explanation: "Das Rezept kam mit einem jungen Konditor aus Luxemburg. Sprüngli steht seit 1859 am Paradeplatz – älter als die meisten Banken ringsum.",
    points: 10,
  },
  schwarzenbach: {
    kind: "knobel",
    question: "Sprüngli kam 1859 an den Paradeplatz, Schwarzenbach eröffnete an der Münstergasse 1864. Wie viele Jahre ist Sprüngli dort länger?",
    options: ["3", "5", "9", "15"],
    answer: 1,
    hint: "1864 minus 1859.",
    explanation: "Nur 5 Jahre! Schwarzenbach wird in sechster Generation geführt und hat über 400 Sorten Trockenfrüchte, Nüsse und Gewürze.",
    points: 20,
  },
  "cafe-schober": {
    kind: "story",
    question: "Was macht die heisse Schokolade im Café Schober so besonders?",
    options: [
      "Sie wird mit Rahm aus dem Emmental serviert",
      "Sie enthält Chili und Zimt",
      "Sie wird mit echter geschmolzener Schokolade angerührt",
      "Sie wird in Bechern aus Schokolade serviert",
    ],
    answer: 2,
    hint: "Hier wird kein Pulver in Milch gerührt.",
    explanation: "Echte Schokolade schmilzt ins Kännchen – dick, dunkel, kompromisslos. Konditorei ist hier seit 1875.",
    points: 10,
  },
  "markthalle-foodtour": {
    kind: "story",
    question: "Was ist laut Guide der «heimliche Star» der Markthalle im Viadukt?",
    options: ["Der Fisch", "Der Wein", "Die Glace", "Das Brot der Hausbäckerei"],
    answer: 3,
    hint: "Sein Sauerteig hat mehr Dienstjahre als mancher Mitarbeiter.",
    explanation: "Das Brot der Hausbäckerei. Beim Käser fragst du nach der «Empfehlung der Woche» – für dein Finale.",
    points: 20,
  },
  "gerold-garten-finale": {
    kind: "story",
    question: "Was passiert mit dem Gemüse und den Kräutern aus den Hochbeeten von Frau Gerolds Garten?",
    options: [
      "Es wird auf dem Flohmarkt verkauft",
      "Es landet in der Gartenküche auf der Karte",
      "Es ist reine Dekoration",
      "Es wird an Schulen verschenkt",
    ],
    answer: 1,
    hint: "Kürzer ist keine Lieferkette der Stadt.",
    explanation: "Was in den Hochbeeten reift, steht tags darauf auf der Karte. Gestartet ist der Garten 2012 als Zwischennutzung.",
    points: 10,
  },
};
