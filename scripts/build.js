import { build } from "esbuild";
import { copyFile, glob, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const distSrcDir = path.join(distDir, "src");

try {
  await rm(distSrcDir, { recursive: true, force: true });
  await mkdir(distSrcDir, { recursive: true });

  const entryPoints = await glob("src/**/*.ts");

  await build({
    entryPoints,
    outdir: distSrcDir,
    outbase: "src",
    platform: "node",
    format: "esm",
    sourcemap: true,
  });

  await copyFile("package.json", path.join(distDir, "package.json"));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
