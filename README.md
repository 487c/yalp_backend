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

| Code | Erklärung                                                   |
| ---- | ----------------------------------------------------------- |
| 1000 | The login is already taken.                                 |
| 1001 | Name is already taken.                                      |
| 1002 | Login is missing.                                           |
| 1003 | User could not be found.                                    |
| 2000 | Course could not be created.                                |
| 2001 | Could not find course or user is not a member of the course |
| 2002 | Could not find course / you are not the owner of the course |
| 2003 | You are not the sole member of the course (delete course)   |
| 2004 | You are already member of the course                        |
| 2005 | You are not owner of course (delete Course/change Owner)    |
| 2006 | You is something wrong, the course has no members           |
| 2007 | The given name does not correspond to a user                |
| 2008 | New owner is current course owner                           |
| 3001 | Sript could not be found                                    |
| 3002 | Sript name is already taken                                 |
| 3003 | Could not create Script ( + Error)                          |
| 3004 | Not a member of the course                                  |
| 3005 | The Script is missing a file (not yet fully created)        |

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
