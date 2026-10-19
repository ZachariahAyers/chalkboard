import { test } from "node:test";
import assert from "node:assert/strict";
import { createPresence } from "./presence.ts";

test("lists users in join order", () => {
  const presence = createPresence();
  presence.join("a", "Ada");
  presence.join("b", "Grace");
  assert.deepEqual(presence.list(), [
    { id: "a", name: "Ada" },
    { id: "b", name: "Grace" },
  ]);
});

test("a user who leaves is removed and nobody else is", () => {
  const presence = createPresence();
  presence.join("a", "Ada");
  presence.join("b", "Grace");
  presence.leave("a");
  assert.deepEqual(presence.list(), [{ id: "b", name: "Grace" }]);
});

test("two users may share a name because they are keyed by connection", () => {
  const presence = createPresence();
  presence.join("a", "Guest");
  presence.join("b", "Guest");
  presence.leave("a");
  assert.deepEqual(presence.list(), [{ id: "b", name: "Guest" }]);
});

test("leaving twice or leaving unknown ids is harmless", () => {
  const presence = createPresence();
  presence.join("a", "Ada");
  presence.leave("a");
  presence.leave("a");
  presence.leave("zzz");
  assert.deepEqual(presence.list(), []);
});
