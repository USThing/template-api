import { FastifyTypebox } from "../app.js";
import { FastifyPluginAsync } from "fastify";
import { Type } from "typebox";

const root: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
  opts,
): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Root",
        tags: ["Root"],
        response: {
          200: Type.Object({
            root: Type.Boolean(),
          }),
        },
      },
    },
    async function (request, reply) {
      return { root: true };
    },
  );
};

export default root;
