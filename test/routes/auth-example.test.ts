import { build } from "../helper.js";
import * as assert from "node:assert";
import { test } from "node:test";

test("auth-example routes are protected without leaking to public routes", async (t) => {
  const app = await build(t, {
    authSkip: false,
  });

  const protectedRes = await app.inject({
    url: "/auth-example",
  });
  assert.equal(protectedRes.statusCode, 401);

  const publicRes = await app.inject({
    url: "/example",
  });
  assert.equal(publicRes.statusCode, 200);
  assert.equal(publicRes.payload, "this is an example");
});
