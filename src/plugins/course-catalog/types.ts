import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export const Course = Type.Object({
  fullAcademicYear: Type.String({
    description: "The full academic year.",
    examples: ["2024-25"],
  }),
  termCode: Type.String({
    description:
      "The term code, representing the specific term in the academic year.",
    examples: ["2410"],
  }),
  termName: Type.String({
    description:
      "The name of the term, typically including the academic year and term season.",
    examples: ["2024-25 Fall"],
  }),
  campus: Type.String({
    description: "The campus code where the course is offered.",
    examples: ["MAIN", "GZ"],
  }),
  campusName: Type.String({
    description: "The full name of the campus.",
    examples: ["CWB Campus", "GZ Campus"],
  }),
  campusShortName: Type.String({
    description: "The short name or abbreviation of the campus.",
    examples: ["CWB", "GZ"],
  }),
  courseID: Type.String({
    description: "The unique identifier for the course.",
    examples: ["007971", "000001"],
  }),
  coursePrefix: Type.String({
    description:
      "The course prefix, typically representing the department or subject area.",
    examples: ["ACCT", "AIAA"],
  }),
  catalogNumber: Type.String({
    description:
      "The catalog number of the course, used for course registration.",
    examples: ["1010", "2200"],
  }),
  courseCode: Type.String({
    description:
      "The full course code, usually combining the prefix and catalog number.",
    examples: ["ACCT1010", "AIAA2205"],
  }),
  academicCareerType: Type.String({
    description: "The type of career for which the course is designed.",
    examples: ["UG", "PG"],
  }),
  academicCareer: Type.String({
    description: "The academic career level for the course.",
    examples: ["UGRD", "TPG", "RPG", "EXEC"],
  }),
  schoolCode: Type.String({
    description:
      "The code representing the school or faculty offering the course.",
    examples: ["SBM", "SENG"],
  }),
  departmentCode: Type.String({
    description: "The department code associated with the course.",
    examples: ["ACCT", "AI"],
  }),
  departmentShortName: Type.String({
    description: "The short name of the department offering the course.",
    examples: ["ACCT", "AI (AIS)"],
  }),
  courseTitle: Type.String({
    description: "The title of the course.",
    examples: [
      "Accounting, Business and Society",
      "Introduction to Artificial Intelligence",
    ],
  }),
  minUnits: Type.String({
    description: "The minimum number of credit units for the course.",
    examples: ["1", "3"],
  }),
  maxUnits: Type.String({
    description: "The maximum number of credit units for the course.",
    examples: ["1", "3"],
  }),
  courseVector: Type.String({
    description:
      "The course vector which indicates the number of instructional hours required and credits to be earned." +
      "More information: https://prog-crs.hkust.edu.hk/pgcourse. Scroll to the bottom.",
    examples: ["[0-0-0:0]", "[0-1-0:0]"],
  }),
  printVector: Type.String({
    description: "The printed vector, indicating credit details.",
    examples: ["[0-0-0:0]", "[0-1 Credit(s)]"],
  }),
  courseDescription: Type.String({
    description: "A detailed description of the course content and objectives.",
    examples: [
      "Overview of accounting in business and social contexts; use of accounting information for accountability and decision-making...",
      "This course provides an introduction to law and business society...",
    ],
  }),
  previousCourseCodes: Type.Array(Type.String(), {
    description: "The previous course code(s), if applicable.",
    examples: ["[ACCT 6900C]", "[CBME 5900, CBME 6000B]"],
  }),
  alternativeCourseCodes: Type.Array(Type.String(), {
    description: "The alternative course code, if applicable.",
    examples: ["[BIEN 3020]", "[BIEN 3300]"],
  }),
  coursePrerequisite: Type.String({
    description:
      "The prerequisite courses required before enrolling in this course, may be described in natural language.",
    examples: [
      "(ACCT 5100 OR ACCT 5150) AND FINA 5120",
      "(Level 5* or above in HKDSE 1/2x Physics OR in HKDSE 1x Physics) AND (Level 5 or above in HKDSE Mathematics Extended Module M1/M2)",
    ],
  }),
  courseCorequisite: Type.String({
    description:
      "The corequisite courses that must be taken concurrently with this course, may be described in natural language.",
    examples: [
      "(COMP 1021 OR COMP 1022P) AND (MATH 1003 OR MATH 1014 OR MATH 1020 OR MATH 1024)",
      "(For students without prerequisites) MATH 1012 OR MATH 1013 OR MATH 1014 OR MATH 1020 OR MATH 1023 OR MATH 1024",
    ],
  }),
  courseExclusion: Type.String({
    description:
      "Courses that are excluded from credit if this course is taken, may be described in natural language.",
    examples: [
      "ACCT 2010, CORE 1310",
      "Any 2000-level or above courses in CHEM, LIFS, CENG, BIEN",
    ],
  }),
  courseBackground: Type.String({
    description:
      "Background knowledge or courses recommended before taking this course, may be described in natural language.",
    examples: [
      "A familiarity with social science and humanities, particularly social anthropology, is highly desirable but not necessary.",
      "Backgrounds in communication and networking, computer systems, and distributed architectures are preferred",
    ],
  }),
  courseColisted: Type.String({
    description:
      "The co-listed courses that share the same content, may be described in natural language.",
    examples: ["AESF 5050", "AESF 5210"],
  }),
  courseCrossCampusEquivalence: Type.String({
    description:
      "Equivalency information for the course across different campuses, may be described in natural language.",
    examples: ["AMAT 1510", "AMAT 3530, BIEN 3300"],
  }),
  courseReference: Type.String({
    description:
      "Any reference information related to the course, may be described in natural language.",
    examples: [
      "- E. Butkov, Mathematical Physics",
      "- E.L. Lehmann, Testing Statistical Hypotheses\\r\\n- D.R. Cox and D.V. Hinkley, Theoretical Statistics",
    ],
  }),
  courseAttributes: Type.Array(
    Type.Object({
      courseID: Type.String({
        description: "The course ID.",
        examples: ["007971"],
      }),
      termCode: Type.String({
        description: "The term code.",
        examples: ["2410"],
      }),
      courseAttribute: Type.String({
        description:
          "The course attribute, such as common core information, delivery methods, etc.",
        examples: ["4Y", "CC22", "DELI", "GEED", "MEDI", "READ"],
      }),
      courseAttributeValue: Type.String({
        description:
          "The value of the course attribute. Refer to the description for the meaning.",
        examples: [
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "BLD",
          "C",
          "CA",
          "EN",
          "EXP",
          "ND",
          "ONL",
          "PU",
          "SPO",
        ],
      }),
      courseAttributeValueDescription: Type.String({
        description: "The description of the course attribute value.",
        examples: [
          "Common Core (A) for 30-credit program",
          "Common Core (Arts) for 36-credit program",
          "Common Core (C-Comm) for 30-credit program",
          "Common Core (C-Comm) for 36-credit program",
          "Common Core (CTDL) for 30-credit program",
          "Common Core (E-Comm) for 30-credit program",
          "Common Core (H) for 30-credit program",
          "Common Core (H) for 36-credit program",
          "Common Core (HLTH) for 36-credit program",
          "Common Core (HMW) for 30-credit program",
          "Common Core (QR) for 36-credit program",
          "Common Core (S&T) for 36-credit program",
          "Common Core (S) for 30-credit program",
          "Common Core (SA) for 30-credit program",
          "Common Core (SA) for 36-credit program",
          "Common Core (SSC-H) for 36-credit program",
          "Common Core (SSC-S&T) for 36-credit program",
          "Common Core (SSC-SA) for 36-credit program",
          "Common Core (T) for 30-credit program",
          "Common Core (UxOP-UROP) for 30-credit program",
          "Non-designated GEE",
          "[BLD] Blended learning",
          "[CA] Cantonese",
          "[C] Require Chinese reading",
          "[EN] Taught in Eng/Chin subject to diff. offerings",
          "[EXP] Experiential learning",
          "[ONL] Pure online delivery",
          "[PU] Putonghua",
          "[SPO] Self-paced online delivery",
        ],
      }),
    }),
  ),
  courseIntendedLearningOutcomes: Type.Array(
    Type.Object({
      courseID: Type.String({
        description: "The course ID.",
        examples: ["007971"],
      }),
      termCode: Type.String({
        description: "The term code.",
        examples: ["2410"],
      }),
      sequence: Type.Number({
        description: "The sequence number of the intended learning outcomes.",
        examples: [1, 2, 3],
      }),
      description: Type.String({
        description: "The description of the intended learning outcome.",
        examples: [
          "Apply these tools in conjunction with appropriate approximation techniques to solve problems in a variety of physical systems, including (but not limited to) fluids and interacting assemblies of spins in magnetic fields.",
          "Describe the basic principles for perturbative treatment of a quantum many-body system.",
        ],
      }),
    }),
  ),
});

