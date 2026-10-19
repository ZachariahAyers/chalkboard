// Drawing primitives shared by local input and events relayed from other users.

const SHAPE_SIZE = 50;

export function drawLine(p, { color, weight, x1, y1, x2, y2 }) {
  p.stroke(color);
  p.strokeWeight(weight);
  p.line(x1, y1, x2, y2);
}

export function drawCircle(p, { color, x, y }) {
  p.noStroke();
  p.fill(color);
  p.ellipse(x, y, SHAPE_SIZE, SHAPE_SIZE);
}

export function drawSquare(p, { color, x, y }) {
  p.noStroke();
  p.fill(color);
  p.rect(x - SHAPE_SIZE / 2, y - SHAPE_SIZE / 2, SHAPE_SIZE, SHAPE_SIZE);
}
