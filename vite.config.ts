import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: './' makes the build use relative asset paths so it works
// regardless of the GitHub Pages sub-path (username.github.io/repo-name/)
// without needing to hardcode the repository name here.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
