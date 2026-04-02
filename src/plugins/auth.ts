import { mergeResponse, ResponseSchema } from "../utils/schema.js";
import { UnionOneOf } from "../utils/typebox/union-oneof.js";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import * as jose from "jose";
import { JWTClaimValidationFailed } from "jose/errors";
import { Type } from "typebox";

/**
 * This module supports auth with accounts from ust.hk and connect.ust.hk
 * tenants. In addition, it is planned to support the usthing.xyz tenant for
 * development and testing purposes.
 */
const Tenants = ["ust.hk", "connect.ust.hk", "usthing.xyz"] as const;

/**
 * The union of all tenant string literals.
 */
type Tenant = (typeof Tenants)[number];

/**
 * The tenant IDs for the supported tenants. The ust.hk and connect.ust.hk
 * tenant IDs are obtained from the real tokens (they can be also obtained using
 * tools such as https://www.whatismytenantid.com/), while the usthing.xyz
 * tenant is currently just a placeholder.
 */
const TenantID = {
  "ust.hk": "c917f3e2-9322-4926-9bb3-daca730413ca",
  "connect.ust.hk": "6c1d4152-39d0-44ca-88d9-b8d6ddca0708",
  "usthing.xyz": "N/A",
} as const satisfies Record<Tenant, string>;

/**
 * The OpenID Connect issuer URLs for the supported tenants. The ust.hk and
 * connect.ust.hk issuer URLs follow the standard Microsoft identity platform
 * format, while the usthing.xyz issuer is currently just a placeholder.
 */
const Issuers = {
  "ust.hk": `https://login.microsoftonline.com/${TenantID["ust.hk"]}/v2.0`,
  "connect.ust.hk": `https://login.microsoftonline.com/${TenantID["connect.ust.hk"]}/v2.0`,
  "usthing.xyz": "N/A",
} as const satisfies Record<Tenant, string>;

/**
 * The JWKS URL for verifying tokens. Since both ust.hk and connect.ust.hk
 * tenants are from Microsoft Entra ID, they share the same common JWKS.
 */
const JWKS = "https://login.microsoftonline.com/common/discovery/v2.0/keys";

/**
 * The client ID for the USThing app. The audience claim in the token must match
 * this value.
 */
const ClientID = "b4bc4b9a-7162-44c5-bb50-fe935dce1f5a";

/**
 * Helper function to map tenant IDs to tenant string literals.
 */
const Tenant = (tid: string) => {
  for (const tenant of Tenants) {
    if (TenantID[tenant] === tid) {
      return tenant;
    }
  }
  throw new Error(`Unknown tenant ID: ${tid}`);
};

export interface AuthPluginOptions {
  /**
   * If true, skip token verification entirely.
   *
   * This mode is intended for local development and tests. If true, the plugin
   * does not require an Authorization header and still populates `request.auth`
   * with a fixed identity of `user = "test"`, `email = "test@usthing.xyz"`,
   * `name = "USThing Test"`, and `tenant = "usthing.xyz"`. The response also
   * includes `X-Auth-Skip: 1` to make bypass mode explicit.
   */
  authSkip?: boolean;
}

export const AuthResponseSchema: ResponseSchema = {
  400: UnionOneOf(
    [
      Type.Literal("Invalid Authorization Header", {
        description: "The Authorization header is invalid.",
      }),
      Type.Literal("Invalid Authorization Scheme", {
        description: "The Authorization scheme is invalid.",
      }),
    ],
    {
      description: "The errors from the authentication middleware.",
    },
  ),
  401: UnionOneOf(
    [
      Type.Literal("Missing Authorization Header", {
        description: "The Authorization header is missing.",
      }),
      Type.Any({
        description:
          "The error message from token verification or claim validation. " +
          "Usually indicates an invalid token.",
      }),
    ],
    {
      description: "The errors from the authentication middleware.",
    },
  ),
};

