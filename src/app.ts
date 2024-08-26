import * as path from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginAsync,
  FastifyServerOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { fileURLToPath } from "url";
import packageJson from "../package.json" with { type: "json" };
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { AuthPluginOptions } from "./plugins/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
  // MongoDB URI (Optional)
  // mongoUri: string;
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
  // mongoUri: getOption("MONGO_URI")!,
  authDiscoveryURL: getOption("AUTH_DISCOVERY_URL")!,
  authClientID: getOption("AUTH_CLIENT_ID")!,
  authSkip: (() => {
    const opt = getOption("AUTH_SKIP", false);
    if (opt !== undefined) {
      return Boolean(opt);
    } else {
      return undefined;
    }
  })(),
};

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

  // Register Swagger & Swagger UI
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
  });
  await fastify.register(import("@fastify/swagger-ui"));

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
