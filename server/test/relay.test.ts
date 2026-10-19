// End to end over a real Socket.IO server on an ephemeral port.
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { once } from "node:events";
import { io as connect, type Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents, User } from "../../shared/protocol.ts";
import { createChalkboardServer } from "../src/server.ts";

type Client = Socket<ServerToClientEvents, ClientToServerEvents>;

const { httpServer, io } = createChalkboardServer("/nonexistent");
let url = "";
const clients: Client[] = [];

before(async () => {
  httpServer.listen(0);
  await once(httpServer, "listening");
  url = `http://localhost:${String((httpServer.address() as AddressInfo).port)}`;
});

after(async () => {
  for (const client of clients) client.disconnect();
  await io.close();
});

/** Connects and resolves once the server has published a user list containing this name. */
async function join(name: string): Promise<{ client: Client; users: User[] }> {
  const client: Client = connect(url, { query: { username: name }, transports: ["websocket"] });
  clients.push(client);
  const users = await new Promise<User[]>((resolve) => {
    const onUsers = (list: User[]) => {
      if (list.some((user) => user.id === client.id)) {
        client.off("users", onUsers);
        resolve(list);
      }
    };
    client.on("users", onUsers);
  });
  return { client, users };
}

const nextUsers = (client: Client) => new Promise<User[]>((resolve) => client.once("users", resolve));

test("presence, relay and validation over the wire", async (t) => {
  const ada = await join("  Ada  ");
  assert.deepEqual(ada.users.map((user) => user.name), ["Ada"]);

  const adaSeesGrace = nextUsers(ada.client);
  const grace = await join("Grace");
  assert.deepEqual((await adaSeesGrace).map((user) => user.name), ["Ada", "Grace"]);
  assert.deepEqual(grace.users.map((user) => user.name), ["Ada", "Grace"]);

  await t.test("a valid segment reaches the other client as a clean copy", async () => {
    const received = new Promise((resolve) => grace.client.once("segment", resolve));
    ada.client.emit("segment", { color: "#ffffff", weight: 4, x1: 1, y1: 2, x2: 3, y2: 4, extra: true } as never);
    assert.deepEqual(await received, { color: "#ffffff", weight: 4, x1: 1, y1: 2, x2: 3, y2: 4 });
  });

  await t.test("the sender does not get its own segment back", async () => {
    let echoed = false;
    ada.client.once("segment", () => (echoed = true));
    const received = new Promise((resolve) => grace.client.once("stamp", resolve));
    ada.client.emit("segment", { color: "#ffffff", weight: 4, x1: 1, y1: 2, x2: 3, y2: 4 });
    ada.client.emit("stamp", { shape: "square", color: "#f44336", x: 10, y: 10 });
    await received;
    assert.equal(echoed, false);
  });

  await t.test("an invalid payload is dropped", async () => {
    let relayed = false;
    grace.client.once("segment", () => (relayed = true));
    const received = new Promise((resolve) => grace.client.once("stamp", resolve));
    ada.client.emit("segment", { color: "red", weight: 4, x1: 1, y1: 2, x2: 3, y2: 4 });
    ada.client.emit("stamp", { shape: "circle", color: "#f44336", x: 10, y: 10 });
    // Socket.IO keeps per-connection order, so the stamp arriving proves the segment was dropped.
    assert.deepEqual(await received, { shape: "circle", color: "#f44336", x: 10, y: 10 });
    assert.equal(relayed, false);
  });

  await t.test("leaving updates everyone's user list", async () => {
    const graceSeesLeave = nextUsers(grace.client);
    ada.client.disconnect();
    assert.deepEqual((await graceSeesLeave).map((user) => user.name), ["Grace"]);
  });
});
