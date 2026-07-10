import { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "./errorHandler";


export const withErrorHandler = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      errorHandler(error, res);
    }
  };
};
