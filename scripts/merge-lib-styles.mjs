import fs from "node:fs";
import path from "node:path";

const themePath = "src/styles/index.css";
const extractedPath = "dist/arxatec-ui.css";
const outPath = "dist/styles.css";

/**
 * Resuelve recursivamente los `@import "./xxx.css"` relativos al directorio
 * del archivo, dejando intactos los imports a paquetes (`@import "tailwindcss"`),
 * URLs externas (`@import url("https://...")`) y las directivas propias de
 * Tailwind v4 (`@source`, `@plugin`, `@custom-variant`).
 *
 * Esto es necesario porque el build de la librería concatena este CSS plano
 * con el extraído por Vite, y los archivos referenciados con `./*.css` no
 * existen en el paquete publicado.
 */
function inlineRelativeImports(filePath, visited = new Set()) {
  const absolute = path.resolve(filePath);
  if (visited.has(absolute)) return "";
  visited.add(absolute);

  const dir = path.dirname(absolute);
  const source = fs.readFileSync(absolute, "utf8");

  return source.replace(
    /^[\t ]*@import\s+(?:url\()?["']([^"']+)["']\)?\s*;[\t ]*\r?\n?/gm,
    (match, spec) => {
      if (!spec.startsWith("./") && !spec.startsWith("../")) return match;
      if (!spec.endsWith(".css")) return match;
      const target = path.resolve(dir, spec);
      if (!fs.existsSync(target)) return match;
      return inlineRelativeImports(target, visited);
    },
  );
}

const theme = inlineRelativeImports(themePath);
const extracted = fs.existsSync(extractedPath)
  ? fs.readFileSync(extractedPath, "utf8")
  : "";
fs.writeFileSync(outPath, theme + (extracted ? `\n${extracted}` : ""));
