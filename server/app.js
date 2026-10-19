import path from "node:path";
import express from "express";
import helmet from "helmet";
import compression from "compression";

const clientBuild = path.join(import.meta.dirname, "../client/dist");

export const app = express();

app.use(helmet());
app.use(compression());
app.use(express.static(clientBuild));
