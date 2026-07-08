import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@game": resolve(__dirname, "src/game"),
      "@components": resolve(__dirname, "src/components"),
      "@ui": resolve(__dirname, "src/components/ui"),
      "@assets": resolve(__dirname, "src/assets"),
      "@lib": resolve(__dirname, "src/lib"),
    },
  },
});
