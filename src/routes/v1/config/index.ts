import { FastifyPluginAsync } from "fastify";
import { FastifyTypebox } from "../../../app.js";
import { Type } from "@sinclair/typebox";

const config: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get Configuration",
        tags: ["Configuration"],
        response: {
          200: Type.Record(Type.String(), Type.String()),
        },
      },
    },
    async function () {
      return (await fastify.mongo.db!.collection("config").findOne()) as Record<
        string,
        string
      >;
    },
  );
};

export default config;
