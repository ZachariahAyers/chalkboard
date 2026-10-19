// A relay on a moved path answers there and not on the default path.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { once } from "node:events";
import { createChalkboardServer } from "../src/server.ts";

const path = "/opensource/chalkboard/socket.io/";
const { httpServer, io } = createChalkboardServer("/nonexistent", path);
let origin = "";

before(async () => {
  httpServer.listen(0);
  await once(httpServer, "listening");
  origin = `http://localhost:${String((httpServer.address() as AddressInfo).port)}`;
});

after(async () => {
  await io.close();
});

test("the polling handshake answers on the configured path", async () => {
  const response = await fetch(`${origin}${path}?EIO=4&transport=polling`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /^0\{/);
});

test("the default path is not served", async () => {
  const response = await fetch(`${origin}/socket.io/?EIO=4&transport=polling`);
  assert.equal(response.status, 404);
});
