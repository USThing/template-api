import Type, { Static } from "typebox";
import Value, { Pipeline } from "typebox/value";

const CorrectiveParsePipeline = Pipeline([
  (_context, _type, value) => Value.Clone(value),
  (context, type, value) => Value.Default(context, type, value),
  (context, type, value) => Value.Convert(context, type, value),
  (context, type, value) => Value.Clean(context, type, value),
  (context, type, value) => Value.Parse(context, type, value),
]);

export default function CorrectiveParse<T extends Type.TSchema>(
  type: T,
  value: unknown,
): Static<T> {
  return CorrectiveParsePipeline(type, value) as never;
}
