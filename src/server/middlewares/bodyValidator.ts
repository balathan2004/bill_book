import { ZodTypeAny } from "zod";
import { AppError } from "../utils/appError";
import { NextApiRequest } from "next";

export function bodyValidator<S extends ZodTypeAny>(
  schema: S,
  req: NextApiRequest
): S["_output"] {
  const { data } = req.body;

  console.log({ data }, "validator");

  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join(", ");
    throw new AppError(message, 400);
  }

  return result.data;
}
