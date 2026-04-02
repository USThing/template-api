import { FastifyTypebox } from "../../app.js";
import auth from "../../plugins/auth.js";
import { FastifyPluginAsync } from "fastify";
import { Type } from "typebox";

const authExample: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
  opts,
): Promise<void> => {
  await fastify.register(async function (fastify: FastifyTypebox) {
    await auth(fastify, opts);

    fastify.get(
      "/",
      {
        schema: {
          summary: "Auth Example",
          tags: ["Auth"],
          response: {
            200: Type.String(),
          },
        },
      },
      async function (request, reply) {
        return `${request.auth.user} is authenticated`;
      },
    );

    fastify.register(
      async function (fastify: FastifyTypebox) {
        fastify.get(
          "/",
          {
            schema: {
              summary: "Sub Auth Example 1",
              tags: ["Auth"],
              response: {
                400: Type.String(),
              },
            },
          },
          async function (request, reply) {
            return reply.status(400).send("this is a sub auth example 1 (400)");
          },
        );
        fastify.get(
          "/auth",
          {
            schema: {
              summary: "Sub Auth Example 2",
              tags: ["Auth"],
              response: {
                401: Type.String(),
              },
            },
          },
          async function (request, reply) {
            return reply.status(401).send("this is a sub auth example 2 (401)");
          },
        );
      },
      {
        prefix: "/sub-auth",
      },
    );
  });
};

export default authExample;
