import { mergeResponse, ResponseSchema } from "../utils/schema.js";
import { UnionOneOf } from "../utils/typebox/union-oneof.js";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import * as jose from "jose";
import { Type } from "typebox";

const TenantID = {
  "ust.hk": "c917f3e2-9322-4926-9bb3-daca730413ca",
  "connect.ust.hk": "6c1d4152-39d0-44ca-88d9-b8d6ddca0708",
} as const;

type Tenant = keyof typeof TenantID;

const ClientID = "b4bc4b9a-7162-44c5-bb50-fe935dce1f5a";

const jwks = (tenant: Tenant) =>
  `https://login.microsoftonline.com/${TenantID[tenant]}/discovery/v2.0/keys`;

const Tenant = (tid: string) => {
  for (const tenant in TenantID) {
    if (TenantID[tenant as Tenant] === tid) {
      return tenant as Tenant;
    }
  }
  throw new Error(`Unknown tenant ID: ${tid}`);
};

const parseITSC = (email: string): string => {
  const match = email.match(/^([^@]+)@([^@]+)$/);
  if (match == null) {
    throw new Error(`Invalid email format: ${email}`);
  }
  const [, local] = match;
  return local;
};

export interface AuthPluginOptions {
  /**
   * Whether to skip token verification entirely. This mode is intended for
   * local development and tests where an external identity provider may not be
   * available. When enabled, the plugin does not require an Authorization
   * header and still populates `request.auth` with a fixed identity of
   * `user = "usthing"`, `email = "usthing@ust.hk"`, `name = "USThing"`, and
   * `tenant = "ust.hk"`. The response also includes `X-Auth-Skip: 1` to make
   * bypass mode explicit.
   */
  authSkip?: boolean;
}

/**
 * Standard authentication error response schema merged into every route by the
 * plugin's `onRoute` hook. The plugin appends OpenAPI security requirements
 * and these 400/401 response variants to route schemas automatically. The
 * 400 responses represent malformed Authorization headers or unsupported
 * schemes, while 401 responses represent missing headers and token
 * verification or claim-validation failures.
 */
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
 * Auth plugin for Azure AD token verification and request identity decoration.
 * The plugin decorates `FastifyRequest` with `request.auth`, injects
 * `security: [{ Auth: [] }]` and {@link AuthResponseSchema} into all route
 * schemas through `onRoute`, and enforces authentication globally by
 * registering a plugin-level `preHandler` hook. Because the plugin is
 * encapsulated, it must be applied on the same Fastify scope that defines the
 * protected routes, or on an ancestor of that scope. In normal mode, the hook
 * expects an `Authorization: Bearer <token>` header, requires `tid`, `email`,
 * and `name` claims, maps `tid` to a known tenant, and verifies the token
 * against tenant-specific Microsoft JWKS with the configured audience
 * (`ClientID`). Missing headers, malformed header formats, invalid schemes,
 * missing required claims, and verification failures are returned as 400/401
 * responses as appropriate. On success, the plugin sets
 * `request.auth = { email, user, name, tenant }` and emits response headers
 * `X-Auth-User`, `X-Auth-Email`, `X-Auth-Name`, and `X-Auth-Tenant`; in skip
 * mode it additionally emits `X-Auth-Skip: 1`.
 */
const auth: FastifyPluginAsync<AuthPluginOptions> = async (fastify, opts) => {
  const { authSkip: skip = false } = opts;

  if (skip) {
    fastify.log.warn("[AuthPlugin] SKIP_AUTH is on.");
  }

  fastify.addHook("onRoute", (routeOptions) => {
    routeOptions.schema = routeOptions.schema || {};
    routeOptions.schema.security = routeOptions.schema.security || [];
    routeOptions.schema.security = [
      ...routeOptions.schema.security,
      { Auth: [] },
    ];
    routeOptions.schema.response = routeOptions.schema.response || {};
    routeOptions.schema.response = mergeResponse([
      routeOptions.schema.response as never,
      AuthResponseSchema,
    ]);
  });

  const JWKS = {
    "ust.hk": jose.createRemoteJWKSet(new URL(jwks("ust.hk"))),
    "connect.ust.hk": jose.createRemoteJWKSet(new URL(jwks("connect.ust.hk"))),
  };

  fastify.decorateRequest("auth");
  fastify.addHook(
    "preHandler",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (skip) {
        request.auth = {
          email: "usthing@ust.hk",
          user: "usthing",
          name: "USThing",
          tenant: "ust.hk",
        };
        reply.header("X-Auth-Skip", "1");
        reply.header("X-Auth-User", request.auth.user);
        reply.header("X-Auth-Email", request.auth.email);
        reply.header("X-Auth-Name", request.auth.name);
        reply.header("X-Auth-Tenant", request.auth.tenant);
        return;
      }

      // Extract the authorization header from the request
      const { authorization } = request.headers;
      if (authorization == undefined) {
        return reply.status(401).send("Missing Authorization Header");
      }

      // Extract the scheme and token from the authorization header
      const parts = authorization.split(" ");
      if (parts.length !== 2) {
        return reply.status(400).send("Invalid Authorization Header");
      }
      const [type, token] = parts;
      if (type !== "Bearer") {
        return reply.status(400).send("Invalid Authorization Scheme");
      }

      try {
        const jwt = jose.decodeJwt(token);
        if (jwt.tid == undefined || typeof jwt.tid !== "string") {
          return reply
            .status(401)
            .send(`Invalid Token: missing or invalid tid claim ${jwt.tid}`);
        }

        const tenant = Tenant(jwt.tid);

        // The issuer is equivalently verified above by looking at the `tid`
        // claim and using the corresponding JWKS.
        await jose.jwtVerify(token, JWKS[tenant], {
          audience: ClientID,
        });

        if (
          jwt.unique_name == undefined ||
          typeof jwt.unique_name !== "string"
        ) {
          return reply
            .status(401)
            .send(
              `Invalid Token: missing or invalid unique_name claim ${jwt.unique_name}`,
            );
        }

        if (jwt.name == undefined || typeof jwt.name !== "string") {
          return reply
            .status(401)
            .send(`Invalid Token: missing or invalid name claim ${jwt.name}`);
        }

        const user = parseITSC(jwt.unique_name);

        request.auth = {
          email: jwt.unique_name,
          user: user,
          name: jwt.name,
          tenant,
        };
        reply.header("X-Auth-User", request.auth.user);
        reply.header("X-Auth-Email", request.auth.email);
        reply.header("X-Auth-Name", request.auth.name);
        reply.header("X-Auth-Tenant", request.auth.tenant);
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
     * The `request.auth` object populated by the Auth plugin's `preHandler`
     * hook. It contains the authenticated user's email, name, tenant, and a
     * derived `user` field which is the ITSC (the local part of the email). The
     * presence of this object indicates successful authentication; if
     * authentication fails, the request is rejected with a 400/401 response
     * before reaching any route handlers. In skip mode, this object is still
     * populated with a fixed identity for testing purposes.
     *
     * For ease of use, the plugin is not marked as optional, which means
     * accessing it in routes without the plugin still typechecks. Programmers
     * should be aware that to only use `request.auth` in routes that are
     * registered after the plugin.
     */
    auth: {
      email: string;
      user: string;
      name: string;
      tenant: Tenant;
    };
  }
}
