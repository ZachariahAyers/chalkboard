import { createServer } from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { cleanName, isLine, isShape } from "./messages.js";

const PORT = Number(process.env.PORT) || 3000;

const server = createServer(app);
const io = new Server(server);

// Connected users, keyed by socket id.
const users = new Map();
const broadcastUsers = () => io.emit("user-list", [...users.values()]);

const relay = (socket, event, isValid) => {
  socket.on(event, (data) => {
    if (isValid(data)) socket.broadcast.emit(event, data);
  });
};

io.on("connection", (socket) => {
  users.set(socket.id, cleanName(socket.handshake.query.username));
  broadcastUsers();

  relay(socket, "line", isLine);
  relay(socket, "circle", isShape);
  relay(socket, "square", isShape);

  socket.on("disconnect", () => {
    users.delete(socket.id);
    broadcastUsers();
  });
});

server.listen(PORT, () => {
  console.log(`Chalkboard listening on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => io.close());
