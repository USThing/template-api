import fp from "fastify-plugin";

// import { Collection, Document } from "mongodb";

export type InitMongoPluginOptions = Record<never, unknown>;

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<InitMongoPluginOptions>(async (fastify, opts) => {
  fastify.addHook("onReady", async () => {
    // Initialize the MongoDB database
    // await fastify.mongo
    //   .db!.collection("example")
    //   .createIndex({ example: 1 });
  });
});

// declare module "fastify" {
//   export interface FastifyInstance {
//     collections: {
//       example: Collection<Document>;
//     };
//   }
// }
