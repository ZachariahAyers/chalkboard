import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@fontsource/lato/latin-400.css";
import "@fontsource/lato/latin-900.css";
import "@fontsource/rowdies/latin-400.css";
import "./index.css";
import App from "./components/App/App.tsx";

// The icon stylesheet is bundled above, so Font Awesome must not inject its own style tag.
config.autoAddCss = false;

const root = document.getElementById("root");
if (!root) throw new Error("index.html is missing #root");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
