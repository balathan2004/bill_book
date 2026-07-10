import { NextApiRequest, NextApiResponse } from "next";
import {
  AuthResponseConfig,
} from "@/components/utils/interfaces";
import { bodyValidator } from "@/src/server/middlewares/bodyValidator";
import { loginSchema } from "@/src/server/schemas/auth.schema";
import { AppError } from "@/src/server/utils/appError";
import { AuthService } from "@/src/server/services/auth.services";
import { generateAccessToken, generateRefreshToken } from "@/src/server/middlewares/jwt";
import reponseWithCookie from "@/src/server/utils/responseWithCookie";
import withCors from "@/src/server/middlewares/cors";
import { withErrorHandler } from "@/src/server/middlewares/withErrorHandler";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponseConfig>
) {

  if (req.method != "POST") throw new AppError("Forbidden Request", 403);

  const { email, password } = bodyValidator(loginSchema, req);

  const data = await AuthService.login(email, password);

  const tokens = {
    accessToken: generateAccessToken(data),
    refreshToken: generateRefreshToken(data),
  };

  reponseWithCookie(req, res, tokens.refreshToken, {
    data: { ...data, ...tokens },
    message: "Login Successful",
  });


}

export default withCors(withErrorHandler(handler));

