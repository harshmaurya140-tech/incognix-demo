import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "node:net": path.resolve(__dirname, "src/node-net-shim.js"),
      net: path.resolve(__dirname, "src/node-net-shim.js"),
    },
  },
});
