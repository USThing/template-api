import fp from "fastify-plugin";
import sensible from "@fastify/sensible";
import { Type } from "@sinclair/typebox";

export const HttpError = Type.Ref("HttpError");

/**
 * This plugin adds some utilities to handle http errors.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async (fastify) => {
  fastify.register(sensible, {
    sharedSchemaId: "HttpError",
  });
});
