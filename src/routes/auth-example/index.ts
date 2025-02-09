import { FastifyTypebox } from "../../app.js";
import { AuthResponseSchema } from "../../plugins/auth.js";
import { mergeResponse } from "../../utils/schema.js";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";

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
        response: mergeResponse([
          {
            200: Type.String(),
          },
          AuthResponseSchema,
        ]),
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
            response: mergeResponse([
              {
                200: Type.String(),
                400: Type.String(),
              },
              AuthResponseSchema,
            ]),
          },
        },
        async function (request, reply) {
          return reply.status(400).send("this is a sub auth example 1");
        },
      );
      fastify.get(
        "/auth",
        {
          schema: {
            summary: "Sub Auth Example 2",
            tags: ["Auth"],
            security: [{ Auth: [] }],
            response: mergeResponse([
              {
                200: Type.String(),
                401: Type.String(),
              },
              AuthResponseSchema,
            ]),
          },
        },
        async function (request, reply) {
          return reply.status(401).send("this is a sub auth example 2");
        },
      );
    },
    {
      prefix: "/sub-auth",
    },
  );
};

export default authExample;
