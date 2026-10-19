// Draws wire messages. Local input and relayed messages go through the same functions,
// which is what keeps every screen identical.
import type { Segment, Stamp } from "../../../shared/protocol.ts";

/** The part of the p5 drawing API the board uses. */
export interface Surface {
  stroke(color: string): unknown;
  strokeWeight(weight: number): unknown;
  line(x1: number, y1: number, x2: number, y2: number): unknown;
  noStroke(): unknown;
  fill(color: string): unknown;
  ellipse(x: number, y: number, width: number, height: number): unknown;
  rect(x: number, y: number, width: number, height: number): unknown;
}

export const STAMP_SIZE = 50;

export function drawSegment(surface: Surface, { color, weight, x1, y1, x2, y2 }: Segment): void {
  surface.stroke(color);
  surface.strokeWeight(weight);
  surface.line(x1, y1, x2, y2);
}

export function drawStamp(surface: Surface, { shape, color, x, y }: Stamp): void {
  surface.noStroke();
  surface.fill(color);
  if (shape === "circle") {
    surface.ellipse(x, y, STAMP_SIZE, STAMP_SIZE);
  } else {
    surface.rect(x - STAMP_SIZE / 2, y - STAMP_SIZE / 2, STAMP_SIZE, STAMP_SIZE);
  }
}
