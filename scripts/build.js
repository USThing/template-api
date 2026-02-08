import { build } from "esbuild";
import { glob } from "node:fs/promises";

const entryPoints = await glob("src/**/*.ts");

try {
  await build({
    entryPoints,
    outdir: "dist/src",
    outbase: "src",
    platform: "node",
    format: "esm",
    sourcemap: true,
  });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
