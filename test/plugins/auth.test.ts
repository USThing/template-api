import Auth from "../../src/plugins/auth.js";
import Fastify, { FastifyInstance } from "fastify";
import * as assert from "node:assert";
import * as process from "node:process";
import { afterEach, beforeEach, suite, test } from "node:test";

await suite("auth plugin", async () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    await fastify.register(Auth, {
      authDiscoveryURL:
        "https://login.microsoftonline.com/c917f3e2-9322-4926-9bb3-daca730413ca/v2.0/.well-known/openid-configuration",
      authClientID: "b4bc4b9a-7162-44c5-bb50-fe935dce1f5a",
    });
    fastify.get(
      "/secret",
      { preHandler: fastify.auth },
      async (request) => request.user,
    );
    await fastify.ready();
  });
  afterEach(async () => {
    await fastify.close();
  });

  await test("missing authorization header", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
    });
    // Unauthorized
    assert.equal(response.statusCode, 401);
  });
  await test("invalid authorization header", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "[invalid authorization header]",
      },
    });
    // Unauthorized
    assert.equal(response.statusCode, 401);
  });
  await test("invalid authorization scheme", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "Basic INVALID",
      },
    });
    // Unauthorized
    assert.equal(response.statusCode, 401);
  });
  await test("invalid token", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "Bearer INVALID",
      },
    });
    // Unauthorized
    assert.equal(response.statusCode, 401);
  });

  const token = process.env.TEST_AUTH_TOKEN;
  const user = process.env.TEST_AUTH_USER;

  await test(
    "valid token",
    { skip: token === undefined || user === undefined },
    async () => {
      const response = await fastify.inject({
        method: "GET",
        url: "/secret",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // OK
      assert.equal(response.statusCode, 200);
      assert.equal(response.body, user);
    },
  );
});

await suite("auth plugin with skipping", async () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    await fastify.register(Auth, {
      authDiscoveryURL: "",
      authClientID: "",
      authSkip: true,
    });
    fastify.get("/secret", { preHandler: fastify.auth }, async () => "ok");
    await fastify.ready();
  });
  afterEach(async () => {
    await fastify.close();
  });

  await test("missing authorization header", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
    });
    // OK
    assert.equal(response.statusCode, 200);
    assert.equal(response.payload, "ok");
  });
  await test("invalid authorization header", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "[invalid authorization header]",
      },
    });
    // OK
    assert.equal(response.statusCode, 200);
    assert.equal(response.payload, "ok");
  });
  await test("invalid authorization scheme", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "Basic INVALID",
      },
    });
    // OK
    assert.equal(response.statusCode, 200);
    assert.equal(response.payload, "ok");
  });
  await test("invalid token", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "Bearer INVALID",
      },
    });
    // OK
    assert.equal(response.statusCode, 200);
    assert.equal(response.payload, "ok");
  });

  const token = process.env.TEST_AUTH_TOKEN;

  await test("valid token", { skip: token === undefined }, async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // OK
    assert.equal(response.statusCode, 200);
    assert.equal(response.payload, "ok");
  });
});
