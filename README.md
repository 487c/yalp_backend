# yalp_backend

**Yet another learning platform**
Backend für die kooperative Lernplattform

## How to get Started

Einstellungen für den Stack müssen in der .env Datei angepasst werden.

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

Mögliche Fehlermeldungen: [ErrorCodes]('https://github.com/Waffelmeister/yalp_backend/blob/main/src/services/errorCodes.js')
