import { test } from "node:test";
import assert from "node:assert/strict";
import { socketPath } from "./server.ts";

test("the socket path defaults to Socket.IO's own", () => {
  assert.equal(socketPath({}), "/socket.io/");
});

test("SOCKET_PATH moves the socket path", () => {
  assert.equal(socketPath({ SOCKET_PATH: "/opensource/chalkboard/socket.io/" }), "/opensource/chalkboard/socket.io/");
});
