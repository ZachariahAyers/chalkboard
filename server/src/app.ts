import express from "express";
import helmet from "helmet";
import compression from "compression";

/** Express serves the built client; Socket.IO shares the same HTTP server. */
export function createApp(clientDir: string) {
  const app = express();
  app.use(helmet());
  app.use(compression());
  app.use(express.static(clientDir));
  return app;
}
