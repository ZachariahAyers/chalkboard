# Chalkboard

A shared chalkboard in the browser. Everyone who opens the page draws on the same board, and every stroke appears on every other screen as it is drawn.

By [Zachariah Ayers](https://ayers.repair) · [GitHub](https://github.com/ZachariahAyers)

## Why it is interesting

Chalkboard keeps no drawing on the server. The server checks each message and passes it on to the other clients. The interesting part is making that small loop correct.

- **One typed contract.** `shared/protocol.ts` defines the Socket.IO events for both ends, the board size, and the parsers that validate every message. If the client and the server disagree about a message, TypeScript fails the build.
- **The server relays only what it has validated.** Each payload goes through `parseSegment` or `parseStamp`. The server passes on a fresh copy with only the contract's fields: a six-digit hex colour, finite coordinates on the board, and a bounded stroke weight. Everything else is dropped.
- **Every screen shares one coordinate space.** The board is a fixed 1600 × 1000 canvas, scaled by CSS to fit each window. A stroke drawn near the edge of a large monitor lands in the same place on a small laptop.
- **What you draw is exactly what others see.** Input becomes a message, and the same render function draws it on the sender's canvas and on every receiver's. A test checks that a stroke renders identically before and after the network.
- **Drawing logic is testable without a browser.** Only one module touches p5. Turning input into messages and drawing messages are plain functions, tested with Node's own test runner.
- **The canvas loads only when it is needed.** The board is lazy-loaded after you join, and p5 comes from its modular entry. The first page load is 311 KB of script instead of 1.56 MB.

Someone who joins late sees new strokes from that point on, not the strokes drawn before they arrived.

## Features

- Brush, eraser, circle and square tools
- A 19-colour palette, with chalk white as the default
- A live list of the people at the board
- A name prompt on entry, with a generated guest name if you leave it blank

## Stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Language | TypeScript, strict, run natively by Node 24 on the server        |
| Client   | React 19, p5.js 2, Socket.IO client, Font Awesome, built by Vite 8 |
| Server   | Node.js 24, Express 5, Socket.IO 4, Helmet                       |
| Quality  | typescript-eslint (type-aware), the Node test runner, GitHub Actions |
| Deploy   | Multi-stage Docker image on `node:24-alpine`                     |

## Running it

You need Node.js 24.12 or newer.

```bash
git clone https://github.com/ZachariahAyers/chalkboard.git
cd chalkboard
npm ci
```

### Development

Run the server and the client in two terminals:

```bash
npm run dev:server   # Socket.IO and Express on http://localhost:3000, restarts on change
npm run dev:client   # Vite on http://localhost:5173, proxies /socket.io to port 3000
```

Open http://localhost:5173 in two browser windows and draw in either one.

### Production

```bash
npm run build   # builds the client into client/dist
npm start       # serves client/dist and Socket.IO on http://localhost:3000
```

Set `PORT` to change the port.

### Docker

```bash
docker build -t chalkboard .
docker run -p 3000:3000 chalkboard
```

### Checks

```bash
npm run check              # typecheck, lint, unit tests and build
npm run test:integration   # two real clients against the relay on a random port
```

## Project structure

```
chalkboard/
├── shared/
│   └── protocol.ts          the wire contract: events, board size, validation
├── server/
│   ├── src/
│   │   ├── server.ts        Socket.IO relay and presence
│   │   ├── presence.ts      who is connected
│   │   ├── app.ts           Express: security headers, compression, static client
│   │   └── index.ts         starts the server
│   └── test/relay.test.ts   end-to-end relay test
├── client/
│   └── src/
│       ├── board/           drawing logic; mountBoard.ts is the only file that uses p5
│       └── components/      React components, each with its own CSS
├── docs/ARCHITECTURE.md     how the pieces fit and how a message flows
├── CLAUDE.md                instructions for working on the repo with Claude Code
└── CHANGELOG.md
```

[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) walks through the message flow and each module. Version 1, the original 2020 app, is tagged [`v1`](https://github.com/ZachariahAyers/chalkboard/tree/v1).

## License

Apache License 2.0. See [LICENSE](LICENSE).
