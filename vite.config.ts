import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/syosetu-api": {
        target: "https://api.syosetu.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/syosetu-api/, ""),
      },
    },
  },
});
