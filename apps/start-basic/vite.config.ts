import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  optimizeDeps: {
    include: ["lucide-react", "@radix-ui/*", "class-variance-authority"],
  },
  ssr: {
    noExternal: [
      "lucide-react",
      "@radix-ui/*",
      "class-variance-authority",
      "react-dom",
    ],
  },
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),

    tanstackStart({
      srcDirectory: "src",
      start: { entry: "./start.tsx" },
      server: { entry: "./server.ts" },
    }),
    viteReact(),
    cloudflare({
      viteEnvironment: { name: "ssr" },
    }),
  ],
});
