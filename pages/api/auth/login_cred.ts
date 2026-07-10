import { NextApiRequest, NextApiResponse } from "next";
import {
  AuthResponseConfig,
} from "@/components/utils/interfaces";
import { getDoc } from "firebase/firestore";
import withCors from "@/src/server/middlewares/cors";
import { withErrorHandler } from "@/src/server/middlewares/withErrorHandler";
import { userDocRefMaker } from "@/src/server/db/db.module";
import reponseWithCookie from "@/src/server/utils/responseWithCookie";
import { generateAccessToken, generateRefreshToken } from "@/src/server/middlewares/jwt";
import { User } from "@/src/server/utils/interfaces";
export async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponseConfig>
) {


  if (req.method != "GET") throw new Error("Method not allowed");

  const uid = req.cookies["bill_book_uid"] || false;

  if (!uid) throw new Error("Unauthorized Request");

  const userDocRef = userDocRefMaker(uid);

  const userDataSnap = await getDoc(userDocRef);

  if (!userDataSnap.exists() || !userDataSnap.data()) throw new Error("User data not found");

  const userData = userDataSnap.data() as User;

  const tokens = {
    accessToken: generateAccessToken(userData),
    refreshToken: generateRefreshToken(userData),
  }

  return reponseWithCookie(req, res, uid, {
    data: { ...userData, ...tokens },
    message: "User data fetched successfully",
  });
}

export default withCors(withErrorHandler(handler));

