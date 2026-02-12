import { UnionOneOf } from "./typebox/union-oneof.js";
import { TSchema } from "typebox";

export type ResponseSchema = Record<number, TSchema>;

export function mergeResponse(responses: ResponseSchema[]): ResponseSchema {
  const m: ResponseSchema = {};
  for (const r of responses) {
    for (const [status, schema] of Object.entries(r)) {
      if (m[Number(status)]) {
        m[Number(status)] = UnionOneOf([schema, m[Number(status)]]);
      } else {
        m[Number(status)] = schema;
      }
    }
  }
  return m;
}
