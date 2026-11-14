import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const notices = [];
for (const name of ["exceljs", "ssf", "xlsx"]) {
  const directory = path.dirname(require.resolve(name));
  const metadata = JSON.parse(
    await readFile(path.join(directory, "package.json"), "utf8"),
  );
  const license = await readFile(path.join(directory, "LICENSE"), "utf8");
  notices.push(`${name} ${metadata.version}\n${license}`);
}
await mkdir("dist/assets", { recursive: true });
await writeFile(
  "dist/assets/spreadsheet-licenses.txt",
  notices.join("\n\n--------------------\n\n"),
);
