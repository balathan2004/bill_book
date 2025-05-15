import { NextApiRequest, NextApiResponse } from "next";
import {
  AuthResponseConfig,
  UserDataInterface,
} from "@/components/utils/interfaces";
import { setCookie } from "cookies-next";
import { firestore } from "@/config";

// added
import { getDoc, doc, setDoc } from "firebase/firestore";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<AuthResponseConfig>
) {
  const data = req.body as UserDataInterface;
  const isSecure = process.env.NODE_ENV === "production";

  console.log(data);

  if (data.email && data.uid) {
    const docRef = doc(firestore, "/users", data.uid);

    const docExits = await getDoc(docRef);

    if (!docExits.exists()) {
      await setDoc(docRef, { ...data });

      setCookie("bill_book_uid", data.uid, {
        req,
        maxAge: 900000,
        httpOnly: true,
        sameSite: isSecure ? "none" : "lax",
        secure: isSecure,
      });

      res.json({ message: "sucess", status: 200, credentials: data });
      return;
    }

    const docData = docExits.data() as UserDataInterface;

    setCookie("bill_book_uid", docData.uid, {
      req,
      res,
      maxAge: 900000,
      httpOnly: true,
      sameSite: isSecure ? "none" : "lax",
      secure: isSecure,
    });

    res.json({ message: "sucess", status: 200, credentials: docData });
  }
}
