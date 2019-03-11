# Factory-Planning-Editor

Dieser Editor ist im Rahmen der Bachelorarbeit "Entwicklung eines Editors zur Modellierung von aufgabenorientierten Fabrikplanungsmodulen für die automatisierte Generierung von Planungsworkflows" entstanden.

In dieser README befindet sich eine Anleitung zur Ausführung des Quellcodes. Es wird eine [Node.js](https://nodejs.org/en/) Installation vorausgesetzt.

### Abhängigkeiten installieren
In diesem Projektverzeichnis muss der folgende Befehl ausgeführt werden:
```
npm install
```

### Starten der Entwicklungsumgebung
Für die Weiterentwicklung wird die Verwendung der Entwicklungsumgebung empfohlen. Dadurch werden Änderungen am Quellcode sofort neu kompiliert und ein Befehl zum neu laden an den Webbrowser gesandt.
Zum Start der Entwicklungsumgebung muss der folgende Befehl ausgeführt werden:
```
npm run serve
```

### Buildprozess
Um eine Version zu erstellen, die produktiv eingesetzt werden kann, muss der Quellcode kompiliert werden.
Dafür muss der folgende Befehl ausgeführt werden:
```
npm run build
```
Anschließend befindet sich im Verzeichnis ./dist/ die kompilierte Version des Editors, die im Webbrowser betrachet werden kann.
Alternativ kann die Version mit einem Webserver verteilt werden.

Bei Ausführung der kompilierten Datei, direkt im Webbrowser (ohne Webserver), muss die [Einstellung `Block third-party cookies` im Webbrowser deaktiviert sein](https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document).

### Tests ausführen
Die geschriebenen Tests können mit dem folgenden Befehl ausgeführt werden:
```
npm run test
```

### Lint
ESLint kann mit dem folgenden Befehl ausgeführt werden:
```
npm run lint
```

### Docker build
Das Image für Docker Container kann mit dem folgenden Befehl erstellt werden ([Docker Installation vorausgesetzt](https://www.docker.com/)):
```
docker build -t USERNAME/factory-planning-editor .
```

Starten lässt sich der Container dem Befehl:
```
docker run -it -p 8080:80 --rm --name factory-planning-editor USERNAME/factory-planning-editor
```
