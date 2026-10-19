import { useEffect, useRef, useState } from "react";
import p5 from "p5";
import Header from "../Header/Header";
import ToolPalette from "../ToolPalette/ToolPalette";
import UserPalette from "../UserPalette/UserPalette";
import { BOARD_COLOR, COLORS } from "../../palette";
import { drawCircle, drawLine, drawSquare } from "../../draw";
import "./Chalkboard.css";

const BRUSH_WEIGHT = 4;
const ERASER_WEIGHT = 25;

export default function Chalkboard({ socket }) {
  const [color, setColor] = useState(COLORS[0]);
  const [tool, setTool] = useState("BRUSH");
  const [users, setUsers] = useState([]);
  const canvasHost = useRef(null);
  const current = useRef({ color, tool });

  useEffect(() => {
    current.current = { color, tool };
  }, [color, tool]);

  useEffect(() => {
    socket.on("user-list", setUsers);
    return () => socket.off("user-list", setUsers);
  }, [socket]);

  useEffect(() => {
    const host = canvasHost.current;
    let sketch = null;
    // p5 starts asynchronously, so a cleanup can run before setup does.
    let disposed = false;
    const onLine = (data) => drawLine(sketch, data);
    const onCircle = (data) => drawCircle(sketch, data);
    const onSquare = (data) => drawSquare(sketch, data);

    const instance = new p5((p) => {
      // p5 listens on the whole window; only act on input over the canvas.
      const overCanvas = () => p.mouseX >= 0 && p.mouseY >= 0 && p.mouseX <= p.width && p.mouseY <= p.height;

      p.setup = () => {
        if (disposed) {
          p.remove();
          return;
        }
        p.createCanvas(host.clientWidth, host.clientHeight);
        p.background(BOARD_COLOR);
        sketch = p;
        socket.on("line", onLine);
        socket.on("circle", onCircle);
        socket.on("square", onSquare);
      };

      p.mouseClicked = () => {
        const { color, tool } = current.current;
        if (!overCanvas() || (tool !== "CIRCLE" && tool !== "SQUARE")) return;
        const shape = { color, x: p.mouseX, y: p.mouseY };
        if (tool === "CIRCLE") drawCircle(p, shape);
        else drawSquare(p, shape);
        socket.emit(tool.toLowerCase(), shape);
      };

      p.mouseDragged = () => {
        const { color, tool } = current.current;
        if (!overCanvas() || (tool !== "BRUSH" && tool !== "ERASE")) return;
        const erasing = tool === "ERASE";
        const line = {
          color: erasing ? BOARD_COLOR : color,
          weight: erasing ? ERASER_WEIGHT : BRUSH_WEIGHT,
          x1: p.mouseX,
          y1: p.mouseY,
          x2: p.pmouseX,
          y2: p.pmouseY,
        };
        drawLine(p, line);
        socket.emit("line", line);
      };
    }, host);

    return () => {
      disposed = true;
      socket.off("line", onLine);
      socket.off("circle", onCircle);
      socket.off("square", onSquare);
      instance.remove();
    };
  }, [socket]);

  return (
    <div className="workspace">
      <Header />
      <ToolPalette activeTool={tool} activeColor={color} onToolChange={setTool} onColorChange={setColor} />
      <div className="sketch" ref={canvasHost} />
      <UserPalette users={users} />
    </div>
  );
}
