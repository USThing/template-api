import * as path from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginAsync,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { fileURLToPath } from "url";
import packageJson from "../package.json" with { type: "json" };
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

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
      ],
      components: {},
    },
  });
  await fastify.register(import("@fastify/swagger-ui"));

  // Register MongoDB (Optional)
  // await fastify.register(import("@fastify/mongodb"), {
  //   url: process.env.MONGO_URI,
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
