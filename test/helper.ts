// This file contains code that we reuse between our tests.
import helper from "fastify-cli/helper.js";
import * as test from "node:test";
import * as path from "path";
import { fileURLToPath } from "url";
import { AppOptions } from "../src/app.js";
import fastifyMultipart from "@fastify/multipart";

export type TestContext = {
  after: typeof test.after;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AppPath = path.join(__dirname, "..", "src", "app.ts");

// Fill in this config with all the configurations
// needed for testing the application
async function config(): Promise<AppOptions> {
  return {
    ajv: {
      plugins: [fastifyMultipart.ajvFilePlugin],
    },

    mongoUri: "mongodb://localhost:27017/test-api-static",
    authDiscoveryURL: "",
    authClientID: "",
    authSkip: true,
    apkKey: "964a06a7-1fb9-42f3-8d1d-981284a14227",
  };
}

// Automatically build and tear down our instance
async function build(t: TestContext) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, await config(), await config());

  // Tear down our app after we are done
  t.after(() => void app.close());

  return app;
}

export { config, build };
