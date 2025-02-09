import { FastifyTypebox } from "../../app.js";
import { CourseCatalogOptions } from "./index.js";
import { CCourse, convert, Course, CRawCourse, RawCourse } from "./types.js";
import { hoursToMilliseconds } from "date-fns";

const BASE = "https://w5.ab.ust.hk/msapi/sis/catg_course";

export function Updater(
  fastify: FastifyTypebox,
  opts: CourseCatalogOptions,
): [() => void, () => void] {
  async function fetchRawCourses(
    token: string,
    offset: number = 0,
    limit: number = 1000,
  ): Promise<RawCourse[]> {
    const url = new URL(BASE);
    url.searchParams.append("offset", offset.toString());
    url.searchParams.append("limit", limit.toString());
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await resp.json();
    if (json.offset + json.limit < json.totalRecord) {
      const rawCourses = json.courseInformation;
      return rawCourses.concat(
        await fetchRawCourses(token, offset + limit, limit),
      );
    } else {
      const rawCourses = json.courseInformation;
      for (const rawCourse of rawCourses) {
        const valid = CRawCourse.Check(rawCourse);
        if (!valid) {
          fastify.log.warn(
            "Course Catalog: Error in validating raw course,",
            CRawCourse.Errors(rawCourse).First(),
            rawCourse,
          );
        }
      }
      return rawCourses;
    }
  }

  async function fetchCourses(token: string): Promise<Course[]> {
    const rawCourses = await fetchRawCourses(token);
    const courses = rawCourses.map((raw) => convert(raw));
    for (const course of courses) {
      const valid = CCourse.Check(course);
      if (!valid) {
        fastify.log.warn(
          "Course Catalog: Error in validating course,",
          Course.Errors(course).First(),
          course,
        );
      }
    }
    return courses;
  }

  let ref: NodeJS.Timeout | null = null;
  return [
    () => {
      const handler = async () => {
        try {
          fastify.log.info("Updating course catalog...");
          const courses = await fetchCourses(opts.msApiAccessToken);
          fastify.log.info(`Fetched ${courses.length} courses`);
          await fastify.mongo.db!.collection("course-catalog").deleteMany();
          const result = await fastify.mongo
            .db!.collection("course-catalog")
            .insertMany(courses);
          fastify.log.info(`Inserted ${result.insertedCount} courses`);
          fastify.log.info("Updated course catalog");
        } catch (e) {
          fastify.log.error(e, "Error in updating course catalog");
        }
      };
      ref = setInterval(handler, hoursToMilliseconds(24 * 7));
      setTimeout(handler, 0);
    },
    () => {
      if (ref) {
        clearInterval(ref);
      }
    },
  ];
}
