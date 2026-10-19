// What one client draws locally must be exactly what every other client draws from the relayed message.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSegment, parseStamp } from "../../../shared/protocol.ts";
import { drawSegment, drawStamp, STAMP_SIZE, type Surface } from "./render.ts";
import { segmentFor, stampFor } from "./tools.ts";

type Call = [string, ...unknown[]];

function recorder(): Surface & { calls: Call[] } {
  const calls: Call[] = [];
  const record = (name: string) => (...args: unknown[]) => calls.push([name, ...args]);
  return {
    calls,
    stroke: record("stroke"),
    strokeWeight: record("strokeWeight"),
    line: record("line"),
    noStroke: record("noStroke"),
    fill: record("fill"),
    ellipse: record("ellipse"),
    rect: record("rect"),
  };
}

/** Serializes as Socket.IO would, then validates as the server does. */
const overTheWire = (message: unknown): unknown => JSON.parse(JSON.stringify(message));

test("a brush stroke renders identically on the sender and on a receiver", () => {
  const segment = segmentFor({ tool: "brush", color: "#2196f3" }, { x: 100, y: 100 }, { x: 140, y: 120 });
  assert.ok(segment);
  const sender = recorder();
  const receiver = recorder();
  drawSegment(sender, segment);
  const relayed = parseSegment(overTheWire(segment));
  assert.ok(relayed);
  drawSegment(receiver, relayed);
  assert.deepEqual(receiver.calls, sender.calls);
  assert.deepEqual(sender.calls, [["stroke", "#2196f3"], ["strokeWeight", 4], ["line", 100, 100, 140, 120]]);
});

test("every message the tools produce passes the server's validation", () => {
  const segment = segmentFor({ tool: "eraser", color: "#ffffff" }, { x: 0, y: 0 }, { x: 1, y: 1 });
  const stamp = stampFor({ tool: "square", color: "#ffeb3b" }, { x: 200, y: 300 });
  assert.deepEqual(parseSegment(overTheWire(segment)), segment);
  assert.deepEqual(parseStamp(overTheWire(stamp)), stamp);
});

test("stamps are centred on the click point for both shapes", () => {
  const circle = recorder();
  drawStamp(circle, { shape: "circle", color: "#ffffff", x: 200, y: 300 });
  assert.deepEqual(circle.calls.at(-1), ["ellipse", 200, 300, STAMP_SIZE, STAMP_SIZE]);

  const square = recorder();
  drawStamp(square, { shape: "square", color: "#ffffff", x: 200, y: 300 });
  assert.deepEqual(square.calls.at(-1), ["rect", 200 - STAMP_SIZE / 2, 300 - STAMP_SIZE / 2, STAMP_SIZE, STAMP_SIZE]);
});
