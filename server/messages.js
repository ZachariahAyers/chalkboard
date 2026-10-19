// Every drawing event is relayed to other clients, so payloads are checked first.

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const MAX_NAME_LENGTH = 24;
const MAX_STROKE_WEIGHT = 100;

const isNumber = (value) => Number.isFinite(value);
const isColor = (value) => typeof value === "string" && HEX_COLOR.test(value);

export function cleanName(raw) {
  const name = typeof raw === "string" ? raw.trim().slice(0, MAX_NAME_LENGTH) : "";
  return name || "Guest";
}

export function isLine(data) {
  return (
    data !== null &&
    typeof data === "object" &&
    isColor(data.color) &&
    isNumber(data.weight) &&
    data.weight > 0 &&
    data.weight <= MAX_STROKE_WEIGHT &&
    [data.x1, data.y1, data.x2, data.y2].every(isNumber)
  );
}

export function isShape(data) {
  return (
    data !== null &&
    typeof data === "object" &&
    isColor(data.color) &&
    isNumber(data.x) &&
    isNumber(data.y)
  );
}
