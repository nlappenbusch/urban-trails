# Urban Trails – Plan «vom Prototyp zum fertigen Produkt»

Stand: 15.11.2026, Commit `1ff25ab` (live auf https://urban-trails.ch).

**Fortschritt:** Pakete 1–3 live (Commit `bc3b54c`), Paket 4 live (`2341f1a`), SEO-Grundlagen live (`6c60572`: Vorschaubilder, JSON-LD, Stadtseiten mit Sehenswürdigkeiten). Offen: Pakete 5–7, Google Search Console (braucht Nils' Google-Konto; DNS-TXT kann per `serv1_dns_ensure` gesetzt werden).

## Rahmen für die Umsetzung

- Projekt: `C:\Users\Nils\Documents\Claude\Projects\city-guide2` (Repo `nlappenbusch/urban-trails`).
- Deploy nur über `main`: `git push origin HEAD:main` (lokaler Branch heisst `codex/frankenthal-offline-gps`), dauert 2–3 Minuten. Danach jede geänderte Seite per Abruf prüfen.
- Vor jedem Push: `npx tsc --noEmit` und `node --test tests/travel.test.cjs` (15 Tests).
- Lokale Vorschau: Eintrag `urban-trails` in `C:\.claude\launch.json` (Port 3055).
- Das Farbschema ist hell, obwohl die Klassen `ink-*`/`cream` heissen: `ink` = helle Flächen, `cream` = dunkler Text (`tailwind.config.ts`).
- Nicht anfassen: Audio-Erzeugung (`src/lib/audio-server.ts`), Konto-API, Spielstand-Logik. Die funktionieren und sind getestet.

## Entscheidungen (Punkt 1 entschieden, 2 und 3 offen)

1. **Bezahlen oder gratis?** ENTSCHIEDEN am 15.11.2026: alles gratis, Geld später über Partner. Paket 2 gilt wie beschrieben. Begründung: Es gibt heute gar keine Bezahlschranke, 17 von 24 Touren tragen nur ein «CHF 4.90»-Etikett, hinter dem nichts passiert. Das wirkt unfertig und schreckt ab, ohne einen Franken einzubringen. Geld später über Partner (siehe Paket 7). Der Plan unten geht von «alles gratis» aus.
2. **Wer ist der Betreiber?** Impressum und vollständige Datenschutzerklärung fehlen (steht so sogar auf `/datenschutz`). Ohne Name, Adresse und Kontakt ist es kein fertiges Produkt. Nils muss die Angaben liefern (Nerd-IT? Privat?).
3. **Frankenthal-Seite** (`/frankenthal`): bleibt als nicht verlinkte Pitch-Vorschau, oder raus aus dem Produkt? Empfehlung: bleibt, aber weiter ohne Link im Menü.

## Was gut ist und bleibt

- Inhalt: 24 Touren, 170 Stopps, Texte mit eigener Stimme, Geheimtipps mit Adresse, Social-Check. Das ist der eigentliche Wert.
- Echte Sprecherstimme für jeden Stopp, Klangkulisse, Navi-Modus, Rätsel, Punkte, Konto.
- Markenkern: Orange `#ff4d00`, Schrift Bricolage Grotesque, der Satz «Die Stadt ist kein Museum.», der freche Ton.
- Tourkarten mit Foto, Tour-Explorer mit Filtern, Vollbildkarte.

## Was schlecht ist (gemessen auf der Live-Seite, Handy 375 px)

| Problem | Befund |
|---|---|
| Touren kommen zu spät | Erste Tourkarte auf der Startseite bei 4181 px, also gut fünf Bildschirme tief. Der Hero allein ist 1050 px hoch. |
| Laufband unlesbar | 340 Einträge (alle 170 Stoppnamen doppelt), 87 201 px breit, läuft in 28 s durch: rund 1550 px pro Sekunde. |
| Preis-Abschnitt falsch | «Was kostet der Spass?» verspricht «Browser-Audio» (ausgebaut), «Studio-Audio», Premium CHF 4.90. Stimmt alles nicht mehr. |
| Schwebende Leiste | Die Tour-Leiste unten ist auf der ganzen Tourseite fix sichtbar, auch über Hero, FAQ und Footer. Der Footer hat unten keinen Abstand, die Leiste verdeckt seine letzten Zeilen. Höhe springt, sobald der Mini-Player dazukommt. |
| Striche links | Fun Fact, Insider und Fotospot haben einen 4-px-Strich links: `StopTimeline.tsx` Zeilen 116/120/127 und `TourMap.tsx` Zeilen 325/331/338. |
| Seiten endlos lang | Tourseite Solothurn 22 100 px, Startseite 18 200 px auf dem Handy. Jeder Stopp zeigt alles ausgeklappt. |
| Emojis als Icons | 📍 🧭 🗺 💎 ⏱ 👣 ✨ 🎉 🚏 🏁 in 9 Dateien. Sieht auf jedem Handy anders aus und wirkt billig. |
| Fotos fremdgeladen | 180 Bilder kommen direkt von `upload.wikimedia.org` in 1280 px, auch für 64-px-Vorschauen. Langsam, und bei Abruflimit von Wikimedia bleiben Flächen leer. |
| Doppelter Seitentitel | «… \| Urban Trails \| Urban Trails Switzerland» bei Touren, deren `metaTitle` schon «\| Urban Trails» enthält (beide Solothurn-Touren, weitere prüfen). |

## Was nach KI aussieht und weg soll

- Die Striche links an den Kästen (siehe oben).
- Stempel-Etiketten in Versalien über jedem Kasten («FUN FACT», «INSIDER», «SOCIAL-CHECK») und Kicker-Zeilen über jeder Überschrift («Kein Blabla – so sieht das wirklich aus», «Handgemacht, nicht zusammengeklickt», «Fairer Deal», «Gebaut als Plattform»). Eine pro Seite reicht.
- Jede Überschrift hat ein orange unterlegtes, schräg gestelltes Wort. Als Stilmittel einmal pro Seite stark, bei jeder Überschrift Masche.
- Zahlenkachel-Raster im Hero (Touren / Stops / Geheimtipps / km) und die «01 02 03»-Schritte.
- Schräg gestapelte Polaroid-Fotos.
- Der Kachel-Abschnitt «Was bei jedem Stop drinsteckt» mit sechs gleich aussehenden Karten, darunter eine Attrappe eines Fortschrittsbalkens («7/12 Stops») und ein gestellter Chat.
- Karten, die beim Überfahren hochspringen und das Bild zoomen (`TourCard.tsx`).
- Sätze, die sich selbst loben: «Stoff, mit dem du beim nächsten Apéro glänzt – garantiert», «Weniger als ein Glas Wein im Niederdorf».
- Laufband mit ✦-Trennern.

---

## Arbeitspakete (in dieser Reihenfolge)

### Paket 1 – Startseite: direkt zu den Touren  *(grösster Hebel)*
Datei: `src/app/page.tsx`

- Hero auf höchstens einen halben Handybildschirm kürzen: Überschrift «Die Stadt ist kein Museum.» kleiner (Handy ca. `text-4xl`, Desktop ca. `text-6xl`), ein Satz darunter, fertig. Stempelzeile, Zahlenraster, Polaroids und Foto-Streifen entfernen.
- Direkt darunter die Tourauswahl: zuerst eine Zeile Stadt-Chips (alle 16 Destinationen, horizontal wischbar), dann die Tourkarten. Auf dem Handy muss die erste Tourkarte ohne Scrollen angeschnitten sichtbar sein.
- «Überrasch mich» wird ein Knopf neben den Stadt-Chips, kein eigener Schlussblock.
- Laufband ersatzlos streichen. Falls Nils eines behalten will: nur die 16 Stadtnamen, mindestens 60 s Umlaufzeit, stoppt bei `prefers-reduced-motion`.
- Abschnitte «Was bei jedem Stop drinsteckt», «01/02/03», «Was kostet der Spass?», «Eine Stadt nach der anderen» und der orange Schlussblock raus. Ersatz: ein kurzer Abschnitt unter den Touren mit einem echten Hörbeispiel (Player eines Stopps) und drei Sätzen, wie es funktioniert.
- Fertig, wenn: erste Tourkarte auf 375×812 bei unter 700 px beginnt, Seite auf dem Handy unter 9000 px hoch ist, kein Preis und kein «Browser-Audio» mehr vorkommt.

### Paket 2 – Alles gratis
Dateien: `TourCard.tsx`, `TourExplorer.tsx`, `src/app/[city]/[tour]/page.tsx`, `src/app/destinationen/page.tsx`, `src/app/page.tsx`, `src/lib/seo.ts`, FAQ-Texte in den Tour-Dateien.

- Preis- und «Gratis»-Etiketten auf Karten und Tourseite entfernen, Preisfilter im Explorer entfernen, Zähler «x gratis» auf der Destinationsseite entfernen.
- `isPremium`/`priceChf` im Datenmodell stehen lassen (für später), nur nicht mehr anzeigen.
- FAQ-Antworten und strukturierte Daten (`seo.ts`) auf Preisangaben durchsuchen und bereinigen. Suche: `Premium`, `CHF 4`, `gratis`, `kostenlos`.
- Fertig, wenn: `grep -ri "CHF 4\|Premium"` in `src/app` und `src/components` nichts Sichtbares mehr findet.

### Paket 3 – Tourseite fürs Handy aufräumen
Dateien: `StopTimeline.tsx`, `TourMap.tsx`, `Footer.tsx`, `src/app/[city]/[tour]/page.tsx`

- **Leiste unten:** erst einblenden, wenn der Abschnitt «Stop für Stop» im Bild ist, und wieder ausblenden, sobald FAQ/Footer erreicht sind (IntersectionObserver). Feste Höhe, Mini-Player in derselben Zeile statt als zweite Zeile. Footer bekommt unten Abstand in Höhe der Leiste plus `env(safe-area-inset-bottom)`. Statt `backdrop-blur` eine deckende Fläche (Blur flackert beim Scrollen in iOS Safari).
- **Striche links:** an allen sechs Stellen entfernen. Fun Fact, Insider und Fotospot als schlichte Absätze mit fett gesetztem Wort am Anfang («Insider: …»), ohne Kasten.
- **Stopp-Karten kürzen:** sichtbar bleiben Foto, Name, Teaser, Player, Rätsel, «Navigation», «Abhaken». Story, Fun Fact, Insider, Fotospot, In der Nähe und Social-Check kommen in einen aufklappbaren Bereich «Mehr zum Ort». Ziel: Tourseite auf dem Handy unter 12 000 px.
- **Kopf der Tourseite:** Hero flacher, die vier Kennzahlen in eine Zeile, «Navi starten» bleibt der eine Hauptknopf.
- **Player-Zeile:** auf 375 px quetschen sich Play-Knopf, Text und «Kulisse an». Schalter als Icon-Knopf mit Beschriftung für Screenreader.
- Fertig, wenn: Leiste verdeckt nirgends Inhalt, kein `border-l-4` mehr im Projekt, Screenshots von Tourseite oben/Mitte/unten auf 375 px sehen sauber aus.

### Paket 4 – Einheitliche Gestaltung
Dateien: `globals.css`, alle Komponenten

- Emojis durch ein Icon-Set ersetzen (Vorschlag: `lucide-react`, nur die benötigten Icons importieren). Betrifft Karten-Metazeile, Knöpfe, Statuszeile, Menü, Kategorien.
- Regeln festlegen und überall anwenden: ein Eckenradius für Karten, einer für Knöpfe; zwei Knopfarten (gefüllt, Umriss); eine Etikett-Art statt `stamp`, `stamp-orange`, `chip`, `kicker` nebeneinander.
- Orange unterlegtes Wort nur noch in der Hauptüberschrift jeder Seite.
- Hover-Effekte der Karten auf eine ruhige Rahmenfarbe reduzieren, kein Hochspringen, kein Bildzoom.
- Klassen `ink`/`cream` in `surface`/`text` umbenennen ist wünschenswert, aber riskant (alle Dateien betroffen). Nur machen, wenn Zeit bleibt, in einem eigenen Commit.
- Texte durchgehen: Eigenlob-Sätze streichen, «Stops» und «Stopps» vereinheitlichen (Vorschlag: «Stopps»), doppelte Seitentitel beheben (`| Urban Trails` aus den `metaTitle` der Tour-Dateien entfernen, das Layout hängt den Namen selbst an).

### Paket 5 – Fotos selbst ausliefern
Dateien: `src/data/images.ts`, neues Skript, `public/img/`

- Skript, das alle 180 Wikimedia-Bilder einmal herunterlädt, in zwei Grössen (ca. 480 und 1200 px breit) als WebP unter `public/img/` ablegt und `images.ts` auf die lokalen Pfade umstellt. Quellenlink zur Commons-Seite bleibt (Lizenzpflicht).
- `<img>` bekommt `width`/`height` und `srcset`, damit beim Laden nichts springt.
- Beim Download Wikimedia schonend abfragen (nacheinander, mit Pause), sonst gibt es Sperren. Drei Solothurn-Stopps haben noch kein Foto: `so-schluchteingang`, `so-verenaschlucht`, `so-kreuzen`.
- Fertig, wenn: keine Anfrage mehr an `upload.wikimedia.org` geht und jede Stopp-Karte ein Bild oder einen sauberen Farbverlauf zeigt.

### Paket 6 – Produktreife
- Impressum-Seite und vollständige Datenschutzerklärung (wartet auf Entscheidung 2). Hinweissatz «muss vor Veröffentlichung ergänzt werden» auf `/datenschutz` entfernen.
- Eigene 404-Seite prüfen, Fehlerseite (`error.tsx`) ergänzen.
- Teilen-Vorschaubild (Open Graph) pro Tour mit dem Titelfoto.
- App-Icon und Name für «Zum Startbildschirm hinzufügen» prüfen (`manifest.ts`, `public/app-icon.svg`).
- Konto: Es gibt kein «Passwort vergessen». Entweder optionales E-Mail-Feld mit Rücksetz-Mail (Mailcow ist vorhanden) oder klarer Hinweis bleibt. Empfehlung: für jetzt lassen.
- Abschluss: Lighthouse-Lauf mobil für Startseite und eine Tourseite, alle Seiten und Unterseiten-Links per Abruf auf Status 200 prüfen.

### Paket 7 – Geld verdienen über Partner *(später, nur vorbereiten)*
Noch nichts bauen, nur das Datenmodell offen halten:
- «In der Nähe»-Tipps können ein Feld `partner` bekommen (gekennzeichnet als «Partner», mit Angebot/Gutscheincode). Kennzeichnung ist Pflicht.
- Tourismusorganisationen und Städte als Auftraggeber eigener Touren (Muster Frankenthal-Ausschreibung).
- Lokale Betriebe als Rätsel- oder Abzeichen-Sponsor («Löse alle Rätsel, hol dir einen Kaffee bei …»).
- Dafür braucht es Zahlen: einfache, cookielose Zählung der Tourstarts und abgeschlossenen Touren einbauen, damit man Partnern etwas zeigen kann.

---

## Offene Punkte aus der letzten Runde

- GPS-Führung im Navi und Klang der Kulisse sind noch nie am echten Handy getestet. Rückmeldung von Nils aus Solothurn einholen, bevor am Navi gestaltet wird.
- Solothurn-Routen sind recherchiert, nicht begangen.
- Im Eglisau-Insider-Tipp stehen «Grabplatten an der Mauer», ungeprüft.
- `AGENTS.md` im Projekt ist leer und nicht eingecheckt.

## Reihenfolge und Umfang

Pakete 1 bis 3 zuerst, sie beheben alles, was Nils konkret genannt hat, und können einzeln live gehen. Paket 4 danach in einem Zug, damit die Seite nicht halb alt, halb neu aussieht. Paket 5 ist unabhängig und kann parallel laufen. Paket 6 hängt an den Betreiberangaben.
