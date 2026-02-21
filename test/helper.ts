// This file contains code that we reuse between our tests.
import app, { AppOptions, options } from "../src/app.js";
import Fastify from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as test from "node:test";

export type TestContext = {
  after: typeof test.after;
};

// Fill in this config with all the configurations
// needed for testing the application
async function config(mongoUri: string): Promise<AppOptions> {
  return {
    mongoUri,
    authDiscoveryURL: "",
    authClientID: "",
    authSkip: true,
  };
}

// Automatically build and tear down our instance
async function build(t: TestContext) {
  const fastify = Fastify({ pluginTimeout: options.pluginTimeout });
  const mongod = await MongoMemoryServer.create();
  const appConfig = await config(mongod.getUri());
  await fastify.register(app, appConfig);
  await fastify.ready();

  // Tear down our app after we are done
  t.after(async () => {
    await fastify.close();
    await mongod.stop();
  });

  return fastify;
}

export { config, build };