/**
 * The auth plugin verifies the Bearer token in the Authorization header using
 * the JWKS from Microsoft Entra ID, additionally verifying that
 *
 * 1. the token's audience is indeed USThing app;
 * 2. the token's issuer is one of ust.hk and connect.ust.hk;
 * 3. the token's tenant is one of ust.hk and connect.ust.hk.
 *
 * It modifies the schema for all routes the plugin affects, by merging 400 and
 * 401 responses from the plugin with the route's own responses, and by adding
 * the `Auth` security scheme to the route's security requirements.
 *
 * After a sucessful authentication or bypass in skip mode, the plugin populates
 * `request.auth` with an object containing the authenticated user's email,
 * name, tenant, and a derived `user` field which is the ITSC account of the
 * user.
 */
const auth: FastifyPluginAsync<AuthPluginOptions> = async (fastify, opts) => {
  const { authSkip: skip = false } = opts;

  if (skip) {
    fastify.log.warn("[AuthPlugin] SKIP_AUTH is on.");
  }

  fastify.addHook("onRoute", (routeOptions) => {
    routeOptions.schema = routeOptions.schema || {};
    routeOptions.schema.response = routeOptions.schema.response || {};
    routeOptions.schema.response = mergeResponse([
      routeOptions.schema.response as never,
      AuthResponseSchema,
    ]);
    routeOptions.schema.security = routeOptions.schema.security || [];
    routeOptions.schema.security = [
      ...routeOptions.schema.security,
      { Auth: [] },
    ];
  });

  const jwks = jose.createRemoteJWKSet(new URL(JWKS));

  fastify.decorateRequest("auth");
  fastify.addHook(
    "preHandler",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (skip) {
        request.auth = {
          email: "test@usthing.xyz",
          user: "usthing",
          name: "USThing Test",
          tenant: "usthing.xyz",
        };
        reply.header("X-Auth-Skip", "1");
        return;
      }

      // Extract the authorization header from the request
      const { authorization } = request.headers;
      if (authorization == undefined) {
        return reply.status(401).send("Missing Authorization Header");
      }

      // Extract the scheme and token from the authorization header
      const parts = authorization.trim().split(/\s+/);
      if (parts.length !== 2) {
        return reply.status(400).send("Invalid Authorization Header");
      }
      const [type, token] = parts;
      if (type !== "Bearer") {
        return reply.status(400).send("Invalid Authorization Scheme");
      }

      try {
        // The issuer is equivalently verified above by looking at the `tid`
        // claim and using the corresponding JWKS.
        const jwt = await jose.jwtVerify(token, jwks, {
          audience: ClientID,
          issuer: Object.values(Issuers),
          requiredClaims: ["aud", "iss", "tid", "unique_name", "name"],
        });
        const payload = jwt.payload as {
          aud: string;
          iss: string;
          tid: string;
          unique_name: string;
          name: string;
        };

        if ((Object.values(Issuers) as string[]).includes(payload.tid)) {
          throw new JWTClaimValidationFailed(
            'unexpected "tid" claim value',
            payload,
            "tid",
            "check_failed",
          );
        }

        // Derive the ITSC ID from the unique_name claim, which effectively
        // serves as the email address. We assume the email is well-formed, and
        // if it isn't, it just returns the entire unique_name, which is still
        // fine.
        const user = (() => {
          const [local] = payload.unique_name.split("@");
          return local;
        })();

        request.auth = {
          email: payload.unique_name,
          user: user,
          name: payload.name,
          tenant: Tenant(payload.tid),
        };
      } catch (e) {
        if (e instanceof Error) {
          return reply.status(401).send(`Invalid Token: ${e.message}`);
        }
        throw e;
      }
    },
  );
};

export default fp(auth, {
  name: "auth",
  encapsulate: true,
});

declare module "fastify" {
  export interface FastifyRequest {
    /**
     * The information of the auth'd user.
     *
     * For ease of use, the field is not optional (nullable), which means
     * accessing it in routes without the plugin still typechecks. Programmers
     * should be aware to only use `request.auth` in routes that are registered
     * after the plugin.
     */
    auth: {
      email: string;
      user: string;
      name: string;
      tenant: Tenant;
    };
  }
}
