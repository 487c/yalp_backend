# yalp_backend

**Yet another learning platform**

Backendsoftware für YALP.

Die Schnittstelle wurde mit OpenApi implementiert und über [Swagger](http://localhost:3001/api-documentation/) kann die Api getestet werden.

Über den Port 8081 kann auf MongoDb Express (Administrationstool der Datenbank) zugegriffen werden.

Koordination der Bemühungen und Zusammenarbeit über: [Projektboard](https://github.com/users/svolume/projects/1/views/1)

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

1. [x] Erstellen eines Kurses / Anzeige von bestehenden Kursen
2. [ ] Hochladen eines Skriptes / Anzeige von Skripten zu einem bestehenden Kurs
3. [x] Erstellen eines Einladungscodes zum erstellen eines Kurses
4. [x] Hinzufügen von Usern zu einem Kurs mithilfe des Einladungskurses
5. [ ] Erstellen von Vorder und Rückseite als Lernkarte zu einer Seite
6. [ ] Übersicht über Karten von anderen Usern
7. [ ] Übernahme von Karten von anderen Usern
8. [ ] Applikation zum Lernen von Karten

### Erweiterte Anforderungen

1. [ ] Erstellen von Kapiteln über mithilfe von Markdown extraktion
2. [ ] Generierung von Karten mithilfe von KI
