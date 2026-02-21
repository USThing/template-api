import fp from "fastify-plugin";
import { Collection, Document } from "mongodb";

export type InitMongoPluginOptions = {
  // MongoDB URI
  mongoUri: string;
};

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<InitMongoPluginOptions>(async (fastify, opts) => {
  await fastify.register(import("@fastify/mongodb"), {
    url: opts.mongoUri,
    forceClose: true,
  });
  fastify.addHook("onReady", async () => {
    // Initialize the MongoDB database
    fastify.decorate("collections", {
      example: fastify.mongo.db!.collection("example"),
    });
    await fastify.collections.example.createIndex({ example: 1 });
  });
});

declare module "fastify" {
  export interface FastifyInstance {
    collections: {
      example: Collection<Document>;
    };
  }
}
