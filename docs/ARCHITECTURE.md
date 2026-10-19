# Architecture

Chalkboard is a relay, not a store. Each client draws on its own canvas and sends what it drew as small messages. The server checks each message and forwards it to every other client. Nothing is saved, so someone who joins late sees new strokes from that point on.

```
 browser A                         server                          browser B
 ─────────                         ──────                          ─────────
 pointer drag
   │ tools.segmentFor()
   ├─► render.drawSegment()  (local)
   └─► emit "segment" ──────► parseSegment() ── valid ──► broadcast "segment"
                                    │                         │
                                  invalid                     ▼
                                 (dropped)           render.drawSegment()
```

## Shared contract: `shared/protocol.ts`

There is one file both sides import:

- **Event maps.** `ClientToServerEvents` and `ServerToClientEvents` type the Socket.IO connection on both ends. The server is typed as `Server<ClientToServerEvents, ServerToClientEvents, …>` and the client as `Socket<ServerToClientEvents, ClientToServerEvents>`.
- **`BOARD`.** A fixed board, 1600 × 1000 units. Every client uses the same coordinate space, whatever its screen size.
- **Parsers.** `parseSegment` and `parseStamp` take an `unknown` payload. Each returns either a fresh object with only the contract's fields, or `null`. A message passes only with a six-digit hex colour, finite coordinates on the board and a bounded stroke weight. `cleanName` trims and caps display names.

The server relays the parsed copy, never the payload it received. So extra fields and malformed values never reach other clients.

## Messages

| Event | Direction | Payload | Meaning |
| --- | --- | --- | --- |
| `segment` | both | `{ color, weight, x1, y1, x2, y2 }` | one straight piece of a freehand stroke or an eraser pass |
| `stamp` | both | `{ shape: "circle" \| "square", color, x, y }` | a fixed-size shape centred on a point |
| `users` | server → client | `{ id, name }[]` | everyone connected, in join order |

The display name travels in the handshake query (`io({ query: { username } })`). The server stores it on `socket.data.name`.

## Server: `server/src`

- `server.ts`: `createChalkboardServer(clientDir)` builds the HTTP server and the Socket.IO server without listening, so the integration test can choose its own port. When a client connects, it joins the presence list and everyone receives the new list. Its `segment` and `stamp` events are parsed and sent to all other clients (`socket.broadcast`). When it disconnects, it leaves the list.
- `presence.ts`: an ordered map from socket id to name. Users are keyed by connection, so two people can share a name.
- `app.ts`: Express with Helmet security headers and compression, serving the built client.
- `index.ts`: reads `PORT`, starts listening, and closes Socket.IO on `SIGTERM`.

Node 24 runs these TypeScript files directly, using type stripping. There is no server build step. That is why the code is limited to erasable syntax and imports carry `.ts` extensions.

## Client: `client/src`

- `components/App`: the join dialog first. After that it shows the board, which is loaded with `React.lazy`. p5 lives in that lazy chunk, so the first page load does not include it.
- `components/Chalkboard`: owns the socket for as long as it is mounted. It holds the selected tool and colour, and mounts the board.
- `board/tools.ts`: pure functions from input to messages. `segmentFor(brush, from, to)` and `stampFor(brush, at)` return `null` when the tool does not apply or the pointer is off the board.
- `board/render.ts`: draws a message on a `Surface`, the five-method slice of p5 the board uses. Local input and relayed messages use the same functions, so every screen matches.
- `board/mountBoard.ts`: the only module that touches p5. It creates the canvas at `BOARD` size, wires the pointer to `tools` → `render` → `emit`, and wires incoming messages to `render`. p5 starts asynchronously, so teardown is guarded against arriving before setup finishes.
- `board/p5.ts`: p5's modular entry, `p5/core` plus the `shape`, `color` and `events` modules. They are registered the way p5's own `app.js` entry registers them. This keeps the board chunk about 1 MB smaller than `import p5 from "p5"`.

The canvas is drawn at board resolution and scaled by CSS to fit its grid cell. p5 maps pointer positions back to board units by dividing by the canvas's displayed scale.

## Development and production

- Development: Vite serves the client on port 5173 and proxies `/socket.io`, including WebSocket upgrades, to the Node server on port 3000.
- Production: one Node process serves `client/dist` and Socket.IO on the same origin, so no CORS is needed. The Docker image builds the client in one stage. The runtime stage holds only the server's production dependencies and runs as the `node` user.

## Tests

- `shared/protocol.test.ts`: what the contract accepts and rejects.
- `server/src/presence.test.ts`: join order, leaving, and duplicate names.
- `client/src/board/tools.test.ts`: which input produces which message.
- `client/src/board/sync.test.ts`: a stroke drawn locally is identical to the same stroke after JSON serialisation, server validation and remote rendering.
- `server/test/relay.test.ts` (`npm run test:integration`): two real clients over WebSocket. It covers presence updates, relay to others only, dropping invalid payloads, stripping extra fields, and leaving.
