// The wire contract between client and server: event maps for Socket.IO and
// parsers that turn untrusted payloads into known-good messages.

/** Every client draws on a board of this size; the canvas is scaled to fit the screen. */
export const BOARD = { width: 1600, height: 1000 } as const;

export const LIMITS = {
  nameLength: 24,
  maxStrokeWeight: 100,
} as const;

export type Shape = "circle" | "square";

/** One straight piece of a freehand stroke, from the previous pointer position to the current one. */
export interface Segment {
  color: string;
  weight: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** A fixed-size shape stamped at a point. */
export interface Stamp {
  shape: Shape;
  color: string;
  x: number;
  y: number;
}

export interface User {
  id: string;
  name: string;
}

export interface ClientToServerEvents {
  segment: (segment: Segment) => void;
  stamp: (stamp: Stamp) => void;
}

export interface ServerToClientEvents {
  segment: (segment: Segment) => void;
  stamp: (stamp: Stamp) => void;
  users: (users: User[]) => void;
}

export interface SocketData {
  name: string;
}

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

type Fields = Record<string, unknown>;

const isObject = (value: unknown): value is Fields => typeof value === "object" && value !== null;
const isColor = (value: unknown): value is string => typeof value === "string" && HEX_COLOR.test(value);
const inRange = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
const onBoardX = (value: unknown): value is number => inRange(value, 0, BOARD.width);
const onBoardY = (value: unknown): value is number => inRange(value, 0, BOARD.height);

/** Returns a clean copy of a segment, or null if any field is missing or out of range. */
export function parseSegment(value: unknown): Segment | null {
  if (!isObject(value)) return null;
  const { color, weight, x1, y1, x2, y2 } = value;
  if (!isColor(color) || !inRange(weight, 1, LIMITS.maxStrokeWeight)) return null;
  if (!onBoardX(x1) || !onBoardY(y1) || !onBoardX(x2) || !onBoardY(y2)) return null;
  return { color, weight, x1, y1, x2, y2 };
}

/** Returns a clean copy of a stamp, or null if any field is missing or out of range. */
export function parseStamp(value: unknown): Stamp | null {
  if (!isObject(value)) return null;
  const { shape, color, x, y } = value;
  if (shape !== "circle" && shape !== "square") return null;
  if (!isColor(color) || !onBoardX(x) || !onBoardY(y)) return null;
  return { shape, color, x, y };
}

/** Trims and caps a requested display name; anything unusable becomes "Guest". */
export function cleanName(value: unknown): string {
  const name = typeof value === "string" ? value.trim().slice(0, LIMITS.nameLength) : "";
  return name || "Guest";
}
