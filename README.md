# yalp_backend

**Yet another learning platform**

Backendsoftware für das softare tool.

!!! KISS Prinzip !!!

Die Schnittstelle wurde mit OpenApi implementiert und über das [Tool](http://localhost:3000/api-documentation/) kann die Api getestet werden.

Über den Port 8081 kann auf MongoDb Express zugegriffen werden.

## How to get Started

Generate Access Token für Github mit Package Rechten. [Link](https://github.com/settings/tokens/new?scopes=write:packages)

Speichern des Tokens als Umweltvariable
```bash
export CR_PAT=<copied-token-here>
```

Einloggen bei der github Registry mit docker
```bash
echo $CR_PAT | docker login ghcr.io -u <github-username> --password-stdin
```

Starten des Stacks
```bash
docker compose up
```

## Features

### Minimalanforderungen

1. Erstellen einer Klasse / Anzeige von bestehenden Kursen
2. Hochladen eines Skriptes / Anzeige von Skripten zu einem bestehenden Kurs
3. Erstellen eines Einladungscodes zum erstellen eines Kurses
4. Hinzufügen von Id's zu einem Kurs mithilfe des Einladungskurses
5. Erstellen von Vorder und Rückseite als Lernkarte zu einer Seite
6. Übersich über Karten von anderen Usern
7. Übernahme von Karten von anderen Usern
8. Applikation zum Lernen von Karten

### Erweiterte Anforderungen

1. Erstellen von Kapiteln über mithilfe von Markdown extraktion
2. Generierung von Karten mithilfe von KI
