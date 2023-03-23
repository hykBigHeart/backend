import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import gzipPlugin from "rollup-plugin-gzip";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [gzipPlugin()],
    },
  },
});
