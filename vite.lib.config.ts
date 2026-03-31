import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = require("./package.json") as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const bundleableDependencyIds = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

function isDependencyModule(id: string) {
  return bundleableDependencyIds.some(
    (dep) => id === dep || id.startsWith(`${dep}/`)
  );
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: "./tsconfig.lib.json",
      entryRoot: "src",
      exclude: [
        "**/*.stories.*",
        "**/main.tsx",
        "**/pages/**",
        "**/vite.config.ts",
        "**/vite.lib.config.ts",
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(dirname, "src/exports/index.ts"),
        sidebar: path.resolve(dirname, "src/exports/sidebar.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) =>
        !id.startsWith(".") && !path.isAbsolute(id) && isDependencyModule(id),
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
