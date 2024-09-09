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
  "userId": "max.mustermann@bmg.de"
}
```

### Anlegen eines Kurses

> POST /course

**Body**

```json
{
  "name": "Datenbankmanagement"
}
```

**Response**

```json
{
  "entryCode": "AEHFH13132DKSKL",
  "id": 1

}
```

### Hochladen von Skripten

> POST /script

**Body**

```json
{
  "base64Data": "AEF3...",
  "classId": 132,
  "sizeKB": 130
}
```

**Response**

```json
{
  "cards": [
    { "id": 1, "front": "Was beschreibt das ACID Prinzip?", "back": "A - Atomic \\n C..." }
  ]
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

### Abrufen von Skripten zu einem Kurs

> GET /scripts

**Body**

```json
{
  "classId": 123
}
```

**Response**

```json
{
  "scripts": [{ "name": "Datenbanken Teil 1", "id": 1312 }]
}
```

### Abrufen von Kursen einem User

> GET /courses

**Body**

```json
{
  "userId": 123
}
```

**Response**

```json
{
  "courses": [{ "name": "Datenbankmanagement", "id": 1312 }]
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
```

## Development

Starting watchdog for hot reloading

```bash
npm run start
```
