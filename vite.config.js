import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  root: "./src",
  publicDir: "../public",
  base: process.env.VITE_BASE_PATH || "/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    open: true,
    port: 3000,
  },
})
