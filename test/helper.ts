// This file contains code that we reuse between our tests.
import app, { AppOptions, options } from "../src/app.js";
import Fastify from "fastify";
import * as test from "node:test";

export type TestContext = {
  after: typeof test.after;
};

// Fill in this config with all the configurations
// needed for testing the application
async function config(): Promise<AppOptions> {
  return {
    pluginTimeout: options.pluginTimeout,
    // mongoUri: "mongodb://localhost:27017",
    authDiscoveryURL: "",
    authClientID: "",
    authSkip: true,
  };
}

// Automatically build and tear down our instance
async function build(t: TestContext, options?: Partial<AppOptions>) {
  const appOptions = { ...(await config()), ...options };

  const fastify = Fastify(appOptions);
  await fastify.register(app, appOptions);
  await fastify.ready();

  // Tear down our app after we are done
  t.after(async () => {
    await fastify.close();
  });

  return fastify;
}

export { config, build };
