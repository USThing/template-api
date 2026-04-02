import auth from "../../src/plugins/auth.js";
import Fastify, { FastifyInstance } from "fastify";
import * as assert from "node:assert";
import { afterEach, beforeEach, suite, test } from "node:test";

await suite("auth plugin", async () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    await fastify.register(async function (fastify) {
      await auth(fastify, {});
      fastify.get("/secret", async (request) => request.auth.user);
    });
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
    // Bad Request
    assert.equal(response.statusCode, 400);
  });
  await test("invalid authorization scheme", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "Basic INVALID",
      },
    });
    // Bad Request
    assert.equal(response.statusCode, 400);
  });
  await test("invalid token", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization: "Bearer e30.e30.e30",
      },
    });
    // Unauthorized
    assert.equal(response.statusCode, 401);
  });

  await test("token verification failure", async () => {
    const response = await fastify.inject({
      method: "GET",
      url: "/secret",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWQiOiJjOTE3ZjNlMi05MzIyLTQ5MjYtOWJiMy1kYWNhNzMwNDEzY2EiLCJlbWFpbCI6InRlc3RAdXN0LmhrIiwibmFtZSI6IlRlc3QifQ.invalidsig",
      },
    });
    // Unauthorized
    assert.equal(response.statusCode, 401);
  });
});

await suite("auth plugin with skipping", async () => {
  let fastify: FastifyInstance;

  beforeEach(async () => {
    fastify = Fastify();
    await fastify.register(async function (fastify) {
      await auth(fastify, {
        authSkip: true,
      });
      fastify.get("/secret", async () => "ok");
    });
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
});
