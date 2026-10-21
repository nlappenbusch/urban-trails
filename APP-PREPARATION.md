# Urban Trails: Unterwegs, Frankenthal und ElevenLabs

## Dieser Stand

- `/frankenthal`: Projektvorschau mit 15 geplanten Hörpunkten, 30 Minuten Audio-Zielzeit und fünf vorgesehenen Sprachfassungen. Nicht in den produktiven Tourkatalog oder die Sitemap aufgenommen. Recherche, sichere Hörorte, Koordinaten und Sprachfassungen müssen erst freigegeben werden.
- `/unterwegs/zuerich/zuerich-klassiker`: installierbare Web-Basis mit manueller Stationswahl, lokalem Fortschritt, explizitem Standortzugriff, sequenziellem GPS-Audiostart und Offline-Downloads.
- Texte separat speichern oder verfügbare Audios mit herunterladen. Download wird erst nach vollständiger Speicherung freigegeben; fehlende Audio-Dateien führen nicht zu einem vermeintlich vollständigen Paket. Download lässt sich entfernen.
- Offline bleiben Text und gespeicherte Audios verfügbar. Keine Mapbox-Karten offline und keine Zusage durchgängigen Hintergrund-GPS im Browser.

## ElevenLabs und Migration

`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, optional `ELEVENLABS_MODEL_ID` und ein mindestens 32 Zeichen langes zufälliges `AUDIO_ADMIN_TOKEN` ausschließlich auf dem Server setzen. Keine Schlüssel als NEXT_PUBLIC-Variable.

Der öffentliche Audio-GET liest nur vorbereitete Dateien; er löst keine kostenpflichtige Generierung aus. Redaktionelle Erstellung läuft ausschließlich per Bearer-authentifiziertem POST auf `/api/audio?city=…&tour=…&stop=…`. `/api/audio/warmup?city=…&tour=…&limit=1` akzeptiert ebenfalls nur POST und verarbeitet maximal drei fehlende Stopps je Aufruf. Im Authorization-Header `Bearer <AUDIO_ADMIN_TOKEN>` verwenden. Nicht über die Browseroberfläche oder öffentliche Links aufrufen.

Der neue Dateischlüssel enthält einen Hash von Text, Stimme, Modell, Audioformat und Einstellungen. Alte unversionierte Gemini-/ElevenLabs-Caches werden bewusst nicht als aktuelles Audio übernommen. Vor einem Produktivwechsel Audios über den geschützten Produktionsweg neu erstellen und abnehmen. Ohne vorbereitete Audios zeigt der Unterwegs-Modus den Mitlesetext; der bisherige Online-Player kann weiterhin seine deutlich gekennzeichnete Browser-Stimme verwenden. Es wurden im Rahmen der Implementierung keine realen ElevenLabs-Aufrufe ausgeführt.

Die Hash-URLs von Audio-Downloads sind unveränderlich. Ältere vollständige Downloads können weiter aus dem lokalen Gerätespeicher gespielt werden; neue Downloads ersetzen sie erst nach Erfolg. Änderungen an Stimme/Modell wirken bei den dynamischen Unterwegs-Seiten zur Laufzeit. Aktuelle Audiofehler werden nicht als MP3 gespeichert.

## Regionale Stimme

Ein vorhandenes lizenziertes Voice-Profil wird über seine Voice-ID gewählt. Es gibt keinen automatischen Upload von Sprachaufnahmen und keine automatische Klon-Erstellung. Vor einem regionalen Klon sind informierte Zustimmung, Verifikation des Stimmgebers, Projektzweck, erlaubte Sprachen, Nutzungsdauer, Widerrufs-/Beendigungsverfahren, Exporte und Zuständigkeit zu dokumentieren. Eine vertragliche Zweckbeschränkung wird nicht allein durch eine Voice-ID technisch erzwungen. Keine ungeprüfte Zusage, ein Klon sei technisch nur für diese Tour verwendbar.

## GPS-Abnahme

Standort wird erst nach Aktivierung angefragt, nicht hochgeladen und beim Ausschalten beziehungsweise Verlassen der Ansicht beendet. Automatik startet nur nach explizitem Hörmodus-Start. Nur der nächste noch nicht gehörte Stopp kann auslösen, innerhalb von 45 m, Genauigkeit höchstens 40 m, Standort nicht älter als 15 Sekunden, Annäherung über zwei Fixes und mindestens zwei Sekunden. Fertig gehört wird erst beim Audioende gespeichert. Bei Ablehnung, Fehler oder blockiertem Autoplay bleibt manuelle Auswahl möglich.

Vor-Ort-Test: dicht benachbarte Stopps, GPS-Sprünge, verweigerte Berechtigung, Energie-/Datensparmodus, Telefonunterbrechung, Displaysperre, Wiederaufnahme und Offline-Neustart. Schwellenwerte sind konservative Startwerte und ersetzen keine Begehung.

## Store-App: nächster Ausbau

Die PWA ist keine in App Stores veröffentlichte native App. Für die Vergabe bleibt die Store-Auslieferung offen: Native Hülle oder bestehende Audioguide-Plattform wählen, persistente native Downloads, Hintergrundstandort und Mediensteuerung mit Berechtigungsablauf ergänzen. Native Hintergrundführung und Audio müssen auf echten iOS-/Android-Geräten geprüft werden; Browser-Geolocation wird dafür nicht als ausreichend ausgegeben. Store-Konten, Signierung, Datenschutzhinweise und Freigabeprozess sind noch nicht eingerichtet.

## Betrieb vor Veröffentlichung

Betreiberanschrift, Ansprechpartner und vollständige Datenschutzinformationen fehlen weiterhin. `/datenschutz` beschreibt die technischen Datenflüsse und kennzeichnet die noch fehlenden Betreiberangaben. Frankenthal darf nicht als beauftragter Kunde oder abgenommene Stadtführung vermarktet werden. Die drei Vergabereferenzen bleiben eine separate Nachweislücke.

`node --test tests/travel.test.cjs` prüft GPS-Grenzen, Zeitkonsistenz, Frankenthal-Status, Audio-Revisionen, Authentifizierung, deduplizierte gemockte Generierung, Offline-Range-Anfragen und unvollständige Downloads. `npm run build` prüft die Produktionskompilierung. Die Tests erzeugen keine kostenpflichtigen Audios.

Quellen: ElevenLabs Convert-API https://elevenlabs.io/docs/api-reference/text-to-speech/convert und Service-Worker-Dokumentation https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers (Oktober 2026).
