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
    (dep) => id === dep || id.startsWith(`${dep}/`),
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
        "file-view": path.resolve(dirname, "src/exports/file-view.ts"),
        "file-view-core": path.resolve(
          dirname,
          "src/exports/file-view-core.ts",
        ),
        "file-view-pdf": path.resolve(dirname, "src/exports/file-view-pdf.ts"),
        "file-view-image": path.resolve(
          dirname,
          "src/exports/file-view-image.ts",
        ),
        "file-view-office": path.resolve(
          dirname,
          "src/exports/file-view-office.ts",
        ),
        "file-view-code": path.resolve(
          dirname,
          "src/exports/file-view-code.ts",
        ),
        "file-view-template": path.resolve(
          dirname,
          "src/exports/file-view-template.ts",
        ),
        "file-view-docx": path.resolve(
          dirname,
          "src/exports/file-view-docx.ts",
        ),
        "file-view-xlsx": path.resolve(
          dirname,
          "src/exports/file-view-xlsx.ts",
        ),
        "file-view-audio": path.resolve(
          dirname,
          "src/exports/file-view-audio.ts",
        ),
        "file-view-video": path.resolve(
          dirname,
          "src/exports/file-view-video.ts",
        ),
        "file-view-summary": path.resolve(
          dirname,
          "src/exports/file-view-summary.ts",
        ),
        "file-view-transcription": path.resolve(
          dirname,
          "src/exports/file-view-transcription.ts",
        ),
        "file-view-lazy": path.resolve(
          dirname,
          "src/exports/file-view-lazy.ts",
        ),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) =>
        !id.startsWith(".") && !path.isAbsolute(id) && isDependencyModule(id),
      output: {
        // Un archivo de salida por módulo de origen, en vez de fundir los 68
        // componentes en un puñado de chunks.
        //
        // El barrel es `export *` de todo, así que quien escriba
        // `import { Button } from "arxatec-ui"` arrastraba el paquete entero:
        // dentro de un único archivo, Rollup solo puede descartar lo que
        // demuestre puro, y `cva(...)`, `forwardRef(...)` o los `createContext`
        // de Radix son llamadas en el ámbito del módulo, que no puede dar por
        // seguras. Con un archivo por módulo el descarte pasa a ser por archivo,
        // que es lo que habilita `sideEffects` del package.json: lo que no se
        // importa no se lee siquiera.
        //
        // Los consumidores no cambian nada: siguen importando de "arxatec-ui",
        // "arxatec-ui/sidebar" y "arxatec-ui/file-view".
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
