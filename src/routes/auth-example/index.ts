import { FastifyPluginAsync } from "fastify";
import { FastifyTypebox } from "../../app.js";
import { Type } from "@sinclair/typebox";

const authExample: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
  opts,
): Promise<void> => {
  // Applying auth to this route
  fastify.get(
    "/",
    {
      schema: {
        summary: "Auth Example",
        tags: ["Auth"],
        security: [{ Auth: [] }],
        response: {
          200: Type.String(),
          401: Type.String(),
        },
      },
      preHandler: fastify.auth,
    },
    async function (request, reply) {
      return "this is an auth example";
    },
  );

  // Applying auth to the prefix /sub-auth
  fastify.register(
    async function (fastify) {
      fastify.addHook("preHandler", fastify.auth);
      fastify.get(
        "/",
        {
          schema: {
            summary: "Sub Auth Example 1",
            tags: ["Auth"],
            security: [{ Auth: [] }],
            response: {
              200: Type.String(),
              401: Type.String(),
            },
          },
        },
        async function (request, reply) {
          return "this is a sub auth example 1";
        },
      );
      fastify.get(
        "/auth",
        {
          schema: {
            summary: "Sub Auth Example 2",
            tags: ["Auth"],
            security: [{ Auth: [] }],
            response: {
              200: Type.String(),
              401: Type.String(),
            },
          },
        },
        async function (request, reply) {
          return "this is a sub auth example 2";
        },
      );
    },
    {
      prefix: "/sub-auth",
    },
  );
};

export default authExample;
