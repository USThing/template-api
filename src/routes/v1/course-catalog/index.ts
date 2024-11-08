import { FastifyPluginAsync } from "fastify";
import { FastifyTypebox } from "../../../app.js";
import { Type } from "@sinclair/typebox";
import { Course } from "../../../plugins/course-catalog/types.js";

const courseCatalog: FastifyPluginAsync = async (
  fastify: FastifyTypebox,
): Promise<void> => {
  const collection = fastify.mongo.db!.collection<Course>("course-catalog");

  async function latestTermCode(): Promise<string> {
    const codes = await collection.distinct("termCode", {});
    return String(Math.max(...codes.map((it) => Number(it))));
  }

  // Get all courses, optionally filtered by a search string of courseCode or courseTitle;
  // if termCode is not specified, use the latest
  fastify.get(
    "/",
    {
      schema: {
        summary:
          "Get all courses, optionally filtered by a search string of courseCode AND courseTitle.",
        description: "If termCode is not specified, use the latest term.",
        tags: ["Course Catalog"],
        querystring: Type.Object({
          termCode: Type.Optional(Type.String()),
          searchCode: Type.Optional(Type.String()),
          searchTitle: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Array(Course),
        },
      },
    },
    async function (request) {
      const termCode = request.query.termCode ?? (await latestTermCode());
      const searchCode = request.query.searchCode ?? "";
      const searchTitle = request.query.searchTitle ?? "";

      return collection
        .find(
          {
            termCode,
            $and: [
              { courseCode: { $regex: searchCode, $options: "i" } },
              { courseTitle: { $regex: searchTitle, $options: "i" } },
            ],
          },
          {
            projection: { _id: 0 },
          },
        )
        .toArray();
    },
  );

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
      const result = await collection.findOne(
        { termCode, courseID },
        { projection: { _id: 0 } },
      );
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
      const result = await collection.findOne(
        { termCode, courseCode },
        { projection: { _id: 0 } },
      );
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
      return await collection
        .find({ termCode, coursePrefix }, { projection: { _id: 0 } })
        .toArray();
    },
  );
};

export default courseCatalog;
