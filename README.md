# yalp_backend


**Yet another learning platform**

## Backendsoftware für YALP

Testing Plattform: [Swagger-Ui](http://localhost:3001/api/api-documentation/)

Mongodb - Express: [Mongo-Express] (http://localhost:8081)

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

## Erro Codes

Implementation see: [ErrorCodes]('./src/services/errorCodes.js')

## Features

### Minimalanforderungen

1. [x] Erstellen eines Kurses / Anzeige von bestehenden Kursen
2. [x] Hochladen eines Skriptes / Anzeige von Skripten zu einem bestehenden Kurs
3. [x] Erstellen eines Einladungscodes zum erstellen eines Kurses
4. [x] Hinzufügen von Usern zu einem Kurs mithilfe des Einladungskurses
5. [ ] Erstellen von Vorder und Rückseite als Lernkarte zu einer Seite
6. [ ] Übersicht über Karten von anderen Usern
7. [ ] Übernahme von Karten von anderen Usern
8. [ ] Applikation zum Lernen von Karten

### Erweiterte Anforderungen

1. [ ] Erstellen von Kapiteln über mithilfe von Markdown extraktion
2. [ ] Generierung von Karten mithilfe von KI
