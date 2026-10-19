import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanName, isLine, isShape } from "./messages.js";

test("cleanName trims, caps length and falls back to Guest", () => {
  assert.equal(cleanName("  Ada  "), "Ada");
  assert.equal(cleanName("x".repeat(40)).length, 24);
  assert.equal(cleanName(""), "Guest");
  assert.equal(cleanName(undefined), "Guest");
  assert.equal(cleanName(["a", "b"]), "Guest");
});

test("isLine accepts a well-formed stroke", () => {
  assert.ok(isLine({ color: "#ffffff", weight: 4, x1: 0, y1: 0, x2: 10, y2: 10 }));
});

test("isLine rejects bad colors, weights and coordinates", () => {
  const line = { color: "#ffffff", weight: 4, x1: 0, y1: 0, x2: 10, y2: 10 };
  assert.ok(!isLine(null));
  assert.ok(!isLine({ ...line, color: "red" }));
  assert.ok(!isLine({ ...line, color: "#fff; background:url(x)" }));
  assert.ok(!isLine({ ...line, weight: 0 }));
  assert.ok(!isLine({ ...line, weight: 1000 }));
  assert.ok(!isLine({ ...line, x2: "10" }));
  assert.ok(!isLine({ ...line, y1: Number.NaN }));
});

test("isShape requires a color and a finite position", () => {
  assert.ok(isShape({ color: "#3f51b5", x: 5, y: 5 }));
  assert.ok(!isShape({ color: "#3f51b5", x: 5 }));
  assert.ok(!isShape({ color: 25, x: 5, y: 5 }));
  assert.ok(!isShape("circle"));
});
