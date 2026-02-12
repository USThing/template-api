import { rm } from "node:fs/promises";

try {
  await rm("dist", { recursive: true, force: true });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
