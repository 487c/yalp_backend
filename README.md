# yalp_backend

**Yet another learning platform**

Backendsoftware für das softare tool.

!!! KISS Prinzip !!!

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

## Endpoints

### Abrufen von Kursen zu einem User

> GET /courses
 
**Body**
```json
{
  "userId": "max.mustermann@bmg.de",
}
```

### Anlegen eines Kurses

> POST /course

**Body**
```json
{
  "name": "Datenbankmanagement",
}
```

**Response**
```json
{
    "entryCode": "AEHFH13132DKSKL"
}
```

### Hochladen von Skripten

> POST /script

**Body**
```json
{
  "base64Data": "AEF3...",
  "class": "Datenbankenmanagement",
  "sizeKB": 130
}
```

### Abrufen von Karten

> GET /cards
 
**Body**
```json
{
  "userId": "Nils",
  "class": "Datenbankmanagement",
  "scriptId": 1
}
```


### Abrufen eines Skriptes

> GET /script
 
**Body**
```json
{
  "scriptId": 1312
}
``` 

**Response**
```json
{
  "base64Data": "AADFJA13"
}
`````

## Development

Starting watchdog for hot reloading

```bash
npm run start
```
