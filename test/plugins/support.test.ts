import Support from "../../src/plugins/support.js";
import Fastify from "fastify";
import * as assert from "node:assert";
import { test } from "node:test";

test("support works standalone", async (_t) => {
  const fastify = Fastify();
  void fastify.register(Support);
  await fastify.ready();

  assert.equal(fastify.someSupport(), "hugs");
});
