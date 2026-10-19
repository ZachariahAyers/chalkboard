import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development the Vite server proxies Socket.IO to the Node server on port 3000.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": { target: "ws://localhost:3000", ws: true },
    },
  },
});
