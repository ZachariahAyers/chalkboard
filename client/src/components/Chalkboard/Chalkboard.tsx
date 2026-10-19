import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { User } from "../../../../shared/protocol.ts";
import { mountBoard, type BoardSocket } from "../../board/mountBoard.ts";
import { COLORS } from "../../board/palette.ts";
import type { Brush, Tool } from "../../board/tools.ts";
import Header from "../Header/Header.tsx";
import ToolPalette from "../ToolPalette/ToolPalette.tsx";
import UserList from "../UserList/UserList.tsx";
import "./Chalkboard.css";

interface Props {
  name: string;
}

export default function Chalkboard({ name }: Props) {
  const [color, setColor] = useState<string>(COLORS[0]);
  const [tool, setTool] = useState<Tool>("brush");
  const [users, setUsers] = useState<User[]>([]);
  const canvasHost = useRef<HTMLDivElement>(null);
  const brush = useRef<Brush>({ tool, color });

  useEffect(() => {
    brush.current = { tool, color };
  }, [tool, color]);

  useEffect(() => {
    const host = canvasHost.current;
    if (!host) return;
    // The page and Socket.IO share an origin, so io() needs no URL.
    const socket: BoardSocket = io({ query: { username: name } });
    socket.on("users", setUsers);
    const unmountBoard = mountBoard(host, socket, () => brush.current);
    return () => {
      unmountBoard();
      socket.disconnect();
    };
  }, [name]);

  return (
    <div className="workspace">
      <Header />
      <ToolPalette activeTool={tool} activeColor={color} onToolChange={setTool} onColorChange={setColor} />
      <div className="sketch" ref={canvasHost} role="img" aria-label="Shared drawing board" />
      <UserList users={users} />
    </div>
  );
}
