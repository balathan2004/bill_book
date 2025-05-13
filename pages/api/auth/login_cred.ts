import { NextApiRequest, NextApiResponse } from "next";
import {
  AuthResponseConfig,
  dummyCred,
  UserDataInterface,
} from "@/components/utils/interfaces";
import { setCookie } from "cookies-next";
import { firestore } from "@/config";
import { getDoc, doc, setDoc } from "firebase/firestore";
export default async function (
  req: NextApiRequest,
  res: NextApiResponse<AuthResponseConfig>
) {
  if (req.method == "GET") {
    const uid = req.cookies["bill_book_uid"] || false;

    if (!uid) {
      res.json({
        message: "sucess",
        status: 200,
        credentials: dummyCred,
      });
      return;
    }

    const docRef = doc(firestore, "/users", uid);

    const docExits = await getDoc(docRef);

    if (!docExits.exists()) {
      res.json({
        message: "sucess",
        status: 200,
        credentials: dummyCred,
      });
      return;
    }

    const docData = docExits.data() as UserDataInterface;

    res.json({ message: "sucess", status: 200, credentials: docData });
  }
}
