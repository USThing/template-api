import { Type } from "@sinclair/typebox";
import { Static } from "@sinclair/typebox";

// Enums
export enum ClubCategory {
  ARTS,
  CULTURE,
  SPORTS,
  HALLS,
  COMMUNITY,
  DEPARTMENTAL,
  COMPETITION,
  CREATIVITY,
  INNOVATION,
  ENGINEERING,
  BUSINESS,
  SCIENCE,
  INTERDISCIPLINARY,
  RELIGION,
  RECREATION,
}

export enum SocialMediaType {
  INSTAGRAM,
  FACEBOOK,
  WEBSITE,
  EMAIL,
  TELEPHONE,
  X,
  LINKEDIN,
  BILIBILI,
  WECHAT,
}

const allowedSocialMediaTypes = Object.keys(SocialMediaType).filter((k) =>
  isNaN(Number(k)),
);

export const SocialMediaTypeSchema = Type.Union(
  allowedSocialMediaTypes.map((type) => Type.Literal(type)),
);

const allowedClubCategories = Object.keys(ClubCategory).filter((k) =>
  isNaN(Number(k)),
);

export const ClubCategorySchema = Type.Union(
  allowedClubCategories.map((category) => Type.Literal(category)),
);

export const MembershipFeeInfoSchema = Type.Object({
  oneYear: Type.String({
    description: "Fee for one year membership, in HKD. ",
    examples: ["HKD 0", "HKD 50", "TBA", "Not Available"],
  }),
  twoYear: Type.String({
    description: "Fee for two year membership, in HKD.",
    examples: ["HKD 0", "HKD 90", "TBA", "Not Available"],
  }),
  threeYear: Type.String({
    description: "Fee for three year membership, in HKD. ",
    examples: ["HKD 0", "HKD 120", "TBA", "Not Available"],
  }),
  fourYear: Type.String({
    description: "Fee for four year membership, in HKD. ",
    examples: ["HKD 0", "HKD 150", "TBA", "Not Available"],
  }),
});

export const SocialMediaInfoSchema = Type.Object({
  type: Type.String(SocialMediaTypeSchema),
  text: Type.String({
    description: "The display text for the link",
    examples: ["@oceanscience_hkust", "The Business Students' Union LINKEDIN"],
  }),
  link: Type.String({
    description: "The actual URL or link",
    examples: [
      "https://forms.gle/2AuUSNX3jkzHf8Z99",
      "https://www.linkedin.com/company/the-business-students'%E2%80%8B-union-hkustsu/",
    ],
  }),
});

export const ContactInfoSchema = Type.Object({
  name: Type.String({
    description: "Name of the contact person",
    examples: ["CHAN, Tai Man"],
  }),
  telephone: Type.String({
    description: "Contact telephone number",
    examples: ["12345678", "Not Available"],
  }),
  email: Type.String({
    description: "Contact email address",
    examples: ["su_drama@connect.ust.hk"],
  }),
});

export const ClubInfoSchema = Type.Object({
  name: Type.String({
    description: "Full name of the club or association",
    examples: ["Fencing Club"],
  }),
  categories: Type.Array(Type.String(ClubCategorySchema)),
  department: Type.String({
    description: "Affiliation type of the club.",
    examples: ["Department Associated Group", "HKUSTSU"],
  }),
  description: Type.String({
    description: "Description of the club",
    examples: [
      "University Philharmonic Orchestra (UPO) is a student-run orchestra under the Student Union of The Hong Kong University of Science and Technology (HKUSTSU). \n\nThe orchestra was previously known as the HKUSTSU Wind Ensemble, which merged with the Strings Ensemble in 2005. The orchestra consists of musicians from different backgrounds, including local, international, exchange students, postgraduate researchers, alumni, and friends of HKUST. \n\nUPO aims to provide a platform for music-loving HKUST members to create and enjoy music. We also hope to nourish our musicians' musicality and skills through playing orchestral music. In the past, we were invited to perform at functions such as the Outreach Day in HKUST, independent clubs' orientation camps, and inauguration ceremonies. In recent years, UPO has given concerts at the Shaw Auditorium at HKUST.",
    ],
  }),
  links: Type.Array(SocialMediaInfoSchema),
  contacts: Type.Array(ContactInfoSchema),
  membershipFees: Type.Optional(MembershipFeeInfoSchema),
  imageName: Type.String({
    description: "File name of club logo",
    examples: ["ASCE.png"],
  }),
});

export const ClubInfoWithImageSchema = Type.Intersect([
  ClubInfoSchema,
  Type.Object({
    imageBase64: Type.String({
      description: "Base64 encoded image data",
      examples: [
        "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+5n6JAAAABmJLR0QA/wD/AP+gvaeTAAAX...",
      ],
    }),
  }),
]);

export type ClubInfo = Static<typeof ClubInfoSchema>;
export type ClubInfoWithImage = Static<typeof ClubInfoWithImageSchema>;
