// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withCors from "@/src/server/middlewares/cors";
import { generateAccessToken, verifyJwtToken } from "@/src/server/middlewares/jwt";
import { withErrorHandler } from "@/src/server/middlewares/withErrorHandler";
import { AppError } from "@/src/server/utils/appError";
import { DataRes, JwtRequest, User } from "@/src/server/utils/interfaces";
import type { NextApiResponse } from "next";


async function handler(req: JwtRequest, res: NextApiResponse<DataRes<User>>) {
  const token = req.body.refreshToken || null;

  const user = verifyJwtToken(token, "refresh") as any; // jwt extracted so have more keys

  delete user?.exp;
  delete user?.iat;

  if (!user?.uid) {
    throw new AppError("UnAuthorised", 400);
  }
  const data: User = { ...user, accessToken: generateAccessToken(user) };

  res.status(200).json({
    message: "User fetched",
    data,
  });
}

export default withErrorHandler(withCors(handler));
