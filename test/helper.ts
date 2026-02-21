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
  const mongod = await MongoMemoryServer.create();
  const fastify = Fastify({ pluginTimeout: options.pluginTimeout });

  const cleanup = async () => {
    await fastify.close();
    await mongod.stop();
  };
  t.after(cleanup);

  try {
    const appConfig = await config(mongod.getUri("example-test"));
    await fastify.register(app, appConfig);
    await fastify.ready();
    return fastify;
  } catch (error) {
    await cleanup();
    throw error;
  }
}

export { config, build };
