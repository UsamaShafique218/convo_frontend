import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://65.0.7.152:5000", // backend API base URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
