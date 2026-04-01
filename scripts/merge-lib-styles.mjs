import fs from "node:fs";

const themePath = "src/styles/index.css";
const extractedPath = "dist/arxatec-ui.css";
const outPath = "dist/styles.css";

const theme = fs.readFileSync(themePath, "utf8");
const extracted = fs.existsSync(extractedPath)
  ? fs.readFileSync(extractedPath, "utf8")
  : "";
fs.writeFileSync(outPath, theme + (extracted ? `\n${extracted}` : ""));
