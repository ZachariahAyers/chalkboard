# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `SOCKET_PATH` moves the server's Socket.IO path, and the client derives its path from its build base, so the app can be served under a prefix.
- Demo jobs in `ci.yml` that publish the client to ayers.repair/opensource/chalkboard/ and redeploy the relay image once the checks pass on `master`.

### Fixed

- The header logo loads under a base path.
- Lato and Rowdies are served from the app (`@fontsource`) instead of Google Fonts, which the site's CSP blocks.

### Removed

- The unused `logo512.png` and the Create React App `robots.txt`.

## [2.0.0]

A real-time shared chalkboard: React and p5.js in the browser, with a typed Socket.IO relay on Node.

### Added

- TypeScript throughout. Node 24 runs the server's `.ts` files directly, and Vite builds the client.
- One wire contract, `shared/protocol.ts`, types both ends of the Socket.IO connection: `segment` and `stamp` for drawing, and `users` with `{ id, name }` entries for presence.
- The board has a fixed size, 1600 × 1000, scaled to fit each screen, so a stroke lands in the same place on every screen.
- Presence is keyed by connection and updated when someone leaves.
- The server relays only a validated copy of each message. It checks the colour, the stroke weight, and that coordinates are on the board.
- The canvas loads only after joining, through `React.lazy`, and p5 loads from its modular entry, so the initial page script is 311 KB minified.
- React 19, Vite 8, p5.js 2, Express 5, Socket.IO 4.8, Helmet 8 and ESLint 10 with type-aware typescript-eslint rules.
- A native `<dialog>` and plain CSS.
- The Docker image is multi-stage on `node:24-alpine` and runs as the non-root `node` user.
- Unit tests for the contract, presence, and input-to-message logic. A sync test checks that a stroke renders identically before and after the network. An integration test runs two real clients against the relay.
- CI on GitHub Actions: typecheck, lint, unit tests, integration test and build.
- `CLAUDE.md`, `.claude/settings.json` and `docs/ARCHITECTURE.md` for development with Claude Code.

[Unreleased]: https://github.com/ZachariahAyers/chalkboard/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ZachariahAyers/chalkboard/tree/v2.0.0
