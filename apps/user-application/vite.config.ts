import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  optimizeDeps: {
    exclude: ["fsevents"],
  },
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          preserveEntrySignatures: "strict",
        },
      },
    },
  },
  server: {
    port: 3000,
    allowedHosts: ["ef54240d0784.ngrok-free.app"],
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      experimental: {
        remoteBindings: true,
      },
    }),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
