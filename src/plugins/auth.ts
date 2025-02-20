import { ResponseSchema } from "../utils/schema.js";
import { UnionOneOf } from "../utils/typebox/union-oneof.js";
import { Type } from "@sinclair/typebox";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { skipSubjectCheck } from "oauth4webapi";
import * as client from "openid-client";
import { WWWAuthenticateChallengeError } from "openid-client";

export interface AuthPluginOptions {
  /** The discovery URL of the OpenID Connect provider. */
  authDiscoveryURL: string;
  /** The client ID of the OpenID Connect client. */
  authClientID: string;
  /**
   * Whether to skip the authentication process. This is useful for testing.
   *
   * If true, the `authDiscoveryURL` and `authClientID` are not required. Users
   * may pass empty strings to pass type checking.
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
          "The error message from the OpenID Connect provider. " +
          "Usually indicates an invalid token. ",
      }),
    ],
    {
      description: "The errors from the authentication middleware.",
    },
  ),
};

/**
 * The Auth plugin adds authentication ability to the Fastify instance.
 *
 * For usage, see the /routes/auth-example/index.ts file.
 *
 * @see authExample
 */
export default fp<AuthPluginOptions>(async (fastify, opts) => {
  const skip = opts.authSkip ?? false;

  if (skip) {
    fastify.log.warn("Skip Auth: ON");
  }

  const config = await (async () => {
    if (skip) {
      return null;
    } else {
      return await client.discovery(
        new URL(opts.authDiscoveryURL),
        opts.authClientID,
      );
    }
  })();

  fastify.log.info(
    { opts, metadata: config?.serverMetadata() },
    "Successfully discovered the OpenID Connect provider.",
  );

  fastify.decorateRequest("user", undefined);
  fastify.decorate(
    "auth",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (skip || !config) {
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

      // Verify the token with the client
      try {
        const info = await client.fetchUserInfo(
          config,
          token,
          skipSubjectCheck,
        );
        request.user = info.email && getUsernameFromEmail(info.email);
      } catch (e) {
        if (
          e instanceof WWWAuthenticateChallengeError &&
          e.response?.status === 401
        ) {
          return reply
            .status(401)
            .type("application/json")
            .send(await e.response.json());
        }
        throw e;
      }
    },
  );
});

function getUsernameFromEmail(email: string): string {
  return email.split("@")[0];
}

declare module "fastify" {
  export interface FastifyInstance {
    auth(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  export interface FastifyRequest {
    user?: string;
  }
}
