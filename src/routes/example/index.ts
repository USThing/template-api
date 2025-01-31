import { FastifyPluginAsync } from "fastify";
import { FastifyTypebox } from "../../app.js";
import { Type } from "@sinclair/typebox";
import { HttpError } from "../../plugins/sensible.js";

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
  fastify.get(
    "/error",
    {
      schema: {
        summary: "Get Example with Some Errors",
        tags: ["Example"],
        response: {
          200: HttpError,
        },
      },
    },
    async function (request, reply) {
      return reply.badRequest("this is an error example");
    },
  );
};

export default example;
