import type { Socket } from "socket.io-client";
import { BOARD, type ClientToServerEvents, type Segment, type ServerToClientEvents, type Stamp } from "../../../shared/protocol.ts";
import p5 from "./p5.ts";
import { BOARD_COLOR } from "./palette.ts";
import { drawSegment, drawStamp } from "./render.ts";
import { segmentFor, stampFor, type Brush } from "./tools.ts";

export type BoardSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/** Mounts the shared canvas in `host`. Returns a function that tears it down. */
export function mountBoard(host: HTMLElement, socket: BoardSocket, currentBrush: () => Brush): () => void {
  // p5 starts asynchronously, so teardown can run before setup does.
  let disposed = false;
  let surface: p5 | null = null;
  const onSegment = (segment: Segment) => {
    if (surface) drawSegment(surface, segment);
  };
  const onStamp = (stamp: Stamp) => {
    if (surface) drawStamp(surface, stamp);
  };

  const instance = new p5((p) => {
    p.setup = () => {
      if (disposed) {
        p.remove();
        return;
      }
      p.createCanvas(BOARD.width, BOARD.height);
      p.background(BOARD_COLOR);
      surface = p;
      socket.on("segment", onSegment);
      socket.on("stamp", onStamp);
    };

    // p5 reports pointer positions in board coordinates, whatever size the canvas is displayed at.
    p.mouseClicked = () => {
      const stamp = stampFor(currentBrush(), { x: p.mouseX, y: p.mouseY });
      if (!stamp) return;
      drawStamp(p, stamp);
      socket.emit("stamp", stamp);
    };

    p.mouseDragged = () => {
      const segment = segmentFor(currentBrush(), { x: p.pmouseX, y: p.pmouseY }, { x: p.mouseX, y: p.mouseY });
      if (!segment) return;
      drawSegment(p, segment);
      socket.emit("segment", segment);
    };
  }, host);

  return () => {
    disposed = true;
    socket.off("segment", onSegment);
    socket.off("stamp", onStamp);
    instance.remove();
  };
}
