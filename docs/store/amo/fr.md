---
type: reference
status: active
tags: [store, listing, amo, fr]
project: qrgen
---

# SVG QR Code Generator — fiche AMO, français

Firefox Add-ons uniquement : un texte à part, dans le Markdown d’AMO, différent de celui du Chrome Web Store. Règles : [README](../README.md).

## Description

**Le QR code de la page que vous lisez, dans la barre latérale de Firefox.** Cliquez sur le bouton de la barre d’outils et SVG QR Code Generator affiche le code de l’onglet actif. Scannez-le avec l’appareil photo du téléphone pour poursuivre la lecture : pas de lien à s’envoyer par e-mail, pas de synchronisation, pas d’inscription. Ce générateur de QR codes SVG dessine chaque code en local, en vectoriel propre.

**De l’ordinateur au téléphone**

- La barre latérale s’ouvre sur la page en cours : un seul scan suffit pour la retrouver sur le téléphone.
- Un serveur de développement sur votre réseau local marche aussi : ouvrez-le par l’adresse IP de l’ordinateur, puis scannez.
- Seules les adresses accessibles au téléphone s’ouvrent ; localhost et les autres noms que seul votre ordinateur connaît resteront fermés.

**Créer des codes**

- Tapez n’importe quel texte ou lien à la place de l’adresse de la page.
- Quatre tailles prédéfinies et quatre niveaux de correction d’erreurs ; en Q ou H, un code imprimé supporte mieux les rayures.
- Enregistrez le code en fichier SVG ou copiez le balisage : un seul tracé, quelques kilo-octets, net à toute échelle.

**Partage et intégration**

- Un lien de partage sur qr.clx.cx reconstruit l’image à partir du lien à chaque ouverture : aucun fichier image n’est jamais stocké.
- Les snippets HTML, Markdown, React et Vue sont à un clic.
- Les codes copiés avec « Copier le lien » vont dans l’Historique, conservé sur cet ordinateur uniquement.

**Confidentialité**

- Le module complémentaire ne fait de lui-même aucune requête réseau.
- Tout ce que vous encodez peut être lu par quiconque reçoit le lien de partage : gardez vos secrets pour vous.
- Pas d’inscription, pas de statistiques, pas de publicité.

Envie de compter les scans ? Glissez un lien court [clx.cx](https://clx.cx/short-links) dans le code.

Par 301.st, open source sur [GitHub](https://github.com/investblog/qrgen). Thèmes clair et sombre ; l’interface suit la langue de votre Firefox, en sept langues.
