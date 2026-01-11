import { build } from "../helper.js";
import * as assert from "node:assert";
import { test } from "node:test";

test("metrics route without key", async (t) => {
  const app = await build(t);

  const response = await app.inject({
    url: "/metrics",
  });

  assert.equal(response.statusCode, 200);
});

test("metrics route with key", async (t) => {
  const app = await build(t, { prometheusKey: "secret" });

  // Without auth header
  const response = await app.inject({
    url: "/metrics",
  });
  assert.equal(response.statusCode, 401);

  // With correct auth header
  const responseAuth = await app.inject({
    url: "/metrics",
    headers: {
      authorization: "Bearer secret",
    },
  });
  assert.equal(responseAuth.statusCode, 200);

  // With incorrect auth header
  const responseBadAuth = await app.inject({
    url: "/metrics",
    headers: {
      authorization: "Bearer wrong",
    },
  });
  assert.equal(responseBadAuth.statusCode, 401);
});
