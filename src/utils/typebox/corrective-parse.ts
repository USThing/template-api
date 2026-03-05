import Type from "typebox";
import Value, { Pipeline } from "typebox/value";

const CorrectiveParsePipeline = Pipeline([
  // Comment and re-order as necessary
  (_context, _type, value) => Value.Clone(value),
  (context, type, value) => Value.Default(context, type, value),
  (context, type, value) => Value.Convert(context, type, value),
  (context, type, value) => Value.Clean(context, type, value),
  // Run Parse as final operation
  (context, type, value) => Value.Parse(context, type, value),
]);
export default function CorrectiveParse<T extends Type.TSchema>(
  type: T,
  value: unknown,
): ReturnType<typeof Value.Parse<T>> {
  return CorrectiveParsePipeline(type, value) as never;
}
