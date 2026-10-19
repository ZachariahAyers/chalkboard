import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  cleanName,
  parseSegment,
  parseStamp,
  type ClientToServerEvents,
  type ServerToClientEvents,
  type SocketData,
} from "../../shared/protocol.ts";
import { createApp } from "./app.ts";
import { createPresence } from "./presence.ts";

type ChalkboardServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

/** Builds the HTTP server and the Socket.IO relay without listening, so tests can pick the port. */
export function createChalkboardServer(clientDir: string) {
  const httpServer = createServer(createApp(clientDir));
  const io: ChalkboardServer = new Server(httpServer);
  const presence = createPresence();
  const publishUsers = () => io.emit("users", presence.list());

  io.on("connection", (socket) => {
    socket.data.name = cleanName(socket.handshake.query.username);
    presence.join(socket.id, socket.data.name);
    publishUsers();

    // Payloads are untrusted: only a parsed copy is relayed, and only to the other clients.
    socket.on("segment", (payload) => {
      const segment = parseSegment(payload);
      if (segment) socket.broadcast.emit("segment", segment);
    });

    socket.on("stamp", (payload) => {
      const stamp = parseStamp(payload);
      if (stamp) socket.broadcast.emit("stamp", stamp);
    });

    socket.on("disconnect", () => {
      presence.leave(socket.id);
      publishUsers();
    });
  });

  return { httpServer, io };
}
