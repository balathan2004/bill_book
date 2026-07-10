import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "./interfaces";
const isDev = process.env.NODE_ENV == "production";
const reponseWithCookie = (
  req: NextApiRequest,
  res: NextApiResponse,
  uid: string,
  responseObject: {
    data?: User | string,
    message: string
  }

) => {

  setCookie("bill_book_token", uid, {
    req: req,
    res: res,
    maxAge: 2592000000,
    httpOnly: true,
    sameSite: isDev ? "none" : "lax",
    secure: isDev,
  });

  res.status(200).json({
    ...responseObject
  });
};


export default reponseWithCookie