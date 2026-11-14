/** Rätsel pro Stopp – Grundlage für Punkte, Abzeichen und Kundenkonto. */
export type RiddleKind =
  /** Frage zur gerade gehörten/gelesenen Story (Antwort steht im Stopp-Text) */
  | "story"
  /** Etwas, das man vor Ort sehen/zählen/lesen kann (nur wenn sicher belegt) */
  | "vor-ort"
  /** Knobelfrage/Denkaufgabe mit Ortsbezug */
  | "knobel";

export interface Riddle {
  kind: RiddleKind;
  /** Frage in Du-Form, kurz und spielerisch */
  question: string;
  /** 3–4 Antwortmöglichkeiten; genau eine richtig */
  options: string[];
  /** Index der richtigen Antwort in options */
  answer: number;
  /** Hinweis, wenn man nicht weiterkommt (kostet Punkte) */
  hint: string;
  /** 1–2 Sätze Auflösung, die nach dem Antworten erscheinen */
  explanation: string;
  /** 10 = leicht, 20 = mittel, 30 = schwer */
  points: 10 | 20 | 30;
}

/** stopId → Rätsel */
export type TourRiddles = Record<string, Riddle>;
