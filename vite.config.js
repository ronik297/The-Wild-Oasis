import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plusgin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
});
