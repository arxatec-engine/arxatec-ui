import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const notices = [];
for (const [name, licenseFiles] of [
  ["@web-ppt/core", ["LICENSE"]],
  ["mtx-decompressor", ["LICENSE"]],
  ["dompurify", ["LICENSE", "LICENSE-MPL", "LICENSE-APACHE"]],
]) {
  let directory = path.dirname(fileURLToPath(import.meta.resolve(name)));
  while (true) {
    try {
      const metadata = JSON.parse(
        await readFile(path.join(directory, "package.json"), "utf8"),
      );
      if (metadata.name === name) {
        const licenses = [];
        for (const file of licenseFiles) {
          try {
            licenses.push(await readFile(path.join(directory, file), "utf8"));
          } catch (error) {
            if (error.code !== "ENOENT") throw error;
          }
        }
        if (!licenses.length) throw new Error(`Missing license for ${name}`);
        notices.push(
          `${name} ${metadata.version}\n${metadata.homepage ?? metadata.repository?.url ?? ""}\n${licenses.join("\n")}`,
        );
        break;
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const parent = path.dirname(directory);
    if (directory === parent) throw new Error(`Package not found: ${name}`);
    directory = parent;
  }
}
await mkdir("dist/assets", { recursive: true });
await writeFile(
  "dist/assets/presentation-licenses.txt",
  notices.join("\n\n--------------------\n\n"),
);
