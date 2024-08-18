import fp from "fastify-plugin";
import { FastifyReply, FastifyRequest } from "fastify";
import { BaseClient, errors, Issuer, TokenSet } from "openid-client";
import OPError = errors.OPError;

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

  const client = await (async () => {
    if (skip) {
      return null;
    } else {
      const issuer = await Issuer.discover(opts.authDiscoveryURL);
      return new issuer.Client({ client_id: opts.authClientID });
    }
  })();

  fastify.decorateRequest("user", undefined);
  fastify.decorate(
    "auth",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (skip || !client) {
        return;
      }

      // Extract the authorization header from the request
      const { authorization } = request.headers;
      if (authorization == undefined) {
        return reply.status(401).send("Missing Authorization Header");
      }

      // Extract the scheme and token from the authorization header
      const [type, token] = authorization.split(" ");
      if (type !== "Bearer") {
        return reply.status(401).send("Invalid Authorization Scheme");
      }

      // Verify the token with the client
      try {
        const info = await client.userinfo(
          new TokenSet({ access_token: token }),
        );
        request.user = info.email && getUsernameFromEmail(info.email);
      } catch (e) {
        if (e instanceof OPError && e.response?.statusCode === 401) {
          return reply
            .status(401)
            .type("application/json")
            .send(e.response.body?.toString());
        }
        throw e;
      }
    },
  );
});

function getUsernameFromEmail(email: string): string {
  return email.split("@")[0];
}

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    authClient: BaseClient;

    auth(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  export interface FastifyRequest {
    user?: string;
  }
}
