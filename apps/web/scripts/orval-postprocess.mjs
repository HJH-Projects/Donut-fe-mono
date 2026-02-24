import { promises as fs } from "node:fs";
import path from "node:path";

const toKebabCase = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const rootDir = process.cwd();
const generatedDir = path.join(rootDir, "shared", "api", "orval");
const destinationRoot = path.join(rootDir, "shared", "api");

const run = async () => {
  let entries = [];

  try {
    entries = await fs.readdir(generatedDir, { withFileTypes: true });
  } catch {
    return;
  }

  const endpointFiles = entries.filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "endpoints.ts" &&
      entry.name !== "index.ts",
  );

  for (const file of endpointFiles) {
    const sourcePath = path.join(generatedDir, file.name);
    const tagName = toKebabCase(path.basename(file.name, ".ts"));
    const targetDir = path.join(destinationRoot, tagName);
    const targetPath = path.join(targetDir, "index.ts");

    await fs.mkdir(targetDir, { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
  }
};

await run();
