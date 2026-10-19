import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./index.css";
import App from "./components/App/App";

// The icon stylesheet is bundled above, so Font Awesome must not inject its own style tag.
config.autoAddCss = false;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