export const CCourse = TypeCompiler.Compile(Course);

export type Course = Static<typeof Course>;

export const RawCourse = Type.Object({
  acadYearFull: Type.String(),
  termCode: Type.String(),
  termName: Type.String(),
  campus: Type.String(),
  campusName: Type.String(),
  campusShortName: Type.String(),
  crseID: Type.String(),
  crsePrefix: Type.String(),
  catalogNbr: Type.String(),
  crseCode: Type.String(),
  careerType: Type.String(),
  acadCareer: Type.String(),
  schoolCode: Type.String(),
  deptCode: Type.String(),
  deptShortName: Type.String(),
  crseTitle: Type.String(),
  minUnits: Type.String(),
  maxUnits: Type.String(),
  crseVector: Type.String(),
  prnVector: Type.String(),
  crseDescr: Type.String(),
  prevCrseCode: Type.String(),
  altCrseCode: Type.String(),
  crsePrerequisite: Type.String(),
  crseCorequisite: Type.String(),
  crseExclusion: Type.String(),
  crseBackgd: Type.String(),
  crseColist: Type.String(),
  crseCrsCmpEqv: Type.String(),
  crseReference: Type.String(),
  courseAttribute: Type.Array(
    Type.Object({
      crseID: Type.String(),
      termCode: Type.String(),
      crseAttr: Type.String(),
      crseAttrValue: Type.String(),
      crseAttrValueDesc: Type.String(),
    }),
  ),
  ciloInformation: Type.Array(
    Type.Object({
      crseID: Type.String(),
      termCode: Type.String(),
      ciloSeq: Type.String(),
      ciloDescription: Type.String(),
    }),
  ),
});

