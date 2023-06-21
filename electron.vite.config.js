import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig(async () => {
  const mdx = await import("@mdx-js/rollup");
  return {
    main: {
      plugins: [externalizeDepsPlugin()]
    },
    preload: {
      plugins: [externalizeDepsPlugin()]
    },
    renderer: {
      resolve: {
        alias: {
          "@renderer": resolve("src/renderer/src")
        }
      },
      plugins: [react(), mdx.default()]
    }
  };
});
