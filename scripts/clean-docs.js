import { rm } from "fs/promises";

async function main() {
  try {
    await rm(new URL("../docs/api", import.meta.url), {
      recursive: true,
      force: true,
    });
    console.log("docs/api removed");
  } catch (err) {
    console.error("failed to remove docs/api:", err);
    process.exit(1);
  }
}

main();
