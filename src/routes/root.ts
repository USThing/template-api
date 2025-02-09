import { FastifyTypebox } from "../app.js";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";

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
