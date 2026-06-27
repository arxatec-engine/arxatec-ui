import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const sourceDir = path.resolve("src/styles/fonts");
const targetDir = path.resolve("dist/fonts");

if (!existsSync(sourceDir)) {
    throw new Error(`Fonts source directory not found: ${sourceDir}`);
}

await mkdir(targetDir, { recursive: true });
await cp(sourceDir, targetDir, { recursive: true });

console.log(`Copied fonts from ${sourceDir} to ${targetDir}`);