export const CRawCourse = TypeCompiler.Compile(RawCourse);

export type RawCourse = Static<typeof RawCourse>;

export function convert(raw: RawCourse): Course {
  const course = {
    fullAcademicYear: raw.acadYearFull,
    termCode: raw.termCode,
    termName: raw.termName,
    campus: raw.campus,
    campusName: raw.campusName,
    campusShortName: raw.campusShortName,
    courseID: raw.crseID,
    coursePrefix: raw.crsePrefix,
    catalogNumber: raw.catalogNbr,
    courseCode: raw.crseCode,
    academicCareerType: raw.careerType,
    academicCareer: raw.acadCareer,
    schoolCode: raw.schoolCode,
    departmentCode: raw.deptCode,
    departmentShortName: raw.deptShortName,
    courseTitle: raw.crseTitle,
    minUnits: raw.minUnits,
    maxUnits: raw.maxUnits,
    courseVector: raw.crseVector,
    printVector: raw.prnVector,
    courseDescription: raw.crseDescr,
    previousCourseCodes: raw.prevCrseCode.split(", "),
    alternativeCourseCodes: raw.altCrseCode.split(", "),
    coursePrerequisite: raw.crsePrerequisite,
    courseCorequisite: raw.crseCorequisite,
    courseExclusion: raw.crseExclusion,
    courseBackground: raw.crseBackgd,
    courseColisted: raw.crseColist,
    courseCrossCampusEquivalence: raw.crseCrsCmpEqv,
    courseReference: raw.crseReference,
    courseAttributes: raw.courseAttribute.map((attr) => ({
      courseID: attr.crseID,
      termCode: attr.termCode,
      courseAttribute: attr.crseAttr,
      courseAttributeValue: attr.crseAttrValue,
      courseAttributeValueDescription: attr.crseAttrValueDesc,
    })),
    courseIntendedLearningOutcomes: raw.ciloInformation.map((cilo) => ({
      courseID: cilo.crseID,
      termCode: cilo.termCode,
      sequence: Number(cilo.ciloSeq),
      description: cilo.ciloDescription,
    })),
  } satisfies Course;
  eliminateBlank(course);
  return course;
}

/**
 * Traverse through the object, make any field with a value of `" "` an empty
 * string `""` and make any field with a value of `[" "]` an empty array `[]`.
 *
 * This is useful because in the raw data, empty fields are filled with blank
 * spaces. By this function we explicitly eliminate them.
 */
function eliminateBlank<T>(obj: T): T {
  for (const key in obj) {
    if (typeof obj[key] === "string" && obj[key] === " ") {
      // @ts-expect-error make TypeScript happy
      obj[key] = "";
    } else if (Array.isArray(obj[key]) && obj[key].includes(" ")) {
      // @ts-expect-error make TypeScript happy
      obj[key] = [];
    } else if (typeof obj[key] === "object") {
      obj[key] = eliminateBlank(obj[key]);
    }
  }
  return obj;
}
