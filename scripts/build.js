import { build } from "esbuild";
import { copyFile, glob, rm } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");

try {
  await rm(distDir, { recursive: true, force: true });

  const entryPoints = [];
  for await (const file of glob("src/**/*.ts")) {
    entryPoints.push(file);
  }

  await build({
    entryPoints,
    outdir: distDir,
    outbase: ".",
    platform: "node",
    format: "esm",
    sourcemap: true,
  });

  await copyFile("package.json", path.join(distDir, "package.json"));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
