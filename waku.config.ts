import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "waku/config";

export default defineConfig({
  vite: {
    server: {
      watch: {
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/dist/**",
          "**/*.gen.ts",
        ],
        usePolling: false,
      },
    },
    plugins: [
      tailwindcss(),
      // @ts-ignore
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
    ],
  },
});
