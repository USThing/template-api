import { FastifyTypebox } from "../../../app.js";
import { Static, Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";

const Announcement = Type.Object({
  id: Type.String(),
  title: Type.String(),
  content: Type.String(),
  showBefore: Type.Optional(Type.String({ format: "date-time" })),
  showAfter: Type.Optional(Type.String({ format: "date-time" })),
});

type Announcement = Static<typeof Announcement>;

const announcement: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
): Promise<void> => {
  fastify.addSchema({
    $id: "Announcement",
    ...Announcement,
  });

  const collection =
    fastify.mongo.db!.collection<Announcement>("announcements");
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get Announcements",
        tags: ["Announcement"],
        response: {
          200: Type.Array(Announcement),
        },
      },
    },
    async function () {
      return await collection
        .aggregate<Announcement>([
          {
            $addFields: {
              _id: "$$REMOVE",
              id: "$_id",
            },
          },
        ])
        .toArray();
    },
  );
};

export default announcement;
