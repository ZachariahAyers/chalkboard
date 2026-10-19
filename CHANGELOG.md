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

A rebuild of the same product on a current, typed stack. It has the same tools, the same palette and the same live user list.

### Changed

- TypeScript throughout. Node 24 runs the server's `.ts` files directly, and Vite builds the client.
- One wire contract, `shared/protocol.ts`, types both ends of the Socket.IO connection. The `line`, `circle` and `square` events are now `segment` and `stamp`, and the user list is now `users` with `{ id, name }` entries.
- The board has a fixed size, 1600 × 1000, scaled to fit each screen. Before this, each client used its own window size, so the same stroke landed in different places on different screens.
- Presence is keyed by connection and updated when someone leaves. Before, a timer dropped the oldest name once a minute, and names stayed listed after people left.
- The server relays only a validated copy of each message. It checks the colour, the stroke weight, and that coordinates are on the board.
- The canvas loads only after joining, through `React.lazy`. p5 is loaded from its modular entry, so the initial page script fell from 1.56 MB to 311 KB minified.
- React 19, Vite 8, p5.js 2, Express 5, Socket.IO 4.8, Helmet 8 and ESLint 10 with type-aware typescript-eslint rules.
- A native `<dialog>` and plain CSS replace Material-UI and react-color.
- The Docker image is multi-stage on `node:24-alpine` and runs as the non-root `node` user.

### Added

- Unit tests for the contract, presence, and input-to-message logic. A sync test checks that a stroke renders identically before and after the network. An integration test runs two real clients against the relay.
- CI on GitHub Actions: typecheck, lint, unit tests, integration test and build.
- `CLAUDE.md`, `.claude/settings.json` and `docs/ARCHITECTURE.md` for development with Claude Code.

### Removed

- The Heroku and EC2 deployment setup, Create React App, the service worker, CORS configuration, `xss-clean`, and the unused `/users` HTTP route.

## [1.0.0]

The original Chalkboard: React 18 and Create React App, react-p5, Material-UI, and an Express and Socket.IO server deployed to Heroku and later to EC2. It had brush, eraser, circle and square tools, a colour picker and a user list. Tagged `v1`.

[Unreleased]: https://github.com/ZachariahAyers/chalkboard/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/ZachariahAyers/chalkboard/compare/v1...v2.0.0
[1.0.0]: https://github.com/ZachariahAyers/chalkboard/tree/v1
