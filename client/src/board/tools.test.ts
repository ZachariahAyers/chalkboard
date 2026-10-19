import { test } from "node:test";
import assert from "node:assert/strict";
import { BOARD } from "../../../shared/protocol.ts";
import { BOARD_COLOR } from "./palette.ts";
import { BRUSH_WEIGHT, ERASER_WEIGHT, segmentFor, stampFor } from "./tools.ts";

const red = "#f44336";

test("the brush draws a segment in the chosen color from the previous point to the current one", () => {
  assert.deepEqual(segmentFor({ tool: "brush", color: red }, { x: 10, y: 20 }, { x: 30, y: 40 }), {
    color: red,
    weight: BRUSH_WEIGHT,
    x1: 10,
    y1: 20,
    x2: 30,
    y2: 40,
  });
});

test("the eraser draws a wide segment in the board color, whatever color is chosen", () => {
  const segment = segmentFor({ tool: "eraser", color: red }, { x: 0, y: 0 }, { x: 5, y: 5 });
  assert.ok(segment);
  assert.equal(segment.color, BOARD_COLOR);
  assert.equal(segment.weight, ERASER_WEIGHT);
});

test("shape tools do not draw segments, and line tools do not stamp", () => {
  assert.equal(segmentFor({ tool: "circle", color: red }, { x: 0, y: 0 }, { x: 5, y: 5 }), null);
  assert.equal(stampFor({ tool: "brush", color: red }, { x: 5, y: 5 }), null);
});

test("input off the board produces nothing", () => {
  assert.equal(segmentFor({ tool: "brush", color: red }, { x: 5, y: 5 }, { x: -1, y: 5 }), null);
  assert.equal(stampFor({ tool: "square", color: red }, { x: 5, y: BOARD.height + 1 }), null);
});

test("a drag that re-enters the board starts at the edge", () => {
  const segment = segmentFor({ tool: "brush", color: red }, { x: -50, y: BOARD.height + 50 }, { x: 10, y: 10 });
  assert.ok(segment);
  assert.deepEqual([segment.x1, segment.y1], [0, BOARD.height]);
});

test("circle and square tools stamp their shape at the click", () => {
  assert.deepEqual(stampFor({ tool: "circle", color: red }, { x: 5, y: 6 }), { shape: "circle", color: red, x: 5, y: 6 });
  assert.equal(stampFor({ tool: "square", color: red }, { x: 5, y: 6 })?.shape, "square");
});
