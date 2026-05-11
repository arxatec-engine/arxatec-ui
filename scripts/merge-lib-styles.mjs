import fs from "node:fs";
import path from "node:path";

const themePath = "src/styles/index.css";
const extractedPath = "dist/arxatec-ui.css";
const outPath = "dist/styles.css";
const fontsSrcDir = "src/styles/fonts";
const fontsDestDir = "dist/fonts";

const theme = fs.readFileSync(themePath, "utf8");
const extracted = fs.existsSync(extractedPath)
  ? fs.readFileSync(extractedPath, "utf8")
  : "";
fs.writeFileSync(outPath, theme + (extracted ? `\n${extracted}` : ""));

if (fs.existsSync(fontsSrcDir)) {
  fs.rmSync(fontsDestDir, { recursive: true, force: true });
  fs.mkdirSync(fontsDestDir, { recursive: true });
  for (const name of fs.readdirSync(fontsSrcDir)) {
    fs.copyFileSync(
      path.join(fontsSrcDir, name),
      path.join(fontsDestDir, name),
    );
  }
}
