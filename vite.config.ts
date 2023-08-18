import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  // root: "./src", 今回は直下に index.html があるため不要
  build: {
    outDir: "./dist",
  },
  base: "/tsukutte-asobu2023/",
  plugins: [react()],
});
