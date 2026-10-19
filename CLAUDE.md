# Chalkboard

A shared real-time chalkboard. A React and p5.js client sends drawing messages to a Node and Socket.IO server. The server validates them and passes them on to everyone else. The server stores no drawings. See `docs/ARCHITECTURE.md` for the message flow.

## Commands

Node 24.12 or newer. Run everything from the repo root.

- `npm ci`: install
- `npm run typecheck`: `tsc` for shared, server and client
- `npm run lint`: ESLint with type-aware typescript-eslint rules
- `npm test`: unit tests (Node test runner, no server, no browser)
- `node --test path/to/file.test.ts`: one test file
- `npm run test:integration`: real Socket.IO relay on an ephemeral port
- `npm run build`: Vite production build to `client/dist`
- `npm run check`: typecheck, lint, unit tests and build in one command
- `npm run dev:server` and `npm run dev:client`: development, in two terminals. The client is at http://localhost:5173.

## Layout

- `shared/protocol.ts`: the wire contract. Socket.IO event maps, board size, limits, and `parseSegment` / `parseStamp` / `cleanName`. Client and server both import it by relative path.
- `server/src/`: `server.ts` wires Socket.IO to the presence list and the relay. `app.ts` is Express. `index.ts` starts the server.
- `client/src/board/`: board logic. `tools.ts` turns input into messages, `render.ts` draws messages on a `Surface`, `mountBoard.ts` is the only file that touches p5, and `p5.ts` is the modular p5 entry.
- `client/src/components/`: React components, one folder each, with the CSS beside the component.

## Conventions

- TypeScript only. Code must be erasable syntax: no `enum`, no `namespace` with runtime code, no parameter properties. Node runs the server's `.ts` files directly.
- Relative imports carry the `.ts` / `.tsx` extension. Type-only imports use `import type`.
- Every change to a message goes through `shared/protocol.ts`, with a test in `shared/protocol.test.ts`. The server relays only what a `parse*` function returns.
- Board coordinates are in `BOARD` units, never screen pixels. p5 converts pointer positions for you.
- Board logic stays free of p5 and the DOM, so `node --test` can run it. Only `mountBoard.ts` imports `./p5.ts`.
- Import p5 through `client/src/board/p5.ts`, never `"p5"`. The full entry is about 1 MB larger.
- Styles live in component CSS files, never in inline `style` attributes. Colours are custom properties in `client/src/index.css`.
- Commits are conventional, with the subject in lower case after the type: `fix(server): ...`.

## Definition of done

- `npm run check` and `npm run test:integration` pass.
- New behaviour has a test that fails without the change.
- `README.md`, `docs/ARCHITECTURE.md` and this file still describe the code.
- An entry is added to `CHANGELOG.md` under Unreleased.
