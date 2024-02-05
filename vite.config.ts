import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from "vite-plugin-pages";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages({
      pagesDir: "src/pages",
      exclude: ["**/components/*.vue"],
    }),
  ],
  build: {
    assetsDir: 'static'
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "src"),
    },
  },
})
