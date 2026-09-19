# Theaterverwaltung

Die Verwaltung beginnt unter `/admin`. Alle Unterseiten verwenden dieselbe Navigation für Buchungen, Einlass, Einlassverlauf und Auswertung.

## Buchungen

- Die Aufführungskarten filtern die Buchungsliste. Die Prozentanzeige entspricht der belegten Kapazität; 100 Prozent erscheint erst ohne freie Plätze.
- Die Kennzahlen gelten für die gewählte Aufführung oder für alle Aufführungen. Einlasszahlen zählen Sitzplätze, nicht Gruppenbuchungen. Die Namenssuche filtert ausschließlich die Liste und verändert weder Kennzahlen noch Sitzplan.
- Der CSV-Export berücksichtigt Aufführung, Suche und den Filter für noch nicht eingecheckte Buchungen. Buchungs- und CSV-Antworten dürfen nicht zwischengespeichert werden.
- Auf kleinen Bildschirmen erscheinen die Buchungen als Karten. Die Verwaltung von Aufführungen bleibt auch ohne bereits veröffentlichte Termine erreichbar.
- Die automatische Löschung nach 14 Tagen bleibt aktiv. Ein zusätzlicher Löschlauf kann nach Bestätigung gestartet werden. Heruntergeladene CSV-Dateien fallen nicht unter die automatische Datenbanklöschung.

## Einlass

Die Kameraabfrage beginnt erst nach Klick auf „Kamera starten“. Alternativ können ein Ticketlink, eine Buchungs-ID oder ein `KTR1:`-Einlasscode eingegeben werden. Beide Wege nutzen den authentifizierten Ticket-Endpunkt. Einchecken benötigt einen eigenen Klick. E-Mail-Adressen im Einlassverlauf sind zunächst verborgen.

## Zugang ändern

Das Passwort gehört weder in den Quelltext noch in diese Dokumentation. Der SHA-256-Prüfwert liegt als verschlüsseltes Pages-Secret `ADMIN_PASSWORD_HASH` vor. Nach einer Änderung des Secrets muss Pages neu bereitgestellt werden. Anschließend die bestehenden Einträge in `admin_sessions` löschen, damit auch ältere Anmeldungen ungültig werden. Die neue Anmeldung, die Ablehnung des vorherigen Passworts und die Abmeldung auf der Produktionsdomain prüfen.

## Prüfung

`tests/admin-ticket-code.test.mjs` prüft gültige und ungültige Scan- und Texteingaben. `tests/ticket-flow.integration.mjs` läuft ausschließlich gegen eine lokale Testdatenbank und prüft auch, dass der CSV-Export eingecheckte Buchungen bei gesetztem Filter ausschließt. Browserprüfungen umfassen die vier Verwaltungsseiten, Anmeldung, mobile Ansichten, Suche, Einlass und Rücknahme. Physisches Scannen mit einer Kamera muss getrennt von manueller Codeeingabe geprüft werden.
