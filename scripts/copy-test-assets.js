import { cp } from "fs/promises";
import path from "path";

const src = path.resolve("test");
const dest = path.resolve("dist", "test");

async function main() {
  try {
    // Copy everything under test to dist/test but skip TypeScript source files (.ts)
    await cp(src, dest, {
      recursive: true,
      filter: (srcPath) => {
        // Skip .ts files (keep .json, .html, .ics, etc.)
        if (srcPath.endsWith(".ts")) return false;
        return true;
      },
    });
    console.error("Copied test assets to", dest);
  } catch (err) {
    console.error("Failed to copy test assets:", err);
    process.exitCode = 1;
  }
}

main();
