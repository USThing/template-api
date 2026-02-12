import app, { options } from "../src/app.js";
import Fastify from "fastify";

const fastify = Fastify({
  pluginTimeout: options.pluginTimeout,
  logger: { level: "debug" },
});

await fastify.register(app, options);

const port = Number(process.env.PORT ?? 3000);
const host = process.env.ADDRESS;
const listenOptions = host ? { port, host } : { port };

try {
  await fastify.listen(listenOptions);
} catch (error) {
  fastify.log.error(error);
  process.exitCode = 1;
}
