import { FastifyPluginAsync } from "fastify";
import { FastifyTypebox } from "../../../app.js";
import { Type } from "@sinclair/typebox";
import { Course } from "../../../plugins/course-catalog/types.js";

const courseCatalog: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
): Promise<void> => {
  // Get all courses; if termCode is not specified, use the latest
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get all courses.",
        tags: ["Course Catalog"],
        querystring: Type.Object({
          termCode: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Array(Course),
        },
      },
    },
    async function (request) {
      const termCode = request.query.termCode ?? (await latestTermCode());
      return await fastify.mongo
        .db!.collection("course-catalog")
        .find<Course>({ termCode }, { projection: { _id: 0 } })
        .toArray();
    },
  );

  async function latestTermCode(): Promise<string> {
    const codes = await fastify.mongo
      .db!.collection("course-catalog")
      .distinct<string>("termCode", {});
    return String(Math.max(...codes.map((it) => Number(it))));
  }

  // Get course by courseID; if termCode is not specified, use the latest
  fastify.get(
    "/:courseID",
    {
      schema: {
        summary: "Get a course by the course ID.",
        description: "If termCode is not specified, use the latest term.",
        tags: ["Course Catalog"],
        params: Type.Object({
          courseID: Type.String(),
        }),
        querystring: Type.Object({
          termCode: Type.Optional(Type.String()),
        }),
        response: {
          200: Course,
          404: { $ref: "HttpError" },
        },
      },
    },
    async function (request) {
      const courseID = request.params.courseID;
      const termCode = request.query.termCode ?? (await latestTermCode());
      console.log(termCode);
      const result = await fastify.mongo
        .db!.collection("course-catalog")
        .findOne<Course>({ termCode, courseID }, { projection: { _id: 0 } });
      if (result) {
        return result;
      } else {
        return fastify.httpErrors.notFound(`Course ${courseID} not found`);
      }
    },
  );

  // Get course by courseCode; if termCode is not specified, use the latest
  fastify.get(
    "/code/:courseCode",
    {
      schema: {
        summary: "Get a course by the course code.",
        description: "If termCode is not specified, use the latest term.",
        tags: ["Course Catalog"],
        params: Type.Object({
          courseCode: Type.String(),
        }),
        querystring: Type.Object({
          termCode: Type.Optional(Type.String()),
        }),
        response: {
          200: Course,
          404: { $ref: "HttpError" },
        },
      },
    },
    async function (request) {
      const courseCode = request.params.courseCode;
      const termCode = request.query.termCode ?? (await latestTermCode());
      const result = await fastify.mongo
        .db!.collection("course-catalog")
        .findOne<Course>({ termCode, courseCode }, { projection: { _id: 0 } });
      if (result) {
        return result;
      } else {
        return fastify.httpErrors.notFound(`Course ${courseCode} not found`);
      }
    },
  );

  // Get courses by course prefix; if termCode is not specified, use the latest
  fastify.get(
    "/prefix/:coursePrefix",
    {
      schema: {
        summary: "Get courses by the course prefix.",
        description: "If termCode is not specified, use the latest term.",
        tags: ["Course Catalog"],
        params: Type.Object({
          coursePrefix: Type.String(),
        }),
        querystring: Type.Object({
          termCode: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Array(Course),
        },
      },
    },
    async function (request) {
      const coursePrefix = request.params.coursePrefix;
      const termCode = request.query.termCode ?? (await latestTermCode());
      return await fastify.mongo
        .db!.collection("course-catalog")
        .find<Course>({ termCode, coursePrefix }, { projection: { _id: 0 } })
        .toArray();
    },
  );
};

export default courseCatalog;
