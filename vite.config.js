import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^~/, replacement: "" }],
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    pure: ['console.log'],
   // drop: ["console"],
  },
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
});
