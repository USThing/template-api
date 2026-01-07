import packageJson from "../package.json" with { type: "json" };
import { AuthPluginOptions } from "./plugins/auth.js";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginAsync,
  FastifyServerOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { createRequire } from "module";
import * as path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const fastifyMetrics = require("fastify-metrics");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
  // MongoDB URI (Optional)
  // mongoUri: string;
  lokiHost?: string;
} & FastifyServerOptions &
  Partial<AutoloadPluginOptions> &
  AuthPluginOptions;

const missingOptions: string[] = [];

function getOption(
  envName: string,
  required: boolean = true,
): string | undefined {
  const env = process.env[envName];
  if (env === undefined && required) {
    missingOptions.push(envName);
  }
  return env;
}

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  // Launching lots of services on the server,
  // especially at the same time by something such as docker compose up,
  // leads to slow startups.
  // This increases the timeout for plugins to 5 minutes.
  pluginTimeout: 5 * 60 * 1000,

  // mongoUri: getOption("MONGO_URI")!,
  authDiscoveryURL: getOption("AUTH_DISCOVERY_URL")!,
  authClientID: getOption("AUTH_CLIENT_ID")!,
  lokiHost: getOption("LOKI_HOST", false),
  authSkip: (() => {
    const opt = getOption("AUTH_SKIP", false);
    if (opt !== undefined) {
      return Boolean(opt);
    } else {
      return undefined;
    }
  })(),
};

if (options.lokiHost) {
  options.logger = {
    level: "info",
    transport: {
      target: "pino-loki",
      options: {
        batching: true,
        interval: 5,
        host: options.lokiHost,
        labels: { application: "template-service" },
      },
    },
  };
}

// Support Typebox
export type FastifyTypebox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Place here your custom code!

  missingOptions.forEach((opt) => {
    fastify.log.warn(`Missing required option: ${opt}`);
  });

  // Register CORS
  await fastify.register(import("@fastify/cors"), {
    origin: "*",
  });

  // Register Metrics
  await fastify.register(fastifyMetrics, {
    endpoint: "/metrics",
    defaultMetrics: { enabled: true },
  });

  // Register Swagger & Swagger UI & Scalar
  await fastify.register(import("@fastify/swagger"), {
    openapi: {
      info: {
        title: packageJson.name,
        description: packageJson.description,
        version: packageJson.version,
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local Server",
        },
        {
          url: "https://template.api.test.usthing.xyz",
          description: "Test Server",
        },
        {
          url: "https://template.api.usthing.xyz",
          description: "Production Server",
        },
      ],
      tags: [
        { name: "Root", description: "The root endpoint" },
        { name: "Example", description: "Example endpoints" },
        { name: "Auth", description: "Auth endpoints" },
      ],
      components: {
        securitySchemes: {
          Auth: {
            type: "http",
            scheme: "bearer",
          },
        },
      },
    },
    refResolver: {
      buildLocalReference(json, baseUri, fragment, i) {
        return (json.$id as string) || `def-${i}`;
      },
    },
  });
  await fastify.register(import("@fastify/swagger-ui"));
  await fastify.register(import("@scalar/fastify-api-reference"));

  // Register MongoDB (Optional)
  // await fastify.register(import("@fastify/mongodb"), {
  //   url: opts.mongoUri,
  //   forceClose: true,
  // });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: opts,
    forceESM: true,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: opts,
    forceESM: true,
  });
};

export default app;
export { app, options };
