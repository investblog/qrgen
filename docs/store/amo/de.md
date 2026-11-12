---
type: reference
status: active
tags: [store, listing, amo, de]
project: qrgen
---

# SVG QR Code Generator — AMO-Text, Deutsch

Nur für Firefox Add-ons: ein eigener Text in AMO-Markdown, nicht der aus dem Chrome Web Store. Regeln: [README](../README.md).

## Description

**Ein QR-Code für die Seite, die Sie gerade lesen – in der Sidebar von Firefox.** Klicken Sie auf die Schaltfläche in der Symbolleiste, und SVG QR Code Generator zeigt den Code für den aktuellen Tab. Scannen Sie ihn mit der Handykamera und lesen Sie dort weiter: keine Links, die Sie sich selbst mailen, keine Synchronisierung, keine Anmeldung. Als QR-Code-Generator für SVG zeichnet die Erweiterung alle Codes lokal als saubere Vektorgrafik.

**Vom Desktop aufs Handy**

- Die Sidebar startet mit der aktuellen Seite, ein einziger Scan genügt also, um sie aufs Handy zu holen.
- Auch ein Entwicklungsserver im lokalen Netzwerk klappt: Öffnen Sie ihn über die IP-Adresse des Computers und scannen Sie.
- Es öffnen sich nur Adressen, die das Handy erreicht; localhost und andere Namen, die nur Ihr Computer kennt, bleiben außen vor.

**Codes erstellen**

- Geben Sie statt der Seitenadresse beliebigen Text oder einen Link ein.
- Vier Größenvorgaben und vier Fehlerkorrekturstufen; mit Q oder H kommt ein gedruckter Code besser mit Kratzern zurecht.
- Speichern Sie den Code als SVG-Datei oder kopieren Sie das Markup: ein einziger Pfad, wenige Kilobyte, scharf in jedem Maßstab.

**Teilen und Einbinden**

- Ein Freigabelink auf qr.clx.cx baut das Bild bei jedem Aufruf aus dem Link selbst neu auf, eine Bilddatei wird also nie gespeichert.
- Snippets für HTML, Markdown, React und Vue sind nur einen Klick entfernt.
- Codes, die Sie mit „Link kopieren“ kopieren, landen im Verlauf – gespeichert nur auf diesem Computer.

**Datenschutz**

- Das Add-on selbst sendet keinerlei Netzwerkanfragen.
- Was Sie codieren, kann jeder lesen, der den Freigabelink bekommt – lassen Sie Geheimnisse also weg.
- Keine Anmeldung, keine Analyse, keine Werbung.

Scans zählen? Setzen Sie einen [clx.cx](https://clx.cx/short-links)-Kurzlink in den Code.

Von 301.st, quelloffen auf [GitHub](https://github.com/investblog/qrgen). Helles und dunkles Design; die Oberfläche richtet sich nach der Sprache Ihres Firefox und ist in sieben Sprachen verfügbar.
