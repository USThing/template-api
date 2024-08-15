import { FastifyPluginAsync } from "fastify";
import { FastifyTypebox } from "../../app.js";
import { Type } from "@sinclair/typebox";

const example: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
  opts,
): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get Example",
        tags: ["Example"],
        response: {
          200: Type.String(),
        },
      },
    },
    async function (request, reply) {
      return "this is an example";
    },
  );
};

export default example;
