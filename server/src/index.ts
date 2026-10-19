import path from "node:path";
import { createChalkboardServer } from "./server.ts";

const port = Number(process.env.PORT) || 3000;
const clientDir = path.join(import.meta.dirname, "../../client/dist");

const { httpServer, io } = createChalkboardServer(clientDir);

httpServer.listen(port, () => {
  console.log(`Chalkboard listening on http://localhost:${String(port)}`);
});

process.on("SIGTERM", () => {
  void io.close();
});
