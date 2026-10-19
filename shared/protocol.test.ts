import { test } from "node:test";
import assert from "node:assert/strict";
import { BOARD, LIMITS, cleanName, parseSegment, parseStamp } from "./protocol.ts";

const segment = { color: "#ffffff", weight: 4, x1: 0, y1: 0, x2: 10, y2: 10 };
const stamp = { shape: "circle", color: "#3f51b5", x: 5, y: 5 };

test("parseSegment returns a copy of a valid segment", () => {
  assert.deepEqual(parseSegment(segment), segment);
});

test("parseSegment drops fields outside the contract", () => {
  assert.deepEqual(parseSegment({ ...segment, padding: "x".repeat(1000) }), segment);
});

test("parseSegment rejects bad colors, weights and coordinates", () => {
  for (const bad of [
    null,
    "segment",
    { ...segment, color: "white" },
    { ...segment, color: "#fff" },
    { ...segment, color: "#ffffff; background:url(x)" },
    { ...segment, weight: 0 },
    { ...segment, weight: LIMITS.maxStrokeWeight + 1 },
    { ...segment, x2: "10" },
    { ...segment, y1: Number.NaN },
    { ...segment, x1: -1 },
    { ...segment, y2: BOARD.height + 1 },
  ]) {
    assert.equal(parseSegment(bad), null, JSON.stringify(bad));
  }
});

test("parseStamp accepts both shapes on the board", () => {
  assert.deepEqual(parseStamp(stamp), stamp);
  assert.deepEqual(parseStamp({ ...stamp, shape: "square", x: BOARD.width, y: BOARD.height }), {
    ...stamp,
    shape: "square",
    x: BOARD.width,
    y: BOARD.height,
  });
});

test("parseStamp rejects unknown shapes and off-board points", () => {
  for (const bad of [
    { ...stamp, shape: "triangle" },
    { ...stamp, color: 25 },
    { ...stamp, x: BOARD.width + 1 },
    { color: "#3f51b5", x: 5, y: 5 },
  ]) {
    assert.equal(parseStamp(bad), null, JSON.stringify(bad));
  }
});

test("cleanName trims, caps length and falls back to Guest", () => {
  assert.equal(cleanName("  Ada  "), "Ada");
  assert.equal(cleanName("x".repeat(40)).length, LIMITS.nameLength);
  assert.equal(cleanName("   "), "Guest");
  assert.equal(cleanName(undefined), "Guest");
  assert.equal(cleanName(["a", "b"]), "Guest");
});
