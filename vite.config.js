import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  root: "./src",
  base: process.env.VITE_BASE_PATH || "/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
})
