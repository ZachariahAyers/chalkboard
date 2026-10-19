# Chalkboard

[![CI](https://github.com/ZachariahAyers/chalkboard/actions/workflows/ci.yml/badge.svg)](https://github.com/ZachariahAyers/chalkboard/actions/workflows/ci.yml)

A shared chalkboard in the browser: everyone on the page draws on the same board, and each stroke appears on every other screen as it is drawn.

## Features

- Brush, eraser, circle and square tools
- A 19-colour palette, with chalk white as the default
- A live list of the people at the board
- A name prompt on entry, with a generated guest name if you leave it blank

## Tech stack

TypeScript, React, p5.js, Socket.IO, Express, Vite, Docker.

## Getting started

Requires Node.js 24.12 or newer.

```bash
git clone https://github.com/ZachariahAyers/chalkboard.git
cd chalkboard
npm ci
npm run build && npm start
```

Open http://localhost:3000 in two browser windows and draw in either one. Set `PORT` to change the port.

## Development

```bash
npm run dev:server        # server on http://localhost:3000
npm run dev:client        # Vite on http://localhost:5173
npm run typecheck
npm run lint
npm test
npm run test:integration
npm run build
```

How it is put together: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License

Apache License 2.0. See [LICENSE](LICENSE).

---

Built by [Zachariah Ayers](https://ayers.repair).
