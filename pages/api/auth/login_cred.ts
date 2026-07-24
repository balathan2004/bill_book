import { NextApiResponse } from "next";
import withCors from "@/src/server/middlewares/cors";
import { withErrorHandler } from "@/src/server/middlewares/withErrorHandler";
import reponseWithCookie from "@/src/server/utils/responseWithCookie";
import { generateAccessToken, generateRefreshToken, withJwt } from "@/src/server/middlewares/jwt";
import { AuthResponseConfig, JwtRequest, User } from "@/src/server/utils/interfaces";
import { AuthService } from "@/src/server/services/auth.services";
export async function handler(
  req: JwtRequest,
  res: NextApiResponse<AuthResponseConfig>
) {

  if (req.method != "GET") throw new Error("Method not allowed");

  const user = req.user as User;
  if (!user) throw new Error("Unauthorized Request");

  const data = await AuthService.login_cred(user.uid);

  const tokens = {
    accessToken: generateAccessToken(data),
    refreshToken: generateRefreshToken(data),
  }

  return reponseWithCookie(req, res, user.uid, {
    data: { ...data, ...tokens },
    message: "User data fetched successfully",
  });
}

export default withCors(withErrorHandler(withJwt(handler)));

