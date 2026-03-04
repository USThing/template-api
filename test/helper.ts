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
    pluginTimeout: options.pluginTimeout,
    mongoUri,
    authDiscoveryURL: "",
    authClientID: "",
    authSkip: true,
  };
}

// Automatically build and tear down our instance
async function build(t: TestContext, options?: Partial<AppOptions>) {
  const cleanups: (() => Promise<unknown>)[] = [];
  const cleanup = async () => {
    // Cleanup in reverse order of setup
    for (const fn of cleanups.reverse()) {
      try {
        await fn();
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    }
  };
  t.after(cleanup);

  try {
    const mongod = await MongoMemoryServer.create();
    cleanups.push(async () => await mongod.stop());

    const appOptions = {
      ...(await config(mongod.getUri("example-test"))),
      ...options,
    };
    const fastify = Fastify(appOptions);
    cleanups.push(async () => await fastify.close());

    await fastify.register(app, appOptions);
    await fastify.ready();
    return fastify;
  } catch (error) {
    await cleanup();
    throw error;
  }
}

export { config, build };
