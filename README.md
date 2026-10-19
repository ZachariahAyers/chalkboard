# Chalkboard

A shared chalkboard in the browser. Everyone who opens the page draws on the same canvas, and every stroke appears on every other screen as it is drawn.

By [Zachariah Ayers](https://ayers.repair) · [GitHub](https://github.com/ZachariahAyers)

## Why it is interesting

Chalkboard keeps no drawing on the server. The server checks each drawing event and passes it on to the other clients. It never stores the picture.

- **Strokes travel as line segments.** While the mouse drags, the client draws a short segment from the previous pointer position to the current one. It then sends that segment as one small Socket.IO event. Other clients replay the same segment, so a stroke looks smooth everywhere.
- **The server checks before it relays.** Each `line`, `circle` and `square` payload is validated before it is broadcast: a six-digit hex colour, finite coordinates and a bounded stroke weight. A bad payload is dropped, so one client cannot send junk to the rest of the room.
- **Presence follows the connection.** Users are tracked by socket id. The full list is sent again whenever someone joins or leaves, so the list always matches who is connected.
- **One process, one origin.** In production a single Node server serves the built client and Socket.IO on the same port, so no CORS setup is needed. In development, Vite proxies `/socket.io` to the Node server.

The board is shared live and is not saved. Someone who joins late sees new strokes from that point on, not the strokes drawn before they arrived.

## Features

- Brush, eraser, circle and square tools
- A 19-colour palette, with chalk white as the default
- A live list of the people at the board
- A name prompt on entry, with a generated guest name if you leave it blank

## Stack

| Layer   | Technology                                         |
| ------- | -------------------------------------------------- |
| Client  | React 19, p5.js 2, Socket.IO client, Font Awesome  |
| Build   | Vite 8                                             |
| Server  | Node.js, Express 5, Socket.IO 4, Helmet            |
| Quality | ESLint 10, the Node test runner, GitHub Actions CI |
| Deploy  | Multi-stage Docker image on `node:24-alpine`       |

## Running it

You need Node.js 22.12 or newer.

```bash
git clone https://github.com/ZachariahAyers/chalkboard.git
cd chalkboard
npm install
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
npm run lint   # ESLint across client and server
npm test       # unit tests for the server's payload validation
```

## Project structure

```
chalkboard/
├── client/                    React app, built with Vite
│   ├── index.html
│   ├── vite.config.js         dev proxy for /socket.io
│   ├── public/                favicon and logo
│   └── src/
│       ├── main.jsx           entry point
│       ├── palette.js         drawing colours and the board colour
│       ├── draw.js            line, circle and square drawing shared by local and remote input
│       └── components/
│           ├── App/           shows the join prompt, then opens the socket
│           ├── JoinDialog/    name prompt
│           ├── Chalkboard/    p5 canvas and socket event wiring
│           ├── ToolPalette/   colours and tools
│           ├── UserPalette/   list of connected users
│           └── Header/
├── server/
│   ├── index.js               HTTP server, Socket.IO, presence and relay
│   ├── app.js                 Express: security headers, compression, static client
│   ├── messages.js            payload and username validation
│   └── messages.test.js
├── eslint.config.js
├── Dockerfile
└── package.json               npm workspaces root
```

## License

Apache License 2.0. See [LICENSE](LICENSE).
