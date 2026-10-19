// Turns pointer input into wire messages. No p5 here, so it is unit-testable.
import { BOARD, type Segment, type Shape, type Stamp } from "../../../shared/protocol.ts";
import { BOARD_COLOR } from "./palette.ts";

export type Tool = "brush" | "eraser" | Shape;

export interface Brush {
  tool: Tool;
  color: string;
}

export interface Point {
  x: number;
  y: number;
}

export const BRUSH_WEIGHT = 4;
export const ERASER_WEIGHT = 25;

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);

export const onBoard = ({ x, y }: Point): boolean => x >= 0 && y >= 0 && x <= BOARD.width && y <= BOARD.height;

/** The segment a drag from `from` to `to` draws, or null when the tool does not draw lines or the pointer is off the board. */
export function segmentFor(brush: Brush, from: Point, to: Point): Segment | null {
  if (brush.tool !== "brush" && brush.tool !== "eraser") return null;
  if (!onBoard(to)) return null;
  const erasing = brush.tool === "eraser";
  return {
    color: erasing ? BOARD_COLOR : brush.color,
    weight: erasing ? ERASER_WEIGHT : BRUSH_WEIGHT,
    // A drag that re-enters the board starts from the edge it crossed.
    x1: clamp(from.x, BOARD.width),
    y1: clamp(from.y, BOARD.height),
    x2: to.x,
    y2: to.y,
  };
}

/** The stamp a click at `at` places, or null when the tool is not a shape or the click is off the board. */
export function stampFor(brush: Brush, at: Point): Stamp | null {
  if (brush.tool !== "circle" && brush.tool !== "square") return null;
  if (!onBoard(at)) return null;
  return { shape: brush.tool, color: brush.color, x: at.x, y: at.y };
}